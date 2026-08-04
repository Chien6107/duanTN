# TÃ€I LIá»†U Äáº¶C Táº¢ CHI TIáº¾T 20 CA Sá»¬ Dá»¤NG (FULL USE CASE SPECIFICATIONS)
## Dá»± Ã¡n: Há»‡ thá»‘ng ThÆ°Æ¡ng máº¡i Äiá»‡n tá»­ Thá»i trang FoxStyle
**MÃ£ dá»± Ã¡n:** FOXSTYLE-DATN  
**NgÃ y cáº­p nháº­t:** 31/07/2026  
**Tráº¡ng thÃ¡i:** TÃ€I LIá»†U CHÃNH THá»¨C  

---

## Má»¤C Lá»¤C
- [DANH Má»¤C 20 CA Sá»¬ Dá»¤NG Há»† THá»NG](#danh-má»¥c-20-ca-sá»­-dá»¥ng-há»‡-thá»‘ng)
- [PHáº¦N 1: Äáº¶C Táº¢ CHI TIáº¾T PHÃ‚N Há»† KHÃCH HÃ€NG (STOREFRONT - UC-01 Äáº¾N UC-11)](#pháº§n-1-Ä‘áº·c-táº£-chi-tiáº¿t-phÃ¢n-há»‡-khÃ¡ch-hÃ ng-storefront---uc-01-Ä‘áº¿n-uc-11)
  - [UC-01: ÄÄƒng kÃ½ TÃ i khoáº£n KhÃ¡ch hÃ ng Má»›i](#uc-01-Ä‘Äƒng-kÃ½-tÃ i-khoáº£n-khÃ¡ch-hÃ ng-má»›i)
  - [UC-02: ÄÄƒng nháº­p & ÄÄƒng xuáº¥t Há»‡ thá»‘ng (JWT)](#uc-02-Ä‘Äƒng-nháº­p--Ä‘Äƒng-xuáº¥t-há»‡-thá»‘ng-jwt)
  - [UC-03: ÄÄƒng nháº­p Nhanh qua Google OAuth2](#uc-03-Ä‘Äƒng-nháº­p-nhanh-qua-google-oauth2)
  - [UC-04: KhÃ´i phá»¥c Máº­t kháº©u qua Email OTP](#uc-04-khÃ´i-phá»¥c-máº­t-kháº©u-qua-email-otp)
  - [UC-05: TÃ¬m kiáº¿m & Lá»c Sáº£n pháº©m Äa tiÃªu chÃ­](#uc-05-tÃ¬m-kiáº¿m--lá»c-sáº£n-pháº©m-Ä‘a-tiÃªu-chÃ­)
  - [UC-06: Xem Chi tiáº¿t Sáº£n pháº©m & Chá»n Biáº¿n thá»ƒ Kho](#uc-06-xem-chi-tiáº¿t-sáº£n-pháº©m--chá»n-biáº¿n-thá»ƒ-kho)
  - [UC-07: Quáº£n lÃ½ Giá» hÃ ng (Shopping Cart)](#uc-07-quáº£n-lÃ½-giá»-hÃ ng-shopping-cart)
  - [UC-08: Quáº£n lÃ½ Sá»• Ä‘á»‹a chá»‰ Giao hÃ ng (`user_addresses`)](#uc-08-quáº£n-lÃ½-sá»•-Ä‘á»‹a-chá»‰-giao-hÃ ng-user_addresses)
  - [UC-09: Äáº·t hÃ ng & Thanh toÃ¡n Tá»± Ä‘á»™ng PayOS QR / COD](#uc-09-Ä‘áº·t-hÃ ng--thanh-toÃ¡n-tá»±-Ä‘á»™ng-payos-qr--cod)
  - [UC-10: Xem Lá»‹ch sá»­ ÄÆ¡n hÃ ng & Há»§y Ä‘Æ¡n Chá» duyá»‡t](#uc-10-xem-lá»‹ch-sá»­-Ä‘Æ¡n-hÃ ng--há»§y-Ä‘Æ¡n-chá»-duyá»‡t)
  - [UC-11: Quáº£n lÃ½ Wishlist & Viáº¿t ÄÃ¡nh giÃ¡ Sáº£n pháº©m](#uc-11-quáº£n-lÃ½-wishlist--viáº¿t-Ä‘Ã¡nh-giÃ¡-sáº£n-pháº©m)
- [PHáº¦N 2: Äáº¶C Táº¢ CHI TIáº¾T PHÃ‚N Há»† QUáº¢N TRá»Š & Váº¬N HÃ€NH (ADMIN & STAFF - UC-12 Äáº¾N UC-20)](#pháº§n-2-Ä‘áº·c-táº£-chi-tiáº¿t-phÃ¢n-há»‡-quáº£n-trá»‹--váº­n-hÃ nh-admin--staff---uc-12-Ä‘áº¿n-uc-20)
  - [UC-12: Quáº£n lÃ½ Sáº£n pháº©m (CRUD) & ThÆ° viá»‡n áº¢nh phá»¥](#uc-12-quáº£n-lÃ½-sáº£n-pháº©m-crud--thÆ°-viá»‡n-áº£nh-phá»¥)
  - [UC-13: Quáº£n lÃ½ Biáº¿n thá»ƒ Kho hÃ ng (Size/MÃ u/SKU/Tá»“n kho)](#uc-13-quáº£n-lÃ½-biáº¿n-thá»ƒ-kho-hÃ ng-sizemÃ usku-tá»“n-kho)
  - [UC-14: Quáº£n lÃ½ Danh má»¥c Thá»i trang & Banner Quáº£ng cÃ¡o](#uc-14-quáº£n-lÃ½-danh-má»¥c-thá»i-trang--banner-quáº£ng-cÃ¡o)
  - [UC-15: Quáº£n lÃ½ MÃ£ giáº£m giÃ¡ (Coupons)](#uc-15-quáº£n-lÃ½-mÃ£-giáº£m-giÃ¡-coupons)
  - [UC-16: Tra cá»©u & TÃ¬m kiáº¿m ÄÆ¡n hÃ ng ToÃ n há»‡ thá»‘ng](#uc-16-tra-cá»©u--tÃ¬m-kiáº¿m-Ä‘Æ¡n-hÃ ng-toÃ n-há»‡-thá»‘ng)
  - [UC-17: Duyá»‡t & Cáº­p nháº­t Tiáº¿n trÃ¬nh Váº­n chuyá»ƒn ÄÆ¡n hÃ ng](#uc-17-duyá»‡t--cáº­p-nhat-tiáº¿n-trÃ¬nh-váº­n-chuyá»ƒn-Ä‘Æ¡n-hÃ ng)
  - [UC-18: Quáº£n lÃ½ & KhÃ³a/Má»Ÿ tÃ i khoáº£n KhÃ¡ch hÃ ng](#uc-18-quáº£n-lÃ½--khÃ³amá»Ÿ-tÃ i-khoáº£n-khÃ¡ch-hÃ ng)
  - [UC-19: Xem BÃ¡o cÃ¡o Thá»‘ng kÃª Doanh thu Recharts](#uc-19-xem-bÃ¡o-cÃ¡o-thá»‘ng-kÃª-doanh-thu-recharts)
  - [UC-20: Tra cá»©u Nháº­t kÃ½ Kiá»ƒm toÃ¡n (Audit Logs)](#uc-20-tra-cá»©u-nháº­t-kÃ½-kiá»ƒm-toÃ¡n-audit-logs)

---

## DANH Má»¤C 20 CA Sá»¬ Dá»¤NG Há»† THá»NG

| MÃ£ UC | TÃªn Ca sá»­ dá»¥ng | TÃ¡c nhÃ¢n chÃ­nh (Actors) | PhÃ¢n há»‡ |
|---|---|---|---|
| **UC-01** | ÄÄƒng kÃ½ TÃ i khoáº£n KhÃ¡ch hÃ ng Má»›i | KhÃ¡ch vÃ£ng lai | Storefront |
| **UC-02** | ÄÄƒng nháº­p & ÄÄƒng xuáº¥t Há»‡ thá»‘ng (JWT) | KhÃ¡ch vÃ£ng lai, KhÃ¡ch hÃ ng, Staff, Admin | Há»‡ thá»‘ng |
| **UC-03** | ÄÄƒng nháº­p Nhanh qua Google OAuth2 | KhÃ¡ch vÃ£ng lai, Google OAuth2 Service | Storefront |
| **UC-04** | KhÃ´i phá»¥c Máº­t kháº©u qua Email OTP | KhÃ¡ch hÃ ng, SMTP Mail Server | Storefront |
| **UC-05** | TÃ¬m kiáº¿m & Lá»c Sáº£n pháº©m Äa tiÃªu chÃ­ | KhÃ¡ch vÃ£ng lai, KhÃ¡ch hÃ ng | Storefront |
| **UC-06** | Xem Chi tiáº¿t Sáº£n pháº©m & Chá»n Biáº¿n thá»ƒ Kho | KhÃ¡ch vÃ£ng lai, KhÃ¡ch hÃ ng | Storefront |
| **UC-07** | Quáº£n lÃ½ Giá» hÃ ng (Shopping Cart) | KhÃ¡ch vÃ£ng lai, KhÃ¡ch hÃ ng | Storefront |
| **UC-08** | Quáº£n lÃ½ Sá»• Ä‘á»‹a chá»‰ Giao hÃ ng (`user_addresses`) | KhÃ¡ch hÃ ng | Storefront |
| **UC-09** | Äáº·t hÃ ng & Thanh toÃ¡n PayOS QR / COD | KhÃ¡ch hÃ ng, PayOS Gateway | Storefront |
| **UC-10** | Xem Lá»‹ch sá»­ ÄÆ¡n hÃ ng & Há»§y Ä‘Æ¡n Chá» duyá»‡t | KhÃ¡ch hÃ ng | Storefront |
| **UC-11** | Quáº£n lÃ½ Wishlist & Viáº¿t ÄÃ¡nh giÃ¡ Sáº£n pháº©m | KhÃ¡ch hÃ ng | Storefront |
| **UC-12** | Quáº£n lÃ½ Sáº£n pháº©m & ThÆ° viá»‡n áº¢nh phá»¥ | Quáº£n trá»‹ viÃªn (Admin) | Admin Portal |
| **UC-13** | Quáº£n lÃ½ Biáº¿n thá»ƒ Kho hÃ ng (Size/MÃ u/Tá»“n kho) | Quáº£n trá»‹ viÃªn (Admin) | Admin Portal |
| **UC-14** | Quáº£n lÃ½ Danh má»¥c Thá»i trang & Banner | Quáº£n trá»‹ viÃªn (Admin) | Admin Portal |
| **UC-15** | Quáº£n lÃ½ MÃ£ giáº£m giÃ¡ (Coupons) | Quáº£n trá»‹ viÃªn (Admin) | Admin Portal |
| **UC-16** | Tra cá»©u & TÃ¬m kiáº¿m ÄÆ¡n hÃ ng ToÃ n há»‡ thá»‘ng | NhÃ¢n viÃªn (Staff), Admin | Admin Portal |
| **UC-17** | Duyá»‡t & Cáº­p nháº­t Tiáº¿n trÃ¬nh Váº­n chuyá»ƒn | NhÃ¢n viÃªn (Staff), Admin | Admin Portal |
| **UC-18** | Quáº£n lÃ½ & KhÃ³a/Má»Ÿ tÃ i khoáº£n KhÃ¡ch hÃ ng | Quáº£n trá»‹ viÃªn (Admin) | Admin Portal |
| **UC-19** | Xem BÃ¡o cÃ¡o Thá»‘ng kÃª Doanh thu Recharts | Quáº£n trá»‹ viÃªn (Admin) | Admin Portal |
| **UC-20** | Tra cá»©u Nháº­t kÃ½ Kiá»ƒm toÃ¡n (Audit Logs) | Quáº£n trá»‹ viÃªn (Admin) | Admin Portal |

---

## PHáº¦N 1: Äáº¶C Táº¢ CHI TIáº¾T PHÃ‚N Há»† KHÃCH HÃ€NG (STOREFRONT - UC-01 Äáº¾N UC-11)

### UC-01: ÄÄƒng kÃ½ TÃ i khoáº£n KhÃ¡ch hÃ ng Má»›i

| Thuá»™c tÃ­nh | Chi tiáº¿t Ä‘áº·c táº£ |
| :--- | :--- |
| **TÃªn Ca sá»­ dá»¥ng** | ÄÄƒng kÃ½ TÃ i khoáº£n KhÃ¡ch hÃ ng Má»›i |
| **TÃ¡c nhÃ¢n chÃ­nh** | KhÃ¡ch vÃ£ng lai (Guest) |
| **MÃ´ táº£ ngáº¯n** | NgÆ°á»i dÃ¹ng chÆ°a cÃ³ tÃ i khoáº£n nháº­p thÃ´ng tin cÃ¡ nhÃ¢n Ä‘á»ƒ táº¡o tÃ i khoáº£n khÃ¡ch hÃ ng mua sáº¯m trÃªn FoxStyle. |
| **Tiá»n Ä‘iá»u kiá»‡n** | NgÆ°á»i dÃ¹ng Ä‘ang truy cáº­p trang Web FoxStyle vÃ  chÆ°a Ä‘Äƒng nháº­p. |
| **Háº­u Ä‘iá»u kiá»‡n** | TÃ i khoáº£n má»›i Ä‘Æ°á»£c khá»Ÿi táº¡o thÃ nh cÃ´ng trong báº£ng `users` vá»›i `role = ROLE_CUSTOMER`, `status = 1`. Máº­t kháº©u bÄƒm BCrypt. |
| **Luá»“ng sá»± kiá»‡n chÃ­nh (Basic Flow)** | 1. NgÆ°á»i dÃ¹ng báº¥m **"ÄÄƒng kÃ½"** táº¡i trang chá»§.<br>2. Form Ä‘Äƒng kÃ½ hiá»ƒn thá»‹. NgÆ°á»i dÃ¹ng nháº­p Username, Email, Máº­t kháº©u, Nháº­p láº¡i máº­t kháº©u, Há» vÃ  tÃªn.<br>3. NgÆ°á»i dÃ¹ng báº¥m nÃºt **"ÄÄƒng kÃ½"**.<br>4. Frontend kiá»ƒm tra tÃ­nh há»£p lá»‡ dá»¯ liá»‡u máº«u (Validation) vÃ  gá»­i request `POST /api/v1/auth/register`.<br>5. Backend kiá»ƒm tra Username vÃ  Email chÆ°a tá»“n táº¡i trong CSDL.<br>6. Backend mÃ£ hÃ³a bÄƒm máº­t kháº©u báº±ng BCrypt, táº¡o báº£n ghi user má»›i vÃ  lÆ°u vÃ o CSDL.<br>7. Tráº£ vá» HTTP 201 Created vÃ  thÃ´ng bÃ¡o "ÄÄƒng kÃ½ tÃ i khoáº£n thÃ nh cÃ´ng!".<br>8. Chuyá»ƒn hÆ°á»›ng ngÆ°á»i dÃ¹ng sang trang ÄÄƒng nháº­p. |
| **Luá»“ng ngoáº¡i lá»‡ (Exception Flows)** | * **5a. Username hoáº·c Email Ä‘Ã£ tá»“n táº¡i:** Backend tráº£ vá» lá»—i HTTP 400 Bad Request ("Email hoáº·c Username Ä‘Ã£ Ä‘Æ°á»£c sá»­ dá»¥ng").<br>* **4a. Máº­t kháº©u khÃ´ng khá»›p:** Frontend bÃ¡o lá»—i tá»©c thÃ¬ táº¡i form ("Máº­t kháº©u nháº­p láº¡i khÃ´ng chÃ­nh xÃ¡c"). |

---

### UC-02: ÄÄƒng nháº­p & ÄÄƒng xuáº¥t Há»‡ thá»‘ng (JWT)

| Thuá»™c tÃ­nh | Chi tiáº¿t Ä‘áº·c táº£ |
| :--- | :--- |
| **TÃªn Ca sá»­ dá»¥ng** | ÄÄƒng nháº­p & ÄÄƒng xuáº¥t Há»‡ thá»‘ng báº±ng JWT |
| **TÃ¡c nhÃ¢n chÃ­nh** | KhÃ¡ch vÃ£ng lai, KhÃ¡ch hÃ ng, NhÃ¢n viÃªn (Staff), Quáº£n trá»‹ viÃªn (Admin) |
| **MÃ´ táº£ ngáº¯n** | XÃ¡c thá»±c tÃ i khoáº£n báº±ng Username/Password vÃ  cáº¥p phiÃªn lÃ m viá»‡c JWT Token an toÃ n. |
| **Tiá»n Ä‘iá»u kiá»‡n** | ÄÃ£ cÃ³ tÃ i khoáº£n tá»“n táº¡i trong há»‡ thá»‘ng. |
| **Háº­u Ä‘iá»u kiá»‡n** | Cáº¥p JWT Access Token chá»©a thÃ´ng tin User ID, Email, Role vÃ  lÆ°u táº¡i Frontend `localStorage`. |
| **Luá»“ng sá»± kiá»‡n chÃ­nh (Basic Flow)** | 1. NgÆ°á»i dÃ¹ng báº¥m **"ÄÄƒng nháº­p"**.<br>2. Nháº­p Username/Email vÃ  Máº­t kháº©u âž” Báº¥m **"ÄÄƒng nháº­p"**.<br>3. Backend xÃ¡c minh thÃ´ng tin báº±ng `BCryptPasswordEncoder`.<br>4. Náº¿u há»£p lá»‡: Backend sinh JWT Token âž” Tráº£ vá» HTTP 200 OK + JWT Token + ThÃ´ng tin User.<br>5. Frontend lÆ°u Token vÃ o `localStorage` vÃ  cáº­p nháº­t giao diá»‡n á»©ng vá»›i vai trÃ² (`ROLE_CUSTOMER` hoáº·c `ROLE_ADMIN`). |
| **Luá»“ng ngoáº¡i lá»‡** | * **3a. Sai thÃ´ng tin:** BÃ¡o lá»—i "TÃ i khoáº£n hoáº·c máº­t kháº©u khÃ´ng chÃ­nh xÃ¡c".<br>* **3b. TÃ i khoáº£n bá»‹ khÃ³a:** Cá»™t `status = 0` âž” BÃ¡o lá»—i "TÃ i khoáº£n cá»§a báº¡n Ä‘Ã£ bá»‹ khÃ³a". |

---

### UC-03: ÄÄƒng nháº­p Nhanh qua Google OAuth2

| Thuá»™c tÃ­nh | Chi tiáº¿t Ä‘áº·c táº£ |
| :--- | :--- |
| **TÃªn Ca sá»­ dá»¥ng** | ÄÄƒng nháº­p Nhanh qua Google OAuth2 |
| **TÃ¡c nhÃ¢n chÃ­nh** | KhÃ¡ch vÃ£ng lai, Google OAuth2 Service |
| **MÃ´ táº£ ngáº¯n** | Cho phÃ©p khÃ¡ch hÃ ng Ä‘Äƒng nháº­p nhanh báº±ng tÃ i khoáº£n Google mÃ  khÃ´ng cáº§n nhá»› máº­t kháº©u. |
| **Tiá»n Ä‘iá»u kiá»‡n** | NgÆ°á»i dÃ¹ng cÃ³ tÃ i khoáº£n Google Ä‘ang hoáº¡t Ä‘á»™ng. |
| **Háº­u Ä‘iá»u kiá»‡n** | Há»‡ thá»‘ng xÃ¡c thá»±c Google Token, tá»± Ä‘á»™ng khá»Ÿi táº¡o user náº¿u má»›i vÃ  tráº£ vá» phiÃªn lÃ m viá»‡c JWT. |
| **Luá»“ng sá»± kiá»‡n chÃ­nh (Basic Flow)** | 1. KhÃ¡ch báº¥m nÃºt **"ÄÄƒng nháº­p báº±ng Google"** táº¡i Form Ä‘Äƒng nháº­p.<br>2. Google SDK má»Ÿ cá»­a sá»• Popup chá»n tÃ i khoáº£n Google.<br>3. KhÃ¡ch hÃ ng xÃ¡c nháº­n âž” Google tráº£ vá» `id_token`.<br>4. Frontend gá»­i `id_token` lÃªn API `POST /api/v1/auth/google`.<br>5. Backend xÃ¡c thá»±c token vá»›i Server Google âž” TrÃ­ch xuáº¥t Email, FullName.<br>6. Náº¿u Email chÆ°a cÃ³ trong CSDL âž” Tá»± táº¡o tÃ i khoáº£n má»›i vá»›i vai trÃ² `ROLE_CUSTOMER`.<br>7. PhÃ¡t hÃ nh JWT Token há»‡ thá»‘ng vÃ  tráº£ vá» Frontend. |

---

### UC-04: KhÃ´i phá»¥c Máº­t kháº©u qua Email OTP

| Thuá»™c tÃ­nh | Chi tiáº¿t Ä‘áº·c táº£ |
| :--- | :--- |
| **TÃªn Ca sá»­ dá»¥ng** | KhÃ´i phá»¥c Máº­t kháº©u qua Email OTP |
| **TÃ¡c nhÃ¢n chÃ­nh** | KhÃ¡ch hÃ ng, SMTP Mail Server |
| **MÃ´ táº£ ngáº¯n** | Cho phÃ©p khÃ¡ch hÃ ng bá»‹ quÃªn máº­t kháº©u láº¥y láº¡i máº­t kháº©u qua mÃ£ OTP gá»­i vá» Email. |
| **Tiá»n Ä‘iá»u kiá»‡n** | KhÃ¡ch hÃ ng nhá»› Email Ä‘Ã£ Ä‘Äƒng kÃ½ tÃ i khoáº£n. |
| **Háº­u Ä‘iá»u kiá»‡n** | Máº­t kháº©u tÃ i khoáº£n Ä‘Æ°á»£c cáº­p nháº­t bÄƒm BCrypt má»›i. |
| **Luá»“ng sá»± kiá»‡n chÃ­nh (Basic Flow)** | 1. KhÃ¡ch báº¥m **"QuÃªn máº­t kháº©u?"** âž” Nháº­p Email vÃ  báº¥m **"Gá»­i mÃ£ OTP"**.<br>2. Backend kiá»ƒm tra Email cÃ³ trong CSDL âž” Sinh mÃ£ OTP 6 sá»‘ ngáº«u nhiÃªn (háº¡n 5 phÃºt) lÆ°u vÃ o `otp_verifications`.<br>3. Backend gá»­i Email chá»©a mÃ£ OTP qua Gmail SMTP báº¥t Ä‘á»“ng bá»™ `@Async`.<br>4. KhÃ¡ch má»Ÿ Email láº¥y mÃ£ OTP âž” Nháº­p mÃ£ OTP vÃ  Máº­t kháº©u má»›i táº¡i mÃ n hÃ¬nh xÃ¡c nháº­n âž” Báº¥m **"Äá»•i máº­t kháº©u"**.<br>5. Backend kiá»ƒm tra OTP Ä‘Ãºng vÃ  chÆ°a háº¿t háº¡n âž” Cáº­p nháº­t máº­t kháº©u bÄƒm BCrypt má»›i. |

---

### UC-05: TÃ¬m kiáº¿m & Lá»c Sáº£n pháº©m Äa tiÃªu chÃ­

| Thuá»™c tÃ­nh | Chi tiáº¿t Ä‘áº·c táº£ |
| :--- | :--- |
| **TÃªn Ca sá»­ dá»¥ng** | TÃ¬m kiáº¿m & Lá»c Sáº£n pháº©m Äa tiÃªu chÃ­ |
| **TÃ¡c nhÃ¢n chÃ­nh** | KhÃ¡ch vÃ£ng lai, KhÃ¡ch hÃ ng |
| **MÃ´ táº£ ngáº¯n** | TÃ¬m kiáº¿m sáº£n pháº©m theo tá»« khÃ³a vÃ  lá»c Ä‘a tiÃªu chÃ­ khÃ´ng táº£i láº¡i trang. |
| **Tiá»n Ä‘iá»u kiá»‡n** | Dá»¯ liá»‡u danh má»¥c vÃ  sáº£n pháº©m Ä‘ang hoáº¡t Ä‘á»™ng. |
| **Háº­u Ä‘iá»u kiá»‡n** | Danh sÃ¡ch sáº£n pháº©m Ä‘Æ°á»£c cáº­p nháº­t hiá»ƒn thá»‹ khá»›p vá»›i bá»™ lá»c. |
| **Luá»“ng sá»± kiá»‡n chÃ­nh (Basic Flow)** | 1. KhÃ¡ch nháº­p tá»« khÃ³a tÃ¬m kiáº¿m (vÃ­ dá»¥: "Ão khoÃ¡c") hoáº·c vÃ o trang Sáº£n pháº©m.<br>2. KhÃ¡ch chá»n lá»c tiÃªu chÃ­ táº¡i Sidebar: Danh má»¥c, Size M, MÃ u Äen, Khoáº£ng giÃ¡ 300k-700k.<br>3. Frontend gá»­i request API `GET /api/v1/products` vá»›i cÃ¡c tham sá»‘ tÆ°Æ¡ng á»©ng.<br>4. Backend thá»±c hiá»‡n truy váº¥n JPA dynamic filter.<br>5. Hiá»ƒn thá»‹ danh sÃ¡ch sáº£n pháº©m khá»›p Ä‘iá»u kiá»‡n kÃ¨m phÃ¢n trang. |

---

### UC-06: Xem Chi tiáº¿t Sáº£n pháº©m & Chá»n Biáº¿n thá»ƒ Kho

| Thuá»™c tÃ­nh | Chi tiáº¿t Ä‘áº·c táº£ |
| :--- | :--- |
| **TÃªn Ca sá»­ dá»¥ng** | Xem Chi tiáº¿t Sáº£n pháº©m & Chá»n Biáº¿n thá»ƒ Kho |
| **TÃ¡c nhÃ¢n chÃ­nh** | KhÃ¡ch vÃ£ng lai, KhÃ¡ch hÃ ng |
| **MÃ´ táº£ ngáº¯n** | Xem thÃ´ng tin chi tiáº¿t, thÆ° viá»‡n áº£nh gÃ³c phá»¥ vÃ  chá»n biáº¿n thá»ƒ Size/MÃ u Ä‘á»ƒ xem tá»“n kho. |
| **Tiá»n Ä‘iá»u kiá»‡n** | KhÃ¡ch Ä‘ang truy cáº­p trang Chi tiáº¿t sáº£n pháº©m. |
| **Háº­u Ä‘iá»u kiá»‡n** | XÃ¡c Ä‘á»‹nh Ä‘Æ°á»£c biáº¿n thá»ƒ kháº£ dá»¥ng vÃ  sá»‘ lÆ°á»£ng tá»“n kho Ä‘á»ƒ Ä‘áº·t hÃ ng. |
| **Luá»“ng sá»± kiá»‡n chÃ­nh (Basic Flow)** | 1. KhÃ¡ch xem hÃ¬nh áº£nh, mÃ´ táº£, giÃ¡ bÃ¡n vÃ  Ä‘Ã¡nh giÃ¡ cá»§a sáº£n pháº©m.<br>2. KhÃ¡ch chá»n nÃºt **MÃ u sáº¯c** vÃ  **Size**.<br>3. Há»‡ thá»‘ng tra cá»©u báº£ng `product_variants` tráº£ vá» thÃ´ng tin sá»‘ lÆ°á»£ng tá»“n kho kháº£ dá»¥ng (`quantity`).<br>4. Náº¿u tá»“n kho > 0 âž” Hiá»ƒn thá»‹ sá»‘ lÆ°á»£ng cÃ²n hÃ ng vÃ  cho phÃ©p chá»n sá»‘ lÆ°á»£ng mua.<br>5. Náº¿u tá»“n kho = 0 âž” NÃºt ThÃªm giá» hÃ ng chuyá»ƒn sang "Háº¿t hÃ ng" (VÃ´ hiá»‡u hÃ³a). |

---

### UC-07: Quáº£n lÃ½ Giá» hÃ ng (Shopping Cart)

| Thuá»™c tÃ­nh | Chi tiáº¿t Ä‘áº·c táº£ |
| :--- | :--- |
| **TÃªn Ca sá»­ dá»¥ng** | Quáº£n lÃ½ Giá» hÃ ng (Shopping Cart) |
| **TÃ¡c nhÃ¢n chÃ­nh** | KhÃ¡ch vÃ£ng lai, KhÃ¡ch hÃ ng |
| **MÃ´ táº£ ngáº¯n** | ThÃªm sáº£n pháº©m biáº¿n thá»ƒ vÃ o giá» hÃ ng, cáº­p nháº­t sá»‘ lÆ°á»£ng, xÃ³a sáº£n pháº©m hoáº·c xÃ³a giá» hÃ ng. |
| **Tiá»n Ä‘iá»u kiá»‡n** | KhÃ¡ch hÃ ng Ä‘Ã£ chá»n má»™t biáº¿n thá»ƒ sáº£n pháº©m há»£p lá»‡. |
| **Háº­u Ä‘iá»u kiá»‡n** | Giá» hÃ ng Ä‘Æ°á»£c cáº­p nháº­t danh sÃ¡ch máº·t hÃ ng vÃ  tÃ­nh tá»•ng tiá»n táº¡m tÃ­nh. |
| **Luá»“ng sá»± kiá»‡n chÃ­nh (Basic Flow)** | 1. KhÃ¡ch báº¥m **"ThÃªm vÃ o giá» hÃ ng"** tá»« trang chi tiáº¿t.<br>2. Backend kiá»ƒm tra biáº¿n thá»ƒ cÃ²n Ä‘á»§ hÃ ng âž” ThÃªm má»›i hoáº·c cá»™ng dá»“n sá»‘ lÆ°á»£ng trong giá».<br>3. KhÃ¡ch vÃ o trang Giá» hÃ ng Ä‘á»ƒ Ä‘iá»u chá»‰nh tÄƒng/giáº£m sá»‘ lÆ°á»£ng tá»«ng mÃ³n hoáº·c xÃ³a mÃ³n khÃ´ng muá»‘n mua.<br>4. Há»‡ thá»‘ng cáº­p nháº­t tá»•ng chi phÃ­ tá»©c thÃ¬. |

---

### UC-08: Quáº£n lÃ½ Sá»• Ä‘á»‹a chá»‰ Giao hÃ ng (`user_addresses`)

| Thuá»™c tÃ­nh | Chi tiáº¿t Ä‘áº·c táº£ |
| :--- | :--- |
| **TÃªn Ca sá»­ dá»¥ng** | Quáº£n lÃ½ Sá»• Ä‘á»‹a chá»‰ Giao hÃ ng |
| **TÃ¡c nhÃ¢n chÃ­nh** | KhÃ¡ch hÃ ng |
| **MÃ´ táº£ ngáº¯n** | ThÃªm má»›i, sá»­a, xÃ³a cÃ¡c Ä‘á»‹a chá»‰ nháº­n hÃ ng vÃ  thiáº¿t láº­p Ä‘á»‹a chá»‰ máº·c Ä‘á»‹nh. |
| **Tiá»n Ä‘iá»u kiá»‡n** | KhÃ¡ch hÃ ng Ä‘Ã£ Ä‘Äƒng nháº­p tÃ i khoáº£n. |
| **Háº­u Ä‘iá»u kiá»‡n** | Báº£ng `user_addresses` cáº­p nháº­t danh sÃ¡ch Ä‘á»‹a chá»‰ nháº­n hÃ ng. |
| **Luá»“ng sá»± kiá»‡n chÃ­nh (Basic Flow)** | 1. KhÃ¡ch vÃ o má»¥c **"Sá»• Ä‘á»‹a chá»‰"** trong trang cÃ¡ nhÃ¢n âž” Báº¥m **"ThÃªm Ä‘á»‹a chá»‰ má»›i"**.<br>2. Nháº­p TÃªn ngÆ°á»i nháº­n, SÄT, Tá»‰nh/ThÃ nh, Quáº­n/Huyá»‡n, XÃ£/PhÆ°á»ng, Äá»‹a chá»‰ nhÃ .<br>3. TÃ­ch chá»n **"Äáº·t lÃ m Ä‘á»‹a chá»‰ máº·c Ä‘á»‹nh"** (`is_default = 1`) âž” Báº¥m **"LÆ°u"**.<br>4. Há»‡ thá»‘ng lÆ°u Ä‘á»‹a chá»‰ má»›i vÃ  bá» tÃ­ch máº·c Ä‘á»‹nh cá»§a cÃ¡c Ä‘á»‹a chá»‰ cÅ©. |

---

### UC-09: Äáº·t hÃ ng & Thanh toÃ¡n Tá»± Ä‘á»™ng PayOS QR / COD

| Thuá»™c tÃ­nh | Chi tiáº¿t Ä‘áº·c táº£ |
| :--- | :--- |
| **TÃªn Ca sá»­ dá»¥ng** | Äáº·t hÃ ng & Thanh toÃ¡n Tá»± Ä‘á»™ng PayOS QR / COD |
| **TÃ¡c nhÃ¢n chÃ­nh** | KhÃ¡ch hÃ ng, Cá»•ng thanh toÃ¡n PayOS |
| **MÃ´ táº£ ngáº¯n** | Táº¡o Ä‘Æ¡n hÃ ng, Ã¡p dá»¥ng coupon vÃ  chá»n thanh toÃ¡n COD hoáº·c quÃ©t mÃ£ VietQR PayOS. |
| **Tiá»n Ä‘iá»u kiá»‡n** | KhÃ¡ch hÃ ng cÃ³ Ã­t nháº¥t 1 sáº£n pháº©m trong giá» hÃ ng. |
| **Háº­u Ä‘iá»u kiá»‡n** | ÄÆ¡n hÃ ng táº¡o thÃ nh cÃ´ng trong CSDL, trá»« tá»“n kho biáº¿n thá»ƒ vÃ  xÃ³a sáº¡ch giá» hÃ ng. |
| **Luá»“ng sá»± kiá»‡n chÃ­nh (Basic Flow)** | 1. KhÃ¡ch báº¥m **"Thanh toÃ¡n"** táº¡i giá» hÃ ng âž” Chá»n Äá»‹a chá»‰ giao hÃ ng & MÃ£ giáº£m giÃ¡.<br>2. Chá»n PhÆ°Æ¡ng thá»©c thanh toÃ¡n (COD hoáº·c PayOS QR) âž” Báº¥m **"Äáº·t hÃ ng"**.<br>3. Backend má»Ÿ `@Transactional`: Kiá»ƒm tra kho, trá»« kho biáº¿n thá»ƒ, tÃ­nh tá»•ng tiá»n cuá»‘i.<br>4. **Náº¿u chá»n PayOS:** Gá»i PayOS API sinh mÃ£ QR âž” Hiá»ƒn thá»‹ Modal VietQR âž” KhÃ¡ch quÃ©t mÃ£ chuyá»ƒn tiá»n âž” Webhook PayOS tá»± cáº­p nháº­t `PAID` vÃ  `PROCESSING`.<br>5. **Náº¿u chá»n COD:** ÄÆ¡n hÃ ng lÆ°u á»Ÿ tráº¡ng thÃ¡i `PENDING`, `UNPAID` âž” Gá»­i email xÃ¡c nháº­n. |

---

### UC-10: Xem Lá»‹ch sá»­ ÄÆ¡n hÃ ng & Há»§y Ä‘Æ¡n Chá» duyá»‡t

| Thuá»™c tÃ­nh | Chi tiáº¿t Ä‘áº·c táº£ |
| :--- | :--- |
| **TÃªn Ca sá»­ dá»¥ng** | Xem Lá»‹ch sá»­ ÄÆ¡n hÃ ng & Há»§y Ä‘Æ¡n Chá» duyá»‡t |
| **TÃ¡c nhÃ¢n chÃ­nh** | KhÃ¡ch hÃ ng |
| **MÃ´ táº£ ngáº¯n** | Theo dÃµi tiáº¿n trÃ¬nh Ä‘Æ¡n hÃ ng Ä‘Ã£ Ä‘áº·t vÃ  há»§y Ä‘Æ¡n náº¿u Ä‘Æ¡n á»Ÿ tráº¡ng thÃ¡i `PENDING`. |
| **Tiá»n Ä‘iá»u kiá»‡n** | KhÃ¡ch hÃ ng Ä‘Ã£ Ä‘Äƒng nháº­p tÃ i khoáº£n. |
| **Háº­u Ä‘iá»u kiá»‡n** | ÄÆ¡n hÃ ng chuyá»ƒn tráº¡ng thÃ¡i `CANCELLED` vÃ  hoÃ n tráº£ sá»‘ lÆ°á»£ng kho náº¿u khÃ¡ch báº¥m há»§y. |
| **Luá»“ng sá»± kiá»‡n chÃ­nh (Basic Flow)** | 1. KhÃ¡ch truy cáº­p má»¥c **"Lá»‹ch sá»­ Ä‘Æ¡n hÃ ng"**.<br>2. Danh sÃ¡ch Ä‘Æ¡n hiá»ƒn thá»‹ phÃ¢n loáº¡i theo tráº¡ng thÃ¡i (Chá» duyá»‡t, Äang giao, ÄÃ£ giao, ÄÃ£ há»§y).<br>3. Äá»‘i vá»›i cÃ¡c Ä‘Æ¡n á»Ÿ tráº¡ng thÃ¡i `PENDING`, khÃ¡ch cÃ³ thá»ƒ báº¥m **"Há»§y Ä‘Æ¡n hÃ ng"** âž” Nháº­p lÃ½ do há»§y.<br>4. Backend cáº­p nháº­t `status = CANCELLED` vÃ  tá»± Ä‘á»™ng cá»™ng hoÃ n láº¡i tá»“n kho biáº¿n thá»ƒ. |

---

### UC-11: Quáº£n lÃ½ Wishlist & Viáº¿t ÄÃ¡nh giÃ¡ Sáº£n pháº©m

| Thuá»™c tÃ­nh | Chi tiáº¿t Ä‘áº·c táº£ |
| :--- | :--- |
| **TÃªn Ca sá»­ dá»¥ng** | Quáº£n lÃ½ Wishlist & Viáº¿t ÄÃ¡nh giÃ¡ Sáº£n pháº©m |
| **TÃ¡c nhÃ¢n chÃ­nh** | KhÃ¡ch hÃ ng |
| **MÃ´ táº£ ngáº¯n** | Tháº£ tim sáº£n pháº©m yÃªu thÃ­ch vÃ  viáº¿t bÃ¬nh luáº­n cháº¥m sao cho Ä‘Æ¡n hÃ ng Ä‘Ã£ giao thÃ nh cÃ´ng. |
| **Tiá»n Ä‘iá»u kiá»‡n** | ÄÃ£ mua sáº£n pháº©m vÃ  Ä‘Æ¡n hÃ ng á»Ÿ tráº¡ng thÃ¡i `DELIVERED` (Ä‘á»‘i vá»›i ÄÃ¡nh giÃ¡). |
| **Háº­u Ä‘iá»u kiá»‡n** | ÄÃ¡nh giÃ¡ lÆ°u vÃ o báº£ng `reviews` vÃ  hiá»ƒn thá»‹ cÃ´ng khai á»Ÿ chi tiáº¿t sáº£n pháº©m. |
| **Luá»“ng sá»± kiá»‡n chÃ­nh (Basic Flow)** | 1. KhÃ¡ch báº¥m icon TrÃ¡i tim Ä‘á»ƒ ThÃªm/XÃ³a sáº£n pháº©m khá»i danh sÃ¡ch yÃªu thÃ­ch.<br>2. Äá»‘i vá»›i sáº£n pháº©m Ä‘Ã£ mua giao thÃ nh cÃ´ng, khÃ¡ch báº¥m **"ÄÃ¡nh giÃ¡"** âž” Chá»n 1-5 sao vÃ  nháº­p bÃ¬nh luáº­n.<br>3. Backend verify quyá»n mua hÃ ng âž” LÆ°u review vÃ o CSDL. |

---

## PHáº¦N 2: Äáº¶C Táº¢ CHI TIáº¾T PHÃ‚N Há»† QUáº¢N TRá»Š & Váº¬N HÃ€NH (ADMIN & STAFF - UC-12 Äáº¾N UC-20)

### UC-12: Quáº£n lÃ½ Sáº£n pháº©m (CRUD) & ThÆ° viá»‡n áº¢nh phá»¥

| Thuá»™c tÃ­nh | Chi tiáº¿t Ä‘áº·c táº£ |
| :--- | :--- |
| **TÃªn Ca sá»­ dá»¥ng** | Quáº£n lÃ½ Sáº£n pháº©m (CRUD) & ThÆ° viá»‡n áº¢nh phá»¥ |
| **TÃ¡c nhÃ¢n chÃ­nh** | Quáº£n trá»‹ viÃªn (Admin) |
| **MÃ´ táº£ ngáº¯n** | ThÃªm má»›i, chá»‰nh sá»­a, áº©n/hiá»‡n sáº£n pháº©m vÃ  táº£i lÃªn bá»™ sÆ°u táº­p áº£nh gÃ³c phá»¥. |
| **Tiá»n Ä‘iá»u kiá»‡n** | ÄÄƒng nháº­p tÃ i khoáº£n cÃ³ vai trÃ² `ROLE_ADMIN`. |
| **Háº­u Ä‘iá»u kiá»‡n** | ThÃ´ng tin sáº£n pháº©m vÃ  áº£nh phá»¥ (`product_images`) lÆ°u hoÃ n chá»‰nh vÃ o CSDL. |
| **Luá»“ng sá»± kiá»‡n chÃ­nh (Basic Flow)** | 1. Admin vÃ o Admin Portal âž” Má»¥c **"Quáº£n lÃ½ Sáº£n pháº©m"** âž” Báº¥m **"ThÃªm sáº£n pháº©m"**.<br>2. Nháº­p TÃªn, GiÃ¡ bÃ¡n, GiÃ¡ niÃªm yáº¿t, MÃ´ táº£, Danh má»¥c, ThÆ°Æ¡ng hiá»‡u.<br>3. Upload danh sÃ¡ch áº£nh gÃ³c phá»¥, Ä‘Ã¡nh dáº¥u 1 áº£nh chÃ­nh (`is_primary = 1`).<br>4. Báº¥m **"LÆ°u sáº£n pháº©m"** âž” Backend má»Ÿ Transaction lÆ°u dá»¯ liá»‡u vÃ o `products` vÃ  `product_images`. |

---

### UC-13: Quáº£n lÃ½ Biáº¿n thá»ƒ Kho hÃ ng (Size/MÃ u/SKU/Tá»“n kho)

| Thuá»™c tÃ­nh | Chi tiáº¿t Ä‘áº·c táº£ |
| :--- | :--- |
| **TÃªn Ca sá»­ dá»¥ng** | Quáº£n lÃ½ Biáº¿n thá»ƒ Kho hÃ ng (Size/MÃ u/SKU/Tá»“n kho) |
| **TÃ¡c nhÃ¢n chÃ­nh** | Quáº£n trá»‹ viÃªn (Admin) |
| **MÃ´ táº£ ngáº¯n** | Thiáº¿t láº­p danh sÃ¡ch biáº¿n thá»ƒ MÃ u sáº¯c - KÃ­ch thÆ°á»›c, mÃ£ SKU vÃ  quáº£n lÃ½ sá»‘ lÆ°á»£ng tá»“n kho. |
| **Tiá»n Ä‘iá»u kiá»‡n** | ÄÃ£ táº¡o thÃ´ng tin sáº£n pháº©m chÃ­nh. |
| **Háº­u Ä‘iá»u kiá»‡n** | CÃ¡c báº£n ghi `product_variants` Ä‘Æ°á»£c cáº­p nháº­t chÃ­nh xÃ¡c sá»‘ lÆ°á»£ng tá»“n kho. |
| **Luá»“ng sá»± kiá»‡n chÃ­nh (Basic Flow)** | 1. Admin chá»n sáº£n pháº©m âž” Chuyá»ƒn sang tab **"Quáº£n lÃ½ Biáº¿n thá»ƒ & Kho"**.<br>2. ThÃªm cÃ¡c cáº·p thuá»™c tÃ­nh: MÃ u Äen - Size M (SKU: TSHIRT-BLK-M, Sá»‘ lÆ°á»£ng: 50).<br>3. Cáº­p nháº­t tÄƒng/giáº£m tá»“n kho khi nháº­p hÃ ng má»›i.<br>4. Há»‡ thá»‘ng tá»± ná»•i báº­t cáº£nh bÃ¡o náº¿u tá»“n kho biáº¿n thá»ƒ `< 5`. |

---

### UC-14: Quáº£n lÃ½ Danh má»¥c Thá»i trang & Banner Quáº£ng cÃ¡o

| Thuá»™c tÃ­nh | Chi tiáº¿t Ä‘áº·c táº£ |
| :--- | :--- |
| **TÃªn Ca sá»­ dá»¥ng** | Quáº£n lÃ½ Danh má»¥c Thá»i trang & Banner Quáº£ng cÃ¡o |
| **TÃ¡c nhÃ¢n chÃ­nh** | Quáº£n trá»‹ viÃªn (Admin) |
| **MÃ´ táº£ ngáº¯n** | Quáº£n lÃ½ danh má»¥c sáº£n pháº©m thá»i trang vÃ  thiáº¿t láº­p áº£nh banner quáº£ng cÃ¡o trang chá»§. |
| **Tiá»n Ä‘iá»u kiá»‡n** | ÄÄƒng nháº­p tÃ i khoáº£n `ROLE_ADMIN`. |
| **Háº­u Ä‘iá»u kiá»‡n** | Danh má»¥c vÃ  Banner hiá»ƒn thá»‹ Ä‘á»“ng bá»™ lÃªn giao diá»‡n Storefront. |
| **Luá»“ng sá»± kiá»‡n chÃ­nh (Basic Flow)** | 1. Admin táº¡o má»›i/sá»­a danh má»¥c thá»i trang (Ão, Quáº§n, VÃ¡y...) hoáº·c áº©n danh má»¥c.<br>2. ThÃªm áº£nh Banner quáº£ng cÃ¡o, cÃ i Ä‘áº·t link Ä‘iá»u hÆ°á»›ng vÃ  thá»© tá»± Æ°u tiÃªn hiá»ƒn thá»‹ (`display_order`). |

---

### UC-15: Quáº£n lÃ½ MÃ£ giáº£m giÃ¡ (Coupons)

| Thuá»™c tÃ­nh | Chi tiáº¿t Ä‘áº·c táº£ |
| :--- | :--- |
| **TÃªn Ca sá»­ dá»¥ng** | Quáº£n lÃ½ MÃ£ giáº£m giÃ¡ (Coupons) |
| **TÃ¡c nhÃ¢n chÃ­nh** | Quáº£n trá»‹ viÃªn (Admin) |
| **MÃ´ táº£ ngáº¯n** | Khá»Ÿi táº¡o mÃ£ coupon Æ°u Ä‘Ã£i, cáº¥u hÃ¬nh loáº¡i giáº£m giÃ¡ vÃ  cÃ¡c Ä‘iá»u kiá»‡n Ã¡p dá»¥ng. |
| **Tiá»n Ä‘iá»u kiá»‡n** | ÄÄƒng nháº­p tÃ i khoáº£n `ROLE_ADMIN`. |
| **Háº­u Ä‘iá»u kiá»‡n** | MÃ£ Coupon sáºµn sÃ ng Ä‘á»ƒ khÃ¡ch hÃ ng Ã¡p dá»¥ng táº¡i bÆ°á»›c Checkout. |
| **Luá»“ng sá»± kiá»‡n chÃ­nh (Basic Flow)** | 1. Admin vÃ o má»¥c **"Quáº£n lÃ½ Coupon"** âž” Báº¥m **"Táº¡o mÃ£ má»›i"**.<br>2. Nháº­p MÃ£ (vÃ­ dá»¥: `SUMMER50`), Chá»n Loáº¡i giáº£m (Cá»‘ Ä‘á»‹nh hoáº·c %), GiÃ¡ trá»‹ giáº£m, Giáº£m tá»‘i Ä‘a.<br>3. Nháº­p GiÃ¡ trá»‹ Ä‘Æ¡n tá»‘i thiá»ƒu (`min_order_value`), Giá»›i háº¡n lÆ°á»£t dÃ¹ng (`usage_limit`) vÃ  Háº¡n sá»­ dá»¥ng.<br>4. Báº¥m **"LÆ°u Coupon"**. |

---

### UC-16: Tra cá»©u & TÃ¬m kiáº¿m ÄÆ¡n hÃ ng ToÃ n há»‡ thá»‘ng

| Thuá»™c tÃ­nh | Chi tiáº¿t Ä‘áº·c táº£ |
| :--- | :--- |
| **TÃªn Ca sá»­ dá»¥ng** | Tra cá»©u & TÃ¬m kiáº¿m ÄÆ¡n hÃ ng ToÃ n há»‡ thá»‘ng |
| **TÃ¡c nhÃ¢n chÃ­nh** | NhÃ¢n viÃªn (Staff), Quáº£n trá»‹ viÃªn (Admin) |
| **MÃ´ táº£ ngáº¯n** | TÃ¬m kiáº¿m, lá»c Ä‘Æ¡n hÃ ng theo tráº¡ng thÃ¡i, ngÃ y Ä‘áº·t hoáº·c SÄT khÃ¡ch hÃ ng. |
| **Tiá»n Ä‘iá»u kiá»‡n** | TÃ i khoáº£n cÃ³ vai trÃ² `ROLE_STAFF` hoáº·c `ROLE_ADMIN`. |
| **Háº­u Ä‘iá»u kiá»‡n** | Danh sÃ¡ch Ä‘Æ¡n hÃ ng hiá»ƒn thá»‹ chÃ­nh xÃ¡c theo tiÃªu chÃ­ tra cá»©u. |
| **Luá»“ng sá»± kiá»‡n chÃ­nh (Basic Flow)** | 1. NhÃ¢n viÃªn truy cáº­p **"Quáº£n lÃ½ ÄÆ¡n hÃ ng"**.<br>2. Chá»n bá»™ lá»c: ÄÆ¡n chá» duyá»‡t (`PENDING`), ÄÆ¡n Ä‘Ã£ thanh toÃ¡n PayOS (`PAID`).<br>3. TÃ¬m kiáº¿m theo MÃ£ Ä‘Æ¡n hÃ ng hoáº·c Sá»‘ Ä‘iá»‡n thoáº¡i ngÆ°á»i nháº­n.<br>4. Hiá»ƒn thá»‹ chi tiáº¿t cÃ¡c máº·t hÃ ng trong Ä‘Æ¡n, tá»•ng tiá»n vÃ  Ä‘á»‹a chá»‰ giao hÃ ng. |

---

### UC-17: Duyá»‡t & Cáº­p nháº­t Tiáº¿n trÃ¬nh Váº­n chuyá»ƒn ÄÆ¡n hÃ ng

| Thuá»™c tÃ­nh | Chi tiáº¿t Ä‘áº·c táº£ |
| :--- | :--- |
| **TÃªn Ca sá»­ dá»¥ng** | Duyá»‡t & Cáº­p nháº­t Tiáº¿n trÃ¬nh Váº­n chuyá»ƒn ÄÆ¡n hÃ ng |
| **TÃ¡c nhÃ¢n chÃ­nh** | NhÃ¢n viÃªn (Staff), Quáº£n trá»‹ viÃªn (Admin) |
| **MÃ´ táº£ ngáº¯n** | Duyá»‡t Ä‘Æ¡n hÃ ng má»›i vÃ  chuyá»ƒn Ä‘á»•i tiáº¿n trÃ¬nh váº­n chuyá»ƒn Ä‘áº¿n khi hoÃ n táº¥t. |
| **Tiá»n Ä‘iá»u kiá»‡n** | ÄÆ¡n hÃ ng á»Ÿ tráº¡ng thÃ¡i há»£p lá»‡. |
| **Háº­u Ä‘iá»u kiá»‡n** | Tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng trong báº£ng `orders` Ä‘Æ°á»£c cáº­p nháº­t. |
| **Luá»“ng sá»± kiá»‡n chÃ­nh (Basic Flow)** | 1. NhÃ¢n viÃªn xem chi tiáº¿t Ä‘Æ¡n hÃ ng `PENDING`.<br>2. Báº¥m **"Duyá»‡t Ä‘Æ¡n"** âž” Chuyá»ƒn tráº¡ng thÃ¡i sang `CONFIRMED`.<br>3. ÄÃ³ng gÃ³i sáº£n pháº©m âž” Chuyá»ƒn sang `PROCESSING` âž” BÃ n giao váº­n chuyá»ƒn `SHIPPING`.<br>4. Giao hÃ ng thÃ nh cÃ´ng âž” Chuyá»ƒn sang `DELIVERED`. Há»‡ thá»‘ng khÃ³a khÃ´ng cho Ä‘á»•i tráº¡ng thÃ¡i ná»¯a. |

---

### UC-18: Quáº£n lÃ½ & KhÃ³a/Má»Ÿ tÃ i khoáº£n KhÃ¡ch hÃ ng

| Thuá»™c tÃ­nh | Chi tiáº¿t Ä‘áº·c táº£ |
| :--- | :--- |
| **TÃªn Ca sá»­ dá»¥ng** | Quáº£n lÃ½ & KhÃ³a/Má»Ÿ tÃ i khoáº£n KhÃ¡ch hÃ ng |
| **TÃ¡c nhÃ¢n chÃ­nh** | Quáº£n trá»‹ viÃªn (Admin) |
| **MÃ´ táº£ ngáº¯n** | Quáº£n lÃ½ danh sÃ¡ch ngÆ°á»i dÃ¹ng vÃ  khÃ³a cÃ¡c tÃ i khoáº£n vi pháº¡m Ä‘iá»u khoáº£n. |
| **Tiá»n Ä‘iá»u kiá»‡n** | ÄÄƒng nháº­p tÃ i khoáº£n `ROLE_ADMIN`. |
| **Háº­u Ä‘iá»u kiá»‡n** | Cá»™t `status` cá»§a ngÆ°á»i dÃ¹ng chuyá»ƒn sang `0` (KhÃ³a) hoáº·c `1` (Active). |
| **Luá»“ng sá»± kiá»‡n chÃ­nh (Basic Flow)** | 1. Admin vÃ o má»¥c **"Quáº£n lÃ½ KhÃ¡ch hÃ ng"**.<br>2. Tra cá»©u tÃ i khoáº£n vi pháº¡m âž” Báº¥m nÃºt **"KhÃ³a tÃ i khoáº£n"** (`status = 0`).<br>3. TÃ i khoáº£n bá»‹ khÃ³a sáº½ láº­p tá»©c bá»‹ thu há»“i phiÃªn Ä‘Äƒng nháº­p JWT vÃ  khÃ´ng thá»ƒ Ä‘Äƒng nháº­p láº¡i. |

---

### UC-19: Xem BÃ¡o cÃ¡o Thá»‘ng kÃª Doanh thu Recharts

| Thuá»™c tÃ­nh | Chi tiáº¿t Ä‘áº·c táº£ |
| :--- | :--- |
| **TÃªn Ca sá»­ dá»¥ng** | Xem BÃ¡o cÃ¡o Thá»‘ng kÃª Doanh thu Recharts |
| **TÃ¡c nhÃ¢n chÃ­nh** | Quáº£n trá»‹ viÃªn (Admin) |
| **MÃ´ táº£ ngáº¯n** | Xem biá»ƒu Ä‘á»“ trá»±c quan bÃ¡o cÃ¡o doanh thu, sá»‘ lÆ°á»£ng Ä‘Æ¡n hÃ ng vÃ  hÃ ng tá»“n kho. |
| **Tiá»n Ä‘iá»u kiá»‡n** | ÄÄƒng nháº­p tÃ i khoáº£n `ROLE_ADMIN`. |
| **Háº­u Ä‘iá»u kiá»‡n** | Dá»¯ liá»‡u thá»‘ng kÃª hiá»ƒn thá»‹ thá»i gian thá»±c dáº¡ng biá»ƒu Ä‘á»“ Recharts. |
| **Luá»“ng sá»± kiá»‡n chÃ­nh (Basic Flow)** | 1. Admin truy cáº­p trang **"Dashboard / Thá»‘ng kÃª"**.<br>2. Chá»n má»‘c thá»i gian: HÃ´m nay, 7 ngÃ y qua, ThÃ¡ng nÃ y, NÄƒm nay.<br>3. API tÃ­nh toÃ¡n dá»¯ liá»‡u tá»•ng há»£p tá»« CSDL.<br>4. Hiá»ƒn thá»‹ Biá»ƒu Ä‘á»“ Ä‘Æ°á»ng Doanh thu, Biá»ƒu Ä‘á»“ cá»™t Sáº£n pháº©m bÃ¡n cháº¡y vÃ  Thá»‘ng kÃª tá»· lá»‡ Ä‘Æ¡n há»§y. |

---

### UC-20: Tra cá»©u Nháº­t kÃ½ Kiá»ƒm toÃ¡n (Audit Logs)

| Thuá»™c tÃ­nh | Chi tiáº¿t Ä‘áº·c táº£ |
| :--- | :--- |
| **TÃªn Ca sá»­ dá»¥ng** | Tra cá»©u Nháº­t kÃ½ Kiá»ƒm toÃ¡n (Audit Logs) |
| **TÃ¡c nhÃ¢n chÃ­nh** | Quáº£n trá»‹ viÃªn (Admin) |
| **MÃ´ táº£ ngáº¯n** | Tra cá»©u lá»‹ch sá»­ cÃ¡c hÃ nh Ä‘á»™ng thay Ä‘á»•i dá»¯ liá»‡u nháº¡y cáº£m cá»§a Admin/Staff Ä‘á»ƒ phá»¥c vá»¥ kiá»ƒm toÃ¡n an ninh. |
| **Tiá»n Ä‘iá»u kiá»‡n** | ÄÄƒng nháº­p tÃ i khoáº£n `ROLE_ADMIN`. |
| **Háº­u Ä‘iá»u kiá»‡n** | Danh sÃ¡ch log kiá»ƒm toÃ¡n hiá»ƒn thá»‹ minh báº¡ch. |
| **Luá»“ng sá»± kiá»‡n chÃ­nh (Basic Flow)** | 1. Admin truy cáº­p má»¥c **"Nháº­t kÃ½ Kiá»ƒm toÃ¡n (Audit Logs)"**.<br>2. Lá»c theo TÃ¡c nhÃ¢n thá»±c hiá»‡n, Loáº¡i hÃ nh Ä‘á»™ng (Sá»­a sáº£n pháº©m, KhÃ³a tÃ i khoáº£n, Duyá»‡t Ä‘Æ¡n), Thá»i gian.<br>3. Hiá»ƒn thá»‹ thÃ´ng tin chi tiáº¿t: User ID, Báº£ng dá»¯ liá»‡u tÃ¡c Ä‘á»™ng, GiÃ¡ trá»‹ cÅ© (`old_value`), GiÃ¡ trá»‹ má»›i (`new_value`), Äá»‹a chá»‰ IP vÃ  Timestamp. |

---

## Lá»œI Káº¾T & LIÃŠN Káº¾T TÃ€I LIá»†U

TÃ i liá»‡u **Äáº·c táº£ Chi tiáº¿t 20 Ca sá»­ dá»¥ng FoxStyle** nÃ y cung cáº¥p mÃ´ táº£ hoÃ n chá»‰nh, chuáº©n hÃ³a vá» má»i luá»“ng tÆ°Æ¡ng tÃ¡c vÃ  xá»­ lÃ½ ngoáº¡i lá»‡ trong toÃ n bá»™ há»‡ thá»‘ng.

TÃ i liá»‡u nÃ y Ä‘Æ°á»£c Ä‘á»“ng bá»™ liÃªn káº¿t vá»›i:
- [Äáº·c táº£ YÃªu cáº§u Há»‡ thá»‘ng SRS](./yeu_cau_he_thong.md)
- [SÆ¡ Ä‘á»“ Use Case & Sequence Diagrams](./so_do_use_case.md)
- [MÃ´ táº£ Chi tiáº¿t CÃ¡c Chá»©c nÄƒng Há»‡ thá»‘ng](./mo_ta_chi_tiet_chuc_nang.md)
- [BÃ¡o cÃ¡o MÃ´ táº£ Chi tiáº¿t CÆ¡ sá»Ÿ Dá»¯ liá»‡u 43 Báº£ng](./BAO_CAO_MO_TA_CSDL_FOXSTYLE.md)
- [Thiáº¿t káº¿ Lá»›p MÃ£ nguá»“n Java (Class Diagrams)](./thiet_ke_lop_class_diagrams.md)
- [Thiáº¿t káº¿ Háº¡ táº§ng Máº¡ng & ChÃ­nh sÃ¡ch Há»‡ thá»‘ng](./thiet_ke_ha_tang_mang_va_chinh_sach.md)
