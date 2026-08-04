import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, ArrowLeft, Award, Globe, Sparkles, Star, CheckCircle, Eye } from "lucide-react";
import { DataTable } from "../../components/DataTable";
import { Button } from "../../components/Button";
import { api } from "../../services/api";

const DEFAULT_BRANDS = [
  { id: 1, name: "FoxStyle Premium", logo: "/image_san_pham/photo-1541099649105-f69ad21f3246.jpg", country: "Việt Nam", website: "https://foxstyle.com", description: "Thương hiệu thời trang độc quyền phong cách hiện đại.", status: 1, isFeatured: true },
  { id: 2, name: "Zara", logo: "/image_quan_tri/photo-1512436991641-6745cdb1723f.jpg", country: "Tây Ban Nha", website: "https://zara.com", description: "Thời trang nhanh phong cách châu Âu.", status: 1, isFeatured: true },
  { id: 3, name: "Uniqlo", logo: "/image_san_pham/photo-1521572163474-6864f9cf17ab.jpg", country: "Nhật Bản", website: "https://uniqlo.com", description: "Trang phục tối giản LifeWear chất lượng cao.", status: 1, isFeatured: false },
  { id: 4, name: "Nike Wear", logo: "/image_quan_tri/photo-1542291026-7eec264c27ff.jpg", country: "Mỹ", website: "https://nike.com", description: "Thương hiệu thể thao và streetwear hàng đầu thế giới.", status: 1, isFeatured: true }
];

const hasBrokenBrandText = (brand) =>
  [brand?.country, brand?.description].some((value) =>
    /Ã|Â|Ä|Æ|áº|á»|â€|�|\?/.test(String(value || ""))
  );

export function AdminBrands() {
  const [brands, setBrands] = useState([]);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    logo: "",
    country: "Việt Nam",
    website: "",
    description: "",
    status: 1,
    isFeatured: false
  });

  useEffect(() => {
    api.adminData.list("brands").then((response) => setBrands(response.data || [])).catch(() => {});
  }, []);

  const handleOpenAdd = () => {
    setFormError("");
    setEditingId(null);
    setFormData({
      name: "",
      logo: "",
      country: "Việt Nam",
      website: "",
      description: "",
      status: 1,
      isFeatured: false
    });
    setShowModal(true);
  };

  const handleOpenEdit = (b) => {
    setFormError("");
    setEditingId(b.id);
    setFormData({
      name: b.name || "",
      logo: b.logo || "",
      country: b.country || "Việt Nam",
      website: b.website || "",
      description: b.description || "",
      status: b.status !== undefined ? b.status : 1,
      isFeatured: !!b.isFeatured
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const normalizedName = formData.name.trim().replace(/\s+/g, " ");
    if (!normalizedName) {
      alert("Vui lòng nhập tên thương hiệu!");
      return;
    }

    const duplicate = brands.some((brand) =>
      String(brand.name || "").trim().replace(/\s+/g, " ").toLocaleLowerCase("vi-VN") ===
        normalizedName.toLocaleLowerCase("vi-VN") && String(brand.id) !== String(editingId)
    );
    if (duplicate) {
      setFormError(`Thương hiệu "${normalizedName}" đã tồn tại.`);
      return;
    }

    setFormError("");
    setIsSubmitting(true);
    try {
    const payload = { ...formData, name: normalizedName };
    if (editingId) {
      const response = await api.adminData.update("brands", editingId, payload);
      setBrands((prev) => prev.map((b) => (String(b.id) === String(editingId) ? response.data : b)));
      alert("Cập nhật thương hiệu thành công!");
    } else {
      const response = await api.adminData.create("brands", payload);
      setBrands((prev) => [response.data, ...prev]);
      alert("Thêm thương hiệu mới thành công!");
    }
    setShowModal(false);
    } catch (error) {
      setFormError(error.message || "Không thể lưu thương hiệu. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa thương hiệu này?")) {
      await api.adminData.remove("brands", id);
      setBrands((prev) => prev.filter((b) => b.id !== id));
      alert("Đã xóa thương hiệu thành công!");
    }
  };

  const handleToggleStatus = async (id) => {
    const brand = brands.find((item) => item.id === id);
    const response = await api.adminData.update("brands", id, { ...brand, status: brand.status === 1 ? 0 : 1 });
    setBrands((prev) => prev.map((b) => (b.id === id ? response.data : b)));
  };

  const handleToggleFeatured = async (id) => {
    const brand = brands.find((item) => item.id === id);
    const response = await api.adminData.update("brands", id, { ...brand, isFeatured: !brand.isFeatured });
    setBrands((prev) => prev.map((b) => (b.id === id ? response.data : b)));
  };

  const columns = [
    {
      header: "Thương hiệu",
      accessor: "name",
      render: (name, brand) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 border border-zinc-200 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
            {brand.logo ? (
              <img src={brand.logo} alt={brand.name} className="w-full h-full object-cover rounded-xl" />
            ) : (
              <Award className="w-6 h-6 text-orange-500" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-zinc-950 text-sm">{brand.name}</span>
              {brand.isFeatured && (
                <span className="inline-flex items-center gap-0.5 text-[9px] font-black uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                  <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> Nổi bật
                </span>
              )}
            </div>
            <span className="text-[11px] font-semibold text-zinc-400">Xuất xứ: {brand.country || "Việt Nam"}</span>
          </div>
        </div>
      )
    },
    {
      header: "Website / Liên kết",
      accessor: "website",
      render: (web) => (
        web ? (
          <a href={web} target="_blank" rel="noreferrer" className="text-xs text-blue-600 font-bold hover:underline flex items-center gap-1">
            <Globe className="w-3.5 h-3.5" />
            <span>{web.replace(/^https?:\/\//, "")}</span>
          </a>
        ) : (
          <span className="text-[11px] text-zinc-400 font-medium italic">Chưa có website</span>
        )
      )
    },
    {
      header: "Mô tả",
      accessor: "description",
      render: (desc) => (
        <span className="text-xs text-zinc-600 font-medium line-clamp-2 max-w-sm">
          {desc || "Chưa có thông tin mô tả."}
        </span>
      )
    },
    {
      header: "Trạng thái",
      accessor: "status",
      render: (status, brand) => (
        <button
          onClick={() => handleToggleStatus(brand.id)}
          className={`text-xs font-bold px-3 py-1 rounded-full border transition cursor-pointer ${
            status === 1
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
              : "bg-zinc-100 text-zinc-500 border-zinc-200 hover:bg-zinc-200"
          }`}
        >
          {status === 1 ? "Hoạt động" : "Tạm ẩn"}
        </button>
      )
    },
    {
      header: "Thao tác",
      accessor: "id",
      align: "right",
      render: (id, brand) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleToggleFeatured(brand.id)}
            className={`p-2 rounded-xl transition cursor-pointer ${
              brand.isFeatured ? "text-amber-500 hover:bg-amber-50" : "text-zinc-400 hover:bg-zinc-100"
            }`}
            title={brand.isFeatured ? "Bỏ Nổi bật" : "Đánh dấu Nổi bật"}
          >
            <Star className={`h-4 w-4 ${brand.isFeatured ? "fill-amber-500" : ""}`} />
          </button>
          <button
            onClick={() => handleOpenEdit(brand)}
            className="p-2 text-zinc-600 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded-xl transition cursor-pointer"
            title="Sửa thương hiệu"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(brand.id)}
            className="p-2 text-zinc-600 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-xl transition cursor-pointer"
            title="Xóa thương hiệu"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  if (showModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="h-full max-h-screen w-full space-y-4 overflow-y-auto bg-zinc-100 p-4 shadow-2xl">
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="hidden"
            >
              <ArrowLeft className="h-4 w-4" /> Quay lại
            </button>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 block">
                {editingId ? "Cập nhật" : "Thêm mới"}
              </span>
              <h3 className="text-xl font-black text-zinc-900">
                {editingId ? "Chỉnh Sửa Thương Hiệu" : "Thêm Thương Hiệu Mới"}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-2xl transition border border-red-200 cursor-pointer"
          >
            <X className="h-4 w-4" /> Đóng
          </button>
        </div>

        <div className="w-full overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-xl">
          <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-600/30">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-black text-lg text-white">
                  {editingId ? "Thông tin thương hiệu" : "Nhập chi tiết thương hiệu mới"}
                </h4>
                <p className="text-xs text-zinc-400 font-medium">Quản lý các nhãn hàng hợp tác phân phối tại FoxStyle.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {formError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-bold text-red-700" role="alert">
                {formError}
              </div>
            )}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1.5">Tên thương hiệu *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (formError) setFormError("");
                }}
                placeholder="Ví dụ: FoxStyle Premium, Zara..."
                className="w-full h-12 px-4 bg-zinc-50 border border-zinc-300 rounded-2xl text-xs font-bold text-zinc-900 focus:bg-white focus:outline-none focus:border-orange-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1.5">Quốc gia xuất xứ</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  placeholder="Việt Nam, Mỹ, Nhật..."
                  className="w-full h-12 px-4 bg-zinc-50 border border-zinc-300 rounded-2xl text-xs font-bold text-zinc-900 focus:bg-white focus:outline-none focus:border-orange-600"
                />
              </div>
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1.5">Website chính thức</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://example.com"
                  className="w-full h-12 px-4 bg-zinc-50 border border-zinc-300 rounded-2xl text-xs font-bold text-zinc-900 focus:bg-white focus:outline-none focus:border-orange-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1.5">URL Logo thương hiệu</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.logo}
                  onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                  placeholder="Dán URL logo hoặc chọn ảnh từ máy"
                  className="min-w-0 flex-1 h-12 px-4 bg-zinc-50 border border-zinc-300 rounded-2xl text-xs font-semibold text-zinc-900 focus:bg-white focus:outline-none focus:border-orange-600"
                />
                <label className="flex h-12 shrink-0 cursor-pointer items-center rounded-2xl bg-orange-600 px-4 text-xs font-black text-white hover:bg-orange-700">
                  Chọn ảnh
                  <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                      const result = await api.media.upload(file, "image_quan_tri");
                      setFormData((current) => ({ ...current, logo: result.url }));
                    } catch (error) { alert(error.message || "Không thể lưu logo thương hiệu."); }
                  }} />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1.5">Mô tả tóm tắt</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Nhập thông tin giới thiệu về thương hiệu..."
                rows={3}
                className="w-full p-4 bg-zinc-50 border border-zinc-300 rounded-2xl text-xs font-medium text-zinc-900 focus:bg-white focus:outline-none focus:border-orange-600 resize-none"
              />
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-zinc-800">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                />
                <span>Đánh dấu Thương hiệu Nổi bật</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-zinc-800">
                <input
                  type="checkbox"
                  checked={formData.status === 1}
                  onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 1 : 0 })}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <span>Trạng thái Hoạt động</span>
              </label>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 h-12 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs uppercase tracking-wider rounded-2xl transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 h-12 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition shadow-lg shadow-orange-600/25 cursor-pointer flex items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Sparkles className="h-4 w-4" />
                <span>{editingId ? "Cập nhật thương hiệu" : "Tạo thương hiệu mới"}</span>
              </button>
            </div>
          </form>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-3xl bg-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-600/30 shrink-0">
            <Award className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full">
                QUẢN LÝ THƯƠNG HIỆU
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-zinc-100 text-zinc-600 px-2.5 py-0.5 rounded-full">
                {brands.length} đối tác
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-zinc-950 mt-1">
              Thương Hiệu Thời Trang
            </h2>
            <p className="text-xs font-semibold text-zinc-500 mt-0.5">
              Quản lý danh sách đối tác nhãn hàng phân phối chính hãng tại FoxStyle.
            </p>
          </div>
        </div>

        <Button icon={Plus} onClick={handleOpenAdd} className="shadow-lg shadow-orange-600/20">
          Thêm thương hiệu
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-sm overflow-hidden p-1">
        <DataTable
          columns={columns}
          data={brands}
          searchPlaceholder="Tìm kiếm thương hiệu theo tên, xuất xứ..."
          searchKeys={["name", "country", "description"]}
          itemsPerPage={8}
        />
      </div>
    </div>
  );
}
