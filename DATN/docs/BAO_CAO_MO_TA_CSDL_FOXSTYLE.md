# BÃO CÃO MÃ” Táº¢ CHI TIáº¾T CÆ  Sá»ž Dá»® LIá»†U Dá»° ÃN FOXSTYLE FASHION STORE
## ToÃ n bá»™ 43 Báº£ng Dá»¯ liá»‡u Äá»“ng bá»™ Há»‡ thá»‘ng

> **Dá»± Ã¡n**: Há»‡ thá»‘ng ThÆ°Æ¡ng máº¡i Äiá»‡n tá»­ Thá»i trang FoxStyle  
> **Há»‡ quáº£n trá»‹ CSDL**: Microsoft SQL Server 2019+ / Spring Data JPA Hibernate  
> **Vá»‹ trÃ­ tÃ i liá»‡u**: `docs/BAO_CAO_MO_TA_CSDL_FOXSTYLE.md`  
> **Nguá»“n SQL chÃ­nh**: `foxstyle_db.sql`  
> **NgÃ y cáº­p nháº­t**: 31/07/2026  

---

## I. Tá»”NG QUAN KIáº¾N TRÃšC CÆ  Sá»ž Dá»® LIá»†U (43 Báº¢NG)

Há»‡ thá»‘ng cÆ¡ sá»Ÿ dá»¯ liá»‡u FoxStyle bao gá»“m **43 báº£ng dá»¯ liá»‡u chuáº©n hÃ³a** Ä‘Æ°á»£c thiáº¿t káº¿ theo chuáº©n 3NF (Third Normal Form), phÃ¢n chia thÃ nh **9 nhÃ³m phÃ¢n há»‡ nghiá»‡p vá»¥** Ä‘Ã¡p á»©ng toÃ n bá»™ chá»©c nÄƒng thÆ°Æ¡ng máº¡i Ä‘iá»‡n tá»­ tá»« quáº£n trá»‹ kho, bÃ¡n hÃ ng, thanh toÃ¡n tá»± Ä‘á»™ng, CRM Ä‘áº¿n báº£o hÃ nh vÃ  báº£o máº­t:

```mermaid
erDiagram
    %% NhÃ³m TÃ i khoáº£n & PhÃ¢n quyá»n
    roles ||--o{ users : "gÃ¡n vai trÃ²"
    users ||--o{ user_addresses : "sá»Ÿ há»¯u Ä‘á»‹a chá»‰"
    users ||--o{ otp_verifications : "nháº­n mÃ£ OTP"
    users ||--o{ newsletter_subscriptions : "Ä‘Äƒng kÃ½ tin"

    %% NhÃ³m Sáº£n pháº©m & ThÆ°Æ¡ng hiá»‡u
    brands ||--o{ products : "sáº£n xuáº¥t"
    categories ||--o{ products : "phÃ¢n loáº¡i"
    products ||--o{ product_variants : "táº¡o SKU size/mÃ u"
    products ||--o{ product_images : "thÆ° viá»‡n áº£nh"
    products ||--o{ product_combo_items : "chá»©a sáº£n pháº©m combo"
    products ||--o{ product_price_audit_logs : "lá»‹ch sá»­ giÃ¡"

    %% NhÃ³m Giá» hÃ ng & Khuyáº¿n mÃ£i
    users ||--o{ carts : "sá»Ÿ há»¯u"
    carts ||--o{ cart_details : "chá»©a"
    product_variants ||--o{ cart_details : "biáº¿n thá»ƒ Ä‘Æ°á»£c chá»n"
    users ||--o{ saved_for_later : "lÆ°u mua sau"
    coupons ||--o{ orders : "Ã¡p dá»¥ng giáº£m giÃ¡"
    flash_sales ||--o{ flash_sale_products : "chÆ°Æ¡ng trÃ¬nh sale"
    products ||--o{ flash_sale_products : "sáº£n pháº©m sale"

    %% NhÃ³m ÄÆ¡n hÃ ng & Thanh toÃ¡n
    users ||--o{ orders : "Ä‘áº·t hÃ ng"
    orders ||--o{ order_details : "gá»“m nhiá»u chi tiáº¿t"
    product_variants ||--o{ order_details : "biáº¿n thá»ƒ chá»‘t bÃ¡n"
    orders ||--o{ payments : "Ä‘á»‘i soÃ¡t thanh toÃ¡n"
    payments ||--o{ payment_reconciliations : "káº¿t quáº£ Ä‘á»‘i soÃ¡t"
    users ||--o{ user_coupons : "sá»Ÿ há»¯u mÃ£"

    %% NhÃ³m TÆ°Æ¡ng tÃ¡c & Há»— trá»£
    users ||--o{ wishlists : "yÃªu thÃ­ch"
    products ||--o{ wishlists : "Ä‘Æ°á»£c thÃ­ch"
    users ||--o{ reviews : "viáº¿t Ä‘Ã¡nh giÃ¡"
    products ||--o{ reviews : "Ä‘Æ°á»£c Ä‘Ã¡nh giÃ¡"
    users ||--o{ chat_messages : "há»™i thoáº¡i CSKH"
    users ||--o{ notifications : "nháº­n thÃ´ng bÃ¡o"

    %% NhÃ³m BÃ i viáº¿t & Content
    article_topics ||--o{ articles : "chá»§ Ä‘á»"
    articles ||--o{ article_products : "gáº¯n sáº£n pháº©m"

    %% NhÃ³m Báº£o hÃ nh
    warranty_policies ||--o{ warranty_claims : "chÃ­nh sÃ¡ch báº£o hÃ nh"
    orders ||--o{ warranty_claims : "yÃªu cáº§u báº£o hÃ nh"
```

---

## II. Tá»ª ÄIá»‚N VÃ€ CHI TIáº¾T 43 Báº¢NG CÆ  Sá»ž Dá»® LIá»†U (`foxstyle_db.sql`)

---

### NHÃ“M 1: TÃ€I KHOáº¢N VÃ€ Äá»ŠNH DANH (5 Báº¢NG)

#### 1. Báº£ng `roles` (Vai trÃ² ngÆ°á»i dÃ¹ng)
- **Má»¥c Ä‘Ã­ch:** Quáº£n lÃ½ danh má»¥c vai trÃ² phÃ¢n quyá»n (`ROLE_ADMIN`, `ROLE_STAFF`, `ROLE_CUSTOMER`).
- **Cáº¥u trÃºc:** `role_id` (INT, PK, Identity), `role_name` (VARCHAR(50), UNIQUE), `description` (NVARCHAR(255)).

#### 2. Báº£ng `users` (TÃ i khoáº£n ngÆ°á»i dÃ¹ng)
- **Má»¥c Ä‘Ã­ch:** Quáº£n lÃ½ thÃ´ng tin tÃ i khoáº£n Ä‘Äƒng nháº­p vÃ  há»“ sÆ¡ cÃ¡ nhÃ¢n.
- **Cáº¥u trÃºc:** `user_id` (INT, PK, Identity), `username` (VARCHAR(50), UNIQUE), `password` (VARCHAR(255) - BCrypt), `full_name` (NVARCHAR(100)), `email` (VARCHAR(100), UNIQUE), `phone` (VARCHAR(20)), `status` (TINYINT: 1=Active, 0=Blocked), `role_id` (INT, FK -> roles), `created_at` (DATETIME2).

#### 3. Báº£ng `user_addresses` (Sá»• Ä‘á»‹a chá»‰ giao hÃ ng)
- **Má»¥c Ä‘Ã­ch:** LÆ°u trá»¯ cÃ¡c Ä‘á»‹a chá»‰ nháº­n hÃ ng cá»§a ngÆ°á»i dÃ¹ng.
- **Cáº¥u trÃºc:** `address_id` (INT, PK, Identity), `user_id` (INT, FK -> users), `recipient_name` (NVARCHAR(100)), `phone` (VARCHAR(20)), `province` (NVARCHAR(100)), `district` (NVARCHAR(100)), `ward` (NVARCHAR(100)), `detail_address` (NVARCHAR(255)), `is_default` (BIT).

#### 4. Báº£ng `otp_verifications` (XÃ¡c minh OTP qua Email)
- **Má»¥c Ä‘Ã­ch:** Quáº£n lÃ½ mÃ£ OTP 6 sá»‘ phá»¥c vá»¥ quÃªn máº­t kháº©u vÃ  xÃ¡c thá»±c tÃ i khoáº£n.
- **Cáº¥u trÃºc:** `otp_id` (INT, PK, Identity), `user_id` (INT, FK -> users), `otp_code` (VARCHAR(10)), `expiration_time` (DATETIME2), `is_used` (BIT).

#### 5. Báº£ng `newsletter_subscriptions` (ÄÄƒng kÃ½ nháº­n tin)
- **Má»¥c Ä‘Ã­ch:** LÆ°u trá»¯ danh sÃ¡ch email Ä‘Äƒng kÃ½ nháº­n báº£n tin khuyáº¿n mÃ£i.
- **Cáº¥u trÃºc:** `subscription_id` (INT, PK, Identity), `email` (VARCHAR(100), UNIQUE), `subscribed_at` (DATETIME2), `status` (TINYINT).

---

### NHÃ“M 2: DANH Má»¤C VÃ€ Sáº¢N PHáº¨M (7 Báº¢NG)

#### 6. Báº£ng `brands` (ThÆ°Æ¡ng hiá»‡u sáº£n pháº©m)
- **Má»¥c Ä‘Ã­ch:** Quáº£n lÃ½ cÃ¡c thÆ°Æ¡ng hiá»‡u thá»i trang cung cáº¥p.
- **Cáº¥u trÃºc:** `brand_id` (INT, PK, Identity), `brand_name` (NVARCHAR(100), UNIQUE), `logo_url` (VARCHAR(255)), `description` (NVARCHAR(500)), `status` (TINYINT).

#### 7. Báº£ng `categories` (Danh má»¥c thá»i trang)
- **Má»¥c Ä‘Ã­ch:** PhÃ¢n loáº¡i sáº£n pháº©m (Ão thun, SÆ¡ mi, Quáº§n Jeans, VÃ¡y...).
- **Cáº¥u trÃºc:** `category_id` (INT, PK, Identity), `category_name` (NVARCHAR(100), UNIQUE), `description` (NVARCHAR(500)), `status` (TINYINT).

#### 8. Báº£ng `products` (ThÃ´ng tin sáº£n pháº©m)
- **Má»¥c Ä‘Ã­ch:** LÆ°u trá»¯ sáº£n pháº©m chÃ­nh hoáº·c sáº£n pháº©m combo thá»i trang.
- **Cáº¥u trÃºc:** `product_id` (INT, PK, Identity), `product_name` (NVARCHAR(150)), `category_id` (INT, FK -> categories), `brand_id` (INT, FK -> brands), `price` (DECIMAL(18,2)), `original_price` (DECIMAL(18,2)), `description` (NVARCHAR(MAX)), `is_combo` (BIT), `status` (TINYINT), `created_at` (DATETIME2).

#### 9. Báº£ng `product_variants` (Biáº¿n thá»ƒ Size/MÃ u/SKU/Tá»“n kho)
- **Má»¥c Ä‘Ã­ch:** Quáº£n lÃ½ kho chi tiáº¿t cho tá»«ng biáº¿n thá»ƒ Size vÃ  MÃ u sáº¯c.
- **Cáº¥u trÃºc:** `variant_id` (INT, PK, Identity), `product_id` (INT, FK -> products), `color` (NVARCHAR(50)), `size` (VARCHAR(20)), `quantity` (INT), `sku` (VARCHAR(100), UNIQUE), `price_override` (DECIMAL(18,2)).

#### 10. Báº£ng `product_images` (ThÆ° viá»‡n áº£nh sáº£n pháº©m)
- **Má»¥c Ä‘Ã­ch:** LÆ°u bá»™ sÆ°u táº­p áº£nh gÃ³c phá»¥ vÃ  áº£nh Ä‘áº¡i diá»‡n chÃ­nh.
- **Cáº¥u trÃºc:** `image_id` (INT, PK, Identity), `product_id` (INT, FK -> products), `image_url` (VARCHAR(255)), `is_primary` (BIT), `display_order` (INT).

#### 11. Báº£ng `product_combo_items` (Sáº£n pháº©m thÃ nh pháº§n Combo)
- **Má»¥c Ä‘Ã­ch:** Quáº£n lÃ½ cÃ¡c sáº£n pháº©m con trong 1 gÃ³i Combo thá»i trang.
- **Cáº¥u trÃºc:** `combo_item_id` (INT, PK, Identity), `parent_product_id` (INT, FK -> products), `child_product_id` (INT, FK -> products), `quantity` (INT).

#### 12. Báº£ng `product_price_audit_logs` (Nháº­t kÃ½ thay Ä‘á»•i giÃ¡)
- **Má»¥c Ä‘Ã­ch:** LÆ°u lá»‹ch sá»­ Ä‘iá»u chá»‰nh giÃ¡ bÃ¡n vÃ  giÃ¡ gá»‘c cá»§a sáº£n pháº©m.
- **Cáº¥u trÃºc:** `log_id` (INT, PK, Identity), `product_id` (INT, FK -> products), `old_price` (DECIMAL(18,2)), `new_price` (DECIMAL(18,2)), `changed_by` (INT, FK -> users), `changed_at` (DATETIME2).

---

### NHÃ“M 3: GIá»Ž HÃ€NG VÃ€ KHUYáº¾N MÃƒI (6 Báº¢NG)

#### 13. Báº£ng `carts` (Giá» hÃ ng ngÆ°á»i dÃ¹ng)
- **Má»¥c Ä‘Ã­ch:** Giá» hÃ ng hiá»‡n hÃ nh gáº¯n liá»n vá»›i tÃ i khoáº£n khÃ¡ch hÃ ng.
- **Cáº¥u trÃºc:** `cart_id` (INT, PK, Identity), `user_id` (INT, FK -> users, UNIQUE), `created_at` (DATETIME2).

#### 14. Báº£ng `cart_details` (Chi tiáº¿t máº·t hÃ ng giá»)
- **Má»¥c Ä‘Ã­ch:** LÆ°u danh sÃ¡ch biáº¿n thá»ƒ vÃ  sá»‘ lÆ°á»£ng Ä‘áº·t trong giá».
- **Cáº¥u trÃºc:** `cart_detail_id` (INT, PK, Identity), `cart_id` (INT, FK -> carts), `variant_id` (INT, FK -> product_variants), `quantity` (INT).

#### 15. Báº£ng `saved_for_later` (Sáº£n pháº©m lÆ°u mua sau)
- **Má»¥c Ä‘Ã­ch:** LÆ°u máº·t hÃ ng chuyá»ƒn tá»« giá» hÃ ng sang danh sÃ¡ch mua sau.
- **Cáº¥u trÃºc:** `saved_id` (INT, PK, Identity), `user_id` (INT, FK -> users), `variant_id` (INT, FK -> product_variants), `created_at` (DATETIME2).

#### 16. Báº£ng `coupons` (MÃ£ giáº£m giÃ¡)
- **Má»¥c Ä‘Ã­ch:** Quáº£n lÃ½ chÆ°Æ¡ng trÃ¬nh Æ°u Ä‘Ã£i mÃ£ giáº£m giÃ¡.
- **Cáº¥u trÃºc:** `coupon_id` (INT, PK, Identity), `code` (VARCHAR(50), UNIQUE), `discount_type` (VARCHAR(20): FIXED/PERCENTAGE), `discount_value` (DECIMAL(18,2)), `max_discount_value` (DECIMAL(18,2)), `min_order_value` (DECIMAL(18,2)), `usage_limit` (INT), `used_count` (INT), `start_date` (DATETIME2), `end_date` (DATETIME2), `status` (TINYINT).

#### 17. Báº£ng `flash_sales` (ChÆ°Æ¡ng trÃ¬nh Flash Sale)
- **Má»¥c Ä‘Ã­ch:** Quáº£n lÃ½ cÃ¡c sá»± kiá»‡n giáº£m giÃ¡ giá» vÃ ng.
- **Cáº¥u trÃºc:** `flash_sale_id` (INT, PK, Identity), `title` (NVARCHAR(150)), `start_time` (DATETIME2), `end_time` (DATETIME2), `status` (TINYINT).

#### 18. Báº£ng `flash_sale_products` (Sáº£n pháº©m trong Flash Sale)
- **Má»¥c Ä‘Ã­ch:** Danh sÃ¡ch sáº£n pháº©m vÃ  giÃ¡ Æ°u Ä‘Ã£i Ä‘áº·c biá»‡t trong Ä‘á»£t Sale.
- **Cáº¥u trÃºc:** `flash_sale_product_id` (INT, PK, Identity), `flash_sale_id` (INT, FK -> flash_sales), `product_id` (INT, FK -> products), `sale_price` (DECIMAL(18,2)), `stock_quantity` (INT).

---

### NHÃ“M 4: ÄÆ N HÃ€NG VÃ€ THANH TOÃN (5 Báº¢NG)

#### 19. Báº£ng `orders` (ThÃ´ng tin Ä‘Æ¡n hÃ ng)
- **Má»¥c Ä‘Ã­ch:** Quáº£n lÃ½ thÃ´ng tin Ä‘Æ¡n Ä‘áº·t hÃ ng, giao nháº­n vÃ  tráº¡ng thÃ¡i.
- **Cáº¥u trÃºc:** `order_id` (INT, PK, Identity), `order_code` (VARCHAR(50), UNIQUE), `user_id` (INT, FK -> users), `total_amount` (DECIMAL(18,2)), `discount_amount` (DECIMAL(18,2)), `shipping_fee` (DECIMAL(18,2)), `final_amount` (DECIMAL(18,2)), `payment_method` (VARCHAR(30): COD/PAYOS), `payment_status` (VARCHAR(30)), `status` (VARCHAR(30): PENDING/CONFIRMED/SHIPPING/DELIVERED/CANCELLED), `address_id` (INT, FK -> user_addresses), `coupon_id` (INT, FK -> coupons), `created_at` (DATETIME2).

#### 20. Báº£ng `order_details` (Chi tiáº¿t máº·t hÃ ng Ä‘Æ¡n)
- **Má»¥c Ä‘Ã­ch:** LÆ°u danh sÃ¡ch biáº¿n thá»ƒ, sá»‘ lÆ°á»£ng vÃ  snapshot giÃ¡ táº¡i thá»i Ä‘iá»ƒm Ä‘áº·t.
- **Cáº¥u trÃºc:** `order_detail_id` (INT, PK, Identity), `order_id` (INT, FK -> orders), `variant_id` (INT, FK -> product_variants), `quantity` (INT), `unit_price` (DECIMAL(18,2)).

#### 21. Báº£ng `payments` (Giao dá»‹ch thanh toÃ¡n)
- **Má»¥c Ä‘Ã­ch:** LÆ°u nháº­t kÃ½ giao dá»‹ch ngÃ¢n hÃ ng / PayOS.
- **Cáº¥u trÃºc:** `payment_id` (INT, PK, Identity), `order_id` (INT, FK -> orders), `transaction_code` (VARCHAR(100)), `payment_gateway` (VARCHAR(50)), `amount` (DECIMAL(18,2)), `status` (VARCHAR(30)), `paid_at` (DATETIME2).

#### 22. Báº£ng `payment_reconciliations` (Äá»‘i soÃ¡t thanh toÃ¡n)
- **Má»¥c Ä‘Ã­ch:** Quáº£n lÃ½ káº¿t quáº£ Ä‘á»‘i soÃ¡t tá»± Ä‘á»™ng tiá»n vá» tÃ i khoáº£n ngÃ¢n hÃ ng.
- **Cáº¥u trÃºc:** `reconciliation_id` (INT, PK, Identity), `payment_id` (INT, FK -> payments), `bank_reference` (VARCHAR(100)), `reconciled_amount` (DECIMAL(18,2)), `status` (VARCHAR(30)), `reconciled_at` (DATETIME2).

#### 23. Báº£ng `user_coupons` (Lá»‹ch sá»­ sá»­ dá»¥ng Coupon)
- **Má»¥c Ä‘Ã­ch:** Theo dÃµi mÃ£ giáº£m giÃ¡ ngÆ°á»i dÃ¹ng Ä‘Ã£ lÆ°u hoáº·c sá»­ dá»¥ng.
- **Cáº¥u trÃºc:** `user_id` (INT, FK -> users), `coupon_id` (INT, FK -> coupons), `used_at` (DATETIME2), PK (`user_id`, `coupon_id`).

---

### NHÃ“M 5: TÆ¯Æ NG TÃC KHÃCH HÃ€NG & Há»– TRá»¢ (6 Báº¢NG)

#### 24. Báº£ng `wishlists` (Sáº£n pháº©m yÃªu thÃ­ch)
- **Má»¥c Ä‘Ã­ch:** LÆ°u sáº£n pháº©m Ä‘Æ°á»£c khÃ¡ch hÃ ng tháº£ tim.
- **Cáº¥u trÃºc:** `wishlist_id` (INT, PK, Identity), `user_id` (INT, FK -> users), `product_id` (INT, FK -> products), `created_at` (DATETIME2).

#### 25. Báº£ng `reviews` (ÄÃ¡nh giÃ¡ & Cháº¥m sao)
- **Má»¥c Ä‘Ã­ch:** Nháº­n xÃ©t vÃ  cháº¥m 1-5 sao sáº£n pháº©m tá»« khÃ¡ch hÃ ng Ä‘Ã£ mua.
- **Cáº¥u trÃºc:** `review_id` (INT, PK, Identity), `user_id` (INT, FK -> users), `product_id` (INT, FK -> products), `rating` (INT: 1-5), `comment` (NVARCHAR(1000)), `status` (TINYINT: 1=Approved, 0=Hidden), `created_at` (DATETIME2).

#### 26. Báº£ng `banners` (Banner quáº£ng cÃ¡o trang chá»§)
- **Má»¥c Ä‘Ã­ch:** Quáº£n lÃ½ áº£nh quáº£ng cÃ¡o vÃ  liÃªn káº¿t Ä‘iá»u hÆ°á»›ng.
- **Cáº¥u trÃºc:** `banner_id` (INT, PK, Identity), `title` (NVARCHAR(150)), `image_url` (VARCHAR(255)), `link_url` (VARCHAR(255)), `display_order` (INT), `status` (TINYINT).

#### 27. Báº£ng `notifications` (ThÃ´ng bÃ¡o ngÆ°á»i dÃ¹ng)
- **Má»¥c Ä‘Ã­ch:** Gá»­i thÃ´ng bÃ¡o cÃ¡ nhÃ¢n hoáº·c toÃ n há»‡ thá»‘ng.
- **Cáº¥u trÃºc:** `notification_id` (INT, PK, Identity), `user_id` (INT, FK -> users), `title` (NVARCHAR(150)), `message` (NVARCHAR(500)), `is_read` (BIT), `created_at` (DATETIME2).

#### 28. Báº£ng `chat_messages` (Há»™i thoáº¡i CSkhÃ¡ch hÃ ng Livechat)
- **Má»¥c Ä‘Ã­ch:** LÆ°u tin nháº¯n tÆ° váº¥n giá»¯a KhÃ¡ch hÃ ng vÃ  NhÃ¢n viÃªn CSKH.
- **Cáº¥u trÃºc:** `message_id` (INT, PK, Identity), `sender_id` (INT, FK -> users), `receiver_id` (INT, FK -> users), `message_text` (NVARCHAR(MAX)), `sent_at` (DATETIME2).

#### 29. Báº£ng `contact_messages` (Ná»™i dung liÃªn há»‡)
- **Má»¥c Ä‘Ã­ch:** LÆ°u thÃ´ng Ä‘iá»‡p khÃ¡ch vÃ£ng lai gá»­i qua Form LiÃªn há»‡.
- **Cáº¥u trÃºc:** `contact_id` (INT, PK, Identity), `full_name` (NVARCHAR(100)), `email` (VARCHAR(100)), `phone` (VARCHAR(20)), `subject` (NVARCHAR(200)), `message` (NVARCHAR(MAX)), `status` (TINYINT).

---

### NHÃ“M 6: Ná»˜I DUNG VÃ€ BÃ€I VIáº¾T (3 Báº¢NG)

#### 30. Báº£ng `article_topics` (Chá»§ Ä‘á» bÃ i viáº¿t Blog)
- **Má»¥c Ä‘Ã­ch:** PhÃ¢n loáº¡i bÃ i viáº¿t (Xu hÆ°á»›ng thá»i trang, HÆ°á»›ng dáº«n phá»‘i Ä‘á»“...).
- **Cáº¥u trÃºc:** `topic_id` (INT, PK, Identity), `topic_name` (NVARCHAR(100), UNIQUE), `description` (NVARCHAR(255)).

#### 31. Báº£ng `articles` (BÃ i viáº¿t blog thá»i trang)
- **Má»¥c Ä‘Ã­ch:** ÄÄƒng bÃ i viáº¿t chia sáº» phong cÃ¡ch vÃ  tin tá»©c thá»i trang.
- **Cáº¥u trÃºc:** `article_id` (INT, PK, Identity), `title` (NVARCHAR(255)), `topic_id` (INT, FK -> article_topics), `author_id` (INT, FK -> users), `thumbnail_url` (VARCHAR(255)), `content` (NVARCHAR(MAX)), `status` (TINYINT: 1=Published, 0=Draft), `published_at` (DATETIME2).

#### 32. Báº£ng `article_products` (Gáº¯n sáº£n pháº©m vÃ o bÃ i viáº¿t)
- **Má»¥c Ä‘Ã­ch:** Giá»›i thiá»‡u sáº£n pháº©m tÆ°Æ¡ng á»©ng trong bÃ i viáº¿t blog.
- **Cáº¥u trÃºc:** `article_id` (INT, FK -> articles), `product_id` (INT, FK -> products), PK (`article_id`, `product_id`).

---

### NHÃ“M 7: Báº¢O HÃ€NH (2 Báº¢NG)

#### 33. Báº£ng `warranty_policies` (ChÃ­nh sÃ¡ch báº£o hÃ nh)
- **Má»¥c Ä‘Ã­ch:** Äá»‹nh nghÄ©a cÃ¡c quy Ä‘á»‹nh báº£o hÃ nh theo tá»«ng loáº¡i sáº£n pháº©m.
- **Cáº¥u trÃºc:** `policy_id` (INT, PK, Identity), `policy_name` (NVARCHAR(150)), `warranty_months` (INT), `terms_condition` (NVARCHAR(MAX)).

#### 34. Báº£ng `warranty_claims` (YÃªu cáº§u báº£o hÃ nh)
- **Má»¥c Ä‘Ã­ch:** Tiáº¿p nháº­n vÃ  xá»­ lÃ½ yÃªu cáº§u Ä‘á»•i tráº£/báº£o hÃ nh tá»« khÃ¡ch hÃ ng.
- **Cáº¥u trÃºc:** `claim_id` (INT, PK, Identity), `order_id` (INT, FK -> orders), `product_id` (INT, FK -> products), `issue_description` (NVARCHAR(MAX)), `status` (VARCHAR(30)), `created_at` (DATETIME2).

---

### NHÃ“M 8: Váº¬N CHUYá»‚N VÃ€ Cáº¤U HÃŒNH (4 Báº¢NG)

#### 35. Báº£ng `districts` (Khu vá»±c & PhÃ­ giao hÃ ng)
- **Má»¥c Ä‘Ã­ch:** Quáº£n lÃ½ khu vá»±c giao hÃ ng vÃ  tÃ­nh phÃ­ ship theo Ä‘á»‹a bÃ n.
- **Cáº¥u trÃºc:** `district_id` (INT, PK, Identity), `district_name` (NVARCHAR(100)), `province_name` (NVARCHAR(100)), `shipping_fee` (DECIMAL(18,2)).

#### 36. Báº£ng `store_branches` (Chi nhÃ¡nh cá»­a hÃ ng)
- **Má»¥c Ä‘Ã­ch:** Quáº£n lÃ½ danh sÃ¡ch showroom/cá»­a hÃ ng váº­t lÃ½ FoxStyle.
- **Cáº¥u trÃºc:** `branch_id` (INT, PK, Identity), `branch_name` (NVARCHAR(150)), `address` (NVARCHAR(255)), `phone` (VARCHAR(20)), `latitude` (FLOAT), `longitude` (FLOAT).

#### 37. Báº£ng `shipping_carriers` (ÄÆ¡n vá»‹ váº­n chuyá»ƒn)
- **Má»¥c Ä‘Ã­ch:** Danh sÃ¡ch cÃ¡c Ä‘á»‘i tÃ¡c giao hÃ ng (GHN, GHTK, Viettel Post...).
- **Cáº¥u trÃºc:** `carrier_id` (INT, PK, Identity), `carrier_name` (NVARCHAR(100)), `contact_phone` (VARCHAR(20)), `status` (TINYINT).

#### 38. Báº£ng `settings` (Cáº¥u hÃ¬nh há»‡ thá»‘ng Key-Value)
- **Má»¥c Ä‘Ã­ch:** LÆ°u trá»¯ cáº¥u hÃ¬nh dÃ¹ng chung (TÃªn website, hotline, email CSKH, footer text...).
- **Cáº¥u trÃºc:** `setting_key` (VARCHAR(100), PK), `setting_value` (NVARCHAR(MAX)), `description` (NVARCHAR(255)).

---

### NHÃ“M 9: Báº¢O Máº¬T, NHáº¬T KÃ VÃ€ CRM (5 Báº¢NG)

#### 39. Báº£ng `blocked_contacts` (Danh sÃ¡ch Ä‘en bá»‹ cháº·n)
- **Má»¥c Ä‘Ã­ch:** Cháº·n email/SÄT rÃ¡c hoáº·c tÃ i khoáº£n vi pháº¡m chÃ­nh sÃ¡ch spam.
- **Cáº¥u trÃºc:** `blocked_id` (INT, PK, Identity), `contact_value` (VARCHAR(100)), `contact_type` (VARCHAR(20): EMAIL/PHONE), `reason` (NVARCHAR(255)), `blocked_at` (DATETIME2).

#### 40. Báº£ng `security_events` (Nháº­t kÃ½ sá»± kiá»‡n báº£o máº­t)
- **Má»¥c Ä‘Ã­ch:** Ghi log cÃ¡c hÃ nh vi Ä‘Äƒng nháº­p sai, Ä‘á»•i IP láº¡, brute force.
- **Cáº¥u trÃºc:** `event_id` (INT, PK, Identity), `user_id` (INT, FK -> users), `event_type` (VARCHAR(50)), `ip_address` (VARCHAR(50)), `user_agent` (VARCHAR(255)), `created_at` (DATETIME2).

#### 41. Báº£ng `crm_templates` (Máº«u tin nháº¯n CRM)
- **Má»¥c Ä‘Ã­ch:** Máº«u Email/SMS/Zalo gá»­i tá»± Ä‘á»™ng cho khÃ¡ch hÃ ng.
- **Cáº¥u trÃºc:** `template_id` (INT, PK, Identity), `template_name` (NVARCHAR(100)), `channel` (VARCHAR(20): EMAIL/SMS/ZALO), `content` (NVARCHAR(MAX)).

#### 42. Báº£ng `crm_campaigns` (Chiáº¿n dá»‹ch chÄƒm sÃ³c khÃ¡ch hÃ ng)
- **Má»¥c Ä‘Ã­ch:** Quáº£n lÃ½ chiáº¿n dá»‹ch gá»­i tin nháº¯n khuyáº¿n mÃ£i/tri Ã¢n.
- **Cáº¥u trÃºc:** `campaign_id` (INT, PK, Identity), `campaign_name` (NVARCHAR(150)), `template_id` (INT, FK -> crm_templates), `scheduled_time` (DATETIME2), `status` (TINYINT).

#### 43. Báº£ng `crm_message_logs` (Lá»‹ch sá»­ gá»­i tin CRM)
- **Má»¥c Ä‘Ã­ch:** LÆ°u nháº­t kÃ½ chi tiáº¿t tá»«ng tin nháº¯n CRM Ä‘Ã£ gá»­i vÃ  tráº¡ng thÃ¡i nháº­n.
- **Cáº¥u trÃºc:** `log_id` (INT, PK, Identity), `campaign_id` (INT, FK -> crm_campaigns), `recipient_user_id` (INT, FK -> users), `status` (VARCHAR(20): SUCCESS/FAILED), `sent_at` (DATETIME2).

---

## Lá»œI Káº¾T

TÃ i liá»‡u nÃ y Ä‘Ã£ mÃ´ táº£ **Ä‘áº§y Ä‘á»§ 43 báº£ng dá»¯ liá»‡u chuáº©n hÃ³a** cÃ³ trong script CSDL chÃ­nh `foxstyle_db.sql`. 

TÃ i liá»‡u nÃ y liÃªn káº¿t vÃ  Ä‘á»“ng bá»™ trá»±c tiáº¿p vá»›i:
- [Äáº·c táº£ YÃªu cáº§u Há»‡ thá»‘ng SRS](./yeu_cau_he_thong.md)
- [SÆ¡ Ä‘á»“ & Äáº·c táº£ Ca sá»­ dá»¥ng Use Case](./so_do_use_case.md)
- [MÃ´ táº£ Chi tiáº¿t CÃ¡c Chá»©c nÄƒng Há»‡ thá»‘ng](./mo_ta_chi_tiet_chuc_nang.md)
- [Thiáº¿t káº¿ Háº¡ táº§ng Máº¡ng & ChÃ­nh sÃ¡ch Há»‡ thá»‘ng](./thiet_ke_ha_tang_mang_va_chinh_sach.md)
