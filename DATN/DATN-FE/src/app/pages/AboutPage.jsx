import { Link } from "react-router";
import { ArrowRight, Award, Heart, ShieldCheck, Sparkles, Users } from "lucide-react";

export function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f7f7f5] text-zinc-950">
      <section className="relative overflow-hidden bg-zinc-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.3),transparent_40%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-500/10 px-4 py-2 text-xs font-black uppercase tracking-widest text-orange-300">
            <Sparkles className="h-4 w-4" /> Câu chuyện FoxStyle
          </span>
          <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl">
            Thời trang giúp bạn tự tin thể hiện phiên bản tốt nhất của mình.
          </h1>
          <p className="mt-6 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
            FoxStyle mang đến những thiết kế hiện đại, dễ phối và phù hợp với nhịp sống của người Việt. Chúng tôi chú trọng từ chất liệu, phom dáng đến trải nghiệm mua sắm.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        {[
          { icon: Award, title: "Chất lượng chọn lọc", text: "Sản phẩm được kiểm tra kỹ về đường may, chất liệu và độ bền." },
          { icon: Users, title: "Khách hàng là trung tâm", text: "Tư vấn tận tâm và cải tiến trải nghiệm từ phản hồi thực tế." },
          { icon: ShieldCheck, title: "Mua sắm an tâm", text: "Thông tin rõ ràng, thanh toán bảo mật và hỗ trợ đổi trả." },
        ].map((item) => (
          <article key={item.title} className="rounded-3xl border border-zinc-200 bg-white p-7 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
              <item.icon className="h-6 w-6" />
            </div>
            <h2 className="mt-5 text-lg font-black">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{item.text}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-gradient-to-r from-orange-600 to-pink-600 p-8 text-white sm:flex-row sm:items-center lg:p-12">
          <div>
            <Heart className="h-7 w-7 fill-white" />
            <h2 className="mt-3 text-2xl font-black sm:text-3xl">Khám phá phong cách của bạn</h2>
            <p className="mt-2 text-sm text-white/80">Hàng trăm sản phẩm và set phối sẵn đang chờ bạn.</p>
          </div>
          <Link to="/products" className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-xs font-black uppercase text-zinc-950">
            Mua sắm ngay <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
