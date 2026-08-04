import { useState } from "react";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";

export function ContactPage() {
  const { sendMessage, currentUser } = useApp();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const handleSubmit = (event) => {
    event.preventDefault();
    const contactId = `contact_${form.email.trim().toLowerCase()}`;
    const contactContent = [
      "📩 YÊU CẦU LIÊN HỆ TỪ KHÁCH HÀNG",
      `Họ tên: ${form.name.trim()}`,
      `Email: ${form.email.trim()}`,
      `Số điện thoại: ${form.phone.trim() || "Không cung cấp"}`,
      `Tài khoản: ${currentUser?.username || "Khách chưa đăng nhập"}`,
      "",
      `Nội dung: ${form.message.trim()}`
    ].join("\n");

    sendMessage(
      contactId,
      form.name.trim(),
      "customer",
      form.name.trim(),
      contactContent
    );
    toast.success("Cảm ơn bạn! FoxStyle đã nhận được lời nhắn.");
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <main className="min-h-screen bg-[#f7f7f5] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <span className="text-xs font-black uppercase tracking-[0.22em] text-orange-600">FoxStyle Care</span>
          <h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Liên hệ với chúng tôi</h1>
          <p className="mt-4 text-sm leading-7 text-zinc-600">Bạn cần tư vấn sản phẩm, size hoặc hỗ trợ đơn hàng? Đội ngũ FoxStyle luôn sẵn sàng hỗ trợ.</p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <section className="space-y-4">
            {[
              { icon: Phone, title: "Điện thoại", value: "0123 456 789" },
              { icon: Mail, title: "Email", value: "support@foxstyle.vn" },
              { icon: MapPin, title: "Địa chỉ", value: "Hà Nội & TP. Hồ Chí Minh" },
              { icon: Clock, title: "Thời gian hỗ trợ", value: "08:00 – 22:00, tất cả các ngày" },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                  <item.icon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider text-zinc-500">{item.title}</h2>
                  <p className="mt-1 text-sm font-bold text-zinc-900">{item.value}</p>
                </div>
              </div>
            ))}
          </section>

          <form onSubmit={handleSubmit} className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-black">Gửi lời nhắn</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Họ và tên *" className="h-12 rounded-xl border border-zinc-300 px-4 text-sm outline-none focus:border-orange-500" />
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email *" className="h-12 rounded-xl border border-zinc-300 px-4 text-sm outline-none focus:border-orange-500" />
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Số điện thoại" className="h-12 rounded-xl border border-zinc-300 px-4 text-sm outline-none focus:border-orange-500 sm:col-span-2" />
              <textarea required rows={6} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Nội dung cần hỗ trợ *" className="rounded-xl border border-zinc-300 p-4 text-sm outline-none focus:border-orange-500 sm:col-span-2" />
            </div>
            <button type="submit" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-6 py-3 text-xs font-black uppercase text-white transition hover:bg-orange-600">
              <Send className="h-4 w-4" /> Gửi liên hệ
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
