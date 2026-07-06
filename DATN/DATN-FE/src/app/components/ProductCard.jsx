import React from "react";
import { Link } from "react-router";
import { Heart, Star } from "lucide-react";

export function ProductCard({ product, wishlist = [], toggleWishlist }) {
  const isLiked = wishlist.includes(product.id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group relative flex h-full flex-col overflow-hidden bg-white shadow-sm ring-1 ring-zinc-200/80 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/5] overflow-hidden bg-zinc-100">
        <Link to={`/products/${product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>

        {toggleWishlist && (
          <button
            onClick={() => toggleWishlist(product.id)}
            className={`absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full backdrop-blur transition hover:scale-105 ${
              isLiked ? "bg-red-600 text-white" : "bg-white/90 text-zinc-700 hover:text-red-600"
            }`}
            aria-label={isLiked ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
          >
            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
          </button>
        )}

        {discount > 0 && (
          <div className="absolute left-3 top-3 bg-zinc-950 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-white">
            -{discount}%
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <span className="mb-2 text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">{product.category}</span>
        <Link to={`/products/${product.id}`} className="mb-2 block min-h-12 font-black leading-6 text-zinc-950 transition group-hover:text-amber-700">
          {product.name}
        </Link>

        <div className="mb-4 flex items-center gap-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 flex-none ${
                  i < Math.floor(product.rating)
                    ? "fill-amber-400 text-amber-400"
                    : "text-zinc-200"
                }`}
              />
            ))}
          </div>
          <span className="text-xs font-semibold text-zinc-400">({product.reviews})</span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3">
          <div>
            <span className="block text-lg font-black text-zinc-950">
              {product.price.toLocaleString("vi-VN")}đ
            </span>
            {product.originalPrice && (
              <span className="text-sm font-medium text-zinc-400 line-through">
                {product.originalPrice.toLocaleString("vi-VN")}đ
              </span>
            )}
          </div>

          {product.quantity !== undefined && (
            <span className={`shrink-0 px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] ${
              product.quantity <= 0
                ? "bg-red-50 text-red-700"
                : product.quantity <= 5
                ? "bg-amber-50 text-amber-700"
                : "bg-emerald-50 text-emerald-700"
            }`}>
              {product.quantity <= 0
                ? "Hết hàng"
                : product.quantity <= 5
                ? `Còn ${product.quantity}`
                : "Còn hàng"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
