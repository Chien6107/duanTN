import { useState } from "react";
import { Search, UserCheck, UserX, ShieldCheck } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { DataTable } from "../../components/DataTable";
import { Button } from "../../components/Button";

export function AdminCustomers() {
  const { users, updateUserStatus } = useApp();
  const [roleFilter, setRoleFilter] = useState("all");

  const filteredUsers = users.filter((u) => {
    if (roleFilter !== "all" && u.role !== roleFilter) {
      return false;
    }
    return true;
  });

  const handleToggleStatus = (userId, currentStatus) => {
    const nextStatus = currentStatus === 1 ? 0 : 1;
    const actionWord = nextStatus === 1 ? "mở khóa" : "khóa";
    if (confirm(`Bạn có chắc chắn muốn ${actionWord} tài khoản ID: ${userId}?`)) {
      updateUserStatus(userId, nextStatus);
      alert(`Đã ${actionWord} tài khoản thành công!`);
    }
  };

  // Define columns for DataTable
  const columns = [
    {
      header: "Họ và tên",
      accessor: "fullName",
      render: (fullName) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 text-white font-bold text-sm flex items-center justify-center shadow-sm">
            {fullName.charAt(0)}
          </div>
          <span className="font-extrabold text-gray-905">{fullName}</span>
        </div>
      )
    },
    {
      header: "Tên tài khoản",
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
        <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
          role === "admin"
            ? "bg-purple-50 text-purple-700 border border-purple-100"
            : role === "staff"
            ? "bg-blue-50 text-blue-700 border border-blue-100"
            : "bg-gray-100 text-gray-750 border"
        }`}>
          {role === "admin" ? "Quản trị" : role === "staff" ? "Nhân viên" : "Khách hàng"}
        </span>
      )
    },
    {
      header: "Trạng thái",
      accessor: "status",
      render: (status) => (
        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
          status === 1 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
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
            <Button
              variant="outline"
              size="sm"
              icon={user.status === 1 ? UserX : UserCheck}
              onClick={() => handleToggleStatus(id, user.status)}
              className={user.status === 1 ? "text-red-650 border-red-200 hover:bg-red-50" : "text-green-650 border-green-200 hover:bg-green-50"}
            >
              {user.status === 1 ? "Khóa" : "Kích hoạt"}
            </Button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Role Selector Tabs */}
      <div className="flex items-center space-x-2 bg-gray-100 rounded-xl p-1 text-xs font-bold text-gray-500 w-full md:w-auto overflow-x-auto whitespace-nowrap">
        {[
          { id: "all", label: "Tất cả" },
          { id: "customer", label: "Khách hàng" },
          { id: "staff", label: "Nhân viên" },
          { id: "admin", label: "Quản trị viên" }
        ].map(rOpt => (
          <button
            key={rOpt.id}
            onClick={() => setRoleFilter(rOpt.id)}
            className={`px-4 py-2 rounded-lg transition ${
              roleFilter === rOpt.id ? "bg-white text-gray-900 shadow-sm" : "hover:text-gray-900"
            }`}
          >
            {rOpt.label}
          </button>
        ))}
      </div>

      {/* DataTable */}
      <DataTable
        columns={columns}
        data={filteredUsers}
        searchPlaceholder="Tìm tài khoản theo tên, email, sđt..."
        searchKeys={["fullName", "username", "email", "phone"]}
        itemsPerPage={5}
      />

    </div>
  );
}
