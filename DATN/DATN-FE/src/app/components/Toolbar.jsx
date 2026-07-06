import React from 'react';
import { SlidersHorizontal, Search } from 'lucide-react';

export function Toolbar({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  categories = [],
  priceFilter,
  onPriceChange,
  selectedColors = [],
  onColorToggle,
  selectedSizes = [],
  onSizeToggle,
  saleOnly,
  onSaleToggle,
  onReset,
  colorsList = [],
  sizesList = []
}) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
      
      {/* Header and Reset */}
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-gray-900 text-lg flex items-center">
          <SlidersHorizontal className="h-4 w-4 mr-2 text-orange-600" />
          <span>Bộ lọc tìm kiếm</span>
        </h3>
        <button onClick={onReset} className="text-xs font-semibold text-orange-600 hover:text-orange-700">
          Thiết lập lại
        </button>
      </div>

      {/* Search Bar */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Tìm kiếm nhanh</label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Áo, quần, chất liệu..."
            className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Categories */}
      <div className="border-t border-gray-100 pt-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Danh mục</label>
        <div className="space-y-2">
          <button
            onClick={() => onCategoryChange("")}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition ${
              !categoryFilter ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:bg-gray-55/40"
            }`}
          >
            Tất cả sản phẩm
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition capitalize ${
                categoryFilter === cat.id ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:bg-gray-55/40"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Options */}
      <div className="border-t border-gray-100 pt-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Khoảng Giá</label>
        <div className="space-y-2">
          {[
            { id: "all", label: "Tất cả giá" },
            { id: "under-200", label: "Dưới 200,000đ" },
            { id: "200-500", label: "200,000đ - 500,000đ" },
            { id: "over-500", label: "Trên 500,000đ" }
          ].map((pOpt) => (
            <label key={pOpt.id} className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="radio"
                name="price-range-component"
                checked={priceFilter === pOpt.id}
                onChange={() => onPriceChange(pOpt.id)}
                className="text-orange-600 focus:ring-orange-500 h-4 w-4"
              />
              <span>{pOpt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Colors */}
      {colorsList.length > 0 && (
        <div className="border-t border-gray-100 pt-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Màu sắc</label>
          <div className="flex flex-wrap gap-1.5">
            {colorsList.map((color) => {
              const isSelected = selectedColors.includes(color);
              return (
                <button
                  key={color}
                  onClick={() => onColorToggle(color)}
                  className={`text-xs px-2.5 py-1.5 rounded-lg border transition font-medium ${
                    isSelected ? "bg-orange-600 border-orange-600 text-white" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Sizes */}
      {sizesList.length > 0 && (
        <div className="border-t border-gray-100 pt-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Kích thước (Size)</label>
          <div className="flex flex-wrap gap-1.5">
            {sizesList.map((size) => {
              const isSelected = selectedSizes.includes(size);
              return (
                <button
                  key={size}
                  onClick={() => onSizeToggle(size)}
                  className={`w-9 h-9 flex items-center justify-center text-xs rounded-lg border transition font-bold ${
                    isSelected ? "bg-orange-600 border-orange-600 text-white" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Sale Only Toggle */}
      <div className="border-t border-gray-100 pt-4">
        <label className="flex items-center space-x-3 text-sm font-semibold text-red-600 cursor-pointer">
          <input
            type="checkbox"
            checked={saleOnly}
            onChange={(e) => onSaleToggle(e.target.checked)}
            className="text-red-500 rounded focus:ring-red-400 h-4 w-4"
          />
          <span>Chỉ sản phẩm khuyến mãi</span>
        </label>
      </div>

    </div>
  );
}
