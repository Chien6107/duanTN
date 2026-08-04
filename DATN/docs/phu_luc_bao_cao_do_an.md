# PHá»¤ Lá»¤C BÃO CÃO Äá»’ ÃN Tá»T NGHIá»†P (APPENDIX)
## Dá»± Ã¡n: Há»‡ thá»‘ng ThÆ°Æ¡ng máº¡i Äiá»‡n tá»­ Thá»i trang FoxStyle
**MÃ£ dá»± Ã¡n:** FOXSTYLE-DATN  
**Loáº¡i Ä‘á» tÃ i:** XÃ¢y dá»±ng Pháº§n má»m (Software Development Project)  
**NgÃ y cáº­p nháº­t:** 31/07/2026  
**Tráº¡ng thÃ¡i:** TÃ€I LIá»†U CHÃNH THá»¨C BÃO CÃO Äá»’ ÃN  

---

## Má»¤C Lá»¤C
- [PHá»¤ Lá»¤C A: HÆ¯á»šNG DáºªN CÃ€I Äáº¶T VÃ€ KHá»žI CHáº Y Há»† THá»NG (INSTALLATION GUIDE)](#phá»¥-lá»¥c-a-hÆ°á»›ng-dáº«n-cÃ i-Ä‘áº·t-vÃ -khá»Ÿi-cháº¡y-há»‡-thá»‘ng-installation-guide)
  - [A.1. Khá»Ÿi cháº¡y CSDL Microsoft SQL Server 43 Báº£ng](#a1-khá»Ÿi-cháº¡y-csdl-microsoft-sql-server-43-báº£ng)
  - [A.2. Cáº¥u hÃ¬nh & Khá»Ÿi cháº¡y Backend Spring Boot (`DATN-BE`)](#a2-cáº¥u-hÃ¬nh--khá»Ÿi-cháº¡y-backend-spring-boot-datn-be)
  - [A.3. Cáº¥u hÃ¬nh & Khá»Ÿi cháº¡y Frontend React SPA (`DATN-FE`)](#a3-cáº¥u-hÃ¬nh--khá»Ÿi-cháº¡y-frontend-react-spa-datn-fe)
- [PHá»¤ Lá»¤C B: DANH Má»¤C CHI TIáº¾T RESTFUL API ENDPOINTS (API DICTIONARY)](#phá»¥-lá»¥c-b-danh-má»¥c-chi-tiáº¿t-restful-api-endpoints-api-dictionary)
- [PHá»¤ Lá»¤C C: MáºªU Dá»® LIá»†U Cáº¤U TRÃšC JSON WEBHOOK PAYOS (PAYOS JSON PAYLOADS)](#phá»¥-lá»¥c-c-máº«u-dá»¯-liá»‡u-cáº¥u-trÃºc-json-webhook-payos-payos-json-payloads)
- [PHá»¤ Lá»¤C D: DANH Má»¤C THUáº¬T NGá»® VÃ€ Tá»ª VIáº¾T Táº®T (GLOSSARY OF TERMS)](#phá»¥-lá»¥c-d-danh-má»¥c-thuáº­t-ngá»¯-vÃ -tá»«-viáº¿t-táº¯t-glossary-of-terms)

---

## PHá»¤ Lá»¤C A: HÆ¯á»šNG DáºªN CÃ€I Äáº¶T VÃ€ KHá»žI CHáº Y Há»† THá»NG (INSTALLATION GUIDE)

### A.1. Khá»Ÿi cháº¡y CSDL Microsoft SQL Server 43 Báº£ng

1. **YÃªu cáº§u cÃ i Ä‘áº·t:** CÃ i Ä‘áº·t Microsoft SQL Server 2019 / 2022 vÃ  cÃ´ng cá»¥ SQL Server Management Studio (SSMS).
2. **CÃ¡c bÆ°á»›c khá»Ÿi cháº¡y CSDL:**
   - BÆ°á»›c 1: Má»Ÿ cÃ´ng cá»¥ SSMS âž” ÄÄƒng nháº­p vÃ o SQL Server Local Instance.
   - BÆ°á»›c 2: Má»Ÿ file script SQL `foxstyle_db.sql` náº±m táº¡i thÆ° má»¥c gá»‘c cá»§a dá»± Ã¡n.
   - BÆ°á»›c 3: Thá»±c thi lá»‡nh (Execute hoáº·c phÃ­m `F5`) Ä‘á»ƒ tá»± Ä‘á»™ng khá»Ÿi táº¡o CSDL `foxstyle_db` vÃ  toÃ n bá»™ **43 báº£ng dá»¯ liá»‡u chuáº©n hÃ³a 3NF** kÃ¨m dá»¯ liá»‡u khá»Ÿi táº¡o ban Ä‘áº§u.

---

### A.2. Cáº¥u hÃ¬nh & Khá»Ÿi cháº¡y Backend Spring Boot (`DATN-BE`)

1. **File Cáº¥u hÃ¬nh `DATN-BE/src/main/resources/application.properties`:**

```properties
# 1. Cáº¥u hÃ¬nh Káº¿t ná»‘i MS SQL Server
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=foxstyle_db;encrypt=false;trustServerCertificate=true
spring.datasource.username=sa
spring.datasource.password=123456
spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver

# 2. Cáº¥u hÃ¬nh JPA & Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.SQLServerDialect

# 3. Cáº¥u hÃ¬nh JWT Token Secret
app.jwt.secret=FoxStyleSecretKeyMustBeVeryLongAndSecureForHMACSHA512Algorithm2026
app.jwt.expiration-ms=86400000

# 4. Cáº¥u hÃ¬nh Gmail SMTP Server (Gá»­i Mail OTP & ÄÆ¡n hÃ ng)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=foxstyle.fashion@gmail.com
spring.mail.password=your_app_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# 5. Cáº¥u hÃ¬nh PayOS Payment API Credentials
payos.client-id=your_payos_client_id
payos.api-key=your_payos_api_key
payos.checksum-key=your_payos_checksum_key
```

2. **Lá»‡nh Khá»Ÿi cháº¡y Backend Service:**
   - Má»Ÿ cá»­a sá»• Terminal táº¡i thÆ° má»¥c `DATN-BE/`.
   - Cháº¡y lá»‡nh Maven: `mvn clean install` âž” `mvn spring-boot:run`.
   - Backend API hoáº¡t Ä‘á»™ng táº¡i cá»•ng: `http://localhost:8080`.
   - TÃ i liá»‡u OpenAPI Swagger UI: `http://localhost:8080/swagger-ui/index.html`.

---

### A.3. Cáº¥u hÃ¬nh & Khá»Ÿi cháº¡y Frontend React SPA (`DATN-FE`)

1. **File Cáº¥u hÃ¬nh MÃ´i trÆ°á»ng `DATN-FE/.env`:**

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

2. **Lá»‡nh Khá»Ÿi cháº¡y Frontend Client:**
   - Má»Ÿ cá»­a sá»• Terminal táº¡i thÆ° má»¥c `DATN-FE/`.
   - CÃ i Ä‘áº·t thÆ° viá»‡n dependencies: `npm install`.
   - Cháº¡y mÃ´i trÆ°á»ng phÃ¡t triá»ƒn Dev Server: `npm run dev`.
   - TrÃ¬nh duyá»‡t truy cáº­p táº¡i Ä‘á»‹a chá»‰: `http://localhost:5173`.

---

## PHá»¤ Lá»¤C B: DANH Má»¤C CHI TIáº¾T RESTFUL API ENDPOINTS (API DICTIONARY)

| NhÃ³m Controller | Method | HTTP Endpoint URI | MÃ´ táº£ Chá»©c nÄƒng | PhÃ¢n quyá»n (Security Role) |
|---|:---:|---|---|---|
| **AuthController** | `POST` | `/api/v1/auth/register` | ÄÄƒng kÃ½ tÃ i khoáº£n khÃ¡ch hÃ ng má»›i | Public (`PermitAll`) |
| | `POST` | `/api/v1/auth/login` | ÄÄƒng nháº­p local & cáº¥p Token JWT | Public (`PermitAll`) |
| | `POST` | `/api/v1/auth/google` | ÄÄƒng nháº­p nhanh Google OAuth2 | Public (`PermitAll`) |
| | `POST` | `/api/v1/auth/forgot-password` | Gá»­i mÃ£ OTP khÃ´i phá»¥c máº­t kháº©u | Public (`PermitAll`) |
| **ProductController** | `GET` | `/api/v1/products` | Lá»c & TÃ¬m kiáº¿m sáº£n pháº©m Ä‘a tiÃªu chÃ­ | Public (`PermitAll`) |
| | `GET` | `/api/v1/products/{id}` | Xem chi tiáº¿t sáº£n pháº©m & biáº¿n thá»ƒ kho | Public (`PermitAll`) |
| | `POST` | `/api/v1/admin/products` | ThÃªm má»›i sáº£n pháº©m kÃ¨m biáº¿n thá»ƒ | `ROLE_ADMIN` |
| | `PUT` | `/api/v1/admin/products/{id}` | Cáº­p nháº­t thÃ´ng tin sáº£n pháº©m | `ROLE_ADMIN` |
| **CartController** | `GET` | `/api/v1/cart` | Láº¥y giá» hÃ ng ngÆ°á»i dÃ¹ng | Logged-in Users |
| | `POST` | `/api/v1/cart/items` | ThÃªm biáº¿n thá»ƒ sáº£n pháº©m vÃ o giá» | Logged-in Users |
| | `DELETE`| `/api/v1/cart/items/{id}` | XÃ³a máº·t hÃ ng khá»i giá» hÃ ng | Logged-in Users |
| **OrderController** | `POST` | `/api/v1/orders` | Äáº·t hÃ ng má»›i (COD / PayOS QR) | `ROLE_CUSTOMER` |
| | `GET` | `/api/v1/orders/my-orders` | Xem lá»‹ch sá»­ Ä‘Æ¡n hÃ ng cÃ¡ nhÃ¢n | `ROLE_CUSTOMER` |
| | `POST` | `/api/v1/orders/{id}/cancel` | Há»§y Ä‘Æ¡n hÃ ng á»Ÿ tráº¡ng thÃ¡i `PENDING` | `ROLE_CUSTOMER` |
| | `GET` | `/api/v1/admin/orders` | Tra cá»©u danh sÃ¡ch Ä‘Æ¡n toÃ n há»‡ thá»‘ng | `ROLE_STAFF`, `ROLE_ADMIN` |
| | `PATCH`| `/api/v1/admin/orders/{id}/status` | Duyá»‡t & Cáº­p nháº­t tráº¡ng thÃ¡i giao Ä‘Æ¡n | `ROLE_STAFF`, `ROLE_ADMIN` |
| **PaymentController**| `POST` | `/api/v1/payments/create-payos-link` | Sinh mÃ£ QR thanh toÃ¡n PayOS | `ROLE_CUSTOMER` |
| | `POST` | `/api/v1/payments/payos-webhook` | Webhook callback Ä‘á»‘i soÃ¡t tá»± Ä‘á»™ng | PayOS Gateway (Verify Signature) |
| **CouponController** | `POST` | `/api/v1/coupons/apply` | Kiá»ƒm tra & Ãp dá»¥ng mÃ£ giáº£m giÃ¡ | `ROLE_CUSTOMER` |
| | `POST` | `/api/v1/admin/coupons` | Khá»Ÿi táº¡o mÃ£ giáº£m giÃ¡ Coupon má»›i | `ROLE_ADMIN` |

---

## PHá»¤ Lá»¤C C: MáºªU Dá»® LIá»†U Cáº¤U TRÃšC JSON WEBHOOK PAYOS (PAYOS JSON PAYLOADS)

### 1. Request Payload YÃªu cáº§u Sinh mÃ£ VietQR Payment Link:
```json
{
  "orderCode": 857392,
  "amount": 450000,
  "description": "Thanh toan don hang ORD-857392",
  "cancelUrl": "http://localhost:5173/checkout/cancel",
  "returnUrl": "http://localhost:5173/checkout/success"
}
```

### 2. Payload Dá»¯ liá»‡u Webhook Callback tá»« Server PayOS:
```json
{
  "code": "00",
  "desc": "success",
  "data": {
    "orderCode": 857392,
    "amount": 450000,
    "description": "Thanh toan don hang ORD-857392",
    "accountNumber": "0383928172",
    "reference": "FT2621309852",
    "transactionDateTime": "2026-07-31 14:50:00",
    "currency": "VND",
    "paymentLinkId": "c3afed7c-f59f-4572-a9ee"
  },
  "signature": "a8f9c73e1b2d4f5e6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f"
}
```

---

## PHá»¤ Lá»¤C D: DANH Má»¤C THUáº¬T NGá»® VÃ€ Tá»ª VIáº¾T Táº®T (GLOSSARY OF TERMS)

| Tá»« viáº¿t táº¯t / Thuáº­t ngá»¯ | TÃªn tiáº¿ng Anh Ä‘áº§y Ä‘á»§ | Diá»…n giáº£i Ã nghÄ©a ChuyÃªn mÃ´n |
|---|---|---|
| **API** | Application Programming Interface | Giao diá»‡n láº­p trÃ¬nh á»©ng dá»¥ng káº¿t ná»‘i dá»¯ liá»‡u |
| **AR** | Augmented Reality | CÃ´ng nghá»‡ thá»±c táº¿ tÄƒng cÆ°á»ng |
| **BCrypt** | BCrypt Password Hashing | Thuáº­t toÃ¡n mÃ£ hÃ³a bÄƒm máº­t kháº©u má»™t chiá»u an toÃ n |
| **CSDL / RDBMS** | Relational Database Management System | Há»‡ quáº£n trá»‹ cÆ¡ sá»Ÿ dá»¯ liá»‡u quan há»‡ (MS SQL Server) |
| **DFD** | Data Flow Diagram | SÆ¡ Ä‘á»“ luá»“ng dá»¯ liá»‡u há»‡ thá»‘ng |
| **DTO** | Data Transfer Object | Äá»‘i tÆ°á»£ng chuyá»ƒn giao dá»¯ liá»‡u giá»¯a Client vÃ  Server |
| **ERD** | Entity Relationship Diagram | SÆ¡ Ä‘á»“ má»‘i quan há»‡ thá»±c thá»ƒ cÆ¡ sá»Ÿ dá»¯ liá»‡u |
| **HMAC SHA256** | Hash-based Message Authentication Code | Thuáº­t toÃ¡n sinh chá»¯ kÃ½ sá»‘ kiá»ƒm tra nguyÃªn váº¹n dá»¯ liá»‡u Webhook |
| **JPA** | Java Persistence API | Quy chuáº©n quáº£n lÃ½ lÆ°u trá»¯ dá»¯ liá»‡u ORM trong Java |
| **JWT** | JSON Web Token | Chuáº©n mÃ£ hÃ³a token xÃ¡c thá»±c phiÃªn Ä‘Äƒng nháº­p |
| **OOP** | Object-Oriented Programming | PhÆ°Æ¡ng phÃ¡p láº­p trÃ¬nh hÆ°á»›ng Ä‘á»‘i tÆ°á»£ng |
| **ORB / ORM** | Object-Relational Mapping | Ká»¹ thuáº­t Ã¡nh xáº¡ báº£ng CSDL thÃ nh lá»›p Äá»‘i tÆ°á»£ng Java |
| **RBAC** | Role-Based Access Control | CÆ¡ cháº¿ kiá»ƒm soÃ¡t truy cáº­p dá»±a trÃªn vai trÃ² ngÆ°á»i dÃ¹ng |
| **REST / RESTful** | Representational State Transfer | Kiá»ƒu kiáº¿n trÃºc truyá»n nháº­n dá»¯ liá»‡u qua giao thá»©c HTTP/JSON |
| **SKU** | Stock Keeping Unit | MÃ£ Ä‘Æ¡n vá»‹ quáº£n lÃ½ tá»“n kho duy nháº¥t cho tá»«ng biáº¿n thá»ƒ |
| **SPA** | Single Page Application | á»¨ng dá»¥ng Web Ä‘Æ¡n trang pháº£n há»“i mÆ°á»£t mÃ  khÃ´ng táº£i láº¡i trang |
| **SRS** | System Requirements Specification | TÃ i liá»‡u Ä‘áº·c táº£ yÃªu cáº§u há»‡ thá»‘ng pháº§n má»m |
| **UML** | Unified Modeling Language | NgÃ´n ngá»¯ mÃ´ hÃ¬nh hÃ³a thá»‘ng nháº¥t (Class/Sequence Diagram) |
| **VietQR** | Vietnam Quick Response Code | Chuáº©n mÃ£ QR thanh toÃ¡n ngÃ¢n hÃ ng tá»± Ä‘á»™ng táº¡i Viá»‡t Nam |

---

## Lá»œI Káº¾T & LIÃŠN Káº¾T TÃ€I LIá»†U

TÃ i liá»‡u **Phá»¥ lá»¥c BÃ¡o cÃ¡o Äá»“ Ã¡n Tá»‘t nghiá»‡p** Ä‘Ã£ cung cáº¥p hÆ°á»›ng dáº«n cÃ i Ä‘áº·t khá»Ÿi cháº¡y, tá»« Ä‘iá»ƒn RESTful API Endpoints vÃ  thuáº­t ngá»¯ chuyÃªn mÃ´n bá»• trá»£ cho toÃ n bá»™ cuá»‘n bÃ¡o cÃ¡o.

TÃ i liá»‡u nÃ y Ä‘Æ°á»£c Ä‘á»“ng bá»™ liÃªn káº¿t vá»›i:
- [Äáº·c táº£ YÃªu cáº§u Há»‡ thá»‘ng SRS](./yeu_cau_he_thong.md)
- [SÆ¡ Ä‘á»“ Use Case & Sequence Diagrams](./so_do_use_case.md)
- [Äáº·c táº£ Chi tiáº¿t 20 Ca sá»­ dá»¥ng](./dac_ta_use_case_chi_tiet.md)
- [Ma tráº­n Ãnh xáº¡ Use Case & Actor](./use_case_actor_mapping.md)
- [BÃ¡o cÃ¡o MÃ´ táº£ Chi tiáº¿t CÆ¡ sá»Ÿ Dá»¯ liá»‡u 43 Báº£ng](./BAO_CAO_MO_TA_CSDL_FOXSTYLE.md)
- [Thiáº¿t káº¿ CÆ¡ sá»Ÿ Dá»¯ liá»‡u 43 Báº£ng (Database Design)](./thiet_ke_co_so_du_lieu.md)
- [Thiáº¿t káº¿ Lá»›p MÃ£ nguá»“n Java (Class Diagrams)](./thiet_ke_lop_class_diagrams.md)
- [Thiáº¿t káº¿ Lá»›p 6 PhÃ¢n há»‡ chÃ­nh](./thiet_ke_lop_cac_phan_he_chinh.md)
- [Bá»™ 10 SÆ¡ Ä‘á»“ Tuáº§n tá»± (Sequence Diagrams)](./so_do_tuan_tu_sequence_diagrams.md)
- [Thiáº¿t káº¿ Cáº¥u trÃºc Pháº§n má»m (Software Architecture)](./thiet_ke_cau_truc_phan_mem.md)
- [BÃ¡o cÃ¡o Pháº§n 4: PhÃ¡t triá»ƒn & Thá»±c thi](./bao_cao_phan_4_phat_trien_thuc_thi.md)
- [BÃ¡o cÃ¡o Pháº§n 5: Thá»­ nghiá»‡m, ÄÃ¡nh giÃ¡ & HÆ°á»›ng phÃ¡t triá»ƒn](./bao_cao_phan_5_tong_ket_danh_gia_huong_phat_trien.md)
- [BÃ¡o cÃ¡o Pháº§n 6: HÆ°á»›ng phÃ¡t triá»ƒn & Pháº¡m vi á»¨ng dá»¥ng](./bao_cao_phan_6_huong_phat_trien_va_ung_dung.md)
- [Pháº§n Káº¿t luáº­n & Lá»i Cáº£m Æ¡n](./ket_luan_va_loi_cam_on.md)
- [Danh má»¥c TÃ i liá»‡u Tham kháº£o](./danh_muc_tai_lieu_tham_khao.md)
- [Thiáº¿t káº¿ Háº¡ táº§ng Máº¡ng & ChÃ­nh sÃ¡ch Há»‡ thá»‘ng](./thiet_ke_ha_tang_mang_va_chinh_sach.md)
