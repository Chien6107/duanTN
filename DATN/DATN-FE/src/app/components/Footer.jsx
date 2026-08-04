import { Facebook, Instagram, Mail, MapPin, Phone, Twitter, Crown } from "lucide-react";
import { Link } from "react-router";
import { useSiteSettings } from "../hooks/useSiteSettings";

export function Footer() {
  const site = useSiteSettings();
  return (
    <footer className="bg-zinc-950 text-zinc-300 border-t border-zinc-800 selection:bg-amber-400 selection:text-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div className="space-y-4">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white p-1 shadow-lg shadow-amber-500/10 group-hover:scale-105 transition-transform duration-300">
                <img src={site.site_logo || "/image_quan_tri/logo.jpg"} alt={`${site.site_name} Logo`} className="h-full w-full object-contain" />
              </div>
              <div>
                <span className="block text-xl font-black tracking-tight text-white group-hover:text-amber-400 transition-colors">{site.site_name}</span>
                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-amber-400 block">ELEGANCE REDEFINED</span>
              </div>
            </Link>
            <p className="max-w-sm text-xs leading-relaxed text-zinc-400 font-medium">
              Thương hiệu thời trang cao cấp mang nét cá tính thượng thừa: chỉn chu, hiện đại và luôn nổi bật ở mọi sự kiện đặc biệt.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-black uppercase tracking-wider text-white">Thông tin & Hỗ trợ</h3>
            <ul className="space-y-3 text-xs font-bold text-zinc-400">
              <li><Link to="/products" className="hover:text-white transition-colors">Tất cả sản phẩm</Link></li>
              <li><Link to="/products?sale=true" className="hover:text-white transition-colors">Sản phẩm khuyến mãi</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Giỏ hàng của tôi</Link></li>
              <li><Link to="/orders" className="hover:text-white transition-colors">Tra cứu đơn hàng</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Về chúng tôi</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Liên hệ</Link></li>
              <li><Link to="/policies" className="hover:text-white transition-colors">Chính sách khách hàng</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-black uppercase tracking-wider text-white">Chính Sách & Thuế</h3>
            <ul className="space-y-3 text-xs font-bold text-zinc-400">
              <li><Link to="/policies#returns" className="text-zinc-300 hover:text-white transition-colors">Chính sách đổi trả 7 ngày</Link></li>
              <li><Link to="/policies#warranty" className="text-zinc-300 hover:text-white transition-colors">Bảo hành phom dáng & vải</Link></li>
              <li><span className="text-amber-400 font-extrabold">Đã bao gồm thuế VAT 8%</span></li>
              <li><span className="text-zinc-300">Xuất hóa đơn GTGT (Đỏ)</span></li>
              <li><Link to="/policies#privacy" className="text-zinc-300 hover:text-white transition-colors">Bảo mật thông tin 100%</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-black uppercase tracking-[0.2em] text-amber-400">Dịch Vụ Khách Hàng</h3>
            <ul className="space-y-3 text-xs font-medium">
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-amber-400 shrink-0" />
                <span className="font-bold text-white">{site.site_phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-amber-400 shrink-0" />
                <span>{site.site_email}</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-amber-400 shrink-0" />
                <span>{site.site_address}</span>
              </li>
            </ul>
            <div className="mt-5 flex gap-3">
              {[Facebook, Instagram, Twitter].map((Icon, index) => (
                <a key={index} href="#" className="flex h-10 w-10 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 text-zinc-400 transition hover:border-amber-400 hover:text-amber-400 hover:scale-105" aria-label="Social link">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-zinc-800/80 pt-8 text-xs text-zinc-500 font-medium md:flex-row md:items-center md:justify-between">
          <p>&copy; 2026 FoxStyle Luxury. Tất cả quyền được bảo lưu.</p>
          <div className="flex items-center gap-4 text-amber-400/80 font-bold">
            <span>✨ Đổi trả trong 7 ngày</span>
            <span>·</span>
            <span>Thanh toán bảo mật 100%</span>
            <span>·</span>
            <span>Hỗ trợ VIP 24/7</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
