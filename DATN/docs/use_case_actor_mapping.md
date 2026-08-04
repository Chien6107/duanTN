# TÃ€I LIá»†U MA TRáº¬N ÃNH Xáº  CA Sá»¬ Dá»¤NG VÃ€ TÃC NHÃ‚N (USE CASE & ACTOR MAPPING SPECIFICATION)
## Dá»± Ã¡n: Há»‡ thá»‘ng ThÆ°Æ¡ng máº¡i Äiá»‡n tá»­ Thá»i trang FoxStyle
**MÃ£ dá»± Ã¡n:** FOXSTYLE-DATN  
**NgÃ y cáº­p nháº­t:** 31/07/2026  
**Tráº¡ng thÃ¡i:** TÃ€I LIá»†U CHÃNH THá»¨C  

---

## Má»¤C Lá»¤C
- [CHÆ¯Æ NG 1: PHÃ‚N Äá»ŠNH VÃ€ Káº¾ THá»ªA TÃC NHÃ‚N (ACTORS HIERARCHY & ROLES)](#chÆ°Æ¡ng-1-phÃ¢n-Ä‘á»‹nh-vÃ -káº¿-thá»«a-tÃ¡c-nhÃ¢n-actors-hierarchy--roles)
  - [1.1. Danh má»¥c TÃ¡c nhÃ¢n Con ngÆ°á»i & Há»‡ thá»‘ng](#11-danh-má»¥c-tÃ¡c-nhÃ¢n-con-ngÆ°á»i--há»‡-thá»‘ng)
  - [1.2. SÆ¡ Ä‘á»“ PhÃ¢n cáº¥p Káº¿ thá»«a Quyá»n háº¡n TÃ¡c nhÃ¢n](#12-sÆ¡-Ä‘á»“-phÃ¢n-cáº¥p-káº¿-thá»«a-quyá»n-háº¡n-tÃ¡c-nhÃ¢n)
- [CHÆ¯Æ NG 2: MA TRáº¬N ÃNH Xáº  USE CASE - ACTOR (USE CASE & ACTOR MAPPING MATRIX)](#chÆ°Æ¡ng-2-ma-tráº­n-Ã¡nh-xáº¡-use-case---actor-use-case--actor-mapping-matrix)
- [CHÆ¯Æ NG 3: MA TRáº¬N TRUY Váº¾T Tá»ª USE CASE âž” API ENDPOINT âž” CSDL (TRACEABILITY MATRIX)](#chÆ°Æ¡ng-3-ma-tráº­n-truy-váº¿t-tá»«-use-case--api-endpoint--csdl-traceability-matrix)
- [CHÆ¯Æ NG 4: MA TRáº¬N PHÃ‚N QUYá»€N API FILTER CHAIN (SPRING SECURITY RBAC MATRIX)](#chÆ°Æ¡ng-4-ma-tráº­n-phÃ¢n-quyá»n-api-filter-chain-spring-security-rbac-matrix)

---

## CHÆ¯Æ NG 1: PHÃ‚N Äá»ŠNH VÃ€ Káº¾ THá»ªA TÃC NHÃ‚N (ACTORS HIERARCHY & ROLES)

### 1.1. Danh má»¥c TÃ¡c nhÃ¢n Con ngÆ°á»i & Há»‡ thá»‘ng

Há»‡ thá»‘ng **FoxStyle** phÃ¢n Ä‘á»‹nh rÃµ 4 TÃ¡c nhÃ¢n Con ngÆ°á»i (Human Actors) vÃ  3 TÃ¡c nhÃ¢n Há»‡ thá»‘ng ngoÃ i (External System Actors):

#### A. TÃ¡c nhÃ¢n Con ngÆ°á»i (Human Actors):
1. ðŸ‘¤ **KhÃ¡ch vÃ£ng lai (Guest):** NgÆ°á»i dÃ¹ng truy cáº­p há»‡ thá»‘ng nhÆ°ng **chÆ°a Ä‘Äƒng kÃ½ / chÆ°a Ä‘Äƒng nháº­p tÃ i khoáº£n**.
2. ðŸ‘¤ **KhÃ¡ch hÃ ng (Customer):** NgÆ°á»i dÃ¹ng **Ä‘Ã£ Ä‘Äƒng kÃ½ tÃ i khoáº£n** vÃ  Ä‘Äƒng nháº­p thÃ nh cÃ´ng. *Káº¿ thá»«a toÃ n bá»™ quyá»n cá»§a KhÃ¡ch vÃ£ng lai vÃ  cÃ³ thÃªm quyá»n giao dá»‹ch mua sáº¯m, sá»• Ä‘á»‹a chá»‰, wishlist, Ä‘Ã¡nh giÃ¡*.
3. ðŸ‘” **NhÃ¢n viÃªn (Staff):** TÃ i khoáº£n váº­n hÃ nh cá»­a hÃ ng (`ROLE_STAFF`). Quáº£n lÃ½ Ä‘Æ¡n hÃ ng, duyá»‡t tiáº¿n trÃ¬nh váº­n chuyá»ƒn vÃ  theo dÃµi tá»“n kho.
4. ðŸ‘‘ **Quáº£n trá»‹ viÃªn (Admin):** NgÆ°á»i quáº£n trá»‹ tá»‘i cao (`ROLE_ADMIN`). *Káº¿ thá»«a toÃ n bá»™ quyá»n cá»§a NhÃ¢n viÃªn vÃ  cÃ³ toÃ n quyá»n quáº£n lÃ½ Sáº£n pháº©m, Biáº¿n thá»ƒ, Danh má»¥c, Banner, Coupon, KhÃ³a tÃ i khoáº£n vÃ  Xem bÃ¡o cÃ¡o doanh thu*.

#### B. TÃ¡c nhÃ¢n Há»‡ thá»‘ng ngoÃ i (External System Actors):
5. ðŸ’³ **PayOS Payment Gateway:** Cá»•ng thanh toÃ¡n xá»­ lÃ½ giao dá»‹ch quÃ©t mÃ£ VietQR tá»± Ä‘á»™ng vÃ  gá»­i Webhook callback.
6. ðŸ”‘ **Google OAuth2 Service:** Dá»‹ch vá»¥ xÃ¡c thá»±c Ä‘Äƒng nháº­p nhanh SSO qua tÃ i khoáº£n Google.
7. âœ‰ï¸ **Gmail SMTP Mail Server:** Dá»‹ch vá»¥ gá»­i email xÃ¡c nháº­n Ä‘Æ¡n hÃ ng vÃ  OTP báº¥t Ä‘á»“ng bá»™.

---

### 1.2. SÆ¡ Ä‘á»“ PhÃ¢n cáº¥p Káº¿ thá»«a Quyá»n háº¡n TÃ¡c nhÃ¢n

```mermaid
graph TD
    subgraph Human Actors Hierarchy
        Guest["ðŸ‘¤ KhÃ¡ch vÃ£ng lai<br>(ChÆ°a cÃ³ tÃ i khoáº£n)"]
        Customer["ðŸ‘¤ KhÃ¡ch hÃ ng<br>(ROLE_CUSTOMER)"]
        Staff["ðŸ‘” NhÃ¢n viÃªn<br>(ROLE_STAFF)"]
        Admin["ðŸ‘‘ Quáº£n trá»‹ viÃªn<br>(ROLE_ADMIN)"]
    end

    subgraph External Systems
        PayOS["ðŸ’³ PayOS Payment Gateway"]
        Google["ðŸ”‘ Google OAuth2 Service"]
        SMTP["âœ‰ï¸ SMTP Mail Server"]
    end

    %% Generalization / Inheritance
    Guest <|-- Customer
    Staff <|-- Admin
```

---

## CHÆ¯Æ NG 2: MA TRáº¬N ÃNH Xáº  USE CASE - ACTOR (USE CASE & ACTOR MAPPING MATRIX)

**KÃ½ hiá»‡u trong Báº£ng Ma tráº­n:**
- **`P` (Primary Actor):** TÃ¡c nhÃ¢n chÃ­nh trá»±c tiáº¿p khá»Ÿi táº¡o vÃ  tÆ°Æ¡ng tÃ¡c vá»›i Use Case.
- **`S` (Secondary Actor):** TÃ¡c nhÃ¢n phá»¥ hoáº·c Dá»‹ch vá»¥ há»‡ thá»‘ng ngoÃ i phá»‘i há»£p xá»­ lÃ½.
- **`I` (Inherited):** TÃ¡c nhÃ¢n káº¿ thá»«a quyá»n sá»­ dá»¥ng Use Case tá»« TÃ¡c nhÃ¢n cha.
- **`-` (No Access):** TÃ¡c nhÃ¢n khÃ´ng cÃ³ quyá»n truy cáº­p hay thá»±c hiá»‡n Use Case nÃ y.

| MÃ£ UC | TÃªn Ca sá»­ dá»¥ng (Use Case Name) | Guest | Customer | Staff | Admin | PayOS | Google | SMTP |
|:---:|---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **UC-01** | ÄÄƒng kÃ½ TÃ i khoáº£n Má»›i | **P** | - | - | - | - | - | - |
| **UC-02** | ÄÄƒng nháº­p & ÄÄƒng xuáº¥t (JWT Token) | **P** | **I** | **I** | **I** | - | - | - |
| **UC-03** | ÄÄƒng nháº­p Nhanh Google OAuth2 | **P** | **I** | - | - | - | **S** | - |
| **UC-04** | KhÃ´i phá»¥c Máº­t kháº©u qua Email OTP | - | **P** | - | - | - | - | **S** |
| **UC-05** | TÃ¬m kiáº¿m & Lá»c Sáº£n pháº©m Äa tiÃªu chÃ­ | **P** | **I** | **I** | **I** | - | - | - |
| **UC-06** | Xem Chi tiáº¿t Sáº£n pháº©m & Chá»n Biáº¿n thá»ƒ Kho | **P** | **I** | **I** | **I** | - | - | - |
| **UC-07** | Quáº£n lÃ½ Giá» hÃ ng (Add/Edit/Delete Cart) | **P** | **I** | - | - | - | - | - |
| **UC-08** | Quáº£n lÃ½ Sá»• Ä‘á»‹a chá»‰ Giao hÃ ng (`user_addresses`) | - | **P** | - | - | - | - | - |
| **UC-09** | Äáº·t hÃ ng & Thanh toÃ¡n PayOS / COD | - | **P** | - | - | **S** | - | **S** |
| **UC-10** | Xem Lá»‹ch sá»­ ÄÆ¡n hÃ ng & Há»§y Ä‘Æ¡n `PENDING` | - | **P** | - | - | - | - | - |
| **UC-11** | Quáº£n lÃ½ Wishlist & Viáº¿t ÄÃ¡nh giÃ¡ Sáº£n pháº©m | - | **P** | - | - | - | - | - |
| **UC-12** | Quáº£n lÃ½ Sáº£n pháº©m (CRUD) & áº¢nh phá»¥ | - | - | - | **P** | - | - | - |
| **UC-13** | Quáº£n lÃ½ Biáº¿n thá»ƒ Kho (Size/MÃ u/SKU/Tá»“n) | - | - | - | **P** | - | - | - |
| **UC-14** | Quáº£n lÃ½ Danh má»¥c Thá»i trang & Banner | - | - | - | **P** | - | - | - |
| **UC-15** | Quáº£n lÃ½ MÃ£ giáº£m giÃ¡ (Coupons) | - | - | - | **P** | - | - | - |
| **UC-16** | Tra cá»©u & TÃ¬m kiáº¿m ÄÆ¡n hÃ ng ToÃ n há»‡ thá»‘ng | - | - | **P** | **I** | - | - | - |
| **UC-17** | Duyá»‡t & Cáº­p nháº­t Tiáº¿n trÃ¬nh Váº­n chuyá»ƒn | - | - | **P** | **I** | - | - | - |
| **UC-18** | Quáº£n lÃ½ & KhÃ³a/Má»Ÿ tÃ i khoáº£n KhÃ¡ch hÃ ng | - | - | - | **P** | - | - | - |
| **UC-19** | Xem BÃ¡o cÃ¡o Thá»‘ng kÃª Doanh thu Recharts | - | - | - | **P** | - | - | - |
| **UC-20** | Tra cá»©u Nháº­t kÃ½ Kiá»ƒm toÃ¡n (Audit Logs) | - | - | - | **P** | - | - | - |

---

## CHÆ¯Æ NG 3: MA TRáº¬N TRUY Váº¾T Tá»ª USE CASE âž” API ENDPOINT âž” CSDL (TRACEABILITY MATRIX)

Báº£ng ma tráº­n truy váº¿t (Traceability Matrix) giÃºp Ä‘áº£m báº£o tÃ­nh Ä‘á»“ng nháº¥t 100% tá»« **YÃªu cáº§u Ca sá»­ dá»¥ng (Use Case)** Ä‘áº¿n **MÃ£ nguá»“n Backend RESTful API** vÃ  **Cáº¥u trÃºc Báº£ng CSDL SQL Server**:

| MÃ£ UC | TÃ¡c nhÃ¢n chÃ­nh | RESTful API Endpoint | PhÆ°Æ¡ng thá»©c HTTP | Báº£ng CSDL TÃ¡c Ä‘á»™ng (`foxstyle_db.sql`) |
|:---:|---|---|:---:|---|
| **UC-01** | Guest | `/api/v1/auth/register` | `POST` | `users`, `roles` |
| **UC-02** | All | `/api/v1/auth/login` | `POST` | `users`, `roles` |
| **UC-03** | Guest | `/api/v1/auth/google` | `POST` | `users`, `roles` |
| **UC-04** | Customer | `/api/v1/auth/forgot-password` | `POST` | `users`, `otp_verifications` |
| **UC-05** | Guest, Customer | `/api/v1/products` | `GET` | `products`, `categories`, `product_variants` |
| **UC-06** | Guest, Customer | `/api/v1/products/{id}` | `GET` | `products`, `product_variants`, `product_images` |
| **UC-07** | Guest, Customer | `/api/v1/cart/items` | `POST / PUT / DELETE` | `carts`, `cart_details`, `product_variants` |
| **UC-08** | Customer | `/api/v1/users/addresses` | `GET / POST / PUT / DELETE` | `user_addresses` |
| **UC-09** | Customer | `/api/v1/orders`<br>`/api/v1/payments/payos-webhook` | `POST`<br>`POST` | `orders`, `order_details`, `payments`, `product_variants`, `coupons` |
| **UC-10** | Customer | `/api/v1/orders/my-orders`<br>`/api/v1/orders/{id}/cancel` | `GET`<br>`POST` | `orders`, `order_details`, `product_variants` |
| **UC-11** | Customer | `/api/v1/wishlists`<br>`/api/v1/reviews` | `GET / POST / DELETE`<br>`POST` | `wishlists`, `reviews` |
| **UC-12** | Admin | `/api/v1/admin/products` | `POST / PUT / DELETE` | `products`, `product_images` |
| **UC-13** | Admin | `/api/v1/admin/products/{id}/variants` | `POST / PUT` | `product_variants` |
| **UC-14** | Admin | `/api/v1/admin/categories`<br>`/api/v1/admin/banners` | `POST / PUT / DELETE`<br>`POST / PUT / DELETE` | `categories`, `banners` |
| **UC-15** | Admin | `/api/v1/admin/coupons` | `POST / PUT / DELETE` | `coupons` |
| **UC-16** | Staff, Admin | `/api/v1/admin/orders` | `GET` | `orders`, `order_details`, `users` |
| **UC-17** | Staff, Admin | `/api/v1/admin/orders/{id}/status` | `PATCH` | `orders` |
| **UC-18** | Admin | `/api/v1/admin/users/{id}/status` | `PATCH` | `users` |
| **UC-19** | Admin | `/api/v1/admin/reports/finance` | `GET` | `orders`, `payments` |
| **UC-20** | Admin | `/api/v1/admin/audit-logs` | `GET` | `security_events`, `product_price_audit_logs` |

---

## CHÆ¯Æ NG 4: MA TRáº¬N PHÃ‚N QUYá»€N API FILTER CHAIN (SPRING SECURITY RBAC MATRIX)

MÃ£ nguá»“n Spring Security (`SecurityConfig.java`) Ã¡p dá»¥ng quy táº¯c phÃ¢n quyá»n Ä‘áº§u cuá»‘i (API Security Rules) dá»±a trÃªn JWT Token Role Claims:

| Dáº£i URL Endpoints API Pattern | PhÆ°Æ¡ng thá»©c HTTP | Vai trÃ² Ä‘Æ°á»£c phÃ©p truy cáº­p (Authorized Roles) | Xá»­ lÃ½ khi vi pháº¡m (Violation Result) |
|---|:---:|---|---|
| `/api/v1/auth/**` | `POST` | CÃ´ng khai (`PermitAll`) | - |
| `/api/v1/products/**` | `GET` | CÃ´ng khai (`PermitAll`) | - |
| `/api/v1/categories/**` | `GET` | CÃ´ng khai (`PermitAll`) | - |
| `/api/v1/banners/**` | `GET` | CÃ´ng khai (`PermitAll`) | - |
| `/api/v1/payments/payos-webhook` | `POST` | CÃ´ng khai (`PermitAll` + Verify HMAC Signature) | HTTP 400 Bad Request |
| `/api/v1/cart/**` | ALL | `ROLE_CUSTOMER`, `ROLE_STAFF`, `ROLE_ADMIN` | HTTP 401 Unauthorized |
| `/api/v1/users/addresses/**` | ALL | `ROLE_CUSTOMER`, `ROLE_STAFF`, `ROLE_ADMIN` | HTTP 401 Unauthorized |
| `/api/v1/orders/my-orders` | `GET` | `ROLE_CUSTOMER` | HTTP 401 Unauthorized |
| `/api/v1/orders` | `POST` | `ROLE_CUSTOMER` | HTTP 401 Unauthorized |
| `/api/v1/reviews` | `POST` | `ROLE_CUSTOMER` (ÄÃ£ mua sáº£n pháº©m `DELIVERED`) | HTTP 403 Forbidden |
| `/api/v1/staff/**` | ALL | `ROLE_STAFF`, `ROLE_ADMIN` | HTTP 403 Forbidden |
| `/api/v1/admin/orders/**` | ALL | `ROLE_STAFF`, `ROLE_ADMIN` | HTTP 403 Forbidden |
| `/api/v1/admin/**` | ALL | **Chá»‰ `ROLE_ADMIN`** | HTTP 403 Forbidden |

---

## Lá»œI Káº¾T & LIÃŠN Káº¾T TÃ€I LIá»†U

TÃ i liá»‡u **Ma tráº­n Ãnh xáº¡ Ca sá»­ dá»¥ng vÃ  TÃ¡c nhÃ¢n (Use Case & Actor Mapping Specification)** Ä‘Ã£ liÃªn káº¿t toÃ n bá»™ 20 Use Cases vá»›i 7 Actors, RESTful API Endpoints vÃ  43 Báº£ng CSDL.

TÃ i liá»‡u nÃ y Ä‘Æ°á»£c Ä‘á»“ng bá»™ liÃªn káº¿t vá»›i:
- [Äáº·c táº£ YÃªu cáº§u Há»‡ thá»‘ng SRS](./yeu_cau_he_thong.md)
- [SÆ¡ Ä‘á»“ Use Case & Sequence Diagrams](./so_do_use_case.md)
- [Äáº·c táº£ Chi tiáº¿t 20 Ca sá»­ dá»¥ng](./dac_ta_use_case_chi_tiet.md)
- [MÃ´ táº£ Chi tiáº¿t CÃ¡c Chá»©c nÄƒng Há»‡ thá»‘ng](./mo_ta_chi_tiet_chuc_nang.md)
- [BÃ¡o cÃ¡o MÃ´ táº£ CÆ¡ sá»Ÿ Dá»¯ liá»‡u 43 Báº£ng](./BAO_CAO_MO_TA_CSDL_FOXSTYLE.md)
- [Thiáº¿t káº¿ Lá»›p MÃ£ nguá»“n Java (Class Diagrams)](./thiet_ke_lop_class_diagrams.md)
- [Thiáº¿t káº¿ Cáº¥u trÃºc Pháº§n má»m (Software Architecture)](./thiet_ke_cau_truc_phan_mem.md)
- [Thiáº¿t káº¿ Háº¡ táº§ng Máº¡ng & ChÃ­nh sÃ¡ch Há»‡ thá»‘ng](./thiet_ke_ha_tang_mang_va_chinh_sach.md)
