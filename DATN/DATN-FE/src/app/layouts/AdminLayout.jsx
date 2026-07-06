import { Outlet, Link, useLocation } from "react-router";
import { useApp } from "../context/AppContext";
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  ShoppingCart,
  Users,
  Tag,
  BarChart3,
  LogOut,
  ShieldAlert
} from "lucide-react";

export function AdminLayout() {
  const location = useLocation();
  const { currentUser, logout } = useApp();

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

  const navItems = [
    { path: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/admin/products", icon: Package, label: "Sản phẩm" },
    { path: "/admin/categories", icon: FolderOpen, label: "Danh mục" },
    { path: "/admin/orders", icon: ShoppingCart, label: "Đơn hàng" },
    { path: "/admin/customers", icon: Users, label: "Khách hàng" },
    { path: "/admin/promotions", icon: Tag, label: "Khuyến mãi" },
    { path: "/admin/stats", icon: BarChart3, label: "Thống kê" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white z-50">
        <div className="p-6 h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-8">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">F</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">FoxStyle</h1>
                <p className="text-xs text-gray-400">Admin Portal</p>
              </div>
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
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div>
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
      <div className="ml-64">
        <header className="bg-white shadow-sm sticky top-0 z-40">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {navItems.find((item) => item.path === location.pathname)?.label || "Dashboard"}
              </h2>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{currentUser.fullName}</p>
                  <p className="text-xs text-orange-600 font-medium capitalize">{currentUser.role}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                  {currentUser.fullName.charAt(0)}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
