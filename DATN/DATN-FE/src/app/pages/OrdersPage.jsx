import { useState } from "react";
import { Link } from "react-router";
import { ShoppingBag, Calendar, Truck, CreditCard, ChevronRight, X, AlertTriangle, ShieldClose } from "lucide-react";
import { useApp } from "../context/AppContext";

export function OrdersPage() {
  const { orders, currentUser, updateOrderStatus } = useApp();
  const [activeTab, setActiveTab] = useState("all");

  if (!currentUser) {
    return (
      <div className="bg-gray-50 min-h-screen py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-gray-100 shadow-md">
          <ShoppingBag className="h-16 w-16 text-orange-500 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Đăng nhập tài khoản</h2>
          <p className="text-gray-500 text-sm mb-6">Vui lòng đăng nhập tài khoản để xem lịch sử mua hàng của bạn.</p>
        </div>
      </div>
    );
  }

  // Filter orders for current user
  const userOrders = orders.filter(o => o.userId === currentUser.id);

  // Filter by active status tab
  const filteredOrders = userOrders.filter(o => {
    if (activeTab === "all") return true;
    return o.status === activeTab;
  });

  const handleCancelOrder = (orderId) => {
    if (confirm(`Bạn có chắc chắn muốn hủy đơn hàng ${orderId}?`)) {
      updateOrderStatus(orderId, "cancelled");
      alert(`Đã hủy thành công đơn hàng ${orderId}!`);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="bg-yellow-50 text-yellow-700 border border-yellow-200 text-xs font-bold px-2.5 py-1 rounded-full uppercase">Chờ duyệt</span>;
      case "shipping":
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold px-2.5 py-1 rounded-full uppercase">Đang giao</span>;
      case "completed":
        return <span className="bg-green-50 text-green-700 border border-green-200 text-xs font-bold px-2.5 py-1 rounded-full uppercase">Hoàn thành</span>;
      case "cancelled":
        return <span className="bg-red-50 text-red-700 border border-red-200 text-xs font-bold px-2.5 py-1 rounded-full uppercase">Đã hủy</span>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-center space-x-3 mb-8">
          <ShoppingBag className="h-8 w-8 text-orange-600" />
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Đơn hàng của tôi</h1>
        </div>

        {/* --- Filter Status Tabs --- */}
        <div className="flex border-b border-gray-200 bg-white rounded-2xl p-2 shadow-sm mb-6 text-sm font-bold text-gray-500 overflow-x-auto whitespace-nowrap scrollbar-none">
          {[
            { id: "all", label: "Tất cả đơn" },
            { id: "pending", label: "Chờ duyệt" },
            { id: "shipping", label: "Đang giao" },
            { id: "completed", label: "Hoàn thành" },
            { id: "cancelled", label: "Đã hủy" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-xl transition ${
                activeTab === tab.id
                  ? "bg-orange-50 text-orange-600 shadow-sm"
                  : "hover:text-gray-900 hover:bg-gray-50/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* --- Orders List --- */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white p-16 rounded-3xl border text-center shadow-sm">
            <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-700 mb-1">Không tìm thấy đơn hàng</h3>
            <p className="text-gray-500 text-xs max-w-sm mx-auto mb-6">Bạn không có đơn hàng nào khớp với trạng thái lựa chọn.</p>
            <Link to="/products" className="bg-orange-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-orange-700 transition shadow">
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-in fade-in duration-200">
                {/* Order Top Summary Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center space-x-3 text-xs font-bold text-gray-500">
                    <span className="text-gray-900 font-extrabold text-sm">{order.id}</span>
                    <span>•</span>
                    <span className="flex items-center">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      {order.date}
                    </span>
                    <span>•</span>
                    <span className="capitalize">{order.paymentMethod === "transfer" ? "PayOS QR" : "COD"}</span>
                  </div>
                  <div>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Items Recap */}
                <div className="p-6 divide-y divide-gray-100">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="py-4 flex gap-4 first:pt-0 last:pb-0 items-center">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-xl border"
                      />
                      <div className="flex-1 min-w-0">
                        <Link to={`/products/${item.product.id}`} className="font-bold text-gray-800 text-sm hover:text-orange-600 transition truncate block max-w-xs md:max-w-md">
                          {item.product.name}
                        </Link>
                        <p className="text-xs text-gray-400 font-bold mt-1">Màu: {item.color} | Size: {item.size} | Số lượng: {item.quantity}</p>
                      </div>
                      <span className="font-extrabold text-gray-700 text-sm">
                        {(item.product.price * item.quantity).toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Billing breakdown & Cancel Action */}
                <div className="bg-gray-50/50 px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  
                  {/* Action: Cancel order if pending */}
                  <div>
                    {order.status === "pending" ? (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="flex items-center text-xs font-bold text-red-600 hover:text-red-700 border border-red-200 hover:bg-red-50 px-3.5 py-2 rounded-xl transition"
                      >
                        <X className="h-4 w-4 mr-1" />
                        <span>Hủy đơn hàng</span>
                      </button>
                    ) : order.status === "cancelled" ? (
                      <span className="text-xs text-gray-400 font-semibold flex items-center">
                        <AlertTriangle className="h-3.5 w-3.5 mr-1" />
                        Đơn đã bị hủy
                      </span>
                    ) : (
                      <span className="text-xs text-green-600 font-bold flex items-center">
                        <Truck className="h-3.5 w-3.5 mr-1" />
                        Vận chuyển an toàn
                      </span>
                    )}
                  </div>

                  {/* Pricing recap */}
                  <div className="text-right space-y-1 text-xs font-semibold text-gray-500">
                    <div className="flex justify-end space-x-3">
                      <span>Tạm tính:</span>
                      <span className="text-gray-800 font-bold">{order.subtotal.toLocaleString('vi-VN')}đ</span>
                    </div>
                    {order.discount > 0 && (
                      <div className="flex justify-end space-x-3 text-red-600">
                        <span>Giảm giá ({order.couponCode}):</span>
                        <span>-{order.discount.toLocaleString('vi-VN')}đ</span>
                      </div>
                    )}
                    <div className="flex justify-end space-x-3 text-sm">
                      <span className="font-bold text-gray-800">Tổng thanh toán:</span>
                      <span className="text-base font-extrabold text-orange-600">{order.total.toLocaleString('vi-VN')}đ</span>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
