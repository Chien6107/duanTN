import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { CreditCard, Truck, AlertTriangle, ShieldCheck, Check, Loader2, X } from "lucide-react";
import { useApp } from "../context/AppContext";

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cart, addressBook, createOrder, currentUser } = useApp();

  const [checkoutSummary, setCheckoutSummary] = useState({
    subtotal: 0,
    shipping: 0,
    discount: 0,
    couponCode: "",
    total: 0
  });

  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "Hà Nội",
    district: "",
    note: "",
  });

  // PayOS QR Modal states
  const [showQrModal, setShowQrModal] = useState(false);
  const [isCreatingPaymentLink, setIsCreatingPaymentLink] = useState(false);
  const [simulatedOrderId, setSimulatedOrderId] = useState("");

  // Load checkout summary from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("foxstyle_checkout_summary");
    if (saved) {
      setCheckoutSummary(JSON.parse(saved));
    } else {
      // Fallback calculation if not stored
      const sub = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      const ship = sub > 300000 ? 0 : 30000;
      setCheckoutSummary({
        subtotal: sub,
        shipping: ship,
        discount: 0,
        couponCode: "",
        total: sub + ship
      });
    }

    // Prefill form if user is logged in
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        fullName: currentUser.fullName || "",
        phone: currentUser.phone || "",
        email: currentUser.email || "",
      }));
    }

    // Select default address if available in addressBook
    const defaultAddr = addressBook.find(a => a.userId === currentUser?.id && a.isDefault);
    if (defaultAddr) {
      setSelectedAddressId(defaultAddr.id.toString());
      setFormData(prev => ({
        ...prev,
        address: defaultAddr.detailAddress,
        city: defaultAddr.city,
        district: defaultAddr.district,
        fullName: defaultAddr.fullName,
        phone: defaultAddr.phone
      }));
    }
  }, [currentUser, addressBook, cart]);

  // Handle address change selection
  const handleAddressChange = (addrId) => {
    setSelectedAddressId(addrId);
    if (addrId === "new") {
      setFormData(prev => ({
        ...prev,
        address: "",
        district: "",
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
          district: selected.district
        }));
      }
    }
  };

  const handleOrderSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Giỏ hàng đang trống! Vui lòng thêm sản phẩm trước.");
      return;
    }

    const orderData = {
      items: cart,
      userId: currentUser ? currentUser.id : null,
      customerName: formData.fullName,
      phone: formData.phone,
      address: `${formData.address}, ${formData.district}, ${formData.city}`,
      subtotal: checkoutSummary.subtotal,
      shipping: checkoutSummary.shipping,
      discount: checkoutSummary.discount,
      couponCode: checkoutSummary.couponCode,
      total: checkoutSummary.total,
      paymentMethod,
      note: formData.note
    };

    if (paymentMethod === "transfer") {
      // Simulate PayOS payment link creation
      setIsCreatingPaymentLink(true);
      setTimeout(() => {
        setIsCreatingPaymentLink(false);
        const tempId = "DH" + Math.floor(10000000 + Math.random() * 90000000);
        setSimulatedOrderId(tempId);
        setShowQrModal(true);
      }, 1000);
    } else {
      // COD Order flow
      try {
        await createOrder(orderData);
        alert("Đặt hàng thành công! Đơn hàng của bạn ở trạng thái chờ duyệt.");
        navigate("/orders");
      } catch (err) {
        alert(err.message || "Đặt hàng thất bại. Vui lòng thử lại!");
      }
    }
  };

  // Callback when user simulates scanner payment success
  const simulatePaymentSuccess = async () => {
    const orderData = {
      items: cart,
      userId: currentUser ? currentUser.id : null,
      customerName: formData.fullName,
      phone: formData.phone,
      address: `${formData.address}, ${formData.district}, ${formData.city}`,
      subtotal: checkoutSummary.subtotal,
      shipping: checkoutSummary.shipping,
      discount: checkoutSummary.discount,
      couponCode: checkoutSummary.couponCode,
      total: checkoutSummary.total,
      paymentMethod,
      note: formData.note
    };
    
    // Create completed payment order
    try {
      const finalId = await createOrder({
        ...orderData,
        id: simulatedOrderId,
        status: "completed", // payment succeeded -> auto completed or approved
      });

      setShowQrModal(false);
      alert(`PayOS: Cổng thanh toán ghi nhận giao dịch thành công cho đơn hàng ${finalId}!`);
      navigate("/orders");
    } catch (err) {
      alert(err.message || "Không thể tạo đơn hàng thanh toán.");
    }
  };

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
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Thanh toán</h1>

        {cart.length === 0 ? (
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
                  {currentUser && addressBook.filter(a => a.userId === currentUser.id).length > 0 && (
                    <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Sổ địa chỉ của bạn</label>
                      <select
                        value={selectedAddressId}
                        onChange={(e) => handleAddressChange(e.target.value)}
                        className="w-full bg-white px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      >
                        {addressBook.filter(a => a.userId === currentUser.id).map(addr => (
                          <option key={addr.id} value={addr.id}>
                            {addr.fullName} ({addr.phone}) - {addr.detailAddress}, {addr.district}, {addr.city} {addr.isDefault ? "[Mặc định]" : ""}
                          </option>
                        ))}
                        <option value="new">+ Nhập địa chỉ giao hàng khác</option>
                      </select>
                    </div>
                  )}

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
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Số điện thoại *</label>
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
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Địa chỉ Email</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="example@email.com"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Địa chỉ nhà (Số nhà, ngõ ngách, tên đường) *</label>
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
                        required
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold"
                      >
                        <option value="Hà Nội">Hà Nội</option>
                        <option value="TP HCM">TP Hồ Chí Minh</option>
                        <option value="Đà Nẵng">Đà Nẵng</option>
                        <option value="Hải Phòng">Hải Phòng</option>
                        <option value="Cần Thơ">Cần Thơ</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Quận / Huyện *</label>
                      <input
                        type="text"
                        required
                        value={formData.district}
                        onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                        placeholder="Ví dụ: Quận Cầu Giấy"
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
                        <div className="text-xs text-gray-500 mt-0.5">Quý khách sẽ thanh toán tiền mặt cho nhân viên giao hàng khi nhận sản phẩm.</div>
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
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <div className="min-w-0 pr-4">
                          <p className="font-bold text-gray-800 truncate">{item.product.name}</p>
                          <p className="text-gray-400 mt-0.5 font-medium">Màu: {item.color} | Size: {item.size} | SL: {item.quantity}</p>
                        </div>
                        <span className="font-bold text-gray-700 flex-shrink-0">
                          {(item.product.price * item.quantity).toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Calculations */}
                  <div className="space-y-2.5 pt-3 border-t border-gray-100 text-xs font-semibold text-gray-500">
                    <div className="flex justify-between">
                      <span>Tạm tính</span>
                      <span className="text-gray-800 font-bold">{checkoutSummary.subtotal.toLocaleString('vi-VN')}đ</span>
                    </div>

                    <div className="flex justify-between">
                      <span>Phí giao hàng</span>
                      <span>
                        {checkoutSummary.shipping === 0 ? (
                          <span className="text-green-600 font-bold">Miễn phí</span>
                        ) : (
                          `${checkoutSummary.shipping.toLocaleString('vi-VN')}đ`
                        )}
                      </span>
                    </div>

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

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-600 text-white py-3 rounded-xl font-bold hover:from-orange-600 hover:to-pink-700 shadow-md transition"
                  >
                    {paymentMethod === "transfer" ? "Tạo link thanh toán QR" : "Xác nhận đặt hàng"}
                  </button>
                </div>
              </div>

            </div>
          </form>
        )}
      </div>

      {/* --- PayOS QR Interactive Modal Mockup --- */}
      {showQrModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[999] backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full relative overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-pink-600 p-5 text-white flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5" />
                <h3 className="text-lg font-bold">Cổng thanh toán PayOS</h3>
              </div>
              <button
                onClick={() => {
                  setShowQrModal(false);
                  alert("Giao dịch thanh toán chuyển khoản đã bị hủy.");
                }}
                className="hover:bg-white/20 p-1 rounded-full"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 text-center space-y-5">
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Mã đơn hàng</p>
                <p className="text-lg font-extrabold text-gray-800">{simulatedOrderId}</p>
              </div>

              {/* Mock QR Code Image Wrapper */}
              <div className="relative w-48 h-48 bg-white border-2 border-gray-200 rounded-2xl mx-auto flex items-center justify-center p-3 shadow-inner">
                {/* Visual simulator for scanner app */}
                <div className="absolute inset-0 bg-gradient-to-b from-orange-500/0 via-orange-500/10 to-orange-500/0 h-full w-full animate-pulse pointer-events-none"></div>
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=FoxStyleStoreTransfer"
                  alt="QR Code"
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Transaction billing details */}
              <div className="bg-gray-50 rounded-2xl p-4 text-left text-xs font-semibold text-gray-600 space-y-2">
                <div className="flex justify-between">
                  <span>Ngân hàng:</span>
                  <span className="text-gray-900 font-bold">MB Bank (Quân Đội)</span>
                </div>
                <div className="flex justify-between">
                  <span>Số tài khoản:</span>
                  <span className="text-gray-900 font-bold">0123 456 789</span>
                </div>
                <div className="flex justify-between">
                  <span>Chủ tài khoản:</span>
                  <span className="text-gray-900 font-bold">FOXSTYLE FASHION STORE</span>
                </div>
                <div className="flex justify-between">
                  <span>Số tiền chuyển:</span>
                  <span className="text-orange-600 font-extrabold text-sm">{checkoutSummary.total.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Nội dung chuyển:</span>
                  <span className="text-blue-600 font-extrabold">{simulatedOrderId}</span>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-2 text-orange-600 text-xs font-bold animate-pulse">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Đang đợi khách hàng quét mã chuyển khoản...</span>
              </div>

              {/* Simulation triggers */}
              <div className="pt-2 border-t border-gray-100 space-y-2">
                <button
                  type="button"
                  onClick={simulatePaymentSuccess}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl text-sm shadow flex items-center justify-center space-x-2"
                >
                  <Check className="h-4 w-4" />
                  <span>Simulate: Quét và chuyển khoản thành công</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setShowQrModal(false);
                    alert("Bạn đã chọn hủy thanh toán chuyển khoản.");
                  }}
                  className="w-full border border-gray-300 text-gray-500 py-2 rounded-xl text-sm font-semibold hover:bg-gray-50"
                >
                  Hủy thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
