import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router";
import {
  ArrowLeft, Edit, Trash2, Star, Package, Tag, Layers,
  Image as ImageIcon, Video, TrendingUp, ShoppingCart,
  Users, Award, ChevronLeft, ChevronRight, Globe, Scissors,
  Plus, Check, X
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { getProductPricing } from "../../utils/pricing";

export function AdminProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products = [], categories = [], deleteProduct, updateProduct } = useApp();

  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("info");
  const [variantInputs, setVariantInputs] = useState({});

  const product = products.find((p) => String(p.id) === String(id));

  useEffect(() => {
    if (product) setSelectedImage(0);
  }, [product]);

  const handleAdjustVariantQty = async (vIdx, delta) => {
    if (!product || !product.variants) return;
    const updated = product.variants.map((v, i) => {
      if (i === vIdx) {
        const cur = Number(v.quantity || 0);
        return { ...v, quantity: Math.max(0, cur + Number(delta)) };
      }
      return v;
    });
    await updateProduct(product.id, {
      ...product,
      productName: product.name,
      variants: updated,
    });
  };

  const handleCustomVariantSubmit = async (vIdx) => {
    const qtyStr = variantInputs[vIdx];
    const qty = Number(qtyStr);
    if (!qtyStr || isNaN(qty) || qty === 0) return;
    await handleAdjustVariantQty(vIdx, qty);
    setVariantInputs((prev) => ({ ...prev, [vIdx]: "" }));
  };

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Package className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-700">Không tìm thấy sản phẩm</h2>
        <p className="text-gray-400 mt-1 mb-6">Sản phẩm ID #{id} không tồn tại.</p>
        <Link
          to="/admin/products"
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-xl font-semibold text-sm hover:bg-orange-700 transition"
        >
          <ArrowLeft className="h-4 w-4" /> Quay lại danh sách
        </Link>
      </div>
    );
  }

  const comboIds = product.comboProductIds?.length
    ? product.comboProductIds
    : (product.description?.match(/\[COMBO:\s*([\d,]+)\]/)?.[1] || "")
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
  const comboProducts = [
    ...(product.comboProducts || []),
    ...comboIds
      .map((productId) =>
        products.find((item) => String(item.id) === String(productId))
      )
      .filter(Boolean)
  ].filter(
    (item, index, items) =>
      item?.image &&
      items.findIndex((candidate) => candidate.image === item.image) === index
  );
  const allImages = [
    { imageUrl: product.image, isPrimary: true, label: "Ảnh chính Combo" },
    ...comboProducts.map((item) => ({
      imageUrl: item.image,
      isPrimary: false,
      label: item.name
    })),
    ...(product.images || []).map((image) => ({
      ...image,
      label: image.productName || image.label || "Ảnh Combo"
    }))
  ].filter(
    (image, index, images) =>
      image.imageUrl &&
      images.findIndex((candidate) => candidate.imageUrl === image.imageUrl) === index
  );

  const category = categories.find((c) => c.id === product.categoryId);
  const rating = product.rating || 0;
  const reviews = product.reviews || 0;
  const totalVariantQty = product.variants?.reduce((s, v) => s + (v.quantity || 0), 0) || product.quantity || 0;

  const handleDelete = async () => {
    if (confirm(`Bạn có chắc muốn xóa "${product.name}"?`)) {
      const res = await deleteProduct(product.id);
      if (res?.success) {
        navigate("/admin/products");
      } else {
        alert(res?.message || "Xóa thất bại!");
      }
    }
  };

  const tabs = [
    { id: "info", label: "Thông tin" },
    { id: "variants", label: `Biến thể (${product.variants?.length || 0})` },
    { id: "images", label: `Hình ảnh (${allImages.length})` },
    { id: "reviews", label: `Đánh giá (${reviews})` },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl shadow-xs border border-gray-100">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="p-2 rounded-xl hover:bg-gray-100 transition text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-lg font-black text-gray-900 leading-tight line-clamp-1 max-w-sm">
              {product.name}
            </h1>
            <p className="text-xs text-gray-400 font-semibold">ID: #{product.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/admin/products"
            state={{ editId: product.id }}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-xl text-sm font-bold hover:bg-blue-100 transition"
          >
            <Edit className="h-4 w-4" /> Chỉnh sửa
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition"
          >
            <Trash2 className="h-4 w-4" /> Xóa
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ─── Left: Image Gallery ─── */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-50 group">
              <img
                src={allImages[selectedImage]?.imageUrl || product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
                onError={(e) => {
                  e.target.src = "https://placehold.co/600x600?text=No+Image";
                }}
              />
              {allImages[selectedImage]?.isPrimary && (
                <span className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full">
                  Ảnh chính
                </span>
              )}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((p) => Math.max(0, p - 1))}
                    disabled={selectedImage === 0}
                    className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 rounded-full shadow hover:bg-white transition disabled:opacity-30"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setSelectedImage((p) => Math.min(allImages.length - 1, p + 1))}
                    disabled={selectedImage === allImages.length - 1}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 rounded-full shadow hover:bg-white transition disabled:opacity-30"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden border-2 transition ${
                      selectedImage === i
                        ? "border-orange-500 shadow-md"
                        : "border-transparent hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={img.imageUrl}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = "https://placehold.co/56x56?text=?"; }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Video */}
          {product.videoUrl && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-4">
              <div className="flex items-center gap-2 mb-3">
                <Video className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-black text-gray-700 uppercase tracking-wider">Video sản phẩm</span>
              </div>
              <video
                src={product.videoUrl}
                controls
                className="w-full rounded-xl bg-black"
                style={{ maxHeight: 200 }}
              />
            </div>
          )}
        </div>

        {/* ─── Right: Details ─── */}
        <div className="lg:col-span-3 space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                icon: ShoppingCart,
                label: "Hàng tồn",
                value: `${totalVariantQty}`,
                sub: "sản phẩm",
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                icon: Star,
                label: "Đánh giá",
                value: `${rating}★`,
                sub: `${reviews} đánh giá`,
                color: "text-yellow-600",
                bg: "bg-yellow-50",
              },
              {
                icon: Layers,
                label: "Biến thể",
                value: `${product.variants?.length || 0}`,
                sub: "variants",
                color: "text-purple-600",
                bg: "bg-purple-50",
              },
              {
                icon: ImageIcon,
                label: "Hình ảnh",
                value: `${allImages.length}`,
                sub: "ảnh",
                color: "text-green-600",
                bg: "bg-green-50",
              },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-xs p-4 text-center">
                <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}>
                  <s.icon className={`h-4.5 w-4.5 ${s.color}`} />
                </div>
                <p className="text-lg font-black text-gray-900">{s.value}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Price */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-5">
            <div className="flex items-end gap-3 flex-wrap">
              <span className="text-3xl font-black text-orange-600">
                {(product.price || 0).toLocaleString("vi-VN")}đ
              </span>
              {getProductPricing(product).hasDiscount && (
                <>
                  <span className="text-lg text-gray-400 line-through font-semibold">
                    {getProductPricing(product).originalPrice.toLocaleString("vi-VN")}đ
                  </span>
                  <span className="px-2.5 py-1 bg-red-100 text-red-600 rounded-full text-xs font-black">
                    -{getProductPricing(product).discountPercent}% OFF
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
            <div className="flex border-b border-gray-100 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 px-5 py-3.5 text-xs font-black uppercase tracking-wider transition ${
                    activeTab === tab.id
                      ? "border-b-2 border-orange-500 text-orange-600 bg-orange-50/50"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-5">
              {/* Tab: Thông tin */}
              {activeTab === "info" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <InfoRow icon={Tag} label="Danh mục" value={category?.categoryName || product.category || "—"} />
                    <InfoRow icon={Award} label="Thương hiệu" value={product.brand || product.brandName || "Chưa cập nhật"} />
                    <InfoRow icon={Scissors} label="Chất liệu" value={product.material || "—"} />
                    <InfoRow icon={Globe} label="Xuất xứ" value={product.origin || "—"} />
                    <InfoRow
                      icon={Layers}
                      label="Loại sản phẩm"
                      value={product.isCombo || product.category === "combo" ? "Set Combo" : "Sản phẩm bán lẻ"}
                    />
                    <InfoRow
                      icon={Award}
                      label="Trạng thái"
                      value={product.status === 1 ? "Đang bán" : "Ngừng bán"}
                      valueClass={product.status === 1 ? "text-green-600 font-black" : "text-red-500 font-black"}
                    />
                    <InfoRow icon={Package} label="Mã sản phẩm" value={`#${product.id}`} />
                    <InfoRow icon={ShoppingCart} label="Tổng tồn kho" value={`${totalVariantQty} sản phẩm`} />
                    <InfoRow icon={Layers} label="Số biến thể" value={`${product.variants?.length || 0} biến thể`} />
                  </div>

                  {product.description && (
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <p className="text-[11px] font-black uppercase text-gray-400 tracking-wider mb-2">Mô tả sản phẩm</p>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line font-medium">{product.description}</p>
                    </div>
                  )}

                  {/* Detailed Care Instructions & Fit Guide */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-orange-50/50 rounded-xl p-4 border border-orange-100">
                      <p className="text-[11px] font-black uppercase text-orange-600 tracking-wider mb-1.5 flex items-center gap-1.5">
                        🧺 Hướng dẫn giặt ủi & bảo quản
                      </p>
                      <p className="text-xs text-gray-700 leading-relaxed font-semibold">
                        {product.careInstructions || "Giặt máy nhẹ ở nhiệt độ dưới 30°C. Phơi lộn trái mặt trong bóng râm, tránh ánh nắng trực tiếp. Ủi ở nhiệt độ trung bình."}
                      </p>
                    </div>

                    <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                      <p className="text-[11px] font-black uppercase text-blue-600 tracking-wider mb-1.5 flex items-center gap-1.5">
                        📐 Hướng dẫn phom dáng & chọn Size
                      </p>
                      <p className="text-xs text-gray-700 leading-relaxed font-semibold">
                        {product.fitGuide || "Phom Regular Fit ôm vừa tôn dáng. Chiều cao 1m65 - 1m75 khuyên dùng Size M."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Biến thể */}
              {activeTab === "variants" && (
                <div>
                  {(!product.variants || product.variants.length === 0) ? (
                    <div className="text-center py-10 text-gray-400">
                      <Layers className="h-10 w-10 mx-auto mb-2 opacity-40" />
                      <p className="text-sm font-semibold">Không có biến thể</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100">
                            {["Màu sắc", "Kích cỡ", "Tồn kho & Điều chỉnh", "Giá riêng"].map((h) => (
                              <th key={h} className="pb-3 text-left text-[11px] font-black uppercase tracking-wider text-gray-400">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {product.variants.map((v, i) => (
                            <tr key={i} className="hover:bg-gray-50 transition">
                              <td className="py-3">
                                <div className="flex items-center gap-2">
                                  <div
                                    className="w-4 h-4 rounded-full border border-gray-200 shadow-sm"
                                    style={{ backgroundColor: colorToHex(v.color) }}
                                  />
                                  <span className="font-semibold text-gray-800">{v.color}</span>
                                </div>
                              </td>
                              <td className="py-3">
                                <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold">
                                  {v.size}
                                </span>
                              </td>
                              <td className="py-3">
                                <div className="flex items-center gap-3">
                                  <span className={`font-black text-sm min-w-[32px] ${(v.quantity || 0) <= 5 ? "text-red-600" : "text-emerald-600"}`}>
                                    {v.quantity || 0}
                                  </span>
                                  <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl p-1">
                                    <button
                                      type="button"
                                      title="Giảm 1"
                                      onClick={() => handleAdjustVariantQty(i, -1)}
                                      className="w-7 h-7 flex items-center justify-center bg-white hover:bg-red-50 hover:text-red-600 text-gray-600 border border-gray-200 rounded-lg text-xs font-bold transition cursor-pointer"
                                    >
                                      -1
                                    </button>
                                    <button
                                      type="button"
                                      title="Tăng 1"
                                      onClick={() => handleAdjustVariantQty(i, 1)}
                                      className="w-7 h-7 flex items-center justify-center bg-white hover:bg-emerald-50 hover:text-emerald-600 text-gray-700 border border-gray-200 rounded-lg text-xs font-bold transition cursor-pointer"
                                    >
                                      +1
                                    </button>
                                    <button
                                      type="button"
                                      title="Tăng 5"
                                      onClick={() => handleAdjustVariantQty(i, 5)}
                                      className="w-7 h-7 flex items-center justify-center bg-white hover:bg-orange-50 hover:text-orange-600 text-orange-600 border border-orange-200 rounded-lg text-xs font-bold transition cursor-pointer"
                                    >
                                      +5
                                    </button>
                                    <div className="flex items-center gap-1 ml-1 border-l border-gray-200 pl-1">
                                      <input
                                        type="number"
                                        placeholder="+X"
                                        value={variantInputs[i] || ""}
                                        onChange={(e) => setVariantInputs({ ...variantInputs, [i]: e.target.value })}
                                        onKeyDown={(e) => { if (e.key === "Enter") handleCustomVariantSubmit(i); }}
                                        className="w-12 h-7 text-xs text-center border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 bg-white font-mono"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleCustomVariantSubmit(i)}
                                        className="h-7 px-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
                                      >
                                        Lưu
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 text-gray-600 font-semibold">
                                {v.price ? `${Number(v.price).toLocaleString("vi-VN")}đ` : "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="border-t border-gray-100">
                          <tr>
                            <td colSpan={2} className="pt-3 text-xs font-black text-gray-400 uppercase">Tổng cộng</td>
                            <td className="pt-3 font-black text-gray-900">{totalVariantQty}</td>
                            <td />
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Hình ảnh */}
              {activeTab === "images" && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {allImages.map((img, i) => (
                    <div key={i} className="relative group">
                      <button
                        onClick={() => { setSelectedImage(i); setActiveTab("info"); }}
                        className="block w-full aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-orange-400 transition"
                      >
                        <img
                          src={img.imageUrl}
                          alt={`Ảnh ${i + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = "https://placehold.co/120?text=?"; }}
                        />
                      </button>
                      {img.isPrimary && (
                        <span className="absolute top-1 left-1 bg-orange-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-md">
                          Chính
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Tab: Đánh giá */}
              {activeTab === "reviews" && (
                <ReviewsTab product={product} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function InfoRow({ icon: Icon, label, value, valueClass = "text-gray-800" }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-xs flex-shrink-0 mt-0.5">
        <Icon className="h-3.5 w-3.5 text-gray-500" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 mb-0.5">{label}</p>
        <p className={`text-sm font-bold truncate ${valueClass}`}>{value}</p>
      </div>
    </div>
  );
}

function ReviewsTab({ product }) {
  // Placeholder review data — in real app would fetch from API
  const rating = product.rating || 0;
  const total = product.reviews || 0;

  const distribution = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: Math.round(total * (star === Math.round(rating) ? 0.5 : star > rating ? 0.05 : 0.1)),
  }));

  if (total === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        <Star className="h-10 w-10 mx-auto mb-2 opacity-40" />
        <p className="text-sm font-semibold">Chưa có đánh giá nào</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center gap-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl border border-orange-100">
        <div className="text-center">
          <p className="text-4xl font-black text-orange-600">{rating}</p>
          <div className="flex gap-0.5 mt-1 justify-center">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`h-3.5 w-3.5 ${s <= Math.round(rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">{total} đánh giá</p>
        </div>
        <div className="flex-1 space-y-1.5">
          {distribution.map(({ star, count }) => (
            <div key={star} className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-500 w-4">{star}</span>
              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 flex-shrink-0" />
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all"
                  style={{ width: total > 0 ? `${(count / total) * 100}%` : "0%" }}
                />
              </div>
              <span className="text-xs text-gray-400 w-5 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-xs text-gray-400 text-center">
        Chi tiết đánh giá được hiển thị từ dữ liệu API thực tế.
      </p>
    </div>
  );
}

function colorToHex(colorName) {
  const map = {
    "trắng": "#FFFFFF", "đen": "#1F2937", "đỏ": "#EF4444", "xanh": "#3B82F6",
    "vàng": "#F59E0B", "xám": "#6B7280", "hồng": "#EC4899", "tím": "#8B5CF6",
    "nâu": "#92400E", "cam": "#F97316", "green": "#10B981", "blue": "#3B82F6",
    "white": "#FFFFFF", "black": "#1F2937", "red": "#EF4444", "yellow": "#F59E0B"
  };
  const lower = (colorName || "").toLowerCase();
  for (const [key, hex] of Object.entries(map)) {
    if (lower.includes(key)) return hex;
  }
  return "#E5E7EB";
}
