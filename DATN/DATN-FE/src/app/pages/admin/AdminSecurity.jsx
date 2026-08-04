import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Ban, Clock3, DatabaseBackup, Download, History, ShieldCheck, Trash2 } from "lucide-react";
import { loadPermanentBackups } from "../../services/dailyBackup";
import { toast } from "sonner";
import { useApp } from "../../context/AppContext";

const read = (key, fallback = []) => {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
  catch { return fallback; }
};
const phoneKey = (value) => String(value || "").replace(/\D/g, "");
const money = (value) => `${Number(value || 0).toLocaleString("vi-VN")}đ`;

function Stat({ label, value, icon: Icon, danger }) {
  return <div className={`rounded-2xl border bg-white p-5 ${danger ? "border-red-200" : "border-gray-200"}`}><div className="flex items-center justify-between"><div><p className="text-xs font-black uppercase text-gray-400">{label}</p><p className={`mt-2 text-3xl font-black ${danger ? "text-red-600" : "text-gray-900"}`}>{value}</p></div><div className={`rounded-xl p-3 ${danger ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}><Icon className="h-6 w-6"/></div></div></div>;
}

const cleanText = (str) => {
  if (!str || typeof str !== "string") return str;
  return str
    .replace(/Nguy\?n/gi, "Nguyễn")
    .replace(/Qu\?n/gi, "Quản")
    .replace(/Tr\?/gi, "Trị")
    .replace(/Qu\?c/gi, "Quốc")
    .replace(/tr\?ng/gi, "trắng")
    .replace(/l\?a/gi, "lụa")
    .replace(/công s\?/gi, "công sở")
    .replace(/cao c\?p/gi, "cao cấp");
};

export function AdminSecurity() {
  const { orders = [], products = [], users = [], coupons = [], currentUser, updateUserStatus } = useApp();
  const [priceLogs, setPriceLogs] = useState(() => {
    const raw = read("foxstyle_price_audit");
    const arr = Array.isArray(raw) ? raw : [];
    return arr.map((log) => ({
      ...log,
      productName: cleanText(log?.productName || ""),
      changedBy: cleanText(log?.changedBy || "")
    }));
  });
  const [blocked, setBlocked] = useState(() => read("foxstyle_blocked_phones"));
  const [backups, setBackups] = useState(() => read("foxstyle_daily_backups"));

  const bombPhones = useMemo(() => {
    const map = new Map();
    orders.filter((o) => o.status === "returned").forEach((o) => {
      const phone = phoneKey(o.phone);
      if (!phone) return;
      const row = map.get(phone) || { phone, name: o.customerName || o.recipientName || "Khách hàng", count: 0, orderIds: [] };
      row.count++; row.orderIds.push(o.id); map.set(phone, row);
    });
    return [...map.values()].sort((a, b) => b.count - a.count);
  }, [orders]);

  useEffect(() => {
    const automatic = bombPhones.filter((row) => row.count > 3);
    setBlocked((old) => {
      const map = new Map(old.map((row) => [phoneKey(row.phone || row), typeof row === "string" ? { phone: row } : row]));
      automatic.forEach((row) => {
        const previous = map.get(row.phone) || {};
        const violationsAfterUnlock = row.count - Number(previous.baselineCount || 0);
        const permanent = Number(previous.unlockCount || 0) > 0 && violationsAfterUnlock > 3;
        const nextRecord = {
          ...previous,
          ...row,
          auto: true,
          isBlocked: true,
          restricted: Number(previous.unlockCount || 0) > 0,
          lockType: permanent ? "PERMANENT" : "TEMPORARY",
          blockedAt: previous.blockedAt || new Date().toISOString()
        };
        map.set(row.phone, nextRecord);
        const matchedUser = users.find((user) => phoneKey(user.phone) === row.phone);
        if (matchedUser && Number(matchedUser.status) !== 0) {
          queueMicrotask(() => updateUserStatus(matchedUser.id, 0).catch(() => {}));
        }
      });
      const next = [...map.values()];
      localStorage.setItem("foxstyle_blocked_phones", JSON.stringify(next));
      return next;
    });
  }, [bombPhones, users, updateUserStatus]);

  useEffect(() => {
    const syncBackups = (event) => setBackups(event.detail || read("foxstyle_daily_backups"));
    loadPermanentBackups().then(setBackups).catch(() => {});
    window.addEventListener("foxstyle-backups-updated", syncBackups);
    return () => window.removeEventListener("foxstyle-backups-updated", syncBackups);
  }, []);

  const toggleBlock = (row) => {
    const record = blocked.find((b) => phoneKey(b.phone || b) === row.phone);
    const exists = Boolean(record?.isBlocked ?? record);
    if (exists && record?.lockType === "PERMANENT") {
      toast.error("Tài khoản đã bị khóa vĩnh viễn do tiếp tục bom hàng sau khi được mở khóa.");
      return;
    }
    const matchedUser = users.find((user) => phoneKey(user.phone) === row.phone);
    const next = exists
      ? blocked.map((item) =>
          phoneKey(item.phone || item) === row.phone
            ? {
                ...item,
                isBlocked: false,
                restricted: true,
                unlockCount: Number(item.unlockCount || 0) + 1,
                baselineCount: row.count,
                unlockedAt: new Date().toISOString()
              }
            : item
        )
      : [
          {
            ...row,
            auto: false,
            isBlocked: true,
            restricted: false,
            lockType: "TEMPORARY",
            blockedAt: new Date().toISOString()
          },
          ...blocked.filter((item) => phoneKey(item.phone || item) !== row.phone)
        ];
    setBlocked(next); localStorage.setItem("foxstyle_blocked_phones", JSON.stringify(next));
    if (matchedUser) updateUserStatus(matchedUser.id, exists ? 1 : 0).catch(() => {});
    toast.success(exists ? "Đã mở khóa. Tài khoản chuyển sang diện hạn chế và chỉ được thanh toán trước." : "Đã khóa tạm thời tài khoản.");
  };

  const download = (backup) => {
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob), link = document.createElement("a");
    link.href = url; link.download = `foxstyle-backup-${backup.date}.json`; link.click(); URL.revokeObjectURL(url);
  };

  const highDiscount = coupons.filter((c) => Number(c.discountType) === 2 && Number(c.discountValue) >= 100);

  return <div className="space-y-7">
    <div className="rounded-2xl bg-gradient-to-r from-gray-950 to-red-950 p-6 text-white"><p className="text-xs font-black uppercase tracking-[.2em] text-red-400">Security Center</p><h1 className="mt-1 text-2xl font-black">Chống gian lận & Bảo mật</h1><p className="mt-1 text-sm text-gray-300">Giám sát bom hàng, thay đổi giá, mã giảm giá nguy hiểm và sao lưu dữ liệu.</p></div>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"><Stat label="SĐT đang bị chặn" value={blocked.filter((row) => row.isBlocked !== false).length} icon={Ban} danger={blocked.some((row) => row.isBlocked !== false)}/><Stat label="Khách bom trên 3 lần" value={bombPhones.filter((r) => r.count > 3).length} icon={AlertTriangle} danger={bombPhones.some((r) => r.count > 3)}/><Stat label="Lần chỉnh giá" value={priceLogs.length} icon={History}/><Stat label="Bản backup" value={backups.length} icon={DatabaseBackup}/></div>

    <section className="rounded-2xl border bg-white p-6 shadow-sm"><h2 className="flex items-center gap-2 text-lg font-black"><Ban className="h-5 w-5 text-red-600"/>Kiểm soát khách bom hàng</h2><p className="mb-5 text-xs text-gray-500">Trên 3 lần: khóa tạm thời. Sau khi mở khóa: chỉ được thanh toán trước. Nếu tiếp tục bom trên 3 lần: khóa vĩnh viễn.</p>
      {bombPhones.length ? <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b bg-gray-50 text-xs uppercase text-gray-500"><th className="p-3">Khách hàng</th><th className="p-3">Số điện thoại</th><th className="p-3 text-center">Số lần bom</th><th className="p-3">Trạng thái</th><th className="p-3">Đơn liên quan</th><th className="p-3 text-right">Xử lý</th></tr></thead><tbody>{bombPhones.map((r) => { const record = blocked.find((b) => phoneKey(b.phone || b) === r.phone); const isBlocked = Boolean(record?.isBlocked ?? record); return <tr key={r.phone} className={`border-b ${r.count > 3 ? "bg-red-50/60":""}`}><td className="p-3 font-bold">{r.name}</td><td className="p-3 font-mono">{r.phone}</td><td className="p-3 text-center font-black text-red-600">{r.count}</td><td className="p-3 text-xs font-bold">{record?.lockType === "PERMANENT" ? "Khóa vĩnh viễn" : isBlocked ? "Khóa tạm thời" : record?.restricted ? "Đang hạn chế" : "Bình thường"}</td><td className="p-3 text-xs text-gray-500">{r.orderIds.join(", ")}</td><td className="p-3 text-right"><button onClick={() => toggleBlock(r)} disabled={record?.lockType === "PERMANENT"} className={`rounded-lg px-3 py-2 text-xs font-black disabled:cursor-not-allowed disabled:opacity-50 ${isBlocked?"bg-gray-100 text-gray-700":"bg-red-600 text-white"}`}>{record?.lockType === "PERMANENT" ? "Đã khóa vĩnh viễn" : isBlocked ? "Mở khóa có hạn chế" : "Chặn ngay"}</button></td></tr>;})}</tbody></table></div> : <p className="py-10 text-center text-sm text-gray-400">Chưa có đơn hoàn hàng.</p>}
    </section>

    <section className="rounded-2xl border bg-white p-6 shadow-sm"><div className="flex items-start justify-between"><div><h2 className="flex items-center gap-2 text-lg font-black"><History className="h-5 w-5 text-blue-600"/>Lịch sử chỉnh giá</h2><p className="mb-5 text-xs text-gray-500">Ghi lại người thực hiện, giá cũ, giá mới và thời gian.</p></div>{priceLogs.length > 0 && <button onClick={() => { if(confirm("Xóa toàn bộ lịch sử chỉnh giá?")) { localStorage.removeItem("foxstyle_price_audit"); setPriceLogs([]); } }} className="text-red-500"><Trash2 className="h-4 w-4"/></button>}</div>
      {priceLogs.length ? <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b bg-gray-50 text-xs uppercase text-gray-500"><th className="p-3">Sản phẩm</th><th className="p-3">Người sửa</th><th className="p-3 text-right">Giá cũ</th><th className="p-3 text-right">Giá mới</th><th className="p-3 text-right">Thời gian</th></tr></thead><tbody>{priceLogs.map((l)=><tr key={l.id} className="border-b"><td className="p-3 font-bold">{cleanText(l.productName)}</td><td className="p-3">{cleanText(l.changedBy)}<span className="ml-2 rounded bg-gray-100 px-2 py-1 text-[10px] uppercase">{l.role}</span></td><td className="p-3 text-right text-gray-500">{money(l.oldPrice)}</td><td className="p-3 text-right font-black text-orange-600">{money(l.newPrice)}</td><td className="p-3 text-right text-xs">{new Date(l.changedAt).toLocaleString("vi-VN")}</td></tr>)}</tbody></table></div> : <p className="py-10 text-center text-sm text-gray-400">Chưa có thay đổi giá nào.</p>}
    </section>

    <section className={`rounded-2xl border bg-white p-6 shadow-sm ${highDiscount.length?"border-red-300":"border-emerald-200"}`}><h2 className="flex items-center gap-2 text-lg font-black">{highDiscount.length?<AlertTriangle className="h-5 w-5 text-red-600"/>:<ShieldCheck className="h-5 w-5 text-emerald-600"/>}Kiểm soát mã giảm giá</h2><p className="mt-2 text-sm font-semibold text-gray-600">{highDiscount.length ? `Phát hiện ${highDiscount.length} mã giảm từ 100% cần vô hiệu hóa.` : "An toàn: hệ thống đã khóa tạo và cập nhật mã giảm từ 100%."}</p></section>

    <section className="rounded-2xl border bg-white p-6 shadow-sm"><h2 className="flex items-center gap-2 text-lg font-black"><DatabaseBackup className="h-5 w-5 text-emerald-600"/>Backup dữ liệu hằng ngày</h2><p className="mb-5 text-xs text-gray-500">Tự tạo một snapshot mỗi ngày khi quản trị viên mở hệ thống và lưu vĩnh viễn trong cơ sở dữ liệu, không giới hạn số bản.</p>
      <div className="space-y-3">{backups.map((b)=><div key={b.id} className="flex items-center justify-between rounded-xl border p-4"><div className="flex items-center gap-3"><Clock3 className="h-5 w-5 text-gray-400"/><div><p className="font-bold">Backup ngày {b.date}</p><p className="text-xs text-gray-500">{new Date(b.createdAt).toLocaleString("vi-VN")} • {b.data.orders?.length||0} đơn • {b.data.products?.length||0} sản phẩm</p></div></div><button onClick={() => download(b)} className="flex items-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-xs font-bold text-white"><Download className="h-4 w-4"/>Tải xuống</button></div>)}</div>
    </section>
  </div>;
}
