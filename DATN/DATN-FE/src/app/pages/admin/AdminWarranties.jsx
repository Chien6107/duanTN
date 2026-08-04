import { useEffect, useMemo, useState } from "react";
import {
  ShieldCheck, Plus, Search, Clock, CheckCircle2, Wrench,
  PackageCheck, X, Trash2, CalendarDays, Eye, Mail, Phone, Hash
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { toast } from "sonner";
import { isValidVietnamesePhone, PHONE_MESSAGE } from "../../utils/phone";
import { api } from "../../services/api";

const STORAGE_KEY = "foxstyle_warranties";

const statusMeta = {
  pending: { label: "Chờ tiếp nhận", color: "bg-amber-100 text-amber-700", icon: Clock },
  inspecting: { label: "Đang kiểm tra", color: "bg-blue-100 text-blue-700", icon: Search },
  repairing: { label: "Đang bảo hành", color: "bg-purple-100 text-purple-700", icon: Wrench },
  completed: { label: "Đã hoàn tất", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  returned: { label: "Đã trả khách", color: "bg-zinc-200 text-zinc-700", icon: PackageCheck },
};

const emptyForm = {
  customerName: "",
  phone: "",
  email: "",
  orderCode: "",
  orderName: "",
  productId: "",
  serialNumber: "",
  purchaseDate: "",
  warrantyDays: 30,
  issue: "",
  note: "",
};

const createDemoWarranties = () => {
  const statuses = ["pending", "inspecting", "repairing", "completed", "returned"];
  const products = ["Áo thun Basic FoxStyle", "Quần Jeans Denim", "Áo sơ mi công sở", "Giày Sneaker FoxStyle", "Áo khoác Bomber"];
  const issues = ["Bung đường chỉ ở tay áo", "Khóa kéo hoạt động không ổn định", "Sản phẩm bị lỗi phom dáng", "Đế giày bị bong keo", "Màu vải không đều"];
  return Array.from({ length: 12 }, (_, index) => {
    const created = new Date(Date.now() - (index + 2) * 24 * 60 * 60 * 1000);
    const expiry = new Date(created); expiry.setDate(expiry.getDate() + 30);
    const status = statuses[index % statuses.length];
    return {
      id: `demo-warranty-${index + 1}`,
      code: `BHDEMO${String(index + 1).padStart(3, "0")}`,
      customerName: `Khách Hàng Demo ${String(index + 1).padStart(2, "0")}`,
      phone: `092000${String(index + 1).padStart(4, "0")}`,
      email: `customer${index + 1}@gmail.com`,
      orderCode: `FOXDEMO${String((index % 80) + 1).padStart(6, "0")}`,
      orderName: `Đơn hàng bảo hành số ${index + 1}`,
      productId: String((index % 26) + 1),
      productName: products[index % products.length],
      serialNumber: `FS-WR-${String(index + 1).padStart(5, "0")}`,
      purchaseDate: created.toISOString().slice(0, 10),
      warrantyDays: 30,
      issue: issues[index % issues.length],
      note: "Phiếu bảo hành dữ liệu demo phục vụ trình bày.",
      status,
      createdAt: created.toISOString(),
      expiryDate: expiry.toISOString().slice(0, 10),
      history: [{ status: "pending", time: created.toISOString(), note: "Tạo phiếu bảo hành" }]
    };
  });
};

export function AdminWarranties() {
  const { products = [], orders = [] } = useApp();
  const [warranties, setWarranties] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const demo = createDemoWarranties();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
        return demo;
      }
      const saved = JSON.parse(raw);
      if (Array.isArray(saved) && saved.length > 0) return saved;
      const demo = createDemoWarranties();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
      return demo;
    } catch {
      return [];
    }
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedWarranty, setSelectedWarranty] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    api.adminData.list("warranties").then(async (response) => {
      if (response.data?.length) return persist(response.data);
      const seeded = [];
      for (const warranty of warranties) {
        const { id, ...payload } = warranty;
        seeded.push((await api.adminData.create("warranties", payload)).data);
      }
      persist(seeded);
    }).catch(() => {});
  }, []);

  const persist = (next) => {
    setWarranties(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return warranties.filter((item) => {
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const searchable = [
        item.code, item.customerName, item.phone, item.email,
        item.orderCode, item.productName, item.serialNumber
      ].join(" ").toLowerCase();
      return matchesStatus && (!keyword || searchable.includes(keyword));
    });
  }, [warranties, query, statusFilter]);

  const stats = {
    total: warranties.length,
    pending: warranties.filter((item) => item.status === "pending").length,
    processing: warranties.filter((item) => ["inspecting", "repairing"].includes(item.status)).length,
    completed: warranties.filter((item) => ["completed", "returned"].includes(item.status)).length,
  };

  const selectedOrder = orders.find((item) => String(item.id) === String(form.orderCode));
  const orderProducts = selectedOrder?.items
    ?.map((item) => item.product)
    .filter(Boolean) || products;
  const purchaseTime = form.purchaseDate ? new Date(`${form.purchaseDate}T00:00:00`).getTime() : null;
  const elapsedDays = purchaseTime
    ? Math.max(0, Math.floor((Date.now() - purchaseTime) / 86400000))
    : 0;
  const isWarrantyExpired = Boolean(
    purchaseTime && Number(form.warrantyDays) > 0 && elapsedDays > Number(form.warrantyDays)
  );

  const handleOrderChange = (orderCode) => {
    const order = orders.find((item) => String(item.id) === String(orderCode));
    const orderName = order?.items
      ?.map((item) => item.product?.name)
      .filter(Boolean)
      .join(" + ") || "";
    setForm((current) => ({
      ...current,
      orderCode,
      orderName,
      productId: "",
      customerName: order?.customerName || order?.recipientName || current.customerName,
      phone: order?.phone || current.phone,
      purchaseDate: order?.date?.slice(0, 10) || current.purchaseDate,
    }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    if (!isValidVietnamesePhone(form.phone)) {
      toast.error(PHONE_MESSAGE);
      return;
    }
    if (isWarrantyExpired) {
      toast.error(`Đơn hàng đã quá thời hạn bảo hành ${form.warrantyDays} ngày`);
      return;
    }
    const product = products.find((item) => String(item.id) === String(form.productId));
    const now = new Date();
    const expiry = new Date(form.purchaseDate || now);
    expiry.setDate(expiry.getDate() + Number(form.warrantyDays || 0));
    const payload = {
      code: `BH${String(Date.now()).slice(-8)}`,
      ...form,
      productName: product?.name || "Sản phẩm",
      status: "pending",
      createdAt: now.toISOString(),
      expiryDate: expiry.toISOString().slice(0, 10),
      history: [{ status: "pending", time: now.toISOString(), note: "Tạo phiếu bảo hành" }],
    };
    const record = (await api.adminData.create("warranties", payload)).data;
    persist([record, ...warranties]);
    setForm(emptyForm);
    setShowModal(false);
    toast.success(`Đã tạo phiếu bảo hành ${record.code}`);
  };

  const updateStatus = async (id, status) => {
    const meta = statusMeta[status];
    const changedAt = new Date().toISOString();
    const current = warranties.find((item) => item.id === id);
    const updated = (await api.adminData.update("warranties", id, {
      ...current, status, history: [...(current.history || []), { status, time: changedAt, note: meta.label }]
    })).data;
    const nextWarranties = warranties.map((item) => item.id === id ? updated : item);
    persist(nextWarranties);
    setSelectedWarranty((current) => current?.id === id
      ? nextWarranties.find((item) => item.id === id)
      : current);
    toast.success(`Đã cập nhật: ${meta.label}`);
  };

  const removeWarranty = async (id) => {
    if (!confirm("Bạn có chắc muốn xóa phiếu bảo hành này?")) return;
    await api.adminData.remove("warranties", id);
    persist(warranties.filter((item) => item.id !== id));
    setSelectedWarranty((current) => current?.id === id ? null : current);
    toast.success("Đã xóa phiếu bảo hành");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-black text-zinc-900">
            <ShieldCheck className="h-7 w-7 text-orange-600" />
            Quản trị bảo hành sản phẩm
          </h1>
          <p className="mt-1 text-xs font-medium text-zinc-500">
            Tiếp nhận, theo dõi sửa chữa và bàn giao sản phẩm bảo hành.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-xs font-black text-white shadow-md hover:bg-orange-700"
        >
          <Plus className="h-4 w-4" /> Tạo phiếu bảo hành
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          ["Tổng phiếu", stats.total, ShieldCheck, "text-zinc-700", "bg-zinc-100"],
          ["Chờ tiếp nhận", stats.pending, Clock, "text-amber-700", "bg-amber-100"],
          ["Đang xử lý", stats.processing, Wrench, "text-purple-700", "bg-purple-100"],
          ["Đã hoàn tất", stats.completed, CheckCircle2, "text-emerald-700", "bg-emerald-100"],
        ].map(([label, value, Icon, color, bg]) => (
          <div key={label} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${bg}`}>
              <Icon className={`h-5 w-5 ${color}`} />
            </div>
            <p className="text-2xl font-black text-zinc-900">{value}</p>
            <p className="text-[11px] font-black uppercase tracking-wider text-zinc-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm mã phiếu, khách hàng, đơn hàng, sản phẩm..."
            className="h-11 w-full rounded-xl border border-zinc-200 pl-10 pr-4 text-xs font-semibold outline-none focus:border-orange-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="h-11 rounded-xl border border-zinc-200 bg-white px-4 text-xs font-bold outline-none focus:border-orange-500"
        >
          <option value="all">Tất cả trạng thái</option>
          {Object.entries(statusMeta).map(([value, meta]) => (
            <option key={value} value={value}>{meta.label}</option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 text-[10px] font-black uppercase tracking-wider text-zinc-500">
              <tr>
                {["Mã phiếu", "Khách hàng", "Sản phẩm", "Thời hạn", "Trạng thái", "Thao tác"].map((head) => (
                  <th key={head} className="px-4 py-3">{head}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {filtered.map((item) => {
                const meta = statusMeta[item.status] || statusMeta.pending;
                return (
                  <tr key={item.id} onClick={() => setSelectedWarranty(item)} className="cursor-pointer hover:bg-orange-50/60">
                    <td className="px-4 py-4">
                      <button type="button" onClick={(event) => { event.stopPropagation(); setSelectedWarranty(item); }} className="font-black text-orange-600 hover:underline">{item.code}</button>
                      <p className="mt-1 text-[10px] text-zinc-400">Đơn: {item.orderCode || "—"}</p>
                      <p className="mt-1 max-w-[180px] truncate text-[10px] text-zinc-500">{item.orderName || "—"}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-bold text-zinc-900">{item.customerName}</p>
                      <p className="mt-1 text-[10px] text-zinc-500">{item.phone}</p>
                    </td>
                    <td className="max-w-[260px] px-4 py-4">
                      <p className="truncate font-bold text-zinc-900">{item.productName}</p>
                      <p className="mt-1 line-clamp-1 text-[10px] text-zinc-500">{item.issue}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="flex items-center gap-1 font-semibold text-zinc-700">
                        <CalendarDays className="h-3.5 w-3.5" /> {item.expiryDate}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <select
                        value={item.status}
                        onClick={(event) => event.stopPropagation()}
                        onChange={(event) => updateStatus(item.id, event.target.value)}
                        className={`rounded-lg border-0 px-2.5 py-2 text-[10px] font-black outline-none ${meta.color}`}
                      >
                        {Object.entries(statusMeta).map(([value, option]) => (
                          <option key={value} value={value}>{option.label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={(event) => { event.stopPropagation(); removeWarranty(item.id); }}
                        className="rounded-lg p-2 text-rose-600 hover:bg-rose-50"
                        title="Xóa phiếu"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-12 text-center">
            <ShieldCheck className="mx-auto mb-3 h-10 w-10 text-zinc-300" />
            <p className="text-sm font-bold text-zinc-500">Chưa có phiếu bảo hành phù hợp.</p>
          </div>
        )}
      </div>

      {selectedWarranty && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm" onClick={() => setSelectedWarranty(null)}>
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-orange-600">Chi tiết phiếu bảo hành</p>
                <h2 className="mt-1 text-xl font-black text-zinc-900">{selectedWarranty.code}</h2>
              </div>
              <button type="button" onClick={() => setSelectedWarranty(null)} className="rounded-xl p-2 hover:bg-zinc-100" aria-label="Đóng chi tiết">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-zinc-50 p-4">
                <div>
                  <p className="text-[10px] font-black uppercase text-zinc-400">Trạng thái hiện tại</p>
                  <span className={`mt-2 inline-flex rounded-lg px-3 py-2 text-xs font-black ${(statusMeta[selectedWarranty.status] || statusMeta.pending).color}`}>
                    {(statusMeta[selectedWarranty.status] || statusMeta.pending).label}
                  </span>
                </div>
                <div className="text-right text-xs text-zinc-500">
                  <p>Ngày tạo: <b className="text-zinc-800">{new Date(selectedWarranty.createdAt).toLocaleString("vi-VN")}</b></p>
                  <p className="mt-1">Hết hạn: <b className="text-zinc-800">{selectedWarranty.expiryDate || "—"}</b></p>
                </div>
              </div>

              <section className="grid gap-4 rounded-2xl border border-zinc-200 p-5 sm:grid-cols-2">
                <h3 className="font-black text-zinc-900 sm:col-span-2">Khách hàng và đơn hàng</h3>
                <Detail icon={Eye} label="Khách hàng" value={selectedWarranty.customerName} />
                <Detail icon={Phone} label="Số điện thoại" value={selectedWarranty.phone} />
                <Detail icon={Mail} label="Email" value={selectedWarranty.email || "Chưa cung cấp"} />
                <Detail icon={Hash} label="Mã đơn hàng" value={selectedWarranty.orderCode || "—"} />
                <Detail icon={CalendarDays} label="Ngày mua" value={selectedWarranty.purchaseDate || "—"} />
                <Detail icon={Clock} label="Thời hạn" value={`${selectedWarranty.warrantyDays || 0} ngày`} />
              </section>

              <section className="rounded-2xl border border-zinc-200 p-5">
                <h3 className="font-black text-zinc-900">Sản phẩm bảo hành</h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Detail icon={PackageCheck} label="Sản phẩm" value={selectedWarranty.productName} />
                  <Detail icon={Hash} label="Serial / IMEI" value={selectedWarranty.serialNumber || "Không có"} />
                </div>
                <div className="mt-4 rounded-xl bg-rose-50 p-4">
                  <p className="text-[10px] font-black uppercase text-rose-500">Mô tả lỗi / yêu cầu</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-rose-900">{selectedWarranty.issue}</p>
                </div>
                {selectedWarranty.note && <div className="mt-3 rounded-xl bg-amber-50 p-4 text-xs font-medium text-amber-900"><b>Ghi chú nội bộ:</b> {selectedWarranty.note}</div>}
              </section>

              <section className="rounded-2xl border border-zinc-200 p-5">
                <h3 className="font-black text-zinc-900">Lịch sử xử lý</h3>
                <div className="mt-4 space-y-3">
                  {(selectedWarranty.history || []).map((entry, index) => {
                    const historyMeta = statusMeta[entry.status] || statusMeta.pending;
                    return <div key={`${entry.time}-${index}`} className="flex gap-3 rounded-xl bg-zinc-50 p-3">
                      <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-orange-500" />
                      <div><p className="text-xs font-black text-zinc-800">{historyMeta.label}</p><p className="mt-1 text-[11px] text-zinc-500">{entry.note} · {new Date(entry.time).toLocaleString("vi-VN")}</p></div>
                    </div>;
                  })}
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white p-5">
              <div>
                <h2 className="text-lg font-black text-zinc-900">Tạo phiếu bảo hành mới</h2>
                <p className="text-xs text-zinc-500">Nhập thông tin khách hàng và sản phẩm cần bảo hành.</p>
              </div>
              <button onClick={() => setShowModal(false)} className="rounded-xl p-2 hover:bg-zinc-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="grid flex-1 grid-cols-1 gap-5 overflow-y-auto bg-zinc-50/70 p-6 sm:grid-cols-2">
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 sm:col-span-2">
                <p className="text-sm font-black text-blue-900">Thông tin phiếu bảo hành</p>
                <p className="mt-1 text-xs font-medium text-blue-700">Chọn mã đơn trước, hệ thống sẽ tự lấy sản phẩm, khách hàng và ngày mua. Các ô có dấu * là bắt buộc.</p>
              </div>
              <Field label="Mã đơn hàng *">
                <select required value={form.orderCode} onChange={(e) => handleOrderChange(e.target.value)} className="field">
                  <option value="">Chọn đơn hàng</option>
                  {orders.map((order) => <option key={order.id} value={order.id}>{order.id} - {order.customerName}</option>)}
                </select>
              </Field>
              <Field label="Tên đơn hàng">
                <input
                  readOnly
                  value={form.orderName}
                  placeholder="Tự động lấy theo mã đơn hàng"
                  className="field cursor-not-allowed bg-zinc-200/70 text-zinc-700"
                />
              </Field>
              <Field label="Sản phẩm *">
                <select required value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })} className="field">
                  <option value="">Chọn sản phẩm</option>
                  {orderProducts.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
                </select>
              </Field>
              <Field label="Tên khách hàng *">
                <input required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} className="field" />
              </Field>
              <Field label="Số điện thoại *">
                <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="field" />
              </Field>
              <Field label="Email">
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="field" />
              </Field>
              <Field label="Số serial / IMEI">
                <input value={form.serialNumber} onChange={(e) => setForm({ ...form, serialNumber: e.target.value })} className="field" />
              </Field>
              <Field label="Ngày mua *">
                <input required type="date" value={form.purchaseDate} onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })} className="field" />
              </Field>
              <Field label="Thời hạn bảo hành (ngày) *">
                <input required min="1" type="number" value={form.warrantyDays} onChange={(e) => setForm({ ...form, warrantyDays: e.target.value })} className="field" />
              </Field>
              {form.purchaseDate && (
                <div className={`rounded-xl border p-3 text-xs font-bold sm:col-span-2 ${
                  isWarrantyExpired
                    ? "border-rose-200 bg-rose-50 text-rose-700"
                    : "border-emerald-200 bg-emerald-50 text-emerald-700"
                }`}>
                  Đơn hàng đã mua {elapsedDays} ngày.{" "}
                  {isWarrantyExpired
                    ? `Đã hết hạn bảo hành ${form.warrantyDays} ngày, không thể tạo phiếu.`
                    : `Còn ${Math.max(0, Number(form.warrantyDays) - elapsedDays)} ngày bảo hành.`}
                </div>
              )}
              <div className="sm:col-span-2">
                <Field label="Mô tả lỗi / yêu cầu bảo hành *">
                  <textarea required rows={3} value={form.issue} onChange={(e) => setForm({ ...form, issue: e.target.value })} className="field resize-none" />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Ghi chú nội bộ">
                  <textarea rows={2} value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} className="field resize-none" />
                </Field>
              </div>
              <div className="sticky bottom-0 -mx-6 -mb-6 flex justify-end gap-3 border-t border-zinc-200 bg-white px-6 py-4 shadow-[0_-8px_20px_rgba(0,0,0,0.06)] sm:col-span-2">
                <button type="button" onClick={() => setShowModal(false)} className="rounded-xl border border-zinc-300 px-5 py-2.5 text-xs font-bold">Hủy</button>
                <button
                  type="submit"
                  disabled={isWarrantyExpired}
                  className="rounded-xl bg-orange-600 px-6 py-2.5 text-xs font-black text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Tạo phiếu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-black uppercase tracking-wider text-zinc-600">{label}</span>
      {children}
    </label>
  );
}

function Detail({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-wider text-zinc-400">{label}</p>
        <p className="mt-1 break-words text-sm font-bold text-zinc-900">{value || "—"}</p>
      </div>
    </div>
  );
}
