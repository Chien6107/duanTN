import { useState } from "react";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { DataTable } from "../../components/DataTable";
import { Button } from "../../components/Button";

export function AdminProducts() {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useApp();
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    originalPrice: "",
    category: "ao",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
    description: "",
    sizes: "S, M, L, XL",
    colors: "Trắng, Đen, Xám",
    material: "Cotton 100%",
    origin: "Việt Nam",
    quantity: 100
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: "",
      price: 199000,
      originalPrice: "",
      category: categories[0]?.id || "ao",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500",
      description: "Mô tả chất liệu, thiết kế và thông số sản phẩm...",
      sizes: "S, M, L, XL",
      colors: "Trắng, Đen, Xám",
      material: "Cotton 100%",
      origin: "Việt Nam",
      quantity: 100
    });
    setShowModal(true);
  };

  const handleOpenEdit = (p) => {
    setEditingId(p.id);
    setFormData({
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice || "",
      category: p.category,
      image: p.image,
      description: p.description,
      sizes: p.sizes.join(", "),
      colors: p.colors.join(", "),
      material: p.material,
      origin: p.origin,
      quantity: p.quantity || 50
    });
    setShowModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || formData.price <= 0) {
      alert("Vui lòng điền tên sản phẩm và giá hợp lệ!");
      return;
    }

    const processedSizes = formData.sizes.split(",").map(s => s.trim()).filter(Boolean);
    const processedColors = formData.colors.split(",").map(c => c.trim()).filter(Boolean);

    const productPayload = {
      name: formData.name,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      category: formData.category,
      image: formData.image,
      description: formData.description,
      sizes: processedSizes,
      colors: processedColors,
      material: formData.material,
      origin: formData.origin,
      quantity: Number(formData.quantity)
    };

    if (editingId) {
      updateProduct(editingId, productPayload);
      alert("Cập nhật thông tin sản phẩm thành công!");
    } else {
      addProduct(productPayload);
      alert("Thêm sản phẩm mới thành công!");
    }

    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm ID: ${id}?`)) {
      deleteProduct(id);
      alert("Đã xóa sản phẩm thành công!");
    }
  };

  // Define columns for DataTable
  const columns = [
    {
      header: "Sản phẩm",
      accessor: "name",
      render: (name, product) => (
        <div className="flex items-center space-x-3">
          <img
            src={product.image}
            alt={name}
            className="w-12 h-12 object-cover rounded-xl border flex-shrink-0"
          />
          <div className="min-w-0">
            <p className="font-bold text-gray-900 truncate max-w-xs">{name}</p>
            <p className="text-xs text-gray-400 mt-0.5 font-bold">ID: {product.id}</p>
          </div>
        </div>
      )
    },
    {
      header: "Danh mục",
      accessor: "category",
      render: (cat) => (
        <span className="px-2.5 py-1 bg-orange-50 text-orange-600 rounded-lg text-xs font-bold border border-orange-100 uppercase">
          {cat}
        </span>
      )
    },
    {
      header: "Giá bán",
      accessor: "price",
      render: (price, product) => (
        <div>
          <p className="font-bold text-gray-900">{price.toLocaleString('vi-VN')}đ</p>
          {product.originalPrice && (
            <p className="text-xs text-gray-400 line-through">
              {product.originalPrice.toLocaleString('vi-VN')}đ
            </p>
          )}
        </div>
      )
    },
    {
      header: "Hàng tồn",
      accessor: "quantity",
      render: (qty) => (
        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
          (qty || 0) <= 0 
            ? "bg-red-50 text-red-650"
            : (qty || 0) <= 5
            ? "bg-yellow-50 text-yellow-700 animate-pulse"
            : "bg-green-50 text-green-755"
        }`}>
          {qty || 0} cái
        </span>
      )
    },
    {
      header: "Đánh giá",
      accessor: "rating",
      render: (rating, product) => (
        <div className="flex items-center space-x-1">
          <span className="font-bold text-gray-805">{rating}</span>
          <span className="text-yellow-500">★</span>
          <span className="text-xs text-gray-400">({product.reviews})</span>
        </div>
      )
    },
    {
      header: "Thao tác",
      accessor: "id",
      align: "right",
      render: (id, product) => (
        <div className="flex items-center justify-end space-x-1">
          <button
            onClick={() => handleOpenEdit(product)}
            className="p-2 text-blue-605 hover:bg-blue-50 rounded-xl transition"
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
      
      {/* Reusable DataTable */}
      <DataTable
        columns={columns}
        data={products}
        searchPlaceholder="Tìm sản phẩm theo tên..."
        searchKeys={["name", "id", "material", "origin"]}
        itemsPerPage={5}
        actions={
          <Button icon={Plus} onClick={handleOpenAdd}>
            Thêm sản phẩm
          </Button>
        }
      />

      {/* --- Add / Edit Product Modal --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[999] backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full relative overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-pink-600 p-5 text-white flex justify-between items-center">
              <h3 className="text-lg font-bold">{editingId ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới"}</h3>
              <button onClick={() => setShowModal(false)} className="hover:bg-white/20 p-1.5 rounded-full transition">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Tên sản phẩm *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ví dụ: Áo khoác Blazer đen"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Giá bán *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Giá gốc (Không bắt buộc)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="Để trống nếu không Sale"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Phân loại danh mục</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id} className="capitalize">{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Số lượng kho nhập *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Link URL hình ảnh sản phẩm</label>
                <input
                  type="text"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 font-medium">Màu sắc (Cách nhau bằng dấu phẩy)</label>
                  <input
                    type="text"
                    value={formData.colors}
                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                    placeholder="Trắng, Đen, Xám"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5 font-medium">Size (Cách nhau bằng dấu phẩy)</label>
                  <input
                    type="text"
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    placeholder="S, M, L, XL"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Chất liệu</label>
                  <input
                    type="text"
                    value={formData.material}
                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                    placeholder="Vải thun Cotton 100%"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Xuất xứ</label>
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    placeholder="Việt Nam"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Bài viết mô tả chi tiết</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 text-white font-bold py-2.5 rounded-xl text-sm shadow hover:bg-orange-700 transition"
              >
                {editingId ? "Cập nhật sản phẩm" : "Nhập hàng sản phẩm mới"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
