import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { Heart, ShoppingBag, Trash2, ShoppingCart, Sparkles, Filter, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { api } from "../services/api";
import { getProductPricing } from "../utils/pricing";

export function WishlistPage() {
  const navigate = useNavigate();
  const { products = [], wishlist = [], wishlistProductSnapshots = [], toggleWishlist, clearWishlist, addToCart } = useApp();

  const [activeCategory, setActiveCategory] = useState("all");
  const [recoveredProducts, setRecoveredProducts] = useState([]);

  useEffect(() => {
    const unresolvedIds = wishlist.filter((wishlistId) =>
      !products.some((product) => String(product.id) === String(wishlistId)) &&
      !wishlistProductSnapshots.some((product) => String(product.id) === String(wishlistId))
    );

    if (unresolvedIds.length === 0) {
      setRecoveredProducts([]);
      return;
    }

    let cancelled = false;
    Promise.all(
      unresolvedIds.map(async (wishlistId) => {
        try {
          const response = await api.products.getById(wishlistId);
          const data = response?.data || response;
          if (data) {
            return {
              ...data,
              id: data.productId ?? data.id ?? wishlistId,
              name: data.productName || data.name || `Sản phẩm #${wishlistId}`,
              image: data.imageUrl || data.image || data.images?.[0]?.imageUrl,
              price: Number(data.price || 0),
              originalPrice: data.originalPrice ? Number(data.originalPrice) : undefined,
              category: data.category || "ao",
              sizes: data.sizes || data.variants?.map((variant) => variant.size).filter(Boolean) || [],
              colors: data.colors || data.variants?.map((variant) => variant.color).filter(Boolean) || [],
            };
          }
        } catch (error) {
          console.warn(`Không thể khôi phục sản phẩm yêu thích ${wishlistId}:`, error);
        }

        return {
          id: wishlistId,
          name: `Sản phẩm yêu thích #${wishlistId}`,
          image: "/image_san_pham/photo-1521572163474-6864f9cf17ab.jpg",
          price: 0,
          category: "ao",
          sizes: ["M"],
          colors: ["Mặc định"],
          quantity: 1,
        };
      })
    ).then((items) => {
      if (!cancelled) setRecoveredProducts(items.filter(Boolean));
    });

    return () => {
      cancelled = true;
    };
  }, [products, wishlist, wishlistProductSnapshots]);

  // Find all products in wishlist
  const likedProducts = useMemo(() => {
    return wishlist
      .map((wishlistId) =>
        products.find((product) => String(product.id) === String(wishlistId)) ||
        wishlistProductSnapshots.find((product) => String(product.id) === String(wishlistId)) ||
        recoveredProducts.find((product) => String(product.id) === String(wishlistId))
      )
      .filter(Boolean);
  }, [products, wishlist, wishlistProductSnapshots, recoveredProducts]);

  // Filtered by category tab
  const filteredProducts = useMemo(() => {
    if (activeCategory === "all") return likedProducts;
    if (activeCategory === "combo") {
      return likedProducts.filter(p => p.isCombo || p.category === "combo" || (p.name && p.name.includes("[SET COMBO]")));
    }
    return likedProducts.filter(p => {
      const cat = (p.category || "").toLowerCase();
      if (activeCategory === "ao") return cat.includes("ao") || cat.includes("áo");
      if (activeCategory === "quan") return cat.includes("quan") || cat.includes("quần") || cat.includes("jean");
      if (activeCategory === "vay") return cat.includes("vay") || cat.includes("đầm") || cat.includes("váy");
      if (activeCategory === "phukien") return cat.includes("phukien") || cat.includes("phụ kiện");
      return true;
    });
  }, [likedProducts, activeCategory]);

  // Calculate total value of wishlist
  const totalValue = useMemo(() => {
    return likedProducts.reduce((sum, p) => sum + (p.price || 0), 0);
  }, [likedProducts]);

  const handleAddAllToCart = async () => {
    if (likedProducts.length === 0) return;
    let addedCount = 0;
    for (const p of likedProducts) {
      const defaultSize = p.sizes && p.sizes.length > 0 ? p.sizes[0] : (p.isCombo ? "Freesize / Đủ Size" : "M");
      const defaultColor = p.colors && p.colors.length > 0 ? p.colors[0] : (p.isCombo ? "Chuẩn Set" : "Mặc định");
      await addToCart(p, defaultSize, defaultColor, 1);
      addedCount++;
    }
    toast.success(`🎉 Đã thêm thành công ${addedCount} sản phẩm yêu thích vào giỏ hàng!`);
  };

  const handleClearAll = () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ sản phẩm khỏi danh sách yêu thích?")) {
      clearWishlist();
      toast.info("Đã dọn dẹp toàn bộ danh sách yêu thích!");
    }
  };

  const handleAddToCartSingle = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : (product.isCombo ? "Freesize / Đủ Size" : "M");
    const defaultColor = product.colors && product.colors.length > 0 ? product.colors[0] : (product.isCombo ? "Chuẩn Set" : "Mặc định");
    await addToCart(product, defaultSize, defaultColor, 1);
    toast.success(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  return (
    <div className="min-h-screen bg-gray-50/70 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Hero Banner */}
        <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-orange-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-orange-500/20 to-transparent pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-400/30 text-orange-300 text-xs font-bold mb-3">
                <Heart className="h-3.5 w-3.5 text-orange-400 fill-orange-400 animate-pulse" />
                <span>Bộ sưu tập yêu thích của bạn</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight">Sản phẩm yêu thích ({likedProducts.length})</h1>
              <p className="mt-2 text-zinc-300 text-xs sm:text-sm max-w-xl leading-relaxed">
                Lưu giữ những mẫu thời trang cao cấp phom dáng hoàn hảo để sẵn sàng mua sắm bất cứ lúc nào.
              </p>
            </div>

            {likedProducts.length > 0 && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                <button
                  onClick={handleAddAllToCart}
                  className="px-6 py-3.5 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 text-white text-xs font-black rounded-2xl shadow-lg hover:shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <ShoppingCart className="h-4 w-4" />
                  <span>Thêm tất cả vào giỏ ({totalValue.toLocaleString("vi-VN")}đ)</span>
                </button>
                <button
                  onClick={handleClearAll}
                  className="px-4 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold rounded-2xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Xóa tất cả"
                >
                  <Trash2 className="h-4 w-4 text-zinc-300" />
                  <span className="hidden sm:inline">Xóa tất cả</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Filter Categories Bar */}
        {likedProducts.length > 0 && (
          <div className="flex items-center justify-between flex-wrap gap-4 bg-white p-4 rounded-2xl border border-gray-150 shadow-2xs">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mr-1 flex items-center gap-1 shrink-0">
                <Filter className="h-3.5 w-3.5" /> Phân loại:
              </span>
              {[
                { id: "all", label: `Tất cả (${likedProducts.length})` },
                { id: "ao", label: "Áo Nam" },
                { id: "quan", label: "Quần Nam" },
                { id: "vay", label: "Đầm Váy" },
                { id: "combo", label: "Set Combo" },
                { id: "phukien", label: "Phụ Kiện" }
              ].map((tab) => {
                const isSelected = activeCategory === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? "bg-zinc-900 text-white shadow-xs"
                        : "bg-gray-100/80 text-gray-600 hover:bg-gray-200/80"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="text-xs text-gray-500 font-semibold">
              Hiển thị <strong className="text-zinc-900">{filteredProducts.length}</strong> sản phẩm
            </div>
          </div>
        )}

        {/* Content Display */}
        {likedProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-150 shadow-sm p-12 sm:p-16 text-center max-w-lg mx-auto">
            <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-orange-100">
              <Heart className="h-10 w-10 text-orange-500 fill-orange-100" />
            </div>
            <h3 className="text-xl font-black text-zinc-900 mb-2">Danh sách yêu thích đang trống</h3>
            <p className="text-gray-500 text-xs leading-relaxed max-w-sm mx-auto mb-8">
              Bạn chưa lưu sản phẩm nào. Hãy thả tim các mẫu trang phục hoặc Set Combo yêu thích để xem lại sau nhé!
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-black transition-all shadow-md"
              >
                <ShoppingBag className="h-4 w-4 mr-2" />
                Khám phá Sản phẩm
              </Link>
              <Link
                to="/products?category=combo"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-black transition-all shadow-md"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Xem Set Combo Tiết Kiệm
              </Link>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
            <p className="text-gray-500 text-sm">Không có sản phẩm yêu thích nào thuộc danh mục này.</p>
            <button
              onClick={() => setActiveCategory("all")}
              className="mt-3 text-xs font-bold text-orange-600 underline"
            >
              Xem tất cả ({likedProducts.length})
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const isCombo = product.isCombo || product.category === "combo" || (product.name && product.name.includes("[SET COMBO]"));
              const pricing = getProductPricing(product);
              const hasDiscount = pricing.hasDiscount;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl border border-gray-150 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group relative"
                >
                  {/* Image Container */}
                  <div className="relative aspect-4/5 overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1 pointer-events-none">
                      {isCombo ? (
                        <span className="bg-gradient-to-r from-orange-600 to-amber-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg shadow-sm">
                          🎁 SET COMBO
                        </span>
                      ) : hasDiscount ? (
                        <span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg shadow-sm">
                          -{pricing.discountPercent}%
                        </span>
                      ) : (
                        <span />
                      )}

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          toggleWishlist(product);
                          toast.info(`Đã bỏ ${product.name} khỏi danh sách yêu thích!`);
                        }}
                        className="pointer-events-auto p-2 bg-white/90 hover:bg-white text-red-500 rounded-full shadow-md transition hover:scale-110 cursor-pointer"
                        title="Bỏ khỏi yêu thích"
                      >
                        <Heart className="h-4 w-4 fill-red-500" />
                      </button>
                    </div>

                    {/* Hover Overlay Button */}
                    <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => handleAddToCartSingle(e, product)}
                        className="w-full py-3 bg-zinc-900/95 hover:bg-zinc-950 text-white rounded-2xl font-bold text-xs shadow-lg flex items-center justify-center gap-2 backdrop-blur-xs cursor-pointer"
                      >
                        <ShoppingCart className="h-4 w-4 text-orange-400" />
                        <span>Thêm vào giỏ nhanh</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block mb-1">
                        {product.brand || (isCombo ? "Gói Combo Phối Sẵn" : "FoxStyle Premium")}
                      </span>
                      <Link
                        to={`/products/${product.id}`}
                        className="font-bold text-zinc-900 text-sm hover:text-orange-600 transition line-clamp-2 leading-snug"
                      >
                        {product.name}
                      </Link>
                    </div>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                      <div>
                        <div className="text-base font-extrabold text-orange-600">
                          {product.price ? `${product.price.toLocaleString("vi-VN")}đ` : "Liên hệ"}
                        </div>
                        {hasDiscount && (
                          <div className="text-xs text-gray-400 line-through">
                            {pricing.originalPrice.toLocaleString("vi-VN")}đ
                          </div>
                        )}
                      </div>

                      <button
                        onClick={(e) => handleAddToCartSingle(e, product)}
                        className="p-2.5 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-xl transition cursor-pointer"
                        title="Thêm vào giỏ hàng"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
