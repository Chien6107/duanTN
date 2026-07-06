import { useState } from "react";
import { Search, Eye, X, Check, Truck, AlertTriangle } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { DataTable } from "../../components/DataTable";
import { Button } from "../../components/Button";

export function AdminOrders() {
  const { orders, updateOrderStatus } = useApp();
  const [statusFilter, setStatusFilter] = useState("all");

  // Selected order details modal
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Filter orders by status BEFORE passing to table (so pagination fits status count)
  const filteredOrders = orders.filter((order) => {
    if (statusFilter !== "all" && order.status !== statusFilter) {
      return false;
    }
    return true;
  });

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

  const handleUpdateStatus = (orderId, status) => {
    updateOrderStatus(orderId, status);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => ({ ...prev, status }));
    }
    alert(`Đơn hàng ${orderId} đã được chuyển sang trạng thái: ${status}`);
  };

  // Define columns for DataTable
  const columns = [
    {
      header: "Mã Đơn hàng",
      accessor: "id",
      render: (id) => <span className="font-extrabold text-gray-900">{id}</span>
    },
    {
      header: "Khách hàng",
      accessor: "customerName",
      render: (customerName, order) => (
        <div>
          <p className="font-bold text-gray-900">{customerName}</p>
          <p className="text-xs text-gray-400 mt-0.5 font-bold">{order.phone}</p>
        </div>
      )
    },
    {
      header: "Ngày đặt",
      accessor: "date",
      render: (date) => <span className="text-gray-500 font-semibold">{date}</span>
    },
    {
      header: "Giá trị đơn",
      accessor: "total",
      render: (total) => <span className="font-bold text-orange-655 text-sm">{total.toLocaleString('vi-VN')}đ</span>
    },
    {
      header: "Trạng thái",
      accessor: "status",
      render: (status) => getStatusBadge(status)
    },
    {
      header: "Hành động",
      accessor: "id",
      align: "right",
      render: (id, order) => (
        <div className="flex items-center justify-end">
          <Button
            variant="ghost"
            size="sm"
            icon={Eye}
            onClick={() => setSelectedOrder(order)}
            className="text-orange-600 font-bold hover:bg-orange-50 border border-transparent hover:border-orange-200"
          >
            Chi tiết
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Status Tabs */}
      <div className="flex items-center space-x-2 bg-gray-100 rounded-xl p-1 text-xs font-bold text-gray-500 w-full md:w-auto overflow-x-auto whitespace-nowrap">
        {[
          { id: "all", label: "Tất cả" },
          { id: "pending", label: "Chờ duyệt" },
          { id: "shipping", label: "Đang giao" },
          { id: "completed", label: "Hoàn thành" },
          { id: "cancelled", label: "Đã hủy" }
        ].map(sOpt => (
          <button
            key={sOpt.id}
            onClick={() => setStatusFilter(sOpt.id)}
            className={`px-4 py-2 rounded-lg transition ${
              statusFilter === sOpt.id ? "bg-white text-gray-900 shadow-sm" : "hover:text-gray-900"
            }`}
          >
            {sOpt.label}
          </button>
        ))}
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={filteredOrders}
        searchPlaceholder="Tìm kiếm theo mã đơn hoặc tên khách..."
        searchKeys={["id", "customerName", "phone", "address"]}
        itemsPerPage={5}
      />

      {/* --- Order Details View Modal --- */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[999] backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full relative overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-pink-600 p-5 text-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">Chi tiết đơn hàng {selectedOrder.id}</h3>
                <p className="text-xs opacity-90 font-medium font-semibold">Đặt ngày {selectedOrder.date}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="hover:bg-white/20 p-1.5 rounded-full transition">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-6">
              
              {/* Delivery Details */}
              <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-3 text-xs font-semibold text-gray-650">
                <h4 className="font-extrabold text-sm text-gray-800 uppercase tracking-wider mb-2">Thông tin người nhận</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>Khách hàng: <span className="text-gray-950 font-bold">{selectedOrder.customerName}</span></div>
                  <div>Số điện thoại: <span className="text-gray-950 font-bold">{selectedOrder.phone}</span></div>
                  <div className="col-span-2">Địa chỉ giao: <span className="text-gray-950 font-bold">{selectedOrder.address}</span></div>
                  <div className="col-span-2">Hình thức thanh toán: <span className="text-gray-950 font-bold uppercase">{selectedOrder.paymentMethod === "transfer" ? "PayOS QR Code" : "Nhận hàng COD"}</span></div>
                  {selectedOrder.note && <div className="col-span-2">Ghi chú: <span className="text-gray-950 italic">"{selectedOrder.note}"</span></div>}
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                <h4 className="font-extrabold text-xs text-gray-400 uppercase tracking-wider">Danh sách mặt hàng</h4>
                <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl p-4 bg-white shadow-sm">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="py-3 flex justify-between items-center gap-4 text-xs font-semibold first:pt-0 last:pb-0">
                      <div className="flex items-center space-x-3">
                        <img src={item.product.image} alt={item.product.name} className="w-10 h-10 object-cover rounded-lg border" />
                        <div>
                          <p className="font-bold text-gray-905">{item.product.name}</p>
                          <p className="text-gray-400 mt-0.5">Màu: {item.color} | Size: {item.size} | Số lượng: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-gray-700">{(item.product.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Billing totals */}
              <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 text-xs font-semibold text-gray-650 space-y-2">
                <div className="flex justify-between">
                  <span>Tiền hàng:</span>
                  <span className="text-gray-950 font-bold">{selectedOrder.subtotal.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí ship:</span>
                  <span className="text-gray-955 font-bold">{selectedOrder.shipping.toLocaleString('vi-VN')}đ</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Mã giảm giá ({selectedOrder.couponCode}):</span>
                    <span>-{selectedOrder.discount.toLocaleString('vi-VN')}đ</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-gray-100 pt-2 text-sm font-bold">
                  <span className="text-gray-800">Tổng thanh toán:</span>
                  <span className="text-orange-600 font-extrabold text-base">{selectedOrder.total.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              {/* Action Progress Flow buttons */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3 text-center">Duyệt & Quản lý trạng thái đơn hàng</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, "pending")}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      selectedOrder.status === "pending"
                        ? "bg-yellow-500 border-yellow-500 text-white shadow-sm"
                        : "border-gray-200 hover:bg-gray-55/40 text-gray-650"
                    }`}
                  >
                    Chờ duyệt
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, "shipping")}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      selectedOrder.status === "shipping"
                        ? "bg-blue-500 border-blue-500 text-white shadow-sm"
                        : "border-gray-200 hover:bg-gray-55/40 text-gray-650"
                    }`}
                  >
                    Giao hàng
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, "completed")}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      selectedOrder.status === "completed"
                        ? "bg-green-500 border-green-500 text-white shadow-sm"
                        : "border-gray-200 hover:bg-gray-55/40 text-gray-650"
                    }`}
                  >
                    Hoàn thành
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.id, "cancelled")}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      selectedOrder.status === "cancelled"
                        ? "bg-red-500 border-red-500 text-white shadow-sm"
                        : "border-gray-200 hover:bg-gray-55/40 text-gray-650"
                    }`}
                  >
                    Hủy đơn
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
