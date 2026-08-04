package com.foxstyle.api.config;

import com.foxstyle.api.entity.*;
import com.foxstyle.api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.text.Normalizer;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;

@Component
@org.springframework.core.annotation.Order(100)
@ConditionalOnProperty(name = "app.seed-demo-data", havingValue = "true")
@RequiredArgsConstructor
@SuppressWarnings("null")
public class CompleteDemoDataInitializer implements ApplicationRunner {
    private final UserRepository users;
    private final ProductRepository products;
    private final ProductVariantRepository variants;
    private final OrderRepository orders;
    private final PaymentRepository payments;
    private final CouponRepository coupons;
    private final ReviewRepository reviews;
    private final ArticleTopicRepository topics;
    private final ArticleRepository articles;
    private final ChatMessageRepository chats;
    private final NewsletterSubscriptionRepository newsletters;
    private final WishlistRepository wishlists;
    private final CartRepository carts;
    private final CartDetailRepository cartDetails;
    private final UserCouponRepository userCoupons;
    private final PaymentReconciliationRepository reconciliations;
    private final StockImportReceiptRepository receipts;
    private final SettingRepository settings;
    private final BannerRepository banners;
    private final DistrictRepository districts;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        List<User> customers = users.findAll().stream()
                .filter(u -> u.getRole() != null && "ROLE_CUSTOMER".equals(u.getRole().getRoleName()))
                .toList();
        List<Product> productList = products.findAll();
        List<ProductVariant> variantList = variants.findAll();
        if (customers.isEmpty() || productList.isEmpty() || variantList.isEmpty()) return;

        seedSettings();
        seedDistricts();
        seedBanners();
        seedArticles(productList);
        repairArticleCatalog(productList);
        seedReviews(customers, productList);
        seedChats(customers);
        seedNewsletters(customers);
        seedWishlistsAndCarts(customers, productList, variantList);
        seedCouponUsage(customers);
        seedReconciliations();
        seedStockReceipts(variantList);
        synchronizeRelatedData();
        System.out.println("CompleteDemoDataInitializer: all demo business modules are ready.");
    }

    private void seedSettings() {
        String[][] data = {
                {"site_name", "FoxStyle Fashion", "Tên website"},
                {"hotline", "1900 6868", "Hotline chăm sóc khách hàng"},
                {"support_email", "support@foxstyle.vn", "Email hỗ trợ"},
                {"store_address", "123 Nguyễn Huệ, Quận 1, TP Hồ Chí Minh", "Địa chỉ cửa hàng"},
                {"urban_shipping_fee", "20000", "Phí giao hàng nội thành"},
                {"suburban_shipping_fee", "30000", "Phí giao hàng ngoại thành"},
                {"free_shipping_threshold", "500000", "Giá trị miễn phí vận chuyển"},
                {"shipping_base_km", "3", "Số km giao hàng cơ bản"},
                {"shipping_extra_km_fee", "3000", "Phí mỗi km vượt mức"},
                {"shipping_max_cap", "80000", "Phí vận chuyển tối đa"},
                {"active_shipping_partner", "viettelpost", "Đối tác vận chuyển mặc định"},
                {"policy_returns", "Đổi trả trong 7 ngày khi sản phẩm còn nguyên tem và chưa qua sử dụng.", "Chính sách đổi trả"},
                {"policy_warranty", "Tiếp nhận bảo hành lỗi kỹ thuật và xử lý trong 3–7 ngày làm việc.", "Chính sách bảo hành"},
                {"policy_privacy", "Thông tin khách hàng chỉ được sử dụng để xử lý đơn và chăm sóc khách hàng.", "Chính sách bảo mật"}
        };
        for (String[] row : data) if (!settings.existsBySettingKeyIgnoreCase(row[0]))
            settings.save(Setting.builder().settingKey(row[0]).settingValue(row[1]).description(row[2]).build());
    }

    private void seedDistricts() {
        String[][] data = {{"Quận 1","TP Hồ Chí Minh"},{"Quận 3","TP Hồ Chí Minh"},{"Quận 7","TP Hồ Chí Minh"},
                {"Thành phố Thủ Đức","TP Hồ Chí Minh"},{"Cầu Giấy","Hà Nội"},{"Hoàn Kiếm","Hà Nội"},
                {"Hải Châu","Đà Nẵng"},{"Ninh Kiều","Cần Thơ"},{"Hồng Bàng","Hải Phòng"}};
        for (String[] row : data) if (!districts.existsByDistrictNameIgnoreCaseAndProvinceIgnoreCase(row[0], row[1]))
            districts.save(District.builder().districtName(row[0]).province(row[1]).status((byte) 1).build());
    }

    private void seedBanners() {
        if (!banners.findByBannerTypeOrderByPositionAsc("IMAGE").isEmpty()) return;
        String[][] data = {{"Bộ sưu tập mùa hè","/image_banner/banner1.jpg","/products"},
                {"Phong cách công sở hiện đại","/image_banner/banner2.jpg","/products"},
                {"Ưu đãi thành viên FoxStyle","/image_banner/banner3.jpg","/account"}};
        for (int i=0;i<data.length;i++) banners.save(Banner.builder().title(data[i][0]).imageUrl(data[i][1])
                .bannerType("IMAGE").linkUrl(data[i][2]).position(i+1).status((byte)1).build());
    }

    private void seedArticles(List<Product> productList) {
        String[][] topicData = {{"Xu hướng thời trang","xu-huong-thoi-trang"},{"Mẹo phối đồ","meo-phoi-do"},
                {"Chăm sóc sản phẩm","cham-soc-san-pham"},{"Tin tức FoxStyle","tin-tuc-foxstyle"}};
        List<ArticleTopic> topicList = new ArrayList<>();
        for (String[] row : topicData) topicList.add(topics.findBySlug(row[1]).orElseGet(() ->
                topics.save(ArticleTopic.builder().topicName(row[0]).slug(row[1]).description("Nội dung " + row[0].toLowerCase()).status((byte)1).build())));
        String[][] data = {{"7 cách phối áo thun đẹp mỗi ngày","7-cach-phoi-ao-thun-dep-moi-ngay"},
                {"Chọn trang phục công sở thanh lịch","chon-trang-phuc-cong-so-thanh-lich"},
                {"Cách bảo quản quần jeans bền màu","cach-bao-quan-quan-jeans-ben-mau"},
                {"Xu hướng màu sắc nổi bật năm 2026","xu-huong-mau-sac-noi-bat-2026"},
                {"Hướng dẫn chọn size khi mua online","huong-dan-chon-size-khi-mua-online"},
                {"FoxStyle ra mắt bộ sưu tập mới","foxstyle-ra-mat-bo-suu-tap-moi"}};
        for (int i=0;i<data.length;i++) if (!articles.existsBySlug(data[i][1])) {
            LinkedHashSet<Product> linked = new LinkedHashSet<>(); linked.add(productList.get(i % productList.size()));
            articles.save(Article.builder().topic(topicList.get(i % topicList.size())).title(data[i][0]).slug(data[i][1])
                    .summary("Bài viết chia sẻ kiến thức và gợi ý thực tế dành cho khách hàng FoxStyle.")
                    .content("Khám phá các nguyên tắc lựa chọn, phối hợp và bảo quản trang phục. Nội dung được biên soạn chi tiết để khách hàng dễ áp dụng trong đời sống hằng ngày.")
                    .imageUrl("/image_san_pham/photo-1521572163474-6864f9cf17ab.jpg").authorName("FoxStyle Editorial")
                    .viewCount(120 + i * 87).status("published").publishedAt(LocalDateTime.now().minusDays(i * 4L + 1)).products(linked).build());
        }
    }

    private void repairArticleCatalog(List<Product> productList) {
        String[][] topicRows = {
                {"xu-huong-thoi-trang", "Xu hướng thời trang", "Cập nhật màu sắc, kiểu dáng và xu hướng nổi bật theo mùa."},
                {"meo-phoi-do", "Mẹo phối đồ & Mix Match", "Hướng dẫn kết hợp trang phục và phụ kiện cho từng hoàn cảnh."},
                {"cham-soc-san-pham", "Bảo quản & Chăm sóc quần áo", "Hướng dẫn giặt, phơi, cất giữ và kéo dài tuổi thọ sản phẩm."},
                {"huong-dan-mua-sam", "Hướng dẫn mua sắm", "Tư vấn chọn size, chất liệu, kiểu dáng và đặt hàng trực tuyến."},
                {"bo-suu-tap-lookbook", "Bộ sưu tập & Lookbook", "Giới thiệu bộ sưu tập, câu chuyện thiết kế và gợi ý outfit hoàn chỉnh."},
                {"tin-tuc-khuyen-mai", "Tin tức & Khuyến mãi", "Thông tin mới từ FoxStyle, chương trình ưu đãi và sự kiện nổi bật."}
        };
        java.util.Map<String, ArticleTopic> topicMap = new java.util.LinkedHashMap<>();
        for (String[] row : topicRows) {
            ArticleTopic topic = findCompatibleTopic(row[0])
                    .or(() -> topics.findByTopicNameIgnoreCase(row[1]))
                    .orElseGet(() -> topics.save(ArticleTopic.builder()
                            .slug(row[0]).topicName(row[1]).description(row[2]).status((byte) 1).build()));
            topic.setTopicName(row[1]);
            topic.setDescription(row[2]);
            topic.setStatus((byte) 1);
            topicMap.put(row[0], topic);
        }

        String[][] rows = {
                {"7 cách phối áo thun đẹp mỗi ngày", "7-cach-phoi-ao-thun-dep-moi-ngay", "meo-phoi-do", "áo thun",
                        "Bảy công thức phối áo thun dễ áp dụng cho đi học, đi làm và dạo phố.",
                        "Áo thun là món đồ cơ bản nhưng có thể tạo nhiều phong cách khác nhau. Hãy phối cùng quần jeans cho vẻ năng động, quần kaki cho phong cách smart-casual hoặc khoác thêm blazer khi cần lịch sự. Chọn màu trung tính để dễ kết hợp và dùng phụ kiện vừa phải để tổng thể hài hòa."},
                {"Chọn trang phục công sở thanh lịch", "chon-trang-phuc-cong-so-thanh-lich", "meo-phoi-do", "sơ mi",
                        "Gợi ý xây dựng trang phục công sở chỉn chu, thoải mái và dễ ứng dụng.",
                        "Trang phục công sở nên ưu tiên phom vừa vặn, màu sắc nhã nhặn và chất liệu ít nhăn. Áo sơ mi có thể kết hợp quần tây, kaki hoặc chân váy chữ A. Hoàn thiện outfit bằng giày tối giản và túi có cấu trúc để giữ vẻ chuyên nghiệp suốt ngày dài."},
                {"Cách bảo quản quần jeans bền màu", "cach-bao-quan-quan-jeans-ben-mau", "cham-soc-san-pham", "jean",
                        "Hướng dẫn giặt và bảo quản denim giúp quần giữ màu, giữ phom lâu hơn.",
                        "Hãy lộn trái quần jeans trước khi giặt, sử dụng nước lạnh và hạn chế chất tẩy mạnh. Không nên giặt quá thường xuyên hoặc sấy ở nhiệt độ cao. Phơi sản phẩm tại nơi thoáng mát, tránh ánh nắng trực tiếp để màu denim bền đẹp."},
                {"Xu hướng màu sắc nổi bật năm 2026", "xu-huong-mau-sac-noi-bat-2026", "xu-huong-thoi-trang", "áo",
                        "Những bảng màu dễ ứng dụng đang dẫn đầu xu hướng thời trang năm 2026.",
                        "Năm 2026 nổi bật với xanh navy, nâu cà phê, kem be và các gam pastel dịu. Các màu này phù hợp cả trang phục hằng ngày lẫn công sở. Bạn có thể dùng một màu làm điểm nhấn và giữ những món còn lại ở tông trung tính để outfit cân bằng."},
                {"Hướng dẫn chọn size khi mua online", "huong-dan-chon-size-khi-mua-online", "huong-dan-mua-sam", "áo",
                        "Cách đo cơ thể và đối chiếu bảng size để hạn chế đổi trả khi mua trực tuyến.",
                        "Đo vòng ngực, vòng eo, vòng mông và chiều dài trang phục bằng thước dây. So sánh số đo với bảng size của từng sản phẩm thay vì chỉ dựa vào size thường mặc. Nếu nằm giữa hai size, hãy chọn theo phom mong muốn và liên hệ FoxStyle để được tư vấn."},
                {"FoxStyle ra mắt bộ sưu tập mới", "foxstyle-ra-mat-bo-suu-tap-moi", "bo-suu-tap-lookbook", "combo",
                        "Khám phá bộ sưu tập mới với các outfit được phối sẵn và dễ ứng dụng.",
                        "Bộ sưu tập mới tập trung vào phom dáng hiện đại, chất liệu thoải mái và bảng màu dễ phối. Các thiết kế có thể sử dụng riêng lẻ hoặc kết hợp thành set hoàn chỉnh. Lookbook gợi ý outfit cho công sở, cuối tuần và những chuyến đi ngắn."},
                {"5 món đồ cần có trong tủ quần áo", "5-mon-do-can-co-trong-tu-quan-ao", "huong-dan-mua-sam", "áo",
                        "Danh sách những món đồ nền tảng giúp bạn phối trang phục nhanh và hiệu quả.",
                        "Một tủ đồ linh hoạt nên có áo thun trơn, sơ mi sáng màu, quần jeans vừa vặn, quần tây trung tính và áo khoác nhẹ. Ưu tiên sản phẩm có chất liệu tốt, đúng kích thước và màu dễ kết hợp để sử dụng được trong nhiều hoàn cảnh."},
                {"Phối đồ đi chơi cuối tuần năng động", "phoi-do-di-choi-cuoi-tuan-nang-dong", "meo-phoi-do", "giày",
                        "Ba gợi ý outfit cuối tuần thoải mái nhưng vẫn có điểm nhấn.",
                        "Bạn có thể phối áo thun cùng jeans và sneaker, sơ mi khoác ngoài với quần kaki hoặc chọn một set thể thao đồng bộ. Giữ bảng màu trong hai đến ba tông và chọn một phụ kiện nổi bật để trang phục không bị rối."},
                {"Cách chăm sóc áo sơ mi đúng cách", "cach-cham-soc-ao-so-mi-dung-cach", "cham-soc-san-pham", "sơ mi",
                        "Các bước giặt, phơi và ủi giúp áo sơ mi luôn phẳng đẹp.",
                        "Phân loại áo theo màu, cài nút vừa phải và giặt ở chế độ nhẹ. Treo áo ngay sau khi giặt, chỉnh cổ và nẹp áo trước khi phơi. Khi ủi, bắt đầu từ cổ, vai, tay rồi đến thân áo để giữ phom chuẩn."},
                {"Lookbook công sở tối giản", "lookbook-cong-so-toi-gian", "bo-suu-tap-lookbook", "quần tây",
                        "Bộ outfit công sở tối giản dành cho tuần làm việc hiện đại.",
                        "Lookbook sử dụng sơ mi, quần tây và blazer trong các gam đen, trắng, xám và be. Các món đồ có thể hoán đổi cho nhau để tạo nhiều outfit mà vẫn đồng nhất. Điểm nhấn đến từ chất liệu và đường cắt thay vì họa tiết cầu kỳ."},
                {"Ưu đãi thành viên FoxStyle tháng này", "uu-dai-thanh-vien-foxstyle-thang-nay", "tin-tuc-khuyen-mai", "combo",
                        "Tổng hợp voucher và quyền lợi mua sắm dành cho thành viên FoxStyle.",
                        "Thành viên được nhận voucher theo hạng, ưu đãi sinh nhật và quyền truy cập sớm vào chương trình khuyến mãi. Kiểm tra mục tài khoản để xem mã đang có, điều kiện đơn tối thiểu và thời hạn sử dụng trước khi thanh toán."},
                {"Top xu hướng thời trang hè 2026", "xu-huong-thoi-trang-he-2026", "xu-huong-thoi-trang", "áo",
                        "Những xu hướng mùa hè cân bằng giữa tính thẩm mỹ, sự thoáng mát và khả năng ứng dụng.",
                        "Mùa hè 2026 ưu tiên chất liệu cotton, linen, phom dáng thoải mái và bảng màu pastel kết hợp trung tính. Áo thun, sơ mi ngắn tay và quần dáng rộng tiếp tục được ưa chuộng. Hãy chọn trang phục phù hợp vóc dáng và giữ tổng thể gọn gàng bằng phụ kiện tối giản."},
                {"Chọn giày phù hợp với từng hoàn cảnh", "chon-giay-phu-hop-voi-tung-hoan-canh", "huong-dan-mua-sam", "giày",
                        "Hướng dẫn chọn kiểu giày theo mục đích sử dụng và trang phục.",
                        "Sneaker phù hợp cho hoạt động hằng ngày, giày tây dành cho dịp trang trọng và sandal thích hợp khi cần sự thoáng nhẹ. Hãy đo chiều dài bàn chân vào cuối ngày, kiểm tra chất liệu lót và chọn khoảng dư mũi chân hợp lý."}
        };

        for (int i = 0; i < rows.length; i++) {
            String[] row = rows[i];
            Product linkedProduct = productList.stream()
                    .filter(p -> normalizeText(p.getProductName()).contains(normalizeText(row[3])))
                    .findFirst().orElse(productList.get(i % productList.size()));
            Article article = articles.findBySlug(row[1]).orElseGet(Article::new);
            article.setSlug(row[1]);
            article.setTitle(row[0]);
            article.setTopic(topicMap.get(row[2]));
            article.setSummary(row[4]);
            article.setContent(row[5]);
            article.setAuthorName("FoxStyle Editorial");
            article.setImageUrl(linkedProduct.getImageUrl());
            article.setStatus("published");
            article.setPublishedAt(LocalDateTime.now().minusDays(i * 3L + 1));
            article.setViewCount(180 + i * 113);
            LinkedHashSet<Product> linked = new LinkedHashSet<>();
            linked.add(linkedProduct);
            article.setProducts(linked);
            articles.save(article);
        }
    }

    private java.util.Optional<ArticleTopic> findCompatibleTopic(String canonicalSlug) {
        List<String> accepted = switch (canonicalSlug) {
            case "cham-soc-san-pham" -> List.of("cham-soc-san-pham", "bao-quan-quan-ao", "bao-quan-cham-soc");
            case "bo-suu-tap-lookbook" -> List.of("bo-suu-tap-lookbook", "bo-suu-tap-moi", "lookbook");
            case "tin-tuc-khuyen-mai" -> List.of("tin-tuc-khuyen-mai", "tin-tuc-foxstyle", "tin-tuc");
            default -> List.of(canonicalSlug);
        };
        return topics.findAll().stream().filter(topic -> accepted.contains(topic.getSlug())).findFirst();
    }

    private String normalizeText(String value) {
        return Normalizer.normalize(String.valueOf(value), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "").replace('đ', 'd').replace('Đ', 'D')
                .toLowerCase(Locale.ROOT);
    }

    private void seedReviews(List<User> customerList, List<Product> productList) {
        long existing = reviews.count();
        if (existing >= 100) return;
        String[] comments = {"Sản phẩm đẹp, đúng mô tả và giao hàng nhanh.","Chất vải tốt, mặc thoải mái.",
                "Đóng gói cẩn thận, tư vấn size chính xác.","Màu sắc thực tế rất đẹp.","Sẽ tiếp tục ủng hộ FoxStyle."};
        for (int i=(int) existing;i<100;i++) reviews.save(Review.builder().user(customerList.get(i % customerList.size()))
                .product(productList.get(i % productList.size())).rating((byte)(3 + i % 3)).comment(comments[i % comments.length])
                .reviewDate(LocalDateTime.now().minusDays(i + 1L)).build());
    }

    private void seedChats(List<User> customerList) {
        String[] contactTopics = {"Tư vấn chọn size áo", "Kiểm tra trạng thái đơn hàng", "Hỏi chính sách đổi trả",
                "Tư vấn phối đồ", "Yêu cầu xuất hóa đơn", "Hỗ trợ thanh toán", "Phản hồi chất lượng", "Hỏi thời gian giao hàng"};
        for (int i = 0; i < Math.min(contactTopics.length, customerList.size()); i++) {
            User customer = customerList.get(i);
            String channel = "contact_demo" + String.format("%02d", i + 1) + "@gmail.com";
            if (chats.findByChannelIdOrderBySentAtAsc(channel).isEmpty()) {
                chats.save(ChatMessage.builder().channelId(channel).customerName(customer.getFullName())
                        .senderId(String.valueOf(customer.getUserId())).senderName(customer.getFullName()).senderRole("customer")
                        .content("📩 YÊU CẦU LIÊN HỆ TỪ KHÁCH HÀNG\nHọ tên: " + customer.getFullName()
                                + "\nEmail: " + customer.getEmail() + "\nSố điện thoại: " + customer.getPhone()
                                + "\nNội dung: " + contactTopics[i]).sentAt(LocalDateTime.now().minusDays(i + 1L)).build());
                chats.save(ChatMessage.builder().channelId(channel).customerName(customer.getFullName()).senderId("staff")
                        .senderName("Nhân viên FoxStyle").senderRole("staff")
                        .content("FoxStyle đã tiếp nhận yêu cầu và sẽ hỗ trợ bạn trong thời gian sớm nhất.")
                        .sentAt(LocalDateTime.now().minusDays(i + 1L).plusMinutes(15)).build());
            }
        }
        if (chats.count() >= 60) return;
        for (int i=0;i<Math.min(30, customerList.size());i++) {
            User customer = customerList.get(i); String channel = "customer_" + customer.getUserId();
            chats.save(ChatMessage.builder().channelId(channel).customerName(customer.getFullName()).senderId(String.valueOf(customer.getUserId()))
                    .senderName(customer.getFullName()).senderRole("customer").content("Shop tư vấn giúp mình chọn size và thời gian giao hàng nhé.").sentAt(LocalDateTime.now().minusHours(12-i)).build());
            chats.save(ChatMessage.builder().channelId(channel).customerName(customer.getFullName()).senderId("staff").senderName("Nhân viên FoxStyle")
                    .senderRole("staff").content("FoxStyle đã nhận yêu cầu. Bạn gửi chiều cao và cân nặng để mình tư vấn chính xác nhé.").sentAt(LocalDateTime.now().minusHours(11-i)).build());
        }
    }

    private void seedNewsletters(List<User> customerList) {
        for (User customer : customerList) if (customer.getEmail()!=null && !newsletters.existsByEmail(customer.getEmail()))
            newsletters.save(NewsletterSubscription.builder().email(customer.getEmail()).subscribedAt(LocalDateTime.now().minusDays(customer.getUserId()%30)).build());
    }

    private void seedWishlistsAndCarts(List<User> customerList, List<Product> productList, List<ProductVariant> variantList) {
        for (int i=0;i<customerList.size();i++) {
            User customer=customerList.get(i);
            for (int j=0;j<2;j++) { Product product=productList.get((i*3+j)%productList.size());
                if (!wishlists.existsByUserUserIdAndProductProductId(customer.getUserId(),product.getProductId()))
                    wishlists.save(Wishlist.builder().user(customer).product(product).addedDate(LocalDateTime.now().minusDays(i+j+1L)).build()); }
            if (i < 5) { Cart cart=carts.findByUserUserId(customer.getUserId()).orElseGet(() -> carts.save(Cart.builder().user(customer).build()));
                for(int j=0;j<2;j++){ ProductVariant variant=variantList.get((i*5+j)%variantList.size());
                    if(cartDetails.findByCartCartIdAndVariantVariantId(cart.getCartId(),variant.getVariantId()).isEmpty())
                        cartDetails.save(CartDetail.builder().cart(cart).variant(variant).quantity(j+1).build()); }}
        }
    }

    private void seedCouponUsage(List<User> customerList) {
        List<Coupon> couponList=coupons.findAll(); List<Order> orderList=orders.findAll();
        for(int i=0;i<Math.min(6,Math.min(couponList.size(),orderList.size()));i++){
            Order order=orderList.get(i); User user=order.getUser(); Coupon coupon=couponList.get(i);
            UserCouponId id=new UserCouponId(user.getUserId(),coupon.getCouponId());
            if(!userCoupons.existsByIdUserIdAndIdCouponId(user.getUserId(),coupon.getCouponId())) {
                order.setCoupon(coupon);
                userCoupons.save(UserCoupon.builder().id(id).user(user).coupon(coupon).order(order).usedAt(order.getOrderDate()).build());
            }
        }
    }

    private void seedReconciliations() {
        User admin=users.findByUsername("admin").orElse(null);
        for(Payment payment:payments.findAll()) if(payment.getPaymentStatus()==1 && reconciliations.findByPaymentPaymentId(payment.getPaymentId()).isEmpty())
            reconciliations.save(PaymentReconciliation.builder().payment(payment).reconciliationCode("REC-"+String.format("%08d",payment.getPaymentId()))
                    .reconciledBy(admin).reconciledAt(payment.getPaymentDate().plusHours(2)).status("reconciled").note("Đối soát tự động dữ liệu demo").build());
    }

    private void seedStockReceipts(List<ProductVariant> variantList) {
        if(receipts.count()>0)return;
        String[] suppliers={"Công ty May Việt Tiến","Xưởng thời trang Minh Anh","Nhà phân phối Fashion Hub"};
        for(int i=0;i<3;i++){
            StockImportReceipt receipt=StockImportReceipt.builder().receiptCode("PN-DEMO-"+String.format("%04d",i+1))
                    .supplierName(suppliers[i]).supplierPhone("090800000"+i).note("Phiếu nhập kho phục vụ dữ liệu trình bày")
                    .subtotalAmount(new BigDecimal("12000000")).discountAmount(new BigDecimal("500000"))
                    .shippingFee(new BigDecimal("200000")).otherFee(BigDecimal.ZERO).taxRate(new BigDecimal("8"))
                    .taxAmount(new BigDecimal("920000")).totalAmount(new BigDecimal("12620000")).createdBy("admin")
                    .createdAt(LocalDateTime.now().minusDays(30L-i*10L)).build();
            List<StockImport> items=new ArrayList<>();
            for(int j=0;j<4;j++){ProductVariant variant=variantList.get((i*9+j)%variantList.size()); BigDecimal cost=new BigDecimal("250000");
                items.add(StockImport.builder().receipt(receipt).variant(variant).quantity(12).unitCost(cost)
                        .totalCost(cost.multiply(new BigDecimal("12"))).stockAfter(variant.getQuantity()).importedAt(receipt.getCreatedAt()).build());}
            receipt.setItems(items); receipts.save(receipt);
        }
    }

    /**
     * Keeps cross-module demo records consistent so reports and detail screens
     * always describe the same business event.
     */
    private void synchronizeRelatedData() {
        List<Order> orderList = orders.findAll();
        for (Payment payment : payments.findAll()) {
            Order order = payment.getOrder();
            payment.setAmount(order.getTotalAmount());
            if (order.getStatus() == OrderStatus.CANCELLED || order.getStatus() == OrderStatus.RETURNED) {
                payment.setPaymentStatus((byte) 2);
            } else if (order.getStatus() == OrderStatus.PENDING && "COD".equalsIgnoreCase(payment.getPaymentMethod())) {
                payment.setPaymentStatus((byte) 0);
            }
        }

        List<OrderDetail> purchasedItems = new ArrayList<>();
        for (Order order : orderList) {
            if (order.getStatus() == OrderStatus.DELIVERED && order.getOrderDetails() != null) {
                purchasedItems.addAll(order.getOrderDetails());
            }
        }
        if (!purchasedItems.isEmpty()) {
            List<Review> reviewList = reviews.findAll();
            for (int i = 0; i < reviewList.size(); i++) {
                OrderDetail purchased = purchasedItems.get(i % purchasedItems.size());
                Review review = reviewList.get(i);
                review.setUser(purchased.getOrder().getUser());
                review.setProduct(purchased.getVariant().getProduct());
                if (review.getReviewDate().isBefore(purchased.getOrder().getOrderDate())) {
                    review.setReviewDate(purchased.getOrder().getDeliveredAt() != null
                            ? purchased.getOrder().getDeliveredAt().plusDays(1)
                            : purchased.getOrder().getOrderDate().plusDays(4));
                }
            }
        }

        for (StockImportReceipt receipt : receipts.findAll()) {
            BigDecimal subtotal = receipt.getItems().stream()
                    .map(StockImport::getTotalCost).reduce(BigDecimal.ZERO, BigDecimal::add);
            BigDecimal taxable = subtotal.subtract(receipt.getDiscountAmount()).max(BigDecimal.ZERO);
            BigDecimal tax = taxable.multiply(receipt.getTaxRate()).divide(new BigDecimal("100"));
            receipt.setSubtotalAmount(subtotal);
            receipt.setTaxAmount(tax);
            receipt.setTotalAmount(taxable.add(tax).add(receipt.getShippingFee()).add(receipt.getOtherFee()));
        }
    }
}
