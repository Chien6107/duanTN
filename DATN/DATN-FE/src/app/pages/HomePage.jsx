import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowRight, Gem, Scissors, ShoppingBag, Sparkles, Truck, Flame, Clock, Gift, X, ShieldCheck, Loader2, Award, FileText, Layers, Eye, BookOpen, Heart } from "lucide-react";

import { useApp } from "../context/AppContext";
import { ProductCard } from "../components/ProductCard";
import { api } from "../services/api";
import { toast } from "sonner";
import { hasValidProductDiscount, isFlashSaleActive, isFlashSaleProduct } from "../utils/pricing";

const normalizeManagedText = (value) =>
  String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

const isPublishedArticle = (article) => {
  const isPublished =
    article?.status === undefined ||
    article?.status === null ||
    article?.status === 1 ||
    article?.status === "1" ||
    article?.status === "published";
  if (!isPublished) return false;
  if (article?.pinned) return true;
  const publishedAt = new Date(article?.publishDate || article?.createdAt || 0).getTime();
  return Boolean(publishedAt) && Date.now() - publishedAt < 7 * 24 * 60 * 60 * 1000;
};

export function HomePage() {
  const { products = [], wishlist = [], toggleWishlist, banners = [], flashSaleConfig = {}, currentUser } = useApp();
  const newsletterOwnerKey = currentUser?.id || currentUser?.username || "guest";
  const newsletterStorageKey = `foxstyle_newsletter_used_${newsletterOwnerKey}`;
  const [currentBannerIdx, setCurrentBannerIdx] = useState(0);
  const [showFirstOrderModal, setShowFirstOrderModal] = useState(false);
  const [guestEmail, setGuestEmail] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [hasSubscribedNewsletter, setHasSubscribedNewsletter] = useState(() => {
    try {
      const sessionUser = JSON.parse(localStorage.getItem("foxstyle_current_user") || "null");
      const owner = sessionUser?.id || sessionUser?.username || "guest";
      return localStorage.getItem(`foxstyle_newsletter_used_${owner}`) === "true";
    } catch (e) {
      return false;
    }
  });
  const navigate = useNavigate();

  // Load Brands, Topics, Articles for Homepage Display
  const [homeBrands, setHomeBrands] = useState(() => {
    try {
      const saved = localStorage.getItem("foxstyle_admin_brands");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((b) => b.status !== 0);
        }
      }
    } catch (e) {}
    return [
      { id: 1, name: "FoxStyle Premium", logo: "/image_san_pham/photo-1541099649105-f69ad21f3246.jpg", country: "Việt Nam", description: "Thời trang độc quyền phong cách hiện đại." },
      { id: 2, name: "Zara", logo: "/image_quan_tri/photo-1512436991641-6745cdb1723f.jpg", country: "Tây Ban Nha", description: "Thời trang châu Âu phong cách trẻ trung." },
      { id: 3, name: "Uniqlo", logo: "/image_san_pham/photo-1521572163474-6864f9cf17ab.jpg", country: "Nhật Bản", description: "Trang phục LifeWear tối giản cao cấp." },
      { id: 4, name: "Nike Wear", logo: "/image_quan_tri/photo-1542291026-7eec264c27ff.jpg", country: "Mỹ", description: "Streetwear & Thể thao hàng đầu thế giới." }
    ];
  });

  const [homeTopics, setHomeTopics] = useState(() => {
    try {
      const saved = localStorage.getItem("foxstyle_admin_topics");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((t) => t.status !== 0);
        }
      }
    } catch (e) {}
    return [
      { id: 1, name: "Xu hướng thời trang", slug: "xu-huong-thoi-trang", description: "Cập nhật mẫu mốt hot nhất mùa vụ.", articleCount: 12 },
      { id: 2, name: "Mẹo phối đồ & Mix Match", slug: "meo-phoi-do", description: "Bí quyết kết hợp outfit cực chuẩn.", articleCount: 8 },
      { id: 3, name: "Bảo quản & Chăm sóc quần áo", slug: "bao-quan-quan-ao", description: "Mẹo giữ đồ luôn như mới mua.", articleCount: 5 },
      { id: 4, name: "Bộ sưu tập mới (Lookbook)", slug: "bo-suu-tap-moi", description: "Xem trọn bộ hình ảnh Lookbook.", articleCount: 15 }
    ];
  });

  const [likedArticleIds, setLikedArticleIds] = useState(() => {
    try {
      const saved = localStorage.getItem("foxstyle_liked_articles");
      return saved ? JSON.parse(saved) : [1];
    } catch (e) {
      return [1];
    }
  });

  const toggleLikeArticle = (e, articleId) => {
    if (e) e.stopPropagation();
    setLikedArticleIds((prev) => {
      const isLiked = prev.includes(articleId);
      const updated = isLiked ? prev.filter((id) => id !== articleId) : [...prev, articleId];
      try {
        localStorage.setItem("foxstyle_liked_articles", JSON.stringify(updated));
      } catch (err) {}
      return updated;
    });
  };

  const [homeArticles, setHomeArticles] = useState(() => {
    try {
      const saved = localStorage.getItem("foxstyle_admin_articles");
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(isPublishedArticle);
        }
      }
    } catch (e) {}

    return [

      {
        id: 1,
        title: "Top 5 Xu Hướng Thời Trang Mùa Hè 2026 Bạn Không Thể Bỏ Lỡ",
        image: "/image_san_pham/photo-1490481651871-ab68de25d43d.jpg",
        topicName: "Xu hướng thời trang",
        author: "FoxStyle Stylist Team",
        summary: "Khám phá các phong cách thời trang năng động, mát mẻ, tông màu pastel dịu nhẹ và nghệ thuật mix-match cho mùa hè năm nay.",
        content: `Mùa hè 2026 đánh dấu bước chuyển mình mạnh mẽ trong ngành thời trang tối giản và ứng dụng cao. Khi thời tiết oi nồng lên đến đỉnh điểm, việc lựa chọn trang phục không chỉ dừng lại ở yếu tố thẩm mỹ mà còn phải đáp ứng trọn vẹn tiêu chí thoáng mát, mỏng nhẹ và bảo vệ làn da khỏi tia cực tím.

Dưới đây là 5 Xu Hướng Thời Trang Mùa Hè 2026 đột phá được các Stylist hàng đầu khuyên dùng:

🌿 1. Tông Màu Pastel Dịu Nhẹ (Soft Pastel Palette & Natural Tones)
Các gam màu pastel trung tính như Mint Green (Xanh bạc hà), Rose Quartz (Hồng thạch anh) và Butter Yellow (Vàng bơ) đang chiếm trọn tâm điểm trên các đường phố thời trang từ Paris đến Seoul.
• Ưu điểm: Mang lại thị giác mát mẻ, xua tan cảm giác nóng bức ngột ngạt.
• Cách phối: Kết hợp áo thun Linen pastel cùng quần Shorts Kaki màu be hoặc trắng kem để tạo nên outfit thanh lịch mà cực kỳ cuốn hút.

🔥 2. Phong Cách Oversize & Streetwear Thoải Mái (Relaxed Fit)
Những phom áo bó sát gò bó dần được thay thế hoàn toàn bằng phom Oversize phóng khoáng.
• Chất liệu: Ưu tiên Cotton 100% chải kỹ 250gsm dệt mật độ cao giúp thấm hút mồ hôi 360 độ.
• Outfit đề xuất: Áo thun phông rộng FoxStyle phối cùng quần Short Kaki lưng thun và một đôi Sneaker Minimalist trắng dạo phố.

👗 3. Đầm Xòe Floral Vintage Mùa Hè (Retro Floral Dresses)
Họa tiết hoa nhí trên chất liệu voan tơ Hàn Quốc chưa bao giờ hạ nhiệt mỗi khi hè về.
• Điểm nhấn: Thiết kế cổ V quyến rũ kết hợp đường chiết eo nhẹ nhàng tôn trọn vóc dáng ngọc ngà của phái đẹp.
• Dịp sử dụng: Phù hợp tuyệt đối cho các chuyến du lịch biển, dã ngoại hoặc những buổi hẹn hò lãng mạn cuối tuần.

🧥 4. Blazer Dạ Tweed & Linen Mỏng Nhẹ Khoác Ngoài (Smart Summer Layering)
Đừng nghĩ mùa hè là nói không với áo khoác! Những chiếc Blazer chất liệu Linen hoặc Tweed dệt mỏng dẻo dai là trợ thủ đắc lực cho dân công sở.
• Cách mix-match: Khoác ngoài một chiếc áo thun trắng đơn sắc hoặc đầm hai dây để chuyển đổi linh hoạt từ môi trường văn phòng sang các buổi tiệc tối nhẹ nhàng.

👟 5. Phụ Kiện Minimalist & Túi Crossbody Đa Năng
Không cần quá cầu kỳ, phụ kiện mùa hè năm nay hướng tới sự gọn nhẹ và hiện đại.
• Đề xuất: Một chiếc túi đeo chéo da PU chống nước cùng kính râm mắt mèo hoặc mũ bucket sẽ nâng tầm hoàn hảo cho toàn bộ tổng thể outfit của bạn.

💡 Lời khuyên từ Stylist FoxStyle:
Hãy luôn ưu tiên các chất liệu vải tự nhiên, hạn chế sợi tổng hợp nilon vào mùa hè để làn da luôn được hít thở và cảm thấy thoải mái nhất suốt cả ngày dài!`,
        views: 1450,
        likesCount: 342,
        publishDate: "2026-06-15"
      },
      {
        id: 2,
        title: "Bí Quyết Phối Áo Sơ Mi Nam Chuẩn Lịch Lãm & Năng Động",
        image: "/image_san_pham/photo-1602810318383-e386cc2a3ccf.jpg",
        topicName: "Mẹo phối đồ & Mix Match",
        author: "Nguyễn Văn Hùng (Style Director)",
        summary: "Hướng dẫn chi tiết chọn phom dáng sơ mi tay dài, ngắn tay và nghệ thuật phối màu tương phản tôn vinh thần thái nam giới.",
        content: `Áo sơ mi luôn được ví như 'vũ khí sát thương' tạo nên thần thái sang trọng, lịch lãm và chuẩn mực nhất của người đàn ông hiện đại. Tuy nhiên, không phải ai cũng biết cách biến tấu chiếc áo sơ mi quen thuộc trở nên năng động và trẻ trung mà không bị gò bó hay 'già trước tuổi'.

Hãy cùng chuyên gia FoxStyle khám phá trọn bộ công thức phối áo sơ mi đỉnh cao bên dưới:

📌 1. Phối Áo Sơ Mi Trắng Với Quần Tây Suông Hàn Quốc (Classic Luxury)
Combo huyền thoại này không bao giờ lỗi thời và là tấm danh thiếp hoàn hảo cho mọi cuộc gặp gỡ đối tác.
• Nguyên tắc chọn vải: Ưu tiên chất liệu lụa Kate chống nhăn hoặc Cotton 100% chải kỹ để áo luôn phẳng phiêu suốt 8 tiếng làm việc.
• Giày đi kèm: Đôi giày Tây da bóng cho sự kiện trang trọng hoặc Sneaker trắng tối giản cho phong cách Smart Casual năng động.

📌 2. Phong Cách Layering Khoác Outside (Streetwear Dynamic)
Khi bạn muốn diện sơ mi đi chơi, dã ngoại hay cà phê cuối tuần cùng bạn bè mà vẫn muốn cá tính:
• Công thức: Mặc áo thun trơn màu trắng/đen bên trong, khoác ngoài một chiếc sơ mi caro hoặc sơ mi lụa mở 2-3 cúc ngực.
• Quần đi kèm: Quần Jeans Indigo ôm dáng hoặc Shorts Kaki ngắn ngang gối cực kỳ thoáng mát.

📌 3. Nghệ Thuật Phối Màu Tương Phản (Color Contrast Rule)
• Áo sáng màu (Trắng, Be, Xanh nhạt) -> Bắt buộc đi cùng Quần tối màu (Đen, Xanh Navy, Xám đậm) để tạo điểm nhấn thị giác rõ rệt.
• Áo tối màu (Đen, Xanh đen) -> Kết hợp cùng Quần Be, Trắng hoặc Xám nhạt để làm nổi bật đường cắt phom dáng chuẩn mực.

📌 4. Quy Tắc Sơ Vina (Tucking Guide) Chuẩn Form:
• Sơ vin toàn bộ (Full Tuck): Dành cho môi trường công sở, tiệc trang trọng. Nhớ đi kèm thắt lưng da cùng màu với đôi giày.
• Sơ vin vế trước (Half Tuck): Dành cho các bạn trẻ thích sự phá cách, ngẫu hứng và phóng khoáng.

💡 Mẹo nhỏ bảo quản: Nên treo áo sơ mi bằng móc gỗ bản to để giữ phom vai và xịt nước dằn nhẹ trước khi mặc 10 phút để vải tự thẳng tự nhiên mà không cần bàn ủi!`,
        views: 920,
        likesCount: 218,
        publishDate: "2026-07-02"
      },
      {
        id: 3,
        title: "Hướng Dẫn Giặt & Bảo Quản Trang Phục Cao Cấp Đúng Cách Tại Nhà",
        image: "/image_san_pham/photo-1521572163474-6864f9cf17ab.jpg",
        topicName: "Bảo quản & Chăm sóc quần áo",
        author: "FoxStyle Care Expert",
        summary: "Mẹo phân loại vải, giặt tay, chỉnh nhiệt độ giặt và quy tắc phơi bóng râm giúp quần áo luôn phẳng mượt giữ phom dáng.",
        content: `Trang phục dù đắt tiền hay thuộc thương hiệu cao cấp đến mấy nhưng nếu giặt ủi và chăm sóc sai cách cũng sẽ nhanh chóng bị sờn vải, phai màu và mất đi dáng phom ban đầu. Việc hiểu rõ đặc tính của từng chất liệu vải sẽ giúp bạn kéo dài tuổi thọ quần áo lên gấp 3 lần.

Dưới đây là cẩm nang hướng dẫn chi tiết từng bước từ chuyên gia FoxStyle Care:

🧼 Bước 1: Phân Loại Quần Áo Theo Màu Sắc & Chất Liệu
• Phân loại màu: Luôn tách riêng tuyệt đối đồ màu trắng khỏi các đồ màu tối (Đen, Đỏ, Indigo Denim). Chỉ một vết màu phai nhỏ cũng có thể làm hỏng hoàn toàn chiếc áo thun trắng yêu thích của bạn.
• Phân loại chất liệu: Không giặt chung các đồ có dây kéo kim loại, móc khóa sắc nhọn với các chất liệu nhạy cảm như Lụa, Voan, Nỉ chần bông hay Dạ Tweed.

🧼 Bước 2: Kỹ Thuật Giặt Nước Lạnh & Lộn Trái Trang Phục
• Nhiệt độ nước: Giặt ở nhiệt độ nước mát (dưới 30°C). Nước nóng sẽ làm co rút sợi vải Cotton và phá hủy độ co giãn của Spandex.
• Lộn trái mặt trong: Trước khi cho vào máy giặt, hãy lộn trái toàn bộ mặt trong của áo quần. Điều này giúp bảo vệ các hình in, thêu logo và tránh ma sát sờn lông bề mặt ngoài.

🧼 Bước 3: Lựa Chọn Nước Giặt Trung Tính & Túi Giặt Chuyên Dụng
• Nước giặt: Dùng xà phòng giặt dạng gel lỏng thay vì xà phòng bột cứng dễ đọng cặn trắng trên áo quần màu đen.
• Túi giặt: Luôn bỏ đầm xòe, áo sơ mi lụa và áo nỉ vào túi giặt lưới bảo vệ trước khi bật chế độ vắt xoay.

☀️ Bước 4: Quy Tắc Phơi & Sấy Trong Bóng Râm
• Tránh nắng gắt: Ánh nắng mặt trời trực tiếp buổi trưa chứa tia UV cực mạnh sẽ làm giòn xơ vải và bay màu vải chỉ sau vài lần phơi.
• Phơi bóng râm: Nên phơi ở nơi thoáng gió, bóng râm mát mẻ. Đối với áo len dạ hay áo thun nặng, hãy phơi ngang trên giàn thay vì treo móc để tránh bị chảy xệ kéo dài thân áo.

✨ Tuân thủ 4 bước đơn giản trên sẽ giúp tủ đồ của bạn luôn mới tinh, bền màu và phẳng phiu như vừa mới mua tại cửa hàng!`,
        views: 530,
        likesCount: 189,
        publishDate: "2026-07-10"
      }
    ];

  });

  useEffect(() => {
    api.articles.getPublished()
      .then((response) => {
        if (Array.isArray(response?.data)) {
          setHomeArticles(response.data);
        }
      })
      .catch((error) => {
        console.error("Không thể tải bài viết từ SQL Server:", error);
      });
  }, []);


  const [selectedTopicFilter, setSelectedTopicFilter] = useState("all");
  const [showAllHomeArticles, setShowAllHomeArticles] = useState(false);

  useEffect(() => {
    const syncManagedHomepageContent = (event) => {
      if (
        event?.type === "storage" &&
        event.key &&
        !["foxstyle_admin_articles", "foxstyle_admin_topics", "foxstyle_admin_brands"].includes(event.key)
      ) {
        return;
      }

      try {
        const savedArticles = localStorage.getItem("foxstyle_admin_articles");
        if (savedArticles !== null) {
          const parsedArticles = JSON.parse(savedArticles);
          if (Array.isArray(parsedArticles)) {
            setHomeArticles(parsedArticles.filter(isPublishedArticle));
          }
        }

        const savedTopics = localStorage.getItem("foxstyle_admin_topics");
        if (savedTopics !== null) {
          const parsedTopics = JSON.parse(savedTopics);
          if (Array.isArray(parsedTopics)) {
            setHomeTopics(parsedTopics.filter((topic) => Number(topic.status ?? 1) !== 0));
          }
        }

        const savedBrands = localStorage.getItem("foxstyle_admin_brands");
        if (savedBrands !== null) {
          const parsedBrands = JSON.parse(savedBrands);
          if (Array.isArray(parsedBrands)) {
            setHomeBrands(parsedBrands.filter((brand) => Number(brand.status ?? 1) !== 0));
          }
        }
      } catch (e) {}
    };

    window.addEventListener("storage", syncManagedHomepageContent);
    window.addEventListener("foxstyle-content-updated", syncManagedHomepageContent);
    return () => {
      window.removeEventListener("storage", syncManagedHomepageContent);
      window.removeEventListener("foxstyle-content-updated", syncManagedHomepageContent);
    };
  }, []);

  const visibleHomeArticles = homeArticles.filter((article) =>
    homeTopics.some(
      (topic) => normalizeManagedText(topic.name) === normalizeManagedText(article.topicName)
    )
  );

  const uniqueHomeTopics = homeTopics.filter(
    (topic, index, topics) =>
      topics.findIndex(
        (candidate) =>
          normalizeManagedText(candidate.name) === normalizeManagedText(topic.name)
      ) === index
  );

  const homeTopicsWithCounts = uniqueHomeTopics.map((topic) => ({
    ...topic,
    articleCount: visibleHomeArticles.filter(
      (article) => normalizeManagedText(article.topicName) === normalizeManagedText(topic.name)
    ).length
  }));
  const totalManagedArticleCount = homeTopicsWithCounts.reduce(
    (total, topic) => total + topic.articleCount,
    0
  );

  const displayedHomeArticles = visibleHomeArticles
    .filter((article) => {
      if (selectedTopicFilter === "all" || !selectedTopicFilter) return true;
      return normalizeManagedText(article.topicName) === normalizeManagedText(selectedTopicFilter);
    })
    .sort((firstArticle, secondArticle) => {
      if (Boolean(firstArticle.pinned) !== Boolean(secondArticle.pinned)) {
        return firstArticle.pinned ? -1 : 1;
      }
      const firstDate =
        new Date(firstArticle.publishDate || firstArticle.createdAt || 0).getTime() ||
        Number(firstArticle.id) ||
        0;
      const secondDate =
        new Date(secondArticle.publishDate || secondArticle.createdAt || 0).getTime() ||
        Number(secondArticle.id) ||
        0;
      return secondDate - firstDate;
    });

  const latestArticlesByTopic =
    selectedTopicFilter === "all" || !selectedTopicFilter
      ? homeTopicsWithCounts
          .map((topic) =>
            displayedHomeArticles.find(
              (article) =>
                normalizeManagedText(article.topicName) === normalizeManagedText(topic.name)
            )
          )
          .filter(Boolean)
      : displayedHomeArticles.slice(0, 1);

  const visibleDisplayedHomeArticles = showAllHomeArticles
    ? displayedHomeArticles
    : latestArticlesByTopic;

  useEffect(() => {
    setShowAllHomeArticles(false);
  }, [selectedTopicFilter]);

  useEffect(() => {
    if (
      selectedTopicFilter !== "all" &&
      !homeTopics.some(
        (topic) => normalizeManagedText(topic.name) === normalizeManagedText(selectedTopicFilter)
      )
    ) {
      setSelectedTopicFilter("all");
    }
  }, [homeTopics, selectedTopicFilter]);

  const [selectedHomeArticle, setSelectedHomeArticle] = useState(null);

  // Sync newsletter subscription status with backend for logged in user or per-email storage
  useEffect(() => {
    setHasSubscribedNewsletter(localStorage.getItem(newsletterStorageKey) === "true");
    const userEmail = currentUser?.email;
    if (userEmail) {
      const cleanEmail = userEmail.trim().toLowerCase();
      if (!guestEmail) setGuestEmail(cleanEmail);
      if (!newsletterEmail) setNewsletterEmail(cleanEmail);

      try {
        const localUserSub = localStorage.getItem(`foxstyle_has_subscribed_${cleanEmail}`);
        if (localUserSub === "true") {
          setHasSubscribedNewsletter(true);
          localStorage.setItem(newsletterStorageKey, "true");
          return;
        }

        if (typeof api?.coupons?.checkNewsletter === "function") {
          api.coupons.checkNewsletter(cleanEmail)
            .then((res) => {
              if (res?.data === true || res === true) {
                setHasSubscribedNewsletter(true);
                localStorage.setItem(newsletterStorageKey, "true");
                localStorage.setItem(`foxstyle_has_subscribed_${cleanEmail}`, "true");
              }
            })
            .catch(() => {
              // Silently ignore any backend API/network error
            });
        }
      } catch (e) {
        // Silently ignore synchronous errors
      }
    }
  }, [currentUser, newsletterStorageKey]);

  // Countdown timer state for Flash Sale (Real-time calculation)
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!flashSaleConfig || flashSaleConfig.active === false || flashSaleConfig.enabled === false) {
      setIsExpired(true);
      setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      return;
    }

    let targetEndTimeMs = null;

    if (flashSaleConfig.endTime) {
      const parsed = typeof flashSaleConfig.endTime === "number"
        ? flashSaleConfig.endTime
        : new Date(flashSaleConfig.endTime).getTime();
      if (!isNaN(parsed)) {
        targetEndTimeMs = parsed;
      }
    }

    if (!targetEndTimeMs) {
      const savedTarget = localStorage.getItem("foxstyle_flashsale_target_time");
      if (savedTarget) {
        const parsedSaved = Number(savedTarget);
        if (!isNaN(parsedSaved)) {
          targetEndTimeMs = parsedSaved;
        }
      }

      if (!targetEndTimeMs) {
        const h = Number(flashSaleConfig.hours ?? 23);
        const m = Number(flashSaleConfig.minutes ?? 44);
        const s = Number(flashSaleConfig.seconds ?? 0);
        targetEndTimeMs = Date.now() + (h * 3600 + m * 60 + s) * 1000;
        try {
          localStorage.setItem("foxstyle_flashsale_target_time", String(targetEndTimeMs));
        } catch (e) {}
      }
    }

    const updateCountdown = () => {
      const diff = targetEndTimeMs - Date.now();

      if (isNaN(diff) || diff <= 0) {
        setIsExpired(true);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        setIsExpired(false);
        const totalSecs = Math.floor(diff / 1000);
        const h = Math.floor(totalSecs / 3600);
        const m = Math.floor((totalSecs % 3600) / 60);
        const s = totalSecs % 60;
        setTimeLeft({ hours: h, minutes: m, seconds: s });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [flashSaleConfig]);

  // Show first order modal after 3 seconds if not closed yet and not subscribed yet
  useEffect(() => {
    const hasSeen = localStorage.getItem("foxstyle_first_order_popup_seen");
    const hasSubscribed = localStorage.getItem(newsletterStorageKey) === "true";
    if (!hasSeen && !hasSubscribed) {
      const modalTimer = setTimeout(() => {
        setShowFirstOrderModal(true);
      }, 3000);
      return () => clearTimeout(modalTimer);
    }
  }, [newsletterStorageKey]);

  const handleCloseModal = () => {
    setShowFirstOrderModal(false);
    localStorage.setItem("foxstyle_first_order_popup_seen", "true");
  };

  const handleSubscribeGuest = async (e) => {
    e.preventDefault();
    const targetEmail = guestEmail.trim().toLowerCase();
    if (!targetEmail) return;
    setIsSubscribing(true);
    try {
      await api.coupons.subscribeNewsletter(targetEmail, "FOXSTYLE50");
      toast.success(`📧 Mã giảm giá đã gửi tới hộp thư ${targetEmail}! (Kiểm tra hộp thư đến và thư rác)`);
      alert(`Đã gửi mã giảm giá tới địa chỉ email ${targetEmail}. Vui lòng kiểm tra hộp thư đến và thư rác!`);
      localStorage.setItem(newsletterStorageKey, "true");
      localStorage.setItem(`foxstyle_has_subscribed_${targetEmail}`, "true");
      setHasSubscribedNewsletter(true);
    } catch (err) {
      console.error("Newsletter email error:", err);
      const errMsg = err?.response?.data?.message || err?.message || "Không thể gửi email lúc này. Vui lòng thử lại!";
      toast.error(errMsg);
      alert(errMsg);
      if (errMsg.includes("đã nhận mã") || errMsg.includes("đã đăng ký") || errMsg.includes("1 lần")) {
        localStorage.setItem(newsletterStorageKey, "true");
        localStorage.setItem(`foxstyle_has_subscribed_${targetEmail}`, "true");
        setHasSubscribedNewsletter(true);
      }
    } finally {
      setIsSubscribing(false);
      handleCloseModal();
    }
  };

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    const targetEmail = newsletterEmail.trim().toLowerCase();
    if (!targetEmail) {
      alert("Vui lòng nhập địa chỉ email của bạn!");
      return;
    }
    setIsSubscribing(true);
    try {
      await api.coupons.subscribeNewsletter(targetEmail, "FOXSTYLE50");
      toast.success(`📧 Mã giảm giá đã được gửi tới hộp thư ${targetEmail}! (Vui lòng kiểm tra hộp thư đến và thư rác)`);
      alert(`Đã gửi mã giảm giá tới địa chỉ email ${targetEmail}. Vui lòng kiểm tra hộp thư đến và thư rác!`);
      setNewsletterEmail("");
      localStorage.setItem(newsletterStorageKey, "true");
      localStorage.setItem(`foxstyle_has_subscribed_${targetEmail}`, "true");
      setHasSubscribedNewsletter(true);
    } catch (err) {
      console.error("Newsletter email error:", err);
      const errMsg = err?.response?.data?.message || err?.message || "Không thể gửi email lúc này. Vui lòng thử lại!";
      toast.error(errMsg);
      alert(errMsg);
      if (errMsg.includes("đã nhận mã") || errMsg.includes("đã đăng ký") || errMsg.includes("1 lần")) {
        localStorage.setItem(newsletterStorageKey, "true");
        localStorage.setItem(`foxstyle_has_subscribed_${targetEmail}`, "true");
        setHasSubscribedNewsletter(true);
      }
    } finally {
      setIsSubscribing(false);
    }
  };

  const defaultBanners = [
    {
      id: "default_video_banner",
      title: "Bộ Sưu Tập Thời Trang FoxStyle 2026",
      subtitle: "BỘ SƯU TẬP MỚI NHẤT · THỜI THƯỢNG & ĐẲNG CẤP",
      content: "Khám phá các thiết kế thời trang nam nữ mới nhất với phom dáng chuẩn mực và chất liệu cao cấp.",
      videoUrl: "/video/fashion-showcase.mp4",
      linkUrl: "/products"
    },
    {
      id: "default_image_banner_1",
      title: "Thời Trang Nam Nữ Mùa Hè 2026",
      subtitle: "PHONG CÁCH HIỆN ĐẠI & TRẺ TRUNG",
      content: "Chất liệu cotton tự nhiên thoáng mát, phom dáng thoải mái tôn vóc dáng người mặc.",
      imageUrl: "/image_banner/photo-1483985988355-763728e1935b.jpg",
      linkUrl: "/products"
    },
    {
      id: "default_image_banner_2",
      title: "Khuyến Mãi Đặc Biệt - Giảm Đến 50%",
      subtitle: "ƯU ĐÃI THỜI TRANG HÈ ĐẶC BIỆT",
      content: "Sở hữu ngay các sản phẩm thời trang chất lượng hàng đầu với mức giá ưu đãi cực hấp dẫn.",
      imageUrl: "/image_san_pham/photo-1490481651871-ab68de25d43d.jpg",
      linkUrl: "/products?sale=true"
    }
  ];

  const marqueeBanners = (banners || []).filter(
    (b) => b.bannerType === "MARQUEE" && b.status !== 0 && b.title
  );
  const validBanners = (banners || []).filter(
    (b) => b.bannerType !== "MARQUEE" && (b.imageUrl || b.image || b.videoUrl) && b.status !== 0
  );
  const activeBanners = validBanners.length > 0 ? validBanners : defaultBanners;

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentBannerIdx((prev) => (prev + 1) % activeBanners.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  useEffect(() => {
    setCurrentBannerIdx((current) => Math.min(current, activeBanners.length - 1));
  }, [activeBanners.length]);

  // Filter active and in-stock products for customer homepage
  const activeProducts = (products || []).filter((prod) => {
    const isStoppedSelling = prod.status === 0 || prod.status === "0" || prod.status === false || prod.status === "Ngừng bán" || prod.status === "INACTIVE" || prod.status === "STOPPED" || prod.status === "DISCONTINUED";
    const isOutOfStock = Number(prod.quantity ?? 0) <= 0;
    return !isStoppedSelling && !isOutOfStock;
  });

  const featuredProducts = activeProducts.slice(0, 8);
  
  // Flash Sale products selection logic
  const processedFlashSaleProducts = activeProducts
    .filter((product) => isFlashSaleProduct(product, flashSaleConfig))
    .filter(hasValidProductDiscount);

  const saleProducts = activeProducts.filter(hasValidProductDiscount).slice(0, 4);
  const showFlashSale = isFlashSaleActive(flashSaleConfig) && processedFlashSaleProducts.length > 0;

  const rawComboProducts = activeProducts.filter((p) => {
    return p.isCombo || p.category === "combo" || (p.name && p.name.includes("[SET COMBO]")) || (p.description && p.description.includes("[COMBO:"));
  });

  const processedComboProducts = rawComboProducts.slice(0, 8);


  const categoryCards = [
    {
      title: "Áo Nam & Oversize",
      description: "Áo thun basic, sơ mi lụa, polo & hoodie",
      href: "/products?category=ao",
      image: "/image_san_pham/photo-1521572163474-6864f9cf17ab.jpg",
      badge: "BÁN CHẠY"
    },
    {
      title: "Quần Nam & Denim",
      description: "Jeans skinny, quần tây baggy, cargo",
      href: "/products?category=quan",
      image: "/image_san_pham/photo-1541099649105-f69ad21f3246.jpg",
      badge: "DENIM CAO CẤP"
    },
    {
      title: "Đầm Váy Thời Trang",
      description: "Midi hoa nhí, đầm body, lụa satin",
      href: "/products?category=vay",
      image: "/image_san_pham/photo-1572804013309-59a88b7e92f1.jpg",
      badge: "THANH LỊCH"
    },
    {
      title: "Áo Khoác & Blazer",
      description: "Bomber gió, blazer oversize, denim vintage",
      href: "/products?category=ao-khoac",
      image: "/image_san_pham/photo-1551028719-00167b16eac5.jpg",
      badge: "MỚI VỀ"
    },
    {
      title: "Giày & Sneaker",
      description: "Sneaker runner trắng, giày derby da thật",
      href: "/products?category=giay",
      image: "/image_san_pham/photo-1521572163474-6864f9cf17ab.jpg",
      badge: "SNEAKERS"
    },
    {
      title: "Phụ Kiện Thời Trang",
      description: "Mũ lưỡi trai, túi da, kính mát UV400",
      href: "/products?category=phu-kien",
      image: "/image_san_pham/photo-1548036328-c9fa89d128fa.jpg",
      badge: "PHỤ KIỆN"
    },
  ];

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f7f7f5] text-zinc-950 selection:bg-orange-500 selection:text-white">
      
      {/* First Order Discount Pop-up */}
      {!hasSubscribedNewsletter && showFirstOrderModal && (
        <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 relative shadow-2xl border border-zinc-200 text-center">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 transition cursor-pointer"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 mx-auto flex items-center justify-center mb-4 shadow-md">
              <Gift className="h-8 w-8 animate-bounce" />
            </div>

            <span className="text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
              Ưu đãi khách hàng mới
            </span>

            <h3 className="text-2xl font-black tracking-tight text-zinc-950 mt-4">
              Nhận Mã Giảm Giá Cho Đơn Hàng Đầu Tiên!
            </h3>
            
            <p className="text-xs text-zinc-600 mt-2 leading-relaxed font-medium">
              Nhập email của bạn để nhận mã giảm giá ưu đãi và thông tin các bộ sưu tập mới nhất.
            </p>

            <form onSubmit={handleSubscribeGuest} className="mt-6 space-y-3">
              <input
                type="email"
                required
                placeholder="Nhập email của bạn..."
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                className="w-full h-12 bg-zinc-50 border border-zinc-300 rounded-2xl px-4 text-xs font-semibold text-zinc-900 focus:outline-none focus:border-orange-600 transition"
              />
              <button
                type="submit"
                className="w-full h-12 bg-zinc-950 text-white font-black text-xs uppercase tracking-wider rounded-2xl hover:bg-orange-600 active:scale-98 transition-all cursor-pointer shadow-lg"
              >
                Nhận mã ngay 🎁
              </button>
            </form>

            <button
              onClick={handleCloseModal}
              className="mt-4 text-[11px] font-bold text-zinc-400 underline hover:text-zinc-600 cursor-pointer"
            >
              Bỏ qua, tôi muốn mua sắm ngay
            </button>
          </div>
        </div>
      )}

      {false && (
        <div className="home-marquee bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 text-white border-y border-white/20">
          <div className="home-marquee-track">
            {Array.from({ length: 6 }, () => marqueeBanners).flat().map((banner, idx) => (
              <button
                key={`${banner.bannerId || banner.id || "marquee"}-${idx}`}
                type="button"
                onClick={() => banner.linkUrl && navigate(banner.linkUrl)}
                className={`home-marquee-item ${banner.linkUrl ? "cursor-pointer hover:text-yellow-200" : "cursor-default"}`}
              >
                <span className="text-yellow-300">✦</span>
                <span>{banner.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hero Banner Carousel */}
      <section className="relative min-h-[72vh] lg:min-h-[78vh] overflow-hidden bg-zinc-950 text-white">
        {activeBanners.map((banner, idx) => {
          const isActive = idx === currentBannerIdx;
          const imgUrl = banner.imageUrl || banner.image;
          const isVideo = banner.videoUrl || (imgUrl && (imgUrl.endsWith(".mp4") || imgUrl.endsWith(".webm") || imgUrl.includes("video")));
          return (
            <div
              key={banner.id || idx}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {isVideo ? (
                <video
                  src={banner.videoUrl || imgUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 h-full w-full object-cover opacity-60 scale-105"
                />
              ) : (
                <img
                  src={imgUrl || "/image_banner/photo-1483985988355-763728e1935b.jpg"}
                  alt={banner.title || "FoxStyle Banner"}
                  onError={(e) => {
                    e.target.src = "/image_banner/photo-1483985988355-763728e1935b.jpg";
                  }}
                  className="absolute inset-0 h-full w-full object-cover opacity-75"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

              <div className="relative z-20 mx-auto flex min-h-[72vh] w-full max-w-[1600px] items-center px-5 py-20 sm:px-8 lg:min-h-[78vh] lg:px-12 xl:px-16">
                <div className="max-w-3xl space-y-5 rounded-[2rem] border border-white/15 bg-black/20 p-6 shadow-2xl backdrop-blur-[2px] sm:p-8 lg:p-10">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider backdrop-blur-md text-white">
                    <Sparkles className="h-4 w-4 text-amber-300" />
                    <span>{banner.subtitle || "BỘ SƯU TẬP THỜI TRANG FOXSTYLE 2026"}</span>
                  </div>
                  <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-[0.98] tracking-[-0.04em] text-white drop-shadow-lg">
                    {banner.title}
                  </h1>
                  <p className="max-w-xl text-lg leading-relaxed text-zinc-200 font-medium">
                    {banner.content}
                  </p>
                  <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        navigate(banner.linkUrl || "/products");
                      }}
                      className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-white px-8 py-4 text-xs font-black uppercase tracking-wider text-zinc-950 shadow-xl hover:bg-orange-500 hover:text-white transition-all duration-300 cursor-pointer"
                    >
                      <span>Khám phá ngay</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.scrollTo({ top: 0, behavior: "smooth" });
                        navigate("/products?sale=true");
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/40 bg-white/20 px-7 py-4 text-xs font-black uppercase tracking-wider text-white backdrop-blur-md hover:bg-white hover:text-zinc-950 transition-all duration-300 cursor-pointer"
                    >
                      <Flame className="h-4 w-4 text-orange-500" />
                      <span>Xem khuyến mãi</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Carousel Dots Indicators */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center space-x-3 z-20">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentBannerIdx(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentBannerIdx ? "bg-white w-8" : "bg-white/40 w-2 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Services & Guarantees Bar */}
      <section className="relative z-30 -mt-6 bg-transparent">
        <div className="home-services-grid mx-auto grid w-full max-w-[1600px] gap-3 px-3 pb-8 min-[480px]:px-4 sm:grid-cols-2 sm:gap-4 sm:px-6 md:pb-10 lg:grid-cols-3 lg:px-10">
          {[
            { icon: Truck, title: "GIAO HÀNG NHANH TOÀN QUỐC", text: "Miễn phí vận chuyển cho các đơn hàng từ 499.000đ." },
            { icon: Scissors, title: "PHOM DÁNG CHUẨN MỰC", text: "Thiết kế hiện đại, dễ kết hợp cho đi làm và đi chơi." },
            { icon: ShieldCheck, title: "CHẤT LIỆU CAO CẤP", text: "Cam kết chất vải bền đẹp, giữ màu sau nhiều lần giặt." },
          ].map((item) => (
            <div key={item.title} className="group flex w-full min-w-0 items-start gap-3 overflow-hidden rounded-3xl border border-white/80 bg-white/95 p-4 shadow-xl shadow-zinc-900/8 backdrop-blur transition-all duration-300 hover:-translate-y-1.5 hover:border-orange-300 hover:shadow-orange-900/10 sm:gap-4 sm:p-5">
              <div className="shrink-0 rounded-2xl border border-orange-100 bg-orange-50 p-2.5 text-orange-600 transition group-hover:rotate-3 group-hover:scale-110 group-hover:bg-orange-600 group-hover:text-white sm:p-3">
                <item.icon className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="break-words text-sm font-black uppercase tracking-wide text-zinc-900 sm:tracking-wider">{item.title}</h3>
                <p className="mt-1 break-words text-xs font-medium leading-relaxed text-zinc-500">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick category navigation */}
      <section className="mx-auto w-full max-w-[1600px] px-4 pb-12 sm:px-6 lg:px-10">
        <div className="mb-4 flex min-w-0 flex-wrap items-end justify-between gap-2">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.22em] text-orange-600">Mua sắm nhanh</span>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-950">Bạn đang tìm gì?</h2>
          </div>
          <Link to="/products" className="text-xs font-black text-zinc-500 hover:text-orange-600 transition">Xem tất cả →</Link>
        </div>
        <div className="home-quick-grid grid min-w-0 grid-cols-2 gap-3 min-[480px]:grid-cols-3 lg:grid-cols-6">
          {categoryCards.map((category) => (
            <Link
              key={`quick-${category.title}`}
              to={category.href}
              className="group flex min-w-0 flex-col items-center gap-2 overflow-hidden rounded-2xl bg-white border border-zinc-200 p-2.5 sm:p-3 hover:border-orange-400 hover:shadow-md transition"
            >
              <div className="aspect-square w-full overflow-hidden rounded-xl bg-zinc-100">
                <img src={category.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
              </div>
              <span className="w-full truncate text-center text-[10px] sm:text-xs font-black text-zinc-700 group-hover:text-orange-600">
                {category.title}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* FLASH SALE COUNTDOWN SECTION */}
      {showFlashSale && <section className="relative px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-[1600px] overflow-hidden rounded-[2rem] bg-gradient-to-r from-red-600 via-orange-600 to-amber-500 p-5 text-white shadow-2xl shadow-orange-900/20 sm:p-8 lg:p-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-white/20 pb-6">
            <div className="flex items-center gap-4">
              <div className="p-3.5 bg-white/20 rounded-2xl backdrop-blur-md">
                <Flame className="h-8 w-8 text-yellow-300 animate-bounce" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-yellow-200 block">{flashSaleConfig?.subtitle || "ƯU ĐÃI CHỚP NHOÁNG"}</span>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight">{flashSaleConfig?.title || "FLASH SALE GIẢM ĐẾN 50%"}</h2>
              </div>
            </div>

            {/* Countdown timer */}
            {isExpired ? (
              <div className="flex items-center gap-2 bg-black/40 px-5 py-3 rounded-2xl backdrop-blur border border-white/10 self-start md:self-auto">
                <Clock className="h-5 w-5 text-red-300" />
                <span className="text-xs font-black uppercase tracking-wider text-red-200">
                  Đã hết thời gian Flash Sale
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-black/40 px-6 py-3.5 rounded-2xl backdrop-blur border border-white/20 self-start md:self-auto shadow-lg">
                <Clock className="h-5 w-5 text-yellow-300" />
                <span className="text-xs font-bold uppercase tracking-wider text-white/90 mr-1">Kết thúc sau:</span>
                <div className="flex items-center gap-1.5 text-base font-black">
                  <span className="bg-white text-zinc-950 px-3 py-1 rounded-xl shadow-sm">
                    {String(timeLeft.hours).padStart(2, "0")}
                  </span>
                  <span>:</span>
                  <span className="bg-white text-zinc-950 px-3 py-1 rounded-xl shadow-sm">
                    {String(timeLeft.minutes).padStart(2, "0")}
                  </span>
                  <span>:</span>
                  <span className="bg-yellow-400 text-zinc-950 px-3 py-1 rounded-xl shadow-sm animate-pulse">
                    {String(timeLeft.seconds).padStart(2, "0")}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div
            className="flash-sale-scroll flex gap-6 overflow-x-scroll pb-5 snap-x snap-mandatory"
            aria-label="Danh sách sản phẩm Flash Sale"
          >
            {processedFlashSaleProducts.map((product) => (
              <div
                key={product.id}
                className="w-[82vw] min-w-[280px] max-w-[350px] shrink-0 snap-start sm:w-[320px]"
              >
                <ProductCard product={product} wishlist={wishlist} toggleWishlist={toggleWishlist} />
              </div>
            ))}
          </div>
        </div>
      </section>}

      {/* 🎁 DEDICATED SET COMBO SECTION ON HOMEPAGE */}
      {processedComboProducts.length > 0 && (
      <section className="bg-white py-14 px-4 sm:px-6 lg:px-8 border-y border-zinc-200">
        <div className="mx-auto w-full max-w-[1600px]">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end border-b border-orange-200/80 pb-6">
            <div>
              <div className="home-combo-badge inline-flex max-w-full items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-500 text-white px-3.5 py-1.5 rounded-2xl text-xs font-black uppercase tracking-wider mb-2 shadow-md">
                <Gift className="h-4 w-4 text-amber-200 animate-bounce" />
                <span>BỘ SƯU TẬP SET COMBO TIẾT KIỆM</span>
              </div>
              <h2 className="home-combo-title text-3xl font-black tracking-tight text-zinc-900 md:text-4xl">
                Set Combo Phối Sẵn Mua Gộp Giá Tốt
              </h2>
              <p className="text-xs text-zinc-500 font-bold mt-1">
                Mua trọn bộ sản phẩm gộp làm 1 đơn giá ưu đãi chiết khấu tiết kiệm tối đa lên tới 35%
              </p>
            </div>
            <Link to="/products?category=combo" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-orange-600 hover:text-zinc-900 transition">
              <span>Xem tất cả Set Combo</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:gap-6 lg:grid-cols-4 2xl:grid-cols-5 min-[2200px]:grid-cols-6">
            {processedComboProducts.map((product) => (
              <ProductCard key={product.id} product={product} wishlist={wishlist} toggleWishlist={toggleWishlist} />
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Featured Categories Grid */}
      <section className="mx-auto w-full max-w-[1600px] px-4 py-16 sm:px-6 lg:px-10">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end border-b border-zinc-200 pb-6">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-orange-600 block">DANH MỤC SẢN PHẨM</span>
            <h2 className="mt-1 text-3xl font-black tracking-tight text-zinc-900 md:text-4xl">Danh Mục Nổi Bật</h2>
          </div>
          <Link to="/products" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-orange-600 hover:text-zinc-900 transition">
            <span>Xem tất cả danh mục</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid auto-rows-[250px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categoryCards.map((category, index) => (
            <Link key={category.title} to={category.href} className={`group relative overflow-hidden rounded-3xl bg-zinc-950 border border-zinc-200 shadow-md hover:shadow-2xl transition-all duration-500 ${
              index < 2 ? "lg:col-span-2 lg:row-span-2" : ""
            }`}>
              <img src={category.image} alt={category.title} className="h-full w-full object-cover opacity-85 transition-transform duration-700 group-hover:scale-108 group-hover:opacity-95" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-zinc-950 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                {category.badge}
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-1.5">
                <h3 className="text-2xl font-black tracking-tight text-white group-hover:text-amber-300 transition">{category.title}</h3>
                <p className="text-xs text-zinc-300 font-medium">{category.description}</p>
                <div className="pt-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span>Khám phá ngay</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 🏆 FEATURED BRANDS SECTION */}
      <section className="bg-zinc-50 py-16 px-4 sm:px-6 lg:px-8 border-y border-zinc-200">
        <div className="mx-auto w-full max-w-[1600px]">
          <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end border-b border-zinc-200 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
                <Award className="h-4 w-4 text-orange-600" />
                <span>ĐỐI TÁC CHÍNH HÃNG</span>
              </div>
              <h2 className="text-3xl font-black tracking-tight text-zinc-900 md:text-4xl">
                Thương Hiệu Thời Trang Nổi Bật
              </h2>
              <p className="text-xs text-zinc-500 font-bold mt-1">
                Các thương hiệu thời trang cao cấp hàng đầu được phân phối chính thức tại FoxStyle
              </p>
            </div>
            <Link to="/products" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-orange-600 hover:text-zinc-900 transition">
              <span>Xem sản phẩm theo nhãn hàng</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {homeBrands.map((brand) => (
              <div
                key={brand.id}
                onClick={() => navigate(`/products?brand=${encodeURIComponent(brand.name)}`)}
                className="bg-white rounded-3xl border border-zinc-200 p-6 shadow-sm hover:shadow-xl hover:border-orange-500 transition-all duration-300 flex flex-col items-center text-center cursor-pointer group"
              >

                <div className="w-16 h-16 rounded-2xl bg-zinc-100 p-1 flex items-center justify-center mb-4 overflow-hidden border border-zinc-200 group-hover:scale-105 transition">
                  {brand.logo ? (
                    <img src={brand.logo} alt={brand.name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <Award className="w-8 h-8 text-orange-500" />
                  )}
                </div>
                <h4 className="font-extrabold text-zinc-900 text-sm group-hover:text-orange-600 transition">
                  {brand.name}
                </h4>
                <span className="text-[10px] font-bold text-zinc-400 uppercase mt-0.5">
                  Xuất xứ: {brand.country || "Quốc tế"}
                </span>
                <p className="text-xs text-zinc-500 font-medium line-clamp-2 mt-2">
                  {brand.description || "Thương hiệu thời trang chất lượng."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers Showcase */}
      <section className="mx-auto w-full max-w-[1600px] px-4 py-16 sm:px-6 lg:px-10">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end border-b border-zinc-200 pb-6">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-orange-600 block">BEST SELLERS</span>
            <h2 className="mt-1 text-3xl font-black tracking-tight text-zinc-900 md:text-4xl">Sản Phẩm Bán Chạy</h2>
          </div>
          <Link to="/products" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-orange-600 hover:text-zinc-900 transition">
            <span>Xem thêm sản phẩm</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:gap-6 lg:grid-cols-4 2xl:grid-cols-5 min-[2200px]:grid-cols-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} wishlist={wishlist} toggleWishlist={toggleWishlist} />
          ))}
        </div>
      </section>

      {/* 📰 ARTICLES & TOPICS SECTION */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-b border-zinc-200">
        <div className="mx-auto w-full max-w-[1600px] space-y-12">
          {/* Header */}
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end border-b border-zinc-200 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
                <FileText className="h-4 w-4 text-blue-600" />
                <span>GÓC BÀI VIẾT & MẸO THỜI TRANG</span>
              </div>
              <h2 className="text-3xl font-black tracking-tight text-zinc-900 md:text-4xl">
                Chủ Đề & Bài Viết Mới Nhất
              </h2>
              <p className="text-xs text-zinc-500 font-bold mt-1">
                Cập nhật xu hướng thời trang, bí quyết mix đồ và kiến thức bảo quản trang phục
              </p>
            </div>
          </div>

          {/* Topics Chips Filter */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-purple-600 flex items-center gap-1.5">
                <Layers className="w-4 h-4" /> Bấm chọn Chủ đề để lọc bài viết
              </span>
              {selectedTopicFilter !== "all" && (
                <button
                  onClick={() => setSelectedTopicFilter("all")}
                  className="text-xs font-bold text-orange-600 hover:underline cursor-pointer"
                >
                  ✕ Xem tất cả chủ đề
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div
                onClick={() => setSelectedTopicFilter("all")}
                className={`rounded-2xl p-4 transition-all duration-300 flex items-start gap-3 cursor-pointer border ${
                  selectedTopicFilter === "all"
                    ? "bg-purple-600 text-white border-purple-600 shadow-md ring-2 ring-purple-500/20"
                    : "bg-purple-50/60 hover:bg-purple-100 border-purple-200/80 text-zinc-900"
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black shrink-0 shadow-md ${
                  selectedTopicFilter === "all" ? "bg-white text-purple-700" : "bg-purple-600 text-white"
                }`}>
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs leading-snug">Tất Cả Chủ Đề</h4>
                  <span className={`text-[10px] font-mono font-bold block mt-0.5 ${
                    selectedTopicFilter === "all" ? "text-purple-200" : "text-purple-700"
                  }`}>
                    📝 {totalManagedArticleCount} bài viết
                  </span>
                </div>
              </div>

              {homeTopicsWithCounts.map((topic) => {
                const isSelected = selectedTopicFilter.toLowerCase() === topic.name.toLowerCase();
                return (
                  <div
                    key={topic.id}
                    onClick={() => setSelectedTopicFilter(isSelected ? "all" : topic.name)}
                    className={`rounded-2xl p-4 transition-all duration-300 flex items-start gap-3 cursor-pointer border ${
                      isSelected
                        ? "bg-purple-600 text-white border-purple-600 shadow-md ring-2 ring-purple-500/20"
                        : "bg-purple-50/60 hover:bg-purple-100 border-purple-200/80 text-zinc-900"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black shrink-0 shadow-md ${
                      isSelected ? "bg-white text-purple-700" : "bg-purple-600 text-white"
                    }`}>
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs leading-snug">{topic.name}</h4>
                      <span className={`text-[10px] font-mono font-bold block mt-0.5 ${
                        isSelected ? "text-purple-200" : "text-purple-700"
                      }`}>
                        📝 {topic.articleCount || 0} bài viết
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Articles Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            {displayedHomeArticles.length === 0 ? (
              <div className="col-span-3 text-center p-8 bg-zinc-50 rounded-3xl border border-dashed border-zinc-300">
                <p className="text-xs font-bold text-zinc-500">Chưa có bài viết nào thuộc chủ đề &quot;{selectedTopicFilter}&quot;.</p>
                <button
                  onClick={() => setSelectedTopicFilter("all")}
                  className="mt-3 px-4 py-2 bg-purple-600 text-white font-bold text-xs rounded-xl hover:bg-purple-700 transition"
                >
                  Xem tất cả bài viết
                </button>
              </div>
            ) : (
              visibleDisplayedHomeArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => setSelectedHomeArticle(article)}
                  className="bg-white rounded-3xl border border-zinc-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
                >

                <div>
                  <div className="h-48 w-full overflow-hidden relative">
                    <img
                      src={article.image || "/image_san_pham/photo-1490481651871-ab68de25d43d.jpg"}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-[10px] font-black uppercase px-3 py-1 rounded-full">
                      {article.pinned ? "📌 " : ""}{article.topicName || "Tin tức"}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => toggleLikeArticle(e, article.id)}
                      className={`absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition shadow-md backdrop-blur-md cursor-pointer ${
                        likedArticleIds.includes(article.id)
                          ? "bg-red-500 text-white shadow-red-500/30 scale-105"
                          : "bg-black/60 text-white hover:bg-red-500"
                      }`}
                      title={likedArticleIds.includes(article.id) ? "Bỏ thích bài viết" : "Thích bài viết này"}
                    >
                      <Heart className={`w-3.5 h-3.5 ${likedArticleIds.includes(article.id) ? "fill-current text-white" : ""}`} />
                      <span>{(article.likesCount || 150) + (likedArticleIds.includes(article.id) ? 1 : 0)}</span>
                    </button>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-zinc-400 font-semibold">
                      <span>👤 {article.author || "FoxStyle Team"}</span>
                      <span>📅 {article.publishDate || "Hôm nay"}</span>
                    </div>

                    <h3 className="font-black text-base text-zinc-900 leading-snug group-hover:text-blue-600 transition line-clamp-2">
                      {article.title}
                    </h3>

                    <p className="text-xs text-zinc-600 font-medium leading-relaxed line-clamp-3">
                      {article.summary || article.content}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:translate-x-1 transition duration-300">
                  <span>Đọc tiếp bài viết</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>

            ))
          )}
          </div>

          {displayedHomeArticles.length > latestArticlesByTopic.length && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAllHomeArticles((current) => !current)}
                className="inline-flex items-center gap-2 rounded-2xl bg-purple-600 px-6 py-3 text-xs font-black uppercase tracking-wider text-white shadow-md transition hover:bg-purple-700 hover:shadow-lg"
              >
                {showAllHomeArticles
                  ? "Thu gọn bài viết"
                  : `Hiển thị thêm bài viết (${displayedHomeArticles.length - latestArticlesByTopic.length})`}
                <ArrowRight className={`h-4 w-4 transition ${showAllHomeArticles ? "-rotate-90" : "rotate-90"}`} />
              </button>
            </div>
          )}

        </div>
      </section>

      {/* Email Newsletter Banner */}
      {!hasSubscribedNewsletter && (
        <section className="bg-zinc-950 text-white border-y border-zinc-800">
          <div className="mx-auto grid w-full max-w-[1600px] items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
            <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-orange-500 block">ĐĂNG KÝ THÀNH VIÊN</span>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Nhận Mã Giảm Giá Cho Đơn Hàng Mới.
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-zinc-400 font-medium">
                Nhập email để nhận mã giảm giá cho đơn hàng mới và cập nhật các thông tin bộ sưu tập mới nhất.
              </p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Nhập email của bạn..."
                className="h-12 flex-1 bg-zinc-900 border border-zinc-700 rounded-2xl px-4 text-xs font-bold text-white outline-none placeholder:text-zinc-500 focus:border-orange-500 transition"
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="h-12 bg-orange-600 px-8 text-xs font-black uppercase tracking-wider text-white rounded-2xl hover:bg-orange-700 transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2"
              >
                {isSubscribing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Đang gửi...</span>
                  </>
                ) : (
                  <span>Đăng Ký</span>
                )}
              </button>
            </form>
          </div>
        </section>
      )}

      {/* Limited Deals Section */}
      <section className="mx-auto w-full max-w-[1600px] px-4 py-16 sm:px-6 lg:px-10">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end border-b border-zinc-200 pb-6">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-red-600 block">KHUYẾN MÃI ĐẶC BIỆT</span>
            <h2 className="mt-1 text-3xl font-black tracking-tight text-zinc-900 md:text-4xl">Sản Phẩm Đang Giảm Giá</h2>
          </div>
          <Link to="/products?sale=true" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-red-600 hover:text-zinc-900 transition">
            <span>Xem tất cả khuyến mãi</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:gap-6 lg:grid-cols-4 2xl:grid-cols-5 min-[2200px]:grid-cols-6">
          {saleProducts.map((product) => (
            <ProductCard key={product.id} product={product} wishlist={wishlist} toggleWishlist={toggleWishlist} />
          ))}
        </div>
      </section>

      {/* 📖 ARTICLE READER MODAL ON HOMEPAGE */}
      {selectedHomeArticle && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 z-[110] animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden w-full max-w-3xl my-8 max-h-[90vh] flex flex-col">
            <div className="bg-zinc-900 text-white p-5 flex items-center justify-between shrink-0">
              <span className="text-xs font-black uppercase text-orange-400">
                {selectedHomeArticle.topicName || "Thời trang FoxStyle"}
              </span>
              <button
                onClick={() => setSelectedHomeArticle(null)}
                className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-zinc-900">
              {selectedHomeArticle.image && (
                <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg relative">
                  <img src={selectedHomeArticle.image} alt={selectedHomeArticle.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                    <h1 className="text-xl md:text-2xl font-black leading-tight">
                      {selectedHomeArticle.title}
                    </h1>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between border-b border-zinc-200 pb-4 text-xs text-zinc-500 font-semibold">
                <span>👤 Tác giả: <strong>{selectedHomeArticle.author || "FoxStyle Team"}</strong></span>
                <span>📅 Đăng ngày: {selectedHomeArticle.publishDate || "Hôm nay"}</span>
              </div>

              {selectedHomeArticle.summary && (
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-2xl italic text-sm text-zinc-800 font-medium">
                  "{selectedHomeArticle.summary}"
                </div>
              )}

              <div className="text-sm font-normal text-zinc-800 leading-relaxed space-y-4 whitespace-pre-line font-sans">
                {selectedHomeArticle.content}
              </div>
            </div>

            <div className="bg-zinc-100 p-4 border-t border-zinc-200 flex items-center justify-between shrink-0">
              <button
                type="button"
                onClick={(e) => toggleLikeArticle(e, selectedHomeArticle.id)}
                className={`px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition cursor-pointer shadow-md ${
                  likedArticleIds.includes(selectedHomeArticle.id)
                    ? "bg-red-500 text-white hover:bg-red-600 shadow-red-500/20"
                    : "bg-white text-zinc-900 border border-zinc-300 hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                }`}
              >
                <Heart className={`w-4 h-4 ${likedArticleIds.includes(selectedHomeArticle.id) ? "fill-current text-white" : "text-red-500"}`} />
                <span>
                  {likedArticleIds.includes(selectedHomeArticle.id) ? "❤️ Đã thích bài viết" : "🤍 Thích bài viết này"} (
                  {(selectedHomeArticle.likesCount || 150) + (likedArticleIds.includes(selectedHomeArticle.id) ? 1 : 0)}
                  )
                </span>
              </button>

              <button
                onClick={() => setSelectedHomeArticle(null)}
                className="px-6 py-2.5 bg-zinc-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-zinc-800 transition cursor-pointer"
              >
                Đóng bài viết
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
