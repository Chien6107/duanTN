import { Facebook, Instagram, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { Link } from "react-router";

export function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div>
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center bg-white text-xl font-black text-zinc-950">F</div>
              <div>
                <span className="block text-xl font-black text-white">FoxStyle</span>
                <span className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">Fashion store</span>
              </div>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-7 text-zinc-400">
              Thời trang hiện đại cho nhịp sống đô thị: dễ phối, chỉn chu và đủ nổi bật cho từng khoảnh khắc thường ngày.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-white">Mua sắm</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/products" className="hover:text-amber-300">Tất cả sản phẩm</Link></li>
              <li><Link to="/products?sale=true" className="hover:text-amber-300">Khuyến mãi</Link></li>
              <li><Link to="/cart" className="hover:text-amber-300">Giỏ hàng</Link></li>
              <li><Link to="/orders" className="hover:text-amber-300">Tra cứu đơn hàng</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-white">Danh mục</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/products?category=ao" className="hover:text-amber-300">Áo</Link></li>
              <li><Link to="/products?category=quan" className="hover:text-amber-300">Quần</Link></li>
              <li><Link to="/products?category=vay" className="hover:text-amber-300">Váy</Link></li>
              <li><Link to="/products?category=phu-kien" className="hover:text-amber-300">Phụ kiện</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-black uppercase tracking-[0.18em] text-white">Liên hệ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-amber-300" />
                <span>0123 456 789</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-amber-300" />
                <span>foxstyle@email.com</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-amber-300" />
                <span>Hà Nội, Việt Nam</span>
              </li>
            </ul>
            <div className="mt-5 flex gap-3">
              {[Facebook, Instagram, Twitter].map((Icon, index) => (
                <a key={index} href="#" className="flex h-10 w-10 items-center justify-center border border-white/15 transition hover:border-amber-300 hover:text-amber-300" aria-label="Social link">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-zinc-500 md:flex-row md:items-center md:justify-between">
          <p>&copy; 2026 FoxStyle. Tất cả quyền được bảo lưu.</p>
          <p>Đổi trả trong 7 ngày · Thanh toán an toàn · Hỗ trợ khách hàng</p>
        </div>
      </div>
    </footer>
  );
}
