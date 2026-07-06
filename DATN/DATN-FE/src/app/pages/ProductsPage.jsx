import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Filter, SlidersHorizontal, Grid3X3, ArrowUpDown, X } from "lucide-react";
import { useApp } from "../context/AppContext";
import { ProductCard } from "../components/ProductCard";
import { Toolbar } from "../components/Toolbar";
import { Pagination } from "../components/Pagination";

export function ProductsPage() {
  const { products, categories, wishlist, toggleWishlist } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filter & Search States
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [saleOnly, setSaleOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync state with URL params
  useEffect(() => {
    const cat = searchParams.get("category") || "";
    setCategoryFilter(cat);

    const sale = searchParams.get("sale") === "true";
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
    setPriceFilter("all");
    setSelectedColors([]);
    setSelectedSizes([]);
    setSaleOnly(false);
    setSearchQuery("");
    setSortBy("default");
    setSearchParams({});
    setCurrentPage(1);
  };

  // Filter products
  let filtered = products.filter((prod) => {
    if (searchQuery.trim()) {
      const matchName = prod.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDesc = prod.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchMat = prod.material.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchName && !matchDesc && !matchMat) return false;
    }

    if (categoryFilter && prod.category !== categoryFilter) {
      return false;
    }

    if (priceFilter !== "all") {
      if (priceFilter === "under-200") {
        if (prod.price >= 200000) return false;
      } else if (priceFilter === "200-500") {
        if (prod.price < 200000 || prod.price > 500000) return false;
      } else if (priceFilter === "over-500") {
        if (prod.price <= 500000) return false;
      }
    }

    if (selectedColors.length > 0) {
      const hasColor = prod.colors.some(c => selectedColors.some(sc => c.toLowerCase().includes(sc.toLowerCase())));
      if (!hasColor) return false;
    }

    if (selectedSizes.length > 0) {
      const hasSize = prod.sizes.some(s => selectedSizes.includes(s));
      if (!hasSize) return false;
    }

    if (saleOnly && !prod.originalPrice) {
      return false;
    }

    return true;
  });

  // Sort products
  if (sortBy === "price-asc") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-desc") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating-desc") {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  // Reset page when filtering
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryFilter, priceFilter, selectedColors, selectedSizes, saleOnly, searchQuery, sortBy]);

  // Paginated chunk
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filtered.slice(indexOfFirstProduct, indexOfLastProduct);

  const colorsList = ["Trắng", "Đen", "Xám", "Be", "Xanh", "Hồng", "Đỏ", "Vàng"];
  const sizesList = ["S", "M", "L", "XL", "28", "29", "30", "31", "32", "37", "38", "39", "40", "41", "42"];

  // Shared Toolbar Props
  const toolbarProps = {
    searchQuery,
    onSearchChange: handleSearchChange,
    categoryFilter,
    onCategoryChange: handleCategoryChange,
    categories,
    priceFilter,
    onPriceChange: setPriceFilter,
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
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-5 border-b border-gray-200 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Sản Phẩm Thời Trang</h1>
            <p className="text-gray-500 text-sm mt-1">Tìm thấy {filtered.length} sản phẩm phù hợp</p>
          </div>
          
          <div className="flex items-center space-x-3 self-end md:self-auto">
            {/* Sort Dropdown */}
            <div className="relative flex items-center bg-white border border-gray-300 rounded-xl px-3 py-2 text-sm shadow-sm">
              <ArrowUpDown className="h-4 w-4 text-gray-400 mr-2" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent focus:outline-none font-semibold text-gray-700 cursor-pointer"
              >
                <option value="default">Mặc định (Bán chạy)</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
                <option value="rating-desc">Đánh giá tốt nhất</option>
              </select>
            </div>

            {/* Mobile Filter Action Button */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="md:hidden flex items-center bg-orange-650 text-white rounded-xl px-4 py-2.5 text-sm font-semibold shadow bg-orange-600 hover:bg-orange-700"
            >
              <Filter className="h-4 w-4 mr-2" />
              Lọc sản phẩm
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden md:block lg:col-span-1 space-y-6">
            <div className="sticky top-24">
              <Toolbar {...toolbarProps} />
            </div>
          </aside>

          {/* Products Column */}
          <main className="lg:col-span-3 space-y-6">
            {currentProducts.length === 0 ? (
              <div className="bg-white p-16 rounded-3xl text-center border border-gray-100 shadow-sm">
                <Grid3X3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-2">Không tìm thấy sản phẩm</h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                  Chúng tôi không tìm thấy kết quả phù hợp với bộ lọc hiện tại của bạn. Thử thay đổi từ khóa hoặc thiết lập lại bộ lọc.
                </p>
                <button
                  onClick={resetFilters}
                  className="bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-orange-700 transition"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
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
