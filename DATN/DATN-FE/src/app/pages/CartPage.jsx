import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Trash2, Plus, Minus, ShoppingBag, Tag, Ticket, X } from "lucide-react";
import { useApp } from "../context/AppContext";

export function CartPage() {
  const navigate = useNavigate();
  const { cart, updateCartQuantity, removeFromCart, applyCoupon } = useApp();

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
  // Free shipping on orders over 300k, otherwise 30k
  const shipping = subtotal > 300000 ? 0 : 30000;
  
  // Re-calculate coupon discount if subtotal changes
  useEffect(() => {
    const reapplyCoupon = async () => {
      if (appliedCoupon) {
        const res = await applyCoupon(appliedCoupon.code, subtotal);
        if (res.success) {
          setDiscount(res.discount);
        } else {
          // Clear coupon if it's no longer valid (e.g. order value dropped below minOrderValue)
          setAppliedCoupon(null);
          setDiscount(0);
          setCouponError("Mã giảm giá đã bị hủy do tổng tiền đơn hàng thay đổi!");
          setCouponSuccess("");
        }
      }
    };
    reapplyCoupon();
  }, [subtotal, appliedCoupon]);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError("");
    setCouponSuccess("");

    if (!couponCode.trim()) {
      setCouponError("Vui lòng nhập mã giảm giá!");
      return;
    }

    const res = await applyCoupon(couponCode, subtotal);
    if (res.success) {
      setAppliedCoupon(res.coupon);
      setDiscount(res.discount);
      setCouponSuccess(`Áp dụng mã thành công! Giảm ${res.discount.toLocaleString('vi-VN')}đ`);
      setCouponCode("");
    } else {
      setCouponError(res.message);
    }
  };

  const removeAppliedCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponSuccess("");
    setCouponError("");
  };

  const handleProceedToCheckout = () => {
    // Save checkout totals to localStorage for CheckoutPage to read
    const checkoutSummary = {
      subtotal,
      shipping,
      discount,
      couponCode: appliedCoupon ? appliedCoupon.code : "",
      total: Math.max(0, subtotal + shipping - discount)
    };
    localStorage.setItem("foxstyle_checkout_summary", JSON.stringify(checkoutSummary));
    navigate("/checkout");
  };

  const total = Math.max(0, subtotal + shipping - discount);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Giỏ hàng của bạn</h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center max-w-xl mx-auto">
            <ShoppingBag className="h-20 w-20 mx-auto text-gray-300 mb-4 animate-bounce" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Giỏ hàng đang trống</h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-8">
              Bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy lướt qua bộ sưu tập thời trang cao cấp của chúng tôi nhé!
            </p>
            <Link
              to="/products"
              className="inline-block bg-gradient-to-r from-orange-500 to-pink-600 text-white px-8 py-3.5 rounded-xl font-bold hover:scale-105 shadow-md transition"
            >
              Xem ngay sản phẩm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6 flex gap-4 items-center animate-in fade-in duration-200"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl bg-gray-50 border"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <Link
                          to={`/products/${item.product.id}`}
                          className="font-bold text-gray-900 text-sm md:text-base hover:text-orange-600 transition truncate block max-w-[250px]"
                        >
                          {item.product.name}
                        </Link>
                        <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                          <span className="bg-gray-100 px-2 py-0.5 rounded-md font-semibold text-gray-600">Màu: {item.color}</span>
                          <span>•</span>
                          <span className="bg-gray-100 px-2 py-0.5 rounded-md font-semibold text-gray-600">Size: {item.size}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeFromCart(index)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Controller */}
                      <div className="flex items-center border border-gray-300 rounded-xl bg-white shadow-sm overflow-hidden">
                        <button
                          onClick={() => updateCartQuantity(index, -1)}
                          className="p-2 hover:bg-gray-50 transition text-gray-500"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="px-3 font-bold text-gray-800 text-xs">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(index, 1)}
                          className="p-2 hover:bg-gray-50 transition text-gray-500"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Pricing */}
                      <div className="text-right">
                        <div className="text-base md:text-lg font-bold text-orange-600">
                          {(item.product.price * item.quantity).toLocaleString('vi-VN')}đ
                        </div>
                        <div className="text-xs text-gray-400">
                          {item.product.price.toLocaleString('vi-VN')}đ / sp
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary & Coupon */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Coupon Box */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h3 className="font-bold text-gray-800 mb-4 text-base flex items-center">
                  <Tag className="h-4 w-4 mr-2 text-orange-600" />
                  <span>Áp dụng Mã giảm giá</span>
                </h3>

                {appliedCoupon ? (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm flex items-center justify-between font-semibold">
                    <div className="flex items-center space-x-2">
                      <Ticket className="h-4 w-4 text-green-600" />
                      <span>Đang áp dụng: <span className="text-green-800 font-bold">{appliedCoupon.code}</span></span>
                    </div>
                    <button onClick={removeAppliedCoupon} className="p-1 hover:bg-green-100 rounded-full text-green-700">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Nhập mã (Ví dụ: FOXSTYLE50)..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 uppercase font-semibold"
                    />
                    <button
                      type="submit"
                      className="bg-gray-950 text-white font-bold px-4 py-2 rounded-xl hover:bg-gray-800 transition text-sm shadow-sm"
                    >
                      Áp dụng
                    </button>
                  </form>
                )}

                {couponError && (
                  <p className="text-red-600 text-xs font-semibold mt-2">{couponError}</p>
                )}
                {couponSuccess && (
                  <p className="text-green-600 text-xs font-semibold mt-2">{couponSuccess}</p>
                )}

                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                    * Thử sử dụng mã: <span className="text-orange-500 font-bold">FOXSTYLE50</span> (giảm 50% max 100k đơn từ 200k) hoặc <span className="text-orange-500 font-bold">SUMMER20</span> (giảm 20% max 50k đơn từ 150k).
                  </p>
                </div>
              </div>

              {/* Order Calculations */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 sticky top-24">
                <h2 className="text-lg font-bold text-gray-800 pb-3 border-b border-gray-100">Tóm tắt đơn hàng</h2>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600 font-semibold">
                    <span>Tạm tính</span>
                    <span className="text-gray-900">{subtotal.toLocaleString('vi-VN')}đ</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600 font-semibold">
                    <span>Phí vận chuyển</span>
                    {shipping === 0 ? (
                      <span className="text-green-600 font-bold">Miễn phí</span>
                    ) : (
                      <span className="text-gray-900">{shipping.toLocaleString('vi-VN')}đ</span>
                    )}
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-red-600 font-bold">
                      <span>Mã giảm giá</span>
                      <span>-{discount.toLocaleString('vi-VN')}đ</span>
                    </div>
                  )}

                  {/* Free shipping threshold indicator */}
                  {subtotal < 300000 && (
                    <div className="bg-orange-50 text-orange-700 text-xs p-3 rounded-xl font-semibold border border-orange-100">
                      Mua thêm <span className="font-extrabold">{(300000 - subtotal).toLocaleString('vi-VN')}đ</span> để được MIỄN PHÍ vận chuyển!
                    </div>
                  )}

                  <div className="border-t border-gray-100 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-base font-bold text-gray-800">Tổng thanh toán</span>
                      <span className="text-2xl font-extrabold text-orange-600">
                        {total.toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleProceedToCheckout}
                  className="block w-full bg-gradient-to-r from-orange-500 to-pink-600 text-white px-6 py-3.5 rounded-xl font-bold hover:from-orange-600 hover:to-pink-700 text-center shadow-md transition"
                >
                  Tiến hành thanh toán
                </button>

                <Link
                  to="/products"
                  className="block w-full border border-gray-300 px-6 py-3 rounded-xl font-bold hover:bg-gray-50 text-center text-sm text-gray-700 transition"
                >
                  Tiếp tục mua sắm
                </Link>
              </div>

            </div>

          </div>
        )}
      </div>
    </div>
  );
}
