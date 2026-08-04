import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CreditCard, Download, RefreshCw } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { DataTable } from "../../components/DataTable";
import { api } from "../../services/api";

export function AdminTransactions() {
  const { orders = [], loadUserData } = useApp();
  const [payments, setPayments] = useState(() => {
    try {
      const cached = JSON.parse(localStorage.getItem("foxstyle_admin_payments") || "[]");
      return Array.isArray(cached) ? cached : [];
    } catch {
      return [];
    }
  });
  const [methodFilter, setMethodFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const latestRequestRef = useRef(0);
  const loadUserDataRef = useRef(loadUserData);

  useEffect(() => {
    loadUserDataRef.current = loadUserData;
  }, [loadUserData]);

  const loadPayments = useCallback(async () => {
    const requestId = ++latestRequestRef.current;
    setIsLoading(true);
    try {
      const response = await api.payments.getAllPayments();
      if (requestId !== latestRequestRef.current) return;
      const payload = response?.data;
      const nextPayments = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.content)
          ? payload.content
          : null;
      if (nextPayments === null) {
        throw new Error("Dữ liệu giao dịch trả về không đúng định dạng.");
      }
      setPayments((current) => {
        if (nextPayments.length === 0 && current.length > 0) return current;
        localStorage.setItem("foxstyle_admin_payments", JSON.stringify(nextPayments));
        return nextPayments;
      });
      Promise.resolve(loadUserDataRef.current()).catch((error) => {
        console.warn("Không thể làm mới thông tin đơn hàng cho giao dịch:", error);
      });
    } catch (error) {
      console.error("Không thể tải lịch sử giao dịch:", error);
      const hasCachedPayments = localStorage.getItem("foxstyle_admin_payments");
      if (!hasCachedPayments) alert(error.message || "Không thể tải lịch sử giao dịch.");
    } finally {
      if (requestId === latestRequestRef.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  const latestPayments = useMemo(() => {
    const byOrder = new Map();

    payments.forEach(payment => {
      const orderKey = String(payment.orderId || "");
      if (!orderKey) return;

      const current = byOrder.get(orderKey);
      if (!current || Number(payment.paymentId || 0) > Number(current.paymentId || 0)) {
        byOrder.set(orderKey, payment);
      }
    });

    return Array.from(byOrder.values());
  }, [payments]);

  const transactions = useMemo(() => latestPayments.map(payment => {
    const order = orders.find(item =>
      Number(item.orderIdDb || String(item.id).replace("DH", "")) === Number(payment.orderId)
    ) || {};
    const orderTotal = Number(order.total);
    const paymentAmount = Number(payment.amount || 0);
    const methodCode = String(payment.paymentMethod || "").toUpperCase();
    const isTransfer = methodCode === "TRANSFER" || methodCode === "PAYOS";
    const paymentStatus = Number(payment.paymentStatus);
    const orderStatus = String(order.status || "").toLowerCase();
    const isCancelledOrder = orderStatus === "cancelled" || orderStatus === "returned";

    return {
      id: payment.paymentId,
      orderCode: `DH${payment.orderId}`,
      paymentRecordId: `PAY-${payment.paymentId}`,
      transactionId: payment.transactionId || "Chưa có",
      reconCode: payment.reconciliationCode || "Chưa đối soát",
      customerName: order.customerName || "Khách hàng",
      phone: order.phone || "",
      method: isTransfer ? "Chuyển khoản PayOS/VietQR" : "Thanh toán COD",
      methodKey: isTransfer ? "transfer" : "cod",
      amount: Number.isFinite(orderTotal) && orderTotal > 0 ? orderTotal : paymentAmount,
      paymentStatus,
      paymentTime: payment.paymentDate
        ? new Date(payment.paymentDate).toLocaleString("vi-VN")
        : "",
      status: paymentStatus === 2 || isCancelledOrder
        ? "cancelled"
        : paymentStatus === 0
          ? "unpaid"
          : payment.reconciled ? "reconciled" : "pending",
      isReconciled: Boolean(payment.reconciled),
      reconciledAt: payment.reconciledAt
        ? new Date(payment.reconciledAt).toLocaleString("vi-VN")
        : "",
      reconciledBy: payment.reconciledBy || ""
    };
  }), [orders, latestPayments]);

  const filteredTransactions = transactions.filter(transaction => {
    if (methodFilter !== "all" && transaction.methodKey !== methodFilter) return false;
    if (statusFilter !== "all" && transaction.status !== statusFilter) return false;
    return true;
  });

  const reconciledTotal = transactions
    .filter(transaction => transaction.isReconciled)
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const pendingTotal = transactions
    .filter(transaction => transaction.status === "pending")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const unpaidTotal = transactions
    .filter(transaction => transaction.status === "unpaid")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  const refundedTotal = transactions
    .filter(transaction => transaction.status === "cancelled")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const toggleReconciliation = async transaction => {
    if (transaction.paymentStatus !== 1) {
      alert("Chỉ được đối soát giao dịch đã thanh toán thành công.");
      return;
    }
    try {
      await api.payments.updateReconciliation(
        transaction.id,
        !transaction.isReconciled
      );
      await loadPayments();
    } catch (error) {
      alert(error.message || "Không thể cập nhật trạng thái đối soát.");
    }
  };

  const exportCsv = () => {
    const rows = [
      ["Mã thanh toán", "Mã đơn", "Mã giao dịch", "Mã đối soát", "Khách hàng",
        "Phương thức", "Số tiền", "Trạng thái", "Thời gian thanh toán"],
      ...filteredTransactions.map(transaction => [
        transaction.paymentRecordId,
        transaction.orderCode,
        transaction.transactionId,
        transaction.reconCode,
        transaction.customerName,
        transaction.method,
        transaction.amount,
        transaction.status,
        transaction.paymentTime
      ])
    ];
    const csv = "\uFEFF" + rows.map(row =>
      row.map(value => `"${String(value ?? "").replace(/"/g, '""')}"`).join(",")
    ).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `lich-su-giao-dich-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const columns = [
    {
      header: "Giao dịch / Đơn hàng",
      accessor: "paymentRecordId",
      render: (value, transaction) => (
        <div>
          <div className="font-mono text-xs font-black text-gray-900">{value}</div>
          <div className="text-xs font-bold text-orange-600">{transaction.orderCode}</div>
        </div>
      )
    },
    {
      header: "Mã cổng / Đối soát",
      accessor: "transactionId",
      render: (value, transaction) => (
        <div className="max-w-52 text-xs">
          <div className="font-mono text-gray-700">{value}</div>
          <div className="mt-1 font-mono font-bold text-emerald-700">{transaction.reconCode}</div>
        </div>
      )
    },
    {
      header: "Khách hàng",
      accessor: "customerName",
      render: (value, transaction) => (
        <div>
          <div className="text-xs font-bold">{value}</div>
          <div className="text-[11px] text-gray-400">{transaction.phone}</div>
        </div>
      )
    },
    { header: "Phương thức", accessor: "method" },
    {
      header: "Số tiền",
      accessor: "amount",
      render: value => (
        <span className="font-black text-emerald-600">
          {value.toLocaleString("vi-VN")}đ
        </span>
      )
    },
    { header: "Thời gian", accessor: "paymentTime" },
    {
      header: "Đối soát",
      accessor: "status",
      render: (value, transaction) => (
        <button
          type="button"
          disabled={value === "cancelled" || value === "unpaid"}
          onClick={() => toggleReconciliation(transaction)}
          className={`rounded-full border px-3 py-1 text-[10px] font-black ${
            value === "reconciled"
              ? "border-emerald-300 bg-emerald-50 text-emerald-700"
              : value === "cancelled"
                ? "cursor-not-allowed border-red-200 bg-red-50 text-red-700"
                : value === "unpaid"
                  ? "cursor-not-allowed border-gray-200 bg-gray-50 text-gray-700"
                  : "border-amber-300 bg-amber-50 text-amber-700"
          }`}
        >
          {value === "reconciled"
            ? "Đã đối soát"
            : value === "cancelled"
              ? "Đã hủy/hoàn"
              : value === "unpaid" ? "Chưa thanh toán" : "Chờ đối soát"}
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-gray-100 bg-white p-5">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-black text-gray-900">
            <CreditCard className="h-6 w-6 text-orange-600" />
            Lịch sử giao dịch và đối soát
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Đồng bộ trực tiếp từ đơn hàng, thanh toán và dữ liệu đối soát trong database.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadPayments} disabled={isLoading}
            className="flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold disabled:opacity-60">
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Làm mới
          </button>
          <button onClick={exportCsv}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white">
            <Download className="h-4 w-4" />
            Xuất CSV
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Đã đối soát", reconciledTotal, "text-emerald-700 bg-emerald-50 border-emerald-200"],
          ["Chờ đối soát", pendingTotal, "text-amber-700 bg-amber-50 border-amber-200"],
          ["Chưa thanh toán", unpaidTotal, "text-gray-700 bg-gray-50 border-gray-200"],
          ["Giá trị hủy/hoàn", refundedTotal, "text-red-700 bg-red-50 border-red-200"]
        ].map(([label, value, color]) => (
          <div key={label} className={`rounded-2xl border p-5 ${color}`}>
            <div className="text-[10px] font-black uppercase">{label}</div>
            <div className="mt-1 text-2xl font-black">{value.toLocaleString("vi-VN")}đ</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 rounded-2xl border bg-white p-4">
        <select value={methodFilter} onChange={event => setMethodFilter(event.target.value)}
          className="rounded-xl border px-3 py-2 text-xs font-bold">
          <option value="all">Tất cả phương thức</option>
          <option value="transfer">PayOS/VietQR</option>
          <option value="cod">COD</option>
        </select>
        <select value={statusFilter} onChange={event => setStatusFilter(event.target.value)}
          className="rounded-xl border px-3 py-2 text-xs font-bold">
          <option value="all">Tất cả trạng thái</option>
          <option value="reconciled">Đã đối soát</option>
          <option value="pending">Chờ đối soát</option>
          <option value="unpaid">Chưa thanh toán</option>
          <option value="cancelled">Đã hủy/hoàn</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={filteredTransactions}
        searchPlaceholder="Tìm mã giao dịch, mã đơn, khách hàng..."
        searchKeys={["paymentRecordId", "transactionId", "reconCode", "orderCode", "customerName"]}
        itemsPerPage={10}
      />
    </div>
  );
}
