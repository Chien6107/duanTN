import React from "react";
import { Link } from "react-router";
import { Heart, Star, ArrowRight, Ban } from "lucide-react";
import { getProductPricing } from "../utils/pricing";

const categoryNames = {
  "ao": "Áo Nam & Oversize",
  "quan": "Quần Nam & Denim",
  "vay": "Đầm Váy Thời Trang",
  "ao-khoac": "Áo Khoác & Blazer",
  "giay": "Giày & Sneaker",
  "phu-kien": "Phụ Kiện Thời Trang"
};

export function ProductCard({ product, wishlist = [], toggleWishlist }) {
  const isLiked = wishlist.some((wId) => String(wId) === String(product.id));
  const { originalPrice, discountPercent: discount, hasDiscount } = getProductPricing(product);

  const categoryLabel = categoryNames[product.category] || product.category || "FoxStyle";

  const isStoppedSelling = product.status === 0 || product.status === "0" || product.status === false || product.status === "Ngừng bán" || product.status === "INACTIVE" || product.status === "STOPPED" || product.status === "DISCONTINUED";
  const isOutOfStock = Number(product.quantity ?? 0) <= 0;
  const isComboProduct = product.isCombo || product.category === "combo" || (product.description && product.description.includes("[COMBO:"));

  return (
    <div className={`group relative flex h-full flex-col overflow-hidden bg-white rounded-3xl shadow-sm border border-zinc-200/90 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-orange-300 ${
      isStoppedSelling ? "opacity-90 grayscale-[20%]" : ""
    }`}>
      
      {/* Image Thumbnail Container - Studio Clean Frame */}
      <div className="relative aspect-[4/5] overflow-hidden bg-white flex items-center justify-center border-b border-zinc-100">
        <Link to={`/products/${product.id}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = "/image_san_pham/photo-1521572163474-6864f9cf17ab.jpg";
            }}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-108"
          />
        </Link>

        {/* Stopped Selling Watermark Overlay */}
        {isStoppedSelling && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex flex-col items-center justify-center text-white p-3 text-center pointer-events-none">
            <Ban className="h-8 w-8 text-red-400 mb-1" />
            <span className="text-xs font-black uppercase tracking-wider text-red-200 bg-red-950/80 border border-red-500/40 px-3 py-1 rounded-full">
              Ngừng bán
            </span>
          </div>
        )}

        {/* Wishlist Heart Button */}
        {toggleWishlist && (
          <button
            onClick={() => toggleWishlist(product)}
            className={`absolute right-3.5 top-3.5 z-10 flex h-9 w-9 items-center justify-center rounded-2xl backdrop-blur-md transition-all duration-200 shadow-sm hover:scale-110 cursor-pointer ${
              isLiked
                ? "bg-red-500 text-white shadow-red-500/30"
                : "bg-white/85 text-zinc-700 hover:text-red-500 border border-zinc-200"
            }`}
            aria-label={isLiked ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
          >
            <Heart className={`h-4 w-4 transition-transform duration-200 ${isLiked ? "fill-current scale-110" : ""}`} />
          </button>
        )}

        {/* Combo / Discount Badge */}
        {isComboProduct ? (
          <div className="absolute left-3.5 top-3.5 bg-gradient-to-r from-orange-600 to-amber-500 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white rounded-xl shadow-md flex items-center gap-1">
            <span>🎁 SET COMBO</span>
            {discount > 0 && <span>-{discount}%</span>}
          </div>
        ) : hasDiscount && !isStoppedSelling && (
          <div className="absolute left-3.5 top-3.5 bg-gradient-to-r from-red-600 to-orange-500 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-white rounded-xl shadow-md">
            -{discount}% OFF
          </div>
        )}

        {/* Product detail hover overlay */}
        <div className="absolute bottom-3.5 left-3.5 right-3.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 pointer-events-none">
          <Link
            to={`/products/${product.id}`}
            className="pointer-events-auto w-full bg-zinc-950/85 backdrop-blur-md text-white font-extrabold text-[11px] uppercase tracking-wider py-2.5 px-3 rounded-2xl flex items-center justify-center gap-2 shadow-xl hover:bg-orange-600 transition-all duration-200"
          >
            <span>Xem Chi Tiết</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Product Information Body */}
      <div className="flex flex-1 flex-col p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-100">
            {categoryLabel}
          </span>

          {/* Status / Quantity Pill */}
          {isStoppedSelling ? (
            <span className="text-[10px] font-black uppercase tracking-wider bg-red-900 text-white px-2.5 py-0.5 rounded-full shadow-xs">
              Ngừng bán
            </span>
          ) : isOutOfStock ? (
            <span className="text-[10px] font-black uppercase tracking-wider bg-zinc-800 text-zinc-200 px-2.5 py-0.5 rounded-full">
              Hết hàng
            </span>
          ) : (
            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
              product.quantity <= 5
                ? "bg-amber-50 text-amber-700 border border-amber-200"
                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
            }`}>
              {product.quantity <= 5 ? `Còn ${product.quantity}` : "Sẵn kho"}
            </span>
          )}
        </div>

        <Link
          to={`/products/${product.id}`}
          className="font-extrabold text-sm leading-snug text-zinc-900 line-clamp-2 hover:text-orange-600 transition min-h-[40px]"
        >
          {product.name}
        </Link>

        {/* Rating Stars */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.floor(product.rating || 5) ? "fill-current text-amber-400" : "text-zinc-200"
                }`}
              />
            ))}
          </div>
          <span className="text-[11px] font-bold text-zinc-400">({product.reviews || 12})</span>
        </div>

        {/* Price Section */}
        <div className="pt-2 border-t border-zinc-100 mt-auto flex items-baseline justify-between">
          <div>
            <span className={`text-base font-black ${isStoppedSelling ? "text-zinc-400 line-through" : "text-orange-600"}`}>
              {product.price?.toLocaleString("vi-VN")}đ
            </span>
            {hasDiscount && !isStoppedSelling && (
              <span className="text-xs font-bold text-zinc-400 line-through ml-2">
                {originalPrice.toLocaleString("vi-VN")}đ
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
