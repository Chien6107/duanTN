import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, X, ArrowLeft, FileText, Sparkles, Eye, User, Calendar, Tag, Image as ImageIcon, Layers, ExternalLink, CheckCircle, Pin } from "lucide-react";
import { DataTable } from "../../components/DataTable";
import { Button } from "../../components/Button";
import { useApp } from "../../context/AppContext";
import { api } from "../../services/api";

const hasBrokenVietnamese = (value) =>
  /Ã|Â|Ä|Æ|áº|á»|â€|�|\?/.test(String(value || ""));

const ARTICLE_TEMPLATES = {
  review: `GIỚI THIỆU SẢN PHẨM\n\n[Viết 2–3 câu giới thiệu sản phẩm và điểm nổi bật.]\n\n1. THIẾT KẾ VÀ CHẤT LIỆU\n\n[Mô tả kiểu dáng, màu sắc, chất liệu và cảm giác khi mặc.]\n\n2. CÁCH PHỐI ĐỒ\n\n- Gợi ý phối đồ thứ nhất.\n- Gợi ý phối đồ thứ hai.\n- Phụ kiện phù hợp.\n\n3. PHÙ HỢP VỚI AI?\n\n[Mô tả đối tượng và hoàn cảnh sử dụng.]\n\nLỜI KẾT\n\n[Tóm tắt lợi ích và lời mời khách hàng khám phá sản phẩm.]`,
  tips: `MỞ ĐẦU\n\n[Giới thiệu vấn đề hoặc mẹo thời trang mà bài viết sẽ giải quyết.]\n\n1. MẸO THỨ NHẤT\n\n[Giải thích ngắn gọn, dễ áp dụng và có ví dụ.]\n\n2. MẸO THỨ HAI\n\n[Giải thích ngắn gọn, dễ áp dụng và có ví dụ.]\n\n3. MẸO THỨ BA\n\n[Giải thích ngắn gọn, dễ áp dụng và có ví dụ.]\n\nLƯU Ý\n\n- Điều nên làm.\n- Điều nên tránh.\n\nLỜI KẾT\n\n[Tóm tắt nội dung và đưa ra lời khuyên cuối cùng.]`,
  news: `TIN TỨC THỜI TRANG\n\n[Viết đoạn mở đầu tóm tắt thông tin quan trọng nhất.]\n\nNỘI DUNG CHÍNH\n\n[Trình bày sự kiện, xu hướng hoặc bộ sưu tập mới.]\n\nĐIỂM NỔI BẬT\n\n- Điểm nổi bật thứ nhất.\n- Điểm nổi bật thứ hai.\n- Điểm nổi bật thứ ba.\n\nNHẬN ĐỊNH TỪ FOXSTYLE\n\n[Đưa ra nhận định hoặc lời khuyên dành cho khách hàng.]\n\nLỜI KẾT\n\n[Tóm tắt và mời người đọc theo dõi các bài viết tiếp theo.]`,
};

export function AdminArticles() {
  const { products } = useApp();
  const uploadArticleImage = async (file, field) => {
    if (!file) return;
    try {
      const result = await api.media.upload(file, "image_bai_viet");
      setFormData((current) => ({ ...current, [field]: result.url }));
    } catch (error) { alert(error.message || "Không thể lưu ảnh bài viết."); }
  };
  // Tải danh sách bài viết từ localStorage hoặc mẫu phong phú dài đầy đủ
  const [articles, setArticles] = useState(() => {
    try {
      const saved = localStorage.getItem("foxstyle_admin_articles");
      const defaultArticles = [
        {
          id: 1,
          title: "Top 5 Xu Hướng Thời Trang Mùa Hè 2026 Bạn Không Thể Bỏ Lỡ",
          image: "/image_san_pham/photo-1490481651871-ab68de25d43d.jpg",
          extraImage1: "/image_bai_viet/photo-1515886657613-9f3515b0c78f.jpg",
          extraImage2: "/image_bai_viet/photo-1529139574466-a303027c1d8b.jpg",
          topicName: "Xu hướng thời trang",
          author: "FoxStyle Styling Team",
          summary: "Khám phá các phong cách thời trang năng động, mát mẻ, tông màu pastel dịu nhẹ và phom dáng khoáng đạt dành cho mùa hè năm nay.",
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
          status: "published",
          publishDate: "2026-06-15"
        },
        {
          id: 2,
          title: "Bí Quyết Phối Áo Sơ Mi Nam Chuẩn Lịch Lãm & Năng Động",
          image: "/image_san_pham/photo-1602810318383-e386cc2a3ccf.jpg",
          extraImage1: "/image_bai_viet/photo-1598033129183-c4f50c736f10.jpg",
          extraImage2: "/image_bai_viet/photo-1507679799987-c73779587ccf.jpg",
          topicName: "Mẹo phối đồ & Mix Match",
          author: "Nguyễn Văn Hùng (Stylist)",
          summary: "Hướng dẫn chọn phom dáng sơ mi tay dài, ngắn tay và nghệ thuật phối màu cùng quần tây, jeans cho quý ông hiện đại.",
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
          status: "published",
          publishDate: "2026-07-02"
        },
        {
          id: 3,
          title: "Hướng Dẫn Giặt & Bảo Quản Trang Phục Cao Cấp Đúng Cách Tại Nhà",
          image: "/image_san_pham/photo-1521572163474-6864f9cf17ab.jpg",
          extraImage1: "/image_bai_viet/photo-1489987707025-afc232f7ea0f.jpg",
          extraImage2: "",
          topicName: "Bảo quản & Chăm sóc quần áo",
          author: "Chuyên Gia Chăm Sóc Vải FoxStyle",
          summary: "Mẹo giặt tay, phân loại vải và phơi áo quần giúp giữ nguyên độ bền sợi vải, không bị sờn rách hay phai màu.",
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
          status: "published",

          publishDate: "2026-07-10"
        }
      ];

      if (!saved) return defaultArticles;
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return defaultArticles;

      // Ba bài mẫu từng bị lưu bằng sai encoding. Với các trường đã biến thành
      // dấu "?" thì không thể giải mã ngược, nên khôi phục nội dung chuẩn theo ID
      // nhưng giữ nguyên ảnh, lượt xem, trạng thái và các metadata đã chỉnh sửa.
      return parsed.map((article) => {
        const canonical = defaultArticles.find(
          (defaultArticle) => String(defaultArticle.id) === String(article.id)
        );
        if (!canonical) return article;
        const textIsBroken = [
          article.title,
          article.topicName,
          article.author,
          article.summary,
          article.content
        ].some(hasBrokenVietnamese);
        if (!textIsBroken) return article;
        return {
          ...article,
          title: canonical.title,
          topicName: canonical.topicName,
          author: canonical.author,
          summary: canonical.summary,
          content: canonical.content
        };
      });
    } catch (e) {
      return [];
    }
  });

  // Tải danh sách Chủ đề từ localStorage (đảm bảo đồng bộ với trang AdminTopics)
  useEffect(() => {
    api.articles.getAll()
      .then((response) => {
        if (Array.isArray(response?.data)) {
          setArticles((currentArticles) =>
            response.data.map((article) => {
              const current = currentArticles.find(
                (item) => String(item.id) === String(article.id)
              );
              const apiTextIsBroken = [
                article.title,
                article.topicName,
                article.author,
                article.summary,
                article.content
              ].some(hasBrokenVietnamese);
              if (!apiTextIsBroken || !current) return article;
              return {
                ...article,
                title: current.title,
                topicName: current.topicName,
                author: current.author,
                summary: current.summary,
                content: current.content
              };
            })
          );
        }
      })
      .catch((error) => console.error("Article SQL sync failed:", error));
  }, []);

  const [topicsList, setTopicsList] = useState([]);

  useEffect(() => {
    const expirationTime = 7 * 24 * 60 * 60 * 1000;
    const hideExpiredArticles = () => {
      const now = Date.now();
      setArticles((currentArticles) => {
        let changed = false;
        const updatedArticles = currentArticles.map((article) => {
          if (article.pinned || article.status !== "published") return article;
          const publishedAt = new Date(article.publishDate || article.createdAt || 0).getTime();
          if (!publishedAt || now - publishedAt < expirationTime) return article;
          changed = true;
          return { ...article, status: "hidden", autoHidden: true };
        });
        return changed ? updatedArticles : currentArticles;
      });
    };
    hideExpiredArticles();
    const expirationTimer = window.setInterval(hideExpiredArticles, 60 * 1000);
    return () => window.clearInterval(expirationTimer);
  }, []);

  useEffect(() => {
    const loadTopics = () => {
      try {
        const savedTopics = localStorage.getItem("foxstyle_admin_topics");
        if (savedTopics) {
          const parsed = JSON.parse(savedTopics);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTopicsList(parsed);
            return;
          }
        }
      } catch (e) {}
      // Mẫu dự phòng nếu chưa tạo chủ đề
      setTopicsList([
        { id: 1, name: "Xu hướng thời trang" },
        { id: 2, name: "Mẹo phối đồ & Mix Match" },
        { id: 3, name: "Bảo quản & Chăm sóc quần áo" },
        { id: 4, name: "Bộ sưu tập mới (Lookbook)" }
      ]);
    };
    loadTopics();
  }, []);

  const [showModal, setShowModal] = useState(false);
  const [previewArticle, setPreviewArticle] = useState(null); // State cho Modal Xem trước
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    productId: "",
    title: "",
    image: "",
    extraImage1: "",
    extraImage2: "",
    topicName: "Xu hướng thời trang",
    author: "Admin FoxStyle",
    summary: "",
    content: "",
    status: "published"
  });

  // Mỗi sản phẩm luôn có đúng một bài viết riêng. Khi có sản phẩm mới,
  // hệ thống tạo bản bài viết ban đầu để quản trị có thể chỉnh sửa tiếp.
  useEffect(() => {
    if (!products.length) return;
    setArticles((currentArticles) => {
      const missingProducts = products.filter(
        (product) =>
          !currentArticles.some(
            (article) => String(article.productId) === String(product.id)
          )
      );
      if (!missingProducts.length) return currentArticles;

      const generatedArticles = missingProducts.map((product) => ({
        id: `product-article-${product.id}`,
        productId: product.id,
        title: `Khám phá ${product.name} – thiết kế và cách phối đồ`,
        image: product.image || "",
        extraImage1: "",
        extraImage2: "",
        topicName: "Thông tin sản phẩm",
        author: "FoxStyle Styling Team",
        summary:
          product.description ||
          `Bài viết riêng giới thiệu thiết kế, chất liệu và cách sử dụng ${product.name}.`,
        content: `${product.name} là sản phẩm được FoxStyle lựa chọn dựa trên tiêu chí thẩm mỹ, độ thoải mái và khả năng ứng dụng trong nhiều hoàn cảnh.

Chất liệu: ${product.material || "Chất liệu thời trang cao cấp"}.
Màu sắc hiện có: ${product.colors?.join(", ") || "Tùy phiên bản sản phẩm"}.
Kích thước hiện có: ${product.sizes?.join(", ") || "Vui lòng xem các lựa chọn bên trên"}.

Gợi ý sử dụng: phối ${product.name} cùng các món đồ có màu trung tính để tạo tổng thể hài hòa. Hãy chọn đúng màu sắc và kích thước trước khi thêm sản phẩm vào giỏ hàng.

Hướng dẫn bảo quản: ${product.careInstructions || "Giặt nhẹ, tránh chất tẩy mạnh và phơi tại nơi thoáng mát để sản phẩm giữ được màu sắc, phom dáng lâu dài."}`,
        views: 0,
        status: "published",
        publishDate: new Date().toISOString().split("T")[0],
        autoGenerated: true
      }));

      return [...currentArticles, ...generatedArticles];
    });
  }, [products]);

  // Lưu articles vào localStorage khi có thay đổi
  useEffect(() => {
    try {
      localStorage.setItem("foxstyle_admin_articles", JSON.stringify(articles));
      window.dispatchEvent(
        new CustomEvent("foxstyle-content-updated", { detail: { type: "articles" } })
      );
    } catch (e) {}
  }, [articles]);

  // Mọi chủ đề đang được bài viết sử dụng phải tồn tại trong quản trị chủ đề.
  // Điều này đặc biệt quan trọng với các bài tự động có chủ đề "Thông tin sản phẩm".
  useEffect(() => {
    const normalizeName = (value) =>
      String(value || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toLowerCase();
    const usedTopicNames = Array.from(
      new Map(
        articles
          .map((article) => String(article.topicName || "").trim())
          .filter(Boolean)
          .map((name) => [normalizeName(name), name])
      ).values()
    );
    const existingNames = new Set(topicsList.map((topic) => normalizeName(topic.name)));
    const missingNames = usedTopicNames.filter((name) => !existingNames.has(normalizeName(name)));
    if (!missingNames.length) return;

    const generatedTopics = missingNames.map((name, index) => ({
      id: `auto-${Date.now()}-${index}`,
      name,
      slug: normalizeName(name)
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/^-+|-+$/g, ""),
      description: `Chủ đề được đồng bộ tự động từ các bài viết thuộc nhóm ${name}.`,
      articleCount: 0,
      status: 1
    }));
    const synchronizedTopics = [...topicsList, ...generatedTopics];
    setTopicsList(synchronizedTopics);
    try {
      localStorage.setItem("foxstyle_admin_topics", JSON.stringify(synchronizedTopics));
      window.dispatchEvent(
        new CustomEvent("foxstyle-content-updated", { detail: { type: "topics" } })
      );
    } catch (e) {}
  }, [articles, topicsList]);

  useEffect(() => {
    const syncArticlesFromAnotherTab = (event) => {
      if (event.key !== "foxstyle_admin_articles" || event.newValue === null) return;
      try {
        const parsed = JSON.parse(event.newValue);
        if (Array.isArray(parsed)) setArticles(parsed);
      } catch (e) {}
    };

    window.addEventListener("storage", syncArticlesFromAnotherTab);
    return () => window.removeEventListener("storage", syncArticlesFromAnotherTab);
  }, []);

  const handleOpenAdd = () => {
    // Tải lại danh sách chủ đề mới nhất
    try {
      const savedTopics = localStorage.getItem("foxstyle_admin_topics");
      if (savedTopics) {
        const parsed = JSON.parse(savedTopics);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTopicsList(parsed);
        }
      }
    } catch (e) {}

    setEditingId(null);
    setFormData({
      productId: "",
      title: "",
      image: "/image_san_pham/photo-1490481651871-ab68de25d43d.jpg",
      extraImage1: "",
      extraImage2: "",
      topicName: topicsList[0]?.name || "Xu hướng thời trang",
      author: "Admin FoxStyle",
      summary: "",
      content: "",
      status: "published"
    });
    setShowModal(true);
  };

  const handleOpenEdit = (art) => {
    // Tải lại danh sách chủ đề mới nhất
    try {
      const savedTopics = localStorage.getItem("foxstyle_admin_topics");
      if (savedTopics) {
        const parsed = JSON.parse(savedTopics);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTopicsList(parsed);
        }
      }
    } catch (e) {}

    setEditingId(art.id);
    setFormData({
      productId: art.productId || "",
      title: art.title || "",
      image: art.image || "",
      extraImage1: art.extraImage1 || "",
      extraImage2: art.extraImage2 || "",
      topicName: art.topicName || topicsList[0]?.name || "Xu hướng thời trang",
      author: art.author || "Admin FoxStyle",
      summary: art.summary || "",
      content: art.content || "",
      status: art.status || "published"
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.productId || !formData.title || !formData.content) {
      alert("Vui lòng chọn sản phẩm và nhập đầy đủ tiêu đề, nội dung bài viết!");
      return;
    }

    const productAlreadyHasArticle = articles.some(
      (article) =>
        String(article.productId) === String(formData.productId) &&
        article.id !== editingId
    );
    if (productAlreadyHasArticle) {
      alert("Sản phẩm này đã có bài viết. Vui lòng sửa bài viết hiện có!");
      return;
    }

    try {
      const response = editingId
        ? await api.articles.update(editingId, formData)
        : await api.articles.create(formData);
      if (editingId) {
        setArticles((prev) => prev.map((a) => (a.id === editingId ? response.data : a)));
      } else {
        setArticles((prev) => [response.data, ...prev]);
      }
      setShowModal(false);
      alert(editingId ? "Cập nhật bài viết thành công!" : "Đăng bài viết mới thành công!");
      return;
    } catch (error) {
      alert(error.message || "Không thể lưu bài viết vào SQL Server.");
      return;
    }

    if (editingId) {
      setArticles((prev) =>
        prev.map((a) => (a.id === editingId ? { ...a, ...formData } : a))
      );
      alert("Cập nhật bài viết thành công!");
    } else {
      const newArticle = {
        id: Date.now(),
        views: 1,
        publishDate: new Date().toISOString().split("T")[0],
        ...formData
      };
      setArticles((prev) => [newArticle, ...prev]);
      alert("Đăng bài viết mới thành công!");
    }
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      try {
        await api.articles.remove(id);
      } catch (error) {
        alert(error.message || "Không thể xóa bài viết trong SQL Server.");
        return;
      }
      setArticles((prev) => prev.filter((a) => a.id !== id));
      alert("Đã xóa bài viết thành công!");
    }
  };

  const handleToggleStatus = async (id) => {
    const current = articles.find((article) => article.id === id);
    if (!current) return;
    const nextStatus = current.status === "published" ? "hidden" : "published";
    try {
      const response = await api.articles.update(id, { ...current, status: nextStatus });
      setArticles((prev) => prev.map((article) => article.id === id ? response.data : article));
      return;
    } catch (error) {
      alert(error.message || "Không thể cập nhật trạng thái trong SQL Server.");
      return;
    }
    setArticles((prev) =>
      prev.map((article) =>
        article.id === id
          ? article.status === "published"
            ? { ...article, status: "hidden", autoHidden: false }
            : {
                ...article,
                status: "published",
                publishDate: new Date().toISOString().split("T")[0],
                autoHidden: false
              }
          : article
      )
    );
  };

  const handleTogglePin = (id) => {
    setArticles((prev) =>
      prev.map((article) =>
        article.id === id
          ? {
              ...article,
              pinned: !article.pinned,
              status: !article.pinned ? "published" : article.status,
              publishDate:
                !article.pinned && article.status !== "published"
                  ? new Date().toISOString().split("T")[0]
                  : article.publishDate,
              autoHidden: false
            }
          : article
      )
    );
  };

  const columns = [
    {
      header: "Ảnh & Bài viết",
      accessor: "title",
      render: (title, art) => (
        <div className="flex items-center gap-3">
          <div className="w-20 h-14 rounded-2xl bg-zinc-100 border border-zinc-200 p-0.5 shrink-0 overflow-hidden shadow-2xs group relative">
            {art.image ? (
              <img src={art.image} alt={art.title} className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition duration-300" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-zinc-200 text-zinc-500 font-bold text-[10px]">NO IMAGE</div>
            )}
          </div>
          <div className="max-w-md">
            <span className="font-extrabold text-zinc-950 text-xs block line-clamp-2 leading-snug hover:text-blue-600 cursor-pointer" onClick={() => setPreviewArticle(art)}>
              {art.title}
            </span>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-[10px] font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                {products.find((product) => String(product.id) === String(art.productId))?.name || "Chưa gắn sản phẩm"}
              </span>
              <span className="text-[10px] font-black text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                <Tag className="w-2.5 h-2.5 inline mr-1" />
                {art.topicName || "Chủ đề chung"}
              </span>
              <span className="text-[10px] font-semibold text-zinc-400 flex items-center gap-1">
                <User className="w-3 h-3" /> {art.author || "Tác giả"}
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      header: "Độ dài / Tóm tắt",
      accessor: "summary",
      render: (sum, art) => (
        <div>
          <span className="text-xs text-zinc-700 font-medium line-clamp-2 max-w-xs">
            {sum || art.content?.substring(0, 100) + "..."}
          </span>
          <span className="text-[10px] text-zinc-400 font-bold block mt-0.5">
            📏 Độ dài: {art.content?.length || 0} ký tự
          </span>
        </div>
      )
    },
    {
      header: "Lượt xem & Ngày đăng",
      accessor: "views",
      render: (views, art) => (
        <div>
          <span className="text-xs font-black text-zinc-800 flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-blue-500" /> {views || 0} lượt xem
          </span>
          <span className="text-[10px] font-semibold text-zinc-400 flex items-center gap-1 mt-0.5">
            <Calendar className="w-3 h-3" /> {art.publishDate || "Vừa đăng"}
          </span>
        </div>
      )
    },
    {
      header: "Trạng thái",
      accessor: "status",
      render: (status, art) => (
        <button
          onClick={() => handleToggleStatus(art.id)}
          className={`text-xs font-bold px-3 py-1 rounded-full border transition cursor-pointer ${
            status === "published"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
              : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
          }`}
        >
          {status === "published" ? (art.pinned ? "Đang ghim" : "Xuất bản") : status === "hidden" ? "Đã ẩn" : "Bản nháp"}
        </button>
      )
    },
    {
      header: "Thao tác",
      accessor: "id",
      align: "right",
      render: (id, art) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => handleTogglePin(art.id)}
            className={`p-2 border rounded-xl transition cursor-pointer ${
              art.pinned
                ? "text-orange-600 bg-orange-50 border-orange-200"
                : "text-zinc-600 border-transparent hover:text-orange-600 hover:bg-orange-50 hover:border-orange-200"
            }`}
            title={art.pinned ? "Bỏ ghim bài viết" : "Ghim bài viết hiển thị không giới hạn"}
          >
            <Pin className={`h-4 w-4 ${art.pinned ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={() => setPreviewArticle(art)}
            className="p-2 text-zinc-600 hover:text-purple-600 hover:bg-purple-50 border border-transparent hover:border-purple-200 rounded-xl transition cursor-pointer"
            title="Xem trước bài viết"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleOpenEdit(art)}
            className="p-2 text-zinc-600 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-200 rounded-xl transition cursor-pointer"
            title="Sửa bài viết"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(art.id)}
            className="p-2 text-zinc-600 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-xl transition cursor-pointer"
            title="Xóa bài viết"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )
    }
  ];

  if (showModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="max-h-[94vh] w-full max-w-5xl space-y-4 overflow-y-auto rounded-3xl bg-zinc-100 p-4 shadow-2xl">
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-zinc-200/80 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="hidden"
            >
              <ArrowLeft className="h-4 w-4" /> Quay lại
            </button>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 block">
                {editingId ? "Cập nhật bài viết" : "Viết bài mới"}
              </span>
              <h3 className="text-xl font-black text-zinc-900">
                {editingId ? "Chỉnh Sửa Bài Viết" : "Soạn Thảo Bài Viết Mới Mở Rộng"}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(false)}
            className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-2xl transition border border-red-200 cursor-pointer"
          >
            <X className="h-4 w-4" /> Đóng
          </button>
        </div>

        {/* Modal Form Soạn Thảo Rộng Widescreen max-w-4xl */}
        <div className="bg-white rounded-3xl shadow-xl border border-zinc-200/80 overflow-hidden max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-900 via-zinc-900 to-blue-900 p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-black text-lg text-white">
                  {editingId ? "Nội dung bài viết chi tiết" : "Trình soạn thảo bài viết thời trang chuyên nghiệp"}
                </h4>
                <p className="text-xs text-blue-300 font-medium">Viết bài viết dài, bổ sung hình ảnh minh họa và chọn đúng Chủ đề hiển thị.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setPreviewArticle(formData)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition flex items-center gap-2 cursor-pointer"
            >
              <Eye className="w-4 h-4 text-blue-300" />
              <span>Xem trước giao diện</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1.5">
                Sản phẩm áp dụng bài viết *
              </label>
              <select
                required
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                className="w-full h-12 px-4 bg-zinc-50 border border-zinc-300 rounded-2xl text-xs font-extrabold text-zinc-900 focus:bg-white focus:outline-none focus:border-blue-600"
              >
                <option value="">-- Chọn một sản phẩm --</option>
                {products.map((product) => {
                  const usedByAnotherArticle = articles.some(
                    (article) =>
                      String(article.productId) === String(product.id) &&
                      article.id !== editingId
                  );
                  return (
                    <option key={product.id} value={product.id} disabled={usedByAnotherArticle}>
                      {product.name}{usedByAnotherArticle ? " (đã có bài viết)" : ""}
                    </option>
                  );
                })}
              </select>
              <p className="mt-1 text-[10px] font-semibold text-zinc-500">
                Mỗi sản phẩm chỉ có một bài viết riêng và bài sẽ xuất hiện tại đúng trang chi tiết sản phẩm.
              </p>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1.5">Tiêu đề bài viết *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ví dụ: Top 5 xu hướng thời trang mùa hè 2026..."
                className="w-full h-12 px-4 bg-zinc-50 border border-zinc-300 rounded-2xl text-sm font-extrabold text-zinc-900 focus:bg-white focus:outline-none focus:border-blue-600"
              />
            </div>

            {/* Chọn Chủ đề & Tác giả */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1.5 flex items-center justify-between">
                  <span>Chủ đề bài viết *</span>
                  <span className="text-[10px] text-purple-600 lowercase">({topicsList.length} chủ đề có sẵn)</span>
                </label>
                <select
                  value={formData.topicName}
                  onChange={(e) => setFormData({ ...formData, topicName: e.target.value })}
                  className="w-full h-12 px-4 bg-zinc-50 border border-zinc-300 rounded-2xl text-xs font-extrabold text-purple-900 focus:bg-white focus:outline-none focus:border-blue-600"
                >
                  {topicsList.map((t, idx) => (
                    <option key={idx} value={t.name}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1.5">Tác giả bài viết</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="Ví dụ: FoxStyle Team, Nguyễn Văn A..."
                  className="w-full h-12 px-4 bg-zinc-50 border border-zinc-300 rounded-2xl text-xs font-bold text-zinc-900 focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            {/* Quản lý Hình Ảnh Bài Viết & Live Preview */}
            <div className="bg-zinc-50 p-5 rounded-3xl border border-zinc-200 space-y-4">
              <h5 className="text-xs font-black uppercase tracking-wider text-zinc-800 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-blue-600" />
                Hình ảnh bài viết & Banner minh họa
              </h5>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-600 mb-1">URL Ảnh Banner Chính *</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="Dán URL ảnh hoặc chọn ảnh từ máy"
                        className="min-w-0 flex-1 h-10 px-3 bg-white border border-zinc-300 rounded-xl text-xs font-semibold text-zinc-900 focus:outline-none focus:border-blue-600"
                      />
                      <label className="flex h-10 cursor-pointer items-center rounded-xl bg-blue-600 px-3 text-[11px] font-black text-white hover:bg-blue-700">
                        Chọn ảnh
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => uploadArticleImage(e.target.files?.[0], "image")} />
                      </label>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 mb-1">Ảnh phụ 1 (Trong bài)</label>
                      <div className="flex gap-1.5">
                        <input type="text" value={formData.extraImage1} onChange={(e) => setFormData({ ...formData, extraImage1: e.target.value })} placeholder="URL ảnh..." className="min-w-0 flex-1 h-9 px-3 bg-white border border-zinc-300 rounded-xl text-[11px] font-medium text-zinc-900" />
                        <label className="flex h-9 cursor-pointer items-center rounded-xl border border-blue-300 px-2 text-[10px] font-bold text-blue-700 hover:bg-blue-50">Chọn ảnh<input type="file" accept="image/*" className="hidden" onChange={(e) => uploadArticleImage(e.target.files?.[0], "extraImage1")} /></label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 mb-1">Ảnh phụ 2 (Trong bài)</label>
                      <div className="flex gap-1.5">
                        <input type="text" value={formData.extraImage2} onChange={(e) => setFormData({ ...formData, extraImage2: e.target.value })} placeholder="URL ảnh..." className="min-w-0 flex-1 h-9 px-3 bg-white border border-zinc-300 rounded-xl text-[11px] font-medium text-zinc-900" />
                        <label className="flex h-9 cursor-pointer items-center rounded-xl border border-blue-300 px-2 text-[10px] font-bold text-blue-700 hover:bg-blue-50">Chọn ảnh<input type="file" accept="image/*" className="hidden" onChange={(e) => uploadArticleImage(e.target.files?.[0], "extraImage2")} /></label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Khung Xem Trước Live Thumbnail */}
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-300 rounded-2xl p-2 bg-white relative overflow-hidden h-32">
                  {formData.image ? (
                    <img src={formData.image} alt="Preview Banner" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <span className="text-[10px] text-zinc-400 font-bold">Chưa có URL ảnh</span>
                  )}
                  <span className="absolute bottom-1 bg-black/60 text-white text-[9px] font-black px-2 py-0.5 rounded-full">Banner Preview</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-700 mb-1.5">Tóm tắt vắn tắt bài viết (1-2 câu)</label>
              <textarea
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="Nhập tóm tắt tạo cảm hứng đọc bài viết..."
                rows={2}
                className="w-full p-3.5 bg-zinc-50 border border-zinc-300 rounded-2xl text-xs font-medium text-zinc-900 focus:bg-white focus:outline-none focus:border-blue-600 resize-none"
              />
            </div>

            {/* Khung Nội Dung Bài Viết Dài Chi Tiết */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-black uppercase tracking-wider text-zinc-700">Nội dung chi tiết bài viết (Dài) *</label>
                <span className="text-[10px] font-mono text-zinc-400">Đã nhập: {formData.content?.length || 0} ký tự</span>
              </div>
              <div className="mb-3 rounded-2xl border border-blue-100 bg-blue-50 p-3">
                <p className="mb-2 text-xs font-bold text-blue-900">Viết nhanh từ mẫu có sẵn</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    ["review", "Giới thiệu sản phẩm"],
                    ["tips", "Mẹo thời trang"],
                    ["news", "Tin tức"],
                  ].map(([key, label]) => (
                    <button key={key} type="button" onClick={() => {
                      if (formData.content.trim() && !window.confirm("Thay nội dung hiện tại bằng mẫu mới?")) return;
                      setFormData({ ...formData, content: ARTICLE_TEMPLATES[key] });
                    }} className="rounded-xl border border-blue-200 bg-white px-3 py-2 text-xs font-bold text-blue-700 transition hover:bg-blue-600 hover:text-white">
                      {label}
                    </button>
                  ))}
                  <button type="button" onClick={() => setFormData({ ...formData, content: `${formData.content}${formData.content ? "\n\n" : ""}TIÊU ĐỀ MỤC\n\nNội dung của mục...` })} className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-100">+ Tiêu đề mục</button>
                  <button type="button" onClick={() => setFormData({ ...formData, content: `${formData.content}${formData.content ? "\n" : ""}- Nội dung danh sách` })} className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-xs font-bold text-zinc-700 hover:bg-zinc-100">+ Danh sách</button>
                </div>
              </div>
              <textarea
                required
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Nhập toàn bộ nội dung bài viết chi tiết tại đây (hỗ trợ nhiều đoạn văn, tiêu đề mục 1, 2, 3...)..."
                rows={18}
                className="w-full p-4 bg-white border border-zinc-300 rounded-2xl text-sm font-medium text-zinc-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 leading-7 font-sans"
              />
              <p className="mt-2 text-xs text-zinc-500">Chọn một mẫu, thay phần nội dung trong dấu ngoặc vuông rồi xem trước trước khi đăng.</p>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-zinc-800">
                <input
                  type="radio"
                  name="status"
                  checked={formData.status === "published"}
                  onChange={() => setFormData({ ...formData, status: "published" })}
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                />
                <span>Xuất bản công khai</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-zinc-800">
                <input
                  type="radio"
                  name="status"
                  checked={formData.status === "draft"}
                  onChange={() => setFormData({ ...formData, status: "draft" })}
                  className="w-4 h-4 text-amber-600 focus:ring-amber-500"
                />
                <span>Lưu bản nháp</span>
              </label>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 h-12 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs uppercase tracking-wider rounded-2xl transition cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition shadow-lg shadow-blue-600/25 cursor-pointer flex items-center justify-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                <span>{editingId ? "Cập nhật bài viết" : "Đăng bài viết mới"}</span>
              </button>
            </div>
          </form>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-3xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 shrink-0">
            <FileText className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full">
                QUẢN LÝ BLOG & TIN TỨC
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-zinc-100 text-zinc-600 px-2.5 py-0.5 rounded-full">
                {articles.length} bài viết
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-zinc-950 mt-1">
              Bài Viết & Tin Tức
            </h2>
            <p className="text-xs font-semibold text-zinc-500 mt-0.5">
              Soạn thảo, quản lý bài viết tin tức thời trang phong phú, hình ảnh minh họa sắc nét và đồng bộ chủ đề.
            </p>
          </div>
        </div>

        <Button icon={Plus} onClick={handleOpenAdd} className="shadow-lg shadow-blue-600/20 bg-blue-600 hover:bg-blue-700 text-white border-transparent">
          Soạn bài viết mới
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-sm overflow-hidden p-1">
        <DataTable
          columns={columns}
          data={articles}
          searchPlaceholder="Tìm kiếm bài viết theo tiêu đề, tác giả, chủ đề..."
          searchKeys={["title", "topicName", "author", "summary", "content"]}
          itemsPerPage={8}
        />
      </div>

      {/* Modal Xem Trước Bài Viết Dạng Đọc Blog Thực Tế */}
      {previewArticle && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden w-full max-w-3xl my-8 max-h-[90vh] flex flex-col">
            <div className="bg-zinc-900 text-white p-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase bg-orange-600 px-2.5 py-0.5 rounded-full text-white">
                  Xem trước giao diện
                </span>
                <span className="text-xs text-zinc-400 font-bold">Chủ đề: {previewArticle.topicName}</span>
              </div>
              <button
                onClick={() => setPreviewArticle(null)}
                className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto space-y-6 text-zinc-900">
              {/* Banner Header */}
              {previewArticle.image && (
                <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden shadow-lg relative">
                  <img src={previewArticle.image} alt={previewArticle.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-xs font-black uppercase text-orange-400 tracking-wider mb-2">
                      {previewArticle.topicName}
                    </span>
                    <h1 className="text-xl md:text-2xl font-black leading-tight">
                      {previewArticle.title}
                    </h1>
                  </div>
                </div>
              )}

              {/* Tác giả & Ngày đăng */}
              <div className="flex items-center justify-between border-b border-zinc-200 pb-4 text-xs text-zinc-500 font-semibold">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-500 text-white font-bold flex items-center justify-center text-xs">
                    {(previewArticle.author || "F").charAt(0)}
                  </div>
                  <div>
                    <span className="font-bold text-zinc-900 block">{previewArticle.author || "FoxStyle Team"}</span>
                    <span className="text-[10px] text-zinc-400">Tác giả chuyên mục thời trang</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span>📅 {previewArticle.publishDate || "Hôm nay"}</span>
                  <span>👁️ {previewArticle.views || 1} lượt xem</span>
                </div>
              </div>

              {/* Summary */}
              {previewArticle.summary && (
                <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-2xl italic text-sm text-zinc-800 font-medium leading-relaxed">
                  "{previewArticle.summary}"
                </div>
              )}

              {/* Photos Gallery nếu có */}
              {(previewArticle.extraImage1 || previewArticle.extraImage2) && (
                <div className="grid grid-cols-2 gap-4 my-4">
                  {previewArticle.extraImage1 && (
                    <img src={previewArticle.extraImage1} alt="Extra 1" className="w-full h-48 object-cover rounded-2xl shadow-sm" />
                  )}
                  {previewArticle.extraImage2 && (
                    <img src={previewArticle.extraImage2} alt="Extra 2" className="w-full h-48 object-cover rounded-2xl shadow-sm" />
                  )}
                </div>
              )}

              {/* Full Content Paragraphs */}
              <div className="text-sm font-normal text-zinc-800 leading-relaxed space-y-4 whitespace-pre-line font-sans">
                {previewArticle.content}
              </div>
            </div>

            <div className="bg-zinc-100 p-4 border-t border-zinc-200 flex justify-end shrink-0">
              <button
                onClick={() => setPreviewArticle(null)}
                className="px-6 py-2.5 bg-zinc-900 text-white font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-zinc-800 transition cursor-pointer"
              >
                Đóng xem trước
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
