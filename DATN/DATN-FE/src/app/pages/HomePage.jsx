import { Link } from "react-router";
import { ArrowRight, Gem, Scissors, Shirt, ShoppingBag, Sparkles, Truck } from "lucide-react";
import { useApp } from "../context/AppContext";
import { ProductCard } from "../components/ProductCard";

export function HomePage() {
  const { products, wishlist, toggleWishlist } = useApp();

  const featuredProducts = products.slice(0, 8);
  const saleProducts = products.filter((product) => product.originalPrice).slice(0, 4);

  const categories = [
    {
      title: "Áo thời trang",
      description: "Áo thun, sơ mi, hoodie",
      href: "/products?category=ao",
      image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&auto=format&fit=crop",
    },
    {
      title: "Quần & denim",
      description: "Jeans, quần tây, shorts",
      href: "/products?category=quan",
      image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900&auto=format&fit=crop",
    },
    {
      title: "Váy nữ",
      description: "Midi, body, maxi",
      href: "/products?category=vay",
      image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900&auto=format&fit=crop",
    },
    {
      title: "Phụ kiện",
      description: "Túi, mũ, sneaker",
      href: "/products?category=phu-kien",
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&auto=format&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f7f4ef] text-zinc-950">
      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-zinc-950 text-white">
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1800&auto=format&fit=crop"
          alt="Bộ sưu tập thời trang FoxStyle"
          className="absolute inset-0 h-full w-full object-cover opacity-65"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/10" />

        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 border border-white/30 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] backdrop-blur">
              <Sparkles className="h-4 w-4 text-amber-300" />
              New season 2026
            </div>
            <h1 className="max-w-xl text-5xl font-black leading-[0.95] tracking-normal sm:text-6xl lg:text-7xl">
              FoxStyle
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/85 sm:text-xl">
              Không gian mua sắm thời trang hiện đại với các thiết kế dễ phối, chất liệu chọn lọc và trải nghiệm đặt hàng mượt mà.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 bg-white px-7 py-4 text-sm font-black uppercase tracking-[0.18em] text-zinc-950 transition hover:bg-amber-300"
              >
                Mua sắm ngay
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/products?sale=true"
                className="inline-flex items-center justify-center border border-white/40 px-7 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:border-white hover:bg-white/10"
              >
                Ưu đãi hôm nay
              </Link>
            </div>

            <div className="mt-12 grid max-w-lg grid-cols-3 border-y border-white/20 py-5 text-sm text-white/80">
              <div>
                <p className="text-2xl font-black text-white">12+</p>
                <p>Mẫu chọn lọc</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">24h</p>
                <p>Xử lý đơn</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white">4.8</p>
                <p>Đánh giá</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-0 px-4 py-6 sm:px-6 md:grid-cols-3 lg:px-8">
          {[
            { icon: Truck, title: "Giao hàng nhanh", text: "Theo dõi đơn rõ ràng từ lúc đặt đến khi nhận." },
            { icon: Scissors, title: "Form dáng dễ mặc", text: "Thiết kế ứng dụng cho đi làm, đi chơi và du lịch." },
            { icon: Gem, title: "Chất liệu chọn lọc", text: "Ưu tiên cảm giác mặc thoải mái và bền màu." },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 border-zinc-200 py-5 md:border-r md:px-6 md:last:border-r-0">
              <item.icon className="mt-1 h-6 w-6 shrink-0 text-zinc-950" />
              <div>
                <h3 className="font-black text-zinc-950">{item.title}</h3>
                <p className="mt-1 text-sm leading-6 text-zinc-600">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-zinc-500">Shop by edit</p>
            <h2 className="mt-2 text-3xl font-black tracking-normal text-zinc-950 md:text-4xl">Danh mục nổi bật</h2>
          </div>
          <Link to="/products" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-zinc-950 hover:text-amber-700">
            Xem tất cả
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.title} to={category.href} className="group relative aspect-[4/5] overflow-hidden bg-zinc-900">
              <img src={category.image} alt={category.title} className="h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-105 group-hover:opacity-70" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <h3 className="text-xl font-black">{category.title}</h3>
                <p className="mt-1 text-sm text-white/75">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-zinc-500">Best sellers</p>
            <h2 className="mt-2 text-3xl font-black tracking-normal text-zinc-950 md:text-4xl">Sản phẩm bán chạy</h2>
          </div>
          <Link to="/products" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-zinc-950 hover:text-amber-700">
            Mua thêm
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} wishlist={wishlist} toggleWishlist={toggleWishlist} />
          ))}
        </div>
      </section>

      <section className="bg-zinc-950 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-amber-300">Member preview</p>
            <h2 className="mt-3 max-w-xl text-3xl font-black tracking-normal md:text-5xl">Nhận ưu đãi cho bộ sưu tập mới.</h2>
            <p className="mt-5 max-w-xl leading-7 text-white/70">
              Đăng ký email để nhận mã FOXSTYLE50 và cập nhật những drop mới nhất trước khi mở bán rộng rãi.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Email của bạn"
              className="min-h-12 flex-1 border border-white/20 bg-white/10 px-4 text-sm text-white outline-none placeholder:text-white/45 focus:border-amber-300"
            />
            <button
              onClick={() => alert("Đăng ký email thành công! Bạn có thể dùng mã FOXSTYLE50 ở giỏ hàng.")}
              className="min-h-12 bg-amber-300 px-6 text-sm font-black uppercase tracking-[0.16em] text-zinc-950 transition hover:bg-white"
            >
              Đăng ký
            </button>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.22em] text-red-600">Limited deals</p>
              <h2 className="mt-2 text-3xl font-black tracking-normal text-zinc-950 md:text-4xl">Ưu đãi đặc biệt</h2>
            </div>
            <Link to="/products?sale=true" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-red-600 hover:text-zinc-950">
              Xem khuyến mãi
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {saleProducts.map((product) => (
              <ProductCard key={product.id} product={product} wishlist={wishlist} toggleWishlist={toggleWishlist} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
