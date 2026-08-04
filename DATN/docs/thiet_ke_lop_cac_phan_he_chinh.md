# TÃ€I LIá»†U THIáº¾T Káº¾ Lá»šP CÃC PHÃ‚N Há»† CHÃNH Há»† THá»NG FOXSTYLE
## Dá»± Ã¡n: Há»‡ thá»‘ng ThÆ°Æ¡ng máº¡i Äiá»‡n tá»­ Thá»i trang FoxStyle
**MÃ£ dá»± Ã¡n:** FOXSTYLE-DATN  
**NgÃ y cáº­p nháº­t:** 31/07/2026  
**Tráº¡ng thÃ¡i:** TÃ€I LIá»†U CHÃNH THá»¨C  

---

## Má»¤C Lá»¤C
- [CHÆ¯Æ NG 1: QUY CHUáº¨N MÃ” HÃŒNH HÃ“A THIáº¾T Káº¾ Lá»šP (UML CLASS MODELING STANDARDS)](#chÆ°Æ¡ng-1-quy-chuáº©n-mÃ´-hÃ¬nh-hÃ³a-thiáº¿t-káº¿-lá»›p-uml-class-modeling-standards)
- [CHÆ¯Æ NG 2: THIáº¾T Káº¾ Lá»šP 6 PHÃ‚N Há»† CHÃNH Há»† THá»NG (MERMAID CLASS DIAGRAMS)](#chÆ°Æ¡ng-2-thiáº¿t-káº¿-lá»›p-6-phÃ¢n-há»‡-chÃ­nh-há»‡-thá»‘ng-mermaid-class-diagrams)
  - [2.1. PhÃ¢n há»‡ 1: XÃ¡c thá»±c & Quáº£n lÃ½ TÃ i khoáº£n (Authentication & User Subsystem)](#21-phÃ¢n-há»‡-1-xÃ¡c-thá»±c--quáº£n-lÃ½-tÃ i-khoáº£n-authentication--user-subsystem)
  - [2.2. PhÃ¢n há»‡ 2: Quáº£n lÃ½ Sáº£n pháº©m, Biáº¿n thá»ƒ & Kho (Catalog & Inventory Subsystem)](#22-phÃ¢n-há»‡-2-quáº£n-lÃ½-sáº£n-pháº©m-biáº¿n-thá»ƒ--kho-catalog--inventory-subsystem)
  - [2.3. PhÃ¢n há»‡ 3: Giá» hÃ ng, Äáº·t hÃ ng & MÃ£ giáº£m giÃ¡ (Cart, Order & Promotion Subsystem)](#23-phÃ¢n-há»‡-3-giá»-hÃ ng-Ä‘áº·t-hÃ ng--mÃ£-giáº£m-giÃ¡-cart-order--promotion-subsystem)
  - [2.4. PhÃ¢n há»‡ 4: Thanh toÃ¡n Tá»± Ä‘á»™ng PayOS & Webhook (PayOS Payment Subsystem)](#24-phÃ¢n-há»‡-4-thanh-toÃ¡n-tá»±-Ä‘á»™ng-payos--webhook-payos-payment-subsystem)
  - [2.5. PhÃ¢n há»‡ 5: TÆ°Æ¡ng tÃ¡c KhÃ¡ch hÃ ng & ÄÃ¡nh giÃ¡ (Customer Interaction Subsystem)](#25-phÃ¢n-há»‡-5-tÆ°Æ¡ng-tÃ¡c-khÃ¡ch-hÃ ng--Ä‘Ã¡nh-giÃ¡-customer-interaction-subsystem)
  - [2.6. PhÃ¢n há»‡ 6: Quáº£n trá»‹, Thá»‘ng kÃª & BÃ¡o cÃ¡o (Admin Dashboard & Report Subsystem)](#26-phÃ¢n-há»‡-6-quáº£n-trá»‹-thá»‘ng-kÃª--bÃ¡o-cÃ¡o-admin-dashboard--report-subsystem)
- [CHÆ¯Æ NG 3: Báº¢NG MA TRáº¬N Má»I QUAN Há»† VÃ€ PHá»¤ THUá»˜C NHAU GIá»®A CÃC Lá»šP (CLASS INTER-DEPENDENCY MATRIX)](#chÆ°Æ¡ng-3-báº£ng-ma-tráº­n-má»‘i-quan-há»‡-vÃ -phá»¥-thuá»™c-nhau-giá»¯a-cÃ¡c-lá»›p-class-inter-dependency-matrix)

---

## CHÆ¯Æ NG 1: QUY CHUáº¨N MÃ” HÃŒNH HÃ“A THIáº¾T Káº¾ Lá»šP (UML CLASS MODELING STANDARDS)

### 1.1. CÃ¡c Táº§ng Lá»›p vÃ  Quy Æ°á»›c KÃ½ hiá»‡u UML
MÃ£ nguá»“n Backend Java Spring Boot cá»§a **FoxStyle** Ä‘Æ°á»£c mÃ´ hÃ¬nh hÃ³a theo 4 táº§ng chÃ­nh vá»›i kÃ½ hiá»‡u má»‘i quan há»‡ UML chuáº©n:
- **Association (`-->`):** Má»‘i quan há»‡ gá»i láº«n nhau giá»¯a Controller âž” Service âž” Repository.
- **Realization (`..|>`):** Service Implementation thá»±c thi Service Interface.
- **Composition (`*--`):** Má»‘i quan há»‡ sá»Ÿ há»¯u cháº·t cháº½ (vÃ­ dá»¥: Order sá»Ÿ há»¯u OrderDetail, Cart sá»Ÿ há»¯u CartDetail).
- **Aggregation (`o--`):** Má»‘i quan há»‡ gom tá»¥ Ä‘á»™c láº­p (vÃ­ dá»¥: Product chá»©a ProductVariant, Category chá»©a Product).

---

## CHÆ¯Æ NG 2: THIáº¾T Káº¾ Lá»šP 6 PHÃ‚N Há»† CHÃNH Há»† THá»NG (MERMAID CLASS DIAGRAMS)

### 2.1. PhÃ¢n há»‡ 1: XÃ¡c thá»±c & Quáº£n lÃ½ TÃ i khoáº£n (Authentication & User Subsystem)

PhÃ¢n há»‡ chá»‹u trÃ¡ch nhiá»‡m Ä‘Äƒng kÃ½, Ä‘Äƒng nháº­p Local/Google OAuth2, mÃ£ hÃ³a BCrypt, cáº¥p Token JWT, quáº£n lÃ½ há»“ sÆ¡ vÃ  sá»• Ä‘á»‹a chá»‰ giao hÃ ng (`user_addresses`).

```mermaid
classDiagram
    class AuthController {
        +login(LoginRequest request) ResponseEntity
        +register(RegisterRequest request) ResponseEntity
        +loginGoogle(GoogleLoginRequest request) ResponseEntity
        +forgotPassword(String email) ResponseEntity
    }

    class UserController {
        +getCurrentUser() ResponseEntity
        +updateProfile(UserDto dto) ResponseEntity
        +changePassword(ChangePasswordDto dto) ResponseEntity
        +blockUser(Long userId) ResponseEntity
    }

    class UserAddressController {
        +getAddresses() ResponseEntity
        +addAddress(AddressDto dto) ResponseEntity
        +setDefault(Long addressId) ResponseEntity
    }

    class AuthServiceImpl {
        +authenticateUser(String username, String password) String
        +registerUser(RegisterRequest request) User
        +processGoogleLogin(String googleIdToken) String
    }

    class UserServiceImpl {
        +getUserById(Long id) User
        +updateUserStatus(Long userId, Integer status) void
    }

    class JwtTokenProvider {
        +generateToken(Authentication authentication) String
        +getUsernameFromJwt(String token) String
        +validateToken(String token) boolean
    }

    class UserRepository {
        <<interface>>
        +findByUsername(String username) Optional~User~
        +findByEmail(String email) Optional~User~
        +existsByEmail(String email) boolean
    }

    class RoleRepository {
        <<interface>>
        +findByRoleName(String roleName) Optional~Role~
    }

    class UserAddressRepository {
        <<interface>>
        +findByUserUserId(Long userId) List~UserAddress~
    }

    class User {
        +Long userId
        +String username
        +String password
        +String fullName
        +String email
        +String phone
        +Integer status
        +Role role
        +List~UserAddress~ addresses
    }

    class Role {
        +Long roleId
        +String roleName
        +String description
    }

    class UserAddress {
        +Long addressId
        +String recipientName
        +String phone
        +String province
        +String district
        +String ward
        +String detailAddress
        +Boolean isDefault
    }

    AuthController --> AuthServiceImpl
    UserController --> UserServiceImpl
    UserAddressController --> UserServiceImpl
    AuthServiceImpl --> JwtTokenProvider
    AuthServiceImpl ..> UserRepository
    AuthServiceImpl ..> RoleRepository
    UserServiceImpl ..> UserRepository
    UserServiceImpl ..> UserAddressRepository
    User "1" o-- "1" Role : has
    User "1" *-- "0..*" UserAddress : owns
```

---

### 2.2. PhÃ¢n há»‡ 2: Quáº£n lÃ½ Sáº£n pháº©m, Biáº¿n thá»ƒ & Kho (Catalog & Inventory Subsystem)

PhÃ¢n há»‡ quáº£n lÃ½ thÃ´ng tin sáº£n pháº©m, thÆ°Æ¡ng hiá»‡u, danh má»¥c thá»i trang, bá»™ sÆ°u táº­p áº£nh gÃ³c phá»¥ (`product_images`) vÃ  quáº£n lÃ½ kho chi tiáº¿t theo biáº¿n thá»ƒ Size/MÃ u sáº¯c (`product_variants`).

```mermaid
classDiagram
    class ProductController {
        +getAllProducts(String search, Long categoryId) ResponseEntity
        +getProductById(Long id) ResponseEntity
        +createProduct(ProductDto dto) ResponseEntity
        +updateProduct(Long id, ProductDto dto) ResponseEntity
    }

    class CategoryController {
        +getCategories() ResponseEntity
        +createCategory(CategoryDto dto) ResponseEntity
    }

    class BrandController {
        +getBrands() ResponseEntity
        +createBrand(BrandDto dto) ResponseEntity
    }

    class ProductServiceImpl {
        +filterProducts(ProductFilter filter) Page~Product~
        +getProductDetail(Long id) ProductDetailDto
        +saveProductWithVariants(ProductDto dto) Product
        +checkStock(Long variantId, Integer requestedQty) boolean
        +deductStock(Long variantId, Integer qty) void
    }

    class ProductRepository {
        <<interface>>
        +findByCategoryCategoryId(Long categoryId) List~Product~
        +searchProducts(String keyword) List~Product~
    }

    class ProductVariantRepository {
        <<interface>>
        +findByProductProductIdAndColorAndSize(Long productId, String color, String size) Optional~ProductVariant~
        +findBySku(String sku) Optional~ProductVariant~
    }

    class Product {
        +Long productId
        +String productName
        +BigDecimal price
        +BigDecimal originalPrice
        +String description
        +Category category
        +Brand brand
        +List~ProductVariant~ variants
        +List~ProductImage~ images
    }

    class ProductVariant {
        +Long variantId
        +String color
        +String size
        +Integer quantity
        +String sku
        +BigDecimal priceOverride
    }

    class ProductImage {
        +Long imageId
        +String imageUrl
        +Boolean isPrimary
        +Integer displayOrder
    }

    class Category {
        +Long categoryId
        +String categoryName
        +String description
        +Integer status
    }

    class Brand {
        +Long brandId
        +String brandName
        +String logoUrl
    }

    ProductController --> ProductServiceImpl
    CategoryController --> ProductServiceImpl
    BrandController --> ProductServiceImpl
    ProductServiceImpl ..> ProductRepository
    ProductServiceImpl ..> ProductVariantRepository
    Product "0..*" o-- "1" Category : belongs to
    Product "0..*" o-- "1" Brand : manufactured by
    Product "1" *-- "0..*" ProductVariant : possesses
    Product "1" *-- "0..*" ProductImage : contains
```

---

### 2.3. PhÃ¢n há»‡ 3: Giá» hÃ ng, Äáº·t hÃ ng & MÃ£ giáº£m giÃ¡ (Cart, Order & Promotion Subsystem)

PhÃ¢n há»‡ xá»­ lÃ½ giá» hÃ ng realtime, tÃ­nh toÃ¡n tiá»n hÃ ng, Ã¡p dá»¥ng mÃ£ Coupon giáº£m giÃ¡, khá»Ÿi táº¡o Ä‘Æ¡n hÃ ng `@Transactional` vÃ  quáº£n lÃ½ tiáº¿n trÃ¬nh duyá»‡t váº­n chuyá»ƒn.

```mermaid
classDiagram
    class CartController {
        +getCart() ResponseEntity
        +addToCart(AddToCartRequest request) ResponseEntity
        +updateQuantity(Long cartDetailId, Integer qty) ResponseEntity
        +clearCart() ResponseEntity
    }

    class OrderController {
        +createOrder(OrderRequest request) ResponseEntity
        +getMyOrders() ResponseEntity
        +getOrderById(Long orderId) ResponseEntity
        +updateOrderStatus(Long orderId, String status) ResponseEntity
        +cancelOrder(Long orderId) ResponseEntity
    }

    class CouponController {
        +applyCoupon(String code, BigDecimal orderAmount) ResponseEntity
        +createCoupon(CouponDto dto) ResponseEntity
    }

    class OrderServiceImpl {
        +placeOrder(User user, OrderRequest request) Order
        +cancelOrder(Long orderId, User user) void
        +updateStatus(Long orderId, String status) Order
    }

    class CartServiceImpl {
        +getUserCart(Long userId) Cart
        +addItemToCart(Long userId, Long variantId, Integer qty) Cart
        +clearUserCart(Long userId) void
    }

    class OrderRepository {
        <<interface>>
        +findByUserUserIdOrderByCreatedAtDesc(Long userId) List~Order~
        +findByOrderCode(String code) Optional~Order~
    }

    class CouponRepository {
        <<interface>>
        +findByCode(String code) Optional~Coupon~
    }

    class Order {
        +Long orderId
        +String orderCode
        +BigDecimal totalAmount
        +BigDecimal discountAmount
        +BigDecimal finalAmount
        +String paymentMethod
        +String paymentStatus
        +String status
        +User user
        +UserAddress shippingAddress
        +Coupon coupon
        +List~OrderDetail~ details
    }

    class OrderDetail {
        +Long orderDetailId
        +ProductVariant variant
        +Integer quantity
        +BigDecimal unitPrice
    }

    class Cart {
        +Long cartId
        +User user
        +List~CartDetail~ cartDetails
    }

    class CartDetail {
        +Long cartDetailId
        +ProductVariant variant
        +Integer quantity
    }

    class Coupon {
        +Long couponId
        +String code
        +String discountType
        +BigDecimal discountValue
        +BigDecimal minOrderValue
        +Integer usageLimit
        +Integer usedCount
    }

    CartController --> CartServiceImpl
    OrderController --> OrderServiceImpl
    CouponController --> OrderServiceImpl
    OrderServiceImpl ..> OrderRepository
    OrderServiceImpl ..> CouponRepository
    Order "1" *-- "0..*" OrderDetail : contains
    Cart "1" *-- "0..*" CartDetail : contains
    Order "0..*" o-- "0..1" Coupon : applies
    OrderDetail "0..*" o-- "1" ProductVariant : references
```

---

### 2.4. PhÃ¢n há»‡ 4: Thanh toÃ¡n Tá»± Ä‘á»™ng PayOS & Webhook (PayOS Payment Subsystem)

PhÃ¢n há»‡ tÃ­ch há»£p SDK PayOS, sinh mÃ£ VietQR Code chuyá»ƒn khoáº£n Ä‘á»™ng, kiá»ƒm tra checksum HMAC SHA256 vÃ  nháº­n Webhook callback Ä‘á»‘i soÃ¡t tá»± Ä‘á»™ng.

```mermaid
classDiagram
    class PaymentController {
        +createPayOSPayment(Long orderId) ResponseEntity
        +handlePayOSWebhook(PayOSWebhookData webhookData) ResponseEntity
        +getPaymentHistory(Long orderId) ResponseEntity
    }

    class PaymentServiceImpl {
        +createPaymentLink(Order order) PaymentResponseDto
        +processWebhookData(PayOSWebhookData data) boolean
        +verifySignature(String data, String signature) boolean
        +reconcilePayment(Long paymentId) PaymentReconciliation
    }

    class PayOSClient {
        +createPaymentLink(PaymentData data) CheckoutResponseData
        +verifyPaymentWebhookData(Webhook webhookData) WebhookData
    }

    class PaymentRepository {
        <<interface>>
        +findByOrderOrderId(Long orderId) Optional~Payment~
        +findByTransactionCode(String code) Optional~Payment~
    }

    class PaymentReconciliationRepository {
        <<interface>>
        +findByPaymentPaymentId(Long paymentId) Optional~PaymentReconciliation~
    }

    class Payment {
        +Long paymentId
        +Order order
        +String transactionCode
        +String paymentGateway
        +BigDecimal amount
        +String status
        +LocalDateTime paidAt
    }

    class PaymentReconciliation {
        +Long reconciliationId
        +Payment payment
        +String bankReference
        +BigDecimal reconciledAmount
        +String status
    }

    PaymentController --> PaymentServiceImpl
    PaymentServiceImpl --> PayOSClient
    PaymentServiceImpl ..> PaymentRepository
    PaymentServiceImpl ..> PaymentReconciliationRepository
    Payment "1" -- "1" Order : associated with
    Payment "1" *-- "0..1" PaymentReconciliation : reconciled by
```

---

### 2.5. PhÃ¢n há»‡ 5: TÆ°Æ¡ng tÃ¡c KhÃ¡ch hÃ ng & ÄÃ¡nh giÃ¡ (Customer Interaction Subsystem)

PhÃ¢n há»‡ xá»­ lÃ½ danh sÃ¡ch yÃªu thÃ­ch (Wishlist), Ä‘Ã¡nh giÃ¡ nháº­n xÃ©t cháº¥m 1-5 sao, há»™i thoáº¡i CSkhÃ¡ch hÃ ng (`chat_messages`) vÃ  thÃ´ng bÃ¡o cÃ¡ nhÃ¢n (`notifications`).

```mermaid
classDiagram
    class ReviewController {
        +getProductReviews(Long productId) ResponseEntity
        +addReview(ReviewRequest request) ResponseEntity
    }

    class WishlistController {
        +getWishlist() ResponseEntity
        +toggleWishlist(Long productId) ResponseEntity
    }

    class BannerController {
        +getBanners() ResponseEntity
        +createBanner(BannerDto dto) ResponseEntity
    }

    class ChatController {
        +getChatHistory() ResponseEntity
        +sendMessage(ChatMessageDto dto) ResponseEntity
    }

    class ReviewServiceImpl {
        +addReview(User user, ReviewRequest request) Review
        +canUserReview(User user, Long productId) boolean
    }

    class ReviewRepository {
        <<interface>>
        +findByProductProductIdAndStatus(Long productId, Integer status) List~Review~
    }

    class Review {
        +Long reviewId
        +User user
        +Product product
        +Integer rating
        +String comment
        +Integer status
        +LocalDateTime createdAt
    }

    class Wishlist {
        +Long wishlistId
        +User user
        +Product product
    }

    class ChatMessage {
        +Long messageId
        +User sender
        +User receiver
        +String messageText
        +LocalDateTime sentAt
    }

    ReviewController --> ReviewServiceImpl
    ReviewServiceImpl ..> ReviewRepository
    Review "0..*" o-- "1" User : written by
    Review "0..*" o-- "1" Product : evaluates
    Wishlist "0..*" o-- "1" User : saved by
    Wishlist "0..*" o-- "1" Product : targets
    ChatMessage "0..*" o-- "1" User : sent by
```

---

### 2.6. PhÃ¢n há»‡ 6: Quáº£n trá»‹, Thá»‘ng kÃª & BÃ¡o cÃ¡o (Admin Dashboard & Report Subsystem)

PhÃ¢n há»‡ há»— trá»£ Quáº£n trá»‹ viÃªn xem biá»ƒu Ä‘á»“ thá»‘ng kÃª doanh thu Recharts, lá»‹ch sá»­ thay Ä‘á»•i giÃ¡ (`product_price_audit_logs`), nháº­t kÃ½ kiá»ƒm toÃ¡n (`security_events`) vÃ  cáº¥u hÃ¬nh há»‡ thá»‘ng (`settings`).

```mermaid
classDiagram
    class FinanceReportController {
        +getRevenueReport(String period) ResponseEntity
        +getTopSellingProducts() ResponseEntity
    }

    class SettingController {
        +getSettings() ResponseEntity
        +updateSetting(SettingDto dto) ResponseEntity
    }

    class ReportServiceImpl {
        +calculateRevenue(LocalDateTime startDate, LocalDateTime endDate) RevenueReportDto
        +getTopProducts(Integer limit) List~TopProductDto~
    }

    class AuditLogRepository {
        <<interface>>
        +findByChangedAtBetween(LocalDateTime start, LocalDateTime end) List~ProductPriceAuditLog~
    }

    class SecurityEventRepository {
        <<interface>>
        +findByUserUserId(Long userId) List~SecurityEvent~
    }

    class ProductPriceAuditLog {
        +Long logId
        +Product product
        +BigDecimal oldPrice
        +BigDecimal newPrice
        +User changedBy
        +LocalDateTime changedAt
    }

    class SecurityEvent {
        +Long eventId
        +User user
        +String eventType
        +String ipAddress
        +LocalDateTime createdAt
    }

    class Setting {
        +String settingKey
        +String settingValue
        +String description
    }

    FinanceReportController --> ReportServiceImpl
    ReportServiceImpl ..> AuditLogRepository
    ReportServiceImpl ..> SecurityEventRepository
```

---

## CHÆ¯Æ NG 3: Báº¢NG MA TRáº¬N Má»I QUAN Há»† VÃ€ PHá»¤ THUá»˜C NHAU GIá»®A CÃC Lá»šP (CLASS INTER-DEPENDENCY MATRIX)

| Lá»›p gá»i (Caller Class) | Lá»›p phá»¥ thuá»™c (Dependent Class) | Má»¥c Ä‘Ã­ch TÆ°Æ¡ng tÃ¡c / Phá»¥ thuá»™c | Kiá»ƒu Má»‘i quan há»‡ UML |
|---|---|---|---|
| `AuthController` | `AuthServiceImpl`, `JwtTokenProvider` | ÄÄƒng nháº­p, bÄƒm máº­t kháº©u, sinh JWT Token | Association (`-->`) |
| `OrderServiceImpl` | `ProductVariantRepository`, `PayOSClient` | Kiá»ƒm tra/trá»« kho biáº¿n thá»ƒ vÃ  khá»Ÿi táº¡o VietQR Link | Association (`-->`) |
| `PaymentServiceImpl` | `PayOSClient`, `OrderRepository` | XÃ¡c minh Webhook signature & Cáº­p nháº­t `PAID` | Association (`-->`) |
| `Order` | `User`, `UserAddress`, `Coupon`, `OrderDetail` | Äá»‘i tÆ°á»£ng ÄÆ¡n hÃ ng chá»©a Ä‘á»‹a chá»‰, coupon & mÃ³n | Composition / Aggregation |
| `Product` | `Category`, `Brand`, `ProductVariant`, `ProductImage` | Äá»‘i tÆ°á»£ng Sáº£n pháº©m chá»©a danh má»¥c & cÃ¡c biáº¿n thá»ƒ | Composition / Aggregation |
| `Cart` | `User`, `CartDetail` | Giá» hÃ ng sá»Ÿ há»¯u cÃ¡c má»¥c máº·t hÃ ng giá» | Composition (`*--`) |

---

## Lá»œI Káº¾T & LIÃŠN Káº¾T TÃ€I LIá»†U

TÃ i liá»‡u **Thiáº¿t káº¿ Lá»›p cÃ¡c PhÃ¢n há»‡ chÃ­nh Há»‡ thá»‘ng FoxStyle** Ä‘Ã£ chi tiáº¿t hÃ³a kiáº¿n trÃºc HÆ°á»›ng Ä‘á»‘i tÆ°á»£ng (OOP) cho 6 phÃ¢n há»‡ cá»‘t lÃµi.

TÃ i liá»‡u nÃ y Ä‘Æ°á»£c Ä‘á»“ng bá»™ liÃªn káº¿t vá»›i:
- [Äáº·c táº£ YÃªu cáº§u Há»‡ thá»‘ng SRS](./yeu_cau_he_thong.md)
- [SÆ¡ Ä‘á»“ Use Case & Sequence Diagrams](./so_do_use_case.md)
- [Äáº·c táº£ Chi tiáº¿t 20 Ca sá»­ dá»¥ng](./dac_ta_use_case_chi_tiet.md)
- [Ma tráº­n Ãnh xáº¡ Use Case & Actor](./use_case_actor_mapping.md)
- [BÃ¡o cÃ¡o MÃ´ táº£ Chi tiáº¿t CÆ¡ sá»Ÿ Dá»¯ liá»‡u 43 Báº£ng](./BAO_CAO_MO_TA_CSDL_FOXSTYLE.md)
- [Thiáº¿t káº¿ CÆ¡ sá»Ÿ Dá»¯ liá»‡u 43 Báº£ng (Database Design)](./thiet_ke_co_so_du_lieu.md)
- [Thiáº¿t káº¿ Lá»›p MÃ£ nguá»“n Java (Class Diagrams)](./thiet_ke_lop_class_diagrams.md)
- [Thiáº¿t káº¿ Cáº¥u trÃºc Pháº§n má»m (Software Architecture)](./thiet_ke_cau_truc_phan_mem.md)
- [Thiáº¿t káº¿ Háº¡ táº§ng Máº¡ng & ChÃ­nh sÃ¡ch Há»‡ thá»‘ng](./thiet_ke_ha_tang_mang_va_chinh_sach.md)
