import { useState } from "react";
import { Plus, Edit, Trash2, Tag, X } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { DataTable } from "../../components/DataTable";
import { Button } from "../../components/Button";

export function AdminPromotions() {
  const { coupons, addCoupon, updateCoupon, deleteCoupon } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    code: "",
    discountType: "percent",
    discountValue: 0,
    maxDiscount: "",
    minOrderValue: 0,
    description: "",
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
    });
    setShowModal(true);
  };

  const handleOpenEdit = (c) => {
    setEditingId(c.id);
    setFormData({
      code: c.code,
      discountType: c.discountType,
      discountValue: c.discountValue,
      maxDiscount: c.maxDiscount || "",
      minOrderValue: c.minOrderValue,
      description: c.description || "",
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.code || formData.discountValue <= 0) {
      alert("Vui lòng điền mã và giá trị giảm giá hợp lệ!");
      return;
    }

    const payload = {
      code: formData.code.toUpperCase(),
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue),
      maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : undefined,
      minOrderValue: Number(formData.minOrderValue),
      description: formData.description
    };

    if (editingId) {
      updateCoupon(editingId, payload);
      alert("Cập nhật mã giảm giá thành công!");
    } else {
      addCoupon(payload);
      alert("Tạo mã giảm giá mới thành công!");
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (confirm(`Bạn có chắc chắn muốn xóa mã giảm giá này?`)) {
      deleteCoupon(id);
      alert("Đã xóa mã giảm giá thành công!");
    }
  };

  const handleToggleStatus = (id, currentStatus) => {
    const nextStatus = currentStatus === 1 ? 0 : 1;
    updateCoupon(id, { status: nextStatus });
  };

  // Define columns for DataTable
  const columns = [
    {
      header: "Mã Coupon",
      accessor: "code",
      render: (code, coupon) => (
        <div className="flex items-center space-x-2.5">
          <Tag className="h-4.5 w-4.5 text-orange-500" />
          <div>
            <p className="font-extrabold text-gray-900 font-mono tracking-wide">{code}</p>
            <p className="text-xs text-gray-400 mt-0.5 max-w-[200px] truncate">{coupon.description || "Không có mô tả"}</p>
          </div>
        </div>
      )
    },
    {
      header: "Giá trị giảm",
      accessor: "discountValue",
      render: (discountValue, coupon) => (
        <span className="font-bold text-gray-805">
          {coupon.discountType === "percent" ? `${discountValue}%` : `${discountValue.toLocaleString('vi-VN')}đ`}
        </span>
      )
    },
    {
      header: "Hóa đơn tối thiểu",
      accessor: "minOrderValue",
      render: (minOrderValue) => <span className="text-gray-500 font-semibold">{minOrderValue.toLocaleString('vi-VN')}đ</span>
    },
    {
      header: "Giảm tối đa",
      accessor: "maxDiscount",
      render: (maxDiscount) => <span className="text-gray-500 font-semibold">{maxDiscount ? `${maxDiscount.toLocaleString('vi-VN')}đ` : "Không giới hạn"}</span>
    },
    {
      header: "Trạng thái",
      accessor: "status",
      render: (status, coupon) => (
        <button
          onClick={() => handleToggleStatus(coupon.id, status)}
          className="flex items-center transition"
          title={status === 1 ? "Click để ẩn" : "Click để kích hoạt"}
        >
          {status === 1 ? (
            <span className="bg-green-50 text-green-705 font-bold text-xs px-2.5 py-1 rounded-full uppercase border border-green-200">Kích hoạt</span>
          ) : (
            <span className="bg-gray-100 text-gray-400 font-bold text-xs px-2.5 py-1 rounded-full uppercase border">Tạm ẩn</span>
          )}
        </button>
      )
    },
    {
      header: "Thao tác",
      accessor: "id",
      align: "right",
      render: (id, coupon) => (
        <div className="flex items-center justify-end space-x-1">
          <button
            onClick={() => handleOpenEdit(coupon)}
            className="p-2 text-blue-650 hover:bg-blue-50 rounded-xl transition"
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
        data={coupons}
        searchPlaceholder="Tìm kiếm theo mã coupon..."
        searchKeys={["code", "description"]}
        itemsPerPage={5}
        actions={
          <Button icon={Plus} onClick={handleOpenAdd}>
            Thêm mã giảm giá
          </Button>
        }
      />

      {/* Add / Edit Modal Dialog */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[999] backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full relative overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-pink-600 p-5 text-white flex justify-between items-center">
              <h3 className="text-lg font-bold">{editingId ? "Cập nhật mã giảm giá" : "Thêm mã giảm giá mới"}</h3>
              <button onClick={() => setShowModal(false)} className="hover:bg-white/20 p-1.5 rounded-full transition">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Mã giảm giá (Coupon Code) *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Ví dụ: FOXSTYLE50"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 uppercase font-bold tracking-wider"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Loại giảm giá</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold"
                  >
                    <option value="percent">Giảm theo %</option>
                    <option value="fixed">Giảm số tiền cố định</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Giá trị giảm *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Đơn tối thiểu *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Giảm tối đa (Nếu giảm theo %)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    placeholder="Để trống nếu không giới hạn"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Mô tả hiển thị khách hàng</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ví dụ: Giảm 50% tối đa 100k cho đơn từ 200k..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 text-white font-bold py-2.5 rounded-xl text-sm shadow hover:bg-orange-700 transition"
              >
                {editingId ? "Cập nhật mã" : "Tạo mã giảm giá"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
