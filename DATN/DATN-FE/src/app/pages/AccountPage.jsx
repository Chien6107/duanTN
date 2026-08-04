import { useState, useEffect, useRef } from "react";
import { 
  User, Package, MapPin, Lock, LogOut, CheckCircle, Clock, XCircle, X,
  Truck, Shield, Star, Plus, Trash2, Edit3, Heart, Share2, Copy, Sparkles, 
  Gift, Award, DollarSign, Check, Coins, TrendingUp, ShoppingBag, Mail, Phone, LogIn, CreditCard
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { getMembershipTier } from "../utils/membership";
import { isValidVietnamesePhone, PHONE_MESSAGE } from "../utils/phone";
import { Link, useNavigate } from "react-router";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { isStrongPassword, PASSWORD_MESSAGE } from "../utils/passwordPolicy";

const VIETNAM_BANKS = [
  "MB Bank (Ngân hàng Quân Đội)",
  "Vietcombank",
  "BIDV",
  "VietinBank",
  "Agribank",
  "Techcombank",
  "ACB",
  "VPBank",
  "TPBank",
  "Sacombank",
  "HDBank",
  "VIB",
  "SHB",
  "OCB",
  "SeABank",
  "MSB",
];

export function AccountPage() {
  const navigate = useNavigate();
  const {
    currentUser,
    restoringSession,
    updateProfile,
    deactivateAccount,
    deleteMyAccount,
    addressBook,
    addAddress,
    updateAddress,
    deleteAddress,
    wishlist,
    products,
    orders = [],
    toggleWishlist,
    theme,
    setTheme,
    t,
    sendForgotPasswordOtp,
    resetPassword,
    login
  } = useApp();

  const [activeTab, setActiveTab] = useState("profile");

  // Profile Form State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: currentUser?.fullName || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    birthDate: currentUser?.birthDate || "",
    bankName: currentUser?.bankName || "",
    bankAccountNo: currentUser?.bankAccountNo || "",
    bankAccountName: currentUser?.bankAccountName || ""
  });

  useEffect(() => {
    if (currentUser) {
      const profileKey = `foxstyle_profile_${currentUser.id || currentUser.username}`;
      const savedProfile = JSON.parse(localStorage.getItem(profileKey) || "{}");
      setProfileData({
        fullName: currentUser.fullName || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        birthDate: savedProfile.birthDate || currentUser.birthDate || "",
        bankName: savedProfile.bankName || currentUser.bankName || "",
        bankAccountNo: savedProfile.bankAccountNo || currentUser.bankAccountNo || "",
        bankAccountName: savedProfile.bankAccountName || currentUser.bankAccountName || ""
      });
    }
  }, [currentUser]);


  // Address Dialog Form State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    id: null,
    fullName: "",
    phone: "",
    detailAddress: "",
    district: "",
    ward: "",
    city: "Hà Nội",
    isDefault: false
  });

  // Password change State
  const [pwdForm, setPwdForm] = useState({
    oldPwd: "",
    newPwd: "",
    confirmPwd: "",
    otpCode: ""
  });
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const [pinnedCoords, setPinnedCoords] = useState({ lat: 21.0285, lng: 105.8542 });
  const accountMapRef = useRef(null);
  const accountMarkerRef = useRef(null);

  const triggerReverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&accept-language=vi&lat=${lat}&lon=${lng}`);
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

        setAddressForm(prev => ({
          ...prev,
          detailAddress: road,
          ward: ward,
          // Giữ tương thích với API cũ trong khi giao diện dùng địa chỉ hành chính 2 cấp.
          district: ward,
          city: city
        }));
      }
    } catch (err) {
      console.error("Reverse geocoding error:", err);
    }
  };

  // Initialize Account Address Map
  useEffect(() => {
    if (!showAddressModal) {
      accountMapRef.current = null;
      accountMarkerRef.current = null;
      return;
    }

    const timer = setTimeout(() => {
      const mapContainer = document.getElementById("account-address-map");
      if (mapContainer && !mapContainer._leaflet_id) {
        let initLat = 21.0285;
        let initLng = 105.8542;
        
        const gpsMatch = addressForm.detailAddress ? addressForm.detailAddress.match(/\[Định vị:\s*(-?\d+\.\d+),\s*(-?\d+\.\d+)\]/) : null;
        if (gpsMatch) {
          initLat = parseFloat(gpsMatch[1]);
          initLng = parseFloat(gpsMatch[2]);
        } else {
          const cityCoords = {
            "Hà Nội": [21.0285, 105.8542],
            "TP HCM": [10.7769, 106.7009],
            "Đà Nẵng": [16.0544, 108.2022],
            "Hải Phòng": [20.8449, 106.6881],
            "Cần Thơ": [10.0371, 105.7882],
            "Hoàng Sa": [16.5, 112.0],
            "Trường Sa": [9.8, 114.0]
          };
          const coords = cityCoords[addressForm.city] || [21.0285, 105.8542];
          initLat = coords[0];
          initLng = coords[1];
        }

        setPinnedCoords({ lat: initLat, lng: initLng });

        const map = L.map("account-address-map").setView([initLat, initLng], 13);
        accountMapRef.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
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

        const activeMarker = L.marker([initLat, initLng], { icon: redPinIcon, draggable: true }).addTo(map);
        accountMarkerRef.current = activeMarker;

        activeMarker.on("dragend", () => {
          const pos = activeMarker.getLatLng();
          setPinnedCoords({ lat: pos.lat, lng: pos.lng });
          triggerReverseGeocode(pos.lat, pos.lng);
        });

        map.on("click", (e) => {
          const { lat, lng } = e.latlng;
          setPinnedCoords({ lat, lng });
          activeMarker.setLatLng([lat, lng]);
          triggerReverseGeocode(lat, lng);
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [showAddressModal]);

  // Sync map center when city changes in dialog
  useEffect(() => {
    if (!accountMapRef.current || !accountMarkerRef.current) return;

    const gpsMatch = addressForm.detailAddress ? addressForm.detailAddress.match(/\[Định vị:\s*(-?\d+\.\d+),\s*(-?\d+\.\d+)\]/) : null;
    if (gpsMatch) return;

    const cityCoords = {
      "Hà Nội": [21.0285, 105.8542],
      "TP HCM": [10.7769, 106.7009],
      "Đà Nẵng": [16.0544, 108.2022],
      "Hải Phòng": [20.8449, 106.6881],
      "Cần Thơ": [10.0371, 105.7882],
      "Hoàng Sa": [16.5, 112.0],
      "Trường Sa": [9.8, 114.0]
    };

    const coords = cityCoords[addressForm.city] || [21.0285, 105.8542];
    accountMapRef.current.setView(coords, 13);
    setPinnedCoords({ lat: coords[0], lng: coords[1] });
    accountMarkerRef.current.setLatLng(coords);
  }, [addressForm.city]);

  // Debounced auto-search address location from text input in Account page modal!
  useEffect(() => {
    if (!addressForm.detailAddress || addressForm.detailAddress.length < 5 || addressForm.detailAddress.includes("[Định vị:")) return;

    const delayTimer = setTimeout(async () => {
      try {
        const query = `${addressForm.detailAddress}, ${addressForm.ward}, ${addressForm.city}, Việt Nam`;
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&accept-language=vi&countrycodes=vn&q=${encodeURIComponent(query)}&limit=1`);
        const data = await res.json();
        
        if (data && data.length > 0 && accountMapRef.current && accountMarkerRef.current) {
          const { lat, lon } = data[0];
          const parsedLat = parseFloat(lat);
          const parsedLng = parseFloat(lon);
          
          setPinnedCoords({ lat: parsedLat, lng: parsedLng });
          accountMapRef.current.setView([parsedLat, parsedLng], 16);
          accountMarkerRef.current.setLatLng([parsedLat, parsedLng]);
        }
      } catch (err) {
        console.error("Auto geocoding error:", err);
      }
    }, 1500);

    return () => clearTimeout(delayTimer);
  }, [addressForm.detailAddress, addressForm.ward, addressForm.city]);

  if (restoringSession) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-zinc-700 text-xs font-black uppercase tracking-[0.2em] animate-pulse">Đang tải thông tin tài khoản...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="bg-gray-50 min-h-screen py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-gray-100 shadow-md">
          <LogIn className="h-16 w-16 text-orange-500 mx-auto mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Đăng nhập tài khoản</h2>
          <p className="text-gray-500 text-sm mb-6">Bạn cần đăng nhập để truy cập trang thông tin tài khoản.</p>
          <p className="text-xs text-gray-400 bg-gray-50 p-3 rounded-lg border leading-relaxed mb-6 font-semibold">
            Vui lòng nhấn nút "Đăng nhập" trên thanh điều hướng góc phải và đăng nhập nhanh bằng tài khoản thử nghiệm để tiếp tục.
          </p>
        </div>
      </div>
    );
  }

  // Get user addresses
  const userAddresses = addressBook.filter(
    (address) => String(address.userId) === String(currentUser?.id)
  );

  // Get user liked products
  const likedProducts = products.filter(p => wishlist.includes(p.id));

  // Dynamic Real Points Calculation (0 when new / 0 orders, points awarded ONLY on successful/completed/paid orders)
  const currentUserOrders = (orders || []).filter(
    (order) => String(order.userId) === String(currentUser?.id)
  );
  const userOrdersList = currentUserOrders.filter(o =>
    o.status === "completed" || o.status === "delivered" ||
    (o.isPaid && o.status !== "cancelled" && o.status !== "returned")
  );
  const redeemedStorageKey = `foxstyle_redeemed_points_${currentUser?.id || currentUser?.username || 'guest'}`;
  const redeemedPointsCount = Number(localStorage.getItem(redeemedStorageKey) || 0);
  const availablePoints = Math.max(0, userOrdersList.length - redeemedPointsCount);
  const rewardPointsValue = availablePoints * 100;
  const membershipSpent = userOrdersList.reduce(
    (total, order) => total + Number(order.total ?? order.totalAmount ?? 0),
    0
  );
  const membershipTier = getMembershipTier(membershipSpent);
  const memberRank = {
    ...membershipTier,
    next: membershipTier.key === "member" ? "Bạc" : membershipTier.key === "silver" ? "Vàng" : membershipTier.key === "gold" ? "Kim Cương" : null,
    target: membershipTier.nextTarget || membershipSpent
  };
  const pointsToNextRank = memberRank.next ? Math.max(0, memberRank.target - membershipSpent) : 0;
  const rankProgress = memberRank.next
    ? Math.min(100, (membershipSpent / memberRank.target) * 100)
    : 100;

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!isValidVietnamesePhone(profileData.phone)) {
      alert(PHONE_MESSAGE);
      return;
    }
    await updateProfile(
      profileData.fullName,
      profileData.email,
      profileData.phone,
      {
        birthDate: profileData.birthDate,
        bankName: profileData.bankName,
        bankAccountNo: profileData.bankAccountNo,
        bankAccountName: profileData.bankAccountName,
      }
    );
    setIsEditingProfile(false);
    alert("Cập nhật thông tin tài khoản thành công!");
  };

  const handleOpenAddressModal = (addr = null) => {
    if (addr) {
      setAddressForm({
        id: addr.id,
        fullName: addr.fullName,
        phone: addr.phone,
        detailAddress: addr.detailAddress,
        district: addr.district,
        ward: addr.ward || "",
        city: addr.city,
        isDefault: addr.isDefault
      });
    } else {
      setAddressForm({
        id: null,
        fullName: currentUser.fullName,
        phone: currentUser.phone || "",
        detailAddress: "",
        district: "",
        ward: "",
        city: "Hà Nội",
        isDefault: userAddresses.length === 0 // Default true if first address
      });
    }
    setShowAddressModal(true);
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!addressForm.fullName || !addressForm.phone || !addressForm.detailAddress || !addressForm.ward) {
      alert("Vui lòng nhập đầy đủ các trường thông tin địa chỉ!");
      return;
    }
    if (!isValidVietnamesePhone(addressForm.phone)) {
      alert(PHONE_MESSAGE);
      return;
    }

    const payload = {
      ...addressForm,
      fullName: addressForm.fullName.trim(),
      phone: addressForm.phone.trim(),
      detailAddress: addressForm.detailAddress.trim(),
      district: addressForm.ward.trim(),
      ward: addressForm.ward.trim(),
      city: addressForm.city,
      isDefault: addressForm.isDefault
    };

    try {
      if (addressForm.id) {
        await updateAddress(addressForm.id, payload);
        alert("Cập nhật địa chỉ nhận hàng thành công!");
      } else {
        await addAddress(payload);
        alert("Thêm địa chỉ nhận hàng mới thành công!");
      }
      setShowAddressModal(false);
    } catch (err) {
      console.error("Address submit error:", err);
      alert("Lưu địa chỉ thành công!");
      setShowAddressModal(false);
    }
  };

  const handleDeleteAddress = (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
      deleteAddress(id);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!otpSent || !/^\d{6}$/.test(pwdForm.otpCode)) {
      alert("Vui lòng gửi và nhập đúng mã OTP 6 số từ email của bạn!");
      return;
    }
    if (!isStrongPassword(pwdForm.newPwd)) {
      alert(PASSWORD_MESSAGE);
      return;
    }
    if (pwdForm.newPwd !== pwdForm.confirmPwd) {
      alert("Mật khẩu nhập lại không trùng khớp!");
      return;
    }
    const currentPasswordCheck = await login(currentUser.username, pwdForm.oldPwd);
    if (!currentPasswordCheck?.success) {
      alert("Mật khẩu hiện tại không chính xác!");
      return;
    }
    const result = await resetPassword(currentUser.email, pwdForm.otpCode, pwdForm.newPwd);
    if (!result?.success) {
      alert(result?.message || "Mã OTP không hợp lệ hoặc đã hết hạn!");
      return;
    }
    alert("Đổi mật khẩu bảo mật thành công!");
    setPwdForm({ oldPwd: "", newPwd: "", confirmPwd: "", otpCode: "" });
    setOtpSent(false);
  };

  const handleSendPasswordOtp = async () => {
    if (!currentUser?.email) {
      alert("Tài khoản chưa có địa chỉ email để nhận OTP!");
      return;
    }
    setOtpLoading(true);
    try {
      const result = await sendForgotPasswordOtp(currentUser.email);
      if (!result?.success) {
        alert(result?.message || "Không thể gửi OTP. Vui lòng thử lại!");
        return;
      }
      setOtpSent(true);
      setPwdForm((current) => ({ ...current, otpCode: "" }));
      alert(`Mã OTP đã được gửi đến ${currentUser.email}. Vui lòng kiểm tra cả thư rác.`);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleLockAccount = async () => {
    if (confirm("Bạn có chắc chắn muốn khóa tài khoản này? Bạn sẽ bị đăng xuất ngay lập tức và không thể đăng nhập lại cho đến khi liên hệ quản trị viên mở khóa.")) {
      const res = await deactivateAccount();
      if (res && res.success) {
        alert("Khóa tài khoản thành công! Tạm biệt bạn.");
        navigate("/");
      } else {
        alert(res?.message || "Khóa tài khoản thất bại!");
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (confirm("CẢNH BÁO: Bạn có thực sự muốn xóa tài khoản này vĩnh viễn? Mọi dữ liệu liên quan sẽ bị xóa và không thể phục hồi lại!")) {
      const res = await deleteMyAccount();
      if (res && res.success) {
        alert("Tài khoản của bạn đã được xóa vĩnh viễn thành công. Cảm ơn bạn đã đồng hành cùng FoxStyle!");
        navigate("/");
      } else {
        alert(res?.message || "Xóa tài khoản thất bại!");
      }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-orange-50/70 via-bg-main to-bg-main py-6 text-text-main transition-colors duration-200 dark:from-orange-950/10 sm:py-10">
      <div className="pointer-events-none absolute -left-32 top-28 h-80 w-80 rounded-full bg-orange-300/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 top-96 h-96 w-96 rounded-full bg-pink-300/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">

        {/* --- Top User Hero Banner with Stats --- */}
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-orange-950 p-5 text-white shadow-2xl shadow-orange-950/15 sm:p-8">
          {/* Background Decorative Glow */}
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-stretch justify-between gap-7 lg:flex-row lg:items-center">
            {/* User Profile Overview */}
            <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
              <div className="relative">
                <div className="h-24 w-24 rounded-[1.75rem] bg-gradient-to-tr from-orange-500 via-pink-500 to-amber-400 p-1 shadow-2xl shadow-orange-500/20 sm:h-28 sm:w-28">
                  <div className="flex h-full w-full items-center justify-center rounded-[1.5rem] bg-zinc-900 text-3xl font-black text-white sm:text-4xl">
                    {(currentUser.fullName || currentUser.username || "?").charAt(0).toUpperCase()}
                  </div>
                </div>
                <span className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 border-2 border-zinc-900 rounded-full shadow-md" title="Đang hoạt động"></span>
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
                    {currentUser.fullName || currentUser.username}
                  </h1>
                  <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-zinc-950 shadow-sm">
                    {memberRank.icon} {memberRank.name} VIP
                  </span>
                </div>

                <p className="mt-1 flex flex-wrap items-center justify-center gap-2 text-xs font-medium text-zinc-400 sm:justify-start">
                  <span>@{currentUser.username}</span>
                  <span>•</span>
                  <span className="text-zinc-300 font-semibold">{currentUser.email}</span>
                </p>

                <div className="mt-4 flex items-center justify-center gap-3 sm:justify-start">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-400 bg-orange-950/50 border border-orange-800/40 px-3 py-1 rounded-full">
                    <Shield className="w-3.5 h-3.5" />
                    <span>{currentUser.role === "admin" ? "Quản Trị Viên" : "Khách Hàng Thân Thiết"}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid w-full grid-cols-3 gap-2 sm:gap-3 lg:w-auto lg:min-w-[360px]">
              <Link to="/orders" className="group cursor-pointer rounded-2xl border border-white/10 bg-white/[0.06] p-3 text-center backdrop-blur transition hover:-translate-y-1 hover:bg-white/10 sm:p-4">
                <span className="text-xs text-zinc-400 font-bold block group-hover:text-orange-400 transition">Đơn hàng</span>
                <span className="text-lg font-black text-white">{currentUserOrders.length}</span>
              </Link>

              <Link to="/wishlist" className="group cursor-pointer rounded-2xl border border-white/10 bg-white/[0.06] p-3 text-center backdrop-blur transition hover:-translate-y-1 hover:bg-white/10 sm:p-4">
                <span className="text-xs text-zinc-400 font-bold block group-hover:text-pink-400 transition">Yêu thích</span>
                <span className="text-lg font-black text-white">{likedProducts.length}</span>
              </Link>

              <button onClick={() => setActiveTab("affiliate")} className="group cursor-pointer rounded-2xl border border-white/10 bg-white/[0.06] p-3 text-center backdrop-blur transition hover:-translate-y-1 hover:bg-white/10 sm:p-4">
                <span className="text-xs text-zinc-400 font-bold block group-hover:text-emerald-400 transition">Điểm thưởng</span>
                <span className="text-lg font-black text-emerald-400">{availablePoints}</span>
              </button>
            </div>
          </div>
        </div>

        {/* --- Main Navigation Sidebar + Content Grid --- */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[270px_minmax(0,1fr)] lg:gap-6">

          {/* --- Navigation Sidebar Tabs --- */}
          <div className="space-y-4 lg:sticky lg:top-5 lg:self-start">
            <nav className="flex gap-2 overflow-x-auto rounded-3xl border border-border-main bg-bg-card p-2.5 text-xs font-bold text-text-muted shadow-lg shadow-zinc-900/5 lg:block lg:space-y-1.5 lg:overflow-visible">
              {[
                { id: "profile", icon: User, label: t("profile_title", "Thông tin cá nhân"), activeColor: "bg-orange-500 text-white shadow-md shadow-orange-500/20" },
                { id: "addresses", icon: MapPin, label: `${t("profile_addresses", "Sổ địa chỉ")} (${userAddresses.length})`, activeColor: "bg-orange-500 text-white shadow-md shadow-orange-500/20" },
                { id: "orders", icon: ShoppingBag, label: t("profile_orders", "Đơn hàng của tôi"), link: "/orders" },
                { id: "wishlist", icon: Heart, label: `${t("profile_wishlist", "Sản phẩm yêu thích")} (${likedProducts.length})`, link: "/wishlist" },
                { id: "loyalty", icon: Award, label: "Hạng thành viên & Điểm", activeColor: "bg-amber-500 text-white shadow-md shadow-amber-500/20" },
                { id: "affiliate", icon: Coins, label: "Tích điểm thưởng", activeColor: "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" },
                { id: "password", icon: Lock, label: t("profile_change_pwd", "Đổi mật khẩu"), activeColor: "bg-orange-500 text-white shadow-md shadow-orange-500/20" },
                { id: "settings", icon: Trash2, label: t("profile_deactivate", "Khóa / Xóa tài khoản"), activeColor: "bg-rose-600 text-white shadow-md shadow-rose-600/20" }
              ].map(tab => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;

                if (tab.link) {
                  return (
                    <Link
                      key={tab.id}
                      to={tab.link}
                      className="flex shrink-0 items-center space-x-3 rounded-2xl px-4 py-3 transition hover:bg-bg-main hover:text-text-main lg:w-full lg:hover:translate-x-1"
                    >
                      <div className="p-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <span className="font-bold">{tab.label}</span>
                    </Link>
                  );
                }

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex shrink-0 items-center space-x-3 rounded-2xl px-4 py-3 transition cursor-pointer lg:w-full ${
                      isActive 
                        ? `${tab.activeColor} font-black` 
                        : "hover:bg-bg-main hover:text-text-main hover:translate-x-1"
                    }`}
                  >
                    <div className={`p-1.5 rounded-xl ${isActive ? "bg-white/20 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <span className="font-bold">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* --- Tab Contents Panel --- */}
          <div className="min-w-0">
            <div className="min-h-[620px] rounded-[2rem] border border-border-main bg-bg-card p-5 shadow-xl shadow-zinc-900/5 sm:p-8">

              {/* Tab 1: Profile Information */}
              {activeTab === "profile" && (
                <div className="space-y-8 animate-in fade-in duration-200">
                  <div className="flex justify-between items-center pb-4 border-b border-border-main">
                    <div>
                      <h3 className="text-xl font-black text-text-main flex items-center gap-2">
                        <User className="h-5 w-5 text-orange-500" />
                        <span>{t("profile_title", "Thông tin cá nhân")}</span>
                      </h3>
                      <p className="text-xs text-text-muted mt-0.5">Quản lý hồ sơ cá nhân và tài khoản hoàn tiền mua sắm</p>
                    </div>

                    {!isEditingProfile && (
                      <button
                        onClick={() => setIsEditingProfile(true)}
                        className="bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white text-xs font-bold px-5 py-2.5 rounded-2xl shadow-md transition cursor-pointer hover:scale-105"
                      >
                        ✏️ {t("profile_edit", "Chỉnh sửa")}
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-[11px] font-black uppercase tracking-wider text-text-muted mb-1.5">
                          {t("profile_username", "Tên tài khoản (Username)")}
                        </label>
                        <input
                          type="text"
                          disabled
                          value={currentUser.username}
                          className="w-full px-4 py-3 border border-border-main rounded-2xl bg-bg-main/60 text-sm text-text-muted font-bold cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-black uppercase tracking-wider text-text-muted mb-1.5">
                          {t("profile_fullname", "Họ và tên")}
                        </label>
                        <input
                          type="text"
                          required
                          disabled={!isEditingProfile}
                          value={profileData.fullName}
                          onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                          className="w-full px-4 py-3 border border-border-main bg-bg-main text-text-main rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-80"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-black uppercase tracking-wider text-text-muted mb-1.5">
                          {t("profile_email", "Địa chỉ email")}
                        </label>
                        <input
                          type="email"
                          required
                          disabled={!isEditingProfile}
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="w-full px-4 py-3 border border-border-main bg-bg-main text-text-main rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-80"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-black uppercase tracking-wider text-text-muted mb-1.5">
                          Số điện thoại
                        </label>
                        <input
                          type="tel"
                          disabled={!isEditingProfile}
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="w-full px-4 py-3 border border-border-main bg-bg-main text-text-main rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-80"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-black uppercase tracking-wider text-text-muted mb-1.5">
                          Ngày tháng năm sinh
                        </label>
                        <input
                          type="date"
                          disabled={!isEditingProfile}
                          value={profileData.birthDate}
                          onChange={(e) => setProfileData({ ...profileData, birthDate: e.target.value })}
                          className="w-full px-4 py-3 border border-border-main bg-bg-main text-text-main rounded-2xl text-sm font-extrabold focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-80"
                        />
                      </div>
                    </div>

                    {/* --- Redesigned Luxury VIP Bank Card Mockup --- */}
                    <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-950 text-white rounded-3xl p-6 shadow-xl border border-amber-600/30 space-y-4 relative overflow-hidden">
                      {/* Decorative Background Elements */}
                      <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-40 h-40 bg-amber-400/10 rounded-full blur-2xl pointer-events-none"></div>

                      <div className="flex justify-between items-center relative z-10">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-5 h-5 text-amber-300" />
                          <h4 className="text-xs font-black uppercase tracking-wider text-amber-200">
                            Tài khoản ngân hàng chính (Nhận hoàn tiền & Đơn hàng)
                          </h4>
                        </div>
                        <span className="text-[10px] font-black tracking-widest bg-amber-400/20 text-amber-200 px-3 py-1 rounded-full uppercase border border-amber-300/30">
                          VIP DEBIT CARD
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                        <div>
                          <label className="block text-[10px] font-black text-amber-200/80 uppercase mb-1">
                            Ngân hàng thụ hưởng
                          </label>
                          <select
                            disabled={!isEditingProfile}
                            value={profileData.bankName}
                            onChange={(e) => setProfileData({ ...profileData, bankName: e.target.value })}
                            className="w-full px-3.5 py-2.5 bg-black/30 border border-amber-400/30 rounded-xl text-xs font-extrabold text-white placeholder-amber-200/50 disabled:opacity-90 focus:outline-none focus:border-amber-300"
                          >
                            <option value="" className="text-zinc-900">Chọn ngân hàng</option>
                            {VIETNAM_BANKS.map((bank) => (
                              <option key={bank} value={bank} className="text-zinc-900">
                                {bank}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-amber-200/80 uppercase mb-1">
                            Số tài khoản
                          </label>
                          <input
                            type="text"
                            disabled={!isEditingProfile}
                            value={profileData.bankAccountNo}
                            onChange={(e) => setProfileData({ ...profileData, bankAccountNo: e.target.value })}
                            inputMode="numeric"
                            placeholder="Nhập số tài khoản"
                            className="w-full px-3.5 py-2.5 bg-black/30 border border-amber-400/30 rounded-xl text-xs font-mono font-black text-amber-300 disabled:opacity-90 focus:outline-none focus:border-amber-300 tracking-wider"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-black text-amber-200/80 uppercase mb-1">
                            Chủ tài khoản (Viết hoa)
                          </label>
                          <input
                            type="text"
                            disabled={!isEditingProfile}
                            value={profileData.bankAccountName}
                            onChange={(e) => setProfileData({ ...profileData, bankAccountName: e.target.value.toUpperCase() })}
                            placeholder="Nhập tên chủ tài khoản"
                            className="w-full px-3.5 py-2.5 bg-black/30 border border-amber-400/30 rounded-xl text-xs font-black text-white uppercase disabled:opacity-90 focus:outline-none focus:border-amber-300 tracking-wider"
                          />
                        </div>
                      </div>
                    </div>

                    {isEditingProfile && (
                      <div className="flex space-x-3 mt-6 pt-4 border-t border-border-main">
                        <button
                          type="submit"
                          className="flex-1 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-black py-3 rounded-2xl hover:from-orange-600 hover:to-pink-700 transition shadow-md text-xs uppercase tracking-wider cursor-pointer"
                        >
                          Lưu thay đổi hồ sơ
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingProfile(false)}
                          className="flex-1 border border-border-main font-bold py-3 rounded-2xl hover:bg-bg-main transition text-xs text-text-main uppercase tracking-wider cursor-pointer"
                        >
                          Hủy thao tác
                        </button>
                      </div>
                    )}
                  </form>

                  {/* Cài đặt Giao diện */}
                  <div className="pt-6 mt-6 border-t border-border-main">
                    <h4 className="text-sm font-bold text-text-main mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-orange-500" />
                      <span>{t("profile_settings", "Cài đặt hiển thị ứng dụng")}</span>
                    </h4>

                    <div className="bg-bg-main p-4.5 rounded-2xl border border-border-main flex items-center justify-between shadow-xs">
                      <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-orange-100 dark:bg-orange-950/40 text-orange-600 rounded-xl">
                          {theme === "dark" ? <Star className="h-5 w-5" /> : <Shield className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-text-main">{t("profile_theme", "Giao diện chủ đề")}</p>
                          <p className="text-[11px] text-text-muted font-bold uppercase tracking-wider mt-0.5">
                            {theme === "dark" ? t("profile_theme_dark", "Chế độ Tối (Dark Mode)") : t("profile_theme_light", "Chế độ Sáng (Light Mode)")}
                          </p>
                        </div>
                      </div>

                      <div className="flex bg-bg-card p-1 rounded-2xl border border-border-main text-xs font-bold text-text-muted">
                        <button
                          type="button"
                          onClick={() => setTheme("light")}
                          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${theme === "light" ? "bg-white dark:bg-zinc-800 text-orange-600 shadow-sm font-extrabold border border-border-main" : "hover:text-text-main"}`}
                        >
                          ☀️ Sáng
                        </button>
                        <button
                          type="button"
                          onClick={() => setTheme("dark")}
                          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${theme === "dark" ? "bg-white dark:bg-zinc-800 text-orange-500 shadow-sm font-extrabold border border-border-main" : "hover:text-text-main"}`}
                        >
                          🌙 Tối
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Address Book */}
              {activeTab === "addresses" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-3 border-b border-border-main">
                    <h3 className="text-xl font-bold text-text-main" data-i18n="profile_addresses_title">{t("profile_addresses_title", "Sổ địa chỉ nhận hàng")}</h3>
                    <button
                      onClick={() => handleOpenAddressModal(null)}
                      className="bg-orange-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-orange-700 shadow flex items-center space-x-1.5 transition cursor-pointer"
                    >
                      <Plus className="h-4 w-4" />
                      <span data-i18n="profile_add_new_address">{t("profile_add_new_address", "Thêm địa chỉ mới")}</span>
                    </button>
                  </div>

                  {userAddresses.length === 0 ? (
                    <div className="text-center py-10 bg-bg-main text-text-muted rounded-2xl border border-dashed border-border-main text-sm" data-i18n="profile_no_addresses">
                      {t("profile_no_addresses", "Bạn chưa cấu hình địa chỉ nhận hàng nào.")}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {userAddresses.map((addr) => (
                        <div key={addr.id} className="border border-border-main bg-bg-main rounded-2xl p-5 relative flex justify-between gap-4">
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-extrabold text-text-main text-sm">{addr.fullName}</p>
                              {addr.isDefault && (
                                <span className="bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400 font-bold text-[9px] px-2 py-0.5 rounded-full uppercase" data-i18n="profile_default_address">{t("profile_default_address", "Mặc định")}</span>
                              )}
                            </div>
                            <p className="text-xs text-text-muted mt-1 font-semibold flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {addr.phone}
                            </p>
                            <p className="text-xs text-text-muted mt-2 font-medium">
                              {addr.detailAddress}, {addr.ward || addr.district}, {addr.city}
                            </p>
                          </div>

                          <div className="flex space-x-1 self-start">
                            <button
                              onClick={() => handleOpenAddressModal(addr)}
                              className="p-2 text-text-muted hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-lg transition cursor-pointer"
                              title={t("profile_edit_address", "Sửa địa chỉ")}
                            >
                              <Edit3 className="h-4.5 w-4.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="p-2 text-text-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition cursor-pointer"
                              title={t("profile_delete_address", "Xóa địa chỉ")}
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 5: Account Settings (Lock & Delete Account) */}
              {activeTab === "settings" && (
                <div className="space-y-6">
                  <div className="pb-3 border-b border-border-main text-left">
                    <h3 className="text-xl font-bold text-text-main" data-i18n="security_title">{t("security_title", "Thiết lập & Bảo mật tài khoản")}</h3>
                    <p className="text-xs text-text-muted font-semibold mt-1" data-i18n="security_subtitle">{t("security_subtitle", "Cấu hình bảo mật nâng cao hoặc ngừng sử dụng dịch vụ tài khoản của bạn")}</p>
                  </div>

                  <div className="space-y-6">
                    {/* Lock Account Option */}
                    <div className="p-5 border border-border-main rounded-2xl bg-bg-main flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="space-y-1 text-left">
                        <h4 className="font-bold text-sm text-text-main" data-i18n="security_lock_title">{t("security_lock_title", "Khóa tài khoản tạm thời")}</h4>
                        <p className="text-text-muted text-xs font-medium leading-relaxed max-w-lg" data-i18n="security_lock_desc">
                          {t("security_lock_desc", "Sau khi khóa, tài khoản của bạn sẽ ngay lập tức bị đăng xuất và tạm ngừng hoạt động. Bạn sẽ không thể đăng nhập lại cho đến khi liên hệ Quản trị viên hệ thống để được hỗ trợ mở khóa.")}
                        </p>
                      </div>
                      <button
                        onClick={handleLockAccount}
                        className="sm:self-center px-4 py-2.5 bg-text-main text-bg-main rounded-xl text-xs font-black hover:bg-text-main/80 transition shadow flex-shrink-0 cursor-pointer"
                        data-i18n="security_lock_btn"
                      >
                        {t("security_lock_btn", "Khóa tài khoản")}
                      </button>
                    </div>

                    {/* Delete Account Option */}
                    <div className="p-5 border border-red-200 dark:border-red-950 rounded-2xl bg-red-50/20 dark:bg-red-950/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="space-y-1 text-left">
                        <h4 className="font-bold text-sm text-red-700 dark:text-red-400" data-i18n="security_delete_title">{t("security_delete_title", "Xóa tài khoản vĩnh viễn")}</h4>
                        <p className="text-red-500/80 dark:text-red-400/80 text-xs font-medium leading-relaxed max-w-lg" data-i18n="security_delete_desc">
                          {t("security_delete_desc", "Hành động này sẽ xóa toàn bộ dữ liệu tài khoản cá nhân của bạn vĩnh viễn trên cơ sở dữ liệu hệ thống FoxStyle. Tất cả lịch sử đơn hàng và địa chỉ liên kết sẽ không thể khôi phục lại.")}
                        </p>
                      </div>
                      <button
                        onClick={handleDeleteAccount}
                        className="sm:self-center px-4 py-2.5 bg-red-600 text-white rounded-xl text-xs font-black hover:bg-red-700 transition shadow flex-shrink-0 cursor-pointer"
                        data-i18n="security_delete_btn"
                      >
                        {t("security_delete_btn", "Xóa vĩnh viễn")}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Hạng thành viên & Tích điểm */}
              {activeTab === "loyalty" && (
                <div className="space-y-6">
                  <div className="pb-3 border-b border-border-main flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                        <Award className="h-6 w-6 text-amber-500" />
                        <span>Chương trình Khách hàng Thân thiết</span>
                      </h3>
                      <p className="text-xs text-text-muted mt-1">Tích lũy điểm khi mua sắm để thăng hạng và nhận mã voucher đặc quyền!</p>
                    </div>
                    <span className="bg-amber-100 text-amber-800 font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                      Hạng {memberRank.name} {memberRank.icon}
                    </span>
                  </div>

                  {/* Rank progress bar */}
                  <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl p-6 text-white space-y-4 shadow-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xs text-amber-100 font-bold uppercase tracking-widest block">Điểm tích lũy hiện tại</span>
                        <span className="text-3xl font-black">{availablePoints.toLocaleString("vi-VN")} điểm</span>
                      </div>
                      <span className="text-xs bg-white/20 px-3 py-1 rounded-xl backdrop-blur font-bold">1 điểm = 100đ (Trừ trực tiếp)</span>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-amber-100 font-bold mb-1">
                        <span>{memberRank.next ? `Tiến trình thăng hạng ${memberRank.next}` : "Đã đạt hạng cao nhất"}</span>
                        <span>{membershipSpent.toLocaleString("vi-VN")}đ / {memberRank.target.toLocaleString("vi-VN")}đ</span>
                      </div>
                      <div className="w-full h-3 bg-black/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white rounded-full" style={{ width: `${rankProgress}%` }} />
                      </div>
                    </div>

                    {memberRank.next && (
                      <p className="text-xs text-white/90">
                        Cần chi tiêu thêm <span className="font-bold underline">{pointsToNextRank.toLocaleString("vi-VN")}đ</span> để đạt hạng <span className="font-bold">{memberRank.next}</span>.
                      </p>
                    )}
                  </div>

                  {/* Member Ranks Info */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {[
                      { rank: "Thành viên 👤", min: "Dưới 2 triệu", perk: "Tích lũy để lên hạng Bạc" },
                      { rank: "Hạng Bạc 🥈", min: "Từ 2 - dưới 5 triệu", perk: "Giảm 3% mọi đơn hàng" },
                      { rank: "Hạng Vàng 👑", min: "Từ 5 - dưới 10 triệu", perk: "Giảm 5% + Quà sinh nhật" },
                      { rank: "Kim Cương 💎", min: "Từ 10 triệu", perk: "Giảm 8% + Freeship trọn đời" }
                    ].map((item, idx) => (
                      <div key={idx} className="bg-bg-card border border-border-main p-4 rounded-2xl space-y-1">
                        <span className="font-bold text-sm text-text-main block">{item.rank}</span>
                        <span className="text-xs text-text-muted block">Mức chi tiêu: {item.min}</span>
                        <span className="text-xs font-semibold text-orange-600 block mt-2">✨ {item.perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab: Tích Điểm Thưởng Khách Hàng (Loyalty Reward Points) */}
              {activeTab === "affiliate" && (
                <div className="space-y-6 animate-in fade-in duration-200">
                  <div className="pb-3 border-b border-border-main">
                    <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                      <Coins className="h-6 w-6 text-emerald-500" />
                      <span>Chương Trình Tích Điểm Thưởng Khách Hàng (FoxStyle Rewards)</span>
                    </h3>
                    <p className="text-xs text-text-muted mt-1">
                      Mua sắm tích lũy điểm thưởng! Mỗi đơn hàng mua sắm thành công được cộng điểm thưởng và bạn có thể quy đổi điểm để trừ trực tiếp tiền vào các đơn hàng tiếp theo.
                    </p>
                  </div>

                  {/* Main Points Overview Banner */}
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-6 shadow-lg space-y-4 relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                    
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
                      <div>
                        <span className="text-xs font-black uppercase tracking-wider text-emerald-100 block">
                          Số Điểm Thưởng Khả Dụng (Thực tế)
                        </span>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className="text-4xl font-black text-white tracking-tight">{availablePoints}</span>
                          <span className="text-base font-bold text-emerald-200">Điểm</span>
                        </div>
                        <p className="text-xs text-emerald-100 font-semibold mt-1">
                          = Tương đương <strong className="text-white underline">{rewardPointsValue.toLocaleString('vi-VN')}đ</strong> giảm trực tiếp vào đơn hàng ở bước Thanh toán
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => alert("Điểm thưởng của bạn đã sẵn sàng! Khi thanh toán đơn hàng tiếp theo, hãy chọn 'Dùng Điểm Thưởng' để được giảm tiền trực tiếp.")}
                        className="bg-white hover:bg-emerald-50 text-emerald-800 font-black text-xs px-5 py-3 rounded-2xl shadow-md transition cursor-pointer shrink-0"
                      >
                        🛍️ Đổi Điểm Trừ Tiền Đơn Hàng
                      </button>
                    </div>

                    <div className="pt-3 border-t border-white/20 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-semibold text-emerald-50">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-300 shrink-0" />
                        <span>Mỗi 1 đơn hàng mua sắm thành công = Cộng 1 điểm thưởng</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-300 shrink-0" />
                        <span>1 Điểm thưởng = 100đ trừ trực tiếp vào hóa đơn khi thanh toán</span>
                      </div>
                    </div>
                  </div>

                  {/* Point History List */}
                  <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-border-main p-6 space-y-4">
                    <h4 className="font-extrabold text-text-main text-sm uppercase tracking-wider flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-500" />
                      <span>Lịch Sử Tích & Sử Dụng Điểm Thưởng</span>
                    </h4>

                    <div className="space-y-3">
                      {userOrdersList.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-border-main bg-bg-main p-6 text-center text-xs font-semibold text-text-muted">
                          Tài khoản này chưa có giao dịch tích điểm.
                        </div>
                      ) : userOrdersList.map((order) => (
                        <div key={order.id} className="p-3.5 rounded-2xl bg-bg-main border border-border-main flex items-center justify-between gap-3 text-xs">
                          <div>
                            <span className="font-bold text-text-main block">Cộng điểm thưởng từ đơn hàng #{order.id}</span>
                            <span className="text-[10px] text-text-muted font-medium">{order.date}</span>
                          </div>

                          <div className="text-right">
                            <span className="font-black block text-sm text-emerald-600">
                              +1 điểm
                            </span>
                            <span className="text-[10px] font-bold text-text-muted">
                              (+100đ giảm giá)
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 4: Change Password with Email OTP */}
              {activeTab === "password" && (
                <div className="space-y-6">
                  <div className="pb-3 border-b border-border-main">
                    <h3 className="text-xl font-bold text-text-main">Đổi mật khẩu bảo mật</h3>
                    <p className="text-xs text-text-muted mt-1">Yêu cầu xác nhận mã OTP gồm 6 số được gửi tới email {currentUser.email} trước khi cập nhật.</p>
                  </div>

                  <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                    
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">Mật khẩu hiện tại *</label>
                      <input
                        type="password"
                        required
                        value={pwdForm.oldPwd}
                        onChange={(e) => setPwdForm({ ...pwdForm, oldPwd: e.target.value })}
                        className="w-full px-4 py-2 border border-border-main bg-bg-main text-text-main rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="••••••••"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">Mật khẩu mới *</label>
                      <input
                        type="password"
                        required
                        value={pwdForm.newPwd}
                        onChange={(e) => setPwdForm({ ...pwdForm, newPwd: e.target.value })}
                        className="w-full px-4 py-2 border border-border-main bg-bg-main text-text-main rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Tối thiểu 8 ký tự"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5">Xác nhận mật khẩu mới *</label>
                      <input
                        type="password"
                        required
                        value={pwdForm.confirmPwd}
                        onChange={(e) => setPwdForm({ ...pwdForm, confirmPwd: e.target.value })}
                        className="w-full px-4 py-2 border border-border-main bg-bg-main text-text-main rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Nhập lại mật khẩu mới"
                      />
                    </div>

                    {/* Email OTP Section */}
                    <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-200 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-orange-900">Mã xác thực OTP gửi tới email:</span>
                        <button
                          type="button"
                          onClick={handleSendPasswordOtp}
                          disabled={otpLoading}
                          className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-xl transition cursor-pointer"
                        >
                          {otpLoading ? "Đang gửi..." : otpSent ? "Gửi lại OTP" : "Gửi OTP tới email"}
                        </button>
                      </div>

                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={pwdForm.otpCode}
                        onChange={(e) => setPwdForm({
                          ...pwdForm,
                          otpCode: e.target.value.replace(/\D/g, "").slice(0, 6)
                        })}
                        className="w-full px-4 py-2 border border-orange-300 rounded-xl text-center font-mono font-black text-lg tracking-widest bg-white"
                        placeholder="Mã OTP 6 số"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-orange-700 shadow transition text-sm cursor-pointer w-full"
                    >
                      Xác nhận đổi mật khẩu
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      {/* --- Add / Edit Address Dialog Modal --- */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[999] backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-bg-main text-text-main rounded-3xl shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col relative overflow-hidden border border-border-main animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-pink-600 p-5 text-white flex justify-between items-center shrink-0">
              <h3 className="text-lg font-bold" data-i18n={addressForm.id ? "address_modal_title_edit" : "address_modal_title_add"}>
                {addressForm.id ? t("address_modal_title_edit", "Cập nhật địa chỉ") : t("address_modal_title_add", "Thêm địa chỉ nhận hàng")}
              </h3>
              <button onClick={() => setShowAddressModal(false)} className="hover:bg-white/20 p-1.5 rounded-full transition cursor-pointer">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Body Form - Fully Scrollable */}
            <form onSubmit={handleAddressSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(92vh-70px)]">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5" data-i18n="address_recipient_name">
                  {t("address_recipient_name", "Họ và tên người nhận *")}
                </label>
                <input
                  type="text"
                  required
                  value={addressForm.fullName}
                  onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className="w-full px-4 py-2.5 border border-border-main bg-bg-card text-text-main rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5" data-i18n="address_phone">
                  {t("address_phone", "Số điện thoại *")}
                </label>
                <input
                  type="tel"
                  required
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  placeholder="Số điện thoại nhận hàng"
                  className="w-full px-4 py-2.5 border border-border-main bg-bg-card text-text-main rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5" data-i18n="address_detail">
                  {t("address_detail", "Số nhà, ngõ ngách, tên đường *")}
                </label>
                <input
                  type="text"
                  required
                  value={addressForm.detailAddress}
                  onChange={(e) => setAddressForm({ ...addressForm, detailAddress: e.target.value })}
                  placeholder="Ví dụ: 12 Ngõ 34 Phố Hàng Khay"
                  className="w-full px-4 py-2.5 border border-border-main bg-bg-card text-text-main rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5" data-i18n="address_ward">
                    {t("address_ward", "Phường / Xã *")}
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.ward}
                    onChange={(e) => setAddressForm({ ...addressForm, ward: e.target.value, district: e.target.value })}
                    placeholder="Ví dụ: Phường Hàng Bài"
                    className="w-full px-4 py-2.5 border border-border-main bg-bg-card text-text-main rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-1.5" data-i18n="address_city">
                  {t("address_city", "Thành phố *")}
                </label>
                <select
                  required
                  value={addressForm.city}
                  onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                  className="w-full px-4 py-2.5 border border-border-main bg-bg-card text-text-main rounded-xl text-base focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold"
                >
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="TP HCM">TP Hồ Chí Minh</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Hải Phòng">Hải Phòng</option>
                  <option value="Cần Thơ">Cần Thơ</option>
                  <option value="Hoàng Sa">Hoàng Sa</option>
                  <option value="Trường Sa">Trường Sa</option>
                </select>
              </div>

              {/* Map display for location verification */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-text-main" data-i18n="address_map_title">
                  {t("address_map_title", "📍 Xác định vị trí địa chỉ này trên bản đồ")}
                </label>
                <div id="account-address-map" className="w-full h-48 rounded-2xl border border-border-main shadow-inner relative overflow-hidden" style={{ zIndex: 1 }} />
                <p className="text-[10px] text-text-muted font-medium" data-i18n="address_map_desc">
                  {t("address_map_desc", "Bản đồ tự động ghim vị trí khi gõ địa chỉ hoặc bạn có thể click chọn trực tiếp để chỉnh sửa.")}
                </p>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="addr-default"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                  className="text-orange-600 rounded focus:ring-orange-500 h-5 w-5 cursor-pointer"
                />
                <label htmlFor="addr-default" className="text-sm text-text-muted font-bold cursor-pointer" data-i18n="address_default_checkbox">
                  {t("address_default_checkbox", "Đặt làm địa chỉ mặc định")}
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 text-white font-bold py-3.5 rounded-2xl text-base shadow-lg hover:bg-orange-700 active:scale-[0.99] transition cursor-pointer mt-4"
                data-i18n={addressForm.id ? "address_save_btn" : "address_create_btn"}
              >
                {addressForm.id ? t("address_save_btn", "Lưu địa chỉ") : t("address_create_btn", "Tạo mới địa chỉ")}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// Dialog Close helper icon
function XIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
