import { useEffect, useMemo, useState } from "react";
import { RefreshCw, Truck } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { DataTable } from "../../components/DataTable";

export function AdminDeliveries() {
  const { orders = [], loadUserData, updateOrderStatus } = useApp();
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  const refresh = async () => {
    setIsLoading(true);
    try {
      await loadUserData();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    const timer = window.setInterval(refresh, 30000);
    return () => window.clearInterval(timer);
  }, []);

  const deliveries = useMemo(() => orders
    .filter(order => order.trackingCode || ["shipping", "completed", "returned", "cancelled"].includes(order.status))
    .filter(order => statusFilter === "all" || order.status === statusFilter),
  [orders, statusFilter]);

  const updateDeliveryStatus = async (order, status, details = {}) => {
    const result = await updateOrderStatus(order.orderIdDb, status, details);
    if (!result?.success) alert(result?.message || "Không thể cập nhật giao hàng.");
    await refresh();
  };

  const labels = {
    shipping: "Đang giao",
    completed: "Đã giao",
    returned: "Hoàn hàng",
    cancelled: "Đã hủy"
  };

  const columns = [
    {
      header: "Đơn hàng",
      accessor: "id",
      render: (value, order) => (
        <div>
          <b>{value}</b>
          <div className="text-xs text-gray-500">{order.customerName}</div>
        </div>
      )
    },
    { header: "Hãng vận chuyển", accessor: "shippingCarrier", render: value => value || "Chưa cập nhật" },
    {
      header: "Mã vận đơn",
      accessor: "trackingCode",
      render: value => <span className="font-mono text-xs font-bold text-orange-700">{value || "Chưa có"}</span>
    },
    {
      header: "Người nhận",
      accessor: "recipientName",
      render: (_, order) => (
        <div>
          <b>{order.recipientName || order.customerName}</b>
          <div className="text-xs">{order.phone}</div>
          <div className="max-w-64 text-xs text-gray-400">{order.address}</div>
        </div>
      )
    },
    {
      header: "Số tiền",
      accessor: "total",
      render: (_, order) => {
        const total = Number(order.total || 0);
        const method = String(order.paymentMethod || "").toUpperCase();
        const codAmount = method === "TRANSFER" || method === "PAYOS" ? 0 : total;
        return (
          <div className="text-right">
            <b className="text-emerald-600">{total.toLocaleString("vi-VN")}đ</b>
            <div className="text-[11px] text-gray-400">COD: {codAmount.toLocaleString("vi-VN")}đ</div>
          </div>
        );
      }
    },
    {
      header: "Trạng thái",
      accessor: "status",
      render: value => (
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
          {labels[value] || value}
        </span>
      )
    },
    {
      header: "Cập nhật",
      accessor: "status",
      render: (_, order) => order.status === "shipping" ? (
        <div className="flex gap-2">
          <button
            onClick={() => updateDeliveryStatus(order, "completed")}
            className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white"
          >
            Đã giao
          </button>
          <button
            onClick={() => {
              const reason = prompt("Nhập lý do hoàn hàng:", "");
              if (!reason?.trim()) return;
              updateDeliveryStatus(order, "returned", {
                reason: reason.trim(),
                warrantyRedelivery: confirm("Khách muốn bảo hành/đổi để giao lại không?")
              });
            }}
            className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white"
          >
            Hoàn hàng
          </button>
        </div>
      ) : null
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-3xl border bg-white p-5">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-black">
            <Truck className="h-6 w-6 text-orange-600" />
            Quản lý giao hàng
          </h1>
          <p className="mt-1 text-xs text-gray-500">
            Đồng bộ hai chiều với quản lý đơn hàng, làm mới mỗi 30 giây.
          </p>
        </div>
        <button
          onClick={refresh}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Làm mới
        </button>
      </div>
      <div className="rounded-2xl border bg-white p-4">
        <select
          value={statusFilter}
          onChange={event => setStatusFilter(event.target.value)}
          className="rounded-xl border px-3 py-2 text-xs font-bold"
        >
          <option value="all">Tất cả</option>
          <option value="shipping">Đang giao</option>
          <option value="completed">Đã giao</option>
          <option value="returned">Hoàn hàng</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>
      <DataTable
        columns={columns}
        data={deliveries}
        searchPlaceholder="Tìm mã đơn, mã vận đơn, khách hàng..."
        searchKeys={["id", "trackingCode", "shippingCarrier", "customerName", "phone"]}
        itemsPerPage={10}
      />
    </div>
  );
}
