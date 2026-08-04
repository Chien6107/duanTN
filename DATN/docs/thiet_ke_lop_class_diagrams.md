# TÃ€I LIá»†U THIáº¾T Káº¾ Lá»šP MÃƒ NGUá»’N (UML CLASS DIAGRAM SPECIFICATION)
## Dá»± Ã¡n: Há»‡ thá»‘ng ThÆ°Æ¡ng máº¡i Äiá»‡n tá»­ Thá»i trang FoxStyle
**MÃ£ dá»± Ã¡n:** FOXSTYLE-DATN  
**NgÃ y cáº­p nháº­t:** 31/07/2026  
**Tráº¡ng thÃ¡i:** TÃ€I LIá»†U CHÃNH THá»¨C  

---

## Má»¤C Lá»¤C
- [CHÆ¯Æ NG 1: Tá»”NG QUAN KIáº¾N TRÃšC PHÃ‚N Táº¦NG Lá»šP (LAYERED CLASS ARCHITECTURE)](#chÆ°Æ¡ng-1-tá»•ng-quan-kiáº¿n-trÃºc-phÃ¢n-táº§ng-lá»›p-layered-class-architecture)
  - [1.1. CÃ¡c Táº§ng Lá»›p MÃ£ nguá»“n (Layered Architecture Breakdown)](#11-cÃ¡c-táº§ng-lá»›p-mÃ£-nguá»“n-layered-architecture-breakdown)
  - [1.2. SÆ¡ Ä‘á»“ Kiáº¿n trÃºc PhÃ¢n táº§ng Lá»›p Tá»•ng thá»ƒ](#12-sÆ¡-Ä‘á»“-kiáº¿n-trÃºc-phÃ¢n-táº§ng-lá»›p-tá»•ng-thá»ƒ)
- [CHÆ¯Æ NG 2: SÆ  Äá»’ Lá»šP CHI TIáº¾T THEO CÃC PHÃ‚N Há»† NGHIá»†P Vá»¤ (MERMAID CLASS DIAGRAMS)](#chÆ°Æ¡ng-2-sÆ¡-Ä‘á»“-lá»›p-chi-tiáº¿t-theo-cÃ¡c-phÃ¢n-há»‡-nghiá»‡p-vá»¥-mermaid-class-diagrams)
  - [2.1. PhÃ¢n há»‡ XÃ¡c thá»±c & Quáº£n lÃ½ NgÆ°á»i dÃ¹ng (Auth & User Domain)](#21-phÃ¢n-há»‡-xÃ¡c-thá»±c--quáº£n-lÃ½-ngÆ°á»i-dÃ¹ng-auth--user-domain)
  - [2.2. PhÃ¢n há»‡ Quáº£n lÃ½ Sáº£n pháº©m, Biáº¿n thá»ƒ & Danh má»¥c (Product Domain)](#22-phÃ¢n-há»‡-quáº£n-lÃ½-sáº£n-pháº©m-biáº¿n-thá»ƒ--danh-má»¥c-product-domain)
  - [2.3. PhÃ¢n há»‡ Giá» hÃ ng, Äáº·t hÃ ng & MÃ£ giáº£m giÃ¡ (Order & Cart Domain)](#23-phÃ¢n-há»‡-giá»-hÃ ng-Ä‘áº·t-hÃ ng--mÃ£-giáº£m-giÃ¡-order--cart-domain)
  - [2.4. PhÃ¢n há»‡ Thanh toÃ¡n PayOS & Webhook (Payment Domain)](#24-phÃ¢n-há»‡-thanh-toÃ¡n-payos--webhook-payment-domain)
  - [2.5. PhÃ¢n há»‡ TÆ°Æ¡ng tÃ¡c KhÃ¡ch hÃ ng & ÄÃ¡nh giÃ¡ (Interaction Domain)](#25-phÃ¢n-há»‡-tÆ°Æ¡ng-tÃ¡c-khÃ¡ch-hÃ ng--Ä‘Ã¡nh-giÃ¡-interaction-domain)
- [CHÆ¯Æ NG 3: Äáº¶C Táº¢ CHI TIáº¾T THUá»˜C TÃNH VÃ€ PHÆ¯Æ NG THá»¨C CÃC Lá»šP TRá»ŒNG TÃ‚M](#chÆ°Æ¡ng-3-Ä‘áº·c-táº£-chi-tiáº¿t-thuá»™c-tÃ­nh-vÃ -phÆ°Æ¡ng-thá»©c-cÃ¡c-lá»›p-trá»ng-tÃ¢m)
  - [3.1. CÃ¡c Lá»›p Controller (REST API Endpoints)](#31-cÃ¡c-lá»›p-controller-rest-api-endpoints)
  - [3.2. CÃ¡c Lá»›p Service (Business Logic)](#32-cÃ¡c-lá»›p-service-business-logic)
  - [3.3. CÃ¡c Lá»›p Repository (Data Access Object - DAO)](#33-cÃ¡c-lá»›p-repository-data-access-object---dao)

---

## CHÆ¯Æ NG 1: Tá»”NG QUAN KIáº¾N TRÃšC PHÃ‚N Táº¦NG Lá»šP (LAYERED CLASS ARCHITECTURE)

### 1.1. CÃ¡c Táº§ng Lá»›p MÃ£ nguá»“n (Layered Architecture Breakdown)

MÃ£ nguá»“n Backend há»‡ thá»‘ng **FoxStyle** Ä‘Æ°á»£c xÃ¢y dá»±ng trÃªn ná»n táº£ng **Java 17 / Spring Boot 3.2.5** theo mÃ´ hÃ¬nh thiáº¿t káº¿ chuáº©n **Layered Architecture (Kiáº¿n trÃºc phÃ¢n táº§ng)** káº¿t há»£p vá»›i mÃ´t hÃ¬nh **Repository - Service - Controller Pattern**:

```
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ 1. PRESENTATION LAYER (RESTful Controllers)                            â”‚
â”‚    - Tiáº¿p nháº­n HTTP Request, Validate DTOs, tráº£ vá» ResponseEntity JSON â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                    â”‚ Calls Services
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ 2. BUSINESS SERVICE LAYER (Services & Implementation)                  â”‚
â”‚    - Thá»±c thi Business Rules, Transaction (@Transactional), PayOS API  â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                    â”‚ Calls Repositories
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ 3. DATA ACCESS LAYER (JPA Repositories)                                â”‚
â”‚    - Káº¿ thá»«a JpaRepository<T, ID>, thá»±c hiá»‡n truy váº¥n MS SQL Server    â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”¬â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
                                    â”‚ Maps Entities
â”Œâ”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â–¼â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”
â”‚ 4. DOMAIN / ENTITY LAYER (JPA Entities & DTOs)                         â”‚
â”‚    - Khai bÃ¡o Object Model Ã¡nh xáº¡ 1-1 vá»›i CSDL SQL Server              â”‚
â””â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”˜
```

1. **Presentation Layer (`com.foxstyle.api.controller`):**
   - Gá»“m 18 REST Controllers: `AuthController`, `ProductController`, `OrderController`, `CartController`, `PaymentController`, `CouponController`, `UserController`...
   - Sá»­ dá»¥ng `@RestController`, `@RequestMapping`, `@CrossOrigin` vÃ  `@PreAuthorize`.

2. **Business Service Layer (`com.foxstyle.api.service`):**
   - Gá»“m cÃ¡c Interface Service vÃ  Service Implementations: `AuthService`, `ProductService`, `OrderService`, `CartService`, `PaymentService`, `CouponService`...
   - Xá»­ lÃ½ kiá»ƒm tra tá»“n kho biáº¿n thá»ƒ, tÃ­nh tiá»n coupon, gá»i Webhook PayOS, gá»­i Email OTP báº¥t Ä‘á»“ng bá»™ (`@Async`).

3. **Data Access Layer (`com.foxstyle.api.repository`):**
   - Gá»“m 30 JPA Repositories káº¿ thá»«a `JpaRepository<T, ID>`: `UserRepository`, `ProductRepository`, `ProductVariantRepository`, `OrderRepository`, `CartRepository`...

4. **Domain & Entity Layer (`com.foxstyle.api.entity` & `com.foxstyle.api.dto`):**
   - Gá»“m 30 JPA Entities Ã¡nh xáº¡ CSDL vÃ  bá»™ Ä‘á»‘i tÆ°á»£ng Data Transfer Objects (DTO) mÃ£ hÃ³a trao Ä‘á»•i dá»¯ liá»‡u.

---

### 1.2. SÆ¡ Ä‘á»“ Kiáº¿n trÃºc PhÃ¢n táº§ng Lá»›p Tá»•ng thá»ƒ

```mermaid
graph TD
    subgraph Presentation Layer
        AuthController[AuthController]
        ProductController[ProductController]
        OrderController[OrderController]
        PaymentController[PaymentController]
    end

    subgraph Service Layer
        AuthService[AuthService]
        ProductService[ProductService]
        OrderService[OrderService]
        PaymentService[PaymentService]
        PayOSService[PayOSService Integration]
    end

    subgraph Repository Layer
        UserRepository[(UserRepository)]
        ProductRepository[(ProductRepository)]
        VariantRepository[(ProductVariantRepository)]
        OrderRepository[(OrderRepository)]
        PaymentRepository[(PaymentRepository)]
    end

    subgraph Entity Model Layer
        User[User Entity]
        Product[Product Entity]
        Variant[ProductVariant Entity]
        Order[Order Entity]
        Payment[Payment Entity]
    end

    %% Calls
    AuthController --> AuthService
    ProductController --> ProductService
    OrderController --> OrderService
    PaymentController --> PaymentService

    AuthService --> UserRepository
    ProductService --> ProductRepository
    ProductService --> VariantRepository
    OrderService --> OrderRepository
    OrderService --> VariantRepository
    OrderService --> PayOSService
    PaymentService --> PaymentRepository

    UserRepository --> User
    ProductRepository --> Product
    VariantRepository --> Variant
    OrderRepository --> Order
    PaymentRepository --> Payment
```

---

## CHÆ¯Æ NG 2: SÆ  Äá»’ Lá»šP CHI TIáº¾T THEO CÃC PHÃ‚N Há»† NGHIá»†P Vá»¤ (MERMAID CLASS DIAGRAMS)

### 2.1. PhÃ¢n há»‡ XÃ¡c thá»±c & Quáº£n lÃ½ NgÆ°á»i dÃ¹ng (Auth & User Domain)

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

    class AuthService {
        <<interface>>
        +authenticateUser(String username, String password) String
        +registerUser(RegisterRequest request) User
        +processGoogleLogin(String googleIdToken) String
    }

    class UserService {
        <<interface>>
        +getUserById(Long id) User
        +updateUserStatus(Long userId, Integer status) void
    }

    class UserRepository {
        <<interface>>
        +findByUsername(String username) Optional~User~
        +findByEmail(String email) Optional~User~
        +existsByEmail(String email) boolean
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

    AuthController --> AuthService
    UserController --> UserService
    UserAddressController --> UserService
    AuthService ..> UserRepository
    UserService ..> UserRepository
    User "1" -- "1" Role : has
    User "1" -- "0..*" UserAddress : owns
```

---

### 2.2. PhÃ¢n há»‡ Quáº£n lÃ½ Sáº£n pháº©m, Biáº¿n thá»ƒ & Danh má»¥c (Product Domain)

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

    class ProductService {
        <<interface>>
        +filterProducts(ProductFilter filter) Page~Product~
        +getProductDetail(Long id) ProductDetailDto
        +saveProductWithVariants(ProductDto dto) Product
        +checkStock(Long variantId, Integer requestedQty) boolean
    }

    class ProductRepository {
        <<interface>>
        +findByCategoryCategoryId(Long categoryId) List~Product~
        +searchProducts(String keyword) List~Product~
    }

    class ProductVariantRepository {
        <<interface>>
        +findByProductProductIdAndColorAndSize(Long productId, String color, String size) Optional~ProductVariant~
    }

    class Product {
        +Long productId
        +String productName
        +BigDecimal price
        +BigDecimal originalPrice
        +String description
        +Category category
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

    ProductController --> ProductService
    CategoryController --> ProductService
    ProductService ..> ProductRepository
    ProductService ..> ProductVariantRepository
    Product "1" -- "1" Category : belongs to
    Product "1" -- "0..*" ProductVariant : has
    Product "1" -- "0..*" ProductImage : contains
```

---

### 2.3. PhÃ¢n há»‡ Giá» hÃ ng, Äáº·t hÃ ng & MÃ£ giáº£m giÃ¡ (Order & Cart Domain)

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

    class OrderService {
        <<interface>>
        +placeOrder(User user, OrderRequest request) Order
        +cancelOrder(Long orderId, User user) void
        +updateStatus(Long orderId, OrderStatus status) Order
    }

    class CartService {
        <<interface>>
        +getUserCart(Long userId) Cart
        +addItemToCart(Long userId, Long variantId, Integer qty) Cart
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

    CartController --> CartService
    OrderController --> OrderService
    CouponController --> OrderService
    OrderService ..> Order : manages
    CartService ..> Cart : manages
    Order "1" -- "0..*" OrderDetail : contains
    Cart "1" -- "0..*" CartDetail : contains
    Order "0..*" -- "0..1" Coupon : applies
    OrderDetail "0..*" -- "1" ProductVariant : references
```

---

### 2.4. PhÃ¢n há»‡ Thanh toÃ¡n PayOS & Webhook (Payment Domain)

```mermaid
classDiagram
    class PaymentController {
        +createPayOSPayment(Long orderId) ResponseEntity
        +handlePayOSWebhook(PayOSWebhookData webhookData) ResponseEntity
        +getPaymentHistory(Long orderId) ResponseEntity
    }

    class PaymentService {
        <<interface>>
        +createPaymentLink(Order order) PaymentResponseDto
        +processWebhookData(PayOSWebhookData data) boolean
        +verifySignature(String data, String signature) boolean
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

    PaymentController --> PaymentService
    PaymentService --> PayOSClient
    PaymentService ..> PaymentRepository
    Payment "1" -- "1" Order : associated with
    Payment "1" -- "0..1" PaymentReconciliation : reconciled by
```

---

### 2.5. PhÃ¢n há»‡ TÆ°Æ¡ng tÃ¡c KhÃ¡ch hÃ ng & ÄÃ¡nh giÃ¡ (Interaction Domain)

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

    class ReviewService {
        <<interface>>
        +addReview(User user, ReviewRequest request) Review
        +canUserReview(User user, Long productId) boolean
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

    class Banner {
        +Long bannerId
        +String title
        +String imageUrl
        +String linkUrl
        +Integer displayOrder
    }

    ReviewController --> ReviewService
    WishlistController --> ReviewService
    Review "0..*" -- "1" User : written by
    Review "0..*" -- "1" Product : evaluates
    Wishlist "0..*" -- "1" User : saved by
    Wishlist "0..*" -- "1" Product : targets
```

---

## CHÆ¯Æ NG 3: Äáº¶C Táº¢ CHI TIáº¾T THUá»˜C TÃNH VÃ€ PHÆ¯Æ NG THá»¨C CÃC Lá»šP TRá»ŒNG TÃ‚M

### 3.1. Äáº·c táº£ cÃ¡c Lá»›p Controller Trá»ng tÃ¢m

| TÃªn Lá»›p (Controller) | ÄÆ°á»ng dáº«n `@RequestMapping` | CÃ¡c PhÆ°Æ¡ng thá»©c ChÃ­nh | Vai trÃ² & An ninh |
|---|---|---|---|
| **`AuthController`** | `/api/v1/auth` | `login()`, `register()`, `loginGoogle()`, `forgotPassword()` | CÃ´ng khai (Public Access), Tráº£ vá» JWT Token |
| **`ProductController`** | `/api/v1/products` | `getAllProducts()`, `getProductById()`, `createProduct()`, `updateProduct()` | Xem cÃ´ng khai. Táº¡o/Sá»­a yÃªu cáº§u `ROLE_ADMIN` |
| **`OrderController`** | `/api/v1/orders` | `createOrder()`, `getMyOrders()`, `updateOrderStatus()`, `cancelOrder()` | Äáº·t/Xem Ä‘Æ¡n: `ROLE_CUSTOMER`. Duyá»‡t Ä‘Æ¡n: `ROLE_STAFF`/`ROLE_ADMIN` |
| **`PaymentController`** | `/api/v1/payments` | `createPayOSPayment()`, `handlePayOSWebhook()` | Webhook endpoint cÃ´ng khai (Verify Checksum Signature) |
| **`CartController`** | `/api/v1/cart` | `getCart()`, `addToCart()`, `updateQuantity()`, `clearCart()` | YÃªu cáº§u Ä‘Äƒng nháº­p `ROLE_CUSTOMER` |

---

### 3.2. Äáº·c táº£ cÃ¡c Lá»›p Service Trá»ng tÃ¢m

#### 1. Lá»›p `OrderServiceImpl.java`
- **`placeOrder(User user, OrderRequest request)`:**
  - Má»Ÿ Transaction `@Transactional`.
  - Kiá»ƒm tra sá»‘ lÆ°á»£ng tá»“n kho kháº£ dá»¥ng cá»§a tá»«ng biáº¿n thá»ƒ (`product_variants.quantity`).
  - Trá»« kho táº¡m thá»i. TÃ­nh tiá»n coupon giáº£m giÃ¡ (náº¿u cÃ³).
  - Khá»Ÿi táº¡o Ä‘Æ¡n hÃ ng `orders` vá»›i tráº¡ng thÃ¡i `PENDING`.
- **`cancelOrder(Long orderId, User user)`:**
  - Kiá»ƒm tra Ä‘Æ¡n hÃ ng cÃ³ á»Ÿ tráº¡ng thÃ¡i `PENDING` hay khÃ´ng.
  - Cáº­p nháº­t tráº¡ng thÃ¡i Ä‘Æ¡n thÃ nh `CANCELLED`.
  - Cá»™ng hoÃ n láº¡i sá»‘ lÆ°á»£ng tá»“n kho cho cÃ¡c biáº¿n thá»ƒ trong Ä‘Æ¡n.

#### 2. Lá»›p `PaymentServiceImpl.java`
- **`createPaymentLink(Order order)`:**
  - Khá»Ÿi táº¡o Ä‘á»‘i tÆ°á»£ng `PaymentData` chá»©a mÃ£ Ä‘Æ¡n hÃ ng, sá»‘ tiá»n vÃ  ná»™i dung chuyá»ƒn khoáº£n.
  - Gá»i SDK PayOS client táº¡o link QR Code VietQR.
- **`processWebhookData(PayOSWebhookData data)`:**
  - BÄƒm mÃ£ hÃ³a kiá»ƒm tra chá»¯ kÃ½ `HMAC SHA256 Signature`.
  - Náº¿u há»£p lá»‡ âž” Cáº­p nháº­t `payment_status = PAID` vÃ  `orders.status = PROCESSING`.

---

### 3.3. Äáº·c táº£ cÃ¡c Lá»›p Repository Trá»ng tÃ¢m

| TÃªn JPA Repository | Entity Ä‘i kÃ¨m | CÃ¡c PhÆ°Æ¡ng thá»©c Custom Query ChÃ­nh |
|---|---|---|
| **`UserRepository`** | `User` | `findByUsername()`, `findByEmail()`, `existsByEmail()` |
| **`ProductRepository`** | `Product` | `findByCategoryCategoryId()`, `searchProducts(String keyword)` |
| **`ProductVariantRepository`** | `ProductVariant` | `findByProductProductIdAndColorAndSize()`, `findBySku()` |
| **`OrderRepository`** | `Order` | `findByUserUserIdOrderByCreatedAtDesc()`, `findByStatus()` |
| **`PaymentRepository`** | `Payment` | `findByOrderOrderId()`, `findByTransactionCode()` |

---

## Lá»œI Káº¾T & LIÃŠN Káº¾T TÃ€I LIá»†U

TÃ i liá»‡u **Thiáº¿t káº¿ Lá»›p MÃ£ nguá»“n (UML Class Diagram Specification)** cung cáº¥p bá»©c tranh chi tiáº¿t vá» cáº¥u trÃºc mÃ£ nguá»“n Backend Java Spring Boot cá»§a dá»± Ã¡n FoxStyle.

TÃ i liá»‡u nÃ y Ä‘Æ°á»£c Ä‘á»“ng bá»™ liÃªn káº¿t vá»›i:
- [Äáº·c táº£ YÃªu cáº§u Há»‡ thá»‘ng SRS](./yeu_cau_he_thong.md)
- [SÆ¡ Ä‘á»“ & Äáº·c táº£ Ca sá»­ dá»¥ng Use Case](./so_do_use_case.md)
- [MÃ´ táº£ Chi tiáº¿t CÃ¡c Chá»©c nÄƒng Há»‡ thá»‘ng](./mo_ta_chi_tiet_chuc_nang.md)
- [BÃ¡o cÃ¡o MÃ´ táº£ Chi tiáº¿t CÆ¡ sá»Ÿ Dá»¯ liá»‡u](./BAO_CAO_MO_TA_CSDL_FOXSTYLE.md)
- [Thiáº¿t káº¿ Háº¡ táº§ng Máº¡ng & ChÃ­nh sÃ¡ch Há»‡ thá»‘ng](./thiet_ke_ha_tang_mang_va_chinh_sach.md)
