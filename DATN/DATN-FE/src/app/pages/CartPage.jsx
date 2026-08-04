import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Trash2, Plus, Minus, ShoppingBag, Tag, Ticket, X, Bookmark, ArrowRight, Sparkles } from "lucide-react";
import { useApp } from "../context/AppContext";
import { toast } from "sonner";

export function CartPage() {
  const navigate = useNavigate();
  const { cart, products = [], addToCart, updateCartQuantity, removeFromCart, applyCoupon, currentUser, orders } = useApp();


  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");

  // Save for later state
  const [savedItems, setSavedItems] = useState(() => {
    const saved = localStorage.getItem("foxstyle_saved_for_later");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("foxstyle_saved_for_later", JSON.stringify(savedItems));
  }, [savedItems]);

  const handleSaveForLater = (index) => {
    const itemToSave = cart[index];
    setSavedItems((prev) => [...prev, itemToSave]);
    removeFromCart(index);
    toast.success(`Đã chuyển ${itemToSave.product.name} vào danh sách Lưu mua sau!`);
  };

  const handleMoveBackToCart = (index) => {
    const itemToMove = savedItems[index];
    addToCart(itemToMove.product, itemToMove.size, itemToMove.color, itemToMove.quantity);
    setSavedItems((prev) => prev.filter((_, i) => i !== index));
    toast.success(`Đã chuyển ${itemToMove.product.name} trở lại Giỏ hàng!`);
  };

  const handleRemoveSaved = (index) => {
    setSavedItems((prev) => prev.filter((_, i) => i !== index));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal >= 300000 ? 0 : 30000;

  useEffect(() => {
    const reapplyCoupon = async () => {
      if (appliedCoupon) {
        const res = await applyCoupon(appliedCoupon.code, subtotal);
        if (res.success) {
          setDiscount(res.discount);
        } else {
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

        {cart.length === 0 && savedItems.length === 0 ? (
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
            
            {/* Cart Items List & Save For Later */}
            <div className="lg:col-span-2 space-y-6">
              
              {cart.length > 0 && (
                <div className="space-y-4">
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
                               <span className="bg-gray-100 px-2 py-0.5 rounded-md font-semibold text-gray-600">Kích cỡ: {item.size}</span>
                             </div>

                             {(() => {
                               const isCombo = item.product?.isCombo ||
                                               item.product?.category === "combo" ||
                                               (item.product?.name && (item.product.name.includes("[SET COMBO]") || item.product.name.toLowerCase().includes("combo"))) ||
                                               (item.product?.description && item.product.description.includes("[COMBO:"));

                               let comboItems = Array.isArray(item.product?.comboItems)
                                 ? item.product.comboItems
                                 : [];
                               if (comboItems.length === 0 && item.product?.description) {
                                 const match = item.product.description.match(/\[COMBO:\s*([\d,]+)\]/);
                                 if (match) {
                                   const ids = match[1].split(",").map(id => Number(id.trim()));
                                   comboItems = products.filter(p => ids.includes(Number(p.id)));
                                 }
                               }

                               if (!isCombo) return null;

                               return (
                                 <div className="mt-2.5 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50/60 p-3 rounded-2xl border border-orange-200 shadow-2xs space-y-2">
                                   <div className="flex items-center justify-between">
                                     <span className="inline-flex items-center gap-1 bg-gradient-to-r from-orange-600 to-amber-500 text-white font-black text-[10px] uppercase tracking-wider px-2.5 py-0.5 rounded-md shadow-xs">
                                       🎁 SET COMBO PHỐI SẴN TRỌN BỘ
                                     </span>
                                     <span className="text-[10px] font-extrabold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full border border-orange-200">
                                       Giảm giá nguyên set
                                     </span>
                                   </div>

                                   {comboItems.length > 0 ? (
                                     <div className="space-y-1.5 pt-1">
                                       <span className="text-[10px] font-extrabold uppercase text-orange-950 block">Các trang phục bao gồm trong Combo:</span>
                                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                                         {comboItems.map((subP, subIdx) => (
                                           <div key={subIdx} className="flex items-center gap-2 bg-white/90 p-1.5 rounded-xl border border-orange-100 shadow-2xs">
                                             <img src={subP.image} alt="" className="w-8 h-8 object-cover rounded-lg shrink-0 border" />
                                             <div className="min-w-0 flex-1">
                                               <p className="text-[11px] font-bold text-zinc-900 truncate">{subP.name}</p>
                                               <p className="text-[9px] font-bold text-orange-600">
                                                 {subP.size && subP.color
                                                   ? `${subP.size} · ${subP.color}`
                                                   : subP.price
                                                   ? `${subP.price.toLocaleString("vi-VN")}đ`
                                                   : "Kèm theo"}
                                               </p>
                                             </div>
                                           </div>
                                         ))}
                                       </div>
                                     </div>
                                   ) : (
                                     <p className="text-[11px] font-semibold text-zinc-800 leading-relaxed pt-1">
                                       {(item.product?.description || "").replace(/\[COMBO:[\d,]+\]/, "").trim()}
                                     </p>
                                   )}
                                 </div>
                               );
                             })()}

                          </div>
                          
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleSaveForLater(index)}
                              className="p-1.5 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition"
                              title="Lưu lại mua sau"
                            >
                              <Bookmark className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => removeFromCart(index)}
                              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Xóa khỏi giỏ"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4">
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
              )}

              {/* SAVE FOR LATER SECTION */}
              {savedItems.length > 0 && (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
                  <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
                    <Bookmark className="h-5 w-5 text-orange-600" />
                    <span>Danh sách lưu lại mua sau ({savedItems.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedItems.map((sItem, sIdx) => (
                      <div key={sIdx} className="bg-gray-50 border border-gray-200/60 rounded-2xl p-3 flex gap-3 items-center">
                        <img src={sItem.product.image} alt="" className="w-14 h-14 object-cover rounded-xl border border-gray-200" />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-xs text-gray-900 truncate">{sItem.product.name}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">Màu: {sItem.color} | Kích cỡ: {sItem.size}</p>
                          <p className="text-xs font-black text-orange-600 mt-1">{sItem.product.price.toLocaleString('vi-VN')}đ</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => handleMoveBackToCart(sIdx)}
                            className="bg-orange-600 hover:bg-orange-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-xs transition"
                          >
                            Thêm lại
                          </button>
                          <button
                            onClick={() => handleRemoveSaved(sIdx)}
                            className="text-gray-400 hover:text-red-500 text-[10px] font-semibold text-center"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                      placeholder="Nhập mã (Ví dụ: GIAM10K)..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 uppercase font-semibold"
                    />
                    <button
                      type="submit"
                      className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-4 rounded-xl transition cursor-pointer"
                    >
                      Áp dụng
                    </button>
                  </form>
                )}

                {couponError && <p className="text-red-500 text-xs font-semibold mt-2">{couponError}</p>}
                {couponSuccess && <p className="text-green-600 text-xs font-semibold mt-2">{couponSuccess}</p>}
              </div>

              {/* Loyalty Reward Points Box */}
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-950 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Tích điểm thưởng (Rewards)</span>
                  </span>
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-800">
                    1 điểm = 100đ
                  </span>
                </div>

                <div className="pt-1">
                  <p className="text-xs font-extrabold text-emerald-900">
                    Điểm khả dụng: <strong className="text-emerald-700 font-black text-sm">{Math.max(0, (orders || []).filter(o => String(o.userId) === String(currentUser?.id) || (currentUser && o.customerName === currentUser.fullName)).length - Number(localStorage.getItem(`foxstyle_redeemed_points_${currentUser?.id || currentUser?.username || 'guest'}`) || 0))} điểm</strong> ({(Math.max(0, (orders || []).filter(o => String(o.userId) === String(currentUser?.id) || (currentUser && o.customerName === currentUser.fullName)).length - Number(localStorage.getItem(`foxstyle_redeemed_points_${currentUser?.id || currentUser?.username || 'guest'}`) || 0)) * 100).toLocaleString('vi-VN')}đ)
                  </p>
                  <p className="text-[10px] text-emerald-700 font-medium mt-1">
                    💡 Đổi điểm giảm giá trực tiếp vào sản phẩm ở bước Thanh Toán (Mỗi đơn hàng thành công = +1 điểm thưởng).
                  </p>
                </div>
              </div>

              {/* Order Calculations Summary */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
                <h3 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-3">Tóm tắt đơn hàng</h3>

                <div className="space-y-3 text-sm text-gray-600 font-semibold">
                  <div className="flex justify-between">
                    <span>Tạm tính</span>
                    <span className="text-gray-900 font-bold">{subtotal.toLocaleString('vi-VN')}đ</span>
                  </div>

                  <div className="flex justify-between">
                    <span>Phí vận chuyển</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600 font-bold">Miễn phí</span>
                      ) : (
                        `${shipping.toLocaleString('vi-VN')}đ`
                      )}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-red-600 font-bold">
                      <span>Mã giảm giá ({appliedCoupon?.code})</span>
                      <span>-{discount.toLocaleString('vi-VN')}đ</span>
                    </div>
                  )}

                  <div className="border-t border-gray-100 pt-3 flex justify-between items-center text-base">
                    <span className="font-bold text-gray-900">Tổng thanh toán</span>
                    <span className="text-2xl font-extrabold text-orange-600">
                      {total.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>

                <button
                  disabled={cart.length === 0}
                  onClick={handleProceedToCheckout}
                  className={`w-full py-4 rounded-xl font-bold transition shadow-md flex items-center justify-center space-x-2 ${
                    cart.length > 0
                      ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white hover:from-orange-600 hover:to-pink-700 cursor-pointer"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <span>Tiến hành thanh toán</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
