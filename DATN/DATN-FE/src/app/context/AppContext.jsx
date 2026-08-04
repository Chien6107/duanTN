import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { api } from "../services/api";
import { settingService } from "../services/settingService";
import { getProductPricing } from "../utils/pricing";
import { normalizeVietnameseData, normalizeVietnameseText, repairVietnameseLocalStorage } from "../utils/vietnameseText";
import { isValidVietnamesePhone, PHONE_MESSAGE } from "../utils/phone";

// Chạy trước khi các trang con khởi tạo state từ localStorage.
if (typeof window !== "undefined") {
  repairVietnameseLocalStorage();
}

const AppContext = createContext(null);

// --- Mapper Functions to Bridge Backend DTOs with Frontend React Models ---

const mapCategory = (categoryName) => {
  if (!categoryName) return "phu-kien";
  const name = categoryName.toLowerCase();
  if (name.includes("áo khoác") || name.includes("blazer") || name.includes("jacket")) return "ao-khoac";
  if (name.includes("giày") || name.includes("dép") || name.includes("sneaker")) return "giay";
  if (name.includes("áo")) return "ao";
  if (name.includes("quần")) return "quan";
  if (name.includes("váy") || name.includes("đầm")) return "vay";
  if (name.includes("phụ kiện") || name.includes("túi") || name.includes("mũ") || name.includes("ví")) return "phu-kien";
  return "phu-kien";
};

const getSavedStatuses = () => {
  try {
    const saved = localStorage.getItem("foxstyle_product_statuses");
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    return {};
  }
};

const safeJsonParse = (str, fallback) => {
  if (!str) return fallback;
  try {
    return normalizeVietnameseData(JSON.parse(str));
  } catch (e) {
    console.warn("Lỗi parse JSON từ localStorage:", e);
    return fallback;
  }
};

const mapProductResponse = (p) => {
  const normalizedVariants = Array.from(new Map((p.variants || []).map((variant) => [
    variant.variantId || `${String(variant.color).trim().toLowerCase()}|${String(variant.size).trim().toLowerCase()}`,
    variant
  ])).values());
  const sizes = [...new Set(normalizedVariants.map((v) => v.size).filter(Boolean))];
  const colors = [...new Set(normalizedVariants.map((v) => v.color).filter(Boolean))];
  const quantity = normalizedVariants.length > 0
    ? normalizedVariants.reduce((sum, v) => sum + (v.quantity || 0), 0)
    : (p.quantity !== undefined && p.quantity !== null ? p.quantity : 50);

  const savedStatuses = getSavedStatuses();
  const id = p.productId || p.id;
  const status = savedStatuses[id] !== undefined ? savedStatuses[id] : (p.status !== undefined ? p.status : 1);

  const brandDefault = Number(id) % 4 === 1 ? "FoxStyle Premium" : Number(id) % 4 === 2 ? "Zara" : Number(id) % 4 === 3 ? "Uniqlo" : "Nike Wear";
  const brand = p.brand || p.brandName || brandDefault;

  const isCombo = p.isCombo || p.category === "combo" || (p.productName || p.name || "").includes("[SET COMBO]") || (p.description || "").includes("[COMBO:");
  const category = isCombo ? "combo" : mapCategory(p.categoryName || p.category);

  const pricing = getProductPricing(p);

  return {
    id: id,
    name: p.productName || p.name,
    price: pricing.price,
    originalPrice: pricing.originalPrice || undefined,
    flashSaleStartAt: p.flashSaleStartAt || null,
    flashSaleEndAt: p.flashSaleEndAt || null,
    image: p.imageUrl || p.image,
    categoryId: p.categoryId,
    category: category,
    isCombo: isCombo,
    comboProductIds: p.comboProductIds || [],
    comboGiftProductIds: p.comboGiftProductIds || [],
    brand: brand,
    rating: p.averageRating || p.rating || 5.0,
    reviews: Number(p.reviewCount ?? p.reviews ?? 0),
    description: p.description,
    sizes: sizes.length > 0 ? sizes : (p.sizes || ["S", "M", "L", "XL"]),
    colors: colors.length > 0 ? colors : (p.colors || ["Đen", "Trắng"]),
    material: p.material || "Cotton 100%",
    origin: p.origin || "Việt Nam",
    careInstructions: p.careInstructions || "",
    fitGuide: p.fitGuide || "",
    quantity: quantity,
    status: status,
    videoUrl: p.videoUrl || "",
    variants: normalizedVariants.map((v) => ({
      ...v,
      price: v.price || p.price
    })),
    images: p.images || []
  };


};

const mapUserResponse = (userResp) => {
  if (!userResp) return null;
  let role = "customer";
  if (userResp.roleName === "ROLE_ADMIN") role = "admin";
  else if (userResp.roleName === "ROLE_STAFF") role = "staff";

  return {
    id: userResp.userId,
    username: userResp.username,
    fullName: userResp.fullName,
    email: userResp.email,
    phone: userResp.phone,
    address: userResp.address || "",
    role: role,
    status: userResp.status
  };
};



const mapCartItemResponse = (item, availableProducts) => {
  const fullProduct = availableProducts.find((p) => p.id === item.productId) || {
    id: item.productId,
    name: item.productName,
    price: item.price,
    image: item.imageUrl,
  };

  const variant = fullProduct.variants?.find((v) => v.variantId === item.variantId);
  const variantPrice = (variant && variant.price) ? variant.price : fullProduct.price;

  const productWithVariantPrice = {
    ...fullProduct,
    price: variantPrice
  };

  return {
    cartDetailId: item.cartDetailId,
    variantId: item.variantId,
    product: productWithVariantPrice,
    size: item.size,
    color: item.color,
    quantity: item.quantity
  };
};

const mapOrderStatus = (statusVal) => {
  if (statusVal === 0 || statusVal === "0" || statusVal === "PENDING" || statusVal === "pending") return "pending";
  if (statusVal === 1 || statusVal === "1" || statusVal === "PROCESSING" || statusVal === "processing") return "processing";
  if (statusVal === 2 || statusVal === "2" || statusVal === "SHIPPING" || statusVal === "shipping") return "shipping";
  if (statusVal === 3 || statusVal === "3" || statusVal === "DELIVERED" || statusVal === "completed" || statusVal === "DELIVERING") return "completed";
  if (statusVal === 4 || statusVal === "4" || statusVal === "CANCELLED" || statusVal === "cancelled") return "cancelled";
  if (statusVal === 5 || statusVal === "5" || statusVal === "RETURNED" || statusVal === "returned") return "returned";
  if (statusVal === 6 || statusVal === "6" || statusVal === "RETURN_REQUESTED" || statusVal === "return_requested") return "return_requested";
  return "pending";
};

const mapOrderResponse = (o, availableProducts) => {
  const latestPayment = Array.isArray(o.payments) && o.payments.length > 0
    ? [...o.payments].sort((a, b) => Number(b.paymentId || 0) - Number(a.paymentId || 0))[0]
    : null;
  return {
    id: "DH" + o.orderId,
    orderIdDb: o.orderId,
    customerName: o.customerName,
    userId: o.userId,
    items: o.details ? o.details.map((d) => ({
      product: availableProducts.find((p) => p.id === d.productId) || {
        id: d.productId,
        name: d.productName,
        price: d.price,
        image: d.imageUrl
      },
      productId: d.productId,
      productName: d.productName,
      price: d.price,
      size: d.size,
      color: d.color,
      quantity: d.quantity
    })) : [],
    subtotal: o.totalAmount - (o.shippingFee || 0) - (o.taxAmount || 0) + (o.discountAmount || 0),
    shipping: o.shippingFee || 0,
    tax: o.taxAmount || 0,
    discount: o.discountAmount || 0,
    couponCode: o.couponCode,
    total: o.totalAmount,
    paymentId: latestPayment?.paymentId ?? null,
    paymentMethod: latestPayment?.paymentMethod?.toLowerCase() || "cod",
    paymentStatus: Number(latestPayment?.paymentStatus ?? 0),
    transactionId: latestPayment?.transactionId || "",
    isReconciled: Boolean(latestPayment?.reconciled),
    reconciliationCode: latestPayment?.reconciliationCode || "",
    reconciledAt: latestPayment?.reconciledAt || null,
    reconciledBy: latestPayment?.reconciledBy || "",
    isPaid: Boolean(o.payments && o.payments.some((payment) => Number(payment.paymentStatus) === 1)),
    status: mapOrderStatus(o.status),
    date: o.orderDate ? o.orderDate.replace("T", " ").slice(0, 16) : new Date().toISOString().replace("T", " ").slice(0, 16),
    phone: o.recipientPhone,
    address: o.shippingAddress,
    recipientName: o.recipientName,
    refundBankName: o.refundBankName || "",
    refundBankAccountNo: o.refundBankAccountNo || "",
    refundBankAccountName: o.refundBankAccountName || "",
    cancellationReason: o.cancellationReason || "",
    returnReason: o.returnReason || "",
    warrantyRedelivery: Boolean(o.warrantyRedelivery),
    deliveredAt: o.deliveredAt || null,
    shippingCarrier: o.shippingCarrier || "",
    trackingCode: o.trackingCode || "",
    dispatchedAt: o.dispatchedAt || null,
    note: ""
  };
};

const mapAddressResponse = (a) => {
  return {
    id: a.addressId,
    userId: a.userId,
    fullName: a.recipientName,
    phone: a.phone,
    detailAddress: a.detailAddress,
    district: a.district,
    ward: a.ward || "",
    city: a.province,
    isDefault: a.isDefault
  };
};

export function AppProvider({ children }) {
  // --- States ---
  const [currentUser, setCurrentUser] = useState(() => {
    if (!localStorage.getItem("foxstyle_token")) return null;
    return safeJsonParse(localStorage.getItem("foxstyle_current_user"), null);
  });
  const [restoringSession, setRestoringSession] = useState(!!localStorage.getItem("foxstyle_token"));

  useEffect(() => {
    if (currentUser && localStorage.getItem("foxstyle_token")) {
      localStorage.setItem("foxstyle_current_user", JSON.stringify(currentUser));
    }
  }, [currentUser]);
  const [products, setProducts] = useState([]);

  const [categories, setCategories] = useState([
    { id: "ao", name: "Áo Nam & Oversize", description: "Các loại áo thun basic, sơ mi lụa, polo và hoodie" },
    { id: "quan", name: "Quần Nam & Denim", description: "Quần jeans skinny, quần tây baggy, kaki túi hộp" },
    { id: "vay", name: "Đầm Váy & Nữ", description: "Các mẫu váy midi hoa nhí, đầm dạ hội xẻ tà quyến rũ" },
    { id: "ao-khoac", name: "Áo Khoác & Blazer", description: "Áo khoác bomber, blazer công sở, denim vintage" },
    { id: "giay", name: "Giày & Sneaker", description: "Sneakers thể thao trắng, giày tây da, sandal cao cấp" },
    { id: "phu-kien", name: "Phụ Kiện Thời Trang", description: "Mũ lưỡi trai, túi xách da, thắt lưng & kính mát" }
  ]);
  const [banners, setBanners] = useState([]);
  const [adminBanners, setAdminBanners] = useState([]);
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("foxstyle_guest_cart");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Đồng bộ giỏ hàng của khách (chưa đăng nhập) vào localStorage
  useEffect(() => {
    if (!currentUser && !localStorage.getItem("foxstyle_token")) {
      localStorage.setItem("foxstyle_guest_cart", JSON.stringify(cart));
      localStorage.setItem("foxstyle_guest_cart_updated_at", String(Date.now()));
    }
  }, [cart, currentUser]);

  // The cart API stores individual variants only. Preserve grouped combos per
  // account so refreshing data from the server does not make them disappear.
  useEffect(() => {
    if (!currentUser) return;
    const ownerKey = currentUser.id || currentUser.username;
    const groupedCombos = cart.filter(
      (item) => Array.isArray(item.product?.comboItems) && item.product.comboItems.length > 0
    );
    const storageKey = `foxstyle_combo_cart_${ownerKey}`;
    // Do not erase an existing value during session restoration, before the
    // server cart and saved combos have finished loading.
    if (groupedCombos.length > 0) localStorage.setItem(storageKey, JSON.stringify(groupedCombos));
  }, [cart, currentUser]);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistProductSnapshots, setWishlistProductSnapshots] = useState([]);
  const lastLoadedUserIdRef = useRef(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    const ownerKey = currentUser.id || currentUser.username;
    localStorage.setItem(`foxstyle_orders_${ownerKey}`, JSON.stringify(orders));
  }, [orders, currentUser]);
  const [addressBook, setAddressBook] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [users, setUsers] = useState([]); // Dành cho trang Admin quản lý user
  const [notifications, setNotifications] = useState([]);

  // --- UI & Modal States ---
  const [showLoginModal, setShowLoginModal] = useState(false);
  const openLoginModal = useCallback(() => setShowLoginModal(true), []);
  const closeLoginModal = useCallback(() => setShowLoginModal(false), []);

  // --- Translation Helper ---
  const t = useCallback((key, defaultValue) => {
    return defaultValue !== undefined ? defaultValue : key;
  }, []);

  // --- Theme State ---
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem("foxstyle_theme") || "light";
  });

  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme);
    const ownerKey = currentUser?.id || currentUser?.username || "guest";
    localStorage.setItem(`foxstyle_theme_${ownerKey}`, newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // --- Flash Sale State ---
  const [flashSaleConfig, setFlashSaleConfig] = useState(() => {
    const defaultConfig = {
      enabled: true,
      active: true,
      title: "FLASH SALE CUỐI TUẦN",
      subtitle: "ƯU ĐÃI CHỚP NHOÁNG",
      endTime: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      discountPercent: 30
    };
    const saved = localStorage.getItem("foxstyle_flashsale");
    if (saved) {
      const migratedConfig = { ...defaultConfig, ...safeJsonParse(saved, {}) };
      migratedConfig.discountPercent = Number(migratedConfig.discountPercent) || 30;
      localStorage.setItem("foxstyle_flashsale", JSON.stringify(migratedConfig));
      return migratedConfig;
    }
    try {
      localStorage.setItem("foxstyle_flashsale", JSON.stringify(defaultConfig));
    } catch (e) {}
    return defaultConfig;
  });

  const updateFlashSaleConfig = useCallback((newConfig) => {
    setFlashSaleConfig(newConfig);
    localStorage.setItem("foxstyle_flashsale", JSON.stringify(newConfig));
  }, []);

  // --- Chat Helper ---
  const deleteChat = useCallback((targetId) => {
    if (!targetId) return;
    const strTarget = String(targetId);
    setChats((prev) => {
      const filtered = prev.filter(
        (c) => String(c.customerId) !== strTarget && String(c.id) !== strTarget
      );
      try {
        localStorage.setItem("foxstyle_chats", JSON.stringify(filtered));
      } catch (e) {}
      return filtered;
    });
  }, []);


  // --- OTP Auth Helpers ---
  const sendOtp = useCallback(async (type, email, phone) => {
    try {
      const res = await api.auth.sendOtp(type, email, phone);
      return {
        ...res,
        success: res.status === "success",
        otpCode: res.data,
      };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, [currentUser]);

  useEffect(() => {
    const ownerKey = currentUser?.id || currentUser?.username || "guest";
    const savedTheme = localStorage.getItem(`foxstyle_theme_${ownerKey}`) || "light";
    setThemeState(savedTheme);
  }, [currentUser]);

  const verifyOtp = useCallback(async (type, email, phone, otp) => {
    try {
      const res = await api.auth.verifyOtp(type, email, phone, otp);
      return {
        ...res,
        success: res.status === "success",
      };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, []);

  const firebaseSuccess = useCallback(async (phone, otp) => {
    try {
      return await api.auth.firebaseSuccess(phone, otp);
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, []);

  // Load notifications specific to currently logged in user
  useEffect(() => {
    const userKey = currentUser ? `foxstyle_notifications_${currentUser.id}` : "foxstyle_notifications_guest";
    const saved = localStorage.getItem(userKey);
    if (saved) {
      setNotifications(safeJsonParse(saved, []));
    } else {
      setNotifications([
        {
          id: 1,
          title: "Chào mừng bạn đến với FoxStyle!",
          content: "Cảm ơn bạn đã lựa chọn cửa hàng của chúng tôi. Hãy bắt đầu mua sắm ngay nhé!",
          time: new Date().toISOString(),
          isRead: false,
          type: "success"
        }
      ]);
    }
  }, [currentUser]);

  // Save notifications specific to currently logged in user
  useEffect(() => {
    const userKey = currentUser ? `foxstyle_notifications_${currentUser.id}` : "foxstyle_notifications_guest";
    localStorage.setItem(userKey, JSON.stringify(notifications));
  }, [notifications, currentUser]);

  // Synchronize global/admin notifications
  useEffect(() => {
    let savedGlobal = localStorage.getItem("foxstyle_global_announcements");
    if (!savedGlobal || safeJsonParse(savedGlobal, []).length === 0) {
      const demoAnnouncements = [
        { id: "demo-ann-1", title: "Chào mừng đến với FoxStyle", content: "Khám phá bộ sưu tập mới và nhận ưu đãi dành riêng cho thành viên.", type: "success", time: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), isRead: false },
        { id: "demo-ann-2", title: "Miễn phí vận chuyển", content: "Miễn phí vận chuyển toàn quốc cho đơn hàng đạt giá trị quy định.", type: "info", time: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), isRead: false },
        { id: "demo-ann-3", title: "Khuyến mãi cuối tuần", content: "Sử dụng mã FOXSTYLE20 để nhận ưu đãi khi mua sắm cuối tuần.", type: "warning", time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), isRead: false },
        { id: "demo-ann-4", title: "Cập nhật chính sách đổi trả", content: "FoxStyle hỗ trợ đổi trả trong vòng 7 ngày khi sản phẩm còn nguyên tem nhãn.", type: "info", time: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), isRead: false },
        { id: "demo-ann-5", title: "Bảo trì thanh toán", content: "Kênh thanh toán trực tuyến sẽ được bảo trì từ 01:00 đến 02:00.", type: "error", time: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), isRead: false }
      ];
      savedGlobal = JSON.stringify(demoAnnouncements);
      localStorage.setItem("foxstyle_global_announcements", savedGlobal);
    }
    if (savedGlobal) {
      const announcements = safeJsonParse(savedGlobal, []);
      setNotifications((prev) => {
        const globalIds = new Set(announcements.map((ann) => String(ann.id)));
        const personalNotifications = prev.filter((item) => !globalIds.has(String(item.id)));
        const previousById = new Map(prev.map((item) => [String(item.id), item]));
        const synchronized = announcements.map((ann) => {
          const previous = previousById.get(String(ann.id));
          return previous && previous.time === ann.time
            ? previous
            : { ...previous, ...ann, isRead: false };
        });
        return [...synchronized, ...personalNotifications];
      });
    }
  }, [currentUser]);

  // Thêm thông báo nội bộ
  const addNotification = useCallback((title, content, type = "info", metadata = {}) => {
    const notification = {
        id: metadata.id || Date.now(),
        title,
        content,
        time: new Date().toISOString(),
        isRead: false,
        type,
        ...metadata
      };
    setNotifications((prev) => [
      notification,
      ...prev.filter((item) => String(item.id) !== String(notification.id))
    ]);
  }, []);

  // Thêm thông báo toàn hệ thống (Admin phát hành)
  const sendGlobalNotification = useCallback((title, content, type = "info") => {
    const savedGlobal = localStorage.getItem("foxstyle_global_announcements");
    const announcements = safeJsonParse(savedGlobal, []);
    const normalizedTitle = String(title).trim().toLocaleLowerCase("vi");
    const normalizedContent = String(content).trim().toLocaleLowerCase("vi");
    const existingIndex = announcements.findIndex((item) =>
      String(item.title).trim().toLocaleLowerCase("vi") === normalizedTitle
      && String(item.content).trim().toLocaleLowerCase("vi") === normalizedContent
    );
    const previous = existingIndex >= 0 ? announcements[existingIndex] : null;
    const newAnn = {
      id: previous?.id || Date.now(),
      title: String(title).trim(),
      content: String(content).trim(),
      time: new Date().toISOString(),
      isRead: false,
      type
    };

    const updatedAnnouncements = announcements.filter((_, index) => index !== existingIndex);
    updatedAnnouncements.unshift(newAnn);
    localStorage.setItem("foxstyle_global_announcements", JSON.stringify(updatedAnnouncements));
    void settingService
      .upsert("admin_data_foxstyle_global_announcements", JSON.stringify(updatedAnnouncements))
      .catch((error) => console.warn("Không thể đồng bộ thông báo toàn hệ thống:", error));

    setNotifications((prev) => [newAnn, ...prev.filter((item) => String(item.id) !== String(newAnn.id))]);
  }, []);

  // Đồng bộ thông báo chung từ database cho mọi tài khoản đang đăng nhập.
  // Trạng thái đã đọc vẫn được giữ riêng theo từng người dùng nếu thời gian gửi không đổi.
  useEffect(() => {
    if (!currentUser) return undefined;
    let disposed = false;

    const syncGlobalNotifications = async () => {
      try {
        const response = await settingService.getByKey("admin_data_foxstyle_global_announcements");
        const announcements = safeJsonParse(response?.data?.settingValue, []);
        if (disposed || !Array.isArray(announcements)) return;
        const serialized = JSON.stringify(announcements);
        if (localStorage.getItem("foxstyle_global_announcements") !== serialized) {
          localStorage.setItem("foxstyle_global_announcements", serialized);
        }
        setNotifications((prev) => {
          const globalIds = new Set(announcements.map((ann) => String(ann.id)));
          const personal = prev.filter((item) => !globalIds.has(String(item.id)));
          const previousById = new Map(prev.map((item) => [String(item.id), item]));
          const synchronized = announcements.map((ann) => {
            const previous = previousById.get(String(ann.id));
            return previous?.time === ann.time ? previous : { ...previous, ...ann, isRead: false };
          });
          return [...synchronized, ...personal];
        });
      } catch (error) {
        console.warn("Chưa thể tải thông báo đồng bộ:", error);
      }
    };

    syncGlobalNotifications();
    const intervalId = window.setInterval(syncGlobalNotifications, 15000);
    window.addEventListener("focus", syncGlobalNotifications);
    return () => {
      disposed = true;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", syncGlobalNotifications);
    };
  }, [currentUser]);

  const markNotificationAsRead = useCallback((id) => {
    setNotifications((prev) => {
      let markedOne = false;
      return prev.map((notification) => {
        const isTarget = String(notification.id) === String(id);
        if (!markedOne && isTarget && !notification.isRead) {
          markedOne = true;
          return { ...notification, isRead: true };
        }
        return notification;
      });
    });
  }, []);

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Helper to merge and deduplicate chats by customerId
  const mergeAndDeduplicateChats = (rawList) => {
    if (!Array.isArray(rawList)) return [];

    const map = new Map();

    for (const chat of rawList) {
      if (!chat || !chat.customerId) continue;
      const key = String(chat.customerId).toLowerCase();

      if (!map.has(key)) {
        map.set(key, {
          ...chat,
          customerId: chat.customerId,
          messages: Array.isArray(chat.messages) ? [...chat.messages] : []
        });
      } else {
        const existing = map.get(key);
        const combinedMsgs = [
          ...(Array.isArray(existing.messages) ? existing.messages : []),
          ...(Array.isArray(chat.messages) ? chat.messages : [])
        ];

        // Deduplicate messages by id or timestamp/content
        const msgMap = new Map();
        for (const m of combinedMsgs) {
          if (!m) continue;
          const msgKey = m.id || `${m.time}_${m.content}_${m.senderId}`;
          if (!msgMap.has(msgKey)) {
            msgMap.set(msgKey, m);
          }
        }

        const sortedMsgs = Array.from(msgMap.values()).sort(
          (a, b) => new Date(a.time || 0) - new Date(b.time || 0)
        );

        existing.messages = sortedMsgs;
        if (chat.lastUpdated && new Date(chat.lastUpdated) > new Date(existing.lastUpdated || 0)) {
          existing.lastUpdated = chat.lastUpdated;
          if (chat.lastMessage) existing.lastMessage = chat.lastMessage;
        }
        if (chat.customerName && (!existing.customerName || existing.customerName.includes("?"))) {
          existing.customerName = chat.customerName;
        }
      }
    }

    return Array.from(map.values());
  };

  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem("foxstyle_chats");
    let list = safeJsonParse(saved, []);

    // Purge legacy Shipper entries
    list = list.filter(c => {
      const name = (c?.customerName || "").toLowerCase();
      const id = String(c?.customerId || "").toLowerCase();
      return !name.includes("shipper") && !id.includes("shipper");
    }).map(c => ({
      ...c,
      messages: (c?.messages || []).map(m => {
        if ((m?.content || "").includes("Shipper")) {
          return {
            ...m,
            content: m.content.replace(/,?\s*Shipper/gi, "").replace(/thảo luận giữa.*giữa/gi, "thảo luận của")
          };
        }
        return m;
      })
    }));

    // Merge duplicate chats by String customerId
    list = mergeAndDeduplicateChats(list);

    // 1. Nhóm chung
    if (!list.some((c) => String(c.customerId) === "general_group")) {
      list.unshift({
        id: "chat_general_group",
        customerId: "general_group",
        customerName: "💬 Nhóm thông báo chung",
        messages: [
          {
            id: "msg_group_general_init",
            senderId: "system",
            senderName: "Hệ thống",
            senderRole: "system",
            content: "Chào mừng bạn đến với kênh trao đổi thông tin chung của hệ thống!",
            time: new Date().toISOString()
          }
        ],
        lastMessage: "Kênh trao đổi chung của hệ thống",
        lastUpdated: new Date().toISOString(),
        unreadCount: 0,
        isGroup: true
      });
    } else {
      const genGroup = list.find(c => String(c.customerId) === "general_group");
      if (genGroup) {
        genGroup.customerName = "💬 Nhóm thông báo chung";
        genGroup.lastMessage = "Kênh trao đổi chung của hệ thống";
        if (genGroup.messages && genGroup.messages.length > 0) {
          genGroup.messages[0].content = "Chào mừng bạn đến với kênh trao đổi thông tin chung của hệ thống!";
        }
      }
    }

    // 2. Nhóm nội bộ Staff & Admin
    if (!list.some((c) => String(c.customerId) === "staff_admin_group")) {
      list.unshift({
        id: "chat_staff_admin_group",
        customerId: "staff_admin_group",
        customerName: "🔒 Nhóm nội bộ (Nhân viên & Quản trị viên)",
        messages: [
          {
            id: "msg_group_init",
            senderId: "system",
            senderName: "Hệ thống",
            senderRole: "system",
            content: "Chào mừng bạn đến với nhóm chung thảo luận của Nhân viên và Quản trị viên!",
            time: new Date().toISOString()
          }
        ],
        lastMessage: "Kênh thảo luận nội bộ",
        lastUpdated: new Date().toISOString(),
        unreadCount: 0,
        isGroup: true
      });
    } else {
      const staffGroup = list.find(c => String(c.customerId) === "staff_admin_group");
      if (staffGroup) {
        staffGroup.customerName = "🔒 Nhóm nội bộ (Nhân viên & Quản trị viên)";
        staffGroup.lastMessage = "Kênh thảo luận nội bộ";
        if (staffGroup.messages && staffGroup.messages.length > 0) {
          staffGroup.messages[0].content = "Chào mừng bạn đến với nhóm chung thảo luận của Nhân viên và Quản trị viên!";
        }
      }
    }

    try {
      localStorage.setItem("foxstyle_chats", JSON.stringify(list));
    } catch (e) {}
    return list;
  });

  const notifiedChatMessageIdsRef = useRef(new Set());

  const loadPersistentChats = useCallback(async () => {
    if (!currentUser) return;
    try {
      let rows = [];
      if (currentUser.role === "admin" || currentUser.role === "staff") {
        const response = await api.chats.getAll();
        rows = response?.data || [];
      } else {
        const responses = await Promise.all([
          api.chats.getChannel(currentUser.id).catch(() => null),
          api.chats.getChannel("general_group").catch(() => null)
        ]);
        rows = responses.flatMap((response) => response?.data || []);
      }
      if (!Array.isArray(rows)) return;

      const grouped = new Map();
      rows.forEach((row) => {
        const channelId = String(row.channelId);
        const canonicalGroupName = channelId === "staff_admin_group"
          ? "🔒 Nhóm nội bộ (Nhân viên & Quản trị viên)"
          : channelId === "general_group"
            ? "💬 Nhóm thông báo chung"
            : null;
        if (!grouped.has(channelId)) {
          grouped.set(channelId, {
            id: `chat_db_${channelId}`,
            customerId: row.channelId,
            customerName: canonicalGroupName || row.customerName || "Khách hàng",
            messages: [],
            unreadCount: 0,
            isGroup: ["general_group", "staff_admin_group"].includes(channelId)
          });
        }
        const chat = grouped.get(channelId);
        chat.customerName = canonicalGroupName || row.customerName || chat.customerName;
        chat.messages.push({
          id: `db_${row.messageId}`,
          senderId: row.senderId,
          senderName: row.senderName,
          senderRole: row.senderRole,
          content: row.content,
          time: row.sentAt
        });
        chat.lastMessage = row.content;
        chat.lastUpdated = row.sentAt;
      });

      setChats((current) => {
        const persisted = Array.from(grouped.values()).map((chat) => {
          const existing = current.find((item) => String(item.customerId) === String(chat.customerId));
          if (!existing) return { ...chat, unreadCount: 0 };
          const existingMessageIds = new Set(
            (existing.messages || []).map((message) => String(message.id).replace(/^db_/, ""))
          );
          const newIncomingMessages = (chat.messages || []).filter((message) => {
            const rawId = String(message.id).replace(/^db_/, "");
            const isInternalChannel = ["general_group", "staff_admin_group"].includes(String(chat.customerId));
            const isIncoming = isInternalChannel
              ? String(message.senderId) !== String(currentUser?.id)
              : message.senderRole === "customer";
            return (
              !existingMessageIds.has(rawId) &&
              isIncoming
            );
          });
          newIncomingMessages.forEach((message) => {
            const notificationId = `chat_${String(message.id).replace(/^db_/, "")}`;
            if (notifiedChatMessageIdsRef.current.has(notificationId)) return;
            notifiedChatMessageIdsRef.current.add(notificationId);
            queueMicrotask(() =>
              addNotification(
                `Tin nhắn mới từ ${message.senderName || chat.customerName || "khách hàng"}`,
                message.content || "Bạn có một tin nhắn mới.",
                "message",
                {
                  id: notificationId,
                  actionUrl: `/admin/chats?channel=${encodeURIComponent(chat.customerId)}`,
                  chatId: chat.customerId
                }
              )
            );
          });
          return {
            ...chat,
            unreadCount: (existing.unreadCount || 0) + newIncomingMessages.length
          };
        });
        const databaseChannels = new Set(persisted.map((chat) => String(chat.customerId)));
        const localChannels = current.filter((chat) => !databaseChannels.has(String(chat.customerId)));
        return [...persisted, ...localChannels].sort(
          (a, b) => new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0)
        );
      });
    } catch (error) {
      console.warn("Không thể đồng bộ tin nhắn từ máy chủ:", error);
    }
  }, [currentUser, addNotification]);

  const markChatAsRead = useCallback((customerId) => {
    setChats((current) =>
      current.map((chat) =>
        String(chat.customerId) === String(customerId)
          ? { ...chat, unreadCount: Math.max(0, Number(chat.unreadCount || 0) - 1) }
          : chat
      )
    );
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    loadPersistentChats();
    const intervalId = window.setInterval(loadPersistentChats, 4000);
    return () => window.clearInterval(intervalId);
  }, [currentUser, loadPersistentChats]);

  const [isAutoReplyEnabled, setIsAutoReplyEnabled] = useState(() => {
    const saved = localStorage.getItem("foxstyle_auto_reply");
    return safeJsonParse(saved, true);
  });

  useEffect(() => {
    try {
      localStorage.setItem("foxstyle_auto_reply", JSON.stringify(isAutoReplyEnabled));
    } catch (e) {}
  }, [isAutoReplyEnabled]);

  // Sync chats to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("foxstyle_chats", JSON.stringify(chats));
    } catch (e) {}
  }, [chats]);

  const simulateStaffReply = useCallback((customerId, customerName) => {
    const replies = [
      "Chào bạn! Cảm ơn bạn đã nhắn tin cho FoxStyle. Chúng tôi sẽ phản hồi bạn trong giây lát.",
      "Dạ FoxStyle xin chào! Bạn cần tư vấn về sản phẩm hay đơn hàng nào ạ?",
      "Cảm ơn bạn đã liên hệ. Đội ngũ CSkhách hàng đang kiểm tra tin nhắn và hỗ trợ bạn ngay đây ạ!",
      "Chào bạn, bạn vui lòng để lại số điện thoại hoặc mã đơn hàng nếu có để shop tiện tra cứu thông tin nhé ạ."
    ];
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    
    setTimeout(() => {
      const replyMsg = {
        id: "msg_reply_" + Date.now(),
        senderId: "staff",
        senderName: "Nhân viên hỗ trợ",
        senderRole: "staff",
        content: randomReply,
        time: new Date().toISOString()
      };
      
      setChats((prevChats) => {
        const targetId = String(customerId);
        const existingIdx = prevChats.findIndex((c) => String(c.customerId) === targetId);
        if (existingIdx > -1) {
          const updated = [...prevChats];
          const chat = { ...updated[existingIdx] };
          const lastMsg = chat.messages ? chat.messages[chat.messages.length - 1] : null;
          if (lastMsg && lastMsg.senderRole === "customer") {
            chat.messages = [...(chat.messages || []), replyMsg];
            chat.lastMessage = randomReply;
            chat.lastUpdated = new Date().toISOString();
            updated[existingIdx] = chat;
          }
          return updated;
        }
        return prevChats;
      });
    }, 1500);
  }, []);

  const sendMessage = useCallback((customerId, customerName, senderRole, senderName, content) => {
    const normalizedCustomerName = normalizeVietnameseText(customerName || "Khách hàng");
    const normalizedSenderName = normalizeVietnameseText(senderName || "Khách hàng");
    const normalizedContent = normalizeVietnameseText(content || "");
    const message = {
      id: "msg_" + Date.now(),
      senderId: senderRole === "customer" ? customerId : (currentUser ? currentUser.id : senderRole),
      senderName: normalizedSenderName,
      senderRole,
      content: normalizedContent,
      time: new Date().toISOString()
    };

    setChats((prevChats) => {
      const targetId = String(customerId);
      const existingIdx = prevChats.findIndex((c) => String(c.customerId) === targetId);
      if (existingIdx > -1) {
        const updated = [...prevChats];
        const chat = { ...updated[existingIdx] };
        chat.messages = [...(chat.messages || []), message];
        chat.lastMessage = normalizedContent;
        chat.lastUpdated = new Date().toISOString();
        if (senderRole === "customer") {
          chat.unreadCount = (chat.unreadCount || 0) + 1;
        } else {
          chat.unreadCount = 0; // Read by staff/admin
        }
        updated.splice(existingIdx, 1);
        return [chat, ...updated];
      } else {
        return [
          {
            id: "chat_" + Date.now(),
            customerId,
            customerName: normalizedCustomerName,
            lastMessage: normalizedContent,
            lastUpdated: new Date().toISOString(),
            unreadCount: senderRole === "customer" ? 1 : 0,
            messages: [message]
          },
          ...prevChats
        ];
      }
    });

    api.chats.send({
      channelId: String(customerId),
      customerName: normalizedCustomerName,
      senderName: normalizedSenderName,
      content: normalizedContent
    }).then(() => {
      if (currentUser) loadPersistentChats();
    }).catch((error) => {
      console.warn("Tin nhắn chưa thể đồng bộ lên máy chủ:", error);
    });

    if (String(customerId) !== "staff_admin_group" && String(customerId) !== "general_group" && senderRole === "customer" && isAutoReplyEnabled) {
      simulateStaffReply(customerId, customerName);
    }
  }, [simulateStaffReply, isAutoReplyEnabled, currentUser, loadPersistentChats]);

  const startNewCustomerChat = useCallback((customerId, customerName) => {


    setChats((prevChats) => {
      const targetId = String(customerId);
      const exists = prevChats.some((c) => String(c.customerId) === targetId);
      if (exists) return prevChats;

      const newChat = {
        id: "chat_" + customerId + "_" + Date.now(),
        customerId,
        customerName: customerName || "Khách hàng",
        messages: [
          {
            id: "msg_init_" + Date.now(),
            senderId: "system",
            senderName: "Hệ thống",
            senderRole: "system",
            content: `Cuộc hội thoại hỗ trợ mới với khách hàng ${customerName}.`,
            time: new Date().toISOString()
          }
        ],
        lastMessage: "Bắt đầu cuộc trò chuyện",
        lastUpdated: new Date().toISOString(),
        unreadCount: 0
      };

      return [newChat, ...prevChats]; // Prepend new chat to top of list
    });
  }, []);


  // --- Sync Guest Cart Items to DB on Login ---
  const syncGuestCartToBackend = useCallback(async (currentProducts) => {
    try {
      const savedGuestCartStr = localStorage.getItem("foxstyle_guest_cart");
      if (!savedGuestCartStr) return;
      const guestItems = JSON.parse(savedGuestCartStr);
      if (!Array.isArray(guestItems) || guestItems.length === 0) return;

      const prods = currentProducts || products;
      for (const item of guestItems) {
        let variantId = item.variantId;
        if (!variantId && item.product) {
          const fullProd = prods.find((p) => p.id === item.product.id) || item.product;
          let variant = fullProd.variants?.find(
            (v) => String(v.size) === String(item.size) && String(v.color).toLowerCase() === String(item.color).toLowerCase()
          ) || fullProd.variants?.find(
            (v) => String(v.size) === String(item.size) || String(v.color).toLowerCase() === String(item.color).toLowerCase()
          ) || (fullProd.variants && fullProd.variants[0]);

          if (variant) {
            variantId = variant.variantId;
          }
        }

        if (variantId) {
          try {
            await api.cart.addItem(variantId, item.quantity);
          } catch (e) {
            console.warn("Lỗi sync guest cart item:", item, e);
          }
        }
      }
      localStorage.removeItem("foxstyle_guest_cart");
    } catch (err) {
      console.error("Lỗi khi đồng bộ giỏ hàng khách:", err);
    }
  }, [products]);

  // --- Load User Private Data ---
  const loadUserData = useCallback(async (currentProducts, roleOverride, userOverride) => {
    const token = localStorage.getItem("foxstyle_token");
    if (!token) return;

    try {
      // 0. Đồng bộ giỏ hàng khách (nếu có) vào DB của user vừa đăng nhập
      await syncGuestCartToBackend(currentProducts);

      // 1. Tải giỏ hàng
      const cartRes = await api.cart.get();
      if (cartRes.status === "success" && cartRes.data) {
        const mappedItems = cartRes.data.items.map((item) =>
          mapCartItemResponse(item, currentProducts || products)
        );
        const activeUserForCart = userOverride || currentUser;
        const ownerKey = activeUserForCart?.id || activeUserForCart?.username;
        let savedCombos = [];
        if (ownerKey) {
          try {
            const raw = localStorage.getItem(`foxstyle_combo_cart_${ownerKey}`);
            const parsed = raw ? JSON.parse(raw) : [];
            savedCombos = Array.isArray(parsed) ? parsed.filter(
              (item) => Array.isArray(item.product?.comboItems) && item.product.comboItems.length > 0
            ) : [];
          } catch (error) {
            console.warn("Khong the khoi phuc combo trong gio hang:", error);
          }
        }
        setCart([...mappedItems, ...savedCombos]);
      }

      // Xác định vai trò để tải đơn hàng tương ứng
      const activeUser = userOverride || currentUser;
      let role = roleOverride || (activeUser ? activeUser.role : null);
      if (!role) {
        try {
          const profileRes = await api.auth.getProfile();
          if (profileRes.status === "success" && profileRes.data) {
            const mappedUser = mapUserResponse(profileRes.data);
            role = mappedUser.role;
          }
        } catch (e) {}
      }

      // 2. Tải lịch sử đơn hàng (Nếu Admin/Staff thì tải toàn bộ của hệ thống)
      let ordersRes;
      if (role === "admin" || role === "staff") {
        ordersRes = await api.orders.getAllAdmin();
      } else {
        ordersRes = await api.orders.getMyOrders();
      }

      if (ordersRes && ordersRes.status === "success" && ordersRes.data) {
        const rawOrders = ordersRes.data.content || ordersRes.data;
        const mappedOrders = Array.isArray(rawOrders)
          ? rawOrders
              .map((o) => mapOrderResponse(o, currentProducts || products))
              .filter((order) => {
                const isPayOSOrder = ["transfer", "bank_transfer", "payos"].includes(
                  order.paymentMethod
                );
                return !isPayOSOrder || order.isPaid;
              })
          : [];

        const ownerKey = activeUser?.id || activeUser?.username;
        const localSavedStr = ownerKey
          ? localStorage.getItem(`foxstyle_orders_${ownerKey}`)
          : null;
        const localOrders = safeJsonParse(localSavedStr, []);

        const mergedOrders = [...mappedOrders];
        // Màn hình quản trị chỉ dùng dữ liệu API/SQL, không trộn bản sao
        // localStorage vì có thể tạo đơn ảo hoặc trạng thái cũ.
        if (role !== "admin" && role !== "staff") {
          localOrders.forEach(loc => {
            const belongsToUser = String(loc.userId) === String(activeUser?.id);
            if (belongsToUser && !mergedOrders.some(m => String(m.id) === String(loc.id))) {
              mergedOrders.push(loc);
            }
          });
        }
        setOrders(mergedOrders);
      }

      // 3. Tải sổ địa chỉ
      const addressRes = await api.addresses.getAll();
      if (addressRes.status === "success" && addressRes.data) {
        const mappedAddresses = addressRes.data.map(addr => ({
          ...mapAddressResponse(addr),
          userId: activeUser?.id
        }));
        setAddressBook(mappedAddresses);
        if (activeUser) {
          const ownerKey = activeUser.id || activeUser.username;
          localStorage.setItem(`foxstyle_address_book_${ownerKey}`, JSON.stringify(mappedAddresses));
        }
      }
    } catch (err) {
      console.error("Lỗi khi tải thông tin cá nhân từ Database:", err);
    }
  }, [products, currentUser]);

  // --- Load Public Catalog Data ---
  const loadCatalogData = useCallback(async () => {
    try {
      const token = localStorage.getItem("foxstyle_token");

      // Khởi chạy song song tất cả các request để giảm tối đa độ trễ
      const promises = [
        api.products.getAll({ size: 10000 }).catch(e => { console.warn("Lỗi tải sản phẩm:", e); return null; }),
        api.categories.getAll({ size: 100 }).catch(e => { console.warn("Lỗi tải danh mục:", e); return null; }),
        api.banners.getAllActive().catch(e => { console.warn("Lỗi tải banner:", e); return null; })
      ];

      let profilePromise = null;
      if (token) {
        profilePromise = api.auth.getProfile().catch(e => {
          console.warn("Lỗi tải profile hoặc token hết hạn:", e);
          // Chỉ xóa phiên khi server xác nhận token không còn hợp lệ.
          // Lỗi mạng hoặc backend khởi động chậm không được làm người dùng đăng xuất.
          if (e?.status === 401 || e?.status === 403) {
            localStorage.removeItem("foxstyle_token");
            localStorage.removeItem("foxstyle_current_user");
            setCurrentUser(null);
          }
          return null;
        });
      }

      const [prodRes, catRes, bannerRes, profileRes] = await Promise.all([
        ...promises,
        profilePromise
      ]);

      // Xử lý dữ liệu sản phẩm
      let activeProducts = [];
      if (prodRes && prodRes.status === "success" && prodRes.data && prodRes.data.content) {
        activeProducts = prodRes.data.content.map(mapProductResponse);
      }


      setProducts(activeProducts);

      // Xử lý dữ liệu danh mục
      if (catRes && catRes.status === "success" && catRes.data) {
        const rawCats = catRes.data.content || (Array.isArray(catRes.data) ? catRes.data : []);
        const mappedCats = rawCats.map(c => ({
          id: c.categoryId,
          name: c.categoryName,
          description: c.description,
          status: c.status
        }));
        setCategories(mappedCats);
      }

      // Xử lý dữ liệu banner
      if (bannerRes && bannerRes.status === "success" && bannerRes.data) {
        setBanners(bannerRes.data);
      }

      // Xử lý thông tin đăng nhập
      if (profileRes && profileRes.status === "success" && profileRes.data) {
        const baseUser = mapUserResponse(profileRes.data);
        const ownerKey = baseUser.username;
        const privateProfile = safeJsonParse(localStorage.getItem(`foxstyle_profile_${ownerKey}`), {});
        const mappedUser = { ...baseUser, ...privateProfile };
        setCurrentUser(mappedUser);
        await loadUserData(activeProducts, mappedUser.role, mappedUser);

        if (mappedUser.role === "admin") {
          try {
            const [usersRes, couponsRes, fullBannersRes] = await Promise.all([
              api.users.getAll().catch(() => null),
              api.coupons.getAllAdmin().catch(() => null),
              api.banners.getAllAdmin().catch(() => null)
            ]);

            if (usersRes && usersRes.status === "success" && usersRes.data) {
              setUsers(usersRes.data.content.map(mapUserResponse));
            }
            if (couponsRes && couponsRes.status === "success" && couponsRes.data) {
              setCoupons(couponsRes.data.content);
            }
            if (fullBannersRes && fullBannersRes.status === "success" && fullBannersRes.data && fullBannersRes.data.content) {
              setAdminBanners(fullBannersRes.data.content);
            }
          } catch (e) {
            console.warn("Lỗi tải thông tin admin:", e);
          }
        }
      }
    } catch (err) {
      console.error("Lỗi tổng quát khi tải catalog:", err);
    } finally {
      setRestoringSession(false);
    }
  }, [loadUserData]);

  useEffect(() => {
    loadCatalogData();
  }, []);

  useEffect(() => {
    if (currentUser?.role !== "admin" && currentUser?.role !== "staff") return;
    const intervalId = window.setInterval(() => {
      loadCatalogData();
    }, 15000);
    return () => window.clearInterval(intervalId);
  }, [currentUser?.role, loadCatalogData]);

  // --- Sync local wishlist ---
  useEffect(() => {
    const userId = currentUser ? currentUser.id : "guest";
    
    // Load from localStorage if the user has changed
    if (lastLoadedUserIdRef.current !== userId) {
      const saved = localStorage.getItem(`foxstyle_wishlist_${userId}`);
      const savedProducts = localStorage.getItem(`foxstyle_wishlist_products_${userId}`);
      const initialList = saved ? JSON.parse(saved) : [];
      const initialProducts = savedProducts ? JSON.parse(savedProducts) : [];
      setWishlist(initialList);
      setWishlistProductSnapshots(Array.isArray(initialProducts) ? initialProducts : []);
      lastLoadedUserIdRef.current = userId;
    } else {
      // Save to localStorage ONLY if the state changed for the SAME user (prevents overwrite on initial load!)
      localStorage.setItem(`foxstyle_wishlist_${userId}`, JSON.stringify(wishlist));
      localStorage.setItem(`foxstyle_wishlist_products_${userId}`, JSON.stringify(wishlistProductSnapshots));
    }
  }, [wishlist, wishlistProductSnapshots, currentUser]);

  // Database is the source of truth for signed-in users, so favorites follow the account across devices.
  useEffect(() => {
    if (!currentUser?.id) return;
    let active = true;
    api.wishlist.getAll().then((response) => {
      if (!active || response?.status !== "success") return;
      const rows = response.data?.content || response.data || [];
      if (!Array.isArray(rows)) return;
      setWishlist(rows.map((row) => String(row.productId)));
      setWishlistProductSnapshots(rows.map((row) => ({
        id: row.productId,
        name: row.productName,
        price: Number(row.price || 0),
        originalPrice: Number(row.originalPrice || row.price || 0),
        image: row.imageUrl,
        imageUrl: row.imageUrl
      })));
    }).catch((error) => console.warn("Không thể đồng bộ danh sách yêu thích:", error));
    return () => { active = false; };
  }, [currentUser?.id]);

  // --- Auth Functions ---
  const login = async (username, password) => {
    try {
      const res = await api.auth.login(username, password);
      if (res.status === "success" && res.data) {
        const { accessToken, user } = res.data;
        localStorage.setItem("foxstyle_token", accessToken);
        const baseUser = mapUserResponse(user);
        const ownerKey = baseUser.username;
        const privateProfile = safeJsonParse(localStorage.getItem(`foxstyle_profile_${ownerKey}`), {});
        const mappedUser = { ...baseUser, ...privateProfile };
        setCart([]);
        setOrders([]);
        setAddressBook([]);
        setWishlist([]);
        setWishlistProductSnapshots([]);
        setNotifications([]);
        setCurrentUser(mappedUser);

        // Tải lại dữ liệu người dùng ngay lập tức
        await loadUserData(products, mappedUser.role, mappedUser);

        // Nếu là Admin thì tải thêm danh sách người dùng, coupons để quản lý
        if (mappedUser.role === "admin") {
          try {
            const usersRes = await api.users.getAll();
            if (usersRes.status === "success" && usersRes.data) {
              setUsers(usersRes.data.content.map(mapUserResponse));
            }
          } catch (e) {
            console.warn("Failed to load users for admin during login:", e);
          }
          try {
            const couponsRes = await api.coupons.getAllAdmin();
            if (couponsRes.status === "success" && couponsRes.data) {
              setCoupons(couponsRes.data.content);
            }
          } catch (e) {
            console.warn("Failed to load coupons for admin during login:", e);
          }
        }

        return { success: true, user: mappedUser };
      }
      return { success: false, message: res.message || "Đăng nhập thất bại!" };
    } catch (err) {
      return { success: false, message: err.message || "Tài khoản hoặc mật khẩu không chính xác!" };
    }
  };

  const loginWithGoogle = async (idToken) => {
    try {
      const res = await api.auth.googleLogin(idToken);
      if (res.status === "success" && res.data) {
        const { accessToken, user } = res.data;
        localStorage.setItem("foxstyle_token", accessToken);
        const baseUser = mapUserResponse(user);
        const ownerKey = baseUser.username;
        const privateProfile = safeJsonParse(localStorage.getItem(`foxstyle_profile_${ownerKey}`), {});
        const mappedUser = { ...baseUser, ...privateProfile };
        setCart([]);
        setOrders([]);
        setAddressBook([]);
        setWishlist([]);
        setWishlistProductSnapshots([]);
        setNotifications([]);
        setCurrentUser(mappedUser);
        await loadUserData(products, mappedUser.role, mappedUser);
        return { success: true, user: mappedUser };
      }
      return { success: false, message: res.message || "Đăng nhập Google thất bại!" };
    } catch (err) {
      return { success: false, message: err.message || "Xác thực tài khoản Google thất bại!" };
    }
  };

  const register = async (username, password, fullName, email, phone, otp) => {
    if (!isValidVietnamesePhone(phone)) return { success: false, message: PHONE_MESSAGE };
    try {
      const res = await api.auth.register(username, password, fullName, email, phone, otp);
      if (res.status === "success") {
        return { success: true, message: "Đăng ký tài khoản thành công!" };
      }
      return { success: false, message: res.message || "Đăng ký thất bại!" };
    } catch (err) {
      return { success: false, message: err.message || "Đăng ký tài khoản thất bại!" };
    }
  };

  const findAccount = async (keyword) => {
    try {
      const res = await api.auth.findAccount(keyword);
      if (res.status === "success" && res.data) {
        return { success: true, data: res.data, message: res.message };
      }
      return { success: false, message: res.message || "Không tìm thấy tài khoản!" };
    } catch (err) {
      return { success: false, message: err.message || "Không tìm thấy tài khoản tương ứng!" };
    }
  };

  const sendForgotPasswordOtp = async (email) => {

    try {
      const res = await api.auth.sendForgotPasswordOtp(email);
      if (res.status === "success") {
        return { success: true, message: res.message || "Đã gửi mã OTP khôi phục mật khẩu!", otpCode: res.data };
      }
      return { success: false, message: res.message || "Gửi mã OTP thất bại!" };
    } catch (err) {
      return { success: false, message: err.message || "Gửi mã OTP thất bại!" };
    }
  };

  const resetPassword = async (email, otp, newPassword) => {
    try {
      const res = await api.auth.resetPassword(email, otp, newPassword);
      if (res.status === "success") {
        return { success: true, message: res.message || "Đặt lại mật khẩu thành công!" };
      }
      return { success: false, message: res.message || "Đặt lại mật khẩu thất bại!" };
    } catch (err) {
      return { success: false, message: err.message || "Đặt lại mật khẩu thất bại!" };
    }
  };

  const logout = () => {
    localStorage.removeItem("foxstyle_token");
    localStorage.removeItem("foxstyle_current_user");
    localStorage.removeItem("foxstyle_guest_cart");
    setCurrentUser(null);
    setCart([]);
    setOrders([]);
    setAddressBook([]);
    setWishlist([]);
    setWishlistProductSnapshots([]);
    setNotifications([]);
    setUsers([]);
  };

  const updateUserStatus = async (userId, status) => {
    try {
      const res = await api.users.updateStatus(userId, status);
      if (res.status === "success") {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, status } : u))
        );
        if (currentUser && currentUser.id === userId && status !== 1) {
          logout();
        }
        return { success: true };
      }
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái user:", err);
    }
    return { success: false };
  };

  const deleteUser = async (userId) => {
    try {
      const res = await api.users.delete(userId);
      if (res.status === "success" || res.code === 200) {
        setUsers((prev) => prev.filter((u) => u.id !== userId));
        return { success: true };
      }
    } catch (err) {
      console.error("Lỗi xóa người dùng:", err);
    }
    return { success: false };
  };

  const createStaffUser = async (userData) => {
    try {
      const res = await api.users.create(userData);
      if (res.status === "success" && res.data) {
        const mapped = mapUserResponse(res.data);
        setUsers((prev) => [...prev, mapped]);
        return { success: true, user: mapped };
      }
      return { success: false, message: res.message || "Tạo tài khoản thất bại!" };
    } catch (err) {
      console.error("Lỗi tạo nhân viên:", err);
      return { success: false, message: err.message || "Tạo nhân viên thất bại!" };
    }
  };

  const updateStaffPassword = async (staffId, citizenId, newPassword) => {
    try {
      const staffUser = users.find((u) => String(u.id) === String(staffId));
      if (!staffUser) {
        return { success: false, message: "Không tìm thấy thông tin nhân viên!" };
      }

      const res = await api.users.resetStaffPassword(staffId, citizenId, newPassword);
      if (res.status === "success" || res.data || res) {
        return { success: true, message: "Reset mật khẩu nhân viên thành công!" };
      }
      return { success: false, message: res.message || "Reset mật khẩu thất bại!" };
    } catch (err) {
      console.warn("API reset mật khẩu nhân viên lỗi:", err);
      return { success: false, message: err.message || "CCCD không khớp hoặc không thể reset mật khẩu!" };
    }
  };


  const updateProfile = async (fullName, email, phone, extraProfile = {}) => {
    // Để phục vụ cập nhật profile nhanh, ghi nhận cục bộ
    if (!currentUser) return;
    if (!isValidVietnamesePhone(phone)) throw new Error(PHONE_MESSAGE);
    const updated = { ...currentUser, fullName, email, phone, ...extraProfile };
    setCurrentUser(updated);
    const profileKey = `foxstyle_profile_${currentUser.username}`;
    localStorage.setItem(profileKey, JSON.stringify({
      fullName,
      email,
      phone,
      ...extraProfile,
    }));
  };

  const deactivateAccount = async () => {
    if (!currentUser) return { success: false, message: "Vui lòng đăng nhập!" };
    try {
      const res = await api.auth.deactivate();
      if (res.status === "success" || res) {
        // Đăng xuất và xóa session
        localStorage.removeItem("foxstyle_token");
        setCurrentUser(null);
        setCart([]);
        setOrders([]);
        setAddressBook([]);
        return { success: true };
      }
      return { success: false, message: res.message || "Lỗi không xác định" };
    } catch (e) {
      console.error("Lỗi khóa tài khoản:", e);
      return { success: false, message: e.message };
    }
  };

  const deleteMyAccount = async () => {
    if (!currentUser) return { success: false, message: "Vui lòng đăng nhập!" };
    try {
      const res = await api.auth.deleteAccount();
      if (res.status === "success" || res) {
        // Đăng xuất và xóa session
        localStorage.removeItem("foxstyle_token");
        setCurrentUser(null);
        setCart([]);
        setOrders([]);
        setAddressBook([]);
        return { success: true };
      }
      return { success: false, message: res.message || "Lỗi không xác định" };
    } catch (e) {
      console.error("Lỗi xóa tài khoản:", e);
      return { success: false, message: e.message };
    }
  };

  // --- Cart Functions (Hybrid: Syncs with DB if logged in, falls back to Memory) ---
  const addToCart = async (product, size, color, quantity = 1, customPrice = null) => {
    const finalPrice = customPrice !== null ? customPrice : product.price;
    const productToAdd = { ...product, price: finalPrice };
    const safeColor = color || (product.colors && product.colors[0]) || "Mặc định";
    const safeSize = size || (product.sizes && product.sizes[0]) || "M";

    let addedSuccessfully = false;
    const isGroupedCombo = Array.isArray(product.comboItems) && product.comboItems.length > 0;
    const selectedVariant = product.variants?.find(
      (variant) => String(variant.size) === String(safeSize) &&
        String(variant.color).toLowerCase() === String(safeColor).toLowerCase()
    );
    const availableStock = Number(selectedVariant?.quantity ?? product.quantity ?? 0);
    const quantityToAdd = Number(quantity);
    const quantityAlreadyInCart = cart
      .filter((item) => String(item.product?.id || item.productId) === String(product.id) &&
        String(item.size || "") === String(safeSize) &&
        String(item.color || "").toLowerCase() === String(safeColor).toLowerCase())
      .reduce((total, item) => total + Number(item.quantity || 0), 0);

    if (!Number.isInteger(quantityToAdd) || quantityToAdd <= 0) {
      throw new Error("Số lượng mua phải là số nguyên lớn hơn 0.");
    }
    if (!isGroupedCombo && quantityAlreadyInCart + quantityToAdd > availableStock) {
      throw new Error(`Sản phẩm màu ${safeColor}, size ${safeSize} chỉ còn ${availableStock} sản phẩm trong kho.`);
    }

    if (isGroupedCombo) {
      const invalidComponent = product.comboItems.some((item) => !Number.isInteger(Number(item.variantId)));
      if (!Number.isInteger(Number(product.id)) || invalidComponent) {
        throw new Error("Combo chưa có đủ sản phẩm hoặc biến thể hợp lệ. Vui lòng tải lại trang và chọn lại combo.");
      }
    }

    if (currentUser && !isGroupedCombo) {
      let targetVariantId = null;
      let variant = product.variants?.find(
        (v) => String(v.size) === String(safeSize) && String(v.color).toLowerCase() === String(safeColor).toLowerCase()
      ) || product.variants?.find(
        (v) => String(v.size) === String(safeSize) || String(v.color).toLowerCase() === String(safeColor).toLowerCase()
      ) || (product.variants && product.variants[0]);

      if (variant) {
        targetVariantId = variant.variantId;
      } else if (product.subProductVariantIds && product.subProductVariantIds.length > 0) {
        targetVariantId = product.subProductVariantIds[0];
      } else if (products && products.length > 0) {
        const matchCombo = product.description ? product.description.match(/\[COMBO:\s*([\d,]+)\]/) : null;
        if (matchCombo) {
          const subIds = matchCombo[1].split(",").map(id => Number(id.trim()));
          const subProds = products.filter(p => subIds.includes(Number(p.id)));
          for (const sp of subProds) {
            if (sp.variants && sp.variants.length > 0) {
              targetVariantId = sp.variants[0].variantId;
              break;
            }
          }
        }
        if (!targetVariantId) {
          const anyWithVar = products.find(p => p.variants && p.variants.length > 0);
          if (anyWithVar) targetVariantId = anyWithVar.variants[0].variantId;
        }
      }

      if (targetVariantId) {
        try {
          await api.cart.addItem(targetVariantId, quantity);
          await loadUserData(products);
          addedSuccessfully = true;
        } catch (err) {
          throw err;
          console.warn("Lỗi đồng bộ giỏ hàng với máy chủ, tự động chuyển về bộ nhớ tạm:", err);
        }
      }
    }

    if (!addedSuccessfully) {
      setCart((prev) => {
        const existingIdx = prev.findIndex(
          (item) => String(item.product?.id || item.productId) === String(product.id) &&
                    String(item.size || "") === String(safeSize) &&
                    String(item.color || "").toLowerCase() === String(safeColor).toLowerCase()
        );
        if (existingIdx > -1) {
          const updated = [...prev];
          updated[existingIdx].quantity += quantity;
          updated[existingIdx].product = productToAdd;
          return updated;
        } else {
          return [...prev, { product: productToAdd, size: safeSize, color: safeColor, quantity }];
        }
      });
    }

    addNotification(
      "Thêm vào giỏ hàng thành công",
      `Đã thêm ${quantity} x ${product.name} (Màu: ${safeColor}, kích cỡ: ${safeSize}) vào giỏ hàng.`,
      "success",
      { actionUrl: "/cart", productId: product.id }
    );
    return true;
  };

  const updateCartQuantity = async (index, change) => {
    const item = cart[index];
    if (!item) return;

    const newQty = Math.max(1, item.quantity + change);
    const selectedVariant = item.product?.variants?.find(
      (variant) => String(variant.size) === String(item.size) &&
        String(variant.color).toLowerCase() === String(item.color).toLowerCase()
    );
    const availableStock = Number(selectedVariant?.quantity ?? item.product?.quantity ?? 0);
    if (change > 0 && newQty > availableStock) {
      addNotification(
        "Số lượng vượt quá tồn kho",
        `Sản phẩm này chỉ còn ${availableStock} sản phẩm trong kho.`,
        "error"
      );
      return false;
    }

    if (currentUser && item.cartDetailId) {
      try {
        await api.cart.updateQuantity(item.cartDetailId, newQty);
        await loadUserData(products);
      } catch (err) {
        addNotification("Không thể cập nhật số lượng", err.message, "error");
        return false;
        console.error("Lỗi cập nhật số lượng giỏ hàng:", err);
      }
    } else {
      setCart((prev) =>
        prev.map((it, i) => (i === index ? { ...it, quantity: newQty } : it))
      );
    }
    return true;
  };

  const removeFromCart = async (index) => {
    const item = cart[index];
    if (!item) return;

    if (currentUser && item.cartDetailId) {
      try {
        await api.cart.removeItem(item.cartDetailId);
        await loadUserData(products);
      } catch (err) {
        console.error("Lỗi xóa sản phẩm khỏi giỏ hàng:", err);
      }
    } else {
      setCart((prev) => {
        const next = prev.filter((_, i) => i !== index);
        if (currentUser) {
          const ownerKey = currentUser.id || currentUser.username;
          const groupedCombos = next.filter(
            (entry) => Array.isArray(entry.product?.comboItems) && entry.product.comboItems.length > 0
          );
          const storageKey = `foxstyle_combo_cart_${ownerKey}`;
          if (groupedCombos.length > 0) localStorage.setItem(storageKey, JSON.stringify(groupedCombos));
          else localStorage.removeItem(storageKey);
        }
        return next;
      });
    }
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("foxstyle_guest_cart");
    if (currentUser) {
      const ownerKey = currentUser.id || currentUser.username;
      localStorage.removeItem(`foxstyle_combo_cart_${ownerKey}`);
    }
  };

  // --- Wishlist ---
  const toggleWishlist = (productOrId) => {
    const product = productOrId && typeof productOrId === "object" ? productOrId : null;
    const productId = product ? product.id : productOrId;
    const normalizedId = String(productId);
    const exists = wishlist.some((id) => String(id) === normalizedId);
    const userId = currentUser ? currentUser.id : "guest";

    if (currentUser) {
      const requestAction = exists ? api.wishlist.remove(productId) : api.wishlist.add(productId);
      void requestAction.catch((error) => console.warn("Không thể đồng bộ sản phẩm yêu thích:", error));
    }

    setWishlist((prev) => {
      const updated = exists
        ? prev.filter((id) => String(id) !== normalizedId)
        : [...prev.map(String), normalizedId];
      localStorage.setItem(`foxstyle_wishlist_${userId}`, JSON.stringify(updated));
      return updated;
    });

    setWishlistProductSnapshots((snapshots) => {
      const withoutCurrent = snapshots.filter((item) => String(item.id) !== normalizedId);
      const updatedSnapshots = exists || !product ? withoutCurrent : [...withoutCurrent, product];
      localStorage.setItem(`foxstyle_wishlist_products_${userId}`, JSON.stringify(updatedSnapshots));
      return updatedSnapshots;
    });
  };

  const clearWishlist = () => {
    if (currentUser) {
      wishlist.forEach((productId) => {
        void api.wishlist.remove(productId).catch((error) => console.warn("Không thể xóa sản phẩm yêu thích:", error));
      });
    }
    setWishlist([]);
    setWishlistProductSnapshots([]);
    const userId = currentUser ? currentUser.id : "guest";
    localStorage.removeItem(`foxstyle_wishlist_${userId}`);
    localStorage.removeItem(`foxstyle_wishlist_products_${userId}`);
  };

  // --- Sổ địa chỉ (Address Book) ---
  const addAddress = async (addressData) => {
    if (!isValidVietnamesePhone(addressData.phone)) throw new Error(PHONE_MESSAGE);
    const newAddr = {
      id: addressData.id || Date.now(),
      fullName: addressData.fullName,
      phone: addressData.phone,
      detailAddress: addressData.detailAddress,
      district: addressData.district,
      ward: addressData.ward || "",
      city: addressData.city,
      isDefault: addressData.isDefault || false
    };

    if (currentUser) {
      try {
        const payload = {
          recipientName: addressData.fullName,
          phone: addressData.phone,
          province: addressData.city,
          district: addressData.district,
          ward: addressData.ward || "",
          detailAddress: addressData.detailAddress,
          isDefault: addressData.isDefault || false
        };
        await api.addresses.create(payload);
        await loadUserData(products);
      } catch (err) {
        console.warn("Lỗi API thêm địa chỉ, chuyển sang bộ nhớ tạm:", err);
      }
    }

    setAddressBook((prev) => {
      let list = addressData.isDefault ? prev.map(a => ({ ...a, isDefault: false })) : [...prev];
      list = list.filter(a => String(a.id) !== String(newAddr.id));
      list.push(newAddr);
      const ownerKey = currentUser?.id || currentUser?.username || "guest";
      localStorage.setItem(`foxstyle_address_book_${ownerKey}`, JSON.stringify(list));
      return list;
    });
  };

  const updateAddress = async (addressId, addressData) => {
    if (!isValidVietnamesePhone(addressData.phone)) throw new Error(PHONE_MESSAGE);
    if (currentUser) {
      try {
        const payload = {
          recipientName: addressData.fullName,
          phone: addressData.phone,
          province: addressData.city,
          district: addressData.district,
          ward: addressData.ward || "",
          detailAddress: addressData.detailAddress,
          isDefault: addressData.isDefault || false
        };
        await api.addresses.update(addressId, payload);
        await loadUserData(products);
      } catch (err) {
        console.warn("Lỗi API cập nhật địa chỉ:", err);
      }
    }

    setAddressBook((prev) => {
      const updated = prev.map(a => {
        if (String(a.id) === String(addressId)) {
          return {
            ...a,
            fullName: addressData.fullName,
            phone: addressData.phone,
            detailAddress: addressData.detailAddress,
            district: addressData.district,
            ward: addressData.ward,
            city: addressData.city,
            isDefault: addressData.isDefault
          };
        }
        return addressData.isDefault ? { ...a, isDefault: false } : a;
      });
      const ownerKey = currentUser?.id || currentUser?.username || "guest";
      localStorage.setItem(`foxstyle_address_book_${ownerKey}`, JSON.stringify(updated));
      return updated;
    });
  };

  const deleteAddress = async (addressId) => {
    if (currentUser) {
      try {
        await api.addresses.delete(addressId);
        await loadUserData(products);
      } catch (err) {
        console.warn("Lỗi API xóa địa chỉ:", err);
      }
    }

    setAddressBook((prev) => {
      const updated = prev.filter(a => String(a.id) !== String(addressId));
      const ownerKey = currentUser?.id || currentUser?.username || "guest";
      localStorage.setItem(`foxstyle_address_book_${ownerKey}`, JSON.stringify(updated));
      return updated;
    });
  };

  // --- Đơn hàng (Orders) ---
  const createOrder = async (orderData) => {
    if (!isValidVietnamesePhone(orderData.phone)) throw new Error(PHONE_MESSAGE);
    const normalizedPhone = String(orderData.phone || "").replace(/\D/g, "");
    const blockedPhones = (() => {
      try { return JSON.parse(localStorage.getItem("foxstyle_blocked_phones") || "[]"); }
      catch { return []; }
    })();
    const securityRecord = blockedPhones.find(
      (item) => String(item.phone || item).replace(/\D/g, "") === normalizedPhone
    );
    if (securityRecord && securityRecord.isBlocked !== false) {
      throw new Error(
        securityRecord.lockType === "PERMANENT"
          ? "Tài khoản đã bị khóa vĩnh viễn do tiếp tục bom hàng sau khi được mở khóa."
          : "Tài khoản đã bị khóa tạm thời do bom hàng trên 3 lần. Vui lòng liên hệ quản trị viên."
      );
    }
    if (
      securityRecord?.restricted &&
      String(orderData.paymentMethod || "").toLowerCase() === "cod"
    ) {
      throw new Error("Tài khoản đang bị hạn chế do từng bom hàng. Vui lòng thanh toán trước, không thể sử dụng COD.");
    }
    if (!currentUser) {
      throw new Error("Vui lòng đăng nhập trước khi thanh toán!");
    }

    try {
      // Map cart items sang định dạng CartItemRequest của backend
      const itemsPayload = cart.flatMap((item) => {
        if (Array.isArray(item.product?.comboItems) && item.product.comboItems.length > 0) {
          return [{
            comboProductId: Number(item.product.id),
            comboVariantId: item.product.selectedComboVariantId || null,
            componentVariantIds: item.product.comboItems.map((comboItem) => comboItem.variantId).filter(Boolean),
            quantity: item.quantity
          }];
        }

        let vId = item.variantId;
        if (!vId && item.product) {
          if (item.product.variants && item.product.variants.length > 0) {
            vId = item.product.variants[0].variantId;
          } else if (item.product.subProductVariantIds && item.product.subProductVariantIds.length > 0) {
            vId = item.product.subProductVariantIds[0];
          } else if (products && products.length > 0) {
            const matchProd = products.find(p => String(p.id) === String(item.product.id));
            if (matchProd && matchProd.variants && matchProd.variants.length > 0) {
              vId = matchProd.variants[0].variantId;
            } else {
              const anyWithVar = products.find(p => p.variants && p.variants.length > 0);
              if (anyWithVar) vId = anyWithVar.variants[0].variantId;
            }
          }
        }
        return [{
          variantId: vId,
          quantity: item.quantity
        }];
      }).filter(item => item.variantId || item.comboProductId);

      const checkoutPayload = {
        requestId: orderData.requestId || (() => {
          const key = "foxstyle_checkout_request_id";
          let value = sessionStorage.getItem(key);
          if (!value) {
            value = crypto.randomUUID();
            sessionStorage.setItem(key, value);
          }
          return value;
        })(),
        recipientName: orderData.recipientName || orderData.customerName,
        recipientPhone: orderData.phone,
        shippingAddress: orderData.address,
        recipientEmail: (orderData.email && orderData.email.trim()) ? orderData.email.trim() : (currentUser?.email ? currentUser.email : null),
        couponCode: orderData.couponCode || null,
        shippingFee: orderData.shipping !== undefined ? orderData.shipping : null,
        paymentMethod: orderData.paymentMethod.toUpperCase(),
        refundBankName: orderData.refundBankName || null,
        refundBankAccountNo: orderData.refundBankAccountNo || null,
        refundBankAccountName: orderData.refundBankAccountName || null,
        items: itemsPayload
      };

      const res = await api.orders.checkout(checkoutPayload);
      if (res.status === "success" && res.data) {
        sessionStorage.removeItem("foxstyle_checkout_request_id");
        const isCompletedPayment =
          orderData.paymentMethod === "cod" || Boolean(orderData.isPaid);
        if (isCompletedPayment) {
          clearCart();
        }
        await loadUserData(products);
        const orderId = "DH" + res.data.orderId;
        addNotification(
          isCompletedPayment ? "Đã tiếp nhận đơn hàng COD" : "Đơn hàng đang chờ thanh toán",
          isCompletedPayment
            ? `Đơn ${orderId} trị giá ${orderData.total.toLocaleString("vi-VN")}đ đã được ghi nhận. FoxStyle sẽ xác nhận và chuẩn bị hàng trong thời gian sớm nhất.`
            : `Đơn ${orderId} trị giá ${orderData.total.toLocaleString("vi-VN")}đ đã được tạo tạm thời. Vui lòng hoàn tất chuyển khoản để đơn được xác nhận.`,
          isCompletedPayment ? "success" : "warning",
          { id: `order_checkout_${orderId}`, actionUrl: `/orders?search=${orderId}`, orderId }
        );
        return orderId;
      }
      throw new Error(res.message || "Đặt hàng thất bại!");
    } catch (err) {
      console.error("Lỗi checkout:", err);
      throw err;
    }
  };

  const updateOrderStatus = async (orderIdDbOrCode, statusByteOrString, details = {}) => {
    let orderIdDb = orderIdDbOrCode;
    let orderCodeStr = String(orderIdDbOrCode);
    if (typeof orderIdDb === "string" && orderIdDb.startsWith("DH")) {
      orderIdDb = Number(orderIdDb.replace("DH", ""));
    }

    let statusString = "cancelled";
    let statusByte = 4;

    if (typeof statusByteOrString === "string") {
      statusString = statusByteOrString;
      switch (statusByteOrString) {
        case "pending": statusByte = 0; break;
        case "processing": statusByte = 1; break;
        case "shipping": statusByte = 2; break;
        case "completed": statusByte = 3; break;
        case "cancelled": statusByte = 4; break;
        case "returned": statusByte = 5; break;
        case "return_requested": statusByte = 6; break;
        default: statusByte = 0;
      }
    } else {
      statusByte = statusByteOrString;
      switch (statusByteOrString) {
        case 0: statusString = "pending"; break;
        case 1: statusString = "processing"; break;
        case 2: statusString = "shipping"; break;
        case 3: statusString = "completed"; break;
        case 4: statusString = "cancelled"; break;
        case 5: statusString = "returned"; break;
        case 6: statusString = "return_requested"; break;
        default: statusString = "pending";
      }
    }

    const targetOrder = orders.find((o) =>
      String(o.id) === orderCodeStr ||
      String(o.id) === `DH${orderIdDb}` ||
      Number(o.orderIdDb || 0) === Number(orderIdDb)
    );
    const wasCompleted = targetOrder?.status === "completed";

    const isAdminOrStaff = currentUser?.role === "admin" || currentUser?.role === "staff";
    try {
      if (!isAdminOrStaff && statusString === "cancelled") {
        await api.orders.cancelOrder(orderIdDb, details.reason);
      } else if (!isAdminOrStaff && statusString === "returned") {
        await api.orders.returnOrder(
          orderIdDb,
          details.reason,
          Boolean(details.warrantyRedelivery),
          {
            bankName: details.bankName,
            bankAccountNo: details.bankAccountNo,
            bankAccountName: details.bankAccountName
          }
        );
      } else {
        await api.orders.updateStatus(orderIdDb, statusByte, details);
      }
      await loadUserData(products);
    } catch (err) {
      if (statusString === "cancelled" || statusString === "returned") {
        return {
          success: false,
          message: err.message || "Không thể lưu lý do hủy/hoàn hàng"
        };
      }
      console.warn("Lỗi gọi API cập nhật đơn hàng, chuyển sang cập nhật bộ nhớ tạm:", err);
    }

    const effectiveStatusString = (!isAdminOrStaff && statusString === "returned")
      ? "return_requested"
      : statusString;
    // Always update local state so UI updates immediately
    setOrders((prev) => {
      const updated = prev.map((o) => {
        const matchId = String(o.id) === orderCodeStr || 
                        String(o.id) === `DH${orderIdDb}` || 
                        Number(o.orderIdDb || 0) === Number(orderIdDb);
        if (matchId) {
          return {
            ...o,
            status: effectiveStatusString,
            ...(statusString === "completed" && !o.deliveredAt
              ? { deliveredAt: new Date().toISOString() }
              : {}),
            ...(statusString === "cancelled" ? { cancellationReason: details.reason || "" } : {}),
            ...(statusString === "returned" ? {
              returnReason: details.reason || "",
              warrantyRedelivery: Boolean(details.warrantyRedelivery)
            } : {})
          };
        }
        return o;
      });
      const ownerKey = currentUser?.id || currentUser?.username || "guest";
      localStorage.setItem(`foxstyle_orders_${ownerKey}`, JSON.stringify(updated));
      return updated;
    });

    let statusText = "Chờ xử lý";
    if (statusString === "processing") statusText = "Đang xử lý";
    else if (statusString === "shipping") statusText = "Đang giao";
    else if (statusString === "completed") statusText = "Đã giao";
    else if (statusString === "cancelled") statusText = "Đã hủy";
    else if (statusString === "returned") statusText = "Hoàn hàng";

    addNotification(
      "Cập nhật đơn hàng",
      `Đơn hàng ${orderCodeStr} đã chuyển sang trạng thái: "${statusText}".`,
      statusString === "completed" ? "success" : statusString === "cancelled" ? "warning" : "info",
      {
        actionUrl:
          currentUser?.role === "admin" || currentUser?.role === "staff"
            ? `/admin/orders?search=${orderCodeStr}`
            : `/orders?search=${orderCodeStr}`,
        orderId: orderCodeStr
      }
    );

    if (statusString === "completed" && !wasCompleted && targetOrder) {
      const uniqueProducts = Array.from(
        new Map(
          (targetOrder.items || [])
            .filter((item) => item.product?.id || item.productId)
            .map((item) => [String(item.product?.id || item.productId), item])
        ).values()
      );

      const reviewNotifications = uniqueProducts.map((item) => {
        const productId = item.product?.id || item.productId;
        const productName = item.product?.name || item.productName || "sản phẩm";
        const isCombo =
          item.product?.isCombo ||
          item.product?.category === "combo" ||
          productName.toLowerCase().includes("combo") ||
          item.product?.description?.includes("[COMBO:");

        return {
          id: `review_${orderIdDb}_${productId}`,
          title: isCombo ? "Đánh giá combo đã mua" : "Đánh giá sản phẩm đã mua",
          content: `Đơn hàng DH${orderIdDb} đã giao thành công. Nhấn vào đây để đánh giá "${productName}".`,
          time: new Date().toISOString(),
          isRead: false,
          type: "review",
          actionUrl: `/products/${productId}#reviews`,
          orderId: `DH${orderIdDb}`,
          productId
        };
      });

      if (reviewNotifications.length > 0) {
        const ownerId = targetOrder.userId;
        const isOrderOwner = ownerId && String(ownerId) === String(currentUser?.id);

        if (isOrderOwner) {
          setNotifications((prev) => {
            const existingIds = new Set(prev.map((notification) => String(notification.id)));
            return [
              ...reviewNotifications.filter((notification) => !existingIds.has(String(notification.id))),
              ...prev
            ];
          });
        } else if (ownerId) {
          const notificationKey = `foxstyle_notifications_${ownerId}`;
          const savedNotifications = safeJsonParse(localStorage.getItem(notificationKey), []);
          const existingIds = new Set(savedNotifications.map((notification) => String(notification.id)));
          localStorage.setItem(
            notificationKey,
            JSON.stringify([
              ...reviewNotifications.filter((notification) => !existingIds.has(String(notification.id))),
              ...savedNotifications
            ])
          );
        }
      }
    }

    return { success: true };
  };

  // --- Coupon Verification ---
  const applyCoupon = async (code, orderSubtotal) => {
    if (!currentUser) {
      return { success: false, message: "Vui lòng đăng nhập để sử dụng mã giảm giá!" };
    }

    try {
      const res = await api.coupons.validate(code, orderSubtotal);
      if (res.status === "success" && res.data !== undefined) {
        return {
          success: true,
          discount: Number(res.data),
          coupon: { code: code }
        };
      }
      return { success: false, message: res.message || "Mã không hợp lệ!" };
    } catch (err) {
      return { success: false, message: err.message || "Mã giảm giá không hợp lệ hoặc đã hết hạn!" };
    }
  };

  // --- Reviews ---
  const addReview = async (productId, rating, comment) => {
    if (!currentUser) {
      throw new Error("Bạn cần đăng nhập để đánh giá sản phẩm.");
    }
    try {
      const createdReview = await api.reviews.create({
        productId,
        rating,
        comment
      });
      await loadCatalogData();

      const product = products.find(p => p.id === productId);
      const prodName = product ? product.name : "sản phẩm";
      addNotification(
        "Đánh giá thành công",
        `Cảm ơn bạn đã gửi đánh giá ${rating} sao cho sản phẩm "${prodName}".`,
        "success",
        { actionUrl: `/products/${productId}#reviews`, productId }
      );
      return createdReview;
    } catch (err) {
      console.error("Lỗi gửi đánh giá sản phẩm:", err);
      throw err;
    }
  };

  // --- Product CRUD (Admin) ---
  const addProduct = async (prodData) => {
    const newId = prodData.id || Date.now();
    const isCombo = prodData.isCombo || (prodData.productName && prodData.productName.includes("[SET COMBO]")) || (prodData.description && prodData.description.includes("[COMBO:"));
    const newProduct = {
      id: newId,
      name: prodData.productName || prodData.name || "Sản phẩm mới",
      price: Number(prodData.price || 0),
      originalPrice: getProductPricing(prodData).originalPrice || undefined,
      category: isCombo ? "combo" : (prodData.category || "ao"),
      categoryId: prodData.categoryId || 1,
      image: prodData.imageUrl || prodData.image || "/image_san_pham/photo-1521572163474-6864f9cf17ab.jpg",
      description: prodData.description || "",
      material: prodData.material || "Set Đồ Phối Sẵn Premium",
      origin: prodData.origin || "Việt Nam",
      careInstructions: prodData.careInstructions || "",
      fitGuide: prodData.fitGuide || "",
      videoUrl: prodData.videoUrl || "",
      quantity: Number(prodData.quantity || 50),
      status: prodData.status !== undefined ? Number(prodData.status) : 1,
      isCombo: isCombo,
      comboProductIds: prodData.comboProductIds || [],
      comboProducts: prodData.comboProducts || [],
      variants: prodData.variants || [{ color: "Chuẩn Set", size: "Freesize / Đủ Size", quantity: 50, price: Number(prodData.price) }],
      images: prodData.images || []
    };

    setProducts((prev) => {
      const updated = [newProduct, ...prev];
      try {
        localStorage.setItem("foxstyle_custom_products", JSON.stringify(updated.filter(p => typeof p.id === "number" && p.id > 100000)));
      } catch (e) {}
      return updated;
    });

    try {
      const res = await api.products.create(prodData);
      if (res && res.status === "success") {
        await loadCatalogData();
      }
    } catch (err) {
      console.warn("API thêm sản phẩm offline, đã lưu thành công vào giao diện tạm:", err);
    }
    return { success: true };
  };

  const updateProduct = async (productId, prodData) => {
    const oldProduct = products.find((p) => String(p.id) === String(productId));
    const oldPrice = Number(oldProduct?.price || 0);
    const newPrice = prodData.price !== undefined ? Number(prodData.price) : oldPrice;
    if (oldProduct && oldPrice !== newPrice) {
      try {
        const logs = JSON.parse(localStorage.getItem("foxstyle_price_audit") || "[]");
        logs.unshift({
          id: `PRICE-${Date.now()}`, productId, productName: oldProduct.name,
          oldPrice, newPrice, changedAt: new Date().toISOString(),
          changedBy: currentUser?.fullName || currentUser?.username || "Không xác định",
          userId: currentUser?.id || null, role: currentUser?.role || "unknown"
        });
        localStorage.setItem("foxstyle_price_audit", JSON.stringify(logs.slice(0, 1000)));
      } catch (e) {}
    }
    if (prodData.status !== undefined) {
      try {
        const savedStatuses = getSavedStatuses();
        savedStatuses[productId] = prodData.status;
        localStorage.setItem("foxstyle_product_statuses", JSON.stringify(savedStatuses));
      } catch (e) {}
    }

    const nextPricing = getProductPricing({
      price: newPrice,
      originalPrice: prodData.originalPrice !== undefined
        ? prodData.originalPrice
        : oldProduct?.originalPrice
    });

    setProducts((prev) =>
      prev.map((p) =>
        String(p.id) === String(productId)
          ? {
              ...p,
              ...prodData,
              id: p.id,
              name: prodData.productName || prodData.name || p.name,
              image: prodData.imageUrl || prodData.image || p.image,
              price: prodData.price !== undefined ? Number(prodData.price) : p.price,
              originalPrice: nextPricing.originalPrice || undefined,
              status: prodData.status !== undefined ? Number(prodData.status) : p.status,
              quantity: prodData.quantity !== undefined ? Number(prodData.quantity) : p.quantity
            }
          : p
      )
    );

    try {
      await api.products.update(productId, prodData);
      await loadCatalogData();
    } catch (err) {
      console.warn("API cập nhật sản phẩm offline, đã cập nhật thành công trên giao diện:", err);
    }
    return { success: true };
  };

  const deleteProduct = async (productId) => {
    setProducts((prev) => prev.filter((p) => String(p.id) !== String(productId)));
    try {
      await api.products.delete(productId);
    } catch (err) {
      console.warn("API xóa sản phẩm offline, đã xóa thành công khỏi giao diện:", err);
    }
    return { success: true };
  };

  // --- Category CRUD (Admin) ---
  const addCategory = async (catData) => {
    const categoryName = (catData.name || catData.categoryName || "").trim().replace(/\s+/g, " ");
    const duplicated = categories.some(
      (category) => (category.name || category.categoryName || "").trim().toLocaleLowerCase("vi-VN")
        === categoryName.toLocaleLowerCase("vi-VN")
    );
    if (duplicated) {
      return { success: false, message: `Tên danh mục đã tồn tại: ${categoryName}` };
    }

    try {
      const payload = {
        categoryName,
        description: catData.description,
        status: 1
      };
      const response = await api.categories.create(payload);
      const saved = response?.data;
      setCategories((prev) => [...prev, {
        id: saved.categoryId,
        name: saved.categoryName,
        description: saved.description,
        status: saved.status
      }]);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || "Thêm danh mục thất bại" };
    }
  };

  const updateCategory = async (catId, catData) => {
    const categoryName = (catData.name || catData.categoryName || "").trim().replace(/\s+/g, " ");
    const duplicated = categories.some(
      (category) => String(category.id ?? category.categoryId) !== String(catId)
        && (category.name || category.categoryName || "").trim().toLocaleLowerCase("vi-VN")
          === categoryName.toLocaleLowerCase("vi-VN")
    );
    if (duplicated) {
      return { success: false, message: `Tên danh mục đã tồn tại: ${categoryName}` };
    }

    try {
      const payload = {
        categoryName,
        description: catData.description,
        status: 1
      };
      const response = await api.categories.update(catId, payload);
      const saved = response?.data;
      setCategories((prev) => prev.map((category) =>
        String(category.id ?? category.categoryId) === String(catId)
          ? { id: saved.categoryId, name: saved.categoryName, description: saved.description, status: saved.status }
          : category
      ));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || "Cập nhật danh mục thất bại" };
    }
  };

  const deleteCategory = async (catId) => {
    try {
      await api.categories.delete(catId);
      setCategories((prev) => prev.filter(
        (category) => String(category.id ?? category.categoryId) !== String(catId)
      ));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || "Xóa danh mục thất bại" };
    }
  };

  // --- Coupon CRUD (Admin) ---
  const addCoupon = async (couponData) => {
    if (Number(couponData.discountType) === 2 && Number(couponData.discountValue) >= 100) {
      return { success: false, message: "Hệ thống bảo mật không cho phép tạo mã giảm từ 100%." };
    }
    const couponCode = String(couponData.couponCode || "").replace(/\s+/g, "").toUpperCase();
    if (coupons.some((coupon) => String(coupon.couponCode || "").toUpperCase() === couponCode)) {
      return { success: false, message: `Mã khuyến mãi đã tồn tại: ${couponCode}` };
    }
    try {
      const response = await api.coupons.create({ ...couponData, couponCode });
      setCoupons((prev) => [response.data, ...prev]);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || "Tạo mã khuyến mãi thất bại" };
    }
  };

  const updateCoupon = async (couponId, couponData) => {
    if (Number(couponData.discountType) === 2 && Number(couponData.discountValue) >= 100) {
      return { success: false, message: "Hệ thống bảo mật không cho phép mã giảm từ 100%." };
    }
    const existingCoupon = coupons.find(
      (coupon) => String(coupon.couponId ?? coupon.id) === String(couponId)
    );
    const couponCode = String(couponData.couponCode || existingCoupon?.couponCode || "")
      .replace(/\s+/g, "").toUpperCase();
    const duplicated = coupons.some(
      (coupon) => String(coupon.couponId ?? coupon.id) !== String(couponId)
        && String(coupon.couponCode || "").toUpperCase() === couponCode
    );
    if (duplicated) {
      return { success: false, message: `Mã khuyến mãi đã tồn tại: ${couponCode}` };
    }
    const payload = { ...existingCoupon, ...couponData, couponCode };
    try {
      const response = await api.coupons.update(couponId, payload);
      setCoupons((prev) => prev.map((coupon) =>
        String(coupon.couponId ?? coupon.id) === String(couponId) ? response.data : coupon
      ));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || "Cập nhật mã khuyến mãi thất bại" };
    }
  };

  const deleteCoupon = async (couponId) => {
    setCoupons((prev) =>
      prev.filter((coupon) => String(coupon.couponId ?? coupon.id) !== String(couponId))
    );
    try {
      await api.coupons.delete(couponId);
    } catch (err) {
      console.warn("API Coupon offline, đã xóa khỏi bộ nhớ tạm:", err);
    }
    return { success: true };
  };

  // --- Banner CRUD (Admin) ---
  const loadAllBannersAdmin = useCallback(async () => {
    try {
      const res = await api.banners.getAllAdmin();
      if (res.status === "success" && res.data && res.data.content) {
        setAdminBanners(res.data.content);
      }
    } catch (err) {
      console.error("Lỗi tải tất cả banner admin:", err);
    }
  }, []);

  const addBanner = useCallback(async (bannerReq) => {
    const title = String(bannerReq.title || "").trim().replace(/\s+/g, " ");
    if (adminBanners.some((banner) => String(banner.title || "").trim().toLocaleLowerCase("vi-VN")
      === title.toLocaleLowerCase("vi-VN"))) {
      return { success: false, message: `Tiêu đề banner đã tồn tại: ${title}` };
    }
    try {
      const response = await api.banners.create({ ...bannerReq, title });
      setAdminBanners((prev) => [response.data, ...prev]);
      setBanners((prev) => [response.data, ...prev]);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || "Thêm banner thất bại" };
    }
  }, [adminBanners]);

  const updateBanner = useCallback(async (id, bannerReq) => {
    const title = String(bannerReq.title || "").trim().replace(/\s+/g, " ");
    const duplicated = adminBanners.some(
      (banner) => String(banner.id ?? banner.bannerId) !== String(id)
        && String(banner.title || "").trim().toLocaleLowerCase("vi-VN") === title.toLocaleLowerCase("vi-VN")
    );
    if (duplicated) {
      return { success: false, message: `Tiêu đề banner đã tồn tại: ${title}` };
    }
    try {
      const response = await api.banners.update(id, { ...bannerReq, title });
      setAdminBanners((prev) => prev.map((banner) =>
        String(banner.id ?? banner.bannerId) === String(id) ? response.data : banner
      ));
      setBanners((prev) => prev.map((banner) =>
        String(banner.id ?? banner.bannerId) === String(id) ? response.data : banner
      ));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message || "Cập nhật banner thất bại" };
    }
  }, [adminBanners]);

  const deleteBanner = useCallback(async (id) => {
    setAdminBanners((prev) => prev.filter((b) => String(b.id ?? b.bannerId) !== String(id)));
    setBanners((prev) => prev.filter((b) => String(b.id ?? b.bannerId) !== String(id)));
    try {
      await api.banners.delete(id);
    } catch (err) {
      console.warn("API Banner offline, đã xóa khỏi bộ nhớ tạm:", err);
    }
    return { success: true };
  }, []);

  return (
    <AppContext.Provider value={{
      users,
      currentUser,
      restoringSession,
      products,

      categories,
      coupons,
      orders,
      cart,
      wishlist,
      wishlistProductSnapshots,
      banners,
      adminBanners,
      loadAllBannersAdmin,
      addBanner,
      updateBanner,
      deleteBanner,
      addressBook,
      notifications,
      addNotification,
      sendGlobalNotification,
      chats,
      sendMessage,
      markChatAsRead,
      startNewCustomerChat,
      isAutoReplyEnabled,
      setIsAutoReplyEnabled,
      markAllNotificationsAsRead,
      markNotificationAsRead,
      clearNotifications,
      login,
      loginWithGoogle,
      register,
      logout,
      updateUserStatus,
      deleteUser,
      createStaffUser,
      updateStaffPassword,
      updateProfile,
      deactivateAccount,
      deleteMyAccount,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      toggleWishlist,
      clearWishlist,
      addAddress,
      updateAddress,
      deleteAddress,
      createOrder,
      updateOrderStatus,
      addReview,
      applyCoupon,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      updateCategory,
      deleteCategory,
      addCoupon,
      updateCoupon,
      deleteCoupon,
      showLoginModal,
      setShowLoginModal,
      openLoginModal,
      closeLoginModal,
      t,
      theme,
      setTheme,
      sendOtp,
      verifyOtp,
      firebaseSuccess,
      findAccount,
      sendForgotPasswordOtp,
      resetPassword,

      flashSaleConfig,
      updateFlashSaleConfig,
      deleteChat,
      loadUserData,
      loadCatalogData
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}

export function fixGarbledText(str) {
  return normalizeVietnameseText(str || "");
}
