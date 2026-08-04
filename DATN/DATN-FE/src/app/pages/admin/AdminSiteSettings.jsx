import { useEffect, useState } from "react";
import { Globe2, Image, Loader2, Save, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "../../context/AppContext";
import { api } from "../../services/api";

const defaults = {
  site_name: "FoxStyle",
  site_logo: "/image_quan_tri/logo.jpg",
  site_phone: "0123 456 789",
  site_email: "support@foxstyle.vn",
  site_address: "Hà Nội & TP. Hồ Chí Minh",
  policy_returns: `CHÍNH SÁCH ĐỔI TRẢ

Cảm ơn Quý khách đã tin tưởng và mua sắm tại FoxStyle.

Để đảm bảo quyền lợi của khách hàng, chúng tôi áp dụng chính sách đổi trả như sau:

Thời gian đổi/trả: 7 ngày kể từ ngày khách hàng nhận được sản phẩm.
Sản phẩm phải còn nguyên tem mác, chưa qua sử dụng, chưa giặt ủi, không bị hư hỏng và còn đầy đủ phụ kiện (nếu có).
Khách hàng cần cung cấp mã đơn hàng hoặc hóa đơn mua hàng khi yêu cầu đổi/trả.

TRƯỜNG HỢP ĐƯỢC ĐỔI/TRẢ
- Giao sai sản phẩm, sai màu sắc hoặc sai kích thước.
- Sản phẩm bị lỗi do nhà sản xuất.
- Sản phẩm bị hư hỏng trong quá trình vận chuyển.

TRƯỜNG HỢP KHÔNG ÁP DỤNG
- Sản phẩm đã qua sử dụng hoặc bị hư hỏng do người sử dụng.
- Sản phẩm không còn nguyên tem mác hoặc bao bì.
- Sản phẩm thuộc chương trình khuyến mãi đặc biệt (nếu có quy định riêng).

Mọi yêu cầu đổi trả vui lòng liên hệ:
Hotline: 0123 456 789
Email: support@foxstyle.vn`,
  policy_warranty: `CHÍNH SÁCH BẢO HÀNH

FoxStyle cam kết cung cấp sản phẩm đạt chất lượng và hỗ trợ khách hàng trong quá trình sử dụng.

Thời gian bảo hành: 30 ngày kể từ ngày nhận hàng.
Bảo hành đối với các lỗi do nhà sản xuất.
Không bảo hành các trường hợp hư hỏng do va đập, rách, cháy, ngấm nước hoặc sử dụng sai hướng dẫn.

Sau khi tiếp nhận sản phẩm, chúng tôi sẽ kiểm tra và phản hồi kết quả trong vòng 3–7 ngày làm việc.

Thông tin hỗ trợ:
Hotline: 0123 456 789
Email: support@foxstyle.vn`,
  policy_tax: `THUẾ VÀ HÓA ĐƠN

Giá sản phẩm hiển thị trên website đã bao gồm thuế GTGT theo quy định hiện hành.

Khách hàng có nhu cầu xuất hóa đơn điện tử vui lòng cung cấp:
- Họ và tên/Tên công ty.
- Mã số thuế.
- Địa chỉ.
- Email nhận hóa đơn.

Hóa đơn sẽ được gửi qua email trong vòng 3 ngày làm việc sau khi thanh toán thành công.
Nếu cần điều chỉnh thông tin hóa đơn, vui lòng liên hệ trong vòng 24 giờ kể từ khi đặt hàng.

Thông tin liên hệ:
Hotline: 0123 456 789
Email: support@foxstyle.vn`,
  policy_privacy: `CHÍNH SÁCH BẢO MẬT

FoxStyle cam kết bảo vệ thông tin cá nhân của khách hàng theo quy định của pháp luật.

1. THÔNG TIN THU THẬP
- Họ và tên.
- Số điện thoại.
- Địa chỉ giao hàng.
- Email.
- Thông tin thanh toán (nếu có).

2. MỤC ĐÍCH SỬ DỤNG
Thông tin của khách hàng được sử dụng để:
- Xử lý đơn hàng.
- Giao hàng.
- Chăm sóc khách hàng.
- Gửi thông báo về đơn hàng.
- Gửi chương trình khuyến mãi khi khách hàng đồng ý.

3. BẢO MẬT THÔNG TIN
Chúng tôi áp dụng các biện pháp kỹ thuật và quản lý nhằm bảo vệ dữ liệu khách hàng khỏi việc truy cập trái phép, mất mát hoặc rò rỉ thông tin.

4. CHIA SẺ THÔNG TIN
Thông tin khách hàng chỉ được chia sẻ với:
- Đơn vị vận chuyển.
- Đơn vị thanh toán.
- Cơ quan Nhà nước có thẩm quyền khi được yêu cầu theo quy định pháp luật.

5. QUYỀN CỦA KHÁCH HÀNG
Khách hàng có quyền yêu cầu xem, chỉnh sửa hoặc xóa thông tin cá nhân bằng cách liên hệ:
Hotline: 0123 456 789
Email: support@foxstyle.vn`,
};

const mergeWithPolicyDefaults = data => {
  const merged = { ...defaults, ...(data || {}) };
  const legacyDefaults = {
    policy_returns: "FoxStyle hỗ trợ đổi trả sản phẩm trong vòng 7 ngày",
    policy_warranty: "FoxStyle tiếp nhận bảo hành sản phẩm có lỗi kỹ thuật",
    policy_tax: "Giá sản phẩm niêm yết đã bao gồm VAT",
    policy_privacy: "FoxStyle cam kết bảo mật thông tin cá nhân",
  };
  ["policy_returns", "policy_warranty", "policy_tax", "policy_privacy"].forEach(key => {
    const value = String(merged[key] || "").trim();
    const stillUsesTemplatePlaceholders = /\[(Tên cửa hàng|Số điện thoại|Email|___|đã bao gồm\/chưa bao gồm)\]/.test(value);
    if (!value || value.startsWith(legacyDefaults[key]) || stillUsesTemplatePlaceholders) merged[key] = defaults[key];
  });
  return merged;
};
const Field = ({ label, ...props }) => <label className="block"><span className="mb-2 block text-xs font-black uppercase tracking-wider text-zinc-600">{label}</span><input {...props} className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:bg-zinc-100" /></label>;
const Policy = ({ label, ...props }) => <label className="block"><span className="mb-2 block text-sm font-black text-zinc-800">{label}</span><textarea {...props} rows={5} className="w-full resize-y rounded-xl border border-zinc-200 px-4 py-3 text-sm leading-6 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" /></label>;

export function AdminSiteSettings() {
  const { currentUser } = useApp();
  const [form, setForm] = useState(defaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  useEffect(() => { api.settings.getSiteSettings().then(res => setForm(mergeWithPolicyDefaults(res.data))).catch(() => { try { setForm(mergeWithPolicyDefaults(JSON.parse(localStorage.getItem("foxstyle_site_settings") || "null"))); } catch { setForm(defaults); } }).finally(() => setLoading(false)); }, []);
  if (currentUser?.role !== "admin") return <div className="rounded-2xl bg-white p-10 text-center"><ShieldAlert className="mx-auto h-14 w-14 text-red-500" /><h1 className="mt-4 text-xl font-black">Chỉ Quản trị viên được truy cập</h1></div>;
  if (loading) return <div className="flex min-h-[50vh] items-center justify-center"><Loader2 className="h-9 w-9 animate-spin text-orange-500" /></div>;
  const set = key => event => setForm(prev => ({ ...prev, [key]: event.target.value }));
  const uploadLogo = async event => { const file = event.target.files?.[0]; if (!file) return; if (!file.type.startsWith("image/")) return toast.error("Vui lòng chọn tệp hình ảnh"); if (file.size > 1024 * 1024) return toast.error("Logo không được vượt quá 1 MB"); try { const result = await api.media.upload(file, "image_quan_tri"); setForm(prev => ({ ...prev, site_logo: result.url })); } catch (error) { toast.error(error.message || "Không thể lưu logo"); } };
  const save = async () => { if (!form.site_name.trim()) return toast.error("Tên website không được để trống"); setSaving(true); try { const res = await api.settings.updateSiteSettings(form); const saved = mergeWithPolicyDefaults(res.data || form); localStorage.setItem("foxstyle_site_settings", JSON.stringify(saved)); setForm(saved); window.dispatchEvent(new CustomEvent("site-settings-updated", { detail: saved })); toast.success("Đã lưu cấu hình website và chính sách"); } catch (error) { const saved = mergeWithPolicyDefaults(form); localStorage.setItem("foxstyle_site_settings", JSON.stringify(saved)); setForm(saved); window.dispatchEvent(new CustomEvent("site-settings-updated", { detail: saved })); toast.warning("Backend chưa nạp API mới; cấu hình đã được lưu tạm trên trình duyệt"); } finally { setSaving(false); } };
  return <div className="mx-auto max-w-6xl space-y-6">
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h1 className="flex items-center gap-3 text-2xl font-black"><Globe2 className="text-orange-500" />Website & Chính sách</h1><p className="mt-1 text-sm text-zinc-500">Quản lý tên, logo, liên hệ và nội dung chính sách công khai.</p></div><button onClick={save} disabled={saving} className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 py-3 text-sm font-black text-white hover:bg-orange-700 disabled:opacity-60">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Lưu thay đổi</button></div>
    <section className="grid gap-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm lg:grid-cols-[220px_1fr]"><div><h2 className="font-black">Logo website</h2><div className="mt-4 flex h-36 items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-4"><img src={form.site_logo || "/image_quan_tri/logo.jpg"} alt="Logo xem trước" className="max-h-full max-w-full object-contain" /></div><label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold hover:bg-zinc-50"><Image className="h-4 w-4" />Chọn ảnh<input type="file" accept="image/*" onChange={uploadLogo} className="hidden" /></label></div><div className="grid content-start gap-5 sm:grid-cols-2"><Field label="Tên website" value={form.site_name} onChange={set("site_name")} /><Field label="Đường dẫn logo" value={form.site_logo.startsWith("data:") ? "Logo đã tải lên" : form.site_logo} onChange={set("site_logo")} disabled={form.site_logo.startsWith("data:")} /><Field label="Số điện thoại" value={form.site_phone} onChange={set("site_phone")} /><Field label="Email hỗ trợ" type="email" value={form.site_email} onChange={set("site_email")} /><div className="sm:col-span-2"><Field label="Địa chỉ" value={form.site_address} onChange={set("site_address")} /></div></div></section>
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm"><h2 className="text-lg font-black">Nội dung trang chính sách</h2><div className="mt-5 grid gap-5 lg:grid-cols-2"><Policy label="Chính sách đổi trả" value={form.policy_returns} onChange={set("policy_returns")} /><Policy label="Chính sách bảo hành" value={form.policy_warranty} onChange={set("policy_warranty")} /><Policy label="Thuế và hóa đơn" value={form.policy_tax} onChange={set("policy_tax")} /><Policy label="Chính sách bảo mật" value={form.policy_privacy} onChange={set("policy_privacy")} /></div></section>
  </div>;
}
