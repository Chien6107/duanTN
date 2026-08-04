import { useState } from "react";
import { Plus, UserCheck, UserX, ShieldCheck, X, Trash2, ArrowLeft, KeyRound } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { DataTable } from "../../components/DataTable";
import { Button } from "../../components/Button";
import { isStrongPassword, PASSWORD_MESSAGE } from "../../utils/passwordPolicy";

export function AdminStaff() {
  const { users, updateUserStatus, createStaffUser, deleteUser, updateStaffPassword } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [citizenIdVerify, setCitizenIdVerify] = useState("");
  const [isSubmittingPass, setIsSubmittingPass] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    phone: "",
    citizenId: "",
    address: ""
  });

  const staffUsers = users.filter((u) => u.role === "staff" || u.role === "admin");

  const handleToggleStatus = (userId, currentStatus) => {
    const nextStatus = currentStatus === 1 ? 0 : 1;
    const actionWord = nextStatus === 1 ? "mở khóa và duyệt" : "khóa";
    if (confirm(`Bạn có chắc chắn muốn ${actionWord} tài khoản nhân viên này?`)) {
      updateUserStatus(userId, nextStatus);
      alert(`Đã thực hiện ${actionWord} tài khoản thành công!`);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (confirm(`Bạn có chắc chắn muốn XÓA VĨNH VIỄN tài khoản nhân viên ID: ${userId}? Thao tác này sẽ xóa tất cả thông tin liên quan và không thể hoàn tác!`)) {
      const res = await deleteUser(userId);
      if (res.success) {
        alert("Đã xóa tài khoản nhân viên thành công!");
      } else {
        alert("Lỗi! Không thể xóa nhân viên này.");
      }
    }
  };

  const handleOpenAdd = () => {
    setFormData({
      username: "",
      password: "",
      fullName: "",
      email: "",
      phone: "",
      citizenId: "",
      address: ""
    });
    setShowModal(true);
  };

  const handleOpenChangePassword = (user) => {
    setSelectedStaff(user);
    setNewPassword("");
    setConfirmPassword("");
    setCitizenIdVerify("");
    setShowPasswordModal(true);
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!/^[0-9]{12}$/.test(citizenIdVerify)) {
      alert("Vui lòng nhập đúng 12 số căn cước công dân của nhân viên!");
      return;
    }
    if (!isStrongPassword(newPassword)) {
      alert(PASSWORD_MESSAGE);
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Mật khẩu xác nhận không trùng khớp với mật khẩu mới!");
      return;
    }

    setIsSubmittingPass(true);
    const res = await updateStaffPassword(selectedStaff.id, citizenIdVerify, newPassword.trim());
    setIsSubmittingPass(false);

    if (res.success) {
      alert(`Reset mật khẩu thành công cho nhân viên "${selectedStaff.fullName || selectedStaff.username}"!`);
      setShowPasswordModal(false);
    } else {
      alert(res.message || "Reset mật khẩu thất bại. Vui lòng thử lại!");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password || !formData.fullName || !formData.email || !formData.citizenId || !formData.address) {
      alert("Vui lòng điền đầy đủ các thông tin bắt buộc!");
      return;
    }
    if (!isStrongPassword(formData.password)) {
      alert(PASSWORD_MESSAGE);
      return;
    }

    const payload = {
      username: formData.username,
      password: formData.password,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone || "",
      citizenId: formData.citizenId.trim(),
      address: formData.address.trim(),
      roleId: 2, // 2 = ROLE_STAFF in SQL database
      status: 0  // 0 = Inactive / Pending Admin approval
    };

    const res = await createStaffUser(payload);
    if (res.success) {
      alert("Tạo tài khoản nhân viên thành công! Tài khoản này đang chờ duyệt (status = 0).");
      setShowModal(false);
    } else {
      alert(`Lỗi: ${res.message}`);
    }
  };

  const columns = [
    {
      header: "Họ và tên",
      accessor: "fullName",
      render: (fullName, user) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-sm">
            {(fullName || user.username || "?").charAt(0)}
          </div>
          <span className="font-extrabold text-gray-900">{fullName || user.username || "Nhân viên"}</span>
        </div>
      )
    },
    {
      header: "Tên đăng nhập",
      accessor: "username",
      render: (username) => <span className="font-mono text-xs text-gray-400 font-bold">{username}</span>
    },
    {
      header: "Email / SĐT",
      accessor: "email",
      render: (email, user) => (
        <div>
          <p className="text-xs font-semibold text-gray-900">{email}</p>
          <p className="text-xs text-gray-400 font-bold mt-0.5">{user.phone || "N/A"}</p>
        </div>
      )
    },
    {
      header: "Vai trò",
      accessor: "role",
      render: (role) => (
        <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
          role === "admin"
            ? "bg-purple-50 text-purple-700 border border-purple-100"
            : "bg-blue-50 text-blue-700 border border-blue-100"
        }`}>
          {role === "admin" ? "Quản trị viên" : "Nhân viên"}
        </span>
      )
    },
    {
      header: "Trạng thái",
      accessor: "status",
      render: (status) => (
        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
          status === 1 
            ? "bg-green-50 text-green-700 border border-green-100" 
            : "bg-yellow-50 text-yellow-700 border border-yellow-100"
        }`}>
          {status === 1 ? "Đã duyệt / Hoạt động" : "Chờ duyệt / Bị khóa"}
        </span>
      )
    },
    {
      header: "Thao tác",
      accessor: "id",
      align: "right",
      render: (id, user) => (
        <div className="flex items-center justify-end">
          {user.role === "admin" ? (
            <span className="text-xs text-gray-400 font-semibold flex items-center pr-2">
              <ShieldCheck className="h-4 w-4 mr-1 text-purple-500" />
              Bảo vệ
            </span>
          ) : (
            <div className="flex items-center justify-end gap-1.5">
              <Button
                variant="outline"
                size="sm"
                icon={KeyRound}
                onClick={() => handleOpenChangePassword(user)}
                className="text-amber-600 border-amber-200 hover:bg-amber-50"
                title="Reset mật khẩu nhân viên"
              >
                Reset MK
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={user.status === 1 ? UserX : UserCheck}
                onClick={() => handleToggleStatus(id, user.status)}
                className={user.status === 1 ? "text-red-600 border-red-200 hover:bg-red-50" : "text-green-600 border-green-200 hover:bg-green-50"}
              >
                {user.status === 1 ? "Khóa" : "Duyệt"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                icon={Trash2}
                onClick={() => handleDeleteUser(id)}
                className="text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700"
              >
                Xóa
              </Button>
            </div>
          )}
        </div>
      )
    }
  ];

  if (showModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="max-h-[92vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-3xl bg-gray-100 p-4 shadow-2xl">
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
              Thêm tài khoản nhân viên mới
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
              Vui lòng nhập thông tin nhân viên mới
            </p>
          </div>
          <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Tên đăng nhập *</label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Ví dụ: staff_lananh"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-gray-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Mật khẩu đăng nhập *</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Ví dụ: Foxstyle@123"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold text-gray-850"
              />
              <p className="mt-1 text-[10px] text-gray-500">Tối thiểu 8 ký tự, chữ đầu in hoa, có chữ, số và ký tự đặc biệt.</p>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Họ và tên nhân viên *</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Ví dụ: Nguyễn Lan Anh"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-gray-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Địa chỉ Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="staff@foxstyle.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-gray-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Số điện thoại</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="09XXXXXXXX"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-gray-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Căn cước công dân *</label>
              <input type="text" required inputMode="numeric" maxLength={12} value={formData.citizenId} onChange={(e) => setFormData({ ...formData, citizenId: e.target.value.replace(/\D/g, "") })} placeholder="Nhập đúng 12 số CCCD" pattern="[0-9]{12}" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-bold text-gray-800" />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Địa chỉ thường trú *</label>
              <textarea required rows={3} value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Nhập địa chỉ đầy đủ của nhân viên" className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold text-gray-800 resize-none" />
            </div>

            <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4 flex gap-3.5 mt-2">
              <span className="text-xs text-yellow-800 leading-relaxed font-semibold">
                Chú ý: Tài khoản nhân viên mới tạo sẽ ở trạng thái **Chờ duyệt (Khóa)**. Quản trị viên tối cao cần bấm **"Duyệt tài khoản"** ngoài danh sách để kích hoạt.
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-orange-600 text-white font-bold py-2.5 rounded-xl text-sm shadow hover:bg-orange-700 transition cursor-pointer"
            >
              Tạo tài khoản nhân viên
            </button>
          </form>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <DataTable
        columns={columns}
        data={staffUsers}
        searchPlaceholder="Tìm kiếm nhân viên..."
        searchKeys={["fullName", "username", "email", "phone"]}
        itemsPerPage={8}
        actions={
          <Button icon={Plus} onClick={handleOpenAdd}>
            Thêm nhân viên
          </Button>
        }
      />

      {/* Modal Reset Mật Khẩu Nhân Viên */}
      {showPasswordModal && selectedStaff && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden w-full max-w-md animate-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 text-white flex items-center justify-center font-black">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-white">Reset Mật Khẩu Nhân Viên</h4>
                  <p className="text-xs text-white/80 font-medium">{selectedStaff.fullName || selectedStaff.username}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleChangePasswordSubmit} className="p-6 space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-900 font-semibold space-y-1">
                <p>Tài khoản: <strong className="font-mono text-amber-950">{selectedStaff.username}</strong></p>
                <p>Email: <strong>{selectedStaff.email}</strong></p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">Xác minh căn cước công dân *</label>
                <input type="text" required inputMode="numeric" maxLength={12} value={citizenIdVerify} onChange={(e) => setCitizenIdVerify(e.target.value.replace(/\D/g, ""))} placeholder="Nhập đúng 12 số CCCD để tiếp tục" pattern="[0-9]{12}" className="w-full px-4 py-2.5 border border-zinc-300 rounded-xl text-sm font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                <p className="mt-1 text-[11px] text-zinc-500">Sau khi nhập đủ 12 số, phần đặt mật khẩu mới sẽ hiện ra.</p>
              </div>

              {citizenIdVerify.length === 12 && <><div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                  Mật khẩu mới *
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Ví dụ: Foxstyle@123"
                  className="w-full px-4 py-2.5 border border-zinc-300 rounded-xl text-sm font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 mb-1.5">
                  Xác nhận mật khẩu mới *
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu mới..."
                  className="w-full px-4 py-2.5 border border-zinc-300 rounded-xl text-sm font-semibold text-zinc-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div></>}

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPass || citizenIdVerify.length !== 12}
                  className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmittingPass ? "Đang xử lý..." : "Reset mật khẩu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
