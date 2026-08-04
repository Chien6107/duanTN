# TÃ€I LIá»†U THIáº¾T Káº¾ SÆ  Äá»’ TUáº¦N Tá»° (UML SEQUENCE DIAGRAM SPECIFICATION)
## Dá»± Ã¡n: Há»‡ thá»‘ng ThÆ°Æ¡ng máº¡i Äiá»‡n tá»­ Thá»i trang FoxStyle
**MÃ£ dá»± Ã¡n:** FOXSTYLE-DATN  
**NgÃ y cáº­p nháº­t:** 31/07/2026  
**Tráº¡ng thÃ¡i:** TÃ€I LIá»†U CHÃNH THá»¨C  

---

## Má»¤C Lá»¤C
- [CHÆ¯Æ NG 1: QUY CHUáº¨N NGUYÃŠN Táº®C MÃ” HÃŒNH HÃ“A SÆ  Äá»’ TUáº¦N Tá»°](#chÆ°Æ¡ng-1-quy-chuáº©n-nguyÃªn-táº¯c-mÃ´-hÃ¬nh-hÃ³a-sÆ¡-Ä‘á»“-tuáº§n-tá»±)
- [CHÆ¯Æ NG 2: Bá»˜ 10 SÆ  Äá»’ TUáº¦N Tá»° TRá»ŒNG TÃ‚M CÃC LUá»’NG NGHIá»†P Vá»¤ (MERMAID SEQUENCE DIAGRAMS)](#chÆ°Æ¡ng-2-bá»™-10-sÆ¡-Ä‘á»“-tuáº§n-tá»±-trá»ng-tÃ¢m-cÃ¡c-luá»“ng-nghiá»‡p-vá»¥-mermaid-sequence-diagrams)
  - [SD-01: SÆ¡ Ä‘á»“ Tuáº§n tá»± ÄÄƒng kÃ½ TÃ i khoáº£n KhÃ¡ch hÃ ng Má»›i (Local Register)](#sd-01-sÆ¡-Ä‘á»“-tuáº§n-tá»±-Ä‘Äƒng-kÃ½-tÃ i-khoáº£n-khÃ¡ch-hÃ ng-má»›i-local-register)
  - [SD-02: SÆ¡ Ä‘á»“ Tuáº§n tá»± ÄÄƒng nháº­p Ná»™i bá»™ & Cáº¥p mÃ£ JWT Token](#sd-02-sÆ¡-Ä‘á»“-tuáº§n-tá»±-Ä‘Äƒng-nháº­p-ná»™i-bá»™--cáº¥p-mÃ£-jwt-token)
  - [SD-03: SÆ¡ Ä‘á»“ Tuáº§n tá»± ÄÄƒng nháº­p Nhanh vá»›i Google OAuth2 (SSO)](#sd-03-sÆ¡-Ä‘á»“-tuáº§n-tá»±-Ä‘Äƒng-nháº­p-nhanh-vá»›i-google-oauth2-sso)
  - [SD-04: SÆ¡ Ä‘á»“ Tuáº§n tá»± KhÃ´i phá»¥c Máº­t kháº©u qua Email OTP 6 Sá»‘](#sd-04-sÆ¡-Ä‘á»“-tuáº§n-tá»±-khÃ´i-phá»¥c-máº­t-kháº©u-qua-email-otp-6-sá»‘)
  - [SD-05: SÆ¡ Ä‘á»“ Tuáº§n tá»± Lá»c & TÃ¬m kiáº¿m Sáº£n pháº©m Äa tiÃªu chÃ­](#sd-05-sÆ¡-Ä‘á»“-tuáº§n-tá»±-lá»c--tÃ¬m-kiáº¿m-sáº£n-pháº©m-Ä‘a-tiÃªu-chÃ­)
  - [SD-06: SÆ¡ Ä‘á»“ Tuáº§n tá»± Chá»n Biáº¿n thá»ƒ (Size/MÃ u) & ThÃªm vÃ o Giá» hÃ ng](#sd-06-sÆ¡-Ä‘á»“-tuáº§n-tá»±-chá»n-biáº¿n-thá»ƒ-sizemÃ u--thÃªm-vÃ o-giá»-hÃ ng)
  - [SD-07: SÆ¡ Ä‘á»“ Tuáº§n tá»± Äáº·t hÃ ng & Thanh toÃ¡n Tá»± Ä‘á»™ng PayOS QR Code](#sd-07-sÆ¡-Ä‘á»“-tuáº§n-tá»±-Ä‘áº·t-hÃ ng--thanh-toÃ¡n-tá»±-Ä‘á»™ng-payos-qr-code)
  - [SD-08: SÆ¡ Ä‘á»“ Tuáº§n tá»± Há»§y ÄÆ¡n hÃ ng & HoÃ n tráº£ Sá»‘ lÆ°á»£ng Tá»“n kho](#sd-08-sÆ¡-Ä‘á»“-tuáº§n-tá»±-há»§y-Ä‘Æ¡n-hÃ ng--hoÃ n-tráº£-sá»‘-lÆ°á»£ng-tá»“n-kho)
  - [SD-09: SÆ¡ Ä‘á»“ Tuáº§n tá»± Admin ThÃªm Sáº£n pháº©m kÃ¨m áº¢nh phá»¥ & Biáº¿n thá»ƒ Kho](#sd-09-sÆ¡-Ä‘á»“-tuáº§n-tá»±-admin-thÃªm-sáº£n-pháº©m-kÃ¨m-áº£nh-phá»¥--biáº¿n-thá»ƒ-kho)
  - [SD-10: SÆ¡ Ä‘á»“ Tuáº§n tá»± Duyá»‡t & Cáº­p nháº­t Tiáº¿n trÃ¬nh Váº­n chuyá»ƒn ÄÆ¡n hÃ ng](#sd-10-sÆ¡-Ä‘á»“-tuáº§n-tá»±-duyá»‡t--cáº­p-nhat-tiáº¿n-trÃ¬nh-váº­n-chuyá»ƒn-Ä‘Æ¡n-hÃ ng)

---

## CHÆ¯Æ NG 1: QUY CHUáº¨N NGUYÃŠN Táº®C MÃ” HÃŒNH HÃ“A SÆ  Äá»’ TUáº¦N Tá»°

SÆ¡ Ä‘á»“ tuáº§n tá»± (Sequence Diagram) thá»ƒ hiá»‡n thá»© tá»± luÃ¢n chuyá»ƒn thÃ´ng Ä‘iá»‡p (Messages) theo thá»i gian giá»¯a cÃ¡c Ä‘á»‘i tÆ°á»£ng trong há»‡ thá»‘ng:
- **Lifelines (ÄÆ°á»ng sá»‘ng Ä‘á»‘i tÆ°á»£ng):** `Actor` âž” `React Frontend` âž” `Spring Security Filter` âž” `REST Controller` âž” `Service Implementation` âž” `JPA Repository` âž” `MS SQL Server` âž” `External Services (PayOS / Google / SMTP)`.
- **Synchronous Messages (`->>`):** ThÃ´ng Ä‘iá»‡p gá»i Ä‘á»“ng bá»™ yÃªu cáº§u chá» pháº£n há»“i.
- **Asynchronous Messages (`-->>`):** ThÃ´ng Ä‘iá»‡p gá»­i báº¥t Ä‘á»“ng bá»™ qua `@Async` ThreadPool.
- **Alt / Opt Blocks:** Thá»ƒ hiá»‡n luá»“ng ráº½ nhÃ¡nh Ä‘iá»u kiá»‡n vÃ  luá»“ng ngoáº¡i lá»‡.

---

## CHÆ¯Æ NG 2: Bá»˜ 10 SÆ  Äá»’ TUáº¦N Tá»° TRá»ŒNG TÃ‚M CÃC LUá»’NG NGHIá»†P Vá»¤ (MERMAID SEQUENCE DIAGRAMS)

### SD-01: SÆ¡ Ä‘á»“ Tuáº§n tá»± ÄÄƒng kÃ½ TÃ i khoáº£n KhÃ¡ch hÃ ng Má»›i (Local Register)

```mermaid
sequenceDiagram
    autonumber
    actor Guest as KhÃ¡ch vÃ£ng lai
    participant FE as React Frontend
    participant Filter as Security Filter Chain
    participant AuthCtrl as AuthController
    participant AuthSvc as AuthServiceImpl
    participant UserRepo as UserRepository
    participant DB as MS SQL Server

    Guest->>FE: Nháº­p Form ÄÄƒng kÃ½ (Username, Email, Pass, FullName)
    FE->>FE: Client-side Validation
    FE->>Filter: POST /api/v1/auth/register (RegisterRequest DTO)
    Filter->>AuthCtrl: Pass Filter (Public PermitAll)
    AuthCtrl->>AuthSvc: registerUser(RegisterRequest request)
    AuthSvc->>UserRepo: existsByUsername(username)
    UserRepo->>DB: SELECT COUNT(*) FROM users WHERE username=?
    DB-->>UserRepo: count = 0
    AuthSvc->>UserRepo: existsByEmail(email)
    UserRepo->>DB: SELECT COUNT(*) FROM users WHERE email=?
    DB-->>UserRepo: count = 0

    AuthSvc->>AuthSvc: BCryptPasswordEncoder.encode(rawPassword)
    AuthSvc->>UserRepo: save(User entity with ROLE_CUSTOMER)
    UserRepo->>DB: INSERT INTO users (...) VALUES (...)
    DB-->>UserRepo: User entity created (userId=105)
    UserRepo-->>AuthSvc: User Object
    AuthSvc-->>AuthCtrl: User Object
    AuthCtrl-->>FE: HTTP 201 Created ("ÄÄƒng kÃ½ tÃ i khoáº£n thÃ nh cÃ´ng")
    FE-->>Guest: Hiá»ƒn thá»‹ Toast thÃ´ng bÃ¡o & Chuyá»ƒn hÆ°á»›ng trang ÄÄƒng nháº­p
```

---

### SD-02: SÆ¡ Ä‘á»“ Tuáº§n tá»± ÄÄƒng nháº­p Ná»™i bá»™ & Cáº¥p mÃ£ JWT Token

```mermaid
sequenceDiagram
    autonumber
    actor User as NgÆ°á»i dÃ¹ng
    participant FE as React Frontend
    participant AuthCtrl as AuthController
    participant AuthMgr as AuthenticationManager
    participant JwtProv as JwtTokenProvider
    participant DB as MS SQL Server

    User->>FE: Nháº­p Username/Email & Password âž” Báº¥m "ÄÄƒng nháº­p"
    FE->>AuthCtrl: POST /api/v1/auth/login (LoginRequest DTO)
    AuthCtrl->>AuthMgr: authenticate(UsernamePasswordAuthenticationToken)
    AuthMgr->>DB: SELECT u.*, r.role_name FROM users u JOIN roles r ON...
    DB-->>AuthMgr: User Record (Encoded BCrypt Password)
    AuthMgr->>AuthMgr: Verify BCrypt Password match
    alt Sai máº­t kháº©u / TÃ i khoáº£n bá»‹ khÃ³a (status=0)
        AuthMgr-->>AuthCtrl: Throw BadCredentialsException / BlockedException
        AuthCtrl-->>FE: HTTP 400 Bad Request ("TÃ i khoáº£n/Máº­t kháº©u sai hoáº·c bá»‹ khÃ³a")
        FE-->>User: Hiá»ƒn thá»‹ thÃ´ng bÃ¡o lá»—i
    else XÃ¡c thá»±c thÃ nh cÃ´ng
        AuthMgr-->>AuthCtrl: Authentication Object
        AuthCtrl->>JwtProv: generateToken(Authentication authentication)
        JwtProv->>JwtProv: Sign HMAC-SHA512 (UserId, Email, Roles, Expiration 24h)
        JwtProv-->>AuthCtrl: Token string ("eyJhbGciOi...")
        AuthCtrl-->>FE: HTTP 200 OK + JwtResponse (token, userInfo)
        FE->>FE: localStorage.setItem("token", token)
        FE-->>User: ÄÄƒng nháº­p thÃ nh cÃ´ng! Cáº­p nháº­t State & Header Avatar
    end
```

---

### SD-03: SÆ¡ Ä‘á»“ Tuáº§n tá»± ÄÄƒng nháº­p Nhanh vá»›i Google OAuth2 (SSO)

```mermaid
sequenceDiagram
    autonumber
    actor User as NgÆ°á»i dÃ¹ng
    participant FE as React Frontend
    participant GoogleSDK as Google OAuth2 API
    participant AuthCtrl as AuthController
    participant AuthSvc as AuthServiceImpl
    participant UserRepo as UserRepository
    participant JwtProv as JwtTokenProvider
    participant DB as MS SQL Server

    User->>FE: Báº¥m "ÄÄƒng nháº­p vá»›i Google"
    FE->>GoogleSDK: Khá»Ÿi táº¡o Google Sign-In Popup
    User->>GoogleSDK: Chá»n tÃ i khoáº£n Google & XÃ¡c nháº­n
    GoogleSDK-->>FE: Tráº£ vá» Google ID Token
    FE->>AuthCtrl: POST /api/v1/auth/google (GoogleLoginRequest DTO)
    AuthCtrl->>AuthSvc: processGoogleLogin(idToken)
    AuthSvc->>GoogleSDK: Verify ID Token vá»›i Google Verify Server
    GoogleSDK-->>AuthSvc: Return Profile Payload (Email, Name, Avatar)
    AuthSvc->>UserRepo: findByEmail(email)
    UserRepo->>DB: SELECT * FROM users WHERE email=?
    alt ChÆ°a cÃ³ trong CSDL
        DB-->>UserRepo: Optional.empty()
        AuthSvc->>UserRepo: save(New User with ROLE_CUSTOMER, status=1)
        UserRepo->>DB: INSERT INTO users (...)
        DB-->>UserRepo: Created User
    else ÄÃ£ cÃ³ tÃ i khoáº£n
        DB-->>UserRepo: Existing User Record
    end
    UserRepo-->>AuthSvc: User Object
    AuthSvc->>JwtProv: generateTokenForUser(user)
    JwtProv-->>AuthSvc: System JWT Token
    AuthSvc-->>AuthCtrl: JWT Token String
    AuthCtrl-->>FE: HTTP 200 OK + JwtResponse
    FE->>FE: Save JWT Token to localStorage
    FE-->>User: ÄÄƒng nháº­p thÃ nh cÃ´ng! Chuyá»ƒn hÆ°á»›ng Trang chá»§
```

---

### SD-04: SÆ¡ Ä‘á»“ Tuáº§n tá»± KhÃ´i phá»¥c Máº­t kháº©u qua Email OTP 6 Sá»‘

```mermaid
sequenceDiagram
    autonumber
    actor Customer as KhÃ¡ch hÃ ng
    participant FE as React Frontend
    participant AuthCtrl as AuthController
    participant AuthSvc as AuthServiceImpl
    participant OtpRepo as OtpVerificationRepository
    participant MailSvc as Asynchronous MailService
    participant SMTP as Gmail SMTP Server
    participant DB as MS SQL Server

    Customer->>FE: Nháº­p Email âž” Báº¥m "Gá»­i mÃ£ OTP"
    FE->>AuthCtrl: POST /api/v1/auth/forgot-password (Email)
    AuthCtrl->>AuthSvc: processForgotPassword(email)
    AuthSvc->>AuthSvc: Generate 6-digit random OTP (háº¡n 5 phÃºt)
    AuthSvc->>OtpRepo: save(OtpVerification entity)
    OtpRepo->>DB: INSERT INTO otp_verifications (...)
    DB-->>OtpRepo: Saved OTP Record
    AuthSvc->>MailSvc: sendOtpEmailAsync(email, otpCode) [@Async]
    AuthSvc-->>AuthCtrl: Return Success Status
    AuthCtrl-->>FE: HTTP 200 OK ("ÄÃ£ gá»­i mÃ£ OTP Ä‘áº¿n Email cá»§a báº¡n")
    MailSvc-->>SMTP: Send TLS HTML Email (Port 587)
    SMTP-->>Customer: Há»™p thÆ° Email nháº­n mÃ£ OTP 6 sá»‘

    Customer->>FE: Nháº­p mÃ£ OTP & Máº­t kháº©u má»›i âž” Báº¥m "XÃ¡c nháº­n Ä‘á»•i"
    FE->>AuthCtrl: POST /api/v1/auth/reset-password (Email, OTP, NewPassword)
    AuthCtrl->>AuthSvc: resetPassword(email, otp, newPassword)
    AuthSvc->>OtpRepo: findTopByEmailAndIsUsedFalseOrderByExpirationTimeDesc()
    OtpRepo->>DB: SELECT * FROM otp_verifications WHERE...
    DB-->>OtpRepo: OTP Record
    alt OTP Ä‘Ãºng & chÆ°a háº¿t háº¡n
        AuthSvc->>AuthSvc: BCrypt.encode(newPassword)
        AuthSvc->>DB: UPDATE users SET password=? WHERE email=?
        AuthSvc->>DB: UPDATE otp_verifications SET is_used=1 WHERE id=?
        AuthSvc-->>AuthCtrl: Success
        AuthCtrl-->>FE: HTTP 200 OK ("Äá»•i máº­t kháº©u má»›i thÃ nh cÃ´ng!")
        FE-->>Customer: Chuyá»ƒn hÆ°á»›ng sang ÄÄƒng nháº­p
    else OTP sai / Háº¿t háº¡n
        AuthSvc-->>AuthCtrl: Throw InvalidOtpException
        AuthCtrl-->>FE: HTTP 400 Bad Request ("MÃ£ OTP sai hoáº·c háº¿t háº¡n")
        FE-->>Customer: ThÃ´ng bÃ¡o lá»—i
    end
```

---

### SD-05: SÆ¡ Ä‘á»“ Tuáº§n tá»± Lá»c & TÃ¬m kiáº¿m Sáº£n pháº©m Äa tiÃªu chÃ­

```mermaid
sequenceDiagram
    autonumber
    actor Customer as KhÃ¡ch vÃ£ng lai / KhÃ¡ch hÃ ng
    participant FE as React Frontend
    participant ProdCtrl as ProductController
    participant ProdSvc as ProductServiceImpl
    participant ProdRepo as ProductRepository
    participant DB as MS SQL Server

    Customer->>FE: Nháº­p tá»« khÃ³a "SÆ¡ mi", chá»n Category "Ão", Size "M", GiÃ¡ 200k-500k
    FE->>ProdCtrl: GET /api/v1/products?search=SÆ¡ mi&categoryId=1&size=M&minPrice=200000...
    ProdCtrl->>ProdSvc: filterProducts(ProductFilterCriteria criteria)
    ProdSvc->>ProdRepo: findAll(Specification<Product> spec, Pageable pageable)
    ProdRepo->>DB: SELECT p.*, v.*, c.* FROM products p JOIN product_variants v ON...
    DB-->>ProdRepo: ResultSet (Page 1 of Products & Variants)
    ProdRepo-->>ProdSvc: Page~Product~ Entity
    ProdSvc->>ProdSvc: Map Product Entities to ProductListDto
    ProdSvc-->>ProdCtrl: Page~ProductListDto~
    ProdCtrl-->>FE: HTTP 200 OK + Paginated JSON Data
    FE-->>Customer: Render danh sÃ¡ch sáº£n pháº©m Ä‘á»™ng mÆ°á»£t mÃ  khÃ´ng táº£i láº¡i trang
```

---

### SD-06: SÆ¡ Ä‘á»“ Tuáº§n tá»± Chá»n Biáº¿n thá»ƒ (Size/MÃ u) & ThÃªm vÃ o Giá» hÃ ng

```mermaid
sequenceDiagram
    autonumber
    actor Customer as KhÃ¡ch hÃ ng
    participant FE as React Frontend
    participant CartCtrl as CartController
    participant CartSvc as CartServiceImpl
    participant VarRepo as ProductVariantRepository
    participant CartRepo as CartRepository
    participant DB as MS SQL Server

    Customer->>FE: Báº¥m chá»n MÃ u "Äen" & Size "L" trÃªn trang Chi tiáº¿t
    FE->>VarRepo: GET /api/v1/products/10/variants?color=Black&size=L
    VarRepo->>DB: SELECT * FROM product_variants WHERE product_id=10 AND color='Black' AND size='L'
    DB-->>VarRepo: Variant Record (quantity = 12)
    FE-->>Customer: Cáº­p nháº­t giao diá»‡n: Hiá»ƒn thá»‹ "CÃ²n 12 sáº£n pháº©m trong kho"

    Customer->>FE: Chá»n Sá»‘ lÆ°á»£ng = 2 âž” Báº¥m "ThÃªm vÃ o giá» hÃ ng"
    FE->>CartCtrl: POST /api/v1/cart/items (Authorization JWT, variantId=102, qty=2)
    CartCtrl->>CartCtrl: Extract UserId from JWT Token
    CartCtrl->>CartSvc: addItemToCart(userId, variantId=102, qty=2)
    CartSvc->>VarRepo: findById(102)
    VarRepo->>DB: SELECT * FROM product_variants WHERE variant_id=102
    DB-->>VarRepo: Variant Entity (quantity = 12)
    alt Requested Qty (2) <= Stock Qty (12)
        CartSvc->>CartRepo: findByUserId(userId)
        CartRepo->>DB: SELECT * FROM carts WHERE user_id=?
        DB-->>CartRepo: Cart Entity
        CartSvc->>DB: INSERT / UPDATE cart_details SET quantity = quantity + 2
        DB-->>CartSvc: Success
        CartSvc-->>CartCtrl: Updated CartDto
        CartCtrl-->>FE: HTTP 200 OK + CartSummaryDto
        FE-->>Customer: Sonner Toast: "ÄÃ£ thÃªm sáº£n pháº©m vÃ o giá» hÃ ng thÃ nh cÃ´ng!"
    else Out of Stock
        CartSvc-->>CartCtrl: Throw OutOfStockException
        CartCtrl-->>FE: HTTP 400 Bad Request ("Sá»‘ lÆ°á»£ng mua vÆ°á»£t quÃ¡ tá»“n kho")
        FE-->>Customer: Toast thÃ´ng bÃ¡o lá»—i
    end
```

---

### SD-07: SÆ¡ Ä‘á»“ Tuáº§n tá»± Äáº·t hÃ ng & Thanh toÃ¡n Tá»± Ä‘á»™ng PayOS QR Code

```mermaid
sequenceDiagram
    autonumber
    actor Customer as KhÃ¡ch hÃ ng
    participant FE as React Frontend
    participant OrderCtrl as OrderController
    participant OrderSvc as OrderServiceImpl
    participant PayOSClient as PayOS Payment SDK
    participant PayOSGateway as PayOS Server
    participant PayOSWebhk as PaymentController (Webhook Endpoint)
    participant DB as MS SQL Server

    Customer->>FE: Báº¥m "Thanh toÃ¡n QR PayOS" táº¡i trang Checkout
    FE->>OrderCtrl: POST /api/v1/orders (OrderRequest DTO, paymentMethod="PAYOS")
    OrderCtrl->>OrderSvc: placeOrder(user, request)
    OrderSvc->>DB: BEGIN TRANSACTION
    OrderSvc->>DB: Check & Deduct product_variants stock
    OrderSvc->>DB: INSERT INTO orders & order_details (status="PENDING", payment_status="UNPAID")
    OrderSvc->>PayOSClient: createPaymentLink(OrderCode, FinalAmount, Description)
    PayOSClient->>PayOSGateway: POST /v2/payment-requests
    PayOSGateway-->>PayOSClient: Return { qrCode: "000201...", checkoutUrl: "..." }
    PayOSClient-->>OrderSvc: PaymentLinkResponse
    OrderSvc->>DB: COMMIT TRANSACTION
    OrderSvc-->>OrderCtrl: OrderResponseDto + VietQR Code
    OrderCtrl-->>FE: HTTP 200 OK + OrderInfo & VietQR
    FE-->>Customer: Hiá»ƒn thá»‹ Modal quÃ©t mÃ£ VietQR Banking

    Customer->>PayOSGateway: QuÃ©t mÃ£ QR & Chuyá»ƒn tiá»n qua App NgÃ¢n hÃ ng
    PayOSGateway->>PayOSWebhk: POST /api/v1/payments/payos-webhook (Data, Signature)
    PayOSWebhk->>PayOSWebhk: Verify HMAC SHA256 Signature
    PayOSWebhk->>DB: UPDATE orders SET payment_status='PAID', status='PROCESSING'
    PayOSWebhk->>DB: INSERT INTO payments (transaction_code, amount, status)
    PayOSWebhk-->>PayOSGateway: HTTP 200 OK Response
    FE->>OrderCtrl: Long Polling GET /api/v1/orders/{orderId}/status
    OrderCtrl-->>FE: paymentStatus = "PAID"
    FE-->>Customer: Tá»± Ä‘á»™ng chuyá»ƒn hÆ°á»›ng mÃ n hÃ¬nh "Thanh toÃ¡n ÄÆ¡n hÃ ng ThÃ nh cÃ´ng!"
```

---

### SD-08: SÆ¡ Ä‘á»“ Tuáº§n tá»± Há»§y ÄÆ¡n hÃ ng & HoÃ n tráº£ Sá»‘ lÆ°á»£ng Tá»“n kho

```mermaid
sequenceDiagram
    autonumber
    actor Customer as KhÃ¡ch hÃ ng
    participant FE as React Frontend
    participant OrderCtrl as OrderController
    participant OrderSvc as OrderServiceImpl
    participant OrderRepo as OrderRepository
    participant VarRepo as ProductVariantRepository
    participant DB as MS SQL Server

    Customer->>FE: Báº¥m "Há»§y Ä‘Æ¡n hÃ ng" táº¡i danh sÃ¡ch Lá»‹ch sá»­ Ä‘Æ¡n
    FE->>OrderCtrl: POST /api/v1/orders/{orderId}/cancel (Reason)
    OrderCtrl->>OrderSvc: cancelOrder(orderId, currentUser)
    OrderSvc->>OrderRepo: findById(orderId)
    OrderRepo->>DB: SELECT * FROM orders WHERE order_id=?
    DB-->>OrderRepo: Order Entity (status="PENDING")
    alt Order Status == 'PENDING'
        OrderSvc->>DB: BEGIN TRANSACTION
        OrderSvc->>DB: UPDATE orders SET status='CANCELLED', cancel_reason=?
        loop Äá»‘i vá»›i tá»«ng OrderDetail trong Ä‘Æ¡n
            OrderSvc->>VarRepo: restockQuantity(variantId, quantity)
            VarRepo->>DB: UPDATE product_variants SET quantity = quantity + orderQty WHERE variant_id=?
        end
        OrderSvc->>DB: COMMIT TRANSACTION
        OrderSvc-->>OrderCtrl: Success
        OrderCtrl-->>FE: HTTP 200 OK ("Há»§y Ä‘Æ¡n hÃ ng thÃ nh cÃ´ng vÃ  Ä‘Ã£ hoÃ n kho")
        FE-->>Customer: Cáº­p nháº­t giao diá»‡n: Badge Ä‘Æ¡n chuyá»ƒn "ÄÃ£ há»§y"
    else Status != 'PENDING' (ÄÃ£ duyá»‡t/Äang giao)
        OrderSvc-->>OrderCtrl: Throw IllegalOrderStateException
        OrderCtrl-->>FE: HTTP 400 Bad Request ("ÄÆ¡n hÃ ng Ä‘Ã£ Ä‘Æ°á»£c duyá»‡t, khÃ´ng thá»ƒ há»§y")
        FE-->>Customer: ThÃ´ng bÃ¡o lá»—i
    end
```

---

### SD-09: SÆ¡ Ä‘á»“ Tuáº§n tá»± Admin ThÃªm Sáº£n pháº©m kÃ¨m áº¢nh phá»¥ & Biáº¿n thá»ƒ Kho

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Quáº£n trá»‹ viÃªn
    participant FE as Admin React Portal
    participant Cloudinary as Cloudinary Media Cloud
    participant ProdCtrl as ProductController
    participant ProdSvc as ProductServiceImpl
    participant DB as MS SQL Server

    Admin->>FE: Báº¥m "ThÃªm sáº£n pháº©m má»›i" âž” Nháº­p thÃ´ng tin & Upload 3 áº¢nh gÃ³c phá»¥
    FE->>Cloudinary: POST Multi-part Image Files
    Cloudinary-->>FE: Return Secure Image URLs [url1, url2, url3]
    Admin->>FE: Cáº¥u hÃ¬nh danh sÃ¡ch Biáº¿n thá»ƒ Size/MÃ u & Sá»‘ lÆ°á»£ng kho âž” Báº¥m "LÆ°u"
    FE->>ProdCtrl: POST /api/v1/admin/products (ProductDto Payload)
    ProdCtrl->>ProdCtrl: Verify Spring Security @PreAuthorize("hasRole('ADMIN')")
    ProdCtrl->>ProdSvc: saveProductWithVariants(ProductDto dto)
    ProdSvc->>DB: BEGIN TRANSACTION
    ProdSvc->>DB: INSERT INTO products (product_name, price, category_id, status...)
    DB-->>ProdSvc: Inserted product_id = 201
    loop ThÃªm tá»«ng áº¢nh phá»¥ vÃ o product_images
        ProdSvc->>DB: INSERT INTO product_images (product_id=201, image_url, is_primary)
    end
    loop ThÃªm tá»«ng Biáº¿n thá»ƒ vÃ o product_variants
        ProdSvc->>DB: INSERT INTO product_variants (product_id=201, color, size, quantity, sku)
    end
    ProdSvc->>DB: COMMIT TRANSACTION
    ProdSvc-->>ProdCtrl: ProductDetailDto
    ProdCtrl-->>FE: HTTP 201 Created + Product JSON
    FE-->>Admin: Hiá»ƒn thá»‹ Toast "Táº¡o sáº£n pháº©m vÃ  biáº¿n thá»ƒ kho thÃ nh cÃ´ng!"
```

---

### SD-10: SÆ¡ Ä‘á»“ Tuáº§n tá»± Duyá»‡t & Cáº­p nháº­t Tiáº¿n trÃ¬nh Váº­n chuyá»ƒn ÄÆ¡n hÃ ng

```mermaid
sequenceDiagram
    autonumber
    actor Staff as NhÃ¢n viÃªn Staff / Admin
    participant FE as Admin React Portal
    participant OrderCtrl as OrderController
    participant OrderSvc as OrderServiceImpl
    participant MailSvc as Asynchronous MailService
    participant DB as MS SQL Server

    Staff->>FE: Xem danh sÃ¡ch Ä‘Æ¡n "PENDING" âž” Báº¥m nÃºt "Duyá»‡t Ä‘Æ¡n"
    FE->>OrderCtrl: PATCH /api/v1/admin/orders/{orderId}/status (status="CONFIRMED")
    OrderCtrl->>OrderCtrl: Verify Role @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    OrderCtrl->>OrderSvc: updateStatus(orderId, "CONFIRMED")
    OrderSvc->>DB: UPDATE orders SET status='CONFIRMED' WHERE order_id=?
    DB-->>OrderSvc: OK
    OrderSvc->>MailSvc: sendOrderStatusEmailAsync(orderId, "CONFIRMED") [@Async]
    OrderSvc-->>OrderCtrl: Updated OrderDto
    OrderCtrl-->>FE: HTTP 200 OK + Updated Order JSON
    FE-->>Staff: Cáº­p nháº­t giao diá»‡n: Badge chuyá»ƒn "ÄÃ£ duyá»‡t / XÃ¡c nháº­n"

    Staff->>FE: BÃ n giao giao váº­n âž” Báº¥m "Giao hÃ ng"
    FE->>OrderCtrl: PATCH /api/v1/admin/orders/{orderId}/status (status="SHIPPING")
    OrderCtrl->>OrderSvc: updateStatus(orderId, "SHIPPING")
    OrderSvc->>DB: UPDATE orders SET status='SHIPPING' WHERE order_id=?
    OrderSvc-->>OrderCtrl: Updated OrderDto
    OrderCtrl-->>FE: HTTP 200 OK (Badge chuyá»ƒn "Äang giao")
```

---

## Lá»œI Káº¾T & LIÃŠN Káº¾T TÃ€I LIá»†U

TÃ i liá»‡u **Thiáº¿t káº¿ SÆ¡ Ä‘á»“ Tuáº§n tá»± UML (Sequence Diagram Specification)** Ä‘Ã£ chi tiáº¿t hÃ³a 10 luá»“ng giao dá»‹ch nghiá»‡p vá»¥ quan trá»ng nháº¥t cá»§a há»‡ thá»‘ng FoxStyle.

TÃ i liá»‡u nÃ y Ä‘Æ°á»£c Ä‘á»“ng bá»™ liÃªn káº¿t vá»›i:
- [Äáº·c táº£ YÃªu cáº§u Há»‡ thá»‘ng SRS](./yeu_cau_he_thong.md)
- [SÆ¡ Ä‘á»“ Use Case & Sequence Diagrams](./so_do_use_case.md)
- [Äáº·c táº£ Chi tiáº¿t 20 Ca sá»­ dá»¥ng](./dac_ta_use_case_chi_tiet.md)
- [Ma tráº­n Ãnh xáº¡ Use Case & Actor](./use_case_actor_mapping.md)
- [BÃ¡o cÃ¡o MÃ´ táº£ Chi tiáº¿t CÆ¡ sá»Ÿ Dá»¯ liá»‡u 43 Báº£ng](./BAO_CAO_MO_TA_CSDL_FOXSTYLE.md)
- [Thiáº¿t káº¿ CÆ¡ sá»Ÿ Dá»¯ liá»‡u 43 Báº£ng (Database Design)](./thiet_ke_co_so_du_lieu.md)
- [Thiáº¿t káº¿ Lá»›p MÃ£ nguá»“n Java (Class Diagrams)](./thiet_ke_lop_class_diagrams.md)
- [Thiáº¿t káº¿ Lá»›p 6 PhÃ¢n há»‡ chÃ­nh](./thiet_ke_lop_cac_phan_he_chinh.md)
- [Thiáº¿t káº¿ Cáº¥u trÃºc Pháº§n má»m (Software Architecture)](./thiet_ke_cau_truc_phan_mem.md)
- [Thiáº¿t káº¿ Háº¡ táº§ng Máº¡ng & ChÃ­nh sÃ¡ch Há»‡ thá»‘ng](./thiet_ke_ha_tang_mang_va_chinh_sach.md)
