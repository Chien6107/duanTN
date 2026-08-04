import React, { useState } from "react";
import { SlidersHorizontal, Search, ChevronDown, ChevronUp, RotateCcw, Tag, Award } from "lucide-react";

export function Toolbar({
  searchQuery,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  brandFilter = "",
  onBrandChange = () => {},
  brandsList = [],
  categories = [],
  priceFilter,
  onPriceChange,
  maxPriceValue = "",
  onMaxPriceChange = () => {},
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
  const [isCatOpen, setIsCatOpen] = useState(true);

  return (
    <div className="bg-white p-5 rounded-3xl border border-zinc-200 shadow-xs space-y-5 text-zinc-900">
      
      {/* Header and Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
        <h3 className="font-extrabold text-zinc-900 text-sm uppercase tracking-wider flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-orange-600" />
          <span>Bộ Lọc Sản Phẩm</span>
        </h3>
        <button
          onClick={onReset}
          className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 bg-orange-50 px-2.5 py-1 rounded-full transition cursor-pointer"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Đặt lại</span>
        </button>
      </div>

      {/* Quick Search */}
      <div>
        <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-400 mb-2">Tìm kiếm nhanh</label>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tên áo, quần, combo, thương hiệu..."
            className="w-full px-3.5 py-2.5 pl-9 border border-zinc-250 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-zinc-50/50 text-zinc-900"
          />
          <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-zinc-400" />
        </div>
      </div>

      {/* Brand Selection Filter */}
      <div className="border-t border-zinc-100 pt-4">
        <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-400 mb-2 flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-orange-500" />
          Thương hiệu đối tác
        </label>
        <select
          value={brandFilter}
          onChange={(e) => onBrandChange(e.target.value)}
          className="w-full px-3.5 py-2.5 border border-zinc-250 rounded-xl text-xs font-bold bg-zinc-50/50 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
        >
          <option value="">Tất cả thương hiệu</option>
          {brandsList.map((b, idx) => (
            <option key={idx} value={b.name}>{b.name}</option>
          ))}
        </select>
      </div>

      {/* Category Filter */}
      <div className="border-t border-zinc-100 pt-4">
        <button
          onClick={() => setIsCatOpen(!isCatOpen)}
          className="w-full flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-zinc-500 mb-2.5 hover:text-zinc-900 transition"
        >
          <span>Danh mục sản phẩm</span>
          {isCatOpen ? <ChevronUp className="h-4 w-4 text-zinc-400" /> : <ChevronDown className="h-4 w-4 text-zinc-400" />}
        </button>

        {isCatOpen && (
          <div className="space-y-1 max-h-56 overflow-y-auto pr-1 transition-all duration-300">
            <button
              onClick={() => onCategoryChange("")}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                !categoryFilter ? "bg-orange-600 text-white shadow-xs" : "text-zinc-700 hover:bg-zinc-100"
              }`}
            >
              <span>Tất cả sản phẩm</span>
              {!categoryFilter && <Tag className="h-3 w-3" />}
            </button>

            <button
              onClick={() => onCategoryChange("combo")}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                categoryFilter === "combo" ? "bg-orange-600 text-white shadow-xs" : "text-orange-700 bg-orange-50/80 hover:bg-orange-100 border border-orange-200/60"
              }`}
            >
              <span>Set Combo Ưu Đãi</span>
              {categoryFilter === "combo" && <Tag className="h-3 w-3" />}
            </button>
            {categories.map((cat) => {
              const isSelected = String(categoryFilter) === String(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => onCategoryChange(cat.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between ${
                    isSelected ? "bg-orange-600 text-white shadow-xs" : "text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  <span>{cat.name}</span>
                  {isSelected && <Tag className="h-3 w-3" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Price Range Filter & Slider */}
      <div className="border-t border-zinc-100 pt-4 space-y-3">
        <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-400">Khoảng giá</label>

        {/* Range Slider Bar */}
        <div className="bg-zinc-50 p-3 rounded-2xl border border-zinc-200 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-zinc-700">
            <span>Tối đa:</span>
            <span className="font-black text-orange-600">
              {maxPriceValue ? `${Number(maxPriceValue).toLocaleString("vi-VN")}đ` : "Tất cả"}
            </span>
          </div>
          <input
            type="range"
            min="50000"
            max="2000000"
            step="50000"
            value={maxPriceValue || 2000000}
            onChange={(e) => onMaxPriceChange && onMaxPriceChange(e.target.value)}
            className="w-full accent-orange-600 cursor-pointer h-2 bg-zinc-200 rounded-lg"
          />
          <div className="flex justify-between text-[9px] font-extrabold text-zinc-400">
            <span>50k</span>
            <span>1tr</span>
            <span>2tr+</span>
          </div>
        </div>

        <div className="space-y-1.5">
          {[
            { id: "all", label: "Tất cả mức giá" },
            { id: "under-300", label: "Dưới 300.000đ" },
            { id: "300-500", label: "Từ 300.000đ - 500.000đ" },
            { id: "above-500", label: "Trên 500.000đ" }
          ].map((option) => (
            <label key={option.id} className="flex items-center space-x-3 text-xs font-semibold text-zinc-700 cursor-pointer hover:text-zinc-950 transition">
              <input
                type="radio"
                name="price"
                checked={priceFilter === option.id}
                onChange={() => onPriceChange(option.id)}
                className="accent-orange-600 h-4 w-4"
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Sale Only Toggle */}
      <div className="border-t border-zinc-100 pt-4">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-xs font-extrabold uppercase tracking-wider text-red-600">Chỉ sản phẩm khuyến mãi</span>
          <input
            type="checkbox"
            checked={saleOnly}
            onChange={(e) => onSaleToggle(e.target.checked)}
            className="accent-red-600 h-4 w-4 rounded cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
}
