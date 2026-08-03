import { useState, useEffect, useRef } from "react";
import { Heart, LogIn, LogOut, Menu, Search, Shield, ShoppingBag, User, X, Bell } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useApp } from "../context/AppContext";

export function Header() {
  const navigate = useNavigate();
  const {
    cart,
    wishlist,
    currentUser,
    login,
    register,
    logout,
    notifications,
    addNotification,
    markAllNotificationsAsRead,
    clearNotifications
  } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualTitle, setManualTitle] = useState("");
  const [manualContent, setManualContent] = useState("");
  const notifRef = useRef(null);

  const unreadCount = notifications ? notifications.filter((n) => !n.isRead).length : 0;

  const handleManualNotifSubmit = (e) => {
    e.preventDefault();
    if (manualTitle.trim() && manualContent.trim()) {
      addNotification(manualTitle, manualContent, "info");
      setManualTitle("");
      setManualContent("");
      setShowManualForm(false);
      alert("Đã gửi thông báo thủ công thành công!");
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`);
      setMobileMenuOpen(false);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (isRegisterMode) {
      if (!username || !password || !fullName || !email) {
        setErrorMsg("Vui lòng điền đầy đủ thông tin bắt buộc.");
        return;
      }
      const res = await register(username, password, fullName, email, phone);
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          setIsRegisterMode(false);
          setErrorMsg("");
          setSuccessMsg("");
        }, 1500);
      } else {
        setErrorMsg(res.message);
      }
      return;
    }

    const res = await login(username, password);
    if (res.success) {
      setShowLoginModal(false);
      setUsername("");
      setPassword("");
      navigate(res.user.role === "admin" || res.user.role === "staff" ? "/admin" : "/products");
    } else {
      setErrorMsg(res.message);
    }
  };

  const triggerQuickLogin = (userType) => {
    setErrorMsg("");
    if (userType === "admin") {
      setUsername("admin_fox");
      setPassword("123456");
    } else if (userType === "staff") {
      setUsername("staff_chien");
      setPassword("123456");
    } else {
      setUsername("customer_demo");
      setPassword("123456");
    }
  };

  const openLogin = () => {
    setErrorMsg("");
    setIsRegisterMode(false);
    setShowLoginModal(true);
  };

  const navLinkClass = "text-sm font-black uppercase tracking-[0.16em] text-zinc-700 transition hover:text-zinc-950";

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="bg-zinc-950 px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.18em] text-white">
        FoxStyle summer edit · Miễn phí vận chuyển cho đơn từ 499K
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-zinc-950 text-xl font-black text-white">F</div>
            <div className="leading-none">
              <span className="block text-xl font-black tracking-normal text-zinc-950">FoxStyle</span>
              <span className="hidden text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-500 sm:block">Fashion store</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            <Link to="/" className={navLinkClass}>Trang chủ</Link>
            <Link to="/products" className={navLinkClass}>Sản phẩm</Link>
            <Link to="/products?category=ao" className={navLinkClass}>Áo</Link>
            <Link to="/products?category=vay" className={navLinkClass}>Váy</Link>
            <Link to="/products?sale=true" className="text-sm font-black uppercase tracking-[0.16em] text-red-600 transition hover:text-zinc-950">Sale</Link>
          </nav>

          <form onSubmit={handleSearchSubmit} className="hidden flex-1 md:block md:max-w-xs">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm sản phẩm..."
                className="h-11 w-full border border-zinc-200 bg-zinc-50 px-4 pl-10 text-sm font-medium outline-none transition focus:border-zinc-950 focus:bg-white"
              />
              <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" aria-label="Tìm kiếm">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>

          <div className="hidden items-center gap-2 md:flex">
            <Link to="/account?tab=wishlist" className="relative flex h-10 w-10 items-center justify-center text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950" aria-label="Yêu thích">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-black text-white">{wishlistCount}</span>}
            </Link>

            {/* Notification Bell & Dropdown */}
            {currentUser && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                  className="relative flex h-10 w-10 items-center justify-center text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950"
                  aria-label="Thông báo"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-black text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifDropdown && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-zinc-200 shadow-xl rounded-2xl overflow-hidden z-[100] animate-in fade-in duration-150">
                    <div className="flex items-center justify-between p-4 border-b border-zinc-100 bg-zinc-50">
                      <span className="font-extrabold text-sm text-zinc-900 uppercase tracking-wider">Thông báo</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-xs text-orange-600 hover:underline font-bold"
                        >
                          Đọc tất cả
                        </button>
                      )}
                    </div>

                    <div className="max-h-64 overflow-y-auto divide-y divide-zinc-100">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-zinc-400 text-xs font-semibold">
                          Không có thông báo nào.
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-4 transition hover:bg-zinc-50 ${
                              !notif.isRead ? "bg-orange-50/30" : ""
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-bold text-xs text-zinc-900">{notif.title}</span>
                              <span className="text-[9px] text-zinc-400 font-bold shrink-0">
                                {new Date(notif.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-600 mt-1 leading-relaxed">{notif.content}</p>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Manual Notification Form (Demo) */}
                    {currentUser && (currentUser.role === 'admin' || currentUser.role === 'staff') && (
                      <div className="p-4 bg-zinc-50 border-t border-zinc-100">
                        <button
                          type="button"
                          onClick={() => setShowManualForm(!showManualForm)}
                          className="w-full text-center text-xs font-bold text-zinc-700 hover:text-zinc-950 flex items-center justify-center space-x-1"
                        >
                          <span>{showManualForm ? "Ẩn gửi thông báo" : "Tạo thông báo thủ công (Test)"}</span>
                        </button>
                        
                        {showManualForm && (
                          <form onSubmit={handleManualNotifSubmit} className="mt-3 space-y-2">
                            <input
                              type="text"
                              required
                              value={manualTitle}
                              onChange={(e) => setManualTitle(e.target.value)}
                              placeholder="Tiêu đề thông báo..."
                              className="w-full px-2.5 py-1.5 border border-zinc-200 bg-white rounded-lg text-xs outline-none focus:border-zinc-950"
                            />
                            <textarea
                              required
                              value={manualContent}
                              onChange={(e) => setManualContent(e.target.value)}
                              placeholder="Nội dung..."
                              rows={2}
                              className="w-full px-2.5 py-1.5 border border-zinc-200 bg-white rounded-lg text-xs outline-none focus:border-zinc-950"
                            />
                            <button
                              type="submit"
                              className="w-full bg-zinc-950 hover:bg-zinc-800 text-white font-bold py-1.5 rounded-lg text-xs transition"
                            >
                              Gửi thông báo
                            </button>
                          </form>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            <Link to="/cart" className="relative flex h-10 w-10 items-center justify-center text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950" aria-label="Giỏ hàng">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-zinc-950 px-1 text-[10px] font-black text-white">{cartCount}</span>}
            </Link>

            {currentUser ? (
              <div className="flex items-center gap-2 border-l border-zinc-200 pl-3">
                <Link to="/account" className="flex items-center gap-2 px-2 py-1.5 text-sm font-bold text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950">
                  <span className="flex h-8 w-8 items-center justify-center bg-zinc-950 text-xs font-black text-white">
                    {currentUser.fullName.charAt(0)}
                  </span>
                  <span className="max-w-[120px] truncate">{currentUser.fullName}</span>
                </Link>
                {(currentUser.role === "admin" || currentUser.role === "staff") && (
                  <Link to="/admin" className="flex h-10 w-10 items-center justify-center text-zinc-700 hover:bg-zinc-100" title="Kênh quản trị">
                    <Shield className="h-5 w-5" />
                  </Link>
                )}
                <button onClick={logout} className="flex h-10 w-10 items-center justify-center text-zinc-500 transition hover:bg-red-50 hover:text-red-600" title="Đăng xuất">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={openLogin}
                className="inline-flex h-11 items-center gap-2 bg-zinc-950 px-5 text-sm font-black uppercase tracking-[0.14em] text-white transition hover:bg-amber-300 hover:text-zinc-950"
              >
                <LogIn className="h-4 w-4" />
                Đăng nhập
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                  className="relative flex h-10 w-10 items-center justify-center text-zinc-700"
                  aria-label="Thông báo"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-black text-white">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {showNotifDropdown && (
                  <div className="absolute right-0 mt-2 w-72 bg-white border border-zinc-200 shadow-xl rounded-2xl overflow-hidden z-[100] animate-in fade-in duration-150">
                    <div className="flex items-center justify-between p-4 border-b border-zinc-100 bg-zinc-50">
                      <span className="font-extrabold text-sm text-zinc-900 uppercase tracking-wider">Thông báo</span>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-xs text-orange-600 hover:underline font-bold"
                        >
                          Đọc tất cả
                        </button>
                      )}
                    </div>

                    <div className="max-h-60 overflow-y-auto divide-y divide-zinc-100">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-zinc-400 text-xs font-semibold">
                          Không có thông báo nào.
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            className={`p-3 transition hover:bg-zinc-50 ${
                              !notif.isRead ? "bg-orange-50/30" : ""
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-bold text-xs text-zinc-900">{notif.title}</span>
                            </div>
                            <p className="text-[11px] text-zinc-600 mt-1 leading-relaxed">{notif.content}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <Link to="/cart" className="relative flex h-10 w-10 items-center justify-center text-zinc-700" aria-label="Giỏ hàng">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-zinc-950 px-1 text-[10px] font-black text-white">{cartCount}</span>}
            </Link>
            <button className="flex h-10 w-10 items-center justify-center text-zinc-700" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Mở menu">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-zinc-200 py-5 md:hidden">
            <form onSubmit={handleSearchSubmit} className="mb-5">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm sản phẩm..."
                  className="h-11 w-full border border-zinc-200 px-4 pr-10 text-sm outline-none focus:border-zinc-950"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500" aria-label="Tìm kiếm">
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>
            <nav className="grid gap-3 text-sm font-black uppercase tracking-[0.14em] text-zinc-800">
              {[
                ["Trang chủ", "/"],
                ["Sản phẩm", "/products"],
                ["Áo", "/products?category=ao"],
                ["Quần", "/products?category=quan"],
                ["Váy", "/products?category=vay"],
                ["Phụ kiện", "/products?category=phu-kien"],
                ["Khuyến mãi", "/products?sale=true"],
              ].map(([label, href]) => (
                <Link key={href} to={href} onClick={() => setMobileMenuOpen(false)} className="border-b border-zinc-100 py-2 hover:text-amber-700">
                  {label}
                </Link>
              ))}
              {currentUser ? (
                <>
                  <Link to="/account" onClick={() => setMobileMenuOpen(false)} className="py-2 hover:text-amber-700">Tài khoản</Link>
                  {(currentUser.role === "admin" || currentUser.role === "staff") && <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="py-2 text-amber-700">Quản trị</Link>}
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="py-2 text-left text-red-600">Đăng xuất</button>
                </>
              ) : (
                <button onClick={() => { openLogin(); setMobileMenuOpen(false); }} className="mt-2 bg-zinc-950 px-4 py-3 text-white">
                  Đăng nhập
                </button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>

    {showLoginModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-200 px-6 py-5">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-zinc-500">FoxStyle account</p>
                <h3 className="mt-1 text-2xl font-black text-zinc-950">{isRegisterMode ? "Tạo tài khoản" : "Đăng nhập"}</h3>
              </div>
              <button onClick={() => setShowLoginModal(false)} className="flex h-10 w-10 items-center justify-center hover:bg-zinc-100" aria-label="Đóng">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6">
              {errorMsg && <div className="mb-4 border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-700">{errorMsg}</div>}
              {successMsg && <div className="mb-4 border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{successMsg}</div>}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {isRegisterMode && (
                  <>
                    <Field label="Họ và tên *" value={fullName} onChange={setFullName} placeholder="Nguyễn Văn A" required />
                    <Field label="Email *" type="email" value={email} onChange={setEmail} placeholder="email@example.com" required />
                    <Field label="Số điện thoại" type="tel" value={phone} onChange={setPhone} placeholder="0123456789" />
                  </>
                )}

                <Field label="Tên đăng nhập *" value={username} onChange={setUsername} placeholder="user" required />
                <Field label="Mật khẩu *" type="password" value={password} onChange={setPassword} placeholder="••••••••" required />

                <button type="submit" className="flex h-12 w-full items-center justify-center bg-zinc-950 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-amber-300 hover:text-zinc-950">
                  {isRegisterMode ? "Đăng ký" : "Đăng nhập"}
                </button>
              </form>

              {!isRegisterMode && (
                <div className="mt-6 border-t border-zinc-200 pt-5">
                  <p className="mb-3 text-center text-xs font-black uppercase tracking-[0.18em] text-zinc-500">Đăng nhập nhanh để test</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      ["user", "Khách hàng"],
                      ["staff", "Nhân viên"],
                      ["admin", "Quản trị"],
                    ].map(([type, label]) => (
                      <button key={type} onClick={() => triggerQuickLogin(type)} className="border border-zinc-200 px-2 py-2 text-xs font-black text-zinc-700 hover:border-zinc-950">
                        {label}
                      </button>
                    ))}
                  </div>
                  <p className="mt-3 text-center text-[11px] text-zinc-400">Mật khẩu mẫu: 123456</p>
                </div>
              )}

              <div className="mt-5 text-center">
                <button
                  onClick={() => {
                    setIsRegisterMode(!isRegisterMode);
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className="text-sm font-black text-zinc-950 underline decoration-zinc-300 underline-offset-4 hover:text-amber-700"
                >
                  {isRegisterMode ? "Đã có tài khoản? Đăng nhập" : "Chưa có tài khoản? Đăng ký"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Field({ label, value, onChange, type = "text", placeholder, required = false }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-black uppercase tracking-[0.16em] text-zinc-500">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-11 w-full border border-zinc-200 px-3 text-sm font-medium outline-none transition focus:border-zinc-950"
      />
    </label>
  );
}
