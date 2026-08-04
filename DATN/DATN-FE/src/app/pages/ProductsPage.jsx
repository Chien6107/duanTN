import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Filter, SlidersHorizontal, Grid3X3, ArrowUpDown, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { ProductCard } from "../components/ProductCard";
import { Toolbar } from "../components/Toolbar";
import { Pagination } from "../components/Pagination";
import { hasValidProductDiscount } from "../utils/pricing";

const normalizeSearchText = (value = "") =>
  String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();

const normalizeBrandName = (value = "") => {
  const normalized = normalizeSearchText(value);
  return normalized === "nike football & wear" ? "nike wear" : normalized;
};

export function ProductsPage() {
  const { products, categories, wishlist, toggleWishlist, currentUser, orders = [] } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const vipOnly = searchParams.get("vip") === "true";
  const userOrderCount = orders.filter(
    (order) => String(order.userId) === String(currentUser?.id)
  ).length;
  const isVipCustomer = Boolean(currentUser) && userOrderCount >= 3;

  // Filter & Search States
  const [categoryFilter, setCategoryFilter] = useState("");
  const [brandFilter, setBrandFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [maxPriceValue, setMaxPriceValue] = useState("");
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [saleOnly, setSaleOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Load active brands for filter dropdown
  const loadBrands = () => {
    try {
      const saved = localStorage.getItem("foxstyle_admin_brands");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.filter(b => Number(b.status ?? 1) !== 0);
        }
      }
    } catch (e) {}
    return [
      { name: "FoxStyle Premium" },
      { name: "Zara" },
      { name: "Uniqlo" },
      { name: "Nike Wear" }
    ];
  };
  const [brandsList, setBrandsList] = useState(loadBrands);

  useEffect(() => {
    const refreshBrands = () => setBrandsList(loadBrands());
    const handleContentUpdate = (event) => {
      if (!event.detail?.type || event.detail.type === "brands") refreshBrands();
    };
    window.addEventListener("storage", refreshBrands);
    window.addEventListener("foxstyle-content-updated", handleContentUpdate);
    return () => {
      window.removeEventListener("storage", refreshBrands);
      window.removeEventListener("foxstyle-content-updated", handleContentUpdate);
    };
  }, []);

  // Sync state with URL params
  useEffect(() => {
    const cat = searchParams.get("category") || "";
    setCategoryFilter(cat);

    const brand = searchParams.get("brand") || "";
    setBrandFilter(brand);

    const sale = searchParams.get("sale") === "true" || searchParams.get("vip") === "true";
    setSaleOnly(sale);

    const search = searchParams.get("search") || "";
    setSearchQuery(search);
  }, [searchParams]);

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    setSearchParams(params => {
      if (val) params.set("search", val);
      else params.delete("search");
      return params;
    });
  };

  const handleCategoryChange = (val) => {
    setCategoryFilter(val);
    setSearchParams(params => {
      if (val) params.set("category", val);
      else params.delete("category");
      return params;
    });
  };

  const handleBrandChange = (val) => {
    setBrandFilter(val);
    setSearchParams(params => {
      if (val) params.set("brand", val);
      else params.delete("brand");
      return params;
    });
  };

  const handleSaleChange = (val) => {
    setSaleOnly(val);
    setSearchParams(params => {
      if (val) params.set("sale", "true");
      else params.delete("sale");
      return params;
    });
  };

  const toggleColor = (color) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const toggleSize = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const resetFilters = () => {
    setCategoryFilter("");
    setBrandFilter("");
    setPriceFilter("all");
    setMaxPriceValue("");
    setSelectedColors([]);
    setSelectedSizes([]);
    setSaleOnly(false);
    setSearchQuery("");
    setSortBy("default");
    setSearchParams({});
    setCurrentPage(1);
  };

  // Filter products for customer catalog
  let filtered = products.filter((prod) => {
    if (searchQuery.trim()) {
      const q = normalizeSearchText(searchQuery);
      const matchName = normalizeSearchText(prod.name).includes(q);
      const matchDesc = normalizeSearchText(prod.description).includes(q);
      const matchMat = normalizeSearchText(prod.material).includes(q);
      const matchBrand = normalizeSearchText(prod.brand).includes(q);
      const matchCategory = normalizeSearchText(prod.category).includes(q);
      const isComboSearch = (q.includes("combo") || q.includes("set") || q.includes("bộ")) && (prod.isCombo || prod.category === "combo" || (prod.description && prod.description.includes("[COMBO:")));
      if (!matchName && !matchDesc && !matchMat && !matchBrand && !matchCategory && !isComboSearch) return false;
    }

    if (brandFilter) {
      const selectedBrand = normalizeBrandName(brandFilter);
      const productBrand = normalizeBrandName(prod.brand || prod.brandName);
      if (productBrand !== selectedBrand) return false;
    }


    if (maxPriceValue && Number(maxPriceValue) > 0) {
      if ((prod.price || 0) > Number(maxPriceValue)) return false;
    }

    if (categoryFilter) {
      if (categoryFilter === "combo" || categoryFilter === "set-combo") {
        const isCombo = prod.isCombo || prod.category === "combo" || (prod.name && (prod.name.includes("[SET COMBO]") || prod.name.toLowerCase().includes("combo"))) || (prod.description && prod.description.includes("[COMBO:"));
        if (!isCombo) return false;
      } else {
        const isCombo = prod.isCombo || prod.category === "combo" || (prod.name && prod.name.includes("[SET COMBO]")) || (prod.description && prod.description.includes("[COMBO:"));
        if (isCombo) return false;

        const isNumeric = /^\d+$/.test(categoryFilter);
        if (isNumeric) {
          const catObj = categories.find(c => String(c.id) === String(categoryFilter));
          if (catObj) {
            if (catObj.name && catObj.name.toLowerCase().includes("combo")) {
              const isCombo = prod.isCombo || prod.category === "combo" || (prod.name && (prod.name.includes("[SET COMBO]") || prod.name.toLowerCase().includes("combo"))) || (prod.description && prod.description.includes("[COMBO:"));
              if (!isCombo) return false;
            } else if (prod.categoryId !== undefined && prod.categoryId !== null) {
              if (prod.categoryId !== parseInt(categoryFilter)) {
                return false;
              }
            } else {
              const nameLower = (catObj.name || "").toLowerCase();
              let parentCode = "phu-kien";
              if (nameLower.includes("áo khoác") || nameLower.includes("blazer") || nameLower.includes("jacket")) parentCode = "ao-khoac";
              else if (nameLower.includes("giày") || nameLower.includes("dép") || nameLower.includes("sneaker")) parentCode = "giay";
              else if (nameLower.includes("áo")) parentCode = "ao";
              else if (nameLower.includes("quần")) parentCode = "quan";
              else if (nameLower.includes("váy") || nameLower.includes("đầm") || nameLower.includes("chân váy")) parentCode = "vay";
              
              if (prod.category !== parentCode) {
                return false;
              }
            }
          } else {
            return false;
          }
        } else {
          if (prod.category !== categoryFilter) return false;
        }
      }
    } else {
      // Default view on /products: Exclude combo products unless user explicitly searches for them
      const isCombo = prod.isCombo || prod.category === "combo" || (prod.name && prod.name.includes("[SET COMBO]")) || (prod.description && prod.description.includes("[COMBO:"));
      if (isCombo && !searchQuery.trim()) return false;
    }

    if (priceFilter !== "all") {
      const price = Number(prod.price || 0);
      if (priceFilter === "under-300" || priceFilter === "under-200") {
        if (price >= 300000) return false;
      } else if (priceFilter === "300-500" || priceFilter === "200-500") {
        if (price < 300000 || price > 500000) return false;
      } else if (priceFilter === "above-500" || priceFilter === "over-500") {
        if (price <= 500000) return false;
      }
    }

    if (selectedColors.length > 0) {
      const prodColors = Array.isArray(prod.colors) ? prod.colors : [];
      const hasColor = prodColors.some(c => selectedColors.some(sc => String(c || "").toLowerCase().includes(String(sc || "").toLowerCase())));
      if (!hasColor) return false;
    }

    if (selectedSizes.length > 0) {
      const prodSizes = Array.isArray(prod.sizes) ? prod.sizes : [];
      const hasSize = prodSizes.some(s => selectedSizes.includes(String(s)));
      if (!hasSize) return false;
    }

    if (saleOnly && !hasValidProductDiscount(prod)) {
      return false;
    }

    return true;
  });

  // Sort products
  if (sortBy === "default" || !sortBy) {
    filtered.sort((a, b) => b.id - a.id);
  } else if (sortBy === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating-desc") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  // Reset page when filtering
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, brandFilter, priceFilter, selectedColors, selectedSizes, saleOnly, searchQuery, sortBy]);

  // Paginated chunk
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = vipOnly && !isVipCustomer
    ? []
    : filtered.slice(indexOfFirstProduct, indexOfLastProduct);

  const colorsList = ["Trắng", "Đen", "Xám", "Be", "Xanh", "Hồng", "Đỏ", "Vàng"];
  const sizesList = ["S", "M", "L", "XL", "28", "29", "30", "31", "32", "37", "38", "39", "40", "41", "42"];

  // Shared Toolbar Props
  const toolbarProps = {
    searchQuery,
    onSearchChange: handleSearchChange,
    categoryFilter,
    onCategoryChange: handleCategoryChange,
    brandFilter,
    onBrandChange: handleBrandChange,
    brandsList,
    categories,
    priceFilter,
    onPriceChange: setPriceFilter,
    maxPriceValue,
    onMaxPriceChange: setMaxPriceValue,
    selectedColors,
    onColorToggle: toggleColor,
    selectedSizes,
    onSizeToggle: toggleSize,
    saleOnly,
    onSaleToggle: handleSaleChange,
    onReset: resetFilters,
    colorsList,
    sizesList
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/60 via-zinc-50 to-zinc-100 py-8 text-zinc-950 sm:py-10">
      <div className="mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-8 xl:px-10">
        
        {/* Page Header */}
        <div className={`mb-8 flex flex-col gap-4 rounded-3xl border p-5 shadow-sm md:flex-row md:items-center md:justify-between sm:p-7 ${categoryFilter === "combo" || categoryFilter === "set-combo" ? "border-orange-200 bg-gradient-to-r from-zinc-950 via-zinc-900 to-orange-950 text-white" : "border-zinc-200 bg-white"}`}>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-3xl font-extrabold tracking-tight ${categoryFilter === "combo" || categoryFilter === "set-combo" ? "text-white" : "text-zinc-900"}`}>
                {categoryFilter === "combo" || categoryFilter === "set-combo" ? "Set Combo Phối Sẵn" : "Tất Cả Sản Phẩm"}
              </h1>
              {brandFilter && (
                <span className="bg-orange-100 text-orange-700 font-bold text-xs px-3 py-1 rounded-full border border-orange-200">
                  Thương hiệu: {brandFilter}
                </span>
              )}
              {(categoryFilter === "combo" || categoryFilter === "set-combo") && (
                <span className="bg-gradient-to-r from-orange-600 to-amber-500 text-white font-bold text-xs px-3 py-1 rounded-full shadow-xs">
                  🎁 Set Combo Ưu Đãi
                </span>
              )}
            </div>
            <p className={`mt-2 text-xs font-semibold ${categoryFilter === "combo" || categoryFilter === "set-combo" ? "text-orange-100/80" : "text-zinc-500"}`}>
              Tìm thấy {filtered.length} sản phẩm phù hợp
            </p>
          </div>
          
          <div className="flex items-center space-x-3 self-end md:self-auto">
            {/* Sort Dropdown */}
            <div className="relative flex items-center bg-white border border-zinc-300 rounded-xl px-3.5 py-2 text-xs font-bold shadow-xs">
              <ArrowUpDown className="h-4 w-4 text-zinc-500 mr-2" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent focus:outline-none font-semibold text-zinc-800 cursor-pointer"
              >
                <option value="default">Mặc định (Bán chạy)</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
                <option value="rating-desc">Đánh giá cao nhất</option>
              </select>
            </div>

            {/* Mobile Filter Action Button */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="md:hidden flex items-center text-white rounded-xl px-4 py-2 text-xs font-extrabold uppercase shadow bg-orange-600 hover:bg-orange-700"
            >
              <Filter className="h-4 w-4 mr-2" />
              Bộ lọc
            </button>
          </div>
        </div>

        {vipOnly && (
          <div className="mb-8 rounded-3xl border border-amber-300 bg-gradient-to-r from-zinc-950 via-amber-950 to-orange-950 p-7 text-white shadow-xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-amber-300">Đặc quyền Sale VIP</p>
            <h2 className="mt-2 text-2xl font-black">
              {isVipCustomer ? "Ưu đãi riêng của bạn đã được mở khóa" : "Khu vực dành riêng cho khách hàng VIP"}
            </h2>
            <p className="mt-2 max-w-2xl text-sm font-medium text-amber-100/80">
              {isVipCustomer
                ? "Bạn được giảm thêm 5% trên giá sản phẩm khi thanh toán, ngoài ưu đãi đang hiển thị."
                : currentUser
                ? `Bạn đã có ${userOrderCount}/3 đơn hàng. Hoàn thành đủ 3 đơn để mở khóa Sale VIP.`
                : "Vui lòng đăng nhập và hoàn thành tối thiểu 3 đơn hàng để mở khóa Sale VIP."}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[260px_minmax(0,1fr)] xl:gap-8">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden space-y-6 md:block">
            <div className="sticky top-24">
              <Toolbar {...toolbarProps} />
            </div>
          </aside>

          {/* Products Column */}
          <main className="min-w-0 space-y-6">
            {currentProducts.length === 0 ? (
              <div className="bg-white p-16 rounded-3xl text-center border border-gray-100 shadow-sm">
                <Grid3X3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">Không tìm thấy sản phẩm</h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                  Chúng tôi không tìm thấy kết quả phù hợp với bộ lọc hiện tại của bạn. Thử thay đổi từ khóa hoặc thiết lập lại bộ lọc.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-orange-700 transition cursor-pointer"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-7 animate-in fade-in duration-300">
                  {currentProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      wishlist={wishlist}
                      toggleWishlist={toggleWishlist}
                    />
                  ))}
                </div>

                {/* Paginate */}
                <Pagination
                  currentPage={currentPage}
                  totalItems={filtered.length}
                  itemsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black/60 z-[999] flex justify-end backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white w-80 h-full overflow-y-auto p-6 shadow-2xl relative animate-in slide-in-from-right duration-200">
            <button
              onClick={() => setShowMobileFilters(false)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
            <div className="mt-8">
              <Toolbar {...toolbarProps} />
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full bg-orange-600 text-white font-bold py-3.5 rounded-xl text-sm shadow mt-4"
              >
                Áp dụng bộ lọc
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
