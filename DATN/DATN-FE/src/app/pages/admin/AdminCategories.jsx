import { useState } from "react";
import { Plus, Edit, Trash2, X, ArrowLeft, FolderTree, Tag, FileText, Sparkles } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { DataTable } from "../../components/DataTable";
import { Button } from "../../components/Button";

export function AdminCategories() {
  const { categories = [], addCategory, updateCategory, deleteCategory } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: ""
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ name: "", description: "" });
    setShowModal(true);
  };

  const handleOpenEdit = (c) => {
    setEditingId(c.id || c.categoryId);
    setFormData({ name: c.name || c.categoryName || "", description: c.description || "" });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert("Vui lòng điền tên danh mục!");
      return;
    }

    try {
      if (editingId) {
        const res = await updateCategory(editingId, formData);
        if (res && res.success) {
          alert("Cập nhật danh mục thành công!");
          setShowModal(false);
        } else {
          alert(res?.message || "Cập nhật danh mục thất bại!");
        }
      } else {
        const res = await addCategory(formData);
        if (res && res.success) {
          alert("Thêm danh mục mới thành công!");
          setShowModal(false);
        } else {
          alert(res?.message || "Thêm danh mục mới thất bại!");
        }
      }
    } catch (err) {
      alert(err.message || "Đã xảy ra lỗi!");
    }
  };

  const handleDelete = async (id) => {
    if (confirm(`Bạn có chắc chắn muốn xóa danh mục ID #${id}?`)) {
      try {
        const res = await deleteCategory(id);
        if (res && res.success) {
          alert("Xóa danh mục thành công!");
        } else {
          alert(res?.message || "Không thể xóa danh mục này (có thể do danh mục chứa sản phẩm)!");
        }
      } catch (err) {
        alert(err.message || "Đã xảy ra lỗi khi xóa danh mục!");
      }
    }
  };

  const columns = [
    {
      header: "Mã ID",
      accessor: "id",
      render: (id, cat) => (
        <span className="inline-flex items-center text-[11px] font-black text-orange-700 bg-orange-50 border border-orange-200/80 px-2.5 py-1 rounded-xl font-mono">
          #CAT-{cat.id || cat.categoryId}
        </span>
      )
    },
    {
      header: "Tên danh mục",
      accessor: "name",
      render: (name, cat) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-white font-black flex items-center justify-center text-sm shadow-md shadow-orange-500/20 shrink-0">
            {(cat.name || cat.categoryName || "C").charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="font-extrabold text-zinc-900 text-sm block capitalize group-hover:text-orange-600 transition">
              {cat.name || cat.categoryName}
            </span>
            <span className="text-[11px] font-semibold text-zinc-400">Danh mục sản phẩm</span>
          </div>
        </div>
      )
    },
    {
      header: "Mô tả chi tiết",
      accessor: "description",
      render: (desc) => (
        <div className="max-w-md">
          {desc ? (
            <span className="text-xs text-zinc-600 font-medium line-clamp-2 leading-relaxed">
              {desc}
            </span>
          ) : (
            <span className="text-[11px] font-semibold italic text-zinc-400 bg-zinc-100 px-2.5 py-0.5 rounded-full">
              Chưa có mô tả
            </span>
          )}
        </div>
      )
    },
    {
      header: "Thao tác",
      accessor: "id",
      align: "right",
      render: (id, cat) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleOpenEdit(cat)}
            className="p-2 text-zinc-600 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded-xl transition-all cursor-pointer shadow-2xs"
            title="Sửa danh mục"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(cat.id || cat.categoryId)}
            className="p-2 text-zinc-600 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-xl transition-all cursor-pointer shadow-2xs"
            title="Xóa danh mục"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  if (showModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
        <div className="max-h-[92vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-3xl bg-zinc-100 p-4 shadow-2xl">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-sm gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex items-center gap-2 text-xs font-bold text-zinc-700 hover:text-zinc-950 hover:bg-zinc-100 px-4 py-2.5 rounded-2xl transition border border-zinc-200 bg-white shadow-2xs cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" /> Quay lại
            </button>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 block">
                {editingId ? "Cập nhật danh mục" : "Thêm mới danh mục"}
              </span>
              <h3 className="text-xl font-black text-zinc-900">
                {editingId ? `Chỉnh sửa danh mục #${editingId}` : "Tạo danh mục sản phẩm mới"}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-2xl transition border border-red-200 cursor-pointer shadow-2xs"
          >
            <X className="h-4 w-4" /> Đóng
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-zinc-200/80 overflow-hidden max-w-xl mx-auto">
          <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900 p-6 text-white relative">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-600/30">
                <FolderTree className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-black text-lg text-white">
                  {editingId ? "Cập nhật thông tin danh mục" : "Thông tin danh mục mới"}
                </h4>
                <p className="text-xs text-zinc-400 font-medium mt-0.5">
                  {editingId ? `Mã danh mục đang chọn: #${editingId}` : "Nhập đầy đủ tên và mô tả chi tiết danh mục."}
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-zinc-700">
                <Tag className="h-3.5 w-3.5 text-orange-600" />
                <span>Tên danh mục *</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ví dụ: Áo sơ mi nam, Đầm nữ..."
                className="w-full h-12 px-4 bg-zinc-50 border border-zinc-300 rounded-2xl text-xs font-bold text-zinc-900 focus:bg-white focus:outline-none focus:border-orange-600 transition shadow-2xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-zinc-700">
                <FileText className="h-3.5 w-3.5 text-orange-600" />
                <span>Mô tả danh mục</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Nhập chi tiết thông tin gợi ý về các loại sản phẩm trong danh mục..."
                rows={4}
                className="w-full p-4 bg-zinc-50 border border-zinc-300 rounded-2xl text-xs font-medium text-zinc-900 focus:bg-white focus:outline-none focus:border-orange-600 transition shadow-2xs resize-none"
              />
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 h-12 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs uppercase tracking-wider rounded-2xl transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="flex-1 h-12 bg-orange-600 hover:bg-orange-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition shadow-lg shadow-orange-600/25 cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                <span>{editingId ? "Cập nhật danh mục" : "Tạo danh mục mới"}</span>
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
      {/* Top Banner & Stats Overview */}
      <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-3xl bg-orange-600 text-white flex items-center justify-center shadow-lg shadow-orange-600/30 shrink-0">
            <FolderTree className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-700 px-2.5 py-0.5 rounded-full">
                QUẢN LÝ DANH MỤC
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-zinc-100 text-zinc-600 px-2.5 py-0.5 rounded-full">
                {categories.length} danh mục
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-zinc-950 mt-1">
              Danh Mục Sản Phẩm
            </h2>
            <p className="text-xs font-semibold text-zinc-500 mt-0.5">
              Quản lý danh sách các loại sản phẩm thời trang trong cửa hàng FoxStyle.
            </p>
          </div>
        </div>

        <Button icon={Plus} onClick={handleOpenAdd} className="shadow-lg shadow-orange-600/20">
          Thêm danh mục
        </Button>
      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-sm overflow-hidden p-1">
        <DataTable
          columns={columns}
          data={categories}
          searchPlaceholder="Tìm danh mục theo tên, mô tả, ID..."
          searchKeys={["name", "categoryName", "description", "id", "categoryId"]}
          itemsPerPage={8}
        />
      </div>
    </div>
  );
}
