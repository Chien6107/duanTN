# TÃ€I LIá»†U THIáº¾T Káº¾ CÆ  Sá»ž Dá»® LIá»†U (DATABASE DESIGN SPECIFICATION)
## Dá»± Ã¡n: Há»‡ thá»‘ng ThÆ°Æ¡ng máº¡i Äiá»‡n tá»­ Thá»i trang FoxStyle
**MÃ£ dá»± Ã¡n:** FOXSTYLE-DATN  
**NgÃ y cáº­p nháº­t:** 31/07/2026  
**Tráº¡ng thÃ¡i:** TÃ€I LIá»†U CHÃNH THá»¨C  

---

## Má»¤C Lá»¤C
- [CHÆ¯Æ NG 1: QUY CHUáº¨N VÃ€ TIÃŠU CHUáº¨N THIáº¾T Káº¾ CSDL](#chÆ°Æ¡ng-1-quy-chuáº©n-vÃ -tiÃªu-chuáº©n-thiáº¿t-káº¿-csdl)
  - [1.1. Há»‡ quáº£n trá»‹ & Chuáº©n hÃ³a Dá»¯ liá»‡u (RDBMS & 3NF)](#11-há»‡-quáº£n-trá»‹--chuáº©n-hÃ³a-dá»¯-liá»‡u-rdbms--3nf)
  - [1.2. Quy táº¯c Äáº·t tÃªn (Database Naming Conventions)](#12-quy-táº¯c-Ä‘áº·t-tÃªn-database-naming-conventions)
- [CHÆ¯Æ NG 2: SÆ  Äá»’ QUAN Há»† THá»°C THá»‚ Tá»”NG THá»‚ (MERMAID ERD DIAGRAM)](#chÆ°Æ¡ng-2-sÆ¡-Ä‘á»“-quan-há»‡-thá»±c-thá»ƒ-tá»•ng-thá»ƒ-mermaid-erd-diagram)
- [CHÆ¯Æ NG 3: Äáº¶C Táº¢ CHI TIáº¾T 43 Báº¢NG CÆ  Sá»ž Dá»® LIá»†U THEO 9 PHÃ‚N Há»†](#chÆ°Æ¡ng-3-Ä‘áº·c-táº£-chi-tiáº¿t-43-báº£ng-cÆ¡-sá»Ÿ-dá»¯-liá»‡u-theo-9-phÃ¢n-há»‡)
  - [3.1. PhÃ¢n há»‡ 1: TÃ i khoáº£n & Äá»‹nh danh (5 Báº£ng)](#31-phÃ¢n-há»‡-1-tÃ i-khoáº£n--Ä‘á»‹nh-danh-5-báº£ng)
  - [3.2. PhÃ¢n há»‡ 2: Danh má»¥c & Sáº£n pháº©m (7 Báº£ng)](#32-phÃ¢n-há»‡-2-danh-má»¥c--sáº£n-pháº©m-7-báº£ng)
  - [3.3. PhÃ¢n há»‡ 3: Giá» hÃ ng & Khuyáº¿n mÃ£i (6 Báº£ng)](#33-phÃ¢n-há»‡-3-giá»-hÃ ng--khuyáº¿n-mÃ£i-6-báº£ng)
  - [3.4. PhÃ¢n há»‡ 4: ÄÆ¡n hÃ ng & Thanh toÃ¡n (5 Báº£ng)](#34-phÃ¢n-há»‡-4-Ä‘Æ¡n-hÃ ng--thanh-toÃ¡n-5-báº£ng)
  - [3.5. PhÃ¢n há»‡ 5: TÆ°Æ¡ng tÃ¡c KhÃ¡ch hÃ ng & Há»— trá»£ (6 Báº£ng)](#35-phÃ¢n-há»‡-5-tÆ°Æ¡ng-tÃ¡c-khÃ¡ch-hÃ ng--há»—-trá»£-6-báº£ng)
  - [3.6. PhÃ¢n há»‡ 6: Ná»™i dung & BÃ i viáº¿t Blog (3 Báº£ng)](#36-phÃ¢n-há»‡-6-ná»™i-dung--bÃ i-viáº¿t-blog-3-báº£ng)
  - [3.7. PhÃ¢n há»‡ 7: Báº£o hÃ nh (2 Báº£ng)](#37-phÃ¢n-há»‡-7-báº£o-hÃ nh-2-báº£ng)
  - [3.8. PhÃ¢n há»‡ 8: Váº­n chuyá»ƒn & Cáº¥u hÃ¬nh (4 Báº£ng)](#38-phÃ¢n-há»‡-8-váº­n-chuyá»ƒn--cáº¥u-hÃ¬nh-4-báº£ng)
  - [3.9. PhÃ¢n há»‡ 9: Báº£o máº­t, Nháº­t kÃ½ & CRM (5 Báº£ng)](#39-phÃ¢n-há»‡-9-báº£o-máº­t-nháº­t-kÃ½--crm-5-báº£ng)
- [CHÆ¯Æ NG 4: CHá»ˆ Má»¤C (INDEXES), RÃ€NG BUá»˜C (CONSTRAINTS) & HIá»†U NÄ‚NG GIAO Dá»ŠCH](#chÆ°Æ¡ng-4-chá»‰-má»¥c-indexes-rÃ ng-buá»™c-constraints--hiá»‡u-nÄƒng-giao-dá»‹ch)

---

## CHÆ¯Æ NG 1: QUY CHUáº¨N VÃ€ TIÃŠU CHUáº¨N THIáº¾T Káº¾ CSDL

### 1.1. Há»‡ quáº£n trá»‹ & Chuáº©n hÃ³a Dá»¯ liá»‡u (RDBMS & 3NF)
- **Há»‡ quáº£n trá»‹ CSDL chÃ­nh:** Microsoft SQL Server 2019 / 2022.
- **Chuáº©n hÃ³a Dá»¯ liá»‡u:** Táº¥t cáº£ cÃ¡c báº£ng Ä‘Æ°á»£c thiáº¿t káº¿ tuÃ¢n thá»§ nghiÃªm ngáº·t **Chuáº©n hÃ³a 3NF (Third Normal Form)**, triá»‡t tiÃªu phá»¥ thuá»™c báº¯c cáº§u vÃ  dÆ° thá»«a dá»¯ liá»‡u.
- **Quy chuáº©n Kiá»ƒu dá»¯ liá»‡u (Data Types Standard):**
  - Tiáº¿ng Viá»‡t Unicode: DÃ¹ng `NVARCHAR(n)` hoáº·c `NVARCHAR(MAX)` vá»›i kÃ½ tá»± tiá»n tá»‘ `N'...'`.
  - Máº­t kháº©u bÄƒm: DÃ¹ng `VARCHAR(255)` chá»©a chuá»—i bÄƒm BCrypt.
  - Tiá»n tá»‡ & GiÃ¡ cáº£: DÃ¹ng `DECIMAL(18,2)` Ä‘á»ƒ trÃ¡nh sai sá»‘ lÃ m trÃ²n sá»‘ thá»±c.
  - Thá»i gian: DÃ¹ng `DATETIME2` vá»›i giÃ¡ trá»‹ máº·c Ä‘á»‹nh `SYSDATETIME()`.
  - Tráº¡ng thÃ¡i Cá»: DÃ¹ng `TINYINT` (`1`: Hoáº¡t Ä‘á»™ng/Hiá»ƒn thá»‹, `0`: Ngá»«ng/KhÃ³a/áº¨n) hoáº·c `BIT` (`1`/`0`).

### 1.2. Quy táº¯c Äáº·t tÃªn (Database Naming Conventions)
- **TÃªn Báº£ng (Table Names):** Danh tá»« sá»‘ nhiá»u viáº¿t thÆ°á»ng phÃ¢n cÃ¡ch bá»Ÿi dáº¥u gáº¡ch dÆ°á»›i (`snake_case`): `users`, `product_variants`, `order_details`, `user_addresses`.
- **TÃªn Cá»™t (Column Names):** Danh tá»« viáº¿t thÆ°á»ng (`snake_case`): `user_id`, `product_name`, `created_at`.
- **KhÃ³a chÃ­nh (Primary Key - PK):** Äáº·t tÃªn `[tÃªn_báº£ng_sá»‘_Ã­t]_id` vá»›i thuá»™c tÃ­nh `IDENTITY(1,1)` tá»± tÄƒng (vÃ­ dá»¥: `user_id`, `product_id`).
- **KhÃ³a ngoáº¡i (Foreign Key - FK):** Äáº·t tÃªn trÃ¹ng vá»›i tÃªn cá»™t khÃ³a chÃ­nh cá»§a báº£ng Ä‘Æ°á»£c tham chiáº¿u (vÃ­ dá»¥: `users.role_id -> roles.role_id`).

---

## CHÆ¯Æ NG 2: SÆ  Äá»’ QUAN Há»† THá»°C THá»‚ Tá»”NG THá»‚ (MERMAID ERD DIAGRAM)

```mermaid
erDiagram
    %% NhÃ³m 1: TÃ i khoáº£n & Äá»‹nh danh
    roles ||--o{ users : "phÃ¢n quyá»n"
    users ||--o{ user_addresses : "sá»Ÿ há»¯u Ä‘á»‹a chá»‰"
    users ||--o{ otp_verifications : "nháº­n mÃ£ OTP"
    users ||--o{ newsletter_subscriptions : "Ä‘Äƒng kÃ½ tin"

    %% NhÃ³m 2: Sáº£n pháº©m & ThÆ°Æ¡ng hiá»‡u
    brands ||--o{ products : "thuá»™c thÆ°Æ¡ng hiá»‡u"
    categories ||--o{ products : "phÃ¢n loáº¡i"
    products ||--o{ product_variants : "chá»©a SKU size/mÃ u"
    products ||--o{ product_images : "thÆ° viá»‡n áº£nh"
    products ||--o{ product_combo_items : "sáº£n pháº©m combo"
    products ||--o{ product_price_audit_logs : "lá»‹ch sá»­ giÃ¡"

    %% NhÃ³m 3: Giá» hÃ ng & Khuyáº¿n mÃ£i
    users ||--o{ carts : "sá»Ÿ há»¯u"
    carts ||--o{ cart_details : "chá»©a"
    product_variants ||--o{ cart_details : "biáº¿n thá»ƒ giá»"
    users ||--o{ saved_for_later : "lÆ°u mua sau"
    coupons ||--o{ orders : "Ã¡p dá»¥ng mÃ£"
    flash_sales ||--o{ flash_sale_products : "chÆ°Æ¡ng trÃ¬nh sale"
    products ||--o{ flash_sale_products : "sáº£n pháº©m sale"

    %% NhÃ³m 4: ÄÆ¡n hÃ ng & Thanh toÃ¡n
    users ||--o{ orders : "Ä‘áº·t hÃ ng"
    orders ||--o{ order_details : "chi tiáº¿t mÃ³n"
    product_variants ||--o{ order_details : "chá»‘t bÃ¡n"
    orders ||--o{ payments : "Ä‘á»‘i soÃ¡t thanh toÃ¡n"
    payments ||--o{ payment_reconciliations : "káº¿t quáº£ Ä‘á»‘i soÃ¡t"
    users ||--o{ user_coupons : "sá»Ÿ há»¯u mÃ£"

    %% NhÃ³m 5: TÆ°Æ¡ng tÃ¡c KhÃ¡ch hÃ ng
    users ||--o{ wishlists : "yÃªu thÃ­ch"
    products ||--o{ wishlists : "Ä‘Æ°á»£c thÃ­ch"
    users ||--o{ reviews : "viáº¿t Ä‘Ã¡nh giÃ¡"
    products ||--o{ reviews : "Ä‘Æ°á»£c Ä‘Ã¡nh giÃ¡"
    users ||--o{ chat_messages : "há»™i thoáº¡i CSKH"
    users ||--o{ notifications : "nháº­n thÃ´ng bÃ¡o"

    %% NhÃ³m 6: BÃ i viáº¿t Content
    article_topics ||--o{ articles : "chá»§ Ä‘á»"
    articles ||--o{ article_products : "gáº¯n sáº£n pháº©m"

    %% NhÃ³m 7: Báº£o hÃ nh
    warranty_policies ||--o{ warranty_claims : "chÃ­nh sÃ¡ch báº£o hÃ nh"
    orders ||--o{ warranty_claims : "yÃªu cáº§u báº£o hÃ nh"
```

---

## CHÆ¯Æ NG 3: Äáº¶C Táº¢ CHI TIáº¾T 43 Báº¢NG CÆ  Sá»ž Dá»® LIá»†U THEO 9 PHÃ‚N Há»†

### 3.1. PhÃ¢n há»‡ 1: TÃ i khoáº£n & Äá»‹nh danh (5 Báº£ng)

#### 1. Báº£ng `roles` (Vai trÃ² ngÆ°á»i dÃ¹ng)
| TÃªn Cá»™t | Kiá»ƒu Dá»¯ Liá»‡u | RÃ ng Buá»™c | GiÃ¡ Trá»‹ Máº·c Äá»‹nh | Diá»…n Giáº£i Nghiá»‡p Vá»¥ | Ãnh Xáº¡ JPA Entity |
|---|---|---|---|---|---|
| `role_id` | `INT` | PK, IDENTITY | Auto | MÃ£ Ä‘á»‹nh danh vai trÃ² | `@Id @GeneratedValue roleId` |
| `role_name` | `VARCHAR(50)` | UNIQUE, NOT NULL | None | TÃªn vai trÃ² (`ROLE_ADMIN`, `ROLE_STAFF`, `ROLE_CUSTOMER`) | `roleName` |
| `description` | `NVARCHAR(255)` | NULL | NULL | MÃ´ táº£ chi tiáº¿t quyá»n háº¡n | `description` |

#### 2. Báº£ng `users` (TÃ i khoáº£n ngÆ°á»i dÃ¹ng)
| TÃªn Cá»™t | Kiá»ƒu Dá»¯ Liá»‡u | RÃ ng Buá»™c | GiÃ¡ Trá»‹ Máº·c Äá»‹nh | Diá»…n Giáº£i Nghiá»‡p Vá»¥ | Ãnh Xáº¡ JPA Entity |
|---|---|---|---|---|---|
| `user_id` | `INT` | PK, IDENTITY | Auto | MÃ£ Ä‘á»‹nh danh ngÆ°á»i dÃ¹ng | `@Id userId` |
| `username` | `VARCHAR(50)` | UNIQUE, NOT NULL | None | TÃªn Ä‘Äƒng nháº­p há»‡ thá»‘ng | `username` |
| `password` | `VARCHAR(255)` | NOT NULL | None | Máº­t kháº©u Ä‘Ã£ mÃ£ hÃ³a bÄƒm BCrypt | `password` |
| `full_name` | `NVARCHAR(100)` | NOT NULL | None | Há» vÃ  tÃªn Ä‘áº§y Ä‘á»§ | `fullName` |
| `email` | `VARCHAR(100)` | UNIQUE, NOT NULL | None | Äá»‹a chá»‰ Email nháº­n OTP/giao dá»‹ch | `email` |
| `phone` | `VARCHAR(20)` | NULL | NULL | Sá»‘ Ä‘iá»‡n thoáº¡i nháº­n hÃ ng | `phone` |
| `status` | `TINYINT` | NOT NULL | `1` | Tráº¡ng thÃ¡i (`1`: Active, `0`: Blocked) | `status` |
| `role_id` | `INT` | FK -> roles | `3` | MÃ£ vai trÃ² ngÆ°á»i dÃ¹ng | `@ManyToOne Role role` |
| `created_at` | `DATETIME2` | NOT NULL | `SYSDATETIME()` | NgÃ y giá» khá»Ÿi táº¡o tÃ i khoáº£n | `createdAt` |

#### 3. Báº£ng `user_addresses` (Sá»• Ä‘á»‹a chá»‰ nháº­n hÃ ng)
- **Cáº¥u trÃºc:** `address_id` (PK), `user_id` (FK), `recipient_name` (NVARCHAR(100)), `phone` (VARCHAR(20)), `province` (NVARCHAR(100)), `district` (NVARCHAR(100)), `ward` (NVARCHAR(100)), `detail_address` (NVARCHAR(255)), `is_default` (BIT, Default 0).

#### 4. Báº£ng `otp_verifications` (XÃ¡c minh OTP qua Email)
- **Cáº¥u trÃºc:** `otp_id` (PK), `user_id` (FK), `otp_code` (VARCHAR(10)), `expiration_time` (DATETIME2), `is_used` (BIT, Default 0).

#### 5. Báº£ng `newsletter_subscriptions` (ÄÄƒng kÃ½ nháº­n tin)
- **Cáº¥u trÃºc:** `subscription_id` (PK), `email` (VARCHAR(100), UNIQUE), `subscribed_at` (DATETIME2), `status` (TINYINT).

---

### 3.2. PhÃ¢n há»‡ 2: Danh má»¥c & Sáº£n pháº©m (7 Báº£ng)

#### 6. Báº£ng `brands` (ThÆ°Æ¡ng hiá»‡u thá»i trang)
- **Cáº¥u trÃºc:** `brand_id` (PK), `brand_name` (NVARCHAR(100), UNIQUE), `logo_url` (VARCHAR(255)), `description` (NVARCHAR(500)), `status` (TINYINT).

#### 7. Báº£ng `categories` (Danh má»¥c thá»i trang)
- **Cáº¥u trÃºc:** `category_id` (PK), `category_name` (NVARCHAR(100), UNIQUE), `description` (NVARCHAR(500)), `status` (TINYINT).

#### 8. Báº£ng `products` (ThÃ´ng tin sáº£n pháº©m chÃ­nh & Combo)
| TÃªn Cá»™t | Kiá»ƒu Dá»¯ Liá»‡u | RÃ ng Buá»™c | GiÃ¡ Trá»‹ Máº·c Äá»‹nh | Diá»…n Giáº£i Nghiá»‡p Vá»¥ | Ãnh Xáº¡ JPA Entity |
|---|---|---|---|---|---|
| `product_id` | `INT` | PK, IDENTITY | Auto | MÃ£ sáº£n pháº©m | `@Id productId` |
| `product_name` | `NVARCHAR(150)` | NOT NULL | None | TÃªn sáº£n pháº©m thá»i trang | `productName` |
| `category_id` | `INT` | FK -> categories | NOT NULL | MÃ£ danh má»¥c sáº£n pháº©m | `@ManyToOne Category` |
| `brand_id` | `INT` | FK -> brands | NULL | MÃ£ thÆ°Æ¡ng hiá»‡u | `@ManyToOne Brand` |
| `price` | `DECIMAL(18,2)` | NOT NULL | `0.00` | GiÃ¡ bÃ¡n hiá»‡n táº¡i | `price` |
| `original_price` | `DECIMAL(18,2)` | NULL | NULL | GiÃ¡ niÃªm yáº¿t (náº¿u giáº£m giÃ¡) | `originalPrice` |
| `description` | `NVARCHAR(MAX)`| NULL | NULL | MÃ´ táº£ bÃ i viáº¿t chi tiáº¿t | `description` |
| `is_combo` | `BIT` | NOT NULL | `0` | ÄÃ¡nh dáº¥u sáº£n pháº©m Combo | `isCombo` |
| `status` | `TINYINT` | NOT NULL | `1` | `1`: Hiá»ƒn thá»‹ bÃ¡n, `0`: áº¨n | `status` |

#### 9. Báº£ng `product_variants` (Biáº¿n thá»ƒ Kho Size/MÃ u/SKU/Tá»“n kho)
| TÃªn Cá»™t | Kiá»ƒu Dá»¯ Liá»‡u | RÃ ng Buá»™c | GiÃ¡ Trá»‹ Máº·c Äá»‹nh | Diá»…n Giáº£i Nghiá»‡p Vá»¥ | Ãnh Xáº¡ JPA Entity |
|---|---|---|---|---|---|
| `variant_id` | `INT` | PK, IDENTITY | Auto | MÃ£ biáº¿n thá»ƒ sáº£n pháº©m | `@Id variantId` |
| `product_id` | `INT` | FK -> products | NOT NULL | MÃ£ sáº£n pháº©m chÃ­nh | `@ManyToOne Product` |
| `color` | `NVARCHAR(50)` | NOT NULL | None | MÃ u sáº¯c (Äen, Tráº¯ng, Be...) | `color` |
| `size` | `VARCHAR(20)` | NOT NULL | None | KÃ­ch thÆ°á»›c (S, M, L, XL) | `size` |
| `quantity` | `INT` | CHECK (>=0) | `0` | Sá»‘ lÆ°á»£ng tá»“n kho kháº£ dá»¥ng | `quantity` |
| `sku` | `VARCHAR(100)` | UNIQUE, NOT NULL| None | MÃ£ SKU duy nháº¥t quáº£n lÃ½ kho | `sku` |

#### 10. Báº£ng `product_images` (ThÆ° viá»‡n áº£nh sáº£n pháº©m)
- **Cáº¥u trÃºc:** `image_id` (PK), `product_id` (FK), `image_url` (VARCHAR(255)), `is_primary` (BIT, Default 0), `display_order` (INT, Default 1).

#### 11. Báº£ng `product_combo_items` (Sáº£n pháº©m con trong Combo)
- **Cáº¥u trÃºc:** `combo_item_id` (PK), `parent_product_id` (FK -> products), `child_product_id` (FK -> products), `quantity` (INT).

#### 12. Báº£ng `product_price_audit_logs` (Nháº­t kÃ½ thay Ä‘á»•i giÃ¡)
- **Cáº¥u trÃºc:** `log_id` (PK), `product_id` (FK), `old_price` (DECIMAL(18,2)), `new_price` (DECIMAL(18,2)), `changed_by` (FK -> users), `changed_at` (DATETIME2).

---

### 3.3. PhÃ¢n há»‡ 3: Giá» hÃ ng & Khuyáº¿n mÃ£i (6 Báº£ng)

#### 13. Báº£ng `carts` (Giá» hÃ ng ngÆ°á»i dÃ¹ng)
- **Cáº¥u trÃºc:** `cart_id` (PK), `user_id` (FK -> users, UNIQUE), `created_at` (DATETIME2).

#### 14. Báº£ng `cart_details` (Chi tiáº¿t máº·t hÃ ng giá»)
- **Cáº¥u trÃºc:** `cart_detail_id` (PK), `cart_id` (FK -> carts), `variant_id` (FK -> product_variants), `quantity` (INT).

#### 15. Báº£ng `saved_for_later` (Sáº£n pháº©m lÆ°u mua sau)
- **Cáº¥u trÃºc:** `saved_id` (PK), `user_id` (FK -> users), `variant_id` (FK -> product_variants), `created_at` (DATETIME2).

#### 16. Báº£ng `coupons` (MÃ£ giáº£m giÃ¡)
- **Cáº¥u trÃºc:** `coupon_id` (PK), `code` (VARCHAR(50), UNIQUE), `discount_type` (VARCHAR(20): FIXED/PERCENTAGE), `discount_value` (DECIMAL(18,2)), `max_discount_value` (DECIMAL(18,2)), `min_order_value` (DECIMAL(18,2)), `usage_limit` (INT), `used_count` (INT, Default 0), `start_date` (DATETIME2), `end_date` (DATETIME2), `status` (TINYINT).

#### 17. Báº£ng `flash_sales` (ChÆ°Æ¡ng trÃ¬nh Flash Sale)
- **Cáº¥u trÃºc:** `flash_sale_id` (PK), `title` (NVARCHAR(150)), `start_time` (DATETIME2), `end_time` (DATETIME2), `status` (TINYINT).

#### 18. Báº£ng `flash_sale_products` (Sáº£n pháº©m trong Flash Sale)
- **Cáº¥u trÃºc:** `flash_sale_product_id` (PK), `flash_sale_id` (FK), `product_id` (FK), `sale_price` (DECIMAL(18,2)), `stock_quantity` (INT).

---

### 3.4. PhÃ¢n há»‡ 4: ÄÆ¡n hÃ ng & Thanh toÃ¡n (5 Báº£ng)

#### 19. Báº£ng `orders` (ThÃ´ng tin Ä‘Æ¡n hÃ ng)
| TÃªn Cá»™t | Kiá»ƒu Dá»¯ Liá»‡u | RÃ ng Buá»™c | GiÃ¡ Trá»‹ Máº·c Äá»‹nh | Diá»…n Giáº£i Nghiá»‡p Vá»¥ |
|---|---|---|---|---|
| `order_id` | `INT` | PK, IDENTITY | Auto | MÃ£ Ä‘á»‹nh danh Ä‘Æ¡n hÃ ng |
| `order_code` | `VARCHAR(50)` | UNIQUE, NOT NULL | None | MÃ£ hiá»ƒn thá»‹ (vÃ­ dá»¥: `ORD-20260731-01`) |
| `user_id` | `INT` | FK -> users | NOT NULL | MÃ£ khÃ¡ch hÃ ng Ä‘áº·t |
| `total_amount` | `DECIMAL(18,2)` | NOT NULL | `0.00` | Tá»•ng giÃ¡ trá»‹ hÃ ng táº¡m tÃ­nh |
| `discount_amount`| `DECIMAL(18,2)` | NOT NULL | `0.00` | Tiá»n giáº£m giÃ¡ tá»« Coupon |
| `shipping_fee` | `DECIMAL(18,2)` | NOT NULL | `0.00` | PhÃ­ váº­n chuyá»ƒn giao hÃ ng |
| `final_amount` | `DECIMAL(18,2)` | NOT NULL | `0.00` | Tá»•ng tiá»n thanh toÃ¡n cuá»‘i |
| `payment_method` | `VARCHAR(30)` | NOT NULL | None | PhÆ°Æ¡ng thá»©c (`COD` / `PAYOS`) |
| `payment_status` | `VARCHAR(30)` | NOT NULL | `UNPAID` | Tráº¡ng thÃ¡i thanh toÃ¡n (`UNPAID`/`PAID`) |
| `status` | `VARCHAR(30)` | NOT NULL | `PENDING` | Tiáº¿n trÃ¬nh (`PENDING`/`CONFIRMED`/`SHIPPING`/`DELIVERED`/`CANCELLED`) |

#### 20. Báº£ng `order_details` (Chi tiáº¿t sáº£n pháº©m mua)
- **Cáº¥u trÃºc:** `order_detail_id` (PK), `order_id` (FK -> orders), `variant_id` (FK -> product_variants), `quantity` (INT), `unit_price` (DECIMAL(18,2)).

#### 21. Báº£ng `payments` (Giao dá»‹ch thanh toÃ¡n PayOS/COD)
- **Cáº¥u trÃºc:** `payment_id` (PK), `order_id` (FK -> orders), `transaction_code` (VARCHAR(100)), `payment_gateway` (VARCHAR(50)), `amount` (DECIMAL(18,2)), `status` (VARCHAR(30)), `paid_at` (DATETIME2).

#### 22. Báº£ng `payment_reconciliations` (Äá»‘i soÃ¡t thanh toÃ¡n ngÃ¢n hÃ ng)
- **Cáº¥u trÃºc:** `reconciliation_id` (PK), `payment_id` (FK -> payments), `bank_reference` (VARCHAR(100)), `reconciled_amount` (DECIMAL(18,2)), `status` (VARCHAR(30)), `reconciled_at` (DATETIME2).

#### 23. Báº£ng `user_coupons` (Lá»‹ch sá»­ sá»­ dá»¥ng Coupon)
- **Cáº¥u trÃºc:** `user_id` (FK -> users), `coupon_id` (FK -> coupons), `used_at` (DATETIME2), PK (`user_id`, `coupon_id`).

---

### 3.5. PhÃ¢n há»‡ 5: TÆ°Æ¡ng tÃ¡c KhÃ¡ch hÃ ng & Há»— trá»£ (6 Báº£ng)

#### 24. Báº£ng `wishlists` (Sáº£n pháº©m yÃªu thÃ­ch)
- **Cáº¥u trÃºc:** `wishlist_id` (PK), `user_id` (FK -> users), `product_id` (FK -> products), `created_at` (DATETIME2).

#### 25. Báº£ng `reviews` (ÄÃ¡nh giÃ¡ & Cháº¥m sao)
- **Cáº¥u trÃºc:** `review_id` (PK), `user_id` (FK), `product_id` (FK), `rating` (INT: 1-5), `comment` (NVARCHAR(1000)), `status` (TINYINT: 1=Approved, 0=Hidden), `created_at` (DATETIME2).

#### 26. Báº£ng `banners` (Banner quáº£ng cÃ¡o)
- **Cáº¥u trÃºc:** `banner_id` (PK), `title` (NVARCHAR(150)), `image_url` (VARCHAR(255)), `link_url` (VARCHAR(255)), `display_order` (INT), `status` (TINYINT).

#### 27. Báº£ng `notifications` (ThÃ´ng bÃ¡o há»‡ thá»‘ng)
- **Cáº¥u trÃºc:** `notification_id` (PK), `user_id` (FK), `title` (NVARCHAR(150)), `message` (NVARCHAR(500)), `is_read` (BIT), `created_at` (DATETIME2).

#### 28. Báº£ng `chat_messages` (Tin nháº¯n Livechat CSKH)
- **Cáº¥u trÃºc:** `message_id` (PK), `sender_id` (FK -> users), `receiver_id` (FK -> users), `message_text` (NVARCHAR(MAX)), `sent_at` (DATETIME2).

#### 29. Báº£ng `contact_messages` (Ná»™i dung liÃªn há»‡)
- **Cáº¥u trÃºc:** `contact_id` (PK), `full_name` (NVARCHAR(100)), `email` (VARCHAR(100)), `phone` (VARCHAR(20)), `subject` (NVARCHAR(200)), `message` (NVARCHAR(MAX)), `status` (TINYINT).

---

### 3.6. PhÃ¢n há»‡ 6: Ná»™i dung & BÃ i viáº¿t Blog (3 Báº£ng)

#### 30. Báº£ng `article_topics` (Chá»§ Ä‘á» bÃ i viáº¿t Blog)
- **Cáº¥u trÃºc:** `topic_id` (PK), `topic_name` (NVARCHAR(100), UNIQUE), `description` (NVARCHAR(255)).

#### 31. Báº£ng `articles` (BÃ i viáº¿t thá»i trang)
- **Cáº¥u trÃºc:** `article_id` (PK), `title` (NVARCHAR(255)), `topic_id` (FK), `author_id` (FK -> users), `thumbnail_url` (VARCHAR(255)), `content` (NVARCHAR(MAX)), `status` (TINYINT), `published_at` (DATETIME2).

#### 32. Báº£ng `article_products` (Sáº£n pháº©m Ä‘Ã­nh kÃ¨m bÃ i viáº¿t)
- **Cáº¥u trÃºc:** `article_id` (FK), `product_id` (FK), PK (`article_id`, `product_id`).

---

### 3.7. PhÃ¢n há»‡ 7: Báº£o hÃ nh (2 Báº£ng)

#### 33. Báº£ng `warranty_policies` (ChÃ­nh sÃ¡ch báº£o hÃ nh)
- **Cáº¥u trÃºc:** `policy_id` (PK), `policy_name` (NVARCHAR(150)), `warranty_months` (INT), `terms_condition` (NVARCHAR(MAX)).

#### 34. Báº£ng `warranty_claims` (YÃªu cáº§u báº£o hÃ nh)
- **Cáº¥u trÃºc:** `claim_id` (PK), `order_id` (FK), `product_id` (FK), `issue_description` (NVARCHAR(MAX)), `status` (VARCHAR(30)), `created_at` (DATETIME2).

---

### 3.8. PhÃ¢n há»‡ 8: Váº­n chuyá»ƒn & Cáº¥u hÃ¬nh (4 Báº£ng)

#### 35. Báº£ng `districts` (PhÃ­ giao hÃ ng theo Quáº­n/Huyá»‡n)
- **Cáº¥u trÃºc:** `district_id` (PK), `district_name` (NVARCHAR(100)), `province_name` (NVARCHAR(100)), `shipping_fee` (DECIMAL(18,2)).

#### 36. Báº£ng `store_branches` (Showroom/Chi nhÃ¡nh cá»­a hÃ ng)
- **Cáº¥u trÃºc:** `branch_id` (PK), `branch_name` (NVARCHAR(150)), `address` (NVARCHAR(255)), `phone` (VARCHAR(20)), `latitude` (FLOAT), `longitude` (FLOAT).

#### 37. Báº£ng `shipping_carriers` (ÄÆ¡n vá»‹ váº­n chuyá»ƒn)
- **Cáº¥u trÃºc:** `carrier_id` (PK), `carrier_name` (NVARCHAR(100)), `contact_phone` (VARCHAR(20)), `status` (TINYINT).

#### 38. Báº£ng `settings` (Cáº¥u hÃ¬nh há»‡ thá»‘ng Key-Value)
- **Cáº¥u trÃºc:** `setting_key` (VARCHAR(100), PK), `setting_value` (NVARCHAR(MAX)), `description` (NVARCHAR(255)).

---

### 3.9. PhÃ¢n há»‡ 9: Báº£o máº­t, Nháº­t kÃ½ & CRM (5 Báº£ng)

#### 39. Báº£ng `blocked_contacts` (Danh sÃ¡ch bá»‹ cháº·n)
- **Cáº¥u trÃºc:** `blocked_id` (PK), `contact_value` (VARCHAR(100)), `contact_type` (VARCHAR(20)), `reason` (NVARCHAR(255)), `blocked_at` (DATETIME2).

#### 40. Báº£ng `security_events` (Nháº­t kÃ½ an ninh)
- **Cáº¥u trÃºc:** `event_id` (PK), `user_id` (FK), `event_type` (VARCHAR(50)), `ip_address` (VARCHAR(50)), `user_agent` (VARCHAR(255)), `created_at` (DATETIME2).

#### 41. Báº£ng `crm_templates` (Máº«u tin nháº¯n CRM)
- **Cáº¥u trÃºc:** `template_id` (PK), `template_name` (NVARCHAR(100)), `channel` (VARCHAR(20)), `content` (NVARCHAR(MAX)).

#### 42. Báº£ng `crm_campaigns` (Chiáº¿n dá»‹ch CRM)
- **Cáº¥u trÃºc:** `campaign_id` (PK), `campaign_name` (NVARCHAR(150)), `template_id` (FK), `scheduled_time` (DATETIME2), `status` (TINYINT).

#### 43. Báº£ng `crm_message_logs` (Nháº­t kÃ½ gá»­i tin CRM)
- **Cáº¥u trÃºc:** `log_id` (PK), `campaign_id` (FK), `recipient_user_id` (FK), `status` (VARCHAR(20)), `sent_at` (DATETIME2).

---

## CHÆ¯Æ NG 4: CHá»ˆ Má»¤C (INDEXES), RÃ€NG BUá»˜C (CONSTRAINTS) & HIá»†U NÄ‚NG GIAO Dá»ŠCH

### 4.1. Danh má»¥c Chá»‰ má»¥c Tá»‘i Æ°u Truy váº¥n (Performance Indexes)
Äá»ƒ tÄƒng tá»‘c Ä‘á»™ truy váº¥n trÃªn CSDL SQL Server vá»›i 43 báº£ng, cÃ¡c chá»‰ má»¥c Ä‘Æ°á»£c Ä‘Ã¡nh trÃªn cÃ¡c cá»™t thÆ°á»ng xuyÃªn lá»c:
- `UK_users_email` (NONCLUSTERED INDEX trÃªn `users.email`).
- `UK_users_username` (NONCLUSTERED INDEX trÃªn `users.username`).
- `IX_products_category` (NONCLUSTERED INDEX trÃªn `products.category_id`).
- `IX_variants_sku` (NONCLUSTERED INDEX trÃªn `product_variants.sku`).
- `IX_orders_user` (NONCLUSTERED INDEX trÃªn `orders.user_id`).
- `IX_orders_code` (NONCLUSTERED INDEX trÃªn `orders.order_code`).

### 4.2. RÃ ng buá»™c ToÃ n váº¹n Dá»¯ liá»‡u (Integrity Constraints)
- **CHECK Constraints:**
  - `CHK_product_variants_qty`: `quantity >= 0` (KhÃ´ng cho phÃ©p tá»“n kho Ã¢m).
  - `CHK_products_price`: `price >= 0` (GiÃ¡ bÃ¡n pháº£i lÃ  sá»‘ dÆ°Æ¡ng).
  - `CHK_reviews_rating`: `rating BETWEEN 1 AND 5` (Sá»‘ sao tá»« 1 Ä‘áº¿n 5).
- **Foreign Key Cascade Policy:**
  - `ON DELETE CASCADE` Ä‘Æ°á»£c cáº¥u hÃ¬nh Ä‘á»‘i vá»›i cÃ¡c báº£ng phá»¥ con (vÃ­ dá»¥: XÃ³a `products` tá»± Ä‘á»™ng xÃ³a `product_images` vÃ  `product_variants`).

---

## Lá»œI Káº¾T & LIÃŠN Káº¾T TÃ€I LIá»†U

TÃ i liá»‡u **Thiáº¿t káº¿ CÆ¡ sá»Ÿ Dá»¯ liá»‡u FoxStyle** mÃ´ táº£ Ä‘áº§y Ä‘á»§ kiáº¿n trÃºc chuáº©n hÃ³a 3NF cá»§a 43 báº£ng CSDL trong `foxstyle_db.sql`.

TÃ i liá»‡u nÃ y Ä‘Æ°á»£c Ä‘á»“ng bá»™ liÃªn káº¿t vá»›i:
- [Äáº·c táº£ YÃªu cáº§u Há»‡ thá»‘ng SRS](./yeu_cau_he_thong.md)
- [SÆ¡ Ä‘á»“ Use Case & Sequence Diagrams](./so_do_use_case.md)
- [Äáº·c táº£ Chi tiáº¿t 20 Ca sá»­ dá»¥ng](./dac_ta_use_case_chi_tiet.md)
- [Ma tráº­n Ãnh xáº¡ Use Case & Actor](./use_case_actor_mapping.md)
- [Thiáº¿t káº¿ Cáº¥u trÃºc Pháº§n má»m (Software Architecture)](./thiet_ke_cau_truc_phan_mem.md)
- [Thiáº¿t káº¿ Lá»›p MÃ£ nguá»“n Java (Class Diagrams)](./thiet_ke_lop_class_diagrams.md)
- [Thiáº¿t káº¿ Háº¡ táº§ng Máº¡ng & ChÃ­nh sÃ¡ch Há»‡ thá»‘ng](./thiet_ke_ha_tang_mang_va_chinh_sach.md)
