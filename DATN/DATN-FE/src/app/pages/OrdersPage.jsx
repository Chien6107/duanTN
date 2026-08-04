import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router";
import { ShoppingBag, Calendar, Truck, CreditCard, ChevronRight, X, AlertTriangle, ShieldClose, Check, Printer, FileText, MapPin, User, Phone, QrCode, ShieldCheck, ExternalLink, Loader2 } from "lucide-react";
import { useApp } from "../context/AppContext";
import { api } from "../services/api";
import { toast } from "sonner";

const displayOrderReason = (value) => {
  const text = String(value || "").trim();
  const legacy = {
    "Khách hàng yêu c?u h?y don": "Khách hàng yêu cầu hủy đơn",
    "Không liên h? du?c ngu?i nh?n": "Không liên hệ được người nhận",
    "Khách hàng d?i ý": "Khách hàng đổi ý",
    "S?n ph?m không v?a kích thu?c": "Sản phẩm không vừa kích thước",
    "S?n ph?m b? l?i khi nh?n": "Sản phẩm bị lỗi khi nhận",
    "Khong lien h? du?c ngu?i nh?n": "Không liên hệ được người nhận"
  };
  return legacy[text] || text;
};

export function OrdersPage() {
  const { orders = [], currentUser, updateOrderStatus, restoringSession } = useApp();
  const [activeTab, setActiveTab] = useState("all");
  const [searchParams] = useSearchParams();
  const searchVal = searchParams.get("search") || "";
  
  // State for selected order detail modal
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);

  // PayOS QR Modal State in Order History
  const [payosModalOrder, setPayosModalOrder] = useState(null);
  const [payosData, setPayosData] = useState(null);
  const [isCheckingPayOS, setIsCheckingPayOS] = useState(false);

  // PayOS Auto polling for open QR modal in Order History
  useEffect(() => {
    let interval = null;
    if (payosModalOrder) {
      const orderCodeNum = payosModalOrder.orderIdDb || Number(payosModalOrder.id.replace("DH", ""));
      interval = setInterval(async () => {
        try {
          const res = await api.payments.checkPayOSStatus(orderCodeNum);
          if (res && res.data && res.data.status === "PAID") {
            clearInterval(interval);
            setPayosModalOrder(null);
            toast.success(`PayOS: Đã xác nhận thanh toán thành công cho đơn hàng ${payosModalOrder.id}!`);
            alert(`PayOS: Thanh toán chuyển khoản thành công cho đơn hàng ${payosModalOrder.id}!`);
            window.location.reload();
          }
        } catch (err) {
          console.error("PayOS status check error:", err);
        }
      }, 3000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [payosModalOrder]);

  const openPayOSQRModalForOrder = async (order) => {
    setPayosModalOrder(order);
    const orderCodeNum = order.orderIdDb || Number(order.id.replace("DH", ""));
    try {
      const res = await api.payments.createPayOSLink(orderCodeNum);
      if (res && res.data) {
        setPayosData(res.data);
      }
    } catch (err) {
      console.warn("PayOS QR fetch error:", err);
    }
  };

  const verifyPayOSStatusManual = async () => {
    if (!payosModalOrder) return;
    setIsCheckingPayOS(true);
    try {
      const orderCodeNum = payosModalOrder.orderIdDb || Number(payosModalOrder.id.replace("DH", ""));
      const res = await api.payments.checkPayOSStatus(orderCodeNum);
      if (res && res.data && res.data.status === "PAID") {
        setPayosModalOrder(null);
        toast.success(`PayOS: Đã xác nhận thanh toán thành công cho đơn hàng ${payosModalOrder.id}!`);
        alert(`PayOS: Thanh toán chuyển khoản thành công cho đơn hàng ${payosModalOrder.id}!`);
        window.location.reload();
      } else {
        toast.info("Chưa nhận được tín hiệu thanh toán.");
        alert("Hệ thống chưa nhận được tín hiệu chuyển tiền từ PayOS. Vui lòng quét mã QR từ ứng dụng ngân hàng và thử lại!");
      }
    } catch (err) {
      alert("Lỗi kiểm tra thanh toán PayOS.");
    } finally {
      setIsCheckingPayOS(false);
    }
  };

  // Return request modal state
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [targetReturnOrder, setTargetReturnOrder] = useState(null);
  const [returnReason, setReturnReason] = useState("size_not_fit");
  const [returnNote, setReturnNote] = useState("");
  const [warrantyRedelivery, setWarrantyRedelivery] = useState(false);
  const [returnBankName, setReturnBankName] = useState(currentUser?.bankName || "MB Bank (Ngân hàng Quân Đội)");
  const [returnBankAccountNo, setReturnBankAccountNo] = useState(currentUser?.bankAccountNo || "0362804559");
  const [returnBankAccountName, setReturnBankAccountName] = useState(
    currentUser?.bankAccountName || (currentUser?.fullName ? currentUser.fullName.toUpperCase() : "NGUYEN TAN NGUYEN CHIEN")
  );

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Reset page when activeTab or searchVal changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchVal]);

  if (restoringSession) {
    return (
      <div className="bg-gray-50 min-h-screen flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-zinc-700 text-xs font-black uppercase tracking-[0.2em] animate-pulse">Đang tải lịch sử đơn hàng...</p>
        </div>
      </div>
    );
  }

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

  // Filter orders for current user and sort newest to oldest
  const userOrders = orders
    .filter((o) => String(o.userId) === String(currentUser.id))
    .sort((a, b) => (b.orderIdDb || 0) - (a.orderIdDb || 0));

  // Filter by active status tab
  const filteredOrders = userOrders.filter(o => {
    if (searchVal) {
      return o.id.toString().toLowerCase().includes(searchVal.toLowerCase());
    }
    if (activeTab === "all") return true;
    if (activeTab === "payos") {
      return o.paymentMethod === "TRANSFER" || o.paymentMethod === "PAYOS";
    }
    return o.status === activeTab;
  });

  // Calculate paginated slices
  const indexOfLastOrder = currentPage * itemsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
  const paginatedOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const handleCancelOrder = async (orderId) => {
    if (confirm(`Bạn có chắc chắn muốn hủy đơn hàng ${orderId}?`)) {
      const reason = prompt("Vui lòng nhập lý do hủy đơn hàng:", "");
      if (!reason?.trim()) {
        alert("Lý do hủy đơn hàng là bắt buộc.");
        return;
      }
      const res = await updateOrderStatus(orderId, "cancelled", { reason: reason.trim() });
      if (res && res.success) {
        alert("Hủy đơn hàng thành công!");
        // Update selected modal details if open
        setSelectedOrderDetail(prev => prev && prev.id === orderId ? { ...prev, status: "cancelled" } : prev);
      } else {
        alert("Hủy đơn hàng thất bại!");
      }
    }
  };

  const handleConfirmReceived = async (orderId) => {
    if (confirm(`Bạn xác nhận đã nhận hàng thành công cho đơn hàng ${orderId}?`)) {
      const res = await updateOrderStatus(orderId, "completed");
      if (res && res.success) {
        alert("Xác nhận đã nhận hàng thành công!");
        // Update selected modal details if open
        setSelectedOrderDetail(prev => prev && prev.id === orderId ? { ...prev, status: "completed" } : prev);
      } else {
        alert("Xác nhận nhận hàng thất bại!");
      }
    }
  };

  const handlePrintInvoice = (order) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Hóa đơn ${order.id}</title>
          <style>
            body { font-family: 'Arial', sans-serif; padding: 40px; color: #333; line-height: 1.5; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; }
            .header p { margin: 5px 0 0 0; color: #666; font-size: 14px; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
            .info-block h3 { margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; color: #888; border-bottom: 1px solid #eee; padding-bottom: 5px; }
            .info-block p { margin: 4px 0; font-size: 14px; font-weight: 600; }
            .table { border-collapse: collapse; margin-bottom: 30px; width: 100%; }
            .table th { border-bottom: 2px solid #333; text-align: left; padding: 10px 0; font-size: 12px; text-transform: uppercase; color: #666; }
            .table td { border-bottom: 1px solid #eee; padding: 12px 0; font-size: 14px; }
            .totals { margin-left: auto; width: 300px; margin-top: 20px; }
            .totals-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
            .totals-row.grand { border-top: 2px solid #333; padding-top: 10px; font-size: 18px; font-weight: 800; color: #e65100; }
            .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>FoxStyle Fashion Store</h1>
            <p>HÓA ĐƠN BÁN LẺ VÀ GIAO NHẬN</p>
          </div>
          <div class="info-grid">
            <div class="info-block">
              <h3>Thông tin đơn hàng</h3>
              <p>Mã đơn hàng: ${order.id}</p>
              <p>Ngày đặt hàng: ${order.date}</p>
              <p>Phương thức: ${order.paymentMethod === "transfer" ? "Chuyển khoản (PayOS)" : "Thanh toán COD"}</p>
              <p>Trạng thái: ${order.status.toUpperCase()}</p>
            </div>
            <div class="info-block">
              <h3>Thông tin người nhận</h3>
              <p>Họ và tên: ${order.customerName}</p>
              <p>Số điện thoại: ${order.phone}</p>
              <p>Địa chỉ nhận: ${order.address}</p>
            </div>
          </div>
          <table class="table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Màu/Size</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th style="text-align: right;">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.product.name}</td>
                  <td>${item.color} / ${item.size}</td>
                  <td>${item.product.price.toLocaleString('vi-VN')}đ</td>
                  <td>${item.quantity}</td>
                  <td style="text-align: right;">${(item.product.price * item.quantity).toLocaleString('vi-VN')}đ</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <div class="totals">
            <div class="totals-row">
              <span>Tạm tính:</span>
              <span>${order.subtotal.toLocaleString('vi-VN')}đ</span>
            </div>
            ${order.discount > 0 ? `
              <div class="totals-row" style="color: red;">
                <span>Giảm giá (${order.couponCode || "Mã giảm giá"}):</span>
                <span>-${order.discount.toLocaleString('vi-VN')}đ</span>
              </div>
            ` : ""}
            <div class="totals-row">
              <span>Phí vận chuyển:</span>
              <span>${order.shipping.toLocaleString('vi-VN')}đ</span>
            </div>
            <div class="totals-row grand">
              <span>Tổng cộng:</span>
              <span>${order.total.toLocaleString('vi-VN')}đ</span>
            </div>
          </div>
          <div class="footer">
            <p>Cảm ơn quý khách đã mua sắm tại FoxStyle!</p>
            <p>Mọi thắc mắc xin vui lòng liên hệ hotline: 1900 xxxx</p>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return <span className="bg-yellow-50 text-yellow-700 border border-yellow-200 text-xs font-bold px-2.5 py-1 rounded-full uppercase">Chờ xử lý</span>;
      case "processing":
        return <span className="bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold px-2.5 py-1 rounded-full uppercase">Đang xử lý</span>;
      case "shipping":
        return <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold px-2.5 py-1 rounded-full uppercase">Đang giao</span>;
      case "completed":
        return <span className="bg-green-50 text-green-700 border border-green-200 text-xs font-bold px-2.5 py-1 rounded-full uppercase">Đã giao</span>;
      case "cancelled":
        return <span className="bg-red-50 text-red-700 border border-red-200 text-xs font-bold px-2.5 py-1 rounded-full uppercase">Đã hủy</span>;
      case "returned":
        return <span className="bg-pink-50 text-pink-700 border border-pink-200 text-xs font-bold px-2.5 py-1 rounded-full uppercase">Hoàn hàng</span>;
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
            { id: "pending", label: "Chờ xử lý" },
            { id: "processing", label: "Đang xử lý" },
            { id: "shipping", label: "Đang giao" },
            { id: "completed", label: "Đã giao" },
            { id: "cancelled", label: "Đã hủy" },
            { id: "returned", label: "Hoàn hàng" }
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paginatedOrders.map((order) => {
                const isTransfer = order.paymentMethod === "transfer";
                const isPendingTransfer = isTransfer && order.status === "pending";
                const isPaidTransfer = isTransfer && (order.status === "processing" || order.status === "shipping" || order.status === "completed");
                const canPayCodByQr =
                  !isTransfer &&
                  !order.isPaid &&
                  ["pending", "processing", "shipping"].includes(order.status);

                return (
                  <div key={order.id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition relative">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-gray-950 font-extrabold text-base tracking-wide font-mono">{order.id}</span>
                      {getStatusBadge(order.status)}
                    </div>

                    {isTransfer && (
                      <div className="mb-3">
                        {isPaidTransfer ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                            <Check className="h-3 w-3" /> Đã thanh toán Chuyển khoản QR
                          </span>
                        ) : isPendingTransfer ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                            ⏳ Chờ chuyển khoản QR
                          </span>
                        ) : null}
                      </div>
                    )}

                    {(order.status === "cancelled" || order.status === "returned") && (
                      <div className={`mb-3 rounded-xl border px-3 py-2 text-xs font-bold ${
                        order.status === "cancelled"
                          ? "border-red-200 bg-red-50 text-red-800"
                          : "border-rose-200 bg-rose-50 text-rose-800"
                      }`}>
                        {order.status === "cancelled" ? "Lý do hủy: " : "Lý do hoàn hàng: "}
                        {displayOrderReason(order.status === "cancelled" ? order.cancellationReason : order.returnReason) || "Chưa cập nhật"}
                      </div>
                    )}
                    
                    <div className="space-y-1.5 text-xs text-gray-500 font-semibold mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                        <span>Ngày đặt: {order.date}</span>
                      </div>
                      <div className="flex items-center">
                        <CreditCard className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                        <span className="capitalize">Thanh toán: {isTransfer ? "Chuyển khoản Ngân hàng (VietQR)" : "COD khi nhận hàng · Có hỗ trợ quét QR"}</span>
                      </div>
                    </div>

                    {(isPendingTransfer || canPayCodByQr) && (
                      <button
                        onClick={() => openPayOSQRModalForOrder(order)}
                        className="mb-4 w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-sm flex items-center justify-center gap-1.5 cursor-pointer transition"
                      >
                        <QrCode className="h-4 w-4" />
                        <span>{canPayCodByQr ? "Mã QR thanh toán khi nhận hàng" : "Quét mã QR Thanh toán ngay"}</span>
                      </button>
                    )}

                    <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Tổng thanh toán</p>
                        <p className="text-lg font-black text-orange-600">{order.total.toLocaleString('vi-VN')}đ</p>
                      </div>
                      
                      <button
                        onClick={() => setSelectedOrderDetail(order)}
                        className="bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold text-xs px-4 py-2 rounded-xl transition shadow-sm flex items-center cursor-pointer"
                      >
                        <span>Xem chi tiết</span>
                        <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* --- Pagination Controls --- */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 pt-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className="px-3.5 py-2 text-xs font-bold bg-white text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  Trước
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-9 h-9 flex items-center justify-center text-xs font-bold rounded-xl transition cursor-pointer ${
                      currentPage === i + 1
                        ? "bg-orange-600 text-white shadow-sm"
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  className="px-3.5 py-2 text-xs font-bold bg-white text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  Sau
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* --- Detailed Order Modal --- */}
      {selectedOrderDetail && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl max-h-[92vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden transform transition animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-2.5">
                <FileText className="h-5 w-5 text-orange-600" />
                <h3 className="font-extrabold text-gray-900 text-base">Chi tiết đơn hàng {selectedOrderDetail.id}</h3>
              </div>
              <button
                onClick={() => setSelectedOrderDetail(null)}
                className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[calc(92vh-70px)] overflow-y-auto">
              
              {/* Recipient Information Block */}
              <div className="bg-orange-50/50 border border-orange-100 rounded-2xl p-5 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-orange-600 mb-1 flex items-center">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  <span>Thông tin giao nhận</span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-gray-600">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Người nhận</p>
                      <p className="text-gray-900 font-extrabold text-sm">{selectedOrderDetail.customerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Số điện thoại</p>
                      <p className="text-gray-900 font-extrabold text-sm">{selectedOrderDetail.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-orange-100/50 pt-3 mt-1">
                  <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Địa chỉ nhận hàng</p>
                  <p className="text-xs text-gray-800 font-bold leading-relaxed">{selectedOrderDetail.address}</p>
                </div>
              </div>

              {(selectedOrderDetail.status === "cancelled" || selectedOrderDetail.status === "returned") && (
                <div className={`rounded-2xl border p-4 text-sm font-bold ${
                  selectedOrderDetail.status === "cancelled"
                    ? "border-red-200 bg-red-50 text-red-800"
                    : "border-rose-200 bg-rose-50 text-rose-800"
                }`}>
                  {selectedOrderDetail.status === "cancelled" ? "Lý do hủy đơn hàng: " : "Lý do hoàn hàng: "}
                  {displayOrderReason(
                    selectedOrderDetail.status === "cancelled"
                      ? selectedOrderDetail.cancellationReason
                      : selectedOrderDetail.returnReason
                  ) || "Chưa cập nhật"}
                </div>
              )}

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-gray-400">Danh sách sản phẩm mua</h4>
                <div className="border border-gray-100 rounded-2xl divide-y divide-gray-100 overflow-hidden">
                  {selectedOrderDetail.items.map((item, idx) => (
                    <div key={idx} className="p-4 flex gap-4 items-center">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-14 h-14 object-cover rounded-xl border shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/products/${item.product.id}`}
                          onClick={() => setSelectedOrderDetail(null)}
                          className="font-bold text-gray-800 text-sm hover:text-orange-600 transition truncate block max-w-xs md:max-w-md font-mono"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-xs text-gray-400 font-bold mt-1">Màu: {item.color} | Size: {item.size} | SL: {item.quantity}</p>
                        {item.product?.description && item.product.description.includes("[COMBO:") && (
                          <div className="mt-2 text-xs bg-orange-50/80 p-2 rounded-xl border border-orange-200">
                            <span className="font-bold text-orange-900 block text-[10px] uppercase tracking-wider mb-0.5">📦 Các sản phẩm gộp trong Set:</span>
                            <p className="text-gray-800 text-[11px] font-medium leading-relaxed">
                              {(item.product?.description || "").replace(/\[COMBO:[\d,]+\]/, "").trim()}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className="font-extrabold text-gray-700 text-sm">
                          {(item.product.price * item.quantity).toLocaleString('vi-VN')}đ
                        </span>
                        {selectedOrderDetail.status === "completed" && (
                          <Link
                            to={`/products/${item.product.id}`}
                            onClick={() => setSelectedOrderDetail(null)}
                            className="text-[10px] font-black uppercase tracking-wider text-orange-600 hover:text-orange-700 border border-orange-200 hover:bg-orange-50/50 px-2.5 py-1 rounded-xl transition"
                          >
                            Đánh giá
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Billing Summary Block */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 border-t border-gray-100">
                
                {/* Print and Status Buttons */}
                <div className="flex flex-wrap gap-2">
                  {selectedOrderDetail.status !== "pending" && selectedOrderDetail.status !== "processing" && selectedOrderDetail.status !== "cancelled" && selectedOrderDetail.status !== "returned" && (
                    <button
                      onClick={() => handlePrintInvoice(selectedOrderDetail)}
                      className="flex items-center text-xs font-bold text-gray-700 hover:text-zinc-950 border border-gray-200 hover:bg-gray-50 px-3.5 py-2.5 rounded-xl transition shadow-sm"
                    >
                      <Printer className="h-4 w-4 mr-1 text-gray-500" />
                      <span>In hóa đơn</span>
                    </button>
                  )}

                  {(selectedOrderDetail.status === "pending" || selectedOrderDetail.status === "processing") && (
                    <button
                      onClick={() => handleCancelOrder(selectedOrderDetail.id)}
                      className="flex items-center text-xs font-bold text-red-600 hover:text-red-700 border border-red-200 hover:bg-red-50 px-3.5 py-2.5 rounded-xl transition cursor-pointer"
                    >
                      <X className="h-4 w-4 mr-1" />
                      <span>Hủy đơn</span>
                    </button>
                  )}

                  {selectedOrderDetail.status === "completed" && (
                    <>
                      {(() => {
                        const deliveredAt = selectedOrderDetail.deliveredAt;
                        if (!deliveredAt) {
                          return (
                            <button
                              disabled
                              className="flex items-center text-xs font-bold text-gray-400 border border-gray-200 bg-gray-100 px-3.5 py-2.5 rounded-xl cursor-not-allowed opacity-75"
                              title="Chưa xác định được thời điểm giao hàng"
                            >
                              <AlertTriangle className="h-4 w-4 mr-1 text-gray-400" />
                              <span>Chưa xác định thời hạn đổi/trả</span>
                            </button>
                          );
                        }
                        const orderDateObj = new Date(deliveredAt);
                        const now = new Date();
                        const diffHours = (now - orderDateObj) / (1000 * 60 * 60);
                        const isWithin3Days = diffHours <= 72;
                        const remainingDays = Math.max(0, Math.ceil((72 - diffHours) / 24));

                        if (isWithin3Days) {
                          return (
                            <button
                              onClick={() => {
                                setTargetReturnOrder(selectedOrderDetail);
                                setShowReturnModal(true);
                              }}
                              className="flex items-center text-xs font-bold text-pink-700 hover:text-pink-800 border border-pink-200 bg-pink-50/50 hover:bg-pink-100 px-3.5 py-2.5 rounded-xl transition cursor-pointer shadow-2xs"
                            >
                              <AlertTriangle className="h-4 w-4 mr-1 text-pink-600 animate-pulse" />
                              <span>Yêu cầu Đổi/Trả hàng (Còn {remainingDays} ngày)</span>
                            </button>
                          );
                        } else {
                          return (
                            <button
                              disabled
                              className="flex items-center text-xs font-bold text-gray-400 border border-gray-200 bg-gray-100 px-3.5 py-2.5 rounded-xl cursor-not-allowed opacity-75"
                              title="Chính sách đổi trả áp dụng trong vòng 3 ngày kể từ khi đặt/nhận hàng."
                            >
                              <AlertTriangle className="h-4 w-4 mr-1 text-gray-400" />
                              <span>Đã quá 3 ngày - Hết hạn Đổi/Trả</span>
                            </button>
                          );
                        }
                      })()}
                    </>
                  )}
                </div>

                {/* Billing Summary Table */}
                <div className="w-full sm:w-auto text-right space-y-1.5 text-xs font-semibold text-gray-500">
                  <div className="flex justify-between sm:justify-end space-x-6">
                    <span>Tạm tính:</span>
                    <span className="text-gray-800 font-bold">{selectedOrderDetail.subtotal.toLocaleString('vi-VN')}đ</span>
                  </div>
                  {selectedOrderDetail.discount > 0 && (
                    <div className="flex justify-between sm:justify-end space-x-6 text-red-600">
                      <span>Giảm giá ({selectedOrderDetail.couponCode}):</span>
                      <span>-{selectedOrderDetail.discount.toLocaleString('vi-VN')}đ</span>
                    </div>
                  )}
                  {selectedOrderDetail.tax > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Thuế VAT</span>
                      <span>+{selectedOrderDetail.tax.toLocaleString('vi-VN')}đ</span>
                    </div>
                  )}
                  <div className="flex justify-between sm:justify-end space-x-6 text-sm border-t border-gray-100 pt-2.5">
                    <span className="font-bold text-gray-800">Tổng thanh toán:</span>
                    <span className="text-base font-extrabold text-orange-600">{selectedOrderDetail.total.toLocaleString('vi-VN')}đ</span>
                  </div>
                  {selectedOrderDetail.paymentMethod === "cod" &&
                    !selectedOrderDetail.isPaid &&
                    ["pending", "processing", "shipping"].includes(selectedOrderDetail.status) && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedOrderDetail(null);
                          openPayOSQRModalForOrder(selectedOrderDetail);
                        }}
                        className="mt-4 ml-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 px-4 py-2.5 text-xs font-black text-white shadow-sm transition hover:from-orange-600 hover:to-pink-700"
                      >
                        <QrCode className="h-4 w-4" />
                        Mở mã QR thanh toán khi nhận hàng
                      </button>
                    )}
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* --- Return Request Modal with 3-Day Rule & Bank Refund Details --- */}
      {showReturnModal && targetReturnOrder && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 relative space-y-4 animate-in zoom-in-95 duration-200 border border-pink-100">
            <button
              onClick={() => setShowReturnModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 text-pink-600 font-extrabold text-lg">
              <AlertTriangle className="h-6 w-6" />
              <span>Yêu cầu Đổi / Trả hàng & Hoàn tiền</span>
            </div>

            <div className="bg-pink-50 p-3 rounded-2xl border border-pink-200 text-xs text-pink-800 space-y-1">
              <p className="font-bold">
                ⏱️ Quy định đổi/trả: Hỗ trợ hoàn tiền 100% trong vòng <span className="underline">3 ngày</span> kể từ khi nhận hàng.
              </p>
              <p className="text-[11px] text-pink-600">
                Đơn hàng: <span className="font-extrabold">{targetReturnOrder.id}</span> | Tổng tiền: <span className="font-extrabold">{targetReturnOrder.total.toLocaleString('vi-VN')}đ</span>
              </p>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!returnBankAccountNo || !returnBankAccountName) {
                  alert("Vui lòng điền đầy đủ số tài khoản và tên chủ tài khoản ngân hàng để nhận tiền hoàn!");
                  return;
                }

                try {
                  if (updateProfile) {
                    await updateProfile({
                      bankName: returnBankName,
                      bankAccountNo: returnBankAccountNo,
                      bankAccountName: returnBankAccountName
                    });
                  }
                } catch (err) {}

                const returnReasonLabels = {
                  size_not_fit: "Kích thước không vừa",
                  defective: "Sản phẩm bị lỗi nhà sản xuất / rách / phai màu",
                  wrong_item: "Giao sai mẫu hoặc sai màu",
                  other: "Lý do khác"
                };
                const fullReturnReason = [
                  returnReasonLabels[returnReason] || returnReason,
                  returnNote.trim()
                ].filter(Boolean).join(" - ");
                await updateOrderStatus(targetReturnOrder.id, "returned", {
                  reason: fullReturnReason,
                  warrantyRedelivery
                });
                alert(`✅ Gửi yêu cầu Đổi/Trả hàng thành công!\n\nThông tin nhận tiền hoàn:\n- Ngân hàng: ${returnBankName}\n- STK: ${returnBankAccountNo}\n- Chủ TK: ${returnBankAccountName.toUpperCase()}\n\nCSkhách hàng sẽ xử lý và chuyển khoản hoàn tiền trong vòng 24h!`);
                setShowReturnModal(false);
                setSelectedOrderDetail(null);
              }}
              className="space-y-3.5 text-xs font-semibold"
            >
              <div>
                <label className="block text-gray-700 font-bold mb-1">Lý do đổi/trả hàng *</label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-pink-500 bg-white"
                >
                  <option value="size_not_fit">Kích thước không vừa (Mặc bị rộng/chật)</option>
                  <option value="defective">Sản phẩm bị lỗi nhà sản xuất / Rách / Phai màu</option>
                  <option value="wrong_item">Giao sai mẫu / Sai màu so với đơn đặt</option>
                  <option value="other">Lý do khác</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Mô tả chi tiết / Ghi chú thêm</label>
                <textarea
                  rows="2"
                  value={returnNote}
                  onChange={(e) => setReturnNote(e.target.value)}
                  placeholder="Vui lòng cung cấp thêm thông tin lý do đổi trả..."
                  className="w-full p-2.5 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-pink-500 bg-white"
                ></textarea>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={warrantyRedelivery}
                    onChange={(e) => setWarrantyRedelivery(e.target.checked)}
                    className="mt-0.5 h-4 w-4 accent-emerald-600"
                  />
                  <span>
                    <span className="block font-black text-emerald-800">
                      Tôi muốn bảo hành/đổi sản phẩm và giao lại
                    </span>
                    <span className="mt-1 block text-[11px] font-medium text-emerald-700">
                      Cửa hàng sẽ xử lý sản phẩm và tạo lượt giao lại sau khi xác nhận.
                    </span>
                  </span>
                </label>
              </div>

              {/* Bank Refund Details Input Section */}
              <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200 space-y-2.5">
                <h4 className="text-[11px] font-black uppercase text-amber-800 tracking-wider flex items-center justify-between">
                  <span>🏦 Thông tin Ngân hàng nhận tiền hoàn *</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold">Cho phép thay đổi</span>
                </h4>

                <div>
                  <label className="block text-[11px] text-gray-700 font-bold mb-1">Tên ngân hàng *</label>
                  <select
                    value={returnBankName}
                    onChange={(e) => setReturnBankName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="MB Bank (Ngân hàng Quân Đội)">MB Bank (Ngân hàng Quân Đội)</option>
                    <option value="Vietcombank (VCB)">Vietcombank (VCB)</option>
                    <option value="Techcombank (TCB)">Techcombank (TCB)</option>
                    <option value="VPBank">VPBank</option>
                    <option value="VietinBank">VietinBank</option>
                    <option value="Agribank">Agribank</option>
                    <option value="ACB (Á Châu)">ACB (Á Châu)</option>
                    <option value="TPBank">TPBank</option>
                    <option value="BIDV">BIDV</option>
                    <option value="MSB (Hàng Hải)">MSB (Hàng Hải)</option>
                    <option value="Sacombank">Sacombank</option>
                    <option value="HDBank">HDBank</option>
                    <option value="OCB">OCB</option>
                    <option value="VIB">VIB</option>
                    <option value="Ngân hàng khác">Ngân hàng khác (Nhập ở ghi chú)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-gray-700 font-bold mb-1">Số tài khoản *</label>
                    <input
                      type="text"
                      required
                      value={returnBankAccountNo}
                      onChange={(e) => setReturnBankAccountNo(e.target.value)}
                      placeholder="Ví dụ: 0362804559"
                      className="w-full p-2 border border-gray-300 rounded-xl text-xs font-black text-gray-900 bg-white focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-gray-700 font-bold mb-1">Tên chủ tài khoản *</label>
                    <input
                      type="text"
                      required
                      value={returnBankAccountName}
                      onChange={(e) => setReturnBankAccountName(e.target.value.toUpperCase())}
                      placeholder="NGUYEN VAN A"
                      className="w-full p-2 border border-gray-300 rounded-xl text-xs font-black text-gray-900 bg-white focus:ring-2 focus:ring-amber-500 uppercase"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReturnModal(false)}
                  className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200 transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-black transition shadow-md cursor-pointer"
                >
                  Gửi yêu cầu hoàn tiền
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- PayOS QR Interactive Modal for Order History --- */}
      {payosModalOrder && (
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
                  <QrCode className="h-5 w-5 text-white" />
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
                onClick={() => setPayosModalOrder(null)}
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
                  <p className="text-[10px] text-orange-800 font-extrabold uppercase tracking-wider">Mã đơn hàng</p>
                  <p className="text-base font-black text-gray-900">{payosModalOrder.id}</p>
                </div>
                <span className="bg-orange-500/10 text-orange-700 text-xs font-bold px-3 py-1 rounded-full border border-orange-300">
                  Chờ chuyển khoản
                </span>
              </div>

              {/* VietQR Code Display */}
              <div className="relative p-4 bg-white rounded-3xl shadow-md border border-orange-100 inline-block mx-auto group">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-pink-500 rounded-3xl blur-xs opacity-20 group-hover:opacity-40 transition duration-300 pointer-events-none"></div>
                <div className="relative bg-white p-2 rounded-2xl">
                  <img
                    src={payosData?.qrCode || `https://img.vietqr.io/image/MB-0362804559-qr_only.png?amount=${payosModalOrder.total}&addInfo=${payosModalOrder.id}&accountName=NGUYEN%20TAN%20NGUYEN%20CHIEN`}
                    alt="VietQR Code"
                    className="w-56 h-56 sm:w-60 sm:h-60 mx-auto object-contain rounded-xl"
                  />
                </div>
              </div>

              {/* Banking Details Card - Sleek Dark Mode Theme */}
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
                  <span className="text-orange-400 font-black text-base">{payosModalOrder.total.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 font-bold">Nội dung chuyển:</span>
                  <span className="bg-blue-500/20 text-blue-300 px-2.5 py-0.5 rounded-md font-black text-xs border border-blue-500/30">
                    {payosData?.description || payosModalOrder.id}
                  </span>
                </div>
              </div>

              {/* Status Indicator Bar */}
              <div className="flex items-center justify-center space-x-2 text-xs font-bold py-2.5 px-4 bg-amber-50 text-amber-800 rounded-xl border border-amber-200/80 shadow-2xs">
                <Loader2 className="h-4 w-4 animate-spin text-orange-600" />
                <span>Hệ thống đang tự động kiểm tra giao dịch qua Ngân hàng...</span>
              </div>

              {payosData?.checkoutUrl && (
                <a
                  href={payosData.checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-extrabold text-orange-600 hover:text-orange-700 hover:underline pt-1"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Mở cổng thanh toán PayOS trên trình duyệt web</span>
                </a>
              )}
            </div>

            {/* Footer - Fixed Bottom Button */}
            <div className="p-4 bg-white border-t border-gray-100 shrink-0">
              <button
                type="button"
                onClick={verifyPayOSStatusManual}
                disabled={isCheckingPayOS}
                className="w-full bg-gradient-to-r from-orange-500 via-pink-600 to-rose-600 hover:from-orange-600 hover:to-rose-700 text-white font-extrabold py-3.5 rounded-2xl text-sm shadow-lg shadow-orange-500/20 flex items-center justify-center space-x-2 cursor-pointer transition-all active:scale-[0.98]"
              >
                {isCheckingPayOS ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Đang kiểm tra giao dịch...</span>
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
    </div>
  );
}
