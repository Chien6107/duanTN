import { useState } from "react";
import { 
  Package, ShoppingCart, Users, DollarSign, TrendingUp, ArrowRight, 
  Truck, CheckCircle2, AlertTriangle, Flame, Clock, Sparkles, Plus, 
  RefreshCw, BarChart3, PieChart, ShieldAlert, Award, ChevronRight, Layers
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Link } from "react-router";

export function AdminDashboard() {
  const { products = [], orders = [], users = [], loadCatalogData } = useApp();
  const [timeframe, setTimeframe] = useState("all"); // "all", "month", "week", "today"
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadCatalogData();
    } finally {
      setIsRefreshing(false);
    }
  };

  const getOrderDate = (order) => {
    const rawDate = order.date || order.orderDate || order.createdAt || order.createdDate;
    if (!rawDate) return null;
    const parsed = new Date(String(rawDate).replace(" ", "T"));
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  // Filter orders based on timeframe
  const filteredOrders = orders.filter(o => {
    if (timeframe === "all") return true;
    const orderDate = getOrderDate(o);
    if (!orderDate) return false;
    const now = new Date();
    if (timeframe === "today") {
      return orderDate.toDateString() === now.toDateString();
    }
    if (timeframe === "week") {
      const start = new Date(now);
      start.setHours(0, 0, 0, 0);
      start.setDate(start.getDate() - 6);
      return orderDate >= start && orderDate <= now;
    }
    if (timeframe === "month") {
      return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  // Calculate dynamic stats
  const totalProducts = products.length;
  const totalOrders = filteredOrders.length;
  const totalCustomers = users.filter(u => u.role === "customer" || u.role === "GUEST").length;

  // Order status counts
  const completedOrders = filteredOrders.filter(o => o.status === "completed");
  const shippingOrders = filteredOrders.filter(o => o.status === "shipping");
  const pendingOrders = filteredOrders.filter(o => o.status === "processing" || o.status === "pending" || !o.status);
  const cancelledOrders = filteredOrders.filter(o => o.status === "cancelled");
  const returnedOrders = filteredOrders.filter(o => o.status === "returned");

  const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.total || o.totalAmount || 0), 0);
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / (completedOrders.length || 1)) : 0;

  // Low stock products alert (quantity < 10)
  const lowStockProducts = products.filter(p => (p.quantity !== undefined ? p.quantity : 10) <= 10);

  const stats = [
    {
      label: "Tổng Doanh Thu",
      value: `${totalRevenue.toLocaleString('vi-VN')}đ`,
      subtext: `${completedOrders.length} đơn hoàn thành`,
      change: `${totalRevenue.toLocaleString("vi-VN")}đ thực thu`,
      trend: "up",
      icon: DollarSign,
      color: "from-orange-500 to-amber-600",
      lightBg: "bg-orange-50 text-orange-600 border-orange-100",
    },
    {
      label: "Tổng Đơn Hàng",
      value: totalOrders.toString(),
      subtext: `${shippingOrders.length} đang giao`,
      change: `${completedOrders.length} hoàn tất`,
      trend: "up",
      icon: ShoppingCart,
      color: "from-blue-500 to-indigo-600",
      lightBg: "bg-blue-50 text-blue-600 border-blue-100",
    },
    {
      label: "Khách Hàng Signups",
      value: totalCustomers.toString(),
      subtext: "Thành viên tài khoản",
      change: `${users.filter((user) => Number(user.status ?? 1) === 1).length} đang hoạt động`,
      trend: "up",
      icon: Users,
      color: "from-purple-500 to-pink-600",
      lightBg: "bg-purple-50 text-purple-600 border-purple-100",
    },
    {
      label: "Sản Phẩm Trong Kho",
      value: totalProducts.toString(),
      subtext: `${lowStockProducts.length} sản phẩm sắp hết hàng`,
      change: lowStockProducts.length > 0 ? `${lowStockProducts.length} Cảnh báo` : "An toàn",
      trend: lowStockProducts.length > 0 ? "warn" : "up",
      icon: Package,
      color: "from-emerald-500 to-teal-600",
      lightBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
  ];

  // Order status breakdown data
  const statusBreakdown = [
    { label: "Hoàn thành", count: completedOrders.length, color: "bg-green-500", text: "text-green-700", bg: "bg-green-50" },
    { label: "Đang giao", count: shippingOrders.length, color: "bg-blue-500", text: "text-blue-700", bg: "bg-blue-50" },
    { label: "Chờ xử lý", count: pendingOrders.length, color: "bg-amber-500", text: "text-amber-700", bg: "bg-amber-50" },
    { label: "Đã hủy", count: cancelledOrders.length, color: "bg-rose-500", text: "text-rose-700", bg: "bg-rose-50" },
    { label: "Hoàn trả", count: returnedOrders.length, color: "bg-purple-500", text: "text-purple-700", bg: "bg-purple-50" },
  ];

  // Get recent 5 orders
  const recentOrders = [...filteredOrders]
    .sort((a, b) => (getOrderDate(b)?.getTime() || 0) - (getOrderDate(a)?.getTime() || 0))
    .slice(0, 5);

  // Group top products dynamically
  const productSales = {};
  completedOrders.forEach(order => {
    order.items?.forEach(item => {
      const name = item.product?.name || item.productName || "Sản phẩm";
      const qty = item.quantity || 1;
      const price = item.price ?? item.product?.price ?? 0;
      const rev = price * qty;
      const img = item.product?.image || item.product?.imageUrl || item.image || "";
      if (!productSales[name]) {
        productSales[name] = { name, sold: 0, revenue: 0, image: img };
      }
      productSales[name].sold += qty;
      productSales[name].revenue += rev;
    });
  });

  const topProductsList = Object.values(productSales)
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  // Dynamic Category Sales & Revenue Breakdown
  const categoryMap = {
    "ao": { id: "ao", name: "Áo Nam & Nữ (T-shirt, Shirt, Jacket)", sold: 0, revenue: 0, defaultPercent: 42, barColor: "bg-orange-500", badgeColor: "bg-orange-500" },
    "quan": { id: "quan", name: "Quần Thời Trang (Jeans, Shorts, Trousers)", sold: 0, revenue: 0, defaultPercent: 28, barColor: "bg-blue-500", badgeColor: "bg-blue-500" },
    "vay": { id: "vay", name: "Váy & Đầm Nữ", sold: 0, revenue: 0, defaultPercent: 18, barColor: "bg-pink-500", badgeColor: "bg-pink-500" },
    "phu-kien": { id: "phu-kien", name: "Phụ Kiện & Giày Dép", sold: 0, revenue: 0, defaultPercent: 12, barColor: "bg-purple-500", badgeColor: "bg-purple-500" },
  };

  let totalItemsSoldAll = 0;
  completedOrders.forEach(order => {
    order.items?.forEach(item => {
      const catKey = item.product?.category || "phu-kien";
      const qty = item.quantity || 1;
      const price = item.price ?? item.product?.price ?? 0;
      const rev = price * qty;
      totalItemsSoldAll += qty;

      if (categoryMap[catKey]) {
        categoryMap[catKey].sold += qty;
        categoryMap[catKey].revenue += rev;
      } else {
        categoryMap["phu-kien"].sold += qty;
        categoryMap["phu-kien"].revenue += rev;
      }
    });
  });

  const categoryList = Object.values(categoryMap);

  // Top customers by spending
  const customerStats = {};
  completedOrders.forEach(o => {
    const cName = o.customerName || o.shippingAddress?.fullName || "Khách hàng Vãng Lai";
    if (!customerStats[cName]) {
      customerStats[cName] = { name: cName, count: 0, total: 0, phone: o.phone || o.shippingAddress?.phone || "" };
    }
    customerStats[cName].count += 1;
    customerStats[cName].total += (o.total || o.totalAmount || 0);
  });
  const topCustomers = Object.values(customerStats).sort((a, b) => b.total - a.total).slice(0, 4);

  const weekDays = ["Chủ Nhật", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];
  const chartData = weekDays.map((day) => ({ day, revenue: 0, orders: 0 }));
  completedOrders.forEach((order) => {
    const date = getOrderDate(order);
    if (!date) return;
    const bucket = chartData[date.getDay()];
    bucket.revenue += Number(order.total ?? order.totalAmount ?? 0);
    bucket.orders += 1;
  });
  const mondayFirstChartData = [...chartData.slice(1), chartData[0]];
  const maxRevenue = Math.max(...mondayFirstChartData.map(c => c.revenue), 1);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      
      {/* Header Banner & Quick Controls */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 rounded-3xl p-6 md:p-8 text-white shadow-xl border border-zinc-700/50 flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="space-y-2 z-10">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Hệ Thống Real-time
            </span>
            <span className="text-xs text-zinc-400 font-medium">
              Cập nhật: {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-3">
            Tổng Quan Bán Hàng FoxStyle
            <Sparkles className="w-6 h-6 text-orange-400 animate-pulse" />
          </h1>
          <p className="text-xs md:text-sm text-zinc-300 max-w-2xl font-medium">
            Theo dõi hiệu suất doanh thu, phân tích lưu lượng đơn hàng và quản lý sản phẩm kho hàng thời gian thực.
          </p>
        </div>

        {/* Action controls */}
        <div className="flex flex-wrap items-center gap-3 z-10">
          <div className="bg-zinc-800/80 p-1 rounded-2xl border border-zinc-700/60 flex items-center gap-1 text-xs font-semibold">
            {[
              { id: "all", label: "Tất cả" },
              { id: "month", label: "Tháng này" },
              { id: "week", label: "7 Ngày" },
              { id: "today", label: "Hôm nay" },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTimeframe(t.id)}
                className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                  timeframe === t.id
                    ? "bg-orange-500 text-white font-bold shadow-md"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-700/50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleRefresh}
            className="p-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl text-zinc-300 hover:text-white transition cursor-pointer shadow-sm"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-orange-400" : ""}`} />
          </button>
        </div>
      </div>

      {/* Top 4 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.label} 
              className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider block">
                    {stat.label}
                  </span>
                  <h3 className="text-2xl lg:text-3xl font-black text-zinc-900 mt-2 tracking-tight">
                    {stat.value}
                  </h3>
                  <p className="text-xs text-zinc-500 font-medium mt-1">
                    {stat.subtext}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-between">
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${stat.lightBg}`}>
                  <TrendingUp className="h-3 w-3" />
                  {stat.change}
                </span>
                <span className="text-[11px] text-zinc-400 font-semibold">dữ liệu đồng bộ</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Low Stock Alert Section (if any low stock products exist) */}
      {lowStockProducts.length > 0 && (
        <div className="bg-amber-50/80 border border-amber-200 rounded-3xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h4 className="text-sm font-black text-amber-950">
                Cảnh báo kho hàng: Có {lowStockProducts.length} sản phẩm sắp hết hàng (dưới 10 sản phẩm)!
              </h4>
              <p className="text-xs text-amber-700 font-medium mt-0.5">
                Vui lòng kiểm tra và liên hệ nhà cung cấp để bổ sung hàng hóa kịp thời.
              </p>
            </div>
          </div>
          <Link
            to="/admin/products"
            className="inline-flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-5 py-2.5 rounded-2xl transition shadow-md shrink-0"
          >
            <span>Nhập Hàng Ngay</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Analytics Charts & Order Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Revenue Chart Visual (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-zinc-200/80 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-zinc-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-orange-500" />
                Biểu Đồ Phân Bổ Doanh Thu Trong Tuần
              </h2>
              <p className="text-xs text-zinc-500 font-medium mt-0.5">
                Doanh thu thật từ các đơn đã hoàn thành, nhóm theo ngày trong tuần
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-bold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                <span className="text-zinc-600">Doanh thu</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-zinc-800"></span>
                <span className="text-zinc-600">Số đơn</span>
              </div>
            </div>
          </div>

          {/* Dynamic SVG / HTML Bar Chart */}
          <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 pt-6 px-2">
            {mondayFirstChartData.map((item, idx) => {
              const heightPercent = item.revenue > 0
                ? Math.max(5, Math.round((item.revenue / maxRevenue) * 100))
                : 0;
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-zinc-900 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg pointer-events-none mb-1 text-center whitespace-nowrap z-10">
                    <p className="text-orange-400">{item.revenue.toLocaleString('vi-VN')}đ</p>
                    <p className="text-zinc-300">{item.orders} đơn hàng</p>
                  </div>
                  {/* Bar column */}
                  <div className="w-full bg-zinc-100 rounded-2xl h-48 flex items-end p-1 relative overflow-hidden group-hover:bg-orange-50 transition">
                    <div 
                      className="w-full bg-gradient-to-t from-orange-600 to-amber-400 rounded-xl transition-all duration-500 group-hover:brightness-110 shadow-md"
                      style={{ height: `${heightPercent}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-zinc-600 group-hover:text-orange-600 transition">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quick Metrics Footer */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-zinc-100 text-center">
            <div className="bg-zinc-50 p-3 rounded-2xl border border-zinc-100">
              <span className="text-[11px] text-zinc-500 font-semibold uppercase block">Giá trị đơn TB</span>
              <span className="text-sm font-black text-zinc-900 mt-0.5 block">
                {avgOrderValue.toLocaleString('vi-VN')}đ
              </span>
            </div>
            <div className="bg-zinc-50 p-3 rounded-2xl border border-zinc-100">
              <span className="text-[11px] text-zinc-500 font-semibold uppercase block">Tỷ lệ hoàn thành</span>
              <span className="text-sm font-black text-emerald-600 mt-0.5 block">
                {totalOrders > 0 ? Math.round((completedOrders.length / totalOrders) * 100) : 0}%
              </span>
            </div>
            <div className="bg-zinc-50 p-3 rounded-2xl border border-zinc-100 col-span-2 sm:col-span-1">
              <span className="text-[11px] text-zinc-500 font-semibold uppercase block">Tỷ lệ hủy/bom</span>
              <span className="text-sm font-black text-rose-600 mt-0.5 block">
                {totalOrders > 0 ? Math.round((cancelledOrders.length / totalOrders) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Order Status Breakdown (1 col) */}
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 md:p-8 shadow-sm space-y-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
              <h2 className="text-lg font-black text-zinc-900 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-purple-500" />
                Trạng Thái Đơn Hàng
              </h2>
              <span className="text-xs font-bold text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-full">
                {totalOrders} Đơn
              </span>
            </div>

            <div className="space-y-4 mt-6">
              {statusBreakdown.map((sb) => {
                const percent = totalOrders > 0 ? Math.round((sb.count / totalOrders) * 100) : 0;
                return (
                  <div key={sb.label} className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-zinc-800 flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${sb.color}`}></span>
                        {sb.label}
                      </span>
                      <span className="text-zinc-600">
                        {sb.count} đơn <span className="text-zinc-400 font-medium">({percent}%)</span>
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden p-0.5">
                      <div 
                        className={`h-full ${sb.color} rounded-full transition-all duration-500`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="pt-6 border-t border-zinc-100 space-y-2">
            <Link
              to="/admin/orders"
              className="w-full flex items-center justify-between p-3.5 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-2xl text-xs font-black transition border border-orange-200/60"
            >
              <span className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4 text-orange-600" />
                Quản lý tất cả đơn hàng
              </span>
              <ChevronRight className="w-4 h-4" />
            </Link>

            <Link
              to="/admin/products"
              className="w-full flex items-center justify-between p-3.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-2xl text-xs font-black transition border border-purple-200/60"
            >
              <span className="flex items-center gap-2">
                <Package className="w-4 h-4 text-purple-600" />
                Quản lý danh mục kho hàng
              </span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Grid Section: Recent Orders & Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Orders Card */}
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 md:p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6 pb-3 border-b border-zinc-100">
            <div>
              <h2 className="text-lg font-black text-zinc-900">Đơn Hàng Gần Đây</h2>
              <p className="text-xs text-zinc-500 font-medium">Danh sách các giao dịch phát sinh gần nhất</p>
            </div>
            <Link 
              to="/admin/orders" 
              className="text-xs font-black text-orange-600 hover:text-orange-700 flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-100 transition"
            >
              <span>Tất cả đơn</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <p className="text-xs text-zinc-400 text-center py-8 font-medium">Chưa có đơn hàng nào trong hệ thống.</p>
            ) : (
              recentOrders.map((order) => (
                <div 
                  key={order.id} 
                  className="flex items-center justify-between p-4 border border-zinc-100 rounded-2xl hover:border-orange-200 hover:bg-orange-50/30 transition-all duration-200"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-zinc-900 text-sm">#{order.id}</span>
                      <span className="text-[10px] bg-zinc-100 text-zinc-600 font-semibold px-2 py-0.5 rounded-md">
                        {order.items?.length || 1} sản phẩm
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 font-medium">
                      {order.customerName || order.shippingAddress?.fullName || "Khách hàng"}
                    </p>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <p className="font-black text-orange-600 text-sm">
                      {(order.total || order.totalAmount || 0).toLocaleString('vi-VN')}đ
                    </p>
                    <span className={`inline-block text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                      order.status === "completed"
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                        : order.status === "shipping"
                        ? "bg-blue-100 text-blue-700 border border-blue-200"
                        : order.status === "cancelled"
                        ? "bg-rose-100 text-rose-700 border border-rose-200"
                        : "bg-amber-100 text-amber-700 border border-amber-200"
                    }`}>
                      {order.status === "completed"
                        ? "Hoàn thành"
                        : order.status === "shipping"
                        ? "Đang giao"
                        : order.status === "cancelled"
                        ? "Đã hủy"
                        : "Chờ xử lý"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Selling Products Card */}
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 md:p-8 shadow-sm">
          <div className="flex justify-between items-center mb-6 pb-3 border-b border-zinc-100">
            <div>
              <h2 className="text-lg font-black text-zinc-900">Sản Phẩm Bán Chạy</h2>
              <p className="text-xs text-zinc-500 font-medium">Xếp hạng theo sản lượng bán ra</p>
            </div>
            <Link 
              to="/admin/products" 
              className="text-xs font-black text-orange-600 hover:text-orange-700 flex items-center gap-1 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-100 transition"
            >
              <span>Quản lý kho</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          
          <div className="space-y-3">
            {topProductsList.length === 0 ? (
              <p className="text-xs text-zinc-400 text-center py-8 font-medium">Chưa ghi nhận dữ liệu bán hàng.</p>
            ) : (
              topProductsList.map((product, index) => (
                <div 
                  key={product.name} 
                  className="flex items-center justify-between p-4 border border-zinc-100 rounded-2xl hover:border-purple-200 hover:bg-purple-50/20 transition-all duration-200"
                >
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 font-black text-xs shadow-sm ${
                      index === 0 ? "bg-amber-400 text-amber-950" : index === 1 ? "bg-slate-300 text-slate-900" : index === 2 ? "bg-amber-700 text-white" : "bg-zinc-100 text-zinc-600"
                    }`}>
                      #{index + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-zinc-900 text-sm truncate">{product.name}</p>
                      <p className="text-xs text-zinc-500 mt-0.5 font-medium">
                        Đã bán: <span className="font-bold text-zinc-800">{product.sold}</span> SP
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 pl-2">
                    <p className="font-black text-orange-600 text-sm">
                      {product.revenue.toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Area Volume Heatmap & Top VIP Customers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Category Sales & Revenue Performance */}
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 md:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div>
              <h2 className="text-lg font-black text-zinc-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-orange-500" />
                Doanh Thu & Sản Lượng Theo Danh Mục
              </h2>
              <p className="text-xs text-zinc-500 font-medium">Tỷ lệ tiêu thụ và đóng góp doanh thu từng nhóm hàng</p>
            </div>
            <Link to="/admin/categories" className="text-xs font-black text-orange-600 hover:text-orange-700">
              Quản lý mục
            </Link>
          </div>
          <div className="space-y-4 pt-2">
            {categoryList.map(cat => {
              const percent = totalItemsSoldAll > 0 ? Math.round((cat.sold / totalItemsSoldAll) * 100) : cat.defaultPercent;
              return (
                <div key={cat.id} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-extrabold">
                    <span className="text-zinc-800 flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${cat.badgeColor}`}></span>
                      {cat.name}
                    </span>
                    <div className="text-right">
                      <span className="text-zinc-900 font-black">
                        {cat.revenue > 0 ? `${cat.revenue.toLocaleString('vi-VN')}đ` : `${(totalRevenue * (percent / 100)).toLocaleString('vi-VN')}đ`}
                      </span>
                      <span className="text-zinc-400 font-medium text-[11px] block">
                        {cat.sold > 0 ? `${cat.sold} sản phẩm` : ""} ({percent}%)
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-zinc-100 rounded-full overflow-hidden p-0.5">
                    <div 
                      className={`h-full ${cat.barColor} rounded-full transition-all duration-500`} 
                      style={{ width: `${Math.max(8, percent)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top VIP Customers */}
        <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 md:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
            <div>
              <h2 className="text-lg font-black text-zinc-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-purple-600" />
                Khách Hàng Thân Thiết (VIP)
              </h2>
              <p className="text-xs text-zinc-500 font-medium">Khách hàng có tổng chi tiêu cao nhất</p>
            </div>
            <Link to="/admin/customers" className="text-xs font-black text-purple-600 hover:text-purple-700">
              Quản lý khách
            </Link>
          </div>
          <div className="space-y-3 pt-2">
            {topCustomers.length === 0 ? (
              <p className="text-xs text-zinc-400 text-center py-6 font-medium">Chưa có dữ liệu khách hàng VIP.</p>
            ) : (
              topCustomers.map((c, idx) => (
                <div key={c.name} className="flex items-center justify-between p-3.5 border border-zinc-100 rounded-2xl bg-zinc-50/50 hover:bg-purple-50/30 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 text-white font-black flex items-center justify-center text-xs shadow-md">
                      #{idx + 1}
                    </div>
                    <div>
                      <span className="block font-black text-zinc-900 text-sm">{c.name}</span>
                      <span className="text-[11px] text-zinc-500 font-semibold">{c.count} đơn hàng thành công</span>
                    </div>
                  </div>
                  <span className="text-xs bg-purple-100 text-purple-800 border border-purple-200 px-3 py-1 rounded-full font-black">
                    {c.total.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
