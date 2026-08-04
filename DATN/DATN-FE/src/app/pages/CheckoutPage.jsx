import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router";
import { CreditCard, Truck, AlertTriangle, ShieldCheck, Check, Loader2, X, Search, ShieldAlert, ExternalLink } from "lucide-react";
import { useApp } from "../context/AppContext";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { toast } from "sonner";
import { mailSmsService } from "../services/mailSmsService";
import { request } from "../services/apiClient";
import { api } from "../services/api";
import { getCompletedSpending, getMembershipTier } from "../utils/membership";

export function CheckoutPage() {
  const navigate = useNavigate();
  const {
    cart = [],
    products = [],
    addressBook = [],
    createOrder,
    clearCart,
    loadUserData,
    applyCoupon,
    currentUser,
    orders = [],
    addNotification,
    openLoginModal
  } = useApp();

  const parseCoordsFromAddress = (addressStr) => {
    if (!addressStr) return null;
    const match = addressStr.match(/\[Định vị:\s*(-?\d+\.\d+),\s*(-?\d+\.\d+)\]/);
    if (match) {
      return {
        lat: parseFloat(match[1]),
        lng: parseFloat(match[2])
      };
    }
    return null;
  };

  const getCityCoords = (city) => {
    const name = (city || "").toLowerCase();
    if (name.includes("tphcm") || name.includes("hồ chí minh") || name.includes("hcm")) {
      return { lat: 10.7769, lng: 106.7009 };
    }
    if (name.includes("đà nẵng")) {
      return { lat: 16.0544, lng: 108.2022 };
    }
    if (name.includes("hải phòng")) {
      return { lat: 20.8449, lng: 106.6881 };
    }
    if (name.includes("cần thơ")) {
      return { lat: 10.0371, lng: 105.7882 };
    }
    return { lat: 21.0285, lng: 105.8542 };
  };

  const [checkoutSummary, setCheckoutSummary] = useState({
    subtotal: 0,
    shipping: 0,
    discount: 0,
    couponCode: "",
    total: 0
  });

  const [addressMode, setAddressMode] = useState("map");
  const [mapDisplayMode, setMapDisplayMode] = useState("leaflet");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [applyingCouponLoading, setApplyingCouponLoading] = useState(false);
  const [couponMessage, setCouponMessage] = useState({ text: "", type: "" });

  // Reward Points state (Real points based strictly on completed/successful orders)
  const userOrdersCount = (orders || []).filter(o => 
    (String(o.userId) === String(currentUser?.id) || (currentUser && o.customerName === currentUser.fullName)) &&
    (o.status === "completed" || o.status === "delivered" || (o.isPaid && o.status !== "cancelled" && o.status !== "returned"))
  ).length;
  const redeemedStorageKey = `foxstyle_redeemed_points_${currentUser?.id || currentUser?.username || 'guest'}`;
  const [redeemedPointsCount, setRedeemedPointsCount] = useState(() => {
    try {
      return Number(localStorage.getItem(redeemedStorageKey) || 0);
    } catch (e) {
      return 0;
    }
  });

  const rewardPointsAvailable = Math.max(0, userOrdersCount - redeemedPointsCount);
  const rewardPointsValue = rewardPointsAvailable * 100;
  const [useRewardPoints, setUseRewardPoints] = useState(false);

  const [shippingSettings, setShippingSettings] = useState({
    urban: 20000,
    suburban: 30000
  });
  const [vatRate, setVatRate] = useState(8);

  useEffect(() => {
    const fetchShippingSettings = async () => {
      try {
        const urbanRes = await request("/settings/key/urban_shipping_fee");
        const suburbanRes = await request("/settings/key/suburban_shipping_fee");
        const vatRes = await request("/settings/key/vat_tax_rate");
        
        const urbanVal = Number(urbanRes.data?.settingValue || urbanRes.settingValue || 20000);
        const suburbanVal = Number(suburbanRes.data?.settingValue || suburbanRes.settingValue || 30000);
        
        setShippingSettings({
          urban: urbanVal,
          suburban: suburbanVal
        });
        setVatRate(Number(vatRes.data?.settingValue || vatRes.settingValue || 8));
      } catch (err) {
        console.warn("Failed to load shipping settings from admin, using fallbacks:", err);
      }
    };
    fetchShippingSettings();
  }, []);

  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    ward: "",
    city: "Hà Nội",
    district: "",
    note: "",
  });

  // PayOS QR Modal states
  const [showQrModal, setShowQrModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(null);
  const [isCreatingPaymentLink, setIsCreatingPaymentLink] = useState(false);
  const [simulatedOrderId, setSimulatedOrderId] = useState("");
  const [qrCountdown, setQrCountdown] = useState(30);
  const [qrPaymentAmount, setQrPaymentAmount] = useState(0);
  const [payosData, setPayosData] = useState(null);
  const [isCheckingPayOS, setIsCheckingPayOS] = useState(false);

  // Lock background scroll when QR modal is open
  useEffect(() => {
    if (showQrModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showQrModal]);

  // PayOS Real-time Polling Effect
  useEffect(() => {
    let timer = null;
    let countdownInterval = null;

    if (showQrModal && simulatedOrderId) {
      const orderCodeStr = simulatedOrderId.replace("DH", "");
      const orderCodeNum = Number(orderCodeStr);

      if (orderCodeNum) {
        timer = setInterval(async () => {
          try {
            const res = await api.payments.checkPayOSStatus(orderCodeNum);
            if (res && res.data && res.data.status === "PAID") {
              clearInterval(timer);
              clearCart();
              await loadUserData(products);
              setShowQrModal(false);

              // Trigger Email delivery via Nodemailer + SMTP ONLY AFTER payment is successful!
              try {
                await mailSmsService.sendOrderEmail({
                  id: simulatedOrderId,
                  recipientEmail: formData.email,
                  total: qrPaymentAmount,
                  items: cart,
                  paymentMethod: "TRANSFER"
                });
              } catch (e) {}

              toast.success(`PayOS: Đã xác nhận thanh toán thành công cho đơn hàng ${simulatedOrderId}! Email xác nhận đã gửi!`);
              addNotification(
                "Thanh toán thành công",
                `Đơn ${simulatedOrderId} đã thanh toán thành công ${Number(qrPaymentAmount || 0).toLocaleString("vi-VN")}đ và đang chờ FoxStyle xác nhận.`,
                "success",
                { id: `order_checkout_${simulatedOrderId}`, actionUrl: `/orders?search=${simulatedOrderId}`, orderId: simulatedOrderId }
              );
              alert(`PayOS: Thanh toán chuyển khoản thành công cho đơn hàng ${simulatedOrderId}! Email xác nhận đã được gửi về hộp thư của bạn!`);
              navigate("/orders");
            }
          } catch (err) {
            console.error("PayOS status check error:", err);
          }
        }, 3000);
      }

      countdownInterval = setInterval(() => {
        setQrCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            if (timer) clearInterval(timer);
            const expiredOrderId = Number(String(simulatedOrderId).replace("DH", ""));
            if (expiredOrderId) {
              api.orders.cancelOrder(expiredOrderId, "Phiên thanh toán QR đã hết hạn sau 30 giây")
                .then(() => {
                  setShowQrModal(false);
                  setPayosData(null);
                  toast.error("Phiên thanh toán đã hết hạn. Đơn tạm đã được hủy và tồn kho đã được hoàn lại.");
                  loadUserData(products);
                })
                .catch((error) => console.error("Không thể hủy phiên thanh toán hết hạn:", error));
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [showQrModal, simulatedOrderId, navigate]);

  const [pinnedCoords, setPinnedCoords] = useState(null);

  const checkoutMapRef = useRef(null);
  const checkoutMarkerRef = useRef(null);
  const hasPrefilledRef = useRef(false);
  const prevUserIdRef = useRef(null);

  // nominatim geocoding state
  const [searchingCoords, setSearchingCoords] = useState(false);



  // Search Address on OpenStreetMap
  const searchAddressOnMap = async () => {
    if (!formData.address.trim()) {
      alert("Vui lòng điền số nhà/tên đường trước khi tìm!");
      return;
    }
    setSearchingCoords(true);
    try {
      const query = `${formData.address}, ${formData.ward}, ${formData.city}, Việt Nam`;
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&accept-language=vi&countrycodes=vn&q=${encodeURIComponent(query)}&limit=1`);
      const data = await res.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const parsedLat = parseFloat(lat);
        const parsedLng = parseFloat(lon);
        
        setPinnedCoords({ lat: parsedLat, lng: parsedLng });
        
        if (checkoutMapRef.current) {
          checkoutMapRef.current.setView([parsedLat, parsedLng], 16);
        }
        
        const redPinIcon = L.divIcon({
          className: "customer-pin-icon",
          html: `
            <div class="relative flex flex-col items-center animate-bounce">
              <div class="w-8 h-8 rounded-full bg-rose-600 border-2 border-white flex items-center justify-center shadow-lg text-white font-bold">
                📍
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 32]
        });

        if (checkoutMarkerRef.current) {
          checkoutMarkerRef.current.setLatLng([parsedLat, parsedLng]);
        } else {
          checkoutMarkerRef.current = L.marker([parsedLat, parsedLng], { icon: redPinIcon, draggable: true }).addTo(checkoutMapRef.current);
          checkoutMarkerRef.current.on("dragend", () => {
            const pos = checkoutMarkerRef.current.getLatLng();
            setPinnedCoords({ lat: pos.lat, lng: pos.lng });
          });
        }
        toast.success("Bản đồ đã tự động định vị đến vị trí của bạn!");
      } else {
        alert("Không tìm thấy địa chỉ cụ thể trên bản đồ. Bạn hãy ghim thủ công bằng cách click trực tiếp vào bản đồ bên dưới.");
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối dịch vụ bản đồ. Vui lòng ghim thủ công.");
    } finally {
      setSearchingCoords(false);
    }
  };

  // Initialize and auto-invalidate Leaflet Map with robust cleanup
  useEffect(() => {
    const timer = setTimeout(() => {
      const mapContainer = document.getElementById("checkout-leaflet-map");
      if (!mapContainer) return;

      // Clean up previous Leaflet instance if present
      if (checkoutMapRef.current) {
        try {
          checkoutMapRef.current.remove();
        } catch (e) {}
        checkoutMapRef.current = null;
      }
      if (mapContainer._leaflet_id) {
        delete mapContainer._leaflet_id;
      }

      const initialLat = pinnedCoords?.lat || 16.051816;
      const initialLng = pinnedCoords?.lng || 108.183025;

      try {
        const map = L.map("checkout-leaflet-map", {
          center: [initialLat, initialLng],
          zoom: 15,
          zoomControl: true
        });
        checkoutMapRef.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        const redPinIcon = L.divIcon({
          className: "customer-pin-icon",
          html: `
            <div class="relative flex flex-col items-center animate-bounce">
              <div class="w-8 h-8 rounded-full bg-rose-600 border-2 border-white flex items-center justify-center shadow-lg text-white font-bold">
                📍
              </div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 32]
        });

        const marker = L.marker([initialLat, initialLng], { icon: redPinIcon, draggable: true }).addTo(map);
        checkoutMarkerRef.current = marker;

        marker.on("dragend", () => {
          const pos = marker.getLatLng();
          setPinnedCoords({ lat: pos.lat, lng: pos.lng });
        });

        map.on("click", (e) => {
          const { lat, lng } = e.latlng;
          setPinnedCoords({ lat, lng });
          marker.setLatLng([lat, lng]);
        });

        [100, 300, 600].forEach(delay => {
          setTimeout(() => {
            if (checkoutMapRef.current) {
              checkoutMapRef.current.invalidateSize();
            }
          }, delay);
        });
      } catch (err) {
        console.warn("Leaflet map init warning", err);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [formData.address, selectedAddressId]);

  // Sync map center and marker when pinnedCoords updates
  useEffect(() => {
    if (checkoutMapRef.current && pinnedCoords && pinnedCoords.lat && pinnedCoords.lng) {
      checkoutMapRef.current.setView([pinnedCoords.lat, pinnedCoords.lng], 15);
      if (checkoutMarkerRef.current) {
        checkoutMarkerRef.current.setLatLng([pinnedCoords.lat, pinnedCoords.lng]);
      }
      setTimeout(() => {
        if (checkoutMapRef.current) {
          checkoutMapRef.current.invalidateSize();
        }
      }, 100);
    }
  }, [pinnedCoords]);

  // Debounced auto geocoding when address fields change while customer types
  useEffect(() => {
    if (addressMode !== "manual") return;
    if (!formData.address || formData.address.length < 5) return;

    const delayTimer = setTimeout(() => {
      searchAddressOnMap();
    }, 1500);

    return () => clearTimeout(delayTimer);
  }, [formData.address, formData.ward, formData.city, addressMode]);

  // Leaflet map container layout fix when showing
  useEffect(() => {
    if (addressMode === "map" && checkoutMapRef.current) {
      setTimeout(() => {
        checkoutMapRef.current.invalidateSize();
      }, 100);
    }
  }, [addressMode]);

  // Reverse geocoding when pinnedCoords changes (only in map mode)
  useEffect(() => {
    if (!pinnedCoords || addressMode !== "map") return;

    const performReverseGeocode = async () => {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&accept-language=vi&lat=${pinnedCoords.lat}&lon=${pinnedCoords.lng}`);
        const data = await res.json();
        if (data && data.address) {
          const addr = data.address;
          
          const city = addr.city || addr.state || addr.province || "Hà Nội";
          const ward = addr.quarter || addr.village || addr.town || addr.commune ||
            addr.suburb || addr.city_district || addr.district || "";

          let road = addr.road || addr.pedestrian || addr.highway || addr.neighbourhood || "";
          if (addr.house_number) {
            road = `${addr.house_number} ${road}`;
          }
          if (!road) {
            road = data.name || data.display_name.split(',')[0] || "";
          }
          
          setFormData(prev => ({
            ...prev,
            address: road,
            ward: ward,
            // Backend cũ vẫn bắt buộc district; dùng phường/xã để tương thích mô hình 2 cấp.
            district: ward,
            city: city
          }));
        }
      } catch (err) {
        console.error("Reverse geocoding error:", err);
      }
    };

    const timer = setTimeout(() => {
      performReverseGeocode();
    }, 600);

    return () => clearTimeout(timer);
  }, [pinnedCoords, addressMode]);

  // Load checkout summary / coupon and prefill form on mount
  useEffect(() => {
    const saved = localStorage.getItem("foxstyle_checkout_summary");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.couponCode) {
          setAppliedCoupon({
            code: parsed.couponCode,
            discount: parsed.discount
          });
        }
      } catch (e) {
        console.error("Error loading saved coupon:", e);
      }
    }
  }, []);

  // Reset hasPrefilledRef if currentUser changes
  useEffect(() => {
    if (currentUser?.id !== prevUserIdRef.current) {
      hasPrefilledRef.current = false;
      prevUserIdRef.current = currentUser?.id;
    }
  }, [currentUser]);

  // Prefill form if user is logged in
  useEffect(() => {
    if (currentUser && !hasPrefilledRef.current) {
      setFormData(prev => ({
        ...prev,
        fullName: currentUser.fullName || "",
        phone: currentUser.phone || "",
        email: currentUser.email || "",
      }));
    }

    // Select default address if available in addressBook
    if (addressBook.length > 0 && !hasPrefilledRef.current) {
      const defaultAddr = addressBook.find(a => a.isDefault) || addressBook[0];
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id.toString());
        setFormData(prev => ({
          ...prev,
          address: defaultAddr.detailAddress,
          city: defaultAddr.city,
          district: defaultAddr.district,
          ward: defaultAddr.ward || "",
          fullName: defaultAddr.fullName,
          phone: defaultAddr.phone
        }));

        // Parse and set coordinates for mapping (fallback to city coords if not embedded)
        const coords = parseCoordsFromAddress(defaultAddr.detailAddress) || getCityCoords(defaultAddr.city);
        setPinnedCoords(coords);
        hasPrefilledRef.current = true;
      }
    }
  }, [currentUser, addressBook]);

  // Recalculate summary dynamically (Distance based shipping fee)
  useEffect(() => {
    const subtotal = cart.reduce((sum, item) => {
      const price = Number(item?.product?.price) || 0;
      const quantity = Number(item?.quantity) || 0;
      return sum + price * quantity;
    }, 0);

    const getDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Bán kính Trái Đất (km)
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    // Tọa độ kho hàng trung tâm FoxStyle (Trường Chinh, Cẩm Lệ, Đà Nẵng: 16.0542, 108.1835)
    let distance = null;
    const STORE_LAT = 16.0542;
    const STORE_LNG = 108.1835;

    if (pinnedCoords && pinnedCoords.lat && pinnedCoords.lng) {
      distance = getDistance(pinnedCoords.lat, pinnedCoords.lng, STORE_LAT, STORE_LNG);
    } else {
      const city = (formData.city || "").toLowerCase().trim();
      const district = (formData.ward || formData.district || "").toLowerCase().trim();
      const DANANG_NEAR = ["cẩm lệ", "thanh khê", "hải châu", "liên chiểu", "sơn trà", "ngũ hành sơn", "hòa an"];
      const HANOI_NEAR = ["hoàn kiếm", "ba đình", "hai bà trưng", "đống đa", "cầu giấy", "tây hồ", "thanh xuân", "long biên"];
      const HCM_NEAR = ["quận 1", "quận 3", "quận 5", "quận 10", "bình thạnh", "phú nhuận", "tân bình"];

      if (city.includes("đà nẵng") || city.includes("da nang")) {
        const isNear = DANANG_NEAR.some(d => district.includes(d) || (formData.address || "").toLowerCase().includes(d));
        distance = isNear ? 1.5 : 8.0;
      } else if (city.includes("hà nội")) {
        const isNear = HANOI_NEAR.some(d => district.includes(d));
        distance = isNear ? 3.5 : 12.0;
      } else if (city.includes("hồ chí minh") || city.includes("tphcm")) {
        const isNear = HCM_NEAR.some(d => district.includes(d));
        distance = isNear ? 4.0 : 15.0;
      } else {
        distance = 35.0;
      }
    }

    let shippingFee = 0;

    if (currentUser && (currentUser.role === "admin" || currentUser.role === "staff")) {
      shippingFee = (distance && distance <= 5) ? 0 : (shippingSettings.suburban || 30000);
    } else if (subtotal >= 300000) {
      shippingFee = 0; // Miễn phí giao hàng cho đơn từ 300k
    } else {
      // Phí vận chuyển tính theo khoảng cách (quãng đường):
      // 3 km đầu tiên: 15.000đ (hoặc urbanFee)
      // Sau 3 km: cộng 3.000đ / km bổ sung
      const baseFee = Number(shippingSettings.urban) || 15000;
      const baseKm = 3;
      const extraPerKm = 3000;

      if (distance <= baseKm) {
        shippingFee = baseFee;
      } else {
        const extraKm = Math.ceil(distance - baseKm);
        shippingFee = baseFee + extraKm * extraPerKm;
      }

      // Giới hạn phí ship tối đa 80.000đ cho đơn bình thường
      shippingFee = Math.min(80000, Math.max(baseFee, shippingFee));
    }

    const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
    const membershipTier = getMembershipTier(getCompletedSpending(orders, currentUser?.id));
    const vipDiscount = Math.round(subtotal * membershipTier.discountPercent / 100);
    const pointsDiscountAmount = useRewardPoints ? Math.min(rewardPointsValue, subtotal) : 0;
    const taxableAmount = Math.max(0, subtotal - discountAmount - vipDiscount - pointsDiscountAmount);
    const vat = Math.round(taxableAmount * vatRate / 100);

    const finalTotal = Math.max(0, subtotal + vat + shippingFee - discountAmount - vipDiscount - pointsDiscountAmount);

    setCheckoutSummary({
      subtotal,
      shipping: shippingFee,
      discount: discountAmount,
      vat,
      pointsDiscount: pointsDiscountAmount,
      couponCode: appliedCoupon ? appliedCoupon.code : "",
      total: finalTotal,
      distanceKm: distance ? distance.toFixed(1) : null
    });
  }, [cart, formData.city, formData.district, pinnedCoords, addressMode, currentUser, appliedCoupon, shippingSettings, vatRate, orders, useRewardPoints]);

  // Handle address change selection
  const handleAddressChange = (addrId) => {
    setSelectedAddressId(addrId);
    if (addrId === "new") {
      setFormData(prev => ({
        ...prev,
        address: "",
        district: "",
        ward: "",
        city: "Hà Nội",
        fullName: currentUser ? currentUser.fullName : "",
        phone: currentUser ? currentUser.phone : ""
      }));
    } else {
      const selected = addressBook.find(a => a.id === Number(addrId));
      if (selected) {
        setFormData(prev => ({
          ...prev,
          fullName: selected.fullName,
          phone: selected.phone,
          address: selected.detailAddress,
          city: selected.city,
          district: selected.district,
          ward: selected.ward || ""
        }));

        // Parse and set coordinates for mapping (fallback to city coords if not embedded)
        const coords = parseCoordsFromAddress(selected.detailAddress) || getCityCoords(selected.city);
        setPinnedCoords(coords);
        if (checkoutMapRef.current && coords) {
          checkoutMapRef.current.setView([coords.lat, coords.lng], 13);
          if (checkoutMarkerRef.current) {
            checkoutMarkerRef.current.setLatLng([coords.lat, coords.lng]);
          }
        }
      }
    }
  };

  const validateAndGetCoords = async () => {
    const isDetailed = (address = {}) => Boolean(
      address.road || address.pedestrian || address.residential || address.neighbourhood
      || address.suburb || address.quarter || address.village || address.hamlet
    );
    try {
      let result;
      if (addressMode === "map" && pinnedCoords) {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&accept-language=vi&lat=${pinnedCoords.lat}&lon=${pinnedCoords.lng}`);
        if (!res.ok) throw new Error("Dịch vụ xác minh địa chỉ không phản hồi");
        result = await res.json();
      } else {
        const query = `${formData.address}, ${formData.ward}, ${formData.district || ""}, ${formData.city}, Việt Nam`;
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&accept-language=vi&countrycodes=vn&q=${encodeURIComponent(query)}&limit=1`);
        if (!res.ok) throw new Error("Dịch vụ xác minh địa chỉ không phản hồi");
        const data = await res.json();
        result = data?.[0];
      }

      const address = result?.address || {};
      const lat = Number(result?.lat);
      const lng = Number(result?.lon);
      const valid = result && Number.isFinite(lat) && Number.isFinite(lng)
        && address.country_code === "vn" && lat >= 8 && lat <= 24 && lng >= 102 && lng <= 110
        && isDetailed(address);
      if (!valid) {
        alert("Địa chỉ không xác minh được hoặc chưa đủ chi tiết. Vui lòng nhập đúng số nhà/đường, phường/xã, tỉnh/thành hoặc ghim lại vị trí chính xác.");
        return null;
      }
      const verifiedCoords = { lat, lng };
      setPinnedCoords(verifiedCoords);
      return verifiedCoords;
    } catch (err) {
      console.error("Address validation error:", err);
      alert("Không thể xác minh địa chỉ lúc này. Vui lòng kiểm tra kết nối và thử lại; hệ thống chưa tạo đơn hàng.");
      return null;
    }
  };

  const executeConfirmAction = async () => {
    const isAddressValid = addressMode === "map" ? !!pinnedCoords : (!!formData.address.trim() && !!formData.city.trim() && !!formData.ward.trim());
    if (!isAddressValid) return;

    const coordsResult = await validateAndGetCoords();
    if (!coordsResult) return;

    const orderData = {
      items: cart,
      userId: currentUser ? currentUser.id : null,
      recipientName: formData.fullName,
      phone: formData.phone,
      address: `${formData.address}, ${formData.ward}, ${formData.city} [Định vị: ${coordsResult.lat.toFixed(6)}, ${coordsResult.lng.toFixed(6)}]`,
      email: formData.email,
      subtotal: checkoutSummary.subtotal,
      shipping: checkoutSummary.shipping,
      discount: checkoutSummary.discount,
      couponCode: checkoutSummary.couponCode,
      total: checkoutSummary.total,
      paymentMethod,
      note: formData.note
    };

    if (showConfirmModal === "cod") {
      try {
        if (useRewardPoints && rewardPointsAvailable > 0) {
          const newRedeemed = redeemedPointsCount + rewardPointsAvailable;
          setRedeemedPointsCount(newRedeemed);
          localStorage.setItem(redeemedStorageKey, String(newRedeemed));
        }

        const finalId = await createOrder(orderData);
        alert(`Đã tiếp nhận đơn ${finalId}. FoxStyle sẽ xác nhận và chuẩn bị hàng; bạn có thể theo dõi trạng thái trong mục Đơn hàng.`);
        
        // Trigger Email delivery via Nodemailer + SMTP
        await mailSmsService.sendOrderEmail({
          ...orderData,
          id: finalId,
          recipientEmail: formData.email
        });

        setShowConfirmModal(null);
        navigate("/orders");
      } catch (err) {
        alert(err.message || "Đặt hàng thất bại. Vui lòng thử lại!");
      }
    } else if (showConfirmModal === "transfer") {
      try {
        if (useRewardPoints && rewardPointsAvailable > 0) {
          const newRedeemed = redeemedPointsCount + rewardPointsAvailable;
          setRedeemedPointsCount(newRedeemed);
          localStorage.setItem(redeemedStorageKey, String(newRedeemed));
        }

        setIsCreatingPaymentLink(true);
        const finalId = await createOrder({
          ...orderData,
          isPaid: false
        });

        const orderIdDb = Number(finalId.replace("DH", ""));

        // Transfer order created, email will be sent ONLY AFTER payment is successful

        setSimulatedOrderId(finalId);
        setQrPaymentAmount(orderData.total);

        // Gọi Backend PayOS SDK khởi tạo Link & QR Code
        try {
          const res = await api.payments.createPayOSLink(orderIdDb);
          if (res && res.data) {
            setPayosData(res.data);
          }
        } catch (payosErr) {
          console.warn("PayOS API connection fallback:", payosErr);
        }

        setShowConfirmModal(null);
        setQrCountdown(30);
        setShowQrModal(true);
      } catch (err) {
        alert(err.message || "Đặt hàng chuyển khoản thất bại. Vui lòng thử lại!");
      } finally {
        setIsCreatingPaymentLink(false);
      }
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Giỏ hàng đang trống! Vui lòng thêm sản phẩm trước.");
      return;
    }

    const isAddressValid = addressMode === "map" ? !!pinnedCoords : (!!formData.address.trim() && !!formData.city.trim() && !!formData.ward.trim());
    if (!isAddressValid) {
      if (addressMode === "map") {
        alert("Vui lòng ghim vị trí giao hàng chính xác của bạn trên bản đồ để đặt hàng!");
      } else {
        alert("Vui lòng điền đầy đủ địa chỉ giao hàng (Số nhà/đường, Quận/huyện, Thành phố)!");
      }
      return;
    }

    const coordsResult = await validateAndGetCoords();
    if (!coordsResult) return;

    // Trigger popup confirmation modal before submitting
    if (paymentMethod === "transfer") {
      setShowConfirmModal("transfer");
    } else {
      setShowConfirmModal("cod");
    }
  };

  // Callback kiểm tra thanh toán chuyển khoản PayOS
  const simulatePaymentSuccess = async () => {
    if (!simulatedOrderId) return;
    setIsCheckingPayOS(true);
    try {
      const orderCodeNum = Number(simulatedOrderId.replace("DH", ""));
      const res = await api.payments.checkPayOSStatus(orderCodeNum);

      if (res && res.data && res.data.status === "PAID") {
        clearCart();
        await loadUserData(products);
        setShowQrModal(false);
        toast.success(`PayOS: Đã ghi nhận thanh toán thành công cho đơn hàng ${simulatedOrderId}!`);
        addNotification(
          "Thanh toán thành công",
          `Đơn ${simulatedOrderId} đã thanh toán thành công ${Number(qrPaymentAmount || 0).toLocaleString("vi-VN")}đ và đang chờ FoxStyle xác nhận.`,
          "success",
          { id: `order_checkout_${simulatedOrderId}`, actionUrl: `/orders?search=${simulatedOrderId}`, orderId: simulatedOrderId }
        );
        alert(`PayOS: Thanh toán chuyển khoản thành công cho đơn hàng ${simulatedOrderId}!`);
        navigate("/orders");
      } else {
        toast.info("Chưa ghi nhận tiền vào tài khoản PayOS.");
        alert("Hệ thống chưa nhận được tín hiệu chuyển tiền thành công từ PayOS. Bạn vui lòng quét mã và chuyển tiền từ App Ngân Hàng rồi nhấn lại nút này!");
      }
    } catch (err) {
      alert(err.message || "Lỗi kiểm tra trạng thái giao dịch PayOS.");
    } finally {
      setIsCheckingPayOS(false);
    }
  };

  const confirmOrderWithoutPayment = async () => {
    const isAddressValid = addressMode === "map" ? !!pinnedCoords : (!!formData.address.trim() && !!formData.city.trim() && !!formData.ward.trim());
    if (!isAddressValid) {
      if (addressMode === "map") {
        alert("Vui lòng ghim vị trí giao hàng chính xác của bạn trên bản đồ để đặt hàng!");
      } else {
        alert("Vui lòng điền đầy đủ địa chỉ giao hàng (Số nhà/đường, Quận/huyện, Thành phố)!");
      }
      return;
    }

    const coordsResult = await validateAndGetCoords();
    if (!coordsResult) return;

    const orderData = {
      items: cart,
      userId: currentUser ? currentUser.id : null,
      recipientName: formData.fullName,
      phone: formData.phone,
      address: `${formData.address}, ${formData.ward}, ${formData.city} [Định vị: ${coordsResult.lat.toFixed(6)}, ${coordsResult.lng.toFixed(6)}]`,
      email: formData.email,
      subtotal: checkoutSummary.subtotal,
      shipping: checkoutSummary.shipping,
      discount: checkoutSummary.discount,
      couponCode: checkoutSummary.couponCode,
      total: checkoutSummary.total,
      paymentMethod,
      note: formData.note
    };

    try {
      const finalId = await createOrder({
        ...orderData,
        id: simulatedOrderId,
        isPaid: false
      });

      // Trigger Email delivery via Nodemailer + SMTP
      await mailSmsService.sendOrderEmail({
        ...orderData,
        id: finalId || simulatedOrderId,
        recipientEmail: formData.email
      });

      setShowQrModal(false);
      alert(`Đặt hàng thành công! Đơn hàng ${finalId || simulatedOrderId} của bạn ở trạng thái chờ thanh toán chuyển khoản.`);
      navigate("/orders");
    } catch (err) {
      alert(err.message || "Không thể tạo đơn hàng.");
    }
  };

  const handleApplyCouponCheckout = async () => {
    setCouponMessage({ text: "", type: "" });
    if (!couponCodeInput.trim()) {
      setCouponMessage({ text: "Vui lòng nhập mã giảm giá!", type: "error" });
      return;
    }

    setApplyingCouponLoading(true);
    try {
      const res = await applyCoupon(couponCodeInput, checkoutSummary.subtotal);
      if (res.success) {
        setAppliedCoupon({
          code: couponCodeInput,
          discount: res.discount
        });
        setCouponMessage({ text: `Áp dụng thành công! Giảm ${res.discount.toLocaleString('vi-VN')}đ`, type: "success" });
        setCouponCodeInput("");
      } else {
        setCouponMessage({ text: res.message || "Mã giảm giá không hợp lệ!", type: "error" });
      }
    } catch (err) {
      setCouponMessage({ text: "Mã giảm giá không hợp lệ hoặc đã hết hạn!", type: "error" });
    } finally {
      setApplyingCouponLoading(false);
    }
  };

  const isAddressValid = addressMode === "map"
    ? !!pinnedCoords
    : (!!formData.address.trim() && !!formData.city.trim() && !!formData.ward.trim());

  return (
    <div className="bg-gray-50 min-h-screen py-8 relative">
      
      {/* Loading Overlay */}
      {isCreatingPaymentLink && (
        <div className="fixed inset-0 bg-black/60 z-[999] flex flex-col items-center justify-center text-white backdrop-blur-sm">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500 mb-4" />
          <h2 className="text-xl font-bold">Đang kết nối cổng thanh toán PayOS...</h2>
          <p className="text-gray-300 text-sm mt-1">Vui lòng chờ giây lát, không tắt trình duyệt.</p>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6 tracking-tight">Thanh toán</h1>

        {!currentUser ? (
          <div className="bg-white p-10 rounded-3xl text-center shadow-md border border-gray-100 max-w-xl mx-auto my-8">
            <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Yêu cầu đăng nhập tài khoản</h2>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Bạn cần đăng nhập trước khi đặt hàng để hệ thống lưu lịch sử đơn hàng, áp dụng mã giảm giá và gửi email theo dõi vận chuyển.
            </p>
            <div className="space-y-3">
              <button
                type="button"
                onClick={openLoginModal}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-md transition text-sm cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🔑 Đăng nhập / Đăng ký ngay</span>
              </button>
              <p className="text-xs text-gray-400 font-semibold pt-2">
                Hoặc bấm vào nút <strong>"Đăng nhập"</strong> góc phải thanh điều hướng trên cùng để nhập tài khoản thử nghiệm.
              </p>
            </div>
          </div>
        ) : cart.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl text-center shadow-sm">
            <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Giỏ hàng trống</h2>
            <p className="text-gray-500 mb-6">Bạn không thể thanh toán khi giỏ hàng trống.</p>
            <Link to="/products" className="bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl">Quay lại mua sắm</Link>
          </div>
        ) : (
          <form onSubmit={handleOrderSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Details & Payment */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Shipping Details */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center space-x-2 mb-6 pb-3 border-b border-gray-100">
                    <Truck className="h-6 w-6 text-orange-600" />
                    <h2 className="text-xl font-bold text-gray-800">Thông tin nhận hàng</h2>
                  </div>

                  {/* Address Selection Dropdown if Logged In */}
                  {currentUser && addressBook.length > 0 && (
                    <div className="mb-6 bg-orange-50/60 border border-orange-200/80 p-4.5 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-black uppercase tracking-wider text-orange-950">
                          📍 Sổ địa chỉ giao hàng của bạn
                        </label>
                        {selectedAddressId !== "new" && (
                          <button
                            type="button"
                            onClick={() => handleAddressChange("new")}
                            className="text-xs font-bold text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span>+ Nhập địa chỉ mới / Ghim bản đồ</span>
                          </button>
                        )}
                      </div>

                      <select
                        value={selectedAddressId}
                        onChange={(e) => handleAddressChange(e.target.value)}
                        className="w-full bg-white px-3.5 py-2.5 border border-orange-300 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-xs"
                      >
                        {addressBook.map(addr => (
                          <option key={addr.id} value={addr.id}>
                            {addr.fullName} ({addr.phone}) - {addr.detailAddress}, {addr.ward || addr.district}, {addr.city} {addr.isDefault ? "[Mặc định]" : ""}
                          </option>
                        ))}
                        <option value="new">+ Nhập địa chỉ giao hàng mới hoặc ghim vị trí trên bản đồ...</option>
                      </select>

                      {selectedAddressId !== "new" && (
                        <div className="pt-2 border-t border-orange-200/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-orange-900">
                          <div>
                            <p className="font-extrabold text-sm text-gray-900">{formData.fullName} • <span className="font-semibold text-gray-700">{formData.phone}</span></p>
                            <p className="text-gray-600 mt-0.5">{formData.address}, {formData.ward}, {formData.city}</p>
                          </div>
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-800 font-extrabold rounded-full shrink-0">
                            ✓ Địa chỉ đã chọn
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Manual Inputs & Map Section: Only shown if user selects 'new' or has no saved address */}
                  {(selectedAddressId === "new" || !currentUser || addressBook.length === 0) && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                      {/* Toggle between Manual and Map address mode */}
                      <div className="bg-gray-50 p-1.5 rounded-xl border border-gray-100 flex gap-2">
                        <button
                          type="button"
                          onClick={() => setAddressMode("manual")}
                          className={`flex-1 text-center py-2.5 text-xs font-black rounded-lg transition-all duration-300 ${
                            addressMode === "manual"
                              ? "bg-white text-orange-600 shadow-sm border border-gray-200"
                              : "text-gray-500 hover:text-gray-800"
                          }`}
                        >
                          📝 Nhập địa chỉ thủ công
                        </button>
                        <button
                          type="button"
                          onClick={() => setAddressMode("map")}
                          className={`flex-1 text-center py-2.5 text-xs font-black rounded-lg transition-all duration-300 ${
                            addressMode === "map"
                              ? "bg-white text-orange-600 shadow-sm border border-gray-200"
                              : "text-gray-500 hover:text-gray-800"
                          }`}
                        >
                          📍 Ghim vị trí trên Bản đồ
                        </button>
                      </div>

                      {/* Manual input inputs */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Họ và tên *</label>
                          <input
                            type="text"
                            required
                            value={formData.fullName}
                            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                            placeholder="Nguyễn Văn A"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                            Số điện thoại *
                          </label>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="0123 456 789"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Địa chỉ email</label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="example@email.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>

                        {addressMode === "map" && (
                          <div className="md:col-span-2 p-3.5 bg-blue-50 border border-blue-100 rounded-2xl text-xs text-blue-700 font-bold leading-relaxed">
                            💡 Các thông tin địa chỉ bên dưới sẽ được tự động điền khi bạn ghim vị trí trên bản đồ ở phía dưới. Bạn có thể chỉnh sửa lại sau đó nếu muốn cụ thể hơn.
                          </div>
                        )}

                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 flex items-center justify-between">
                            <span>Địa chỉ nhà (Số nhà, ngõ ngách, tên đường) *</span>
                            <button
                              type="button"
                              onClick={searchAddressOnMap}
                              disabled={searchingCoords}
                              className="text-[10px] text-blue-600 hover:text-blue-700 font-extrabold uppercase flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-full border border-blue-200 transition cursor-pointer"
                            >
                              {searchingCoords ? (
                                <>
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                  Đang định vị...
                                </>
                              ) : (
                                <>
                                  <Search className="h-3 w-3" />
                                  🔍 Định vị nhanh trên bản đồ
                                </>
                              )}
                            </button>
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Ví dụ: 123 Đường Trần Hưng Đạo"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Thành phố *</label>
                          <select
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value, district: "", ward: "" })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                          >
                            <option value="Hà Nội">Hà Nội</option>
                            <option value="Đà Nẵng">Đà Nẵng</option>
                            <option value="TP HCM">TP HCM</option>
                            <option value="Hải Phòng">Hải Phòng</option>
                            <option value="Cần Thơ">Cần Thơ</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Phường / Xã *</label>
                          <input
                            type="text"
                            required
                            value={formData.ward}
                            onChange={(e) => setFormData({ ...formData, ward: e.target.value, district: e.target.value })}
                            placeholder="Phường Hòa An"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Ghi chú giao hàng</label>
                          <textarea
                            value={formData.note}
                            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                            rows={3}
                            placeholder="Ví dụ: Giao hàng vào giờ hành chính..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Leaflet Map for Pinning Location (ALWAYS MOUNTED IN DOM) */}
                  <div className="mt-6 border-t border-gray-100 pt-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-black uppercase tracking-wider text-gray-700">
                        📍 Bản đồ định vị vị trí giao hàng (FoxStyle Đà Nẵng GPS)
                      </label>
                      {pinnedCoords && (
                        <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                          ✓ Đã định vị chính xác
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-gray-500 font-medium">
                        Bản đồ tương tác tự động cập nhật vị trí theo địa chỉ bạn chọn. Bạn có thể click chọn hoặc kéo thả điểm ghim màu đỏ để định vị lại.
                      </p>
                      
                      {/* Dual Map View Mode Selector */}
                      <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl shrink-0">
                        <button
                          type="button"
                          onClick={() => setMapDisplayMode("leaflet")}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition cursor-pointer ${
                            mapDisplayMode === "leaflet"
                              ? "bg-white text-orange-600 shadow-xs border border-gray-200"
                              : "text-gray-500 hover:text-gray-900"
                          }`}
                        >
                          🗺️ Leaflet
                        </button>
                        <button
                          type="button"
                          onClick={() => setMapDisplayMode("google")}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition cursor-pointer ${
                            mapDisplayMode === "google"
                              ? "bg-white text-orange-600 shadow-xs border border-gray-200"
                              : "text-gray-500 hover:text-gray-900"
                          }`}
                        >
                          🛰️ Google Maps Live
                        </button>
                      </div>
                    </div>
                    
                    {/* Leaflet Interactive Map */}
                    <div
                      id="checkout-leaflet-map"
                      className={`w-full rounded-2xl border border-gray-200 shadow-inner relative overflow-hidden bg-gray-100 ${
                        mapDisplayMode === "leaflet" ? "block" : "hidden"
                      }`}
                      style={{ height: "320px", minHeight: "320px", width: "100%", zIndex: 1 }}
                    />

                    {/* Google Maps Live GPS Satellite Embed */}
                    {mapDisplayMode === "google" && (
                      <div className="w-full h-80 rounded-2xl border border-gray-200 shadow-inner overflow-hidden relative">
                        <iframe
                          title="Google Maps Live GPS"
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          loading="lazy"
                          allowFullScreen
                          src={`https://maps.google.com/maps?q=${pinnedCoords?.lat || 16.051816},${pinnedCoords?.lng || 108.183025}&t=&z=16&hl=vi&ie=UTF8&iwloc=&output=embed`}
                        />
                      </div>
                    )}
                    
                    <div className="p-3.5 rounded-xl border flex items-center justify-between text-xs font-bold transition duration-300 bg-white">
                      {pinnedCoords ? (
                        <div className="text-green-600 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                          <span>Đã định vị thành công! Tọa độ: {pinnedCoords.lat.toFixed(6)}, {pinnedCoords.lng.toFixed(6)}</span>
                        </div>
                      ) : (
                        <div className="text-rose-500 flex items-center gap-1.5 animate-pulse">
                          <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                          <span>Chưa xác định vị trí! Vui lòng click chọn điểm trên bản đồ để tiếp tục đặt hàng.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ViettelPost Courier Partner Selection & Distance Fee */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                  <div className="flex items-center space-x-2 pb-3 border-b border-gray-100">
                    <Truck className="h-6 w-6 text-orange-600" />
                    <h2 className="text-xl font-bold text-gray-800">Đơn vị vận chuyển và phí giao hàng</h2>
                  </div>

                  <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center space-x-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-orange-600 text-white font-black text-xs flex items-center justify-center shadow-sm shrink-0">
                        VTP
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-gray-900 text-sm">ViettelPost Express (Chuyển Phát Nhanh)</h4>
                          <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                            Auto Distance GPS
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 font-semibold mt-0.5">
                          Tự động tính phí dựa theo khoảng cách quãng đường ({checkoutSummary.distanceKm ? `${checkoutSummary.distanceKm} km` : "Đang tính..."})
                        </p>
                      </div>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="font-black text-orange-600 text-base block">
                        {checkoutSummary.shipping === 0 ? "MIỄN PHÍ VẬN CHUYỂN" : `${checkoutSummary.shipping?.toLocaleString("vi-VN")}đ`}
                      </span>
                      {checkoutSummary.subtotal >= 300000 && (
                        <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          Đã giảm 100% phí vận chuyển cho đơn từ 300.000đ
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Payment Methods Selection */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center space-x-2 mb-6 pb-3 border-b border-gray-100">
                    <CreditCard className="h-6 w-6 text-orange-600" />
                    <h2 className="text-xl font-bold text-gray-800">Phương thức thanh toán</h2>
                  </div>

                  <div className="space-y-3">
                    {/* COD Option */}
                    <label className={`flex items-center space-x-3 p-4 border rounded-2xl cursor-pointer hover:bg-gray-50/50 transition ${
                      paymentMethod === "cod" ? "border-orange-500 bg-orange-50/20" : "border-gray-200"
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="text-orange-600 focus:ring-orange-500 h-4 w-4"
                      />
                      <div>
                        <div className="font-bold text-gray-800 text-sm">Thanh toán khi nhận hàng (COD)</div>
                        <div className="text-xs text-gray-500 mt-0.5">Quý khách sẽ thanh toán tiền mặt cho bưu tá khi nhận sản phẩm.</div>
                      </div>
                    </label>

                    {/* PayOS QR code Option */}
                    <label className={`flex items-center space-x-3 p-4 border rounded-2xl cursor-pointer hover:bg-gray-50/50 transition ${
                      paymentMethod === "transfer" ? "border-orange-500 bg-orange-50/20" : "border-gray-200"
                    }`}>
                      <input
                        type="radio"
                        name="payment"
                        value="transfer"
                        checked={paymentMethod === "transfer"}
                        onChange={() => setPaymentMethod("transfer")}
                        className="text-orange-600 focus:ring-orange-500 h-4 w-4"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-gray-800 text-sm">Chuyển khoản QR qua cổng PayOS</div>
                          <span className="bg-orange-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase">Mới / Tự động</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">Sinh mã QR động chứa số tiền chính xác, hệ thống tự động xác nhận sau 3 giây thanh toán.</div>
                      </div>
                    </label>
                  </div>
                </div>

              </div>

              {/* Right Column: Checkout Summary Box */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 sticky top-24">
                  <h2 className="text-lg font-bold text-gray-800 pb-3 border-b border-gray-100">Đơn hàng của bạn</h2>

                  {/* Small cart recap */}
                  <div className="max-h-48 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-start text-xs border-b border-gray-50 pb-2.5 last:border-0 last:pb-0">
                        <div className="min-w-0 pr-4">
                          <p className="font-bold text-gray-800 truncate">{item.product?.name || "Sản phẩm không còn tồn tại"}</p>
                          <p className="text-gray-400 mt-0.5 font-medium">Màu: {item.color} | Kích cỡ: {item.size} | Số lượng: {item.quantity}</p>
                          {(() => {
                            const isCombo = item.product?.isCombo ||
                                            item.product?.category === "combo" ||
                                            (item.product?.name && (item.product.name.includes("[SET COMBO]") || item.product.name.toLowerCase().includes("combo"))) ||
                                            (item.product?.description && item.product.description.includes("[COMBO:"));

                            let comboItems = [];
                            if (item.product?.description) {
                              const match = item.product.description.match(/\[COMBO:\s*([\d,]+)\]/);
                              if (match) {
                                const ids = match[1].split(",").map(id => Number(id.trim()));
                                comboItems = products.filter(p => ids.includes(Number(p.id)));
                              }
                            }

                            if (!isCombo) return null;

                            return (
                              <div className="mt-1.5 bg-orange-50/90 p-2 rounded-xl border border-orange-200 space-y-1">
                                <span className="font-black text-orange-900 block text-[9px] uppercase tracking-wider">
                                  🎁 SET COMBO PHỐI SẴN
                                </span>
                                {comboItems.length > 0 ? (
                                  <div className="space-y-1">
                                    {comboItems.map((subP, subIdx) => (
                                      <div key={subIdx} className="flex items-center gap-1.5 text-[10px] text-gray-800 font-bold">
                                        <span className="text-orange-600">•</span>
                                        <span className="truncate">{subP.name}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-gray-800 text-[10px] font-medium leading-relaxed">
                                    {(item.product?.description || "").replace(/\[COMBO:[\d,]+\]/, "").trim()}
                                  </p>
                                )}
                              </div>
                            );
                          })()}

                        </div>
                        <span className="font-bold text-gray-700 flex-shrink-0">
                          {((Number(item.product?.price) || 0) * (Number(item.quantity) || 0)).toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Coupon / Discount Code Input Section */}
                  <div className="pt-3 border-t border-gray-100 space-y-2">
                    <label className="block text-[10px] font-black uppercase text-gray-500 tracking-wider">Mã giảm giá</label>
                    {appliedCoupon ? (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-between">
                        <div className="text-xs">
                          <p className="font-bold text-green-700">Đã áp dụng: {appliedCoupon.code}</p>
                          <p className="text-green-600 text-[10px] mt-0.5">Tiết kiệm: {checkoutSummary.discount.toLocaleString('vi-VN')}đ</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAppliedCoupon(null)}
                          className="text-gray-400 hover:text-red-500 cursor-pointer"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Nhập mã giảm giá..."
                            value={couponCodeInput}
                            onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-orange-500"
                          />
                          <button
                            type="button"
                            onClick={handleApplyCouponCheckout}
                            disabled={applyingCouponLoading}
                            className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-4 rounded-xl transition duration-200 cursor-pointer"
                          >
                            {applyingCouponLoading ? "..." : "Áp dụng"}
                          </button>
                        </div>
                        {couponMessage.text && (
                          <p className={`text-[10px] font-bold ${couponMessage.type === "success" ? "text-green-600" : "text-red-500"}`}>
                            {couponMessage.text}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Loyalty Reward Points Redemption Section */}
                  <div className="pt-3 border-t border-gray-100 space-y-2">
                    <label className="block text-[10px] font-black uppercase text-emerald-700 tracking-wider">
                      💎 Tích Điểm Thưởng Khách Hàng (FoxStyle Rewards)
                    </label>

                    {useRewardPoints && rewardPointsAvailable > 0 ? (
                      <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3 flex items-center justify-between shadow-xs animate-in fade-in duration-200">
                        <div className="text-xs">
                          <p className="font-extrabold text-emerald-800 flex items-center gap-1.5">
                            <span>✓ Đã áp dụng {rewardPointsAvailable} điểm thưởng</span>
                          </p>
                          <p className="text-emerald-700 text-[11px] font-semibold mt-0.5">
                            Tiết kiệm trực tiếp: <strong className="underline">{rewardPointsValue.toLocaleString('vi-VN')}đ</strong> vào hóa đơn
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setUseRewardPoints(false);
                            toast.info("Đã bỏ áp dụng điểm thưởng cho đơn hàng này.");
                          }}
                          className="bg-emerald-200 hover:bg-emerald-300 text-emerald-900 font-bold text-xs px-3 py-1.5 rounded-xl transition cursor-pointer"
                        >
                          Hủy dùng điểm
                        </button>
                      </div>
                    ) : (
                      <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-extrabold text-emerald-950">
                            Bạn hiện có <strong className="text-emerald-700 font-black">{rewardPointsAvailable} điểm</strong> ({rewardPointsValue.toLocaleString('vi-VN')}đ)
                          </p>
                          <p className="text-[10px] text-emerald-700 font-medium mt-0.5">
                            {rewardPointsAvailable > 0 
                              ? "Nhấn nút bên phải để đổi điểm trừ trực tiếp tiền đơn hàng" 
                              : "Mua hàng để tích lũy điểm thưởng (1 đơn hàng = +1 điểm)"}
                          </p>
                        </div>

                        <button
                          type="button"
                          disabled={rewardPointsAvailable === 0}
                          onClick={() => {
                            if (rewardPointsAvailable === 0) return;
                            setUseRewardPoints(true);
                            toast.success(`Đã đổi ${rewardPointsAvailable} điểm thành công! Giảm ${rewardPointsValue.toLocaleString('vi-VN')}đ vào đơn hàng.`);
                          }}
                          className={`font-black text-xs px-3.5 py-2 rounded-xl shadow-sm transition cursor-pointer shrink-0 ${
                            rewardPointsAvailable > 0
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                              : "bg-gray-200 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          🛍️ Đổi điểm trừ tiền
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Calculations Breakdown */}
                  <div className="space-y-2.5 pt-3 border-t border-gray-100 text-xs font-semibold text-gray-500">
                    <div className="flex justify-between">
                      <span>Tạm tính hàng</span>
                      <span className="text-gray-800 font-bold">{checkoutSummary.subtotal.toLocaleString('vi-VN')}đ</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Thuế VAT ({vatRate}%)</span>
                      <span className="text-gray-800 font-bold">+{Number(checkoutSummary.vat || 0).toLocaleString('vi-VN')}đ</span>
                    </div>

                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span>Phí giao hàng</span>
                        {checkoutSummary.distanceKm && (
                          <span className="text-[10px] text-gray-400 font-normal">
                            📍 Quãng đường ~{checkoutSummary.distanceKm} km
                          </span>
                        )}
                      </div>
                      <span>
                        {checkoutSummary.shipping === 0 ? (
                          <span className="text-green-600 font-bold">Miễn phí (Đơn từ 300k)</span>
                        ) : (
                          <span className="text-gray-800 font-bold">
                            {checkoutSummary.shipping.toLocaleString('vi-VN')}đ
                          </span>
                        )}
                      </span>
                    </div>

                    {useRewardPoints && checkoutSummary.pointsDiscount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-extrabold bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                        <span>💎 Giảm giá từ Điểm Thưởng</span>
                        <span>-{checkoutSummary.pointsDiscount.toLocaleString('vi-VN')}đ</span>
                      </div>
                    )}

                    {getMembershipTier(getCompletedSpending(orders, currentUser?.id)).discountPercent > 0 && <div className="flex justify-between text-amber-700 font-extrabold bg-amber-50 p-2 rounded-lg border border-amber-100">
                      <span>🌟 Ưu đãi thành viên (-{getMembershipTier(getCompletedSpending(orders, currentUser?.id)).discountPercent}%)</span>
                      <span>-{Math.round(checkoutSummary.subtotal * getMembershipTier(getCompletedSpending(orders, currentUser?.id)).discountPercent / 100).toLocaleString('vi-VN')}đ</span>
                    </div>}

                    {checkoutSummary.discount > 0 && (
                      <div className="flex justify-between text-red-600 font-bold">
                        <span>Mã giảm giá ({checkoutSummary.couponCode})</span>
                        <span>-{checkoutSummary.discount.toLocaleString('vi-VN')}đ</span>
                      </div>
                    )}

                    <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-sm">
                      <span className="font-bold text-gray-800">Tổng thanh toán</span>
                      <span className="text-xl font-extrabold text-orange-600">
                        {checkoutSummary.total.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>

                  {addressMode === "map" && !pinnedCoords && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-[10px] text-red-600 font-bold leading-normal flex items-start gap-1.5 animate-pulse">
                      <span>⚠️ Bạn chưa ghim vị trí nhận hàng trên bản đồ. Vui lòng click chọn hoặc định vị vị trí giao hàng chính xác ở phần thông tin nhận hàng để mở khóa đặt hàng.</span>
                    </div>
                  )}

                  {addressMode === "manual" && !isAddressValid && (
                    <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-[10px] text-red-600 font-bold leading-normal flex items-start gap-1.5 animate-pulse">
                      <span>⚠️ Bạn chưa điền đầy đủ các thông tin địa chỉ giao hàng ở bên trái để mở khóa đặt hàng.</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={cart.length === 0 || !isAddressValid}
                    className={`w-full py-3 rounded-xl font-bold transition shadow-md flex items-center justify-center gap-1 ${
                      isAddressValid
                        ? "bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white cursor-pointer"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {paymentMethod === "transfer" ? "Tạo link thanh toán QR" : "Xác nhận đặt hàng"}
                  </button>
                </div>
              </div>

            </div>
          </form>
        )}
      </div>

      {/* --- PayOS QR Interactive Modal --- */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-3 sm:p-4 z-[9999] backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <style>{`
            .luxury-modal-scrollbar {
              scrollbar-width: thin !important;
              scrollbar-color: #f97316 #fff7ed !important;
            }
            .luxury-modal-scrollbar::-webkit-scrollbar {
              width: 10px !important;
            }
            .luxury-modal-scrollbar::-webkit-scrollbar-track {
              background: #fff7ed !important;
              border-radius: 9999px !important;
              margin: 8px 0 !important;
            }
            .luxury-modal-scrollbar::-webkit-scrollbar-thumb {
              background: linear-gradient(to bottom, #f97316, #ec4899) !important;
              border-radius: 9999px !important;
              border: 2px solid #fff7ed !important;
            }
            .luxury-modal-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #ea580c !important;
            }
          `}</style>
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full h-[82vh] max-h-[82vh] flex flex-col relative overflow-hidden border border-orange-100 animate-in zoom-in-95 duration-200 my-auto">
            {/* Luxury Gradient Header */}
            <div className="bg-gradient-to-r from-orange-500 via-pink-600 to-rose-600 px-5 py-4 text-white flex justify-between items-center shrink-0 shadow-md">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 backdrop-blur-md rounded-2xl">
                  <ShieldCheck className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black tracking-tight">Thanh toán VietQR PayOS</h3>
                  <p className="text-[11px] text-orange-100 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block"></span>
                    Cổng đối soát giao dịch tự động 24/7
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowQrModal(false);
                  toast.info(`Đơn ${simulatedOrderId} đã được tạo nhưng chưa thanh toán. Sản phẩm vẫn được giữ trong giỏ hàng để bạn thanh toán lại.`);
                }}
                className="hover:bg-white/20 p-2 rounded-full cursor-pointer transition text-white/90 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* CÁI GIỮA: Luxury Scrollable Content Body */}
            <div className="p-5 text-center space-y-4 flex-1 min-h-0 overflow-y-scroll luxury-modal-scrollbar bg-slate-50/50">
              {/* Order ID Banner */}
              <div className="bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-200/80 p-3.5 rounded-2xl flex justify-between items-center text-left shadow-2xs">
                <div>
                  <p className="text-[10px] text-orange-800 font-extrabold uppercase tracking-wider">Mã đơn hàng PayOS</p>
                  <p className="text-base font-black text-gray-900">{simulatedOrderId}</p>
                </div>
                <span className="bg-orange-500/10 text-orange-700 text-xs font-bold px-3 py-1 rounded-full border border-orange-300">
                  Chờ chuyển khoản
                </span>
              </div>

              {/* Dynamic PayOS QR Code Image Frame */}
              <div className="relative p-4 bg-white rounded-3xl shadow-md border border-orange-100 inline-block mx-auto group">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-pink-500 rounded-3xl blur-xs opacity-20 group-hover:opacity-40 transition duration-300 pointer-events-none"></div>
                <div className="relative bg-white p-2 rounded-2xl">
                  <img
                    src={payosData?.qrCode || `https://img.vietqr.io/image/MB-0362804559-qr_only.png?amount=${qrPaymentAmount}&addInfo=${simulatedOrderId}&accountName=NGUYEN%20TAN%20NGUYEN%20CHIEN`}
                    alt="PayOS VietQR Code"
                    className="w-56 h-56 sm:w-60 sm:h-60 mx-auto object-contain rounded-xl"
                  />
                </div>
              </div>

              {/* Transaction billing details - Sleek Dark Card */}
              <div className="bg-zinc-900 text-white rounded-2xl p-4.5 text-left text-xs font-medium space-y-2.5 shadow-lg border border-zinc-800">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                  <span className="text-zinc-400 font-bold">Ngân hàng:</span>
                  <span className="text-white font-extrabold">{payosData?.bin ? `PayOS (BIN: ${payosData.bin})` : "MB Bank (Ngân hàng Quân Đội)"}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                  <span className="text-zinc-400 font-bold">Số tài khoản:</span>
                  <span className="text-amber-400 font-black text-sm tracking-wider">{payosData?.accountNumber || "0362804559"}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                  <span className="text-zinc-400 font-bold">Chủ tài khoản:</span>
                  <span className="text-white font-extrabold">{payosData?.accountName || "NGUYEN TAN NGUYEN CHIEN"}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                  <span className="text-zinc-400 font-bold">Số tiền chuyển:</span>
                  <span className="text-orange-400 font-black text-base">{qrPaymentAmount.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 font-bold">Nội dung chuyển:</span>
                  <span className="bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-md font-black text-xs border border-blue-500/30">
                    {payosData?.description || simulatedOrderId}
                  </span>
                </div>
              </div>

              {/* Countdown Indicator Bar */}
              <div className="flex items-center justify-center space-x-2 text-xs font-bold py-2.5 px-4 bg-amber-50 text-amber-800 rounded-xl border border-amber-200/80 shadow-2xs">
                {qrCountdown > 0 ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-orange-600" />
                    <span>Tự động đối soát giao dịch (<span className="font-extrabold text-orange-600">{qrCountdown}s</span>)</span>
                  </>
                ) : (
                  <span className="text-rose-600 font-extrabold">⚠️ Mã QR hết hạn! Vui lòng kiểm tra lại ngân hàng.</span>
                )}
              </div>

              {payosData?.checkoutUrl && (
                <a
                  href={payosData.checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-extrabold text-orange-600 hover:text-orange-700 hover:underline pt-1 block"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Mở cổng thanh toán PayOS trên trang web</span>
                </a>
              )}
            </div>

            {/* Sticky Action Footer - Fixed Bottom */}
            <div className="p-4 bg-white border-t border-gray-100 shrink-0">
              <button
                type="button"
                onClick={simulatePaymentSuccess}
                disabled={isCheckingPayOS || qrCountdown <= 0}
                className="w-full bg-gradient-to-r from-orange-500 via-pink-600 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-extrabold py-3.5 rounded-2xl text-sm shadow-lg shadow-orange-500/20 flex items-center justify-center space-x-2 cursor-pointer transition-all active:scale-[0.98]"
              >
                {qrCountdown <= 0 ? (
                  <>
                    <AlertTriangle className="h-4 w-4" />
                    <span>Mã thanh toán đã hết hạn</span>
                  </>
                ) : isCheckingPayOS ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Đang đối soát với PayOS...</span>
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Tôi đã chuyển khoản xong (Kiểm tra thanh toán)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- Confirmation Dialog Modal --- */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[9999] backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full relative overflow-hidden border border-gray-100 p-6 space-y-4 animate-in zoom-in-95 duration-200 text-center">
            <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-base font-extrabold text-gray-900">
                {showConfirmModal === "transfer" ? "Xác nhận thanh toán?" : "Xác nhận đặt đơn hàng?"}
              </h3>
              <p className="text-xs text-gray-500 font-semibold leading-relaxed">
                {showConfirmModal === "transfer" 
                  ? "Hệ thống sẽ tiến hành khởi tạo và hiển thị mã VietQR chuyển khoản để bạn thanh toán giao dịch." 
                  : "Bạn có chắc chắn muốn đặt mua đơn hàng này bằng hình thức thanh toán khi nhận hàng (COD)?"}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(null)}
                className="flex-1 border border-gray-200 text-gray-500 py-2.5 rounded-xl text-xs font-bold hover:bg-gray-50 cursor-pointer transition duration-150"
              >
                Hủy bỏ
              </button>
              
              <button
                type="button"
                onClick={executeConfirmAction}
                className="flex-1 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white py-2.5 rounded-xl text-xs font-bold shadow-md cursor-pointer transition duration-150"
              >
                Đồng ý
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
