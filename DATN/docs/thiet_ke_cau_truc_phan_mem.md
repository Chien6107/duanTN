# TÃ€I LIá»†U THIáº¾T Káº¾ Cáº¤U TRÃšC PHáº¦N Má»€M (SOFTWARE ARCHITECTURE DESIGN)
## Dá»± Ã¡n: Há»‡ thá»‘ng ThÆ°Æ¡ng máº¡i Äiá»‡n tá»­ Thá»i trang FoxStyle
**MÃ£ dá»± Ã¡n:** FOXSTYLE-DATN  
**NgÃ y cáº­p nháº­t:** 31/07/2026  
**Tráº¡ng thÃ¡i:** TÃ€I LIá»†U CHÃNH THá»¨C  

---

## Má»¤C Lá»¤C
- [CHÆ¯Æ NG 1: MÃ” HÃŒNH KIáº¾N TRÃšC PHáº¦N Má»€M Tá»”NG THá»‚ (OVERALL SOFTWARE ARCHITECTURE)](#chÆ°Æ¡ng-1-mÃ´-hÃ¬nh-kiáº¿n-trÃºc-pháº§n-má»m-tá»•ng-thá»ƒ-overall-software-architecture)
  - [1.1. Kiáº¿n trÃºc TÃ¡ch biá»‡t (Decoupled System Architecture)](#11-kiáº¿n-trÃºc-tÃ¡ch-biá»‡t-decoupled-system-architecture)
  - [1.2. SÆ¡ Ä‘á»“ Kiáº¿n trÃºc Pháº§n má»m Tá»•ng thá»ƒ](#12-sÆ¡-Ä‘á»“-kiáº¿n-trÃºc-pháº§n-má»m-tá»•ng-thá»ƒ)
- [CHÆ¯Æ NG 2: Cáº¤U TRÃšC MÃƒ NGUá»’N VÃ€ PHÃ‚N Cáº¤P MODULE (PROJECT MODULE STRUCTURE)](#chÆ°Æ¡ng-2-cáº¥u-trÃºc-mÃ£-nguá»“n-vÃ -phÃ¢n-cáº¥p-module-project-module-structure)
  - [2.1. Cáº¥u trÃºc ThÆ° má»¥c Backend Java Spring Boot (`DATN-BE`)](#21-cáº¥u-trÃºc-thÆ°-má»¥c-backend-java-spring-boot-datn-be)
  - [2.2. Cáº¥u trÃºc ThÆ° má»¥c Frontend React SPA (`DATN-FE`)](#22-cáº¥u-trÃºc-thÆ°-má»¥c-frontend-react-spa-datn-fe)
- [CHÆ¯Æ NG 3: MÃ” HÃŒNH THIáº¾T Káº¾ VÃ€ QUY TRÃŒNH LUÃ‚N CHUYá»‚N Dá»® LIá»†U (DESIGN PATTERNS & DFD)](#chÆ°Æ¡ng-3-mÃ´-hÃ¬nh-thiáº¿t-káº¿-vÃ -quy-trÃ¬nh-luÃ¢n-chuyá»ƒn-dá»¯-liá»‡u-design-patterns--dfd)
  - [3.1. CÃ¡c Máº«u Thiáº¿t káº¿ Pháº§n má»m Ãp dá»¥ng (Design Patterns)](#31-cÃ¡c-máº«u-thiáº¿t-káº¿-pháº§n-má»m-Ã¡p-dá»¥ng-design-patterns)
  - [3.2. SÆ¡ Ä‘á»“ Luá»“ng Dá»¯ liá»‡u Há»‡ thá»‘ng (Data Flow Diagram - DFD Level 0 & Level 1)](#32-sÆ¡-Ä‘á»“-luá»“ng-dá»¯-liá»‡u-há»‡-thá»‘ng-data-flow-diagram---dfd-level-0--level-1)
- [CHÆ¯Æ NG 4: TIÃŠU CHUáº¨N THIáº¾T Káº¾ RESTFUL API & Xá»¬ LÃ Lá»–I (API STANDARDS & EXCEPTION HANDLING)](#chÆ°Æ¡ng-4-tiÃªu-chuáº©n-thiáº¿t-káº¿-restful-api--xá»­-lÃ½-lá»—i-api-standards--exception-handling)
  - [4.1. TiÃªu chuáº©n Thiáº¿t káº¿ RESTful API (REST API Guidelines)](#41-tiÃªu-chuáº©n-thiáº¿t-káº¿-restful-api-rest-api-guidelines)
  - [4.2. CÆ¡ cháº¿ Xá»­ lÃ½ Ngoáº¡i lá»‡ Táº­p trung (Global Exception Handling)](#42-cÆ¡-cháº¿-xá»­-lÃ½-ngoáº¡i-lá»‡-táº­p-trung-global-exception-handling)

---

## CHÆ¯Æ NG 1: MÃ” HÃŒNH KIáº¾N TRÃšC PHáº¦N Má»€M Tá»”NG THá»‚ (OVERALL SOFTWARE ARCHITECTURE)

### 1.1. Kiáº¿n trÃºc TÃ¡ch biá»‡t (Decoupled System Architecture)

Dá»± Ã¡n **FoxStyle Fashion Store** Ä‘Æ°á»£c thiáº¿t káº¿ theo mÃ´ hÃ¬nh kiáº¿n trÃºc pháº§n má»m tÃ¡ch biá»‡t hoÃ n toÃ n (**Decoupled Architecture / Headless Frontend & RESTful Backend**). MÃ´ hÃ¬nh nÃ y chia á»©ng dá»¥ng thÃ nh 3 thÃ nh pháº§n chÃ­nh hoáº¡t Ä‘á»™ng Ä‘á»™c láº­p:

1. **Frontend Client App (Single Page Application - SPA):**
   - XÃ¢y dá»±ng trÃªn ná»n **React 18 / Vite 6 / TailwindCSS 4 / Radix UI**.
   - Cháº¡y hoÃ n toÃ n trÃªn trÃ¬nh duyá»‡t ngÆ°á»i dÃ¹ng, chá»‹u trÃ¡ch nhiá»‡m render giao diá»‡n Ä‘á»™ng, quáº£n lÃ½ State vÃ  thá»±c hiá»‡n gá»i HTTP RESTful API báº¥t Ä‘á»“ng bá»™ (Asynchronous AJAX/Fetch API).

2. **Backend API Service (RESTful Micro-service ready):**
   - XÃ¢y dá»±ng trÃªn ná»n **Java 17 / Spring Boot 3.2.5 / Spring Security**.
   - Cung cáº¥p cÃ¡c Endpoint RESTful pháº£n há»“i dá»¯ liá»‡u dáº¡ng JSON. Äáº£m nháº­n toÃ n bá»™ nghiá»‡p vá»¥ kiá»ƒm tra tá»“n kho, tÃ­nh toÃ¡n tiá»n hÃ ng, quáº£n lÃ½ giao dá»‹ch `@Transactional`, phÃ¡t hÃ nh JWT Token vÃ  xá»­ lÃ½ Webhook.

3. **Database & External Services (Táº§ng Dá»¯ liá»‡u & Dá»‹ch vá»¥ ngoÃ i):**
   - CSDL **Microsoft SQL Server** vá»›i 43 báº£ng dá»¯ liá»‡u chuáº©n hÃ³a 3NF.
   - CÃ¡c dá»‹ch vá»¥ tÃ­ch há»£p bÃªn ngoÃ i: Cá»•ng thanh toÃ¡n **PayOS** (MÃ£ QR VietQR & Webhook Ä‘á»‘i soÃ¡t), **Google OAuth2** (ÄÄƒng nháº­p SSO), **Gmail SMTP** (Gá»­i mail xÃ¡c nháº­n Ä‘Æ¡n/OTP) vÃ  **Cloudinary** (LÆ°u trá»¯ hÃ¬nh áº£nh cloud).

---

### 1.2. SÆ¡ Ä‘á»“ Kiáº¿n trÃºc Pháº§n má»m Tá»•ng thá»ƒ

```mermaid
flowchart TD
    subgraph FrontendApp ["ðŸ–¥ï¸ FRONTEND CLIENT (React 18 / Vite 6)"]
        StorefrontUI["Storefront SPA (User / Customer)"]
        AdminPortalUI["Admin & Staff Portal SPA"]
        StateMgmt["React Context & State Management"]
        AxiosClient["Axios HTTP Client / REST Service"]
        
        StorefrontUI --> StateMgmt
        AdminPortalUI --> StateMgmt
        StateMgmt --> AxiosClient
    end

    subgraph RESTBoundary ["ðŸŒ RESTful API BOUNDARY (HTTPS / JSON)"]
        JWTSecurity["Spring Security & JWT Filter"]
        APIRouter["Spring Web REST Controllers"]
    end

    subgraph BackendApp ["âš™ï¸ BACKEND SERVICE (Spring Boot 3.2.5 / Java 17)"]
        AuthModule["Auth & User Module"]
        ProductModule["Product & Variant Module"]
        OrderModule["Order & Cart Module"]
        PaymentModule["PayOS Payment Integration Module"]
        MailModule["Asynchronous Mail Notification Module"]

        JWTSecurity --> APIRouter
        APIRouter --> AuthModule
        APIRouter --> ProductModule
        APIRouter --> OrderModule
        APIRouter --> PaymentModule
        OrderModule --> MailModule
    end

    subgraph DataStore ["ðŸ’¾ DATA & EXTERNAL SERVICES"]
        MSSQLDB[("MS SQL Server (43 Tables)")]
        PayOSGateway["PayOS Payment Gateway"]
        GoogleOAuth["Google OAuth2 API"]
        CloudinaryCloud["Cloudinary Media Cloud"]
        SMTPMail["Gmail SMTP Mail Server"]
    end

    AxiosClient -->|JSON Payload / JWT Header| RESTBoundary
    
    AuthModule --> GoogleOAuth
    ProductModule --> CloudinaryCloud
    PaymentModule <--> PayOSGateway
    MailModule --> SMTPMail

    AuthModule --> MSSQLDB
    ProductModule --> MSSQLDB
    OrderModule --> MSSQLDB
    PaymentModule --> MSSQLDB
```

---

## CHÆ¯Æ NG 2: Cáº¤U TRÃšC MÃƒ NGUá»’N VÃ€ PHÃ‚N Cáº¤P MODULE (PROJECT MODULE STRUCTURE)

### 2.1. Cáº¥u trÃºc ThÆ° má»¥c Backend Java Spring Boot (`DATN-BE`)

MÃ£ nguá»“n Backend Ä‘Æ°á»£c phÃ¢n bá»• theo quy chuáº©n Java Package Naming Standard:

```
DATN-BE/src/main/java/com/foxstyle/api/
â”œâ”€â”€ ApiApplication.java                # Main Spring Boot Application Entry Point
â”œâ”€â”€ config/                            # Khai bÃ¡o Spring Bean & Configuration
â”‚   â”œâ”€â”€ CorsConfig.java                # Cáº¥u hÃ¬nh CORS Whitelist Domains
â”‚   â”œâ”€â”€ OpenApiConfig.java             # Cáº¥u hÃ¬nh Swagger / Springdoc UI
â”‚   â”œâ”€â”€ PayOSConfig.java               # Cáº¥u hÃ¬nh PayOS Client ID & Checksum Key
â”‚   â”œâ”€â”€ SecurityConfig.java            # Cáº¥u hÃ¬nh Spring Security & Filter Chain
â”‚   â””â”€â”€ AsyncMailConfig.java           # Cáº¥u hÃ¬nh ThreadPoolTaskExecutor cho Mail
â”œâ”€â”€ controller/                        # 18 REST Controllers (API Endpoints)
â”‚   â”œâ”€â”€ AuthController.java            # ÄÄƒng kÃ½, ÄÄƒng nháº­p Local/Google, OTP
â”‚   â”œâ”€â”€ ProductController.java         # Lá»c, TÃ¬m kiáº¿m, ThÃªm/Sá»­a Sáº£n pháº©m
â”‚   â”œâ”€â”€ OrderController.java           # Äáº·t hÃ ng, Há»§y Ä‘Æ¡n, Duyá»‡t tiáº¿n trÃ¬nh
â”‚   â”œâ”€â”€ PaymentController.java         # Thanh toÃ¡n PayOS QR & Webhook Handler
â”‚   â”œâ”€â”€ CartController.java            # Quáº£n lÃ½ Giá» hÃ ng & Biáº¿n thá»ƒ
â”‚   â”œâ”€â”€ CouponController.java          # Ãp dá»¥ng & Quáº£n lÃ½ Coupon
â”‚   â””â”€â”€ UserController.java            # Quáº£n lÃ½ Há»“ sÆ¡, Sá»• Ä‘á»‹a chá»‰, KhÃ³a User
â”œâ”€â”€ dto/                               # Data Transfer Objects (Request/Response)
â”‚   â”œâ”€â”€ request/                       # DTOs chá»©a dá»¯ liá»‡u Ä‘áº§u vÃ o tá»« Client
â”‚   â””â”€â”€ response/                      # DTOs chá»©a dá»¯ liá»‡u Ä‘áº§u ra JSON
â”œâ”€â”€ entity/                            # 30 JPA Entities Ã¡nh xáº¡ CSDL SQL Server
â”‚   â”œâ”€â”€ User.java                      # Báº£ng users
â”‚   â”œâ”€â”€ Product.java                   # Báº£ng products
â”‚   â”œâ”€â”€ ProductVariant.java            # Báº£ng product_variants (Size/MÃ u/SKU/Tá»“n)
â”‚   â”œâ”€â”€ Order.java                     # Báº£ng orders
â”‚   â””â”€â”€ Payment.java                   # Báº£ng payments
â”œâ”€â”€ exception/                         # Xá»­ lÃ½ Ngoáº¡i lá»‡ Táº­p trung
â”‚   â”œâ”€â”€ GlobalExceptionHandler.java    # Controller Advice báº¯t ngoáº¡i lá»‡ tá»± Ä‘á»™ng
â”‚   â””â”€â”€ ResourceNotFoundException.java # Ngoáº¡i lá»‡ Custom lá»—i 404
â”œâ”€â”€ repository/                        # 30 JPA Data Repositories
â”‚   â”œâ”€â”€ UserRepository.java            # Truy váº¥n User & Role
â”‚   â”œâ”€â”€ ProductRepository.java         # Truy váº¥n lá»c sáº£n pháº©m
â”‚   â””â”€â”€ OrderRepository.java           # Truy váº¥n Ä‘Æ¡n hÃ ng
â”œâ”€â”€ security/                          # ThÃ nh pháº§n An ninh JWT
â”‚   â”œâ”€â”€ JwtTokenProvider.java          # Sinh & Giáº£i mÃ£ JWT Token HMAC-SHA512
â”‚   â”œâ”€â”€ JwtAuthenticationFilter.java   # Filter kiá»ƒm tra Token trÃªn tá»«ng Request
â”‚   â””â”€â”€ UserDetailsServiceImpl.java    # Táº£i thÃ´ng tin UserDetails cho Spring Security
â”œâ”€â”€ service/                           # Business Services Interfaces & Impl
â”‚   â”œâ”€â”€ AuthService.java / AuthServiceImpl.java
â”‚   â”œâ”€â”€ ProductService.java / ProductServiceImpl.java
â”‚   â”œâ”€â”€ OrderService.java / OrderServiceImpl.java
â”‚   â””â”€â”€ PaymentService.java / PaymentServiceImpl.java
â””â”€â”€ util/                              # ThÆ° viá»‡n Helper Utilities
    â”œâ”€â”€ DateUtils.java                 # Äá»‹nh dáº¡ng thá»i gian
    â””â”€â”€ SignatureUtils.java            # BÄƒm HMAC SHA256 kiá»ƒm tra Webhook
```

---

### 2.2. Cáº¥u trÃºc ThÆ° má»¥c Frontend React SPA (`DATN-FE`)

MÃ£ nguá»“n Frontend React SPA Ä‘Æ°á»£c tá»• chá»©c mÃ´-Ä‘un hÃ³a cao:

```
DATN-FE/src/
â”œâ”€â”€ api/                               # Http Client API Services (Axios)
â”‚   â”œâ”€â”€ axiosClient.ts                 # Cáº¥u hÃ¬nh Axios Base URL & JWT Interceptors
â”‚   â”œâ”€â”€ authApi.ts                     # Gá»i API ÄÄƒng nháº­p, ÄÄƒng kÃ½, OAuth2
â”‚   â”œâ”€â”€ productApi.ts                  # Gá»i API Lá»c sáº£n pháº©m, Chi tiáº¿t biáº¿n thá»ƒ
â”‚   â”œâ”€â”€ orderApi.ts                    # Gá»i API Äáº·t hÃ ng, Lá»‹ch sá»­ Ä‘Æ¡n
â”‚   â””â”€â”€ paymentApi.ts                  # Gá»i API Sinh mÃ£ PayOS QR Code
â”œâ”€â”€ components/                        # ThÆ° viá»‡n UI Components tÃ¡i sá»­ dá»¥ng
â”‚   â”œâ”€â”€ ui/                            # Radix / Shadcn primitives (Button, Modal...)
â”‚   â”œâ”€â”€ common/                        # Header, Footer, Sidebar, Navigation
â”‚   â”œâ”€â”€ product/                       # ProductCard, VariantSelector, ImageGallery
â”‚   â””â”€â”€ order/                         # OrderStatusBadge, CheckoutSummary
â”œâ”€â”€ context/                           # Context API State Management
â”‚   â”œâ”€â”€ AuthContext.tsx                # Quáº£n lÃ½ Tráº¡ng thÃ¡i ÄÄƒng nháº­p & JWT Session
â”‚   â””â”€â”€ CartContext.tsx                # Quáº£n lÃ½ Tráº¡ng thÃ¡i Giá» hÃ ng Realtime
â”œâ”€â”€ layouts/                           # Khung Layout Giao diá»‡n
â”‚   â”œâ”€â”€ MainLayout.tsx                 # Layout máº·c Ä‘á»‹nh Storefront KhÃ¡ch hÃ ng
â”‚   â””â”€â”€ AdminLayout.tsx                # Layout Quáº£n trá»‹ Admin & Staff Portal
â”œâ”€â”€ pages/                             # MÃ n hÃ¬nh Giao diá»‡n ChÃ­nh (Views)
â”‚   â”œâ”€â”€ storefront/                    # HomePage, ProductCatalog, CartPage, Checkout
â”‚   â””â”€â”€ admin/                         # Dashboard, ManageProducts, ManageOrders
â”œâ”€â”€ routes/                            # Äá»‹nh tuyáº¿n Trang (React Router v7)
â”‚   â”œâ”€â”€ AppRoutes.tsx                  # Äá»‹nh nghÄ©a toÃ n bá»™ Route trong á»©ng dá»¥ng
â”‚   â””â”€â”€ ProtectedRoute.tsx             # Cháº·n quyá»n truy cáº­p Route Admin/Staff
â””â”€â”€ styles/                            # File Äá»‹nh kiá»ƒu CSS & Tailwind
    â””â”€â”€ globals.css                    # Master Stylesheet & Tailwind v4 Utilities
```

---

## CHÆ¯Æ NG 3: MÃ” HÃŒNH THIáº¾T Káº¾ VÃ€ QUY TRÃŒNH LUÃ‚N CHUYá»‚N Dá»® LIá»†U (DESIGN PATTERNS & DFD)

### 3.1. CÃ¡c Máº«u Thiáº¿t káº¿ Pháº§n má»m Ãp dá»¥ng (Design Patterns)

1. **Repository Pattern:**
   - TÃ¡ch biá»‡t hoÃ n toÃ n logic truy váº¥n CSDL khá»i Service báº±ng táº§ng Interface `JpaRepository`. GiÃºp dá»… dÃ ng báº£o trÃ¬ vÃ  viáº¿t Unit Test Mock Data.

2. **DTO (Data Transfer Object) Pattern:**
   - Sá»­ dá»¥ng cÃ¡c Ä‘á»‘i tÆ°á»£ng DTOs chuyÃªn biá»‡t cho Request vÃ  Response. Äáº£m báº£o an toÃ n dá»¯ liá»‡u, trÃ¡nh rÃ² rá»‰ thÃ´ng tin nháº¡y cáº£m (nhÆ° máº­t kháº©u bÄƒm BCrypt) ra ngoÃ i Frontend.

3. **Singleton Pattern:**
   - Ãp dá»¥ng trong Spring IoC Container Ä‘á»ƒ quáº£n lÃ½ cÃ¡c Spring Beans (`Services`, `Repositories`, `SecurityConfig`, `JwtTokenProvider`) duy nháº¥t má»™t Instance trong bá»™ nhá»›.

4. **Strategy / Adapter Pattern:**
   - TÃ­ch há»£p linh hoáº¡t cÃ¡c phÆ°Æ¡ng thá»©c thanh toÃ¡n khÃ¡c nhau (Thanh toÃ¡n COD hoáº·c Thanh toÃ¡n qua Cá»•ng PayOS QR) qua giao diá»‡n Ä‘á»‹nh chuáº©n chung.

5. **Observer / Asynchronous Event Listener Pattern:**
   - Khi Ä‘Æ¡n hÃ ng táº¡o thÃ nh cÃ´ng, há»‡ thá»‘ng phÃ¡t sá»± kiá»‡n gá»­i Email xÃ¡c nháº­n báº¥t Ä‘á»“ng bá»™ `@Async` thÃ´ng qua Spring TaskExecutor mÃ  khÃ´ng lÃ m ngháº½n luá»“ng xá»­ lÃ½ chÃ­nh.

---

### 3.2. SÆ¡ Ä‘á»“ Luá»“ng Dá»¯ liá»‡u Há»‡ thá»‘ng (Data Flow Diagram - DFD)

#### SÆ¡ Ä‘á»“ DFD Cáº¥p 0 (Context DFD):

```mermaid
graph TD
    UserCustomer((KhÃ¡ch hÃ ng))
    AdminStaff((Admin / Staff))
    PayOSSystem((PayOS Gateway))
    
    subgraph FoxStyleSystem ["ðŸŒ Há»† THá»NG THÆ¯Æ NG Máº I ÄIá»†N Tá»¬ FOXSTYLE"]
        MainSystem[á»¨ng dá»¥ng Web FoxStyle]
    end

    UserCustomer -->|1. YÃªu cáº§u ÄÄƒng kÃ½ / ÄÄƒng nháº­p / Tim kiáº¿m / Lá»c| MainSystem
    UserCustomer -->|2. Äáº·t hÃ ng & Gá»­i thÃ´ng tin Thanh toÃ¡n| MainSystem
    MainSystem -->>|3. Tráº£ vá» Danh sÃ¡ch Sáº£n pháº©m, Token JWT, QR PayOS| UserCustomer

    MainSystem -->|4. Gá»i API sinh mÃ£ VietQR Payment Link| PayOSSystem
    PayOSSystem -->>|5. Gá»­i Webhook xÃ¡c nháº­n Thanh toÃ¡n thÃ nh cÃ´ng| MainSystem

    AdminStaff -->|6. Cáº­p nháº­t Sáº£n pháº©m, Biáº¿n thá»ƒ, Coupon, Duyá»‡t Ä‘Æ¡n| MainSystem
    MainSystem -->>|7. Tráº£ vá» BÃ¡o cÃ¡o Doanh thu, Danh sÃ¡ch ÄÆ¡n| AdminStaff
```

#### SÆ¡ Ä‘á»“ DFD Cáº¥p 1 (Detailed Process DFD):

```mermaid
graph TD
    actorCust((KhÃ¡ch hÃ ng))
    
    subgraph Processes ["CÃC TIáº¾N TRÃŒNH Xá»¬ LÃ CHÃNH"]
        P1["1.0 XÃ¡c thá»±c & PhÃ¢n quyá»n (Auth Process)"]
        P2["2.0 TÃ¬m kiáº¿m & Duyá»‡t Sáº£n pháº©m (Catalog Process)"]
        P3["3.0 Quáº£n lÃ½ Giá» hÃ ng (Cart Process)"]
        P4["4.0 Xá»­ lÃ½ Äáº·t hÃ ng & Thanh toÃ¡n (Order Process)"]
        P5["5.0 Quáº£n trá»‹ & Duyá»‡t Ä‘Æ¡n (Admin Process)"]
    end

    subgraph DataStores ["CÃC KHO Dá»® LIá»†U (DATABASE TABLES)"]
        D1[("D1: Báº£ng users & roles")]
        D2[("D2: Báº£ng products & product_variants")]
        D3[("D3: Báº£ng carts & cart_details")]
        D4[("D4: Báº£ng orders & order_details")]
        D5[("D5: Báº£ng payments")]
    end

    actorCust -->|Username/Password/OAuth2| P1
    P1 <-->|Äá»c/Ghi User| D1

    actorCust -->|Tá»« khÃ³a, Filter Size/MÃ u| P2
    P2 <-->|Äá»c Sáº£n pháº©m & Tá»“n kho| D2

    actorCust -->|ThÃªm biáº¿n thá»ƒ vÃ o giá»| P3
    P3 <-->|Äá»c/Ghi Giá» hÃ ng| D3

    actorCust -->|ThÃ´ng tin giao hÃ ng & PayOS QR| P4
    P4 <-->|Äá»c/Ghi ÄÆ¡n hÃ ng| D4
    P4 <-->|Ghi Lá»‹ch sá»­ Giao dá»‹ch| D5
    P4 -->|Trá»« tá»“n kho| D2

    P5 <-->|Cáº­p nháº­t ÄÆ¡n & Quáº£n lÃ½ Kho| D4
    P5 <-->|Cáº­p nháº­t Tá»“n kho Biáº¿n thá»ƒ| D2
```

---

## CHÆ¯Æ NG 4: TIÃŠU CHUáº¨N THIáº¾T Káº¾ RESTFUL API & Xá»¬ LÃ Lá»–I (API STANDARDS & EXCEPTION HANDLING)

### 4.1. TiÃªu chuáº©n Thiáº¿t káº¿ RESTful API (REST API Guidelines)

1. **ÄÆ°á»ng dáº«n URIs Chuáº©n hÃ³a (Resource-Oriented URIs):**
   - Sá»­ dá»¥ng danh tá»« sá»‘ nhiá»u: `/api/v1/products`, `/api/v1/orders`, `/api/v1/categories`.
   - PhÃ¢n cáº¥p má»‘i quan há»‡ tÃ i nguyÃªn: `/api/v1/products/{id}/variants`, `/api/v1/users/{id}/addresses`.

2. **PhÆ°Æ¡ng thá»©c HTTP Verbs Chuáº©n:**
   - `GET`: Tra cá»©u Ä‘á»c dá»¯ liá»‡u (KhÃ´ng lÃ m thay Ä‘á»•i tráº¡ng thÃ¡i server).
   - `POST`: ThÃªm má»›i tÃ i nguyÃªn (Táº¡o Ä‘Æ¡n hÃ ng, Táº¡o sáº£n pháº©m, ÄÄƒng nháº­p).
   - `PUT`: Cáº­p nháº­t toÃ n bá»™ thÃ´ng tin tÃ i nguyÃªn (Sá»­a sáº£n pháº©m, Sá»­a Ä‘á»‹a chá»‰).
   - `PATCH`: Cáº­p nháº­t má»™t pháº§n tÃ i nguyÃªn (Cáº­p nháº­t tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng).
   - `DELETE`: XÃ³a tÃ i nguyÃªn (XÃ³a khá»i giá» hÃ ng, XÃ³a sáº£n pháº©m).

3. **MÃ£ Tráº¡ng thÃ¡i Pháº£n há»“i HTTP Status Codes:**
   - `200 OK`: Xá»­ lÃ½ yÃªu cáº§u thÃ nh cÃ´ng.
   - `201 Created`: Táº¡o má»›i tÃ i nguyÃªn thÃ nh cÃ´ng.
   - `400 Bad Request`: Dá»¯ liá»‡u gá»­i lÃªn sai Ä‘á»‹nh dáº¡ng hoáº·c vi pháº¡m quy táº¯c Validation.
   - `401 Unauthorized`: ChÆ°a Ä‘Äƒng nháº­p hoáº·c Token JWT khÃ´ng há»£p lá»‡ / háº¿t háº¡n.
   - `403 Forbidden`: ÄÃ£ Ä‘Äƒng nháº­p nhÆ°ng khÃ´ng cÃ³ Ä‘á»§ quyá»n truy cáº­p (`ROLE_CUSTOMER` cá»‘ vÃ o API Admin).
   - `404 Not Found`: KhÃ´ng tÃ¬m tháº¥y tÃ i nguyÃªn trong CSDL.
   - `500 Internal Server Error`: Lá»—i phÃ¡t sinh tá»« Server Backend.

---

### 4.2. CÆ¡ cháº¿ Xá»­ lÃ½ Ngoáº¡i lá»‡ Táº­p trung (Global Exception Handling)

Spring Boot Backend triá»ƒn khai lá»›p `@RestControllerAdvice` báº¯t vÃ  chuáº©n hÃ³a toÃ n bá»™ lá»—i ngoáº¡i lá»‡ phÃ¡t sinh trong há»‡ thá»‘ng vá» má»™t Ä‘á»‹nh dáº¡ng JSON thá»‘ng nháº¥t:

```json
{
  "timestamp": "2026-07-31T14:37:16+07:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Sáº£n pháº©m biáº¿n thá»ƒ Ão thun Äen Size L Ä‘Ã£ háº¿t hÃ ng trong kho!",
  "path": "/api/v1/orders"
}
```

---

## Lá»œI Káº¾T & LIÃŠN Káº¾T TÃ€I LIá»†U

TÃ i liá»‡u **Thiáº¿t káº¿ Cáº¥u trÃºc Pháº§n má»m FoxStyle** xÃ¡c láº­p mÃ´ hÃ¬nh kiáº¿n trÃºc phÃ¢n táº§ng, sÆ¡ Ä‘á»“ luá»“ng dá»¯ liá»‡u DFD vÃ  tiÃªu chuáº©n mÃ£ nguá»“n cho toÃ n bá»™ dá»± Ã¡n.

TÃ i liá»‡u nÃ y Ä‘Æ°á»£c Ä‘á»“ng bá»™ liÃªn káº¿t vá»›i:
- [Äáº·c táº£ YÃªu cáº§u Há»‡ thá»‘ng SRS](./yeu_cau_he_thong.md)
- [SÆ¡ Ä‘á»“ Use Case & Sequence Diagrams](./so_do_use_case.md)
- [Äáº·c táº£ Chi tiáº¿t 20 Ca sá»­ dá»¥ng](./dac_ta_use_case_chi_tiet.md)
- [MÃ´ táº£ Chi tiáº¿t CÃ¡c Chá»©c nÄƒng Há»‡ thá»‘ng](./mo_ta_chi_tiet_chuc_nang.md)
- [BÃ¡o cÃ¡o MÃ´ táº£ CÆ¡ sá»Ÿ Dá»¯ liá»‡u 43 Báº£ng](./BAO_CAO_MO_TA_CSDL_FOXSTYLE.md)
- [Thiáº¿t káº¿ Lá»›p MÃ£ nguá»“n Java (Class Diagrams)](./thiet_ke_lop_class_diagrams.md)
- [Thiáº¿t káº¿ Háº¡ táº§ng Máº¡ng & ChÃ­nh sÃ¡ch Há»‡ thá»‘ng](./thiet_ke_ha_tang_mang_va_chinh_sach.md)
