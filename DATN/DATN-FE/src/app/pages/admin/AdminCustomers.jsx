import { useState } from "react";
import { Search, UserCheck, UserX, ShieldCheck, Trash2, Crown, Sparkles, User, Users } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { DataTable } from "../../components/DataTable";
import { Button } from "../../components/Button";
import { getCompletedSpending, getMembershipTier } from "../../utils/membership";

export function AdminCustomers() {
  const { users = [], orders = [], updateUserStatus, deleteUser } = useApp();
  const [customerSegmentFilter, setCustomerSegmentFilter] = useState("all"); // "all" | "new" | "regular" | "vip"

  const allCustomers = users.filter((u) => u.role === "customer" || u.role === "GUEST");

  // Calculate customer statistics & tier
  const getCustomerTierInfo = (user) => {
    const tier = getMembershipTier(getCompletedSpending(orders, user.id));
    return {
      ...tier,
      label: tier.key === "member" ? "Thành viên" : `Hạng ${tier.name}`,
      badgeBg:
        tier.key === "diamond"
          ? "bg-cyan-100 text-cyan-800 border-cyan-300"
          : tier.key === "gold"
            ? "bg-amber-100 text-amber-800 border-amber-300"
            : tier.key === "silver"
              ? "bg-slate-100 text-slate-700 border-slate-300"
              : "bg-gray-50 text-gray-600 border-gray-200",
      icon: tier.key === "diamond" ? Sparkles : tier.key === "gold" ? Crown : UserCheck,
      discount: tier.perk
    };
  };

  const filteredUsers = allCustomers.filter((u) => {
    if (customerSegmentFilter === "all") return true;
    const tier = getCustomerTierInfo(u);
    return tier.key === customerSegmentFilter;
  });

  const handleToggleStatus = (userId, currentStatus) => {
    const nextStatus = currentStatus === 1 ? 0 : 1;
    const actionWord = nextStatus === 1 ? "mở khóa" : "khóa";
    if (confirm(`Bạn có chắc chắn muốn ${actionWord} tài khoản ID: ${userId}?`)) {
      updateUserStatus(userId, nextStatus);
      alert(`Đã ${actionWord} tài khoản thành công!`);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (confirm(`Bạn có chắc chắn muốn XÓA VĨNH VIỄN tài khoản khách hàng ID: ${userId}? Thao tác này sẽ xóa tất cả thông tin liên quan và không thể hoàn tác!`)) {
      const res = await deleteUser(userId);
      if (res.success) {
        alert("Đã xóa tài khoản thành công!");
      } else {
        alert("Lỗi! Không thể xóa tài khoản này (có thể có ràng buộc khóa ngoại đơn hàng).");
      }
    }
  };

  // Define columns for DataTable
  const columns = [
    {
      header: "Họ và tên",
      accessor: "fullName",
      render: (fullName, user) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 text-white font-bold text-sm flex items-center justify-center shadow-sm">
            {(fullName || user.username || "?").charAt(0)}
          </div>
          <div>
            <p className="font-extrabold text-gray-900">{fullName || user.username || "Khách hàng"}</p>
            <p className="text-[10px] text-gray-400 font-mono font-semibold">ID: #{user.id}</p>
          </div>
        </div>
      )
    },
    {
      header: "Phân loại Khách hàng",
      accessor: "id",
      render: (_, user) => {
        const tier = getCustomerTierInfo(user);
        const IconComp = tier.icon;
        return (
          <div className="space-y-1">
            <span className={`inline-flex items-center gap-1.5 text-xs font-black px-3 py-1 rounded-full border shadow-2xs ${tier.badgeBg}`}>
              <IconComp className="h-3.5 w-3.5" />
              <span>{tier.label}</span>
            </span>
            <p className="text-[10px] text-gray-500 font-semibold">{tier.discount}</p>
          </div>
        );
      }
    },
    {
      header: "Chi tiêu & Đơn hàng",
      accessor: "id",
      render: (_, user) => {
        const userOrders = orders.filter(
          (order) =>
            String(order.userId) === String(user.id) &&
            (order.status === "completed" || order.status === "delivered")
        );
        const totalSpent = getCompletedSpending(orders, user.id);
        return (
          <div>
            <p className="text-xs font-black text-gray-900">{userOrders.length} đơn hàng</p>
            <p className="text-xs font-bold text-orange-600 mt-0.5">{totalSpent.toLocaleString('vi-VN')}đ</p>
          </div>
        );
      }
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
      header: "Trạng thái",
      accessor: "status",
      render: (status) => (
        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
          status === 1 ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {status === 1 ? "Hoạt động" : "Bị khóa"}
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
              Được bảo vệ
            </span>
          ) : (
            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={user.status === 1 ? UserX : UserCheck}
                onClick={() => handleToggleStatus(id, user.status)}
                className={user.status === 1 ? "text-red-600 border-red-200 hover:bg-red-50" : "text-green-600 border-green-200 hover:bg-green-50"}
              >
                {user.status === 1 ? "Khóa" : "Kích hoạt"}
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

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header Segmentation Tabs */}
      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
            <Users className="h-5 w-5 text-orange-600" />
            <span>Phân Loại Khách Hàng Cũ / Mới & VIP</span>
          </h2>
          <p className="text-xs text-gray-500 font-medium">Quản lý tệp khách hàng, chiết khấu đặc quyền VIP và theo dõi số lượng đơn đặt hàng.</p>
        </div>

        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-2xl">
          {[
            ["all", "Tất cả khách hàng"],
            ["member", "Thành viên (< 2 triệu)"],
            ["silver", "Hạng Bạc (2 - <5 triệu)"],
            ["gold", "Hạng Vàng (5 - <10 triệu)"],
            ["diamond", "Kim Cương (≥10 triệu)"]
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setCustomerSegmentFilter(key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                customerSegmentFilter === key
                  ? "bg-orange-600 text-white shadow-2xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={filteredUsers}
        searchPlaceholder="Tìm tài khoản theo tên, email, sđt..."
        searchKeys={["fullName", "username", "email", "phone"]}
        itemsPerPage={8}
      />

    </div>
  );
}
