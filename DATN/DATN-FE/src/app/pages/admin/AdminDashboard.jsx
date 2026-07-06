import { Package, ShoppingCart, Users, DollarSign, TrendingUp, ArrowRight } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Link } from "react-router";

export function AdminDashboard() {
  const { products, orders, users } = useApp();

  // 1. Calculate stats dynamically
  const totalProducts = products.length;
  const totalOrders = orders.length;
  const totalCustomers = users.filter(u => u.role === "customer").length;
  
  const completedOrders = orders.filter(o => o.status === "completed");
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);

  const stats = [
    {
      label: "Tổng sản phẩm",
      value: totalProducts.toString(),
      change: "+12%",
      trend: "up",
      icon: Package,
      color: "bg-blue-500",
    },
    {
      label: "Tổng đơn hàng",
      value: totalOrders.toString(),
      change: "+23%",
      trend: "up",
      icon: ShoppingCart,
      color: "bg-green-500",
    },
    {
      label: "Khách hàng",
      value: totalCustomers.toString(),
      change: "+8%",
      trend: "up",
      icon: Users,
      color: "bg-purple-500",
    },
    {
      label: "Doanh thu",
      value: `₫${(totalRevenue / 1000000).toFixed(1)}M`,
      change: "+18%",
      trend: "up",
      icon: DollarSign,
      color: "bg-orange-500",
    },
  ];

  // Get last 5 orders
  const recentOrders = orders.slice(0, 5);

  // Group top products dynamically
  const productSales = {};
  orders.forEach(order => {
    order.items.forEach(item => {
      const name = item.product.name;
      const qty = item.quantity;
      const rev = item.product.price * qty;
      if (!productSales[name]) {
        productSales[name] = { name, sold: 0, revenue: 0 };
      }
      productSales[name].sold += qty;
      productSales[name].revenue += rev;
    });
  });

  const topProductsList = Object.values(productSales)
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center justify-between">
              <div>
                <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">{stat.label}</h3>
                <p className="text-3xl font-extrabold text-gray-800 mt-2">{stat.value}</p>
                <div className="flex items-center space-x-1 mt-2 text-green-600 text-xs font-bold">
                  <TrendingUp className="h-3 w-3" />
                  <span>{stat.change}</span>
                </div>
              </div>
              <div className={`${stat.color} p-4 rounded-2xl text-white shadow-sm`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6 pb-2 border-b">
            <h2 className="text-lg font-bold text-gray-800">Đơn hàng gần đây</h2>
            <Link to="/admin/orders" className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center">
              <span>Tất cả đơn</span>
              <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentOrders.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">Chưa có đơn hàng nào.</p>
            ) : (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition">
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{order.id}</p>
                    <p className="text-xs text-gray-500 mt-0.5 font-semibold">{order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-orange-600 text-sm">
                      {order.total.toLocaleString('vi-VN')}đ
                    </p>
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1.5 uppercase ${
                      order.status === "completed"
                        ? "bg-green-50 text-green-700 border border-green-100"
                        : order.status === "shipping"
                        ? "bg-blue-50 text-blue-700 border border-blue-100"
                        : order.status === "cancelled"
                        ? "bg-red-50 text-red-700 border border-red-100"
                        : "bg-yellow-50 text-yellow-700 border border-yellow-100"
                    }`}>
                      {order.status === "completed"
                        ? "Hoàn thành"
                        : order.status === "shipping"
                        ? "Đang giao"
                        : order.status === "cancelled"
                        ? "Đã hủy"
                        : "Chờ duyệt"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6 pb-2 border-b">
            <h2 className="text-lg font-bold text-gray-800">Sản phẩm bán chạy nhất</h2>
            <Link to="/admin/products" className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center">
              <span>Quản lý kho</span>
              <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </div>
          
          <div className="space-y-3">
            {topProductsList.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-6">Chưa ghi nhận số liệu bán hàng.</p>
            ) : (
              topProductsList.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-orange-600 font-extrabold text-sm">#{index + 1}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-800 text-sm truncate">{product.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5 font-semibold">{product.sold} sản phẩm đã bán</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-extrabold text-orange-600 text-sm">
                      {product.revenue.toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
