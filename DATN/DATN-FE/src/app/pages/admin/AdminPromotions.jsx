import { useState } from "react";
import { Plus, Edit, Trash2, Tag, X, ArrowLeft, Flame, Clock, Zap, Percent, CheckCircle2 } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { DataTable } from "../../components/DataTable";
import { Button } from "../../components/Button";
import { toast } from "sonner";
import { getProductPricing } from "../../utils/pricing";

export function AdminPromotions() {
  const { coupons = [], addCoupon, updateCoupon, deleteCoupon, categories = [], products = [], flashSaleConfig, updateFlashSaleConfig, updateProduct } = useApp();
  const [activeTab, setActiveTab] = useState("coupons"); // "coupons" | "flashSale"
  
  // Coupon modal states
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    code: "",
    discountType: "percent",
    discountValue: 0,
    maxDiscount: "",
    minOrderValue: 0,
    description: "",
    startDate: "",
    endDate: "",
    usageLimit: 100,
    categoryId: "",
    applicableUserType: 0,
    applicableScope: 0,
    applicableProductIds: ""
  });

  // Flash sale event form state
  const [eventForm, setEventForm] = useState({
    title: flashSaleConfig?.title || "FLASH SALE GIẢM ĐẾN 50%",
    subtitle: flashSaleConfig?.subtitle || "Deal chớp nhoáng",
    hours: flashSaleConfig?.hours ?? 11,
    minutes: flashSaleConfig?.minutes ?? 45,
    seconds: flashSaleConfig?.seconds ?? 30,
    active: flashSaleConfig?.active ?? true,
    selectedProductIds: flashSaleConfig?.productIds || []
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      code: "",
      discountType: "percent",
      discountValue: 10,
      maxDiscount: 50000,
      minOrderValue: 100000,
      description: "Mô tả điều kiện áp dụng mã giảm giá...",
      startDate: new Date().toISOString().slice(0, 10) + "T00:00",
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) + "T23:59",
      usageLimit: 100,
      categoryId: "",
      applicableUserType: 0,
      applicableScope: 0,
      applicableProductIds: ""
    });
    setShowModal(true);
  };

  const handleOpenEdit = (c) => {
    setEditingId(c.couponId);
    setFormData({
      code: c.couponCode,
      discountType: c.discountType === 2 ? "percent" : "fixed",
      discountValue: c.discountValue,
      maxDiscount: c.maxDiscountValue || "",
      minOrderValue: c.minOrderValue,
      description: c.description || "",
      startDate: c.startDate ? c.startDate.slice(0, 16) : "",
      endDate: c.endDate ? c.endDate.slice(0, 16) : "",
      usageLimit: c.usageLimit || 100,
      categoryId: c.categoryId || "",
      applicableUserType: c.applicableUserType || 0,
      applicableScope: c.applicableScope || 0,
      applicableProductIds: c.applicableProductIds || ""
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.code || formData.discountValue <= 0) {
      alert("Vui lòng điền mã và giá trị giảm giá hợp lệ!");
      return;
    }
    if (!formData.startDate || !formData.endDate) {
      alert("Vui lòng chọn ngày áp dụng!");
      return;
    }

    if (formData.discountType === "percent" && Number(formData.discountValue) >= 100) {
      toast.error("Bảo mật: không được tạo mã giảm giá từ 100%.");
      return;
    }

    const payload = {
      couponCode: formData.code.toUpperCase(),
      discountType: formData.discountType === "percent" ? 2 : 1,
      discountValue: Number(formData.discountValue),
      minOrderValue: Number(formData.minOrderValue),
      maxDiscountValue: formData.maxDiscount ? Number(formData.maxDiscount) : null,
      startDate: formData.startDate.includes("T") ? formData.startDate + ":00" : formData.startDate + "T00:00:00",
      endDate: formData.endDate.includes("T") ? formData.endDate + ":00" : formData.endDate + "T23:59:00",
      usageLimit: Number(formData.usageLimit || 100),
      categoryId: formData.categoryId ? Number(formData.categoryId) : null,
      applicableUserType: Number(formData.applicableUserType || 0),
      applicableScope: Number(formData.applicableScope || 0),
      applicableProductIds: formData.applicableProductIds || null,
      status: 1
    };

    try {
      if (editingId) {
        await updateCoupon(editingId, payload);
        toast.success("Cập nhật mã giảm giá thành công!");
        setShowModal(false);
      } else {
        const res = await addCoupon(payload);
        if (res && res.success) {
          toast.success("Tạo mã giảm giá mới thành công!");
          setShowModal(false);
        } else if (res && res.message) {
          alert(`Lỗi tạo mã: ${res.message}`);
        } else {
          toast.success("Tạo mã giảm giá mới thành công!");
          setShowModal(false);
        }
      }
    } catch (err) {
      alert(err.message || "Đã xảy ra lỗi!");
    }
  };

  const handleDelete = (id) => {
    if (confirm(`Bạn có chắc chắn muốn xóa mã giảm giá này?`)) {
      deleteCoupon(id);
      toast.success("Đã xóa mã giảm giá thành công!");
    }
  };

  const handleToggleStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === 1 ? 0 : 1;
    updateCoupon(id, { status: nextStatus });
  };

  // Toggle flash sale product selection
  const handleToggleFlashProduct = (productId) => {
    const pIdStr = String(productId);
    setEventForm(prev => {
      const exists = prev.selectedProductIds.map(String).includes(pIdStr);
      const updated = exists 
        ? prev.selectedProductIds.filter(id => String(id) !== pIdStr)
        : [...prev.selectedProductIds, productId];
      return { ...prev, selectedProductIds: updated };
    });
  };

  // Apply batch percent discount to selected flash sale products
  const handleApplyBatchDiscount = async (discountPercent) => {
    if (eventForm.selectedProductIds.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 sản phẩm tham gia Flash Sale!");
      return;
    }
    toast.info(`Đang cập nhật giảm ${discountPercent}% cho các sản phẩm đã chọn...`);
    for (const pId of eventForm.selectedProductIds) {
      const prod = products.find(p => String(p.id) === String(pId));
      if (prod) {
        const currentPricing = getProductPricing(prod);
        const orig = currentPricing.originalPrice || currentPricing.price;
        const salePrice = Math.round(orig * (1 - discountPercent / 100));
        const durationMs = ((Number(eventForm.hours)||0)*3600+(Number(eventForm.minutes)||0)*60+(Number(eventForm.seconds)||0))*1000;
        try {
          await updateProduct(prod.id, { ...prod, price: salePrice, originalPrice: orig,
            flashSaleStartAt: new Date().toISOString(),
            flashSaleEndAt: new Date(Date.now()+Math.max(1000,durationMs)).toISOString() });
        } catch (e) {
          console.error("Error updating discount percent for product:", prod.id, e);
        }
      }
    }
    toast.success(`Đã cập nhật mức giảm ${discountPercent}% thành công!`);
  };

  // Save Flash Sale Event settings
  const handleSaveFlashSaleEvent = (e) => {
    e.preventDefault();
    const h = Number(eventForm.hours) || 0;
    const m = Number(eventForm.minutes) || 0;
    const s = Number(eventForm.seconds) || 0;
    const endTime = Date.now() + (h * 3600 + m * 60 + s) * 1000;

    updateFlashSaleConfig({
      title: eventForm.title,
      subtitle: eventForm.subtitle,
      hours: h,
      minutes: m,
      seconds: s,
      endTime: endTime,
      active: eventForm.active,
      productIds: eventForm.selectedProductIds
    });
    toast.success("Đã cập nhật cấu hình sự kiện Flash Sale hiển thị ngoài trang chủ!");
  };

  const columns = [
    {
      header: "Mã Coupon",
      accessor: "couponCode",
      render: (couponCode, coupon) => (
        <div className="flex items-center space-x-2.5">
          <Tag className="h-4.5 w-4.5 text-orange-500 shrink-0" />
          <div>
            <p className="font-extrabold text-gray-900 font-mono tracking-wide">{couponCode || "---"}</p>
            <p className="text-xs text-gray-400 mt-0.5 max-w-[200px] truncate">{coupon?.description || "Không có mô tả"}</p>
          </div>
        </div>
      )
    },
    {
      header: "Giá trị giảm",
      accessor: "discountValue",
      render: (discountValue, coupon) => {
        const val = Number(discountValue || 0);
        return (
          <span className="font-bold text-gray-800">
            {coupon?.discountType === 2 ? `${val}%` : `${val.toLocaleString('vi-VN')}đ`}
          </span>
        );
      }
    },
    {
      header: "Áp dụng cho",
      accessor: "categoryId",
      render: (catId) => {
        if (!catId) return <span className="text-xs text-gray-400 italic font-semibold">Tất cả sản phẩm</span>;
        const cat = categories.find(c => c.id === catId || c.categoryId === catId);
        return <span className="px-2 py-0.5 bg-orange-50 border border-orange-100 text-orange-600 text-[10px] font-bold rounded-lg uppercase">{cat ? (cat.name || cat.categoryName) : `Danh mục #${catId}`}</span>;
      }
    },
    {
      header: "Hóa đơn tối thiểu",
      accessor: "minOrderValue",
      render: (minOrderValue) => {
        const val = Number(minOrderValue || 0);
        return <span className="text-gray-500 font-semibold">{val.toLocaleString('vi-VN')}đ</span>;
      }
    },
    {
      header: "Thời hạn",
      accessor: "startDate",
      render: (start, coupon) => {
        const formatDate = (dateStr) => {
          if (!dateStr) return "---";
          const d = new Date(dateStr);
          return isNaN(d.getTime()) ? "---" : d.toLocaleDateString('vi-VN');
        };
        return (
          <div className="text-[10px] text-zinc-500 font-bold space-y-0.5">
            <p><span className="text-gray-400 font-semibold">Từ:</span> {formatDate(start)}</p>
            <p><span className="text-gray-400 font-semibold">Đến:</span> {formatDate(coupon?.endDate)}</p>
          </div>
        );
      }
    },
    {
      header: "Trạng thái",
      accessor: "status",
      render: (status, coupon) => (
        <button
          onClick={() => handleToggleStatus(coupon.couponId || coupon.id, status)}
          className="flex items-center transition cursor-pointer"
          title={status === 1 ? "Click để ẩn" : "Click để kích hoạt"}
        >
          {status === 1 ? (
            <span className="bg-green-50 text-green-700 font-bold text-[10px] px-2 py-0.5 rounded-full uppercase border border-green-200">Kích hoạt</span>
          ) : (
            <span className="bg-gray-100 text-gray-400 font-bold text-[10px] px-2 py-0.5 rounded-full uppercase border">Tạm ẩn</span>
          )}
        </button>
      )
    },
    {
      header: "Thao tác",
      accessor: "couponId",
      align: "right",
      render: (couponId, coupon) => (
        <div className="flex items-center justify-end space-x-1">
          <button
            onClick={() => handleOpenEdit(coupon)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition cursor-pointer"
            title="Sửa"
          >
            <Edit className="h-4.5 w-4.5" />
          </button>
          <button
            onClick={() => handleDelete(couponId || coupon.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
            title="Xóa"
          >
            <Trash2 className="h-4.5 w-4.5" />
          </button>
        </div>
      )
    }
  ];

  if (showModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="max-h-[94vh] w-full max-w-4xl space-y-4 overflow-y-auto rounded-3xl bg-gray-100 p-4 shadow-2xl">
        {/* Header Bar */}
        <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-gray-150 shadow-xs">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-3.5 py-2.5 rounded-xl transition border border-gray-200 bg-white shadow-2xs cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> Quay lại
            </button>
            <h3 className="text-lg font-extrabold text-gray-900">
              {editingId ? "Cập nhật mã giảm giá" : "Thêm mã giảm giá mới"}
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:bg-red-50 px-3.5 py-2.5 rounded-xl transition border border-red-200 cursor-pointer"
          >
            <X className="h-4 w-4" /> Thoát
          </button>
        </div>

        {/* Form Page */}
        <div className="bg-white rounded-3xl shadow-xs border border-gray-150 overflow-hidden max-w-lg mx-auto">
          <div className="bg-gradient-to-r from-orange-500 to-pink-600 p-5 text-white">
            <p className="text-xs opacity-90 font-bold uppercase tracking-wider">
              {editingId ? `Đang chỉnh sửa Coupon ID: ${editingId}` : "Vui lòng nhập thông tin Coupon mới"}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Mã giảm giá *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Ví dụ: SUMMER2026"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-gray-800 uppercase"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Áp dụng cho danh mục</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-gray-900 bg-white"
                >
                  <option value="" className="text-gray-900 bg-white font-semibold">Tất cả sản phẩm</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id} className="text-gray-900 bg-white font-semibold">{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Loại giảm giá *</label>
                <select
                  value={formData.discountType}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-gray-900 bg-white"
                >
                  <option value="percent" className="text-gray-900 bg-white">Giảm theo phần trăm (%)</option>
                  <option value="fixed" className="text-gray-900 bg-white">Giảm số tiền cố định (đ)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Giá trị giảm *</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-gray-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Giảm tối đa (đ)</label>
                <input
                  type="number"
                  value={formData.maxDiscount}
                  onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                  placeholder="Ví dụ: 50000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Hóa đơn tối thiểu (đ)</label>
                <input
                  type="number"
                  required
                  value={formData.minOrderValue}
                  onChange={(e) => setFormData({ ...formData, minOrderValue: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-gray-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Ngày bắt đầu *</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Ngày kết thúc *</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800 font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Lượt sử dụng tối đa</label>
                <input
                  type="number"
                  required
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-gray-800"
                />
              </div>
            </div>

            {/* Quy tắc phân loại người dùng & phạm vi áp dụng */}
            <div className="bg-orange-50/60 p-4 rounded-2xl border border-orange-100 space-y-4">
              <h4 className="text-xs font-black uppercase tracking-wider text-orange-900">Quy tắc áp dụng mã nâng cao</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Đối tượng thành viên *</label>
                  <select
                    value={formData.applicableUserType}
                    onChange={(e) => setFormData({ ...formData, applicableUserType: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white"
                  >
                    <option value={0}>Tất cả thành viên (ALL)</option>
                    <option value={1}>Thành viên mới (Chưa có đơn hàng)</option>
                    <option value={2}>Thành viên cũ (Đã từng mua hàng)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Phạm vi sản phẩm *</label>
                  <select
                    value={formData.applicableScope}
                    onChange={(e) => setFormData({ ...formData, applicableScope: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white"
                  >
                    <option value={0}>Tất cả sản phẩm</option>
                    <option value={1}>Theo Danh mục chỉ định</option>
                    <option value={2}>Sản phẩm cụ thể chọn lọc</option>
                  </select>
                </div>
              </div>

              {formData.applicableScope === 1 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">Chọn danh mục áp dụng</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white"
                  >
                    <option value="">-- Tất cả danh mục --</option>
                    {categories.map((cat) => (
                      <option key={cat.id || cat.categoryId} value={cat.categoryId || cat.id}>
                        {cat.categoryName || cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formData.applicableScope === 2 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">ID các sản phẩm áp dụng (ngăn cách bằng dấu phẩy)</label>
                  <input
                    type="text"
                    value={formData.applicableProductIds}
                    onChange={(e) => setFormData({ ...formData, applicableProductIds: e.target.value })}
                    placeholder="Ví dụ: 1,2,5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-900 bg-white"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Nhập danh sách ID sản phẩm được áp dụng voucher này.</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Điều kiện / Mô tả chi tiết</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800 font-medium"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 text-white font-bold py-2.5 rounded-xl text-sm shadow hover:bg-orange-700 transition cursor-pointer"
            >
              {editingId ? "Cập nhật mã" : "Tạo mã giảm giá"}
            </button>
          </form>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 space-x-4 bg-white p-2 rounded-2xl border">
        <button
          onClick={() => setActiveTab("coupons")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition cursor-pointer ${
            activeTab === "coupons"
              ? "bg-orange-600 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Tag className="h-4 w-4" />
          <span>Mã Giảm Giá (Vouchers & Coupons)</span>
        </button>

        <button
          onClick={() => setActiveTab("flashSale")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition cursor-pointer ${
            activeTab === "flashSale"
              ? "bg-red-600 text-white shadow-md animate-pulse"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Flame className="h-4 w-4 text-yellow-300" />
          <span>Sự kiện Flash Sale và giảm giá (%)</span>
        </button>
      </div>

      {activeTab === "coupons" ? (
        <DataTable
          columns={columns}
          data={coupons}
          searchPlaceholder="Tìm kiếm theo mã coupon..."
          searchKeys={["code", "description"]}
          itemsPerPage={8}
          actions={
            <Button icon={Plus} onClick={handleOpenAdd}>
              Thêm mã giảm giá
            </Button>
          }
        />
      ) : (
        /* FLASH SALE & EVENT MANAGEMENT TAB */
        <div className="space-y-6">
          <form onSubmit={handleSaveFlashSaleEvent} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 text-red-600 rounded-2xl">
                  <Flame className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">Quản lý sự kiện Flash Sale và khuyến mãi (%)</h3>
                  <p className="text-xs text-gray-500 font-medium">Tùy chỉnh tiêu đề banner, thời gian đếm ngược và chọn sản phẩm giảm giá hiển thị ngoài trang chủ</p>
                </div>
              </div>

              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-md transition cursor-pointer flex items-center gap-2 uppercase tracking-wider"
              >
                <CheckCircle2 className="h-4 w-4" />
                Lưu sự kiện Flash Sale
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-extrabold uppercase text-gray-600 mb-1.5">Tiêu đề sự kiện (Banner)</label>
                <input
                  type="text"
                  required
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="Ví dụ: FLASH SALE GIẢM ĐẾN 50%"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-bold text-gray-900 outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold uppercase text-gray-600 mb-1.5">Slogan / Phụ đề</label>
                <input
                  type="text"
                  value={eventForm.subtitle}
                  onChange={(e) => setEventForm({ ...eventForm, subtitle: e.target.value })}
                  placeholder="Ví dụ: Deal chớp nhoáng"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-bold text-gray-900 outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* Countdown timer inputs */}
            <div className="bg-orange-50/60 p-4 rounded-2xl border border-orange-100 space-y-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-orange-800 flex items-center gap-2">
                <Clock className="h-4 w-4 text-orange-600" />
                Thời gian đếm ngược (Kết thúc sau)
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="text-[11px] font-bold text-gray-500 block mb-1">Số Giờ</span>
                  <input
                    type="number"
                    min="0"
                    max="99"
                    value={eventForm.hours}
                    onChange={(e) => setEventForm({ ...eventForm, hours: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-black text-center text-sm bg-white"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-500 block mb-1">Số Phút</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={eventForm.minutes}
                    onChange={(e) => setEventForm({ ...eventForm, minutes: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-black text-center text-sm bg-white"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-gray-500 block mb-1">Số Giây</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={eventForm.seconds}
                    onChange={(e) => setEventForm({ ...eventForm, seconds: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl font-black text-center text-sm bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Quick batch discount tools */}
            <div className="bg-red-50 p-4 rounded-2xl border border-red-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs font-black text-red-800 flex items-center gap-1.5">
                  <Zap className="h-4 w-4 text-red-600 fill-current" />
                  Áp dụng nhanh phần trăm giảm (%) cho các sản phẩm đã chọn:
                </p>
                <p className="text-[11px] text-red-600 mt-0.5">Chọn sản phẩm rồi bấm mức giảm: hệ thống sẽ trừ trực tiếp giá bán và giữ giá cũ làm giá gạch ngang.</p>
              </div>

              <div className="flex items-center gap-2">
                {[10, 20, 30, 50].map((percent) => (
                  <button
                    key={percent}
                    type="button"
                    onClick={() => handleApplyBatchDiscount(percent)}
                    className="bg-white hover:bg-red-600 hover:text-white text-red-600 border border-red-200 font-extrabold text-xs px-3.5 py-2 rounded-xl transition cursor-pointer shadow-2xs"
                  >
                    -{percent}%
                  </button>
                ))}
              </div>
            </div>

            {/* Product selection list */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-extrabold uppercase text-gray-700">Danh sách sản phẩm tham gia Flash Sale ({eventForm.selectedProductIds.length} sản phẩm)</label>
                <span className="text-xs text-gray-500 font-medium">Tích chọn sản phẩm hiển thị trên banner Flash Sale ngoài trang chủ</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-1 border rounded-2xl bg-gray-50">
                {products.map((p) => {
                  const isSelected = eventForm.selectedProductIds.map(String).includes(String(p.id));
                  const discountPercent = getProductPricing(p).discountPercent;

                  return (
                    <div
                      key={p.id}
                      onClick={() => handleToggleFlashProduct(p.id)}
                      className={`p-3 rounded-2xl border transition cursor-pointer flex items-center gap-3 ${
                        isSelected 
                          ? "bg-red-50/80 border-red-500 shadow-2xs" 
                          : "bg-white border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="h-4 w-4 accent-red-600 rounded cursor-pointer shrink-0"
                      />
                      <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-xl border shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-gray-900 truncate">{p.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-extrabold text-red-600">{p.price?.toLocaleString('vi-VN')}đ</span>
                          {discountPercent > 0 && (
                            <span className="text-[10px] font-black bg-red-600 text-white px-1.5 py-0.2 rounded">
                              -{discountPercent}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
