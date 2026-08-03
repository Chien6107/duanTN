import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { products as initialProducts } from "../data/products";
import { api } from "../services/api";

const AppContext = createContext(null);

// --- Mapper Functions to Bridge Backend DTOs with Frontend React Models ---

const mapCategory = (categoryName) => {
  if (!categoryName) return "phu-kien";
  const name = categoryName.toLowerCase();
  if (name.includes("áo")) return "ao";
  if (name.includes("quần")) return "quan";
  if (name.includes("váy") || name.includes("đầm")) return "vay";
  return "phu-kien";
};

const mapProductResponse = (p) => {
  const sizes = p.variants ? [...new Set(p.variants.map((v) => v.size).filter(Boolean))] : [];
  const colors = p.variants ? [...new Set(p.variants.map((v) => v.color).filter(Boolean))] : [];
  const quantity = p.variants ? p.variants.reduce((sum, v) => sum + (v.quantity || 0), 0) : 0;

  return {
    id: p.productId,
    name: p.productName,
    price: p.price,
    originalPrice: p.originalPrice,
    image: p.imageUrl,
    category: mapCategory(p.categoryName),
    rating: p.averageRating || 5.0,
    reviews: p.variants ? 12 : 0, // Mock số đánh giá ban đầu
    description: p.description,
    sizes: sizes.length > 0 ? sizes : ["S", "M", "L", "XL"],
    colors: colors.length > 0 ? colors : ["Đen", "Trắng"],
    material: p.material || "Cotton 100%",
    origin: p.origin || "Việt Nam",
    quantity: quantity || 50,
    variants: p.variants || [],
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

  return {
    cartDetailId: item.cartDetailId,
    variantId: item.variantId,
    product: fullProduct,
    size: item.size,
    color: item.color,
    quantity: item.quantity
  };
};

const mapOrderStatus = (statusByte) => {
  switch (statusByte) {
    case 0: return "pending";     // Chờ duyệt
    case 1: return "processing";  // Đang chuẩn bị hàng
    case 2: return "shipping";    // Đang giao
    case 3: return "completed";   // Đã giao thành công
    case 4: return "cancelled";   // Đã hủy
    default: return "pending";
  }
};

const mapOrderResponse = (o, availableProducts) => {
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
      size: d.size,
      color: d.color,
      quantity: d.quantity
    })) : [],
    subtotal: o.totalAmount - (o.shippingFee || 0) + (o.discountAmount || 0),
    shipping: o.shippingFee || 0,
    discount: o.discountAmount || 0,
    couponCode: o.couponCode,
    total: o.totalAmount,
    paymentMethod: o.payments && o.payments.length > 0 ? o.payments[0].paymentMethod.toLowerCase() : "cod",
    status: mapOrderStatus(o.status),
    date: o.orderDate ? o.orderDate.split("T")[0] : new Date().toISOString().split("T")[0],
    phone: o.recipientPhone,
    address: o.shippingAddress,
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
    city: a.province,
    isDefault: a.isDefault
  };
};

export function AppProvider({ children }) {
  // --- States ---
  const [currentUser, setCurrentUser] = useState(null);
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState([
    { id: "ao", name: "Áo", description: "Các loại áo thun, sơ mi, hoodie" },
    { id: "quan", name: "Quần", description: "Quần jean, tây, short" },
    { id: "vay", name: "Váy", description: "Các mẫu váy thanh lịch" },
    { id: "phu-kien", name: "Phụ kiện", description: "Mũ, giày, túi xách" }
  ]);
  const [banners, setBanners] = useState([]);
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem("foxstyle_wishlist");
    return saved ? JSON.parse(saved) : [];
  });
  const [orders, setOrders] = useState([]);
  const [addressBook, setAddressBook] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [users, setUsers] = useState([]); // Dành cho trang Admin quản lý user
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("foxstyle_notifications");
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        title: "Chào mừng bạn đến với FoxStyle!",
        content: "Cảm ơn bạn đã lựa chọn cửa hàng của chúng tôi. Hãy bắt đầu mua sắm ngay nhé!",
        time: new Date().toISOString(),
        isRead: false,
        type: "success"
      }
    ];
  });

  // Lưu thông báo vào localStorage
  useEffect(() => {
    localStorage.setItem("foxstyle_notifications", JSON.stringify(notifications));
  }, [notifications]);

  // Thêm thông báo
  const addNotification = useCallback((title, content, type = "info") => {
    setNotifications((prev) => [
      {
        id: Date.now(),
        title,
        content,
        time: new Date().toISOString(),
        isRead: false,
        type
      },
      ...prev
    ]);
  }, []);

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem("foxstyle_chats");
    return saved ? JSON.parse(saved) : [];
  });

  // Sync chats to localStorage
  useEffect(() => {
    localStorage.setItem("foxstyle_chats", JSON.stringify(chats));
  }, [chats]);

  const simulateStaffReply = useCallback((customerId, customerName) => {
    const replies = [
      "Chào bạn! Cảm ơn bạn đã nhắn tin cho FoxStyle. Chúng tôi sẽ phản hồi bạn trong giây lát.",
      "Dạ FoxStyle xin chào! Bạn cần tư vấn về sản phẩm hay đơn hàng nào ạ?",
      "Cảm ơn bạn đã liên hệ. Đội ngũ CSKH đang kiểm tra tin nhắn và hỗ trợ bạn ngay đây ạ!",
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
        const existingIdx = prevChats.findIndex((c) => c.customerId === customerId);
        if (existingIdx > -1) {
          const updated = [...prevChats];
          const chat = { ...updated[existingIdx] };
          const lastMsg = chat.messages[chat.messages.length - 1];
          if (lastMsg && lastMsg.senderRole === "customer") {
            chat.messages = [...chat.messages, replyMsg];
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
    const message = {
      id: "msg_" + Date.now(),
      senderId: senderRole === "customer" ? customerId : senderRole,
      senderName,
      senderRole,
      content,
      time: new Date().toISOString()
    };

    setChats((prevChats) => {
      const existingIdx = prevChats.findIndex((c) => c.customerId === customerId);
      if (existingIdx > -1) {
        const updated = [...prevChats];
        const chat = { ...updated[existingIdx] };
        chat.messages = [...chat.messages, message];
        chat.lastMessage = content;
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
            customerName,
            lastMessage: content,
            lastUpdated: new Date().toISOString(),
            unreadCount: senderRole === "customer" ? 1 : 0,
            messages: [message]
          },
          ...prevChats
        ];
      }
    });

    if (senderRole === "customer") {
      simulateStaffReply(customerId, customerName);
    }
  }, [simulateStaffReply]);

  // --- Load User Private Data ---
  const loadUserData = useCallback(async (currentProducts) => {
    const token = localStorage.getItem("foxstyle_token");
    if (!token) return;

    try {
      // 1. Tải giỏ hàng
      const cartRes = await api.cart.get();
      if (cartRes.status === "success" && cartRes.data) {
        const mappedItems = cartRes.data.items.map((item) =>
          mapCartItemResponse(item, currentProducts || products)
        );
        setCart(mappedItems);
      }

      // 2. Tải lịch sử đơn hàng
      const ordersRes = await api.orders.getMyOrders();
      if (ordersRes.status === "success" && ordersRes.data) {
        const mappedOrders = ordersRes.data.content.map((o) =>
          mapOrderResponse(o, currentProducts || products)
        );
        setOrders(mappedOrders);
      }

      // 3. Tải sổ địa chỉ
      const addressRes = await api.addresses.getAll();
      if (addressRes.status === "success" && addressRes.data) {
        const mappedAddresses = addressRes.data.map(mapAddressResponse);
        setAddressBook(mappedAddresses);
      }
    } catch (err) {
      console.error("Lỗi khi tải thông tin cá nhân từ Database:", err);
    }
  }, [products]);

  // --- Load Public Catalog Data ---
  const loadCatalogData = useCallback(async () => {
    try {
      // 1. Tải sản phẩm từ database
      const prodRes = await api.products.getAll({ size: 100 });
      let activeProducts = initialProducts;
      if (prodRes.status === "success" && prodRes.data && prodRes.data.content) {
        activeProducts = prodRes.data.content.map(mapProductResponse);
        setProducts(activeProducts);
      }

      // 2. Tải banner hoạt động
      const bannerRes = await api.banners.getAll();
      if (bannerRes.status === "success" && bannerRes.data) {
        setBanners(bannerRes.data);
      }

      // 3. Tải thông tin người dùng hiện tại (nếu có Token)
      const token = localStorage.getItem("foxstyle_token");
      if (token) {
        const profileRes = await api.auth.getProfile();
        if (profileRes.status === "success" && profileRes.data) {
          const mappedUser = mapUserResponse(profileRes.data);
          setCurrentUser(mappedUser);
          await loadUserData(activeProducts);

          // Nếu là Admin thì tải luôn danh sách người dùng để quản lý
          if (mappedUser.role === "admin") {
            const usersRes = await api.users.getAll();
            if (usersRes.status === "success" && usersRes.data) {
              setUsers(usersRes.data.content.map(mapUserResponse));
            }
            const couponsRes = await api.coupons.getAllAdmin();
            if (couponsRes.status === "success" && couponsRes.data) {
              setCoupons(couponsRes.data.content);
            }
          }
        }
      }
    } catch (err) {
      console.error("Lỗi tải danh mục catalog:", err);
    }
  }, [loadUserData]);

  useEffect(() => {
    loadCatalogData();
  }, []);

  // --- Sync local wishlist ---
  useEffect(() => {
    localStorage.setItem("foxstyle_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // --- Auth Functions ---
  const login = async (username, password) => {
    try {
      const res = await api.auth.login(username, password);
      if (res.status === "success" && res.data) {
        const { accessToken, user } = res.data;
        localStorage.setItem("foxstyle_token", accessToken);
        const mappedUser = mapUserResponse(user);
        setCurrentUser(mappedUser);

        // Tải lại dữ liệu người dùng ngay lập tức
        await loadUserData(products);

        // Nếu admin
        if (mappedUser.role === "admin") {
          const usersRes = await api.users.getAll();
          if (usersRes.status === "success" && usersRes.data) {
            setUsers(usersRes.data.content.map(mapUserResponse));
          }
          const couponsRes = await api.coupons.getAllAdmin();
          if (couponsRes.status === "success" && couponsRes.data) {
            setCoupons(couponsRes.data.content);
          }
        }

        return { success: true, user: mappedUser };
      }
      return { success: false, message: res.message || "Đăng nhập thất bại!" };
    } catch (err) {
      return { success: false, message: err.message || "Tài khoản hoặc mật khẩu không chính xác!" };
    }
  };

  const register = async (username, password, fullName, email, phone) => {
    try {
      const res = await api.auth.register(username, password, fullName, email, phone);
      if (res.status === "success") {
        return { success: true, message: "Đăng ký tài khoản thành công!" };
      }
      return { success: false, message: res.message || "Đăng ký thất bại!" };
    } catch (err) {
      return { success: false, message: err.message || "Đăng ký tài khoản thất bại!" };
    }
  };

  const logout = () => {
    localStorage.removeItem("foxstyle_token");
    setCurrentUser(null);
    setCart([]);
    setOrders([]);
    setAddressBook([]);
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

  const updateProfile = async (fullName, email, phone) => {
    // Để phục vụ cập nhật profile nhanh, ghi nhận cục bộ
    if (!currentUser) return;
    const updated = { ...currentUser, fullName, email, phone };
    setCurrentUser(updated);
  };

  // --- Cart Functions (Hybrid: Syncs with DB if logged in, falls back to Memory) ---
  const addToCart = async (product, size, color, quantity = 1) => {
    if (currentUser) {
      // Tìm variantId tương ứng
      const variant = product.variants?.find(
        (v) => v.size === size && v.color === color
      );
      if (!variant) {
        console.error("Không tìm thấy biến thể sản phẩm phù hợp");
        return;
      }
      try {
        await api.cart.addItem(variant.variantId, quantity);
        await loadUserData(products);
        addNotification(
          "Thêm vào giỏ hàng thành công",
          `Đã thêm ${quantity} x ${product.name} (Màu: ${color}, Size: ${size}) vào giỏ hàng của bạn.`,
          "success"
        );
      } catch (err) {
        console.error("Lỗi thêm vào giỏ hàng:", err);
      }
    } else {
      // Offline fallback
      setCart((prev) => {
        const existingIdx = prev.findIndex(
          (item) => item.product.id === product.id && item.size === size && item.color === color
        );
        if (existingIdx > -1) {
          const updated = [...prev];
          updated[existingIdx].quantity += quantity;
          return updated;
        } else {
          return [...prev, { product, size, color, quantity }];
        }
      });
      addNotification(
        "Thêm vào giỏ hàng thành công (Khách)",
        `Đã thêm ${quantity} x ${product.name} (Màu: ${color}, Size: ${size}) vào giỏ hàng.`,
        "success"
      );
    }
  };

  const updateCartQuantity = async (index, change) => {
    const item = cart[index];
    if (!item) return;

    const newQty = Math.max(1, item.quantity + change);

    if (currentUser && item.cartDetailId) {
      try {
        await api.cart.updateQuantity(item.cartDetailId, newQty);
        await loadUserData(products);
      } catch (err) {
        console.error("Lỗi cập nhật số lượng giỏ hàng:", err);
      }
    } else {
      setCart((prev) =>
        prev.map((it, i) => (i === index ? { ...it, quantity: newQty } : it))
      );
    }
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
      setCart((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  // --- Wishlist ---
  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  // --- Sổ địa chỉ (Address Book) ---
  const addAddress = async (addressData) => {
    if (!currentUser) return;
    try {
      const payload = {
        recipientName: addressData.fullName,
        phone: addressData.phone,
        province: addressData.city,
        district: addressData.district,
        ward: addressData.ward || "Phường",
        detailAddress: addressData.detailAddress,
        isDefault: addressData.isDefault || false
      };
      await api.addresses.create(payload);
      await loadUserData(products);
    } catch (err) {
      console.error("Lỗi thêm địa chỉ mới:", err);
    }
  };

  const updateAddress = async (addressId, addressData) => {
    if (!currentUser) return;
    try {
      const payload = {
        recipientName: addressData.fullName,
        phone: addressData.phone,
        province: addressData.city,
        district: addressData.district,
        ward: addressData.ward || "Phường",
        detailAddress: addressData.detailAddress,
        isDefault: addressData.isDefault || false
      };
      await api.addresses.update(addressId, payload);
      await loadUserData(products);
    } catch (err) {
      console.error("Lỗi cập nhật địa chỉ:", err);
    }
  };

  const deleteAddress = async (addressId) => {
    if (!currentUser) return;
    try {
      await api.addresses.delete(addressId);
      await loadUserData(products);
    } catch (err) {
      console.error("Lỗi xóa địa chỉ:", err);
    }
  };

  // --- Đơn hàng (Orders) ---
  const createOrder = async (orderData) => {
    if (!currentUser) {
      throw new Error("Vui lòng đăng nhập trước khi thanh toán!");
    }

    try {
      // Map cart items sang định dạng CartItemRequest của backend
      const itemsPayload = cart.map((item) => {
        return {
          variantId: item.variantId,
          quantity: item.quantity
        };
      });

      const checkoutPayload = {
        recipientName: orderData.recipientName || orderData.customerName,
        recipientPhone: orderData.phone,
        shippingAddress: orderData.address,
        couponCode: orderData.couponCode || null,
        paymentMethod: orderData.paymentMethod.toUpperCase(),
        items: itemsPayload
      };

      const res = await api.orders.checkout(checkoutPayload);
      if (res.status === "success" && res.data) {
        clearCart();
        await loadUserData(products);
        const orderId = "DH" + res.data.orderId;
        addNotification(
          "Đặt hàng thành công",
          `Đơn hàng ${orderId} trị giá ${orderData.total.toLocaleString('vi-VN')}đ đã được đặt thành công và đang chờ duyệt.`,
          "success"
        );
        return orderId;
      }
      throw new Error(res.message || "Đặt hàng thất bại!");
    } catch (err) {
      console.error("Lỗi checkout:", err);
      throw err;
    }
  };

  const updateOrderStatus = async (orderIdDb, statusByte) => {
    try {
      const res = await api.orders.updateStatus(orderIdDb, statusByte);
      if (res.status === "success") {
        await loadUserData(products);

        // Tự động thông báo cập nhật trạng thái đơn hàng
        let statusText = "Chờ duyệt";
        let notifType = "info";
        if (statusByte === 1 || statusByte === "processing") statusText = "Đang chuẩn bị hàng";
        else if (statusByte === 2 || statusByte === "shipping") statusText = "Đang giao hàng";
        else if (statusByte === 3 || statusByte === "completed") {
          statusText = "Giao hàng thành công";
          notifType = "success";
        } else if (statusByte === 4 || statusByte === "cancelled") {
          statusText = "Đã hủy";
          notifType = "warning";
        }
        
        addNotification(
          "Cập nhật đơn hàng",
          `Đơn hàng DH${orderIdDb} đã chuyển sang trạng thái: "${statusText}".`,
          notifType
        );

        return true;
      }
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái đơn hàng:", err);
    }
    return false;
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
    if (!currentUser) return;
    try {
      await api.reviews.create({
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
        "success"
      );
    } catch (err) {
      console.error("Lỗi gửi đánh giá sản phẩm:", err);
    }
  };

  // --- Product CRUD (Admin) ---
  const addProduct = async (prodData) => {
    try {
      const res = await api.products.create(prodData);
      if (res.status === "success") {
        await loadCatalogData();
        return { success: true };
      }
    } catch (err) {
      console.error("Lỗi thêm sản phẩm:", err);
      return { success: false, message: err.message };
    }
  };

  const updateProduct = async (productId, prodData) => {
    try {
      const res = await api.products.update(productId, prodData);
      if (res.status === "success") {
        await loadCatalogData();
        return { success: true };
      }
    } catch (err) {
      console.error("Lỗi cập nhật sản phẩm:", err);
      return { success: false, message: err.message };
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const res = await api.products.delete(productId);
      if (res.status === "success") {
        await loadCatalogData();
        return { success: true };
      }
    } catch (err) {
      console.error("Lỗi xóa sản phẩm:", err);
      return { success: false, message: err.message };
    }
  };

  // --- Category CRUD (Admin) ---
  const addCategory = async (catData) => {
    try {
      const res = await api.categories.create(catData);
      if (res.status === "success") {
        await loadCatalogData();
        return { success: true };
      }
    } catch (err) {
      console.error("Lỗi thêm danh mục:", err);
      return { success: false, message: err.message };
    }
  };

  const updateCategory = async (catId, catData) => {
    try {
      const res = await api.categories.update(catId, catData);
      if (res.status === "success") {
        await loadCatalogData();
        return { success: true };
      }
    } catch (err) {
      console.error("Lỗi cập nhật danh mục:", err);
      return { success: false, message: err.message };
    }
  };

  const deleteCategory = async (catId) => {
    try {
      const res = await api.categories.delete(catId);
      if (res.status === "success") {
        await loadCatalogData();
        return { success: true };
      }
    } catch (err) {
      console.error("Lỗi xóa danh mục:", err);
      return { success: false, message: err.message };
    }
  };

  // --- Coupon CRUD (Admin) ---
  const addCoupon = async (couponData) => {
    try {
      const res = await api.coupons.create(couponData);
      if (res.status === "success") {
        await loadCatalogData();
        return { success: true };
      }
    } catch (err) {
      console.error("Lỗi thêm coupon:", err);
      return { success: false, message: err.message };
    }
  };

  const updateCoupon = async (couponId, couponData) => {
    try {
      const res = await api.coupons.update(couponId, couponData);
      if (res.status === "success") {
        await loadCatalogData();
        return { success: true };
      }
    } catch (err) {
      console.error("Lỗi cập nhật coupon:", err);
      return { success: false, message: err.message };
    }
  };

  const deleteCoupon = async (couponId) => {
    try {
      const res = await api.coupons.delete(couponId);
      if (res.status === "success") {
        await loadCatalogData();
        return { success: true };
      }
    } catch (err) {
      console.error("Lỗi xóa coupon:", err);
      return { success: false, message: err.message };
    }
  };

  return (
    <AppContext.Provider value={{
      users,
      currentUser,
      products,
      categories,
      coupons,
      orders,
      cart,
      wishlist,
      banners,
      addressBook,
      notifications,
      addNotification,
      chats,
      sendMessage,
      markAllNotificationsAsRead,
      clearNotifications,
      login,
      register,
      logout,
      updateUserStatus,
      updateProfile,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      toggleWishlist,
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
      deleteCoupon
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
