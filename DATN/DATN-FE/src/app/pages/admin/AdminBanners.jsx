import React, { useEffect, useState } from "react";
import { useApp } from "../../context/AppContext";
import { Plus, Edit2, Trash2, Image as ImageIcon, Layout, ArrowLeft, X, Power } from "lucide-react";
import { api } from "../../services/api";

export function AdminBanners() {
  const { adminBanners = [], loadAllBannersAdmin, addBanner, updateBanner, deleteBanner } = useApp();
  const [activeType, setActiveType] = useState("IMAGE");
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [formData, setFormData] = useState({
    bannerType: "IMAGE",
    title: "",
    imageUrl: "",
    linkUrl: "",
    position: 1,
    status: 1
  });

  useEffect(() => {
    loadAllBannersAdmin();
  }, [loadAllBannersAdmin]);

  const filteredBanners = adminBanners.filter((banner) =>
    activeType === "MARQUEE"
      ? banner.bannerType === "MARQUEE"
      : banner.bannerType !== "MARQUEE"
  );

  const handleOpenAdd = (requestedType = "IMAGE") => {
    const bannerType = typeof requestedType === "string" ? requestedType : "IMAGE";
    setEditingId(null);
    setFormData({
      bannerType,
      title: "",
      imageUrl: "",
      linkUrl: "",
      position: 1,
      status: 1
    });
    setActiveType(bannerType);
    setShowModal(true);
  };

  const handleOpenEdit = (banner) => {
    setEditingId(banner.id || banner.bannerId);
    setFormData({
      bannerType: banner.bannerType || "IMAGE",
      title: banner.title,
      imageUrl: banner.imageUrl || "",
      linkUrl: banner.linkUrl || "",
      position: banner.position || 1,
      status: banner.status !== undefined ? banner.status : 1
    });
    setActiveType(banner.bannerType || "IMAGE");
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || (formData.bannerType === "IMAGE" && !formData.imageUrl)) {
      alert("Vui lòng điền đầy đủ tiêu đề và hình ảnh!");
      return;
    }

    try {
      const bannerReq = {
        bannerType: formData.bannerType,
        title: formData.title,
        imageUrl: formData.bannerType === "MARQUEE" ? "marquee://text" : formData.imageUrl,
        linkUrl: formData.linkUrl || null,
        position: Number(formData.position),
        status: Number(formData.status)
      };

      if (editingId) {
        const res = await updateBanner(editingId, bannerReq);
        if (res && res.success) {
          alert("Cập nhật banner thành công!");
          setShowModal(false);
        } else {
          alert(res?.message || "Cập nhật banner thất bại!");
        }
      } else {
        const res = await addBanner(bannerReq);
        if (res && res.success) {
          alert("Thêm banner mới thành công!");
          setShowModal(false);
        } else {
          alert(res?.message || "Thêm banner mới thất bại!");
        }
      }
    } catch (err) {
      alert(err.message || "Đã xảy ra lỗi!");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa banner này?")) {
      const result = await deleteBanner(id);
      if (result && result.success) {
        alert("Xóa banner thành công!");
      } else {
        alert(result?.message || "Đã xảy ra lỗi hệ thống!");
      }
    }
  };

  const handleToggleStatus = async (banner) => {
    const id = banner.id || banner.bannerId;
    const nextStatus = Number(banner.status) === 1 ? 0 : 1;
    setTogglingId(id);
    try {
      const result = await updateBanner(id, {
        bannerType: banner.bannerType || "IMAGE",
        title: banner.title,
        imageUrl: banner.imageUrl || "",
        linkUrl: banner.linkUrl || null,
        position: Number(banner.position || 1),
        status: nextStatus
      });
      if (!result?.success) alert(result?.message || "Không thể cập nhật trạng thái banner!");
    } finally {
      setTogglingId(null);
    }
  };

  if (showModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="max-h-[92vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-3xl bg-gray-100 p-4 shadow-2xl">
        {/* Header Bar */}
        <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-gray-150 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-3.5 py-2.5 rounded-xl transition border border-gray-200 bg-white shadow-2xs cursor-pointer animate-in fade-in"
            >
              <ArrowLeft className="h-4 w-4" /> Quay lại
            </button>
            <h3 className="text-lg font-extrabold text-gray-900">
              {editingId ? "Cập nhật Banner quảng cáo" : "Thêm Banner mới"}
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
              {editingId ? `Đang chỉnh sửa Banner, mã: ${editingId}` : "Vui lòng nhập thông tin cấu hình Banner"}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Loại banner *</label>
              <select
                value={formData.bannerType}
                onChange={(e) => setFormData({ ...formData, bannerType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-gray-800"
              >
                <option value="IMAGE">Banner hình ảnh/video</option>
                <option value="MARQUEE">Dòng chữ chạy</option>
              </select>
              <p className="mt-2 text-xs font-semibold text-gray-500">
                Form sẽ tự thay đổi theo loại nội dung bạn đang chỉnh sửa.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
                {formData.bannerType === "MARQUEE" ? "Nội dung dòng chữ chạy *" : "Tiêu đề banner *"}
              </label>
              <input
                type="text"
                required
                maxLength={150}
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={formData.bannerType === "MARQUEE" ? "Ví dụ: Miễn phí vận chuyển toàn quốc" : "Ví dụ: Siêu Sale Hè 2026"}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-gray-800"
              />
            </div>

            {formData.bannerType === "IMAGE" && <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Hình ảnh/video Banner *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required={formData.bannerType === "IMAGE"}
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="Dán link ảnh HOẶC chọn file từ máy bên cạnh..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-850"
                />
                <label className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-3.5 py-2 rounded-lg shadow-xs transition cursor-pointer flex items-center shrink-0">
                  <span>📁 Chọn file từ máy</span>
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const folder = file.type.startsWith("video/") ? "video" : "image_banner";
                        const result = await api.media.upload(file, folder);
                        setFormData(prev => ({ ...prev, imageUrl: result.url }));
                      } catch (error) { alert(error.message || "Không thể lưu banner."); }
                    }}
                    className="hidden"
                  />
                </label>
              </div>
              {formData.imageUrl && (
                <div className="mt-2 rounded-xl overflow-hidden border border-gray-200 h-28 bg-black flex items-center justify-center relative">
                  {formData.imageUrl.includes("video") || formData.imageUrl.endsWith(".mp4") || formData.imageUrl.startsWith("data:video") ? (
                    <video src={formData.imageUrl} controls autoPlay loop muted className="w-full h-full object-cover" />
                  ) : (
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <span className="absolute bottom-1 right-2 bg-gray-900/60 text-white text-[9px] px-1.5 py-0.5 rounded font-mono">Xem trước media</span>
                </div>
              )}
            </div>}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Link chuyển hướng khi Click</label>
              <input
                type="text"
                value={formData.linkUrl}
                onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                placeholder="Ví dụ: /products?sale=summer"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Vị trí hiển thị *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-gray-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Trạng thái hiển thị *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-gray-805"
                >
                  <option value={1}>Hoạt động</option>
                  <option value={0}>Không hoạt động</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 text-white font-bold py-2.5 rounded-xl text-sm shadow hover:bg-orange-700 transition cursor-pointer"
            >
              {editingId ? "Cập nhật Banner" : "Tạo Banner mới"}
            </button>
          </form>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div className="flex flex-wrap justify-between items-center gap-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-gray-800 tracking-tight flex items-center">
            <Layout className="h-5 w-5 mr-2 text-orange-600 animate-pulse" />
            <span>Quản lý Banner</span>
          </h2>
          <p className="text-xs text-gray-400 font-semibold mt-1">Cấu hình các banner quảng cáo trên trang chủ</p>
        </div>
        <button
          onClick={() => handleOpenAdd(activeType)}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow flex items-center space-x-1.5 transition cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          <span>{activeType === "MARQUEE" ? "Thêm dòng chữ chạy" : "Thêm Banner mới"}</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-2 flex gap-2">
        <button
          type="button"
          onClick={() => setActiveType("IMAGE")}
          className={`flex-1 py-3 rounded-xl text-xs font-black transition cursor-pointer ${
            activeType === "IMAGE" ? "bg-orange-600 text-white shadow" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Banner hình ảnh/video
        </button>
        <button
          type="button"
          onClick={() => setActiveType("MARQUEE")}
          className={`flex-1 py-3 rounded-xl text-xs font-black transition cursor-pointer ${
            activeType === "MARQUEE" ? "bg-orange-600 text-white shadow" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Dòng chữ chạy
        </button>
      </div>

      {filteredBanners.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs">
          <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500 font-bold">Chưa cấu hình banner nào hiển thị.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBanners.map((banner, idx) => {
            const bId = banner.id || banner.bannerId;
            return (
              <div key={bId || idx} className="bg-white rounded-3xl border border-gray-150 overflow-hidden shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between">
                <div>
                  <div className="w-full h-40 bg-gray-100 overflow-hidden relative">
                    {banner.bannerType === "MARQUEE" ? (
                      <div className="w-full h-full bg-gradient-to-r from-orange-600 to-pink-600 text-white flex items-center overflow-hidden">
                        <div className="whitespace-nowrap font-black text-sm px-6 animate-pulse">
                          {banner.title} • {banner.title}
                        </div>
                      </div>
                    ) : (
                      <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                    )}
                    <span className={`absolute top-3 right-3 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border shadow-sm ${
                      Number(banner.status) === 1
                        ? "bg-green-50 text-green-600 border-green-200"
                        : "bg-red-50 text-red-500 border-red-200"
                    }`}>
                      {Number(banner.status) === 1 ? "Hoạt động" : "Không hoạt động"}
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <span className="inline-flex text-[10px] font-black text-orange-700 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                      {banner.bannerType === "MARQUEE" ? "Dòng chữ chạy" : "Ảnh / Video"}
                    </span>
                    <div className="flex justify-between items-start">
                      <h3 className="font-extrabold text-sm text-gray-900 leading-tight">{banner.title}</h3>
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-lg border">Vị trí: {banner.position}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 font-bold truncate">Link: {banner.linkUrl || "Không có"}</p>
                  </div>
                </div>
                
                <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                  <button
                    type="button"
                    disabled={String(togglingId) === String(bId)}
                    onClick={() => handleToggleStatus(banner)}
                    className={`mb-2 flex w-full items-center justify-center gap-2 rounded-xl border py-2 text-xs font-black transition disabled:cursor-wait disabled:opacity-60 ${
                      Number(banner.status) === 1
                        ? "border-red-200 bg-red-50 text-red-600 hover:bg-red-100"
                        : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                    }`}
                  >
                    <Power className="h-3.5 w-3.5" />
                    {String(togglingId) === String(bId)
                      ? "Đang cập nhật..."
                      : Number(banner.status) === 1
                        ? "Chuyển sang không hoạt động"
                        : "Kích hoạt banner"}
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenEdit(banner)}
                      className="flex-1 bg-white border border-gray-250 hover:bg-gray-50 text-gray-700 font-bold py-2 rounded-xl text-xs flex items-center justify-center space-x-1 transition cursor-pointer"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      <span>Chỉnh sửa</span>
                    </button>
                    <button
                      onClick={() => handleDelete(bId)}
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2 rounded-xl text-xs flex items-center justify-center space-x-1 transition cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Xóa bỏ</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
