import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Download, PackagePlus, RefreshCw, Search, Warehouse, X } from "lucide-react";
import * as XLSX from "xlsx";
import { useApp } from "../../context/AppContext";
import { api } from "../../services/api";

const money = (v) => `${Number(v || 0).toLocaleString("vi-VN")}đ`;

export function AdminInventory() {
  const { products = [], loadUserData } = useApp();
  const [search, setSearch] = useState("");
  const [receipts, setReceipts] = useState([]);
  const [open, setOpen] = useState(false);
  const [expandedProducts, setExpandedProducts] = useState({});
  const emptyReceiptItem = {productId:"",color:"",variantId:"",quantity:1,unitCost:""};
  const emptyForm = { supplierName:"", supplierPhone:"", note:"", discountAmount:"", shippingFee:"", otherFee:"", taxRate:"", items:[emptyReceiptItem] };
  const [form, setForm] = useState(emptyForm);
  const [excelImport, setExcelImport] = useState(null);
  const variants = useMemo(() => products.flatMap((p) => (p.variants || []).map((v) => ({...v, productId:p.productId || p.id, productName:p.name, variantId:v.variantId || v.id}))), [products]);
  const groupedProducts = useMemo(() => products.map((product) => {
    const productVariants = (product.variants || []).map((variant) => ({
      ...variant,
      variantId: variant.variantId || variant.id,
    }));
    return {
      ...product,
      productVariants,
      totalStock: productVariants.reduce((sum, variant) => sum + Number(variant.quantity || 0), 0),
    };
  }).filter((product) => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return true;
    return `${product.name} ${product.productVariants.map((variant) => `${variant.sku} ${variant.color} ${variant.size}`).join(" ")}`
      .toLowerCase()
      .includes(keyword);
  }), [products, search]);
  const toggleProduct = (productId) => setExpandedProducts((current) => ({
    ...current,
    [productId]: !current[productId],
  }));
  const totalImportedAmount = useMemo(
    () => receipts.reduce((sum, receipt) => sum + Number(receipt.totalAmount || 0), 0),
    [receipts],
  );
  const currentInventoryValue = useMemo(
    () => variants.reduce(
      (sum, variant) => sum + Number(variant.quantity || 0) * Number(variant.costPrice || 0),
      0,
    ),
    [variants],
  );
  const loadReceipts = () => api.finance.getStockReceipts().then((r)=>setReceipts(r.data || [])).catch(()=>setReceipts([]));
  useEffect(() => { loadReceipts(); }, []);

  const normalizeHeader = (value) => String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  const cell = (row, aliases) => {
    const keys = Object.keys(row || {});
    const wanted = aliases.map(normalizeHeader);
    const key = keys.find((item) => wanted.includes(normalizeHeader(item)));
    return key ? row[key] : "";
  };
  const cleanNumber = (value) => Number(String(value ?? "").replace(/[^0-9.-]/g, ""));
  const excelValidation = useMemo(() => !excelImport ? [] : form.items.map((item, index) => {
    const variant = variants.find((candidate) => String(candidate.variantId) === String(item.variantId));
    const quantity = Number(item.quantity);
    const unitCost = Number(item.unitCost);
    const duplicated = item.variantId && form.items.filter((candidate) => String(candidate.variantId) === String(item.variantId)).length > 1;
    let message = item._matchMessage || "Đã khớp";
    if (!variant) message = item._matchMessage || "Không tìm thấy SKU/biến thể tương ứng";
    else if (duplicated) message = "SKU/biến thể bị lặp trong file Excel";
    else if (!Number.isInteger(quantity) || quantity <= 0) message = "Số lượng phải là số nguyên lớn hơn 0";
    else if (!Number.isFinite(unitCost) || unitCost <= 0) message = "Giá nhập phải lớn hơn 0";
    return { index, item, variant, valid: Boolean(variant) && !duplicated && Number.isInteger(quantity) && quantity > 0 && Number.isFinite(unitCost) && unitCost > 0, message };
  }), [excelImport, form.items, variants]);
  const excelIsValid = Boolean(excelImport) && excelValidation.length > 0
    && excelValidation.every((row) => row.valid)
    && new Set(excelValidation.map((row) => String(row.item.variantId))).size === excelValidation.length;

  const importExcel = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: "", raw: false });
      if (!rows.length) throw new Error("File Excel không có dữ liệu.");
      const importedItems = rows.map((row, index) => {
        const sku = String(cell(row, ["SKU", "Mã SKU", "Ma SKU"])).trim();
        const productName = String(cell(row, ["Sản phẩm", "San pham", "Tên sản phẩm", "Ten san pham", "Product"])).trim();
        const color = String(cell(row, ["Màu", "Mau", "Màu sắc", "Mau sac", "Color"])).trim();
        const size = String(cell(row, ["Kích thước", "Kich thuoc", "Size"])).trim();
        const quantity = cleanNumber(cell(row, ["Số lượng", "So luong", "SL", "Quantity", "Qty"]));
        const unitCost = cleanNumber(cell(row, ["Giá nhập", "Gia nhap", "Đơn giá", "Don gia", "Giá vốn", "Gia von", "Unit Cost", "UnitCost"]));
        const normalized = (value) => String(value || "").trim().toLocaleLowerCase("vi");
        const bySku = sku && variants.find((variant) => normalized(variant.sku) === normalized(sku));
        const candidates = variants.filter((variant) => normalized(variant.productName) === normalized(productName)
          && normalized(variant.color) === normalized(color)
          && normalized(variant.size) === normalized(size));
        const variant = bySku || (candidates.length === 1 ? candidates[0] : null);
        return {
          productId: variant?.productId || "",
          color: variant?.color || color,
          variantId: variant?.variantId || "",
          quantity: Number.isFinite(quantity) ? quantity : "",
          unitCost: Number.isFinite(unitCost) ? unitCost : "",
          _excelRow: index + 2,
          _sku: sku,
          _productName: productName,
          _size: size,
          _matchMessage: variant ? "Đã khớp dữ liệu kho" : (candidates.length > 1 ? "Có nhiều biến thể trùng thông tin; hãy dùng SKU" : "Không tìm thấy sản phẩm/biến thể")
        };
      });
      setForm((current) => ({ ...current, items: importedItems }));
      setExcelImport({ fileName: file.name, rowCount: importedItems.length });
    } catch (error) {
      setExcelImport(null);
      alert(error.message || "Không thể đọc file Excel.");
    }
  };

  const exportReceipt = (receipt) => {
    const e=(v)=>String(v??"").replace(/&/g,"&amp;").replace(/</g,"&lt;");
    const rows=(receipt.items||[]).map((i,n)=>`<tr><td>${n+1}</td><td>${e(i.productName)}</td><td>${e(i.sku)}</td><td>${e(i.color)}</td><td>${e(i.size)}</td><td>${i.quantity}</td><td>${i.unitCost}</td><td>${i.totalCost}</td><td>${i.stockAfter}</td></tr>`).join("");
    const summary=`<table style="margin-top:18px"><tr><th colspan="2">TỔNG HỢP CHI PHÍ NHẬP KHO</th></tr>
      <tr><td>Tiền hàng trước chi phí</td><td>${receipt.subtotalAmount||0}</td></tr>
      <tr><td>Chiết khấu nhà cung cấp</td><td>-${receipt.discountAmount||0}</td></tr>
      <tr><td>VAT đầu vào (${receipt.taxRate||0}%)</td><td>${receipt.taxAmount||0}</td></tr>
      <tr><td>Phí vận chuyển</td><td>${receipt.shippingFee||0}</td></tr>
      <tr><td>Chi phí khác</td><td>${receipt.otherFee||0}</td></tr>
      <tr><th>TỔNG THANH TOÁN</th><th>${receipt.totalAmount||0}</th></tr></table>`;
    const html=`<html><head><meta charset="UTF-8"><style>body{font-family:Arial}h1{text-align:center;color:#047857}table{width:100%;border-collapse:collapse}th{background:#059669;color:white}th,td{border:1px solid #aaa;padding:8px;text-align:center}</style></head><body><h1>PHIẾU NHẬP KHO FOXSTYLE</h1><p>Mã: <b>${e(receipt.receiptCode)}</b> | Nhà cung cấp: ${e(receipt.supplierName)} | Điện thoại: ${e(receipt.supplierPhone)} | Ngày: ${new Date(receipt.createdAt).toLocaleString("vi-VN")}</p><p>Ghi chú: ${e(receipt.note)}</p><table><tr><th>STT</th><th>Sản phẩm</th><th>SKU</th><th>Màu</th><th>Kích thước</th><th>SL</th><th>Giá vốn sau phân bổ</th><th>Giá trị phân bổ</th><th>Tồn mới</th></tr>${rows}</table>${summary}</body></html>`;
    const blob=new Blob(["\ufeff",html],{type:"application/vnd.ms-excel;charset=utf-8"}); const a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=`${receipt.receiptCode}.xls`; a.click(); URL.revokeObjectURL(a.href);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (excelImport && !excelIsValid) return alert("Dữ liệu Excel còn dòng chưa khớp hoặc không hợp lệ. Vui lòng kiểm tra trước khi lưu.");
    const items=form.items.map((i)=>({variantId:Number(i.variantId),quantity:Number(i.quantity),unitCost:Number(i.unitCost)}));
    if(!form.supplierName.trim()||items.some((i)=>!i.variantId||i.quantity<=0||i.unitCost<=0)) return alert("Vui lòng nhập đầy đủ phiếu.");
    if(new Set(items.map((i)=>i.variantId)).size!==items.length) return alert("Mỗi biến thể màu và kích cỡ chỉ được nhập trên một dòng.");
    try { const r=await api.finance.createStockReceipt({...form,items,discountAmount:Number(form.discountAmount||0),shippingFee:Number(form.shippingFee||0),otherFee:Number(form.otherFee||0),taxRate:Number(form.taxRate||0)}); exportReceipt(r.data); setOpen(false); setForm(emptyForm); setExcelImport(null); await loadUserData(); await loadReceipts(); alert(`Đã nhập kho theo phiếu ${r.data.receiptCode}`); }
    catch(error){ alert(error.message||"Không thể tạo phiếu."); }
  };

  return <div className="space-y-6">
    <header className="flex flex-wrap justify-between gap-4 rounded-3xl bg-slate-950 p-6 text-white"><div><h1 className="flex gap-2 text-2xl font-black"><Warehouse/>Quản lý kho</h1><p className="text-sm text-slate-300">Tồn kho riêng theo từng màu và size.</p></div><div className="flex gap-2"><button onClick={()=>loadUserData()} className="rounded-xl bg-white/10 px-4 py-2"><RefreshCw className="mr-2 inline h-4"/>Làm mới</button><button onClick={()=>setOpen(true)} className="rounded-xl bg-emerald-600 px-4 py-2 font-black"><PackagePlus className="mr-2 inline h-4"/>Lập phiếu nhập</button></div></header>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{[["Tổng biến thể",variants.length],["Tổng tồn",variants.reduce((s,v)=>s+Number(v.quantity||0),0)],["Sắp hết (<10)",variants.filter((v)=>Number(v.quantity||0)<10).length],["Giá trị hàng đang tồn",money(currentInventoryValue)]].map(([k,v])=><div key={k} className="rounded-2xl border bg-white p-5"><p className="text-xs font-bold text-gray-500">{k}</p><b className={`text-2xl ${k==="Giá trị hàng đang tồn"?"text-emerald-600":""}`}>{v}</b>{k==="Giá trị hàng đang tồn"&&<p className="mt-1 text-xs text-gray-500">Tồn hiện tại × giá vốn bình quân · Phiếu nhập đã ghi: {money(totalImportedAmount)}</p>}</div>)}</div>
    <section className="rounded-2xl border bg-white p-5">
      <div className="mb-4 flex items-center rounded-xl border px-3"><Search className="h-4"/><input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Tìm sản phẩm, SKU, màu, kích thước..." className="w-full p-3 outline-none"/></div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="bg-gray-50 text-left"><th className="p-3">Sản phẩm</th><th>Biến thể</th><th className="text-right">Tổng tồn</th><th className="text-right">Thao tác</th></tr></thead>
          <tbody>{groupedProducts.map((product) => {
            const productId = product.productId || product.id || product.name;
            const expanded = Boolean(expandedProducts[productId]);
            return [
              <tr key={`${productId}-summary`} className="border-t hover:bg-gray-50">
                <td className="p-3 font-bold">{product.name}</td>
                <td><span className="rounded-full bg-orange-50 px-3 py-1 font-bold text-orange-600">{product.productVariants.length} biến thể</span></td>
                <td className={`text-right font-black ${product.totalStock < 10 ? "text-amber-600" : "text-emerald-600"}`}>{product.totalStock}</td>
                <td className="text-right"><button type="button" onClick={() => toggleProduct(productId)} className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 font-bold text-slate-700 hover:bg-slate-50">{expanded ? <ChevronDown className="h-4 w-4"/> : <ChevronRight className="h-4 w-4"/>} {expanded ? "Thu gọn" : "Xem màu & size"}</button></td>
              </tr>,
              expanded && <tr key={`${productId}-variants`} className="border-t bg-slate-50/70">
                <td colSpan="4" className="p-3"><div className="overflow-hidden rounded-xl border bg-white"><table className="w-full text-sm">
                  <thead><tr className="bg-slate-100 text-left text-xs uppercase text-slate-500"><th className="p-3">SKU</th><th>Màu sắc</th><th>Kích thước</th><th className="text-right">Giá vốn</th><th className="pr-3 text-right">Tồn hiện tại</th></tr></thead>
                  <tbody>{product.productVariants.map((variant) => <tr key={variant.variantId} className="border-t"><td className="p-3 font-medium">{variant.sku || "-"}</td><td>{variant.color || "-"}</td><td><span className="rounded-md bg-slate-100 px-2 py-1 font-bold">{variant.size || "-"}</span></td><td className="text-right">{money(variant.costPrice)}</td><td className={`pr-3 text-right font-black ${Number(variant.quantity || 0) < 10 ? "text-amber-600" : "text-emerald-600"}`}>{variant.quantity || 0}</td></tr>)}</tbody>
                </table></div></td>
              </tr>,
            ];
          })}</tbody>
        </table>
        {groupedProducts.length === 0 && <p className="py-8 text-center text-sm text-gray-500">Không tìm thấy sản phẩm.</p>}
      </div>
    </section>
    <section className="rounded-2xl border bg-white p-5"><h2 className="mb-3 text-lg font-black">Phiếu nhập gần đây</h2>{receipts.slice(0,10).map((r)=><div key={r.receiptId} className="flex justify-between border-t py-3"><div><b>{r.receiptCode}</b><p className="text-xs text-gray-500">{r.supplierName} · {new Date(r.createdAt).toLocaleString("vi-VN")}</p></div><div className="flex items-center gap-3"><b className="text-emerald-600">{money(r.totalAmount)}</b><button onClick={()=>exportReceipt(r)} className="rounded-lg bg-emerald-50 p-2 text-emerald-700"><Download className="h-4"/></button></div></div>)}</section>
    {open&&<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"><form onSubmit={submit} className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-white p-6">
      <div className="mb-4 flex justify-between"><h2 className="text-xl font-black">Lập phiếu nhập kho</h2><button type="button" onClick={()=>{setOpen(false);setExcelImport(null)}}><X/></button></div>
      <div className="mb-4 rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><b className="text-sm text-emerald-900">Nhập danh sách hàng từ Excel</b><p className="mt-1 text-xs text-emerald-700">Cột hỗ trợ: SKU, Sản phẩm, Màu, Size, Số lượng, Giá nhập. Ưu tiên đối chiếu chính xác bằng SKU.</p></div>
          <label className="cursor-pointer rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-black text-white hover:bg-emerald-700">Chọn file Excel<input type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={importExcel}/></label>
        </div>
        {excelImport && <div className={`mt-3 rounded-xl border p-3 text-xs ${excelIsValid ? "border-emerald-300 bg-white text-emerald-700" : "border-amber-300 bg-amber-50 text-amber-800"}`}><b>{excelImport.fileName}</b> · Đã đọc {excelImport.rowCount} dòng · {excelIsValid ? "Tất cả dữ liệu đã khớp, có thể lưu phiếu." : "Còn dữ liệu chưa khớp; nút lưu đang bị khóa."}</div>}
      </div>
      <div className="grid gap-3 md:grid-cols-2"><input required value={form.supplierName} onChange={(e)=>setForm({...form,supplierName:e.target.value})} placeholder="Nhà cung cấp *" className="rounded-xl border p-3"/><input value={form.supplierPhone} onChange={(e)=>setForm({...form,supplierPhone:e.target.value})} placeholder="Điện thoại" className="rounded-xl border p-3"/></div>
      <textarea value={form.note} onChange={(e)=>setForm({...form,note:e.target.value})} placeholder="Ghi chú" className="mt-3 w-full rounded-xl border p-3"/>
      <div className="mt-3 grid gap-3 md:grid-cols-4">
        <label className="text-xs font-bold text-gray-600">Chiết khấu NCC
          <input type="number" min="0" step="1000" value={form.discountAmount} onChange={(e)=>setForm({...form,discountAmount:e.target.value})} placeholder="0đ" className="mt-1 w-full rounded-xl border p-3 font-normal"/>
        </label>
        <label className="text-xs font-bold text-gray-600">VAT đầu vào (%)
          <input type="number" min="0" max="100" step="0.1" value={form.taxRate} onChange={(e)=>setForm({...form,taxRate:e.target.value})} placeholder="Ví dụ: 8" className="mt-1 w-full rounded-xl border p-3 font-normal"/>
        </label>
        <label className="text-xs font-bold text-gray-600">Phí vận chuyển
          <input type="number" min="0" step="1000" value={form.shippingFee} onChange={(e)=>setForm({...form,shippingFee:e.target.value})} placeholder="0đ" className="mt-1 w-full rounded-xl border p-3 font-normal"/>
        </label>
        <label className="text-xs font-bold text-gray-600">Chi phí khác
          <input type="number" min="0" step="1000" value={form.otherFee} onChange={(e)=>setForm({...form,otherFee:e.target.value})} placeholder="0đ" className="mt-1 w-full rounded-xl border p-3 font-normal"/>
        </label>
      </div>
      {form.items.map((i,n)=>{
        const selectedVariant=variants.find((variant)=>String(variant.variantId)===String(i.variantId));
        const productVariants=variants.filter((variant)=>String(variant.productId)===String(i.productId));
        const colors=[...new Set(productVariants.map((variant)=>variant.color).filter(Boolean))];
        const colorVariants=productVariants.filter((variant)=>variant.color===i.color);
        return <div key={n} className="mt-3 rounded-xl border bg-gray-50 p-3">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.5fr_1fr_100px_120px_170px_45px]">
            <label className="text-xs font-bold text-gray-600">Sản phẩm
              <select value={i.productId} onChange={(e)=>{const x=[...form.items];x[n]={...i,productId:e.target.value,color:"",variantId:""};setForm({...form,items:x})}} className="mt-1 w-full rounded-xl border bg-white p-3 text-sm font-normal text-gray-900"><option value="">Chọn sản phẩm</option>{products.filter((product)=>(product.variants||[]).length>0).map((product)=><option key={product.productId||product.id} value={product.productId||product.id}>{product.name}</option>)}</select>
            </label>
            <label className="text-xs font-bold text-gray-600">Màu sắc
              <select disabled={!i.productId} value={i.color} onChange={(e)=>{const x=[...form.items];x[n]={...i,color:e.target.value,variantId:""};setForm({...form,items:x})}} className="mt-1 w-full rounded-xl border bg-white p-3 text-sm font-normal text-gray-900 disabled:bg-gray-100"><option value="">Chọn màu</option>{colors.map((color)=><option key={color} value={color}>{color}</option>)}</select>
            </label>
            <label className="text-xs font-bold text-gray-600">Size
              <select disabled={!i.color} value={i.variantId} onChange={(e)=>{const x=[...form.items];x[n]={...i,variantId:e.target.value};setForm({...form,items:x})}} className="mt-1 w-full rounded-xl border bg-white p-3 text-sm font-normal text-gray-900 disabled:bg-gray-100"><option value="">Chọn size</option>{colorVariants.map((variant)=><option key={variant.variantId} value={variant.variantId}>{variant.size||"-"}</option>)}</select>
            </label>
            <label className="text-xs font-bold text-gray-600">Số lượng nhập
              <input required type="number" min="1" step="1" value={i.quantity} onChange={(e)=>{const x=[...form.items];x[n]={...i,quantity:e.target.value};setForm({...form,items:x})}} placeholder="Số lượng" className="mt-1 w-full rounded-xl border bg-white p-3 text-sm font-normal text-gray-900"/>
            </label>
            <label className="text-xs font-bold text-gray-600">Giá nhập / sản phẩm
              <input required type="number" min="1" step="1000" value={i.unitCost} onChange={(e)=>{const x=[...form.items];x[n]={...i,unitCost:e.target.value};setForm({...form,items:x})}} placeholder="Ví dụ: 150.000đ" className="mt-1 w-full rounded-xl border bg-white p-3 text-sm font-normal text-gray-900"/>
            </label>
            <button type="button" title="Xóa dòng" onClick={()=>setForm({...form,items:form.items.filter((_,k)=>k!==n)})} className="mt-5 rounded-xl text-xl font-bold text-red-600 hover:bg-red-50">×</button>
          </div>
          <div className="mt-2 flex flex-wrap justify-between gap-2 text-xs">
            <span className="text-gray-500">Tồn hiện tại: <b className="text-slate-900">{selectedVariant?.quantity || 0}</b></span>
            <span className="text-gray-500">Thành tiền: <b className="text-emerald-600">{money(Number(i.quantity||0)*Number(i.unitCost||0))}</b></span>
          </div>
        </div>;
      })}
      {excelImport && <div className="mt-4 overflow-x-auto rounded-2xl border"><table className="w-full text-xs"><thead><tr className="bg-slate-100 text-left"><th className="p-3">Dòng Excel</th><th>SKU</th><th>Sản phẩm</th><th>Màu / Size</th><th>SL</th><th>Giá nhập</th><th>Kết quả đối chiếu</th></tr></thead><tbody>{excelValidation.map((row)=><tr key={row.index} className="border-t"><td className="p-3">{row.item._excelRow || row.index + 2}</td><td>{row.item._sku || row.variant?.sku || "-"}</td><td>{row.item._productName || row.variant?.productName || "-"}</td><td>{row.item.color || "-"} / {row.item._size || row.variant?.size || "-"}</td><td>{row.item.quantity}</td><td>{money(row.item.unitCost)}</td><td className={`font-bold ${row.valid ? "text-emerald-600" : "text-red-600"}`}>{row.valid ? "✓ " : "✕ "}{row.message}</td></tr>)}</tbody></table></div>}
      <div className="mt-4 flex justify-between"><button type="button" onClick={()=>setForm({...form,items:[...form.items,{...emptyReceiptItem}]})} className="rounded-xl bg-blue-50 px-4 py-2 font-bold text-blue-700">+ Thêm dòng màu–size</button><div className="text-right"><span className="mr-2 text-sm font-bold text-gray-500">Tổng thanh toán:</span><b className="text-xl text-emerald-600">{money((()=>{const sub=form.items.reduce((s,i)=>s+Number(i.quantity||0)*Number(i.unitCost||0),0);const taxable=Math.max(0,sub-Number(form.discountAmount||0));return taxable+taxable*Number(form.taxRate||0)/100+Number(form.shippingFee||0)+Number(form.otherFee||0)})())}</b></div></div>
      <button disabled={Boolean(excelImport) && !excelIsValid} className="mt-5 w-full rounded-xl bg-emerald-600 py-3 font-black text-white disabled:cursor-not-allowed disabled:bg-gray-400">{excelImport && !excelIsValid ? "Kiểm tra và sửa dữ liệu Excel trước khi lưu" : "Lưu phiếu và xuất Excel"}</button>
    </form></div>}
  </div>;
}
