import { useState } from "react";
import { User, Mail, Phone, MapPin, Lock, Heart, Shield, LogIn, Star, Plus, Edit, Trash2, ShoppingBag } from "lucide-react";
import { useApp } from "../context/AppContext";
import { Link } from "react-router";

export function AccountPage() {
  const {
    currentUser,
    updateProfile,
    addressBook,
    addAddress,
    updateAddress,
    deleteAddress,
    wishlist,
    products,
    toggleWishlist
  } = useApp();

  const [activeTab, setActiveTab] = useState("profile");

  // Profile Form State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: currentUser?.fullName || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
  });

  // Address Dialog Form State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    id: null,
    fullName: "",
    phone: "",
    detailAddress: "",
    district: "",
    city: "Hà Nội",
    isDefault: false
  });

  // Password change State
  const [pwdForm, setPwdForm] = useState({
    oldPwd: "",
    newPwd: "",
    confirmPwd: ""
  });

  if (!currentUser) {
    return (
      <div className="bg-gray-50 min-h-screen py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-3xl border border-gray-100 shadow-md">
          <LogIn className="h-16 w-16 text-orange-500 mx-auto mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Đăng nhập tài khoản</h2>
          <p className="text-gray-500 text-sm mb-6">Bạn cần đăng nhập để truy cập trang thông tin tài khoản.</p>
          <p className="text-xs text-gray-400 bg-gray-50 p-3 rounded-lg border leading-relaxed mb-6 font-semibold">
            Vui lòng nhấn nút "Đăng nhập" trên thanh điều hướng góc phải và đăng nhập nhanh bằng tài khoản thử nghiệm để tiếp tục.
          </p>
        </div>
      </div>
    );
  }

  // Get user addresses
  const userAddresses = addressBook.filter(a => a.userId === currentUser.id);

  // Get user liked products
  const likedProducts = products.filter(p => wishlist.includes(p.id));

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    updateProfile(profileData.fullName, profileData.email, profileData.phone);
    setIsEditingProfile(false);
    alert("Cập nhật thông tin tài khoản thành công!");
  };

  const handleOpenAddressModal = (addr = null) => {
    if (addr) {
      setAddressForm({
        id: addr.id,
        fullName: addr.fullName,
        phone: addr.phone,
        detailAddress: addr.detailAddress,
        district: addr.district,
        city: addr.city,
        isDefault: addr.isDefault
      });
    } else {
      setAddressForm({
        id: null,
        fullName: currentUser.fullName,
        phone: currentUser.phone || "",
        detailAddress: "",
        district: "",
        city: "Hà Nội",
        isDefault: userAddresses.length === 0 // Default true if first address
      });
    }
    setShowAddressModal(true);
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!addressForm.fullName || !addressForm.phone || !addressForm.detailAddress || !addressForm.district) {
      alert("Vui lòng nhập đầy đủ các trường thông tin địa chỉ!");
      return;
    }

    if (addressForm.id) {
      updateAddress(addressForm.id, addressForm);
      alert("Cập nhật địa chỉ nhận hàng thành công!");
    } else {
      addAddress(addressForm);
      alert("Thêm địa chỉ nhận hàng mới thành công!");
    }
    setShowAddressModal(false);
  };

  const handleDeleteAddress = (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
      deleteAddress(id);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (pwdForm.newPwd.length < 8) {
      alert("Mật khẩu mới phải dài tối thiểu 8 ký tự!");
      return;
    }
    if (pwdForm.newPwd !== pwdForm.confirmPwd) {
      alert("Mật khẩu nhập lại không trùng khớp!");
      return;
    }
    alert("Đổi mật khẩu thành công! (Mockup)");
    setPwdForm({ oldPwd: "", newPwd: "", confirmPwd: "" });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Tài khoản của tôi</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* --- Navigation Sidebar Tabs --- */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-pink-600 text-white font-black text-2xl rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border-2 border-white">
                {currentUser.fullName.charAt(0)}
              </div>
              <h2 className="font-extrabold text-gray-800 text-base">{currentUser.fullName}</h2>
              <p className="text-xs text-orange-600 font-semibold capitalize mt-1 flex items-center justify-center">
                <Shield className="h-3 w-3 mr-1" />
                <span>{currentUser.role}</span>
              </p>
            </div>

            <nav className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-1 text-sm font-semibold text-gray-600">
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-xl transition ${activeTab === "profile" ? "bg-orange-50 text-orange-600" : "hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                <User className="h-4 w-4" />
                <span>Thông tin cá nhân</span>
              </button>
              <button
                onClick={() => setActiveTab("addresses")}
                className={`w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-xl transition ${activeTab === "addresses" ? "bg-orange-50 text-orange-600" : "hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                <MapPin className="h-4 w-4" />
                <span>Sổ địa chỉ ({userAddresses.length})</span>
              </button>
              <Link
                to="/orders"
                className="w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-xl transition hover:bg-gray-50 hover:text-gray-900"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Đơn hàng của tôi</span>
              </Link>
              <button
                onClick={() => setActiveTab("wishlist")}
                className={`w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-xl transition ${activeTab === "wishlist" ? "bg-orange-50 text-orange-600" : "hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                <Heart className="h-4 w-4" />
                <span>Sản phẩm yêu thích ({likedProducts.length})</span>
              </button>
              <button
                onClick={() => setActiveTab("password")}
                className={`w-full flex items-center space-x-2.5 px-4 py-2.5 rounded-xl transition ${activeTab === "password" ? "bg-orange-50 text-orange-600" : "hover:bg-gray-50 hover:text-gray-900"
                  }`}
              >
                <Lock className="h-4 w-4" />
                <span>Đổi mật khẩu</span>
              </button>
            </nav>
          </div>

          {/* --- Tab Contents Panel --- */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm">

              {/* Tab 1: Profile Information */}
              {activeTab === "profile" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <h3 className="text-xl font-bold text-gray-800">Thông tin cá nhân</h3>
                    {!isEditingProfile && (
                      <button
                        onClick={() => setIsEditingProfile(true)}
                        className="bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-orange-700 shadow transition"
                      >
                        Chỉnh sửa
                      </button>
                    )}
                  </div>

                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Tên tài khoản (Username)</label>
                        <input
                          type="text"
                          disabled
                          value={currentUser.username}
                          className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-sm text-gray-500 font-semibold cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Họ và tên</label>
                        <input
                          type="text"
                          required
                          disabled={!isEditingProfile}
                          value={profileData.fullName}
                          onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50 disabled:text-gray-700"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Địa chỉ Email</label>
                        <input
                          type="email"
                          required
                          disabled={!isEditingProfile}
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50 disabled:text-gray-700"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Số điện thoại</label>
                        <input
                          type="tel"
                          disabled={!isEditingProfile}
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-gray-50 disabled:text-gray-700"
                        />
                      </div>
                    </div>

                    {isEditingProfile && (
                      <div className="flex space-x-3 mt-6 pt-4 border-t border-gray-100">
                        <button
                          type="submit"
                          className="flex-1 bg-orange-600 text-white font-bold py-2 rounded-lg hover:bg-orange-700 transition text-sm"
                        >
                          Lưu thay đổi
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setProfileData({
                              fullName: currentUser.fullName,
                              email: currentUser.email,
                              phone: currentUser.phone || ""
                            });
                            setIsEditingProfile(false);
                          }}
                          className="flex-1 border border-gray-300 font-bold py-2 rounded-lg hover:bg-gray-50 transition text-sm text-gray-700"
                        >
                          Hủy
                        </button>
                      </div>
                    )}
                  </form>
                </div>
              )}

              {/* Tab 2: Address Book */}
              {activeTab === "addresses" && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center pb-3 border-b">
                    <h3 className="text-xl font-bold text-gray-800">Sổ địa chỉ nhận hàng</h3>
                    <button
                      onClick={() => handleOpenAddressModal(null)}
                      className="bg-orange-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-orange-700 shadow flex items-center space-x-1.5 transition"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Thêm địa chỉ mới</span>
                    </button>
                  </div>

                  {userAddresses.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed text-gray-500 text-sm">
                      Bạn chưa cấu hình địa chỉ nhận hàng nào.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {userAddresses.map((addr) => (
                        <div key={addr.id} className="border border-gray-200 rounded-2xl p-5 relative flex justify-between gap-4">
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-extrabold text-gray-900 text-sm">{addr.fullName}</p>
                              {addr.isDefault && (
                                <span className="bg-orange-100 text-orange-700 font-bold text-[9px] px-2 py-0.5 rounded-full uppercase">Mặc định</span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1 font-semibold flex items-center">
                              <Phone className="h-3 w-3 mr-1" />
                              {addr.phone}
                            </p>
                            <p className="text-xs text-gray-600 mt-2 font-medium">
                              {addr.detailAddress}, {addr.district}, {addr.city}
                            </p>
                          </div>

                          <div className="flex space-x-1 self-start">
                            <button
                              onClick={() => handleOpenAddressModal(addr)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Sửa địa chỉ"
                            >
                              <Edit className="h-4.5 w-4.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Xóa địa chỉ"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Wishlist (Favorites) */}
              {activeTab === "wishlist" && (
                <div className="space-y-6">
                  <div className="pb-3 border-b">
                    <h3 className="text-xl font-bold text-gray-800">Sản phẩm yêu thích</h3>
                  </div>

                  {likedProducts.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed text-gray-500 text-sm">
                      Bạn chưa lưu thích sản phẩm nào.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {likedProducts.map((prod) => (
                        <div key={prod.id} className="border border-gray-100 rounded-2xl p-4 flex gap-4 items-center">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-16 h-16 object-cover rounded-xl border"
                          />
                          <div className="flex-1 min-w-0">
                            <Link to={`/products/${prod.id}`} className="font-bold text-gray-800 text-sm hover:text-orange-600 transition truncate block">
                              {prod.name}
                            </Link>
                            <p className="text-sm font-extrabold text-orange-600 mt-1">
                              {prod.price.toLocaleString('vi-VN')}đ
                            </p>
                          </div>
                          <button
                            onClick={() => toggleWishlist(prod.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition"
                            title="Xóa khỏi danh sách"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 4: Change Password */}
              {activeTab === "password" && (
                <div className="space-y-6">
                  <div className="pb-3 border-b">
                    <h3 className="text-xl font-bold text-gray-800">Đổi mật khẩu</h3>
                  </div>

                  <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Mật khẩu cũ *</label>
                      <input
                        type="password"
                        required
                        value={pwdForm.oldPwd}
                        onChange={(e) => setPwdForm({ ...pwdForm, oldPwd: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="••••••••"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Mật khẩu mới *</label>
                      <input
                        type="password"
                        required
                        value={pwdForm.newPwd}
                        onChange={(e) => setPwdForm({ ...pwdForm, newPwd: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Tối thiểu 8 ký tự"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Xác nhận mật khẩu mới *</label>
                      <input
                        type="password"
                        required
                        value={pwdForm.confirmPwd}
                        onChange={(e) => setPwdForm({ ...pwdForm, confirmPwd: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        placeholder="Nhập lại mật khẩu mới"
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-orange-700 shadow transition text-sm"
                    >
                      Đổi mật khẩu
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>

      {/* --- Add / Edit Address Dialog Modal --- */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[999] backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full relative overflow-hidden border border-gray-100 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-pink-600 p-5 text-white flex justify-between items-center">
              <h3 className="text-lg font-bold">{addressForm.id ? "Cập nhật địa chỉ" : "Thêm địa chỉ nhận hàng"}</h3>
              <button onClick={() => setShowAddressModal(false)} className="hover:bg-white/20 p-1.5 rounded-full transition">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body Form */}
            <form onSubmit={handleAddressSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Họ và tên người nhận *</label>
                <input
                  type="text"
                  required
                  value={addressForm.fullName}
                  onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                  placeholder="Ví dụ: Nguyễn Văn A"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Số điện thoại *</label>
                <input
                  type="tel"
                  required
                  value={addressForm.phone}
                  onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                  placeholder="Số điện thoại nhận hàng"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Số nhà, ngõ ngách, tên đường *</label>
                <input
                  type="text"
                  required
                  value={addressForm.detailAddress}
                  onChange={(e) => setAddressForm({ ...addressForm, detailAddress: e.target.value })}
                  placeholder="Ví dụ: 12 Ngõ 34 Phố Hàng Khay"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Quận / Huyện *</label>
                  <input
                    type="text"
                    required
                    value={addressForm.district}
                    onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                    placeholder="Ví dụ: Hoàn Kiếm"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Thành phố *</label>
                  <select
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 font-semibold"
                  >
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="TP HCM">TP Hồ Chí Minh</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Hải Phòng">Hải Phòng</option>
                    <option value="Cần Thơ">Cần Thơ</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="addr-default"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                  className="text-orange-600 rounded focus:ring-orange-500 h-4 w-4"
                />
                <label htmlFor="addr-default" className="text-xs text-gray-600 font-bold cursor-pointer">Đặt làm địa chỉ mặc định</label>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 text-white font-bold py-2.5 rounded-xl text-sm shadow hover:bg-orange-700 transition"
              >
                {addressForm.id ? "Lưu địa chỉ" : "Tạo mới địa chỉ"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// Dialog Close helper icon
function XIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
