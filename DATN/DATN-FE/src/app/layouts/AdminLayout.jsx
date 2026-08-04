import { Outlet, Link, Navigate, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { Toaster } from "sonner";
import { ScrollButtons } from "../components/ScrollButtons";
import { initializeAdminDataSync } from "../services/adminDataSync";
import { createDailyAdminBackup } from "../services/dailyBackup";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  ShoppingCart,
  Users,
  Tag,
  BarChart3,
  LogOut,
  ShieldAlert,
  ShieldCheck,
  MessageSquare,
  Home,
  Image,
  Bell,
  ClipboardList,
  Wallet,
  Settings,
  Star,
  CreditCard,
  Truck,
  Award,
  FileText,
  Layers,
  Warehouse,
  Globe2,
  Menu,
  X
} from "lucide-react";

export function AdminLayout() {
  const location = useLocation();
  const { currentUser, logout, restoringSession, chats = [], orders = [], products = [], users = [], coupons = [] } = useApp();
  const unreadChatCount = chats.reduce(
    (total, chat) => total + Number(chat.unreadCount || 0),
    0
  );
  const [adminDataReady, setAdminDataReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const staffRestrictedPaths = new Set([
    "/admin/staff",
    "/admin/shipping-settings",
    "/admin/site-settings"
  ]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!currentUser || !["admin", "staff"].includes(currentUser.role)) {
      setAdminDataReady(false);
      return;
    }
    let active = true;
    initializeAdminDataSync().finally(() => {
      if (active) setAdminDataReady(true);
    });
    return () => {
      active = false;
    };
  }, [currentUser]);

  useEffect(() => {
    if (!adminDataReady || currentUser?.role !== "admin") return;
    const timer = window.setTimeout(() => {
      try {
        createDailyAdminBackup({ orders, products, users, coupons, currentUser }).catch((error) => {
          console.error("Không thể lưu backup vĩnh viễn lên máy chủ:", error);
        });
      } catch (error) {
        console.error("Không thể tạo backup dữ liệu hằng ngày:", error);
      }
    }, 1200);
    return () => window.clearTimeout(timer);
  }, [adminDataReady, currentUser, orders, products, users, coupons]);

  if (restoringSession) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-amber-300 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white text-xs font-black uppercase tracking-[0.2em] animate-pulse">Đang khôi phục phiên đăng nhập...</p>
        </div>
      </div>
    );
  }

  // Route authorization check
  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "staff")) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full border border-red-100">
          <ShieldAlert className="h-16 w-16 mx-auto text-red-500 mb-4 animate-bounce" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Truy cập bị từ chối</h1>
          <p className="text-gray-600 mb-6">
            Bạn cần đăng nhập bằng tài khoản Quản trị viên hoặc Nhân viên để truy cập trang này.
          </p>
          <div className="space-y-3">
            <Link
              to="/"
              className="block w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
            >
              Quay lại Trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (currentUser.role === "staff" && staffRestrictedPaths.has(location.pathname)) {
    return <Navigate to="/admin" replace />;
  }

  if (!adminDataReady) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-400 border-t-transparent" />
        <p className="text-xs font-black uppercase tracking-widest text-white">
          Đang đồng bộ dữ liệu quản trị...
        </p>
      </div>
    );
  }

  const isAdmin = currentUser && currentUser.role === "admin";

  const navItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Tổng quan", adminOnly: false },
    { path: "/admin/orders", icon: ShoppingCart, label: "Theo dõi đơn hàng", adminOnly: false },
    { path: "/admin/deliveries", icon: Truck, label: "Quản lý giao hàng", adminOnly: false },
    { path: "/admin/transactions", icon: CreditCard, label: "Lịch sử giao dịch", adminOnly: false },
    { path: "/admin/products", icon: Package, label: "Sản phẩm", adminOnly: false },
    { path: "/admin/inventory", icon: Warehouse, label: "Quản lý kho", adminOnly: false },
    { path: "/admin/brands", icon: Award, label: "Thương hiệu", adminOnly: false },
    { path: "/admin/categories", icon: FolderOpen, label: "Danh mục", adminOnly: false },
    { path: "/admin/topics", icon: Layers, label: "Chủ đề bài viết", adminOnly: false },
    { path: "/admin/articles", icon: FileText, label: "Bài viết & Tin tức", adminOnly: false },
    { path: "/admin/chats", icon: MessageSquare, label: "Trò chuyện hỗ trợ", adminOnly: false, badge: unreadChatCount },
    { path: "/admin/reviews", icon: Star, label: "Quản lý đánh giá", adminOnly: false },
    { path: "/admin/warranties", icon: ShieldCheck, label: "Bảo hành sản phẩm", adminOnly: false },

    // Các mục độc quyền Quản trị viên (Admin)
    ...(isAdmin
      ? [
          { path: "/admin/customers", icon: Users, label: "Khách hàng" },
          { path: "/admin/promotions", icon: Tag, label: "Khuyến mãi" },
          { path: "/admin/stats", icon: BarChart3, label: "Báo cáo kinh doanh" },
          { path: "/admin/security", icon: ShieldAlert, label: "Chống gian lận & Bảo mật" },
          { path: "/admin/crm", icon: MessageSquare, label: "Chăm sóc khách tự động" },
          { path: "/admin/banners", icon: Image, label: "Quản lý Banner" },
          { path: "/admin/staff", icon: Users, label: "Quản lý nhân viên" },
          { path: "/admin/notifications", icon: Bell, label: "Gửi thông báo" },
          { path: "/admin/shipping-settings", icon: Settings, label: "Cấu hình vận chuyển" },
          { path: "/admin/site-settings", icon: Globe2, label: "Website & Chính sách" }
        ]
      : [])
  ];


  return (
    <div className="min-h-screen max-w-full overflow-x-hidden bg-gray-100">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Đóng menu quản trị"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 z-50 h-dvh w-[min(16rem,86vw)] bg-gray-900 text-white transition-transform duration-300 lg:w-64 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-full overflow-y-auto p-4 sm:p-6 flex flex-col justify-between scrollbar-thin">
          <div>
            <div className="mb-8 flex items-center gap-3">
              <div className="w-11 h-11 bg-white p-1 rounded-xl shadow-md flex items-center justify-center">
                <img src="/image_quan_tri/logo.jpg" alt="FoxStyle Logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-xl font-black bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">FoxStyle</h1>
                <p className="text-[9px] font-bold uppercase tracking-wider text-orange-400">Cổng quản trị</p>
              </div>
              <button type="button" onClick={() => setSidebarOpen(false)} className="ml-auto rounded-lg p-2 text-gray-300 hover:bg-gray-800 lg:hidden" aria-label="Đóng menu">
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                      isActive
                        ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-md"
                        : "hover:bg-gray-800 text-gray-300"
                    }`}
                  >
                    <span className="relative shrink-0">
                      <Icon className="h-5 w-5" />
                      {item.badge > 0 && (
                        <span className="absolute -right-1.5 -top-1.5 h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-gray-900" />
                      )}
                    </span>
                    <span className="flex-1">{item.label}</span>
                    {item.badge > 0 && (
                      <span className="min-w-5 rounded-full bg-red-500 px-1.5 py-0.5 text-center text-[10px] font-black text-white">
                        {item.badge > 99 ? "99+" : item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="space-y-1.5">
            <Link
              to="/"
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-gray-800 text-gray-300 transition"
            >
              <Home className="h-5 w-5" />
              <span>Quay lại trang chủ</span>
            </Link>
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-900/50 hover:text-red-200 text-gray-300 transition text-left"
            >
              <LogOut className="h-5 w-5" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="min-w-0 lg:ml-64">
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="px-3 py-3 sm:px-5 lg:px-8 lg:py-4">
            <div className="flex min-w-0 items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <button type="button" onClick={() => setSidebarOpen(true)} className="shrink-0 rounded-lg p-2 text-gray-700 hover:bg-gray-100 lg:hidden" aria-label="Mở menu quản trị">
                  <Menu className="h-5 w-5" />
                </button>
              <h2 className="truncate text-base font-bold text-gray-900 sm:text-xl lg:text-2xl">
                {navItems.find((item) => item.path === location.pathname)?.label || "Tổng quan"}
              </h2>
              </div>
              <div className="flex shrink-0 items-center gap-2 sm:gap-4">
                <div className="hidden text-right sm:block">
                  <p className="font-bold text-gray-900 text-sm">{currentUser.fullName || currentUser.username}</p>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                    currentUser.role === "admin"
                      ? "bg-orange-100 text-orange-700 border border-orange-200"
                      : "bg-purple-100 text-purple-700 border border-purple-200"
                  }`}>
                    {currentUser.role === "admin" ? "Quản trị viên" : "Nhân viên"}
                  </span>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                  {(currentUser.fullName || currentUser.username || "?").charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="min-w-0 p-3 sm:p-5 lg:p-8">
          <Outlet />
        </main>
        <ScrollButtons />
        <Toaster position="top-right" richColors />
      </div>
    </div>
  );
}
