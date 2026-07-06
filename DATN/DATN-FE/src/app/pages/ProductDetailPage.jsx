import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { Star, ShoppingCart, Heart, Minus, Plus, MessageSquare, Send, Calendar, ShieldAlert } from "lucide-react";
import { useApp } from "../context/AppContext";

export function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, wishlist, toggleWishlist, addToCart, reviews, addReview, currentUser } = useApp();

  const product = products.find((p) => p.id === Number(id));
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Review Form States
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewError, setReviewError] = useState("");

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Không tìm thấy sản phẩm</h1>
        <Link to="/products" className="text-orange-600 hover:underline font-semibold">
          Quay lại danh sách sản phẩm
        </Link>
      </div>
    );
  }

  // Get reviews for this product
  const productReviews = reviews.filter((r) => r.productId === product.id);

  // Get related products (same category, different ID)
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const isLiked = wishlist.includes(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!selectedColor) {
      alert("Vui lòng chọn màu sắc sản phẩm!");
      return;
    }
    if (!selectedSize) {
      alert("Vui lòng chọn kích thước (size) sản phẩm!");
      return;
    }
    addToCart(product, selectedSize, selectedColor, quantity);
    alert(`Đã thêm ${quantity} x ${product.name} (Màu: ${selectedColor}, Size: ${selectedSize}) vào giỏ hàng!`);
  };

  const handleBuyNow = () => {
    if (!selectedColor) {
      alert("Vui lòng chọn màu sắc sản phẩm!");
      return;
    }
    if (!selectedSize) {
      alert("Vui lòng chọn kích thước (size) sản phẩm!");
      return;
    }
    addToCart(product, selectedSize, selectedColor, quantity);
    navigate("/cart");
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    setReviewError("");

    if (!currentUser) {
      setReviewError("Bạn cần đăng nhập để viết đánh giá!");
      return;
    }
    if (!reviewComment.trim()) {
      setReviewError("Vui lòng điền nội dung bình luận!");
      return;
    }

    addReview(product.id, reviewRating, reviewComment);
    setReviewComment("");
    alert("Đánh giá sản phẩm thành công!");
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-orange-600 transition font-medium">Trang chủ</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-orange-600 transition font-medium">Sản phẩm</Link>
          <span>/</span>
          <span className="text-gray-900 font-semibold truncate max-w-[200px]">{product.name}</span>
        </div>

        {/* Product Details Grid */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* Image Block */}
          <div className="relative rounded-2xl overflow-hidden aspect-square bg-gray-50 border border-gray-100 flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {discount > 0 && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1.5 rounded-xl text-sm font-extrabold shadow-md">
                -{discount}% OFF
              </div>
            )}
          </div>

          {/* Info Block */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              <span className="text-xs uppercase font-extrabold tracking-wider text-orange-500 mb-2 block">
                {product.category}
              </span>
              <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-2 leading-tight">
                {product.name}
              </h1>

              {/* Rating & Review counter */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-lg text-sm font-bold">
                  <span className="mr-1.5">{product.rating}</span>
                  <Star className="h-4 w-4 fill-current text-yellow-500" />
                </div>
                <span className="text-gray-400 text-sm">|</span>
                <span className="text-gray-500 text-sm font-medium flex items-center">
                  <MessageSquare className="h-4 w-4 mr-1.5 text-gray-400" />
                  {productReviews.length} Đánh giá
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline space-x-3 mb-6 bg-gray-50 p-4 rounded-2xl">
                <span className="text-3xl font-extrabold text-orange-600">
                  {product.price.toLocaleString('vi-VN')}đ
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">
                    {product.originalPrice.toLocaleString('vi-VN')}đ
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Colors selector */}
              <div className="mb-4">
                <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Chọn màu sắc</span>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 text-sm font-semibold rounded-xl border transition ${
                        selectedColor === color
                          ? "border-orange-600 bg-orange-50 text-orange-600"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sizes selector */}
              <div className="mb-6">
                <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Chọn Size</span>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-11 h-11 flex items-center justify-center text-sm font-bold rounded-xl border transition ${
                        selectedSize === size
                          ? "border-orange-600 bg-orange-50 text-orange-600"
                          : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Số lượng:</span>
                <div className="flex items-center border border-gray-300 rounded-xl bg-white shadow-sm overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-3 hover:bg-gray-50 transition text-gray-500"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-5 font-bold text-gray-800 text-sm">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-3 hover:bg-gray-50 transition text-gray-500"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                {/* Stock indicator */}
                <span className="text-xs text-gray-400 font-semibold">
                  (Còn {product.quantity || 50} sản phẩm trong kho)
                </span>
              </div>
            </div>

            {/* Actions Panel */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center space-x-2 border-2 border-orange-600 text-orange-600 py-3.5 rounded-xl font-bold hover:bg-orange-50 shadow-sm transition"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Thêm vào giỏ hàng</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 bg-gradient-to-r from-orange-500 to-pink-600 text-white py-3.5 rounded-xl font-bold hover:from-orange-600 hover:to-pink-700 shadow-md transition"
              >
                Mua ngay
              </button>

              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3.5 rounded-xl border flex items-center justify-center transition ${
                  isLiked
                    ? "bg-red-50 border-red-200 text-red-500"
                    : "border-gray-200 text-gray-400 hover:text-red-500 hover:bg-red-50/20"
                }`}
                title="Lưu yêu thích"
              >
                <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
              </button>
            </div>

            {/* Extra product specification specs */}
            <div className="pt-6 grid grid-cols-2 gap-4 text-xs font-semibold text-gray-500 bg-gray-50 p-4 rounded-2xl">
              <div>Chất liệu: <span className="text-gray-900">{product.material}</span></div>
              <div>Xuất xứ: <span className="text-gray-900">{product.origin}</span></div>
            </div>

          </div>
        </div>

        {/* Reviews and Comment Writing Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-8 mb-12">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6 flex items-center">
            <MessageSquare className="h-5 w-5 mr-2 text-orange-600" />
            <span>Đánh Giá Khách Hàng ({productReviews.length})</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Reviews list */}
            <div className="lg:col-span-2 space-y-4">
              {productReviews.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-500 text-sm">
                  Chưa có đánh giá nào cho sản phẩm này. Hãy là người đầu tiên đánh giá!
                </div>
              ) : (
                productReviews.map((rev) => (
                  <div key={rev.id} className="border border-gray-100 p-5 rounded-2xl space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                          {rev.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{rev.userName}</p>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < rev.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-400 font-semibold flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {rev.date}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm pl-10 leading-relaxed font-medium">
                      {rev.comment}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Write a review box */}
            <div className="lg:col-span-1 bg-gray-50 p-6 rounded-2xl border border-gray-100 h-fit">
              <h3 className="font-bold text-gray-800 mb-4 text-base">Viết đánh giá của bạn</h3>
              
              {currentUser ? (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  {reviewError && (
                    <div className="bg-red-100 text-red-700 p-2 rounded text-xs font-semibold">
                      {reviewError}
                    </div>
                  )}

                  {/* Rating Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Đánh giá sao</label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewRating(star)}
                          className="p-1 hover:scale-110 transition text-yellow-400"
                        >
                          <Star className={`h-6 w-6 ${star <= reviewRating ? "fill-yellow-400" : "text-gray-300"}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comment Area */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Bình luận</label>
                    <textarea
                      required
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Nhập cảm nhận của bạn về sản phẩm..."
                      rows={4}
                      className="w-full bg-white px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-orange-600 text-white py-2 rounded-lg font-bold hover:bg-orange-700 shadow flex items-center justify-center space-x-2 text-sm transition"
                  >
                    <Send className="h-4 w-4" />
                    <span>Gửi bình luận</span>
                  </button>
                </form>
              ) : (
                <div className="text-center py-6 text-gray-500 text-xs font-semibold">
                  <ShieldAlert className="h-10 w-10 mx-auto text-orange-400 mb-2" />
                  Bạn cần đăng nhập để viết bình luận.
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Sản phẩm tương tự</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => {
                const isRelLiked = wishlist.includes(relatedProduct.id);
                return (
                  <div key={relatedProduct.id} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:border-orange-100 transition-all duration-300 relative flex flex-col h-full">
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <Link to={`/products/${relatedProduct.id}`}>
                        <img
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        />
                      </Link>

                      {/* Wishlist Heart Icon */}
                      <button
                        onClick={() => toggleWishlist(relatedProduct.id)}
                        className={`absolute top-3 left-3 p-2 rounded-full backdrop-blur-md shadow-sm transition hover:scale-110 ${
                          isRelLiked ? "bg-red-500 text-white" : "bg-white/80 text-gray-600 hover:text-red-500"
                        }`}
                      >
                        <Heart className="h-4 w-4 fill-current" />
                      </button>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <span className="text-[10px] uppercase font-extrabold tracking-wider text-orange-500 mb-1">{relatedProduct.category}</span>
                      <Link to={`/products/${relatedProduct.id}`} className="font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition truncate block">
                        {relatedProduct.name}
                      </Link>
                      
                      <div className="flex items-center space-x-1.5 mb-3">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < Math.floor(relatedProduct.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">({relatedProduct.reviews})</span>
                      </div>

                      <div className="flex items-baseline space-x-2 mt-auto">
                        <span className="text-lg font-extrabold text-orange-600">
                          {relatedProduct.price.toLocaleString('vi-VN')}đ
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
