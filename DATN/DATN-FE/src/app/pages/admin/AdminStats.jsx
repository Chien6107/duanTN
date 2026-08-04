import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, DollarSign, Download, Package, RefreshCcw, RotateCcw, ShieldCheck, ShoppingBag, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useApp } from "../../context/AppContext";
import { api } from "../../services/api";

const money = (v) => `${Number(v || 0).toLocaleString("vi-VN")}đ`;
const num = (v) => Number(v || 0).toLocaleString("vi-VN");
const total = (o) => Number(o.total ?? o.totalAmount ?? 0);
const dateOf = (o) => {
  const d = new Date(String(o.date || o.orderDate || o.createdAt || "").replace(" ", "T"));
  return Number.isNaN(d.getTime()) ? null : d;
};
const itemId = (i) => String(i?.product?.id ?? i?.productId ?? i?.productName ?? i?.product?.name ?? "");
const itemName = (i) => i?.product?.name || i?.productName || "Sản phẩm chưa xác định";
const itemPrice = (i) => Number(i?.price ?? i?.product?.price ?? 0);
const customerKey = (o) => String(o.userId || o.email || o.phone || o.customerName || o.recipientName || o.id);

function Card({ title, value, note, icon: Icon, danger }) {
  return (
    <div className={`rounded-2xl border bg-white p-5 shadow-sm ${danger ? "border-red-200" : "border-gray-200"}`}>
      <div className="flex justify-between gap-3">
        <div><p className="text-xs font-black uppercase text-gray-400">{title}</p><p className={`mt-2 text-2xl font-black ${danger ? "text-red-600" : "text-gray-900"}`}>{value}</p><p className="mt-2 text-xs font-semibold text-gray-500">{note}</p></div>
        <div className={`h-fit rounded-xl p-3 ${danger ? "bg-red-50 text-red-600" : "bg-orange-50 text-orange-600"}`}><Icon className="h-5 w-5" /></div>
      </div>
    </div>
  );
}

const Empty = ({ children }) => <p className="py-12 text-center text-sm font-semibold text-gray-400">{children}</p>;

export function AdminStats() {
  const { orders = [], products = [], loadUserData } = useApp();
  const [period, setPeriod] = useState("day");
  const [financePeriod, setFinancePeriod] = useState("month");
  const [finance, setFinance] = useState(null);
  const [financeError, setFinanceError] = useState("");
  const [financeVersion, setFinanceVersion] = useState(0);
  const [range, setRange] = useState("all");
  const [warranties, setWarranties] = useState([]);

  const loadWarranties = () => {
    try {
      const data = JSON.parse(localStorage.getItem("foxstyle_warranties") || "[]");
      setWarranties(Array.isArray(data) ? data : []);
    } catch { setWarranties([]); }
  };

  useEffect(() => { loadUserData(); loadWarranties(); }, [loadUserData]);

  useEffect(() => {
    let active = true;
    const loadFinance = () => {
      api.finance.getReport(financePeriod)
        .then((response) => {
          if (active) {
            setFinance(response?.data || null);
            setFinanceError("");
          }
        })
        .catch((error) => {
          console.error("Finance report error:", error);
          if (active) setFinanceError(error.message || "Không tải được dữ liệu tài chính");
        });
    };
    loadFinance();
    const timer = window.setInterval(loadFinance, 30000);
    const onFocus = () => loadFinance();
    window.addEventListener("focus", onFocus);
    return () => {
      active = false;
      window.clearInterval(timer);
      window.removeEventListener("focus", onFocus);
    };
  }, [financePeriod, financeVersion]);

  const scopedOrders = useMemo(() => {
    if (range === "all") return orders;
    const limit = new Date();
    limit.setDate(limit.getDate() - Number(range));
    return orders.filter((o) => dateOf(o) && dateOf(o) >= limit);
  }, [orders, range]);
  const completed = scopedOrders.filter((o) => o.status === "completed");
  const returned = scopedOrders.filter((o) => o.status === "returned");
  const revenue = completed.reduce((s, o) => s + total(o), 0);
  const displayedRevenue = finance?.revenue ?? revenue;
  const displayedCogs = finance?.costOfGoodsSold ?? 0;
  const displayedImportCost = finance?.stockImportCost ?? 0;
  const displayedInventoryValue = finance?.inventoryValue ?? 0;
  const displayedProfit = finance?.grossProfit ?? (displayedRevenue - displayedCogs);

  const revenueData = useMemo(() => {
    const map = {};
    completed.forEach((o) => {
      const d = dateOf(o);
      if (!d) return;
      const key = period === "day" ? d.toISOString().slice(0, 10) : d.toISOString().slice(0, 7);
      map[key] ||= { key, revenue: 0, orders: 0 };
      map[key].revenue += total(o);
      map[key].orders++;
    });
    return Object.values(map).sort((a, b) => a.key.localeCompare(b.key)).slice(period === "day" ? -31 : -12);
  }, [completed, period]);

  const productRows = useMemo(() => {
    const map = new Map();
    const ensure = (i) => {
      const id = itemId(i);
      if (!map.has(id)) map.set(id, { id, name: itemName(i), sold: 0, revenue: 0, returned: 0, warranties: 0 });
      return map.get(id);
    };
    completed.forEach((o) => (o.items || []).forEach((i) => {
      const row = ensure(i), qty = Number(i.quantity || 0);
      row.sold += qty; row.revenue += qty * itemPrice(i);
    }));
    returned.forEach((o) => (o.items || []).forEach((i) => { ensure(i).returned += Number(i.quantity || 0); }));
    warranties.forEach((w) => {
      const id = String(w.productId || w.productName || "");
      if (!map.has(id)) map.set(id, { id, name: w.productName || "Sản phẩm chưa xác định", sold: 0, revenue: 0, returned: 0, warranties: 0 });
      map.get(id).warranties++;
    });
    return [...map.values()].map((r) => ({ ...r, rate: r.sold ? ((r.returned + r.warranties) / r.sold) * 100 : 0 }));
  }, [completed, returned, warranties]);

  const sizeRows = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      if (p.variants?.length) p.variants.forEach((v) => { const s = v.size || "Không size"; map[s] = (map[s] || 0) + Number(v.quantity || 0); });
      else {
        const sizes = p.sizes?.length ? p.sizes : ["Không size"];
        sizes.forEach((s) => { map[s] = (map[s] || 0) + Number(p.quantity || 0) / sizes.length; });
      }
    });
    return Object.entries(map).map(([size, stock]) => ({ size, stock: Math.round(stock) })).sort((a, b) => b.stock - a.stock);
  }, [products]);

  const customers = useMemo(() => {
    const map = new Map();
    completed.forEach((o) => {
      const key = customerKey(o);
      if (!map.has(key)) map.set(key, { key, name: o.customerName || o.recipientName || "Khách hàng", phone: o.phone || "", orders: 0, spent: 0, last: "" });
      const row = map.get(key); row.orders++; row.spent += total(o);
      const d = String(o.date || o.orderDate || o.createdAt || "");
      if (d > row.last) row.last = d;
    });
    return [...map.values()].sort((a, b) => b.orders - a.orders || b.spent - a.spent);
  }, [completed]);

  const returning = customers.filter((c) => c.orders >= 2);
  const sold = productRows.reduce((s, r) => s + r.sold, 0);
  const issues = productRows.reduce((s, r) => s + r.returned + r.warranties, 0);
  const issueRate = sold ? issues / sold * 100 : 0;
  const returningRate = customers.length ? returning.length / customers.length * 100 : 0;
  const problemCount = productRows.filter((r) => r.rate > 5).length;

  const exportExcel = () => {
    const escape = (value) => String(value ?? "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const row = (cells, header = false) => `<tr>${cells.map((cell) =>
      `<${header ? "th" : "td"}>${escape(cell)}</${header ? "th" : "td"}>`
    ).join("")}</tr>`;
    const periodRows = (finance?.periods || []).map((item) => row([
      item.period,
      Number(item.revenue || 0),
      Number(item.costOfGoodsSold || 0),
      Number(item.stockImportCost || 0),
      Number(item.grossProfit || 0),
      Number(item.orderCount || 0)
    ])).join("");
    const productExcelRows = [...productRows].sort((a, b) => b.sold - a.sold)
      .map((item) => row([item.name, item.sold, item.revenue, item.returned, item.warranties, `${item.rate.toFixed(2)}%`])).join("");
    const stockRows = sizeRows.map((item) => row([item.size, item.stock])).join("");
    const customerRows = customers.map((item) => row([item.name, item.phone, item.orders, item.spent, item.last])).join("");
    const html = `<!doctype html><html><head><meta charset="UTF-8"><style>
      body{font-family:Arial;color:#172033}h1{color:#c2410c}h2{margin-top:28px;color:#1f2937}
      table{border-collapse:collapse;width:100%;margin-bottom:20px}th{background:#f97316;color:white}
      th,td{border:1px solid #d1d5db;padding:8px}tr:nth-child(even){background:#fff7ed}
      .summary td:first-child{font-weight:bold;background:#ffedd5}.positive{color:#047857;font-weight:bold}
    </style></head><body>
      <h1>BÁO CÁO KINH DOANH FOXSTYLE</h1>
      <p>Ngày xuất: ${escape(new Date().toLocaleString("vi-VN"))} | Kỳ: ${{day:"Theo ngày",week:"Theo tuần",month:"Theo tháng"}[financePeriod]}</p>
      <h2>Tổng quan tài chính</h2><table class="summary">
      ${row(["Chỉ số","Giá trị (VNĐ)"],true)}
      ${row(["Doanh thu",finance?.revenue || 0])}${row(["Giá vốn đã bán",finance?.costOfGoodsSold || 0])}
      ${row(["Tiền nhập kho",finance?.stockImportCost || 0])}${row(["Lợi nhuận gộp",finance?.grossProfit || 0])}</table>
      <h2>Tài chính theo kỳ</h2><table>${row(["Kỳ","Doanh thu","Giá vốn đã bán","Tiền nhập kho","Lợi nhuận","Số đơn"],true)}${periodRows}</table>
      <h2>Sản phẩm</h2><table>${row(["Sản phẩm","Đã bán","Doanh thu","Đổi trả","Bảo hành","Tỷ lệ sự cố"],true)}${productExcelRows}</table>
      <h2>Tồn kho theo kích cỡ</h2><table>${row(["Kích cỡ","Số lượng tồn"],true)}${stockRows}</table>
      <h2>Khách hàng</h2><table>${row(["Khách hàng","Điện thoại","Số đơn","Tổng chi tiêu","Mua gần nhất"],true)}${customerRows}</table>
    </body></html>`;
    const blob = new Blob(["\ufeff", html], { type: "application/vnd.ms-excel;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Bao-cao-kinh-doanh-${financePeriod}-${new Date().toISOString().slice(0,10)}.xls`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="space-y-7">
      <div className="flex flex-col justify-between gap-4 rounded-2xl bg-gradient-to-r from-gray-950 to-gray-800 p-6 text-white md:flex-row md:items-center">
        <div><p className="text-xs font-bold uppercase tracking-[.2em] text-orange-400">FoxStyle Analytics</p><h1 className="mt-1 text-2xl font-black">Báo cáo kinh doanh</h1><p className="mt-1 text-sm text-gray-300">Doanh thu, tồn kho, chất lượng sản phẩm và khách hàng quay lại.</p></div>
        <div className="flex gap-2">
          <select value={range} onChange={(e) => setRange(e.target.value)} className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-bold [&>option]:text-gray-900"><option value="30">30 ngày</option><option value="90">90 ngày</option><option value="365">12 tháng</option><option value="all">Toàn bộ</option></select>
          <button onClick={() => { loadUserData(); loadWarranties(); setFinanceVersion((value) => value + 1); }} className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-bold"><RefreshCcw className="h-4 w-4" /> Làm mới</button>
          <button onClick={exportExcel} className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold"><Download className="h-4 w-4" /> Xuất Excel</button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Doanh thu" value={money(displayedRevenue)} note="Đơn đã giao thành công" icon={DollarSign} />
        <Card title="Giá vốn đã bán" value={money(displayedCogs)} note="Số lượng bán × giá nhập" icon={Package} />
        <Card title="Tiền hàng trong kho" value={money(displayedInventoryValue)} note={`Giá vốn hàng đang tồn · Nhập trong kỳ: ${money(displayedImportCost)}`} icon={ShoppingBag} />
        <Card title="Lợi nhuận gộp" value={money(displayedProfit)} note="Doanh thu − giá vốn" icon={DollarSign} danger={Number(displayedProfit) < 0} />
      </div>

      {financeError && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
          Dữ liệu giá vốn/nhập kho chưa tải được: {financeError}. Hãy khởi động lại backend và cập nhật database.
        </div>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-wrap justify-between gap-3">
          <div><h2 className="text-lg font-black">Doanh thu, giá vốn và lợi nhuận</h2><p className="text-xs text-gray-500">So sánh kết quả bán hàng trong cùng kỳ.</p></div>
          <div className="flex rounded-xl bg-gray-100 p-1">
            {[["day","Theo ngày"],["week","Theo tuần"],["month","Theo tháng"]].map(([value,label]) =>
              <button key={value} onClick={() => setFinancePeriod(value)} className={`rounded-lg px-4 py-2 text-xs font-black ${financePeriod === value ? "bg-white text-orange-600 shadow-sm" : "text-gray-500"}`}>{label}</button>
            )}
          </div>
        </div>
        {finance?.periods?.length ? <div className="h-80"><ResponsiveContainer><BarChart data={finance.periods}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="period" tick={{fontSize:11}}/><YAxis tickFormatter={(v)=>`${Math.round(v/1000)}k`} tick={{fontSize:11}}/><Tooltip formatter={(v)=>[money(v)]}/><Legend/><Bar dataKey="revenue" name="Doanh thu" fill="#f97316"/><Bar dataKey="costOfGoodsSold" name="Giá vốn đã bán" fill="#6366f1"/><Bar dataKey="grossProfit" name="Lợi nhuận" fill="#10b981"/></BarChart></ResponsiveContainer></div> : <Empty>Chưa có dữ liệu tài chính.</Empty>}
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card title="Giá trị đơn trung bình" value={money(completed.length ? revenue / completed.length : 0)} note="Trên mỗi đơn hoàn tất" icon={ShoppingBag} />
        <Card title="Đổi trả / bảo hành" value={`${issueRate.toFixed(1)}%`} note={issueRate > 5 ? "Vượt ngưỡng cảnh báo 5%" : "Chất lượng trong ngưỡng"} icon={issueRate > 5 ? AlertTriangle : ShieldCheck} danger={issueRate > 5} />
        <Card title="Khách quay lại" value={`${returningRate.toFixed(1)}%`} note={`${returning.length}/${customers.length} khách mua từ 2 lần`} icon={Users} />
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-wrap justify-between gap-3"><div><h2 className="text-lg font-black">Doanh thu theo ngày / tháng</h2><p className="text-xs text-gray-500">Chỉ tính đơn đã hoàn tất.</p></div><div className="flex rounded-xl bg-gray-100 p-1">{[["day","Theo ngày"],["month","Theo tháng"]].map(([v,l]) => <button key={v} onClick={() => setPeriod(v)} className={`rounded-lg px-4 py-2 text-xs font-black ${period === v ? "bg-white text-orange-600 shadow-sm" : "text-gray-500"}`}>{l}</button>)}</div></div>
        {revenueData.length ? <div className="h-80"><ResponsiveContainer><LineChart data={revenueData}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="key" tick={{fontSize:11}}/><YAxis tickFormatter={(v)=>`${Math.round(v/1000)}k`} tick={{fontSize:11}}/><Tooltip formatter={(v,n)=>n==="revenue"?[money(v),"Doanh thu"]:[v,"Đơn hàng"]}/><Legend formatter={(v)=>v==="revenue"?"Doanh thu":"Đơn hàng"}/><Line dataKey="revenue" stroke="#f97316" strokeWidth={3}/><Line dataKey="orders" stroke="#6366f1" strokeWidth={2}/></LineChart></ResponsiveContainer></div> : <Empty>Chưa có dữ liệu doanh thu.</Empty>}
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"><h2 className="text-lg font-black">Sản phẩm bán chạy nhất</h2><p className="mb-5 text-xs text-gray-500">Xếp theo số lượng trong đơn hoàn tất.</p>
          {productRows.length ? <div className="space-y-3">{[...productRows].sort((a,b)=>b.sold-a.sold).slice(0,10).map((r,i)=><div key={r.id} className="flex items-center justify-between rounded-xl border p-3"><div className="flex min-w-0 items-center gap-3"><b className="rounded-lg bg-orange-50 p-2 text-xs text-orange-600">#{i+1}</b><div className="min-w-0"><p className="truncate text-sm font-bold">{r.name}</p><p className="text-xs text-gray-500">{num(r.sold)} sản phẩm</p></div></div><b className="text-sm text-emerald-600">{money(r.revenue)}</b></div>)}</div> : <Empty>Chưa có sản phẩm đã bán.</Empty>}
        </section>
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"><h2 className="flex items-center gap-2 text-lg font-black"><Package className="h-5 w-5 text-indigo-600"/>Tồn kho theo kích cỡ</h2><p className="mb-5 text-xs text-gray-500">Kích cỡ có lượng tồn nhiều nhất được xếp ở đầu.</p>
          {sizeRows.length ? <div className="h-[360px]"><ResponsiveContainer><BarChart data={sizeRows.slice(0,12)} layout="vertical" margin={{left:15}}><CartesianGrid strokeDasharray="3 3" horizontal={false}/><XAxis type="number"/><YAxis type="category" dataKey="size" width={85} tick={{fontSize:11}}/><Tooltip formatter={(v)=>[`${num(v)} sản phẩm`,"Tồn kho"]}/><Bar dataKey="stock" fill="#6366f1" radius={[0,6,6,0]}/></BarChart></ResponsiveContainer></div> : <Empty>Chưa có dữ liệu tồn kho.</Empty>}
        </section>
      </div>

      <section className={`rounded-2xl border bg-white p-6 shadow-sm ${problemCount ? "border-red-200" : "border-gray-200"}`}>
        <div className="mb-5 flex justify-between gap-3"><div><h2 className="flex items-center gap-2 text-lg font-black"><AlertTriangle className={`h-5 w-5 ${problemCount ? "text-red-500":"text-emerald-500"}`}/>Tỷ lệ đổi trả / bảo hành theo sản phẩm</h2><p className="text-xs text-gray-500">Trên 5% là sản phẩm đang có vấn đề và cần kiểm tra.</p></div><b className={`h-fit rounded-full px-3 py-1 text-xs ${problemCount?"bg-red-100 text-red-700":"bg-emerald-100 text-emerald-700"}`}>{problemCount} cảnh báo</b></div>
        {productRows.length ? <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b bg-gray-50 text-xs uppercase text-gray-500"><th className="p-3">Sản phẩm</th><th className="p-3 text-center">Đã bán</th><th className="p-3 text-center">Đổi trả</th><th className="p-3 text-center">Bảo hành</th><th className="p-3 text-right">Tỷ lệ</th><th className="p-3 text-right">Đánh giá</th></tr></thead><tbody>{[...productRows].sort((a,b)=>b.rate-a.rate).map(r=><tr key={r.id} className={`border-b ${r.rate>5?"bg-red-50/60":""}`}><td className="p-3 font-bold">{r.name}</td><td className="p-3 text-center">{r.sold}</td><td className="p-3 text-center">{r.returned}</td><td className="p-3 text-center">{r.warranties}</td><td className={`p-3 text-right font-black ${r.rate>5?"text-red-600":"text-emerald-600"}`}>{r.rate.toFixed(1)}%</td><td className="p-3 text-right"><span className={`rounded-full px-2 py-1 text-xs font-bold ${r.rate>5?"bg-red-100 text-red-700":"bg-emerald-100 text-emerald-700"}`}>{r.rate>5?"Cần kiểm tra":"Ổn định"}</span></td></tr>)}</tbody></table></div> : <Empty>Chưa có dữ liệu để đánh giá.</Empty>}
      </section>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"><h2 className="flex items-center gap-2 text-lg font-black"><RotateCcw className="h-5 w-5 text-purple-600"/>Khách hàng quay lại</h2><p className="mb-5 text-xs text-gray-500">Khách có từ 2 đơn hoàn tất trở lên.</p>
        {returning.length ? <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr className="border-b bg-gray-50 text-xs uppercase text-gray-500"><th className="p-3">Khách hàng</th><th className="p-3">Liên hệ</th><th className="p-3 text-center">Số lần mua</th><th className="p-3 text-right">Tổng chi tiêu</th><th className="p-3 text-right">Mua gần nhất</th></tr></thead><tbody>{returning.map(c=><tr key={c.key} className="border-b"><td className="p-3 font-bold">{c.name}</td><td className="p-3 text-gray-500">{c.phone||"—"}</td><td className="p-3 text-center"><b className="rounded-full bg-purple-100 px-3 py-1 text-purple-700">{c.orders}</b></td><td className="p-3 text-right font-black text-emerald-600">{money(c.spent)}</td><td className="p-3 text-right text-gray-500">{c.last.slice(0,10)}</td></tr>)}</tbody></table></div> : <Empty>Chưa có khách mua từ 2 lần trở lên.</Empty>}
      </section>
    </div>
  );
}
