import { useEffect } from "react";
import { Link, useLocation } from "react-router";
import { ArrowLeft, FileText, ReceiptText, RefreshCcw, ShieldCheck } from "lucide-react";
import { useSiteSettings } from "../hooks/useSiteSettings";

const policies = [
  { id: "returns", icon: RefreshCcw, title: "Chính sách đổi trả", summary: "Đổi trả trong vòng 7 ngày kể từ khi nhận hàng.", items: ["Sản phẩm còn nguyên tem, nhãn và chưa qua sử dụng hoặc giặt ủi.", "Sản phẩm không bị bẩn, hư hỏng hoặc biến dạng do quá trình bảo quản của khách hàng.", "Khách hàng cung cấp mã đơn hàng hoặc hóa đơn mua hàng để được hỗ trợ.", "Chi phí vận chuyển phát sinh được xác định theo nguyên nhân đổi trả và thông báo trước khi xử lý."] },
  { id: "warranty", icon: ShieldCheck, title: "Chính sách bảo hành", summary: "Hỗ trợ kiểm tra lỗi đường may, phom dáng và chất liệu theo tình trạng thực tế.", items: ["FoxStyle tiếp nhận sản phẩm có lỗi kỹ thuật từ nhà sản xuất.", "Thời gian xử lý dự kiến từ 3–7 ngày làm việc sau khi tiếp nhận sản phẩm.", "Không áp dụng với hư hỏng do sử dụng sai hướng dẫn, tác động ngoại lực hoặc tự ý sửa chữa."] },
  { id: "tax", icon: ReceiptText, title: "Thuế và hóa đơn", summary: "Giá niêm yết đã bao gồm VAT theo mức thuế hiện hành.", items: ["Khách hàng có thể yêu cầu xuất hóa đơn GTGT khi đặt hàng.", "Thông tin xuất hóa đơn cần được cung cấp đầy đủ và chính xác trước khi đơn hàng hoàn tất.", "Hóa đơn điện tử được gửi đến địa chỉ email khách hàng đã đăng ký."] },
  { id: "privacy", icon: FileText, title: "Chính sách bảo mật", summary: "Thông tin cá nhân chỉ được sử dụng để phục vụ giao dịch và chăm sóc khách hàng.", items: ["FoxStyle không bán hoặc chia sẻ dữ liệu cá nhân cho bên thứ ba vì mục đích thương mại.", "Dữ liệu thanh toán được xử lý qua các đơn vị cung cấp dịch vụ thanh toán được tích hợp.", "Khách hàng có thể yêu cầu kiểm tra hoặc cập nhật thông tin tài khoản của mình."] },
];

export function PoliciesPage() {
  const { hash } = useLocation();
  const site = useSiteSettings();
  const managedContent = {
    returns: site.policy_returns,
    warranty: site.policy_warranty,
    tax: site.policy_tax,
    privacy: site.policy_privacy,
  };
  useEffect(() => {
    const target = hash && document.getElementById(hash.slice(1));
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  }, [hash]);

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950">
      <section className="bg-zinc-950 text-white"><div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-bold text-zinc-300 transition hover:text-white"><ArrowLeft className="h-4 w-4" /> Về trang chủ</Link>
        <p className="mt-8 text-xs font-black uppercase tracking-[0.25em] text-orange-400">{site.site_name}</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Chính sách khách hàng</h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-300">Các quy định về đổi trả, bảo hành, hóa đơn và bảo mật khi mua sắm tại FoxStyle.</p>
      </div></section>
      <section className="mx-auto grid max-w-6xl gap-6 px-4 py-12 sm:px-6 lg:px-8">
        {policies.map(({ id, icon: Icon, title, summary, items }) => (
          <article id={id} key={id} className="scroll-mt-28 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8"><div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600"><Icon className="h-6 w-6" /></span>
            <div><h2 className="text-xl font-black sm:text-2xl">{title}</h2><p className="mt-3 whitespace-pre-line text-sm leading-7 text-zinc-600">{managedContent[id] || summary}</p>
            </div>
          </div></article>
        ))}
      </section>
    </main>
  );
}
