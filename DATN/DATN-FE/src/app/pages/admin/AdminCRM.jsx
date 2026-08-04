import { useEffect, useMemo, useState } from "react";
import { BellRing, Cake, CheckCircle2, Clock3, Gift, MessageCircle, RefreshCcw, ShoppingCart, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "../../context/AppContext";
import { getCompletedSpending, getMembershipTier } from "../../utils/membership";

const KEY = "foxstyle_crm_events";
const RULE_KEY = "foxstyle_crm_rules";
const DAY = 86400000;
const read = (key, fallback = []) => { try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; } };
const orderDate = (o) => { const d = new Date(String(o.date || o.orderDate || o.createdAt || "").replace(" ", "T")); return Number.isNaN(d.getTime()) ? null : d; };
const userId = (o) => String(o.userId || o.phone || o.customerName || "");

const defaultRules = [
  { id: "abandoned", title: "Nhắc giỏ hàng bỏ quên", timing: "Sau 1 giờ", icon: ShoppingCart, color: "orange", enabled: true, channel: "Zalo", description: "Khách có sản phẩm trong giỏ nhưng chưa tạo đơn." },
  { id: "warranty", title: "Gửi thông tin bảo hành", timing: "Ngay khi mua xong", icon: CheckCircle2, color: "emerald", enabled: true, channel: "Zalo", description: "Gửi mã đơn, quyền lợi và thời hạn bảo hành." },
  { id: "review", title: "Xin đánh giá + voucher", timing: "Sau 7 ngày", icon: Gift, color: "purple", enabled: true, channel: "Zalo", description: "Tặng voucher 50.000đ cho lần mua tiếp theo." },
  { id: "birthday", title: "Voucher sinh nhật 100K", timing: "Đúng ngày sinh", icon: Cake, color: "pink", enabled: true, channel: "Zalo", description: "Mỗi khách nhận tối đa một lần trong năm." },
  { id: "shoe-care", title: "Chăm sóc giày định kỳ", timing: "Sau 3 tháng", icon: Sparkles, color: "blue", enabled: true, channel: "Zalo", description: "Nhắc đánh xi hoặc bảo hành miễn phí." },
  { id: "membership", title: "Chăm sóc theo hạng thành viên", timing: "Khi đạt/đổi hạng", icon: BellRing, color: "amber", enabled: true, channel: "Zalo", description: "Tự gửi đúng quyền lợi Bạc 3%, Vàng 5% hoặc Kim Cương 8% và freeship." },
];

const profileOf = (u) => ({ ...u, ...read(`foxstyle_profile_${u.id || u.username}`, {}) });
const hasShoe = (o) => (o.items || []).some((i) => {
  const p = i.product || {};
  return `${p.name || ""} ${p.category || ""}`.toLowerCase().match(/giày|shoe|sneaker/);
});
const eventKey = (type, target, ref, year = "") => `${type}:${target}:${ref || ""}:${year}`;

export function AdminCRM() {
  const { orders = [], users = [] } = useApp();
  const [rules, setRules] = useState(() => {
    const saved = read(RULE_KEY, []);
    return defaultRules.map((rule) => {
      const stored = saved.find((item) => item.id === rule.id);
      return {
        ...rule,
        enabled: stored?.enabled ?? rule.enabled,
        channel: stored?.channel || rule.channel
      };
    });
  });
  const [events, setEvents] = useState(() => read(KEY));
  const [zaloConnected, setZaloConnected] = useState(() => localStorage.getItem("foxstyle_zalo_oa_connected") === "true");

  const candidates = useMemo(() => {
    const now = Date.now(), rows = [], profiles = users.map(profileOf);
    const completed = orders.filter((o) => o.status === "completed");
    profiles.forEach((u) => {
      const spent = getCompletedSpending(completed, u.id);
      const tier = getMembershipTier(spent);
      rows.push({
        type: "membership",
        target: String(u.id || u.phone || u.username),
        ref: tier.key,
        customerName: u.fullName || u.username,
        phone: u.phone,
        dueAt: new Date().toISOString(),
        voucher: `MEMBER${tier.discountPercent}-${String(u.id || "").slice(-4)}`,
        discountPercent: tier.discountPercent,
        message: `Xin chào ${u.fullName || u.username}, bạn đang ở hạng ${tier.name} ${tier.icon} với tổng chi tiêu ${spent.toLocaleString("vi-VN")}đ. Quyền lợi hiện tại: ${tier.perk}.`
      });
    });
    completed.forEach((o) => {
      const d = orderDate(o); if (!d) return;
      const target = userId(o), name = o.customerName || o.recipientName || "Khách hàng";
      if (now >= d.getTime()) rows.push({ type: "warranty", target, ref: o.id, customerName: name, phone: o.phone, dueAt: d.toISOString(), message: `Đơn ${o.id} đã hoàn tất. FoxStyle gửi thông tin bảo hành sản phẩm của bạn.` });
      if (now >= d.getTime() + 7 * DAY) rows.push({ type: "review", target, ref: o.id, customerName: name, phone: o.phone, dueAt: new Date(d.getTime() + 7 * DAY).toISOString(), voucher: `REVIEW${String(o.id).replace(/\D/g,"").slice(-4)}50K`, message: `Bạn thấy sản phẩm trong đơn ${o.id} thế nào? Đánh giá để nhận voucher 50.000đ.` });
      if (hasShoe(o) && now >= d.getTime() + 90 * DAY) rows.push({ type: "shoe-care", target, ref: o.id, customerName: name, phone: o.phone, dueAt: new Date(d.getTime() + 90 * DAY).toISOString(), message: `Đã 3 tháng từ khi bạn mua giày. Mời bạn mang sản phẩm tới FoxStyle để đánh xi/kiểm tra bảo hành miễn phí.` });
    });
    const today = new Date(), md = `${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;
    profiles
      .filter((u) => String(u.birthDate || "").slice(5) === md)
      .filter((u) => getMembershipTier(getCompletedSpending(completed, u.id)).key !== "member")
      .forEach((u) => {
        const tier = getMembershipTier(getCompletedSpending(completed, u.id));
        rows.push({ type: "birthday", target: String(u.id || u.phone), ref: today.getFullYear(), customerName: u.fullName || u.username, phone: u.phone, dueAt: today.toISOString(), voucher: `BDAY${String(u.id || "").slice(-4)}100K`, message: `Chúc mừng sinh nhật thành viên hạng ${tier.name}! FoxStyle tặng bạn voucher 100.000đ cho đơn hàng tiếp theo.` });
      });
    const cart = read("foxstyle_guest_cart");
    const touched = Number(localStorage.getItem("foxstyle_guest_cart_updated_at") || 0);
    if (cart.length && touched && now - touched >= 3600000) rows.push({ type: "abandoned", target: "guest", ref: new Date(touched).toISOString().slice(0,13), customerName: "Khách vãng lai", phone: "", dueAt: new Date(touched + 3600000).toISOString(), message: `Bạn còn ${cart.length} sản phẩm trong giỏ. Hoàn tất đơn để không bỏ lỡ sản phẩm yêu thích.` });
    return rows;
  }, [orders, users]);

  const runAutomation = () => {
    const canonicalByKey = new Map(
      candidates.map((candidate) => [
        eventKey(
          candidate.type,
          candidate.target,
          candidate.ref,
          candidate.type === "birthday" ? new Date().getFullYear() : ""
        ),
        candidate
      ])
    );
    const repairedEvents = events.map((event) => {
      const canonical = canonicalByKey.get(event.key);
      if (!canonical) return event;
      return {
        ...event,
        customerName: canonical.customerName,
        phone: canonical.phone,
        message: canonical.message
      };
    });
    const existing = new Set(repairedEvents.map((event) => event.key));
    const enabled = new Set(rules.filter((r) => r.enabled).map((r) => r.id));
    const additions = candidates.filter((c) => enabled.has(c.type)).map((c) => {
      const key = eventKey(c.type, c.target, c.ref, c.type === "birthday" ? new Date().getFullYear() : "");
      return { ...c, key, id: `CRM-${Date.now()}-${Math.random().toString(36).slice(2,7)}`, createdAt: new Date().toISOString(), status: zaloConnected ? "sent" : "waiting", channel: "Zalo OA" };
    }).filter((e) => !existing.has(e.key));
    const next = [...additions, ...repairedEvents].slice(0, 1000);
    setEvents(next); localStorage.setItem(KEY, JSON.stringify(next));
    const vouchers = additions.filter((e) => e.voucher).map((e) => ({
      code: e.voucher,
      customer: e.target,
      amount: e.type === "birthday" ? 100000 : e.type === "review" ? 50000 : 0,
      discountPercent: e.discountPercent || 0,
      createdAt: e.createdAt
    }));
    if (vouchers.length) localStorage.setItem("foxstyle_crm_vouchers", JSON.stringify([...vouchers, ...read("foxstyle_crm_vouchers")]));
    toast.success(additions.length ? `Đã xử lý ${additions.length} chăm sóc mới.` : "Không có chăm sóc mới đến hạn.");
  };

  useEffect(() => { runAutomation(); }, []); // chạy một lần khi mở CRM

  const toggle = (id) => {
    const next = rules.map((r) => r.id === id ? { ...r, enabled: !r.enabled } : r);
    setRules(next); localStorage.setItem(RULE_KEY, JSON.stringify(next.map(({ icon, ...r }) => r)));
  };
  const status = { waiting: ["Chờ kết nối Zalo", "bg-amber-100 text-amber-700"], sent: ["Đã gửi", "bg-emerald-100 text-emerald-700"], failed: ["Gửi lỗi", "bg-red-100 text-red-700"] };

  return <div className="space-y-7">
    <div className="flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-r from-gray-950 to-indigo-950 p-6 text-white md:flex-row md:items-center"><div><p className="text-xs font-black uppercase tracking-[.2em] text-indigo-300">Automation Center</p><h1 className="mt-1 text-2xl font-black">Chăm sóc khách tự động (CRM)</h1><p className="mt-1 text-sm text-gray-300">Tự nhận diện thời điểm phù hợp và tạo tin chăm sóc cá nhân hóa.</p></div><button onClick={runAutomation} className="flex h-fit items-center gap-2 rounded-xl bg-indigo-500 px-4 py-3 text-sm font-bold"><RefreshCcw className="h-4 w-4"/>Chạy ngay</button></div>
    <div className={`flex items-center justify-between rounded-2xl border p-4 ${zaloConnected?"border-emerald-200 bg-emerald-50":"border-amber-200 bg-amber-50"}`}><div className="flex items-center gap-3"><MessageCircle className={`h-6 w-6 ${zaloConnected?"text-emerald-600":"text-amber-600"}`}/><div><p className="font-black">Kết nối Zalo Official Account</p><p className="text-xs text-gray-600">{zaloConnected?"Đã kết nối, tin đến hạn được đánh dấu đã gửi.":"Chưa có API Zalo OA; tin được giữ trong hàng đợi và không báo gửi giả."}</p></div></div><button onClick={() => { const next=!zaloConnected; setZaloConnected(next); localStorage.setItem("foxstyle_zalo_oa_connected",String(next)); }} className={`rounded-xl px-4 py-2 text-xs font-black ${zaloConnected?"bg-white text-gray-700":"bg-amber-600 text-white"}`}>{zaloConnected?"Ngắt kết nối thử nghiệm":"Đánh dấu đã cấu hình"}</button></div>
    <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">{rules.map((r) => { const Icon=r.icon; return <div key={r.id} className="rounded-2xl border bg-white p-5 shadow-sm"><div className="flex justify-between"><div className="rounded-xl bg-gray-100 p-3"><Icon className="h-5 w-5 text-indigo-600"/></div><button onClick={()=>toggle(r.id)} className={`h-7 w-12 rounded-full p-1 transition ${r.enabled?"bg-emerald-500":"bg-gray-300"}`}><span className={`block h-5 w-5 rounded-full bg-white transition ${r.enabled?"translate-x-5":""}`}/></button></div><h3 className="mt-4 font-black">{r.title}</h3><p className="mt-1 text-xs text-gray-500">{r.description}</p><div className="mt-4 flex justify-between border-t pt-3 text-xs font-bold"><span className="flex items-center gap-1 text-indigo-600"><Clock3 className="h-3.5 w-3.5"/>{r.timing}</span><span>{r.channel}</span></div></div>;})}</div>
    <section className="rounded-2xl border bg-white p-6 shadow-sm"><div className="mb-5 flex justify-between"><div><h2 className="flex items-center gap-2 text-lg font-black"><BellRing className="h-5 w-5 text-indigo-600"/>Nhật ký chăm sóc</h2><p className="text-xs text-gray-500">{events.length} sự kiện đã được xử lý, {events.filter((e)=>e.status==="waiting").length} tin đang chờ.</p></div></div>
      {events.length ? <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b bg-gray-50 text-xs uppercase text-gray-500"><th className="p-3">Khách hàng</th><th className="p-3">Kịch bản</th><th className="p-3">Nội dung</th><th className="p-3">Voucher</th><th className="p-3 text-right">Trạng thái</th></tr></thead><tbody>{events.map((e)=>{const rule=rules.find((r)=>r.id===e.type), sm=status[e.status]||status.waiting; return <tr key={e.id} className="border-b align-top"><td className="p-3"><b>{e.customerName}</b><p className="text-xs text-gray-500">{e.phone||"Chưa có SĐT"}</p></td><td className="p-3 font-bold">{rule?.title||e.type}<p className="text-[10px] text-gray-400">{new Date(e.dueAt).toLocaleString("vi-VN")}</p></td><td className="max-w-md p-3 text-xs leading-5 text-gray-600">{e.message}</td><td className="p-3 font-mono text-xs font-bold text-purple-600">{e.voucher||"—"}</td><td className="p-3 text-right"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${sm[1]}`}>{sm[0]}</span></td></tr>})}</tbody></table></div>:<p className="py-12 text-center text-sm text-gray-400">Chưa có sự kiện chăm sóc đến hạn.</p>}
    </section>
  </div>;
}
