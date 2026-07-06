import { useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { DataTable } from "../../components/DataTable";
import { Button } from "../../components/Button";

export function AdminCategories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useApp();
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
    setEditingId(c.id);
    setFormData({ name: c.name, description: c.description || "" });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) {
      alert("Vui lòng điền tên danh mục!");
      return;
    }

    if (editingId) {
      updateCategory(editingId, formData);
      alert("Cập nhật danh mục thành công!");
    } else {
      addCategory(formData);
      alert("Thêm danh mục mới thành công!");
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (confirm(`Bạn có chắc chắn muốn xóa danh mục: ${id}?`)) {
      deleteCategory(id);
      alert("Xóa danh mục thành công!");
    }
  };

  // Define columns for DataTable
  const columns = [
    {
      header: "Tên danh mục",
      accessor: "name",
      render: (name) => <span className="font-bold text-gray-950 capitalize">{name}</span>
    },
    {
      header: "Mô tả",
      accessor: "description",
      render: (desc) => <span className="text-gray-500 max-w-xs truncate block">{desc || "Chưa có mô tả"}</span>
    },
    {
      header: "Mã định danh (Slug)",
      accessor: "id",
      render: (id) => <span className="text-xs font-semibold text-gray-400 font-mono bg-gray-50 px-2 py-1 border rounded">{id}</span>
    },
    {
      header: "Thao tác",
      accessor: "id",
      align: "right",
      render: (id, cat) => (
        <div className="flex items-center justify-end space-x-1">
          <button
            onClick={() => handleOpenEdit(cat)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition"
            title="Sửa"
          >
            <Edit className="h-4.5 w-4.5" />
          </button>
          <button
            onClick={() => handleDelete(id)}
            className="p-2 text-red-650 hover:bg-red-50 rounded-xl transition"
            title="Xóa"
          >
            <Trash2 className="h-4.5 w-4.5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* DataTable */}
      <DataTable
        columns={columns}
        data={categories}
        searchPlaceholder="Tìm kiếm danh mục..."
        searchKeys={["name", "id", "description"]}
        itemsPerPage={5}
        actions={
          <Button icon={Plus} onClick={handleOpenAdd}>
            Thêm danh mục
          </Button>
        }
      />

      {/* Add / Edit Category Dialog */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[999] backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full relative overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-pink-600 p-5 text-white flex justify-between items-center">
              <h3 className="text-lg font-bold">{editingId ? "Sửa danh mục" : "Thêm danh mục mới"}</h3>
              <button onClick={() => setShowModal(false)} className="hover:bg-white/20 p-1.5 rounded-full transition">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Tên danh mục *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Áo khoác"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Mô tả ngắn</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả các sản phẩm thuộc phân loại danh mục này..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 text-white font-bold py-2.5 rounded-xl text-sm shadow hover:bg-orange-700 transition"
              >
                {editingId ? "Cập nhật danh mục" : "Tạo danh mục mới"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
