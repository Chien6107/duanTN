/*
  FOXSTYLE DATABASE - FULL WEB-SYNCHRONIZED SCHEMA
  SQL Server 2019+

  NGUỒN DỮ LIỆU SQL CHÍNH: chỉ chạy file này.
  Bao gồm cấu trúc, ràng buộc, chỉ mục, dữ liệu mặc định và chuyển đổi dữ liệu cũ.

  - Chạy được cho CSDL mới.
  - Không xóa dữ liệu nếu foxstyle_db đã tồn tại.
  - Bao ph ton b module hin c trn website qun tr v khch hng.
*/

/*
===============================================================================
GHI CHÚ VẬN HÀNH
===============================================================================

1. y l file SQL DUY NHT cn chy cho d n FoxStyle.
2. Chạy toàn bộ file bằng SQL Server Management Studio trên SQL Server 2019+.
3. Tài khoản chạy cần quyền CREATE DATABASE khi foxstyle_db chưa tồn tại.
4. SET XACT_ABORT ON bảo đảm mỗi khối transaction tự hủy khi có lỗi SQL.
5. Bảng, cột bổ sung, khóa ngoại, index và seed đều kiểm tra tồn tại trước khi
   tạo; vì vậy có thể chạy lại file mà không xóa dữ liệu cũ.
6. Không đổi tên bảng/cột nếu chưa sửa đồng thời backend và frontend.
7. Tiếng Việt dùng NVARCHAR/NVARCHAR(MAX) và literal có tiền tố N.
8. TINYINT status dùng quy ước chung: 1 = hoạt động, 0 = ngừng hoặc ẩn.
9. DATETIME2 mặc định lấy thời gian SQL Server bằng SYSDATETIME().
10. IDENTITY là khóa chính tự tăng; không tự chèn ID nếu không cần.

THỨ TỰ THỰC THI

A. Tạo và chọn database foxstyle_db.
B. Đồng bộ schema, cột bổ sung, khóa ngoại và index.
C. Thêm dữ liệu mặc định còn thiếu.
D. Chuyển combo kiểu cũ [COMBO:x,y] sang product_combo_items.

 TỪ ĐIỂN 46 BẢNG

Tài khoản và định danh:
- roles: danh mục vai trò ADMIN, STAFF, CUSTOMER.
- users: tài khoản đăng nhập và hồ sơ người dùng.
- user_addresses: cc a ch nhn hng ca ngi dng.
- otp_verifications: m OTP, hn dng v trng thi xc minh.
- newsletter_subscriptions: email đăng ký nhận tin.

Danh mục sản phẩm:
- brands: thương hiệu sản phẩm.
- categories: danh mục sản phẩm.
- products: thng tin, gi v trng thi sn phm hoc combo.
- product_variants: SKU theo mu, kch thc, gi v tn kho.
- product_images: thư viện ảnh và ảnh đại diện sản phẩm.
- product_combo_items: cc sn phm thnh phn ca mt combo.
- product_price_audit_logs: lch s thay i gi.

Giỏ hàng, khuyến mãi và đơn hàng:
- carts: giỏ hàng hiện hành theo người dùng.
- cart_details: biến thể và số lượng trong giỏ.
- saved_for_later: sản phẩm lưu để mua sau.
- coupons: m gim gi v iu kin p dng.
- flash_sales: chng trnh gim gi theo thi gian.
- flash_sale_products: sn phm v gi trong flash sale.
- orders: thng tin tng qut, giao nhn v trng thi n.
- order_details: sn phm, gi v snapshot ti lc t hng.
- payments: giao dch thanh ton ca n hng.
- payment_reconciliations: kt qu i sot thanh ton.
- user_coupons: m gim gi  cp hoc  dng ca ngi dng.

Tng tc khch hng:
- wishlists: danh sch sn phm yu thch.
- reviews: nh gi, duyt v phn hi qun tr vin.
- banners: banner, marquee và lịch hiển thị.
- notifications: thng bo c nhn hoc ton h thng.
- chat_messages: hi thoi khch hng v nhn vin.
- contact_messages: nội dung gửi từ trang liên hệ.

Nội dung:
- article_topics: chủ đề bài viết.
- articles: bi vit, tc gi v trng thi xut bn.
- article_products: sản phẩm được gắn với bài viết.

Bảo hành:
- warranty_policies: chnh sch bo hnh.
- warranty_claims: yêu cầu bảo hành của đơn và sản phẩm.

Vận chuyển và cấu hình:
- districts: khu vực, quận huyện và phí giao hàng.
- store_branches: chi nhnh v thng tin lin h.
- shipping_carriers: đơn vị vận chuyển.
- settings: cấu hình key-value dùng chung cho website/admin.
- daily_backups: bản sao dữ liệu quản trị theo ngày phục vụ khôi phục.

Bảo mật và CRM:
- blocked_contacts: email hoặc số điện thoại bị chặn.
- security_events: nhật ký sự kiện an toàn và đăng nhập.
- crm_templates: mẫu nội dung email, SMS hoặc Zalo.
- crm_campaigns: chin dch chm sc khch hng.
- crm_message_logs: lịch sử gửi và lỗi của thông điệp.

QUAN HỆ QUAN TRỌNG

- users.role_id -> roles.role_id.
- products.category_id -> categories.category_id.
- products.brand_id -> brands.brand_id.
- product_variants và product_images -> products.
- product_combo_items liên kết combo với sản phẩm thành phần.
- cart_details -> carts và product_variants.
- order_details -> orders, products và product_variants.
- payments và payment_reconciliations -> orders và payments.
- reviews/warranty_claims liên kết người dùng, sản phẩm và đơn hàng.
- ON DELETE CASCADE chỉ dùng khi dữ liệu con được phép xóa theo dữ liệu cha.

LƯU Ý DỮ LIỆU MẶC ĐỊNH

- Seed chỉ INSERT khi chưa có bản ghi tương ứng.
- Mật khẩu mẫu là BCrypt; môi trường thật phải đổi tài khoản mẫu.
- Migration combo không xóa sản phẩm lẻ và không tạo quan hệ trùng.
- File không DROP TABLE, không xóa database và không xóa dữ liệu nghiệp vụ.
===============================================================================
*/

IF DB_ID(N'foxstyle_db') IS NULL
    CREATE DATABASE foxstyle_db;
GO

USE foxstyle_db;
GO

SET XACT_ABORT ON;
BEGIN TRANSACTION;

/* ========================= TÀI KHOẢN VÀ ĐỊNH DANH ========================= */

-- Bảng roles: Lưu danh mục vai trò và quyền cơ bản của tài khoản.
IF OBJECT_ID('roles', 'U') IS NULL
CREATE TABLE roles (
    role_id INT IDENTITY(1,1) PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description NVARCHAR(255) NULL
);

-- Bng users: Lu ti khon ng nhp, h s, trng thi v thit lp c nhn.
IF OBJECT_ID('users', 'U') IS NULL
CREATE TABLE users (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    role_id INT NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name NVARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15) NULL,
    citizen_id VARCHAR(12) NULL,
    address NVARCHAR(500) NULL,
    status TINYINT NOT NULL CONSTRAINT DF_users_status DEFAULT 1,
    failed_login_attempts INT NOT NULL CONSTRAINT DF_users_failed_login_attempts DEFAULT 0,
    theme VARCHAR(20) NULL,
    language VARCHAR(10) NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_users_created DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL CONSTRAINT DF_users_updated DEFAULT SYSDATETIME(),
    CONSTRAINT FK_users_roles FOREIGN KEY (role_id) REFERENCES roles(role_id),
    CONSTRAINT CK_users_status CHECK (status IN (0,1))
);

IF COL_LENGTH('users', 'theme') IS NULL
    ALTER TABLE users ADD theme VARCHAR(20) NULL;
IF COL_LENGTH('users', 'failed_login_attempts') IS NULL
    EXEC(N'ALTER TABLE users ADD failed_login_attempts INT NULL;');
-- Cập nhật tài khoản cũ trước khi ép cột thành NOT NULL.
EXEC(N'UPDATE users SET failed_login_attempts = 0 WHERE failed_login_attempts IS NULL;');
EXEC(N'ALTER TABLE users ALTER COLUMN failed_login_attempts INT NOT NULL;');
IF NOT EXISTS (
    SELECT 1
    FROM sys.default_constraints dc
    JOIN sys.columns c
      ON c.object_id = dc.parent_object_id
     AND c.column_id = dc.parent_column_id
    WHERE dc.parent_object_id = OBJECT_ID('users')
      AND c.name = 'failed_login_attempts'
)
    ALTER TABLE users ADD CONSTRAINT DF_users_failed_login_attempts_sync
        DEFAULT 0 FOR failed_login_attempts;
IF COL_LENGTH('users', 'language') IS NULL
    ALTER TABLE users ADD language VARCHAR(10) NULL;
IF COL_LENGTH('users', 'citizen_id') IS NULL
    ALTER TABLE users ADD citizen_id VARCHAR(12) NULL;
IF COL_LENGTH('users', 'address') IS NULL
    ALTER TABLE users ADD address NVARCHAR(500) NULL;
IF COL_LENGTH('users', 'created_at') IS NULL
    ALTER TABLE users ADD created_at DATETIME2 NOT NULL
        CONSTRAINT DF_users_created_at_sync DEFAULT SYSDATETIME() WITH VALUES;
IF COL_LENGTH('users', 'updated_at') IS NULL
    ALTER TABLE users ADD updated_at DATETIME2 NOT NULL
        CONSTRAINT DF_users_updated_at_sync DEFAULT SYSDATETIME() WITH VALUES;

-- Bng user_addresses: Lu cc a ch nhn hng thuc tng ngi dng.
IF OBJECT_ID('user_addresses', 'U') IS NULL
CREATE TABLE user_addresses (
    address_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    recipient_name NVARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    province NVARCHAR(100) NOT NULL,
    district NVARCHAR(100) NOT NULL,
    ward NVARCHAR(100) NOT NULL,
    detail_address NVARCHAR(255) NOT NULL,
    is_default BIT NOT NULL CONSTRAINT DF_addresses_default DEFAULT 0,
    CONSTRAINT FK_addresses_users FOREIGN KEY (user_id)
        REFERENCES users(user_id) ON DELETE CASCADE
);

-- Bng otp_verifications: Lu m OTP, thi hn v trng thi  xc minh.
IF OBJECT_ID('otp_verifications', 'U') IS NULL
CREATE TABLE otp_verifications (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    email VARCHAR(100) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    expiry_time DATETIME2 NOT NULL,
    verified BIT NOT NULL CONSTRAINT DF_otp_verified DEFAULT 0,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_otp_created DEFAULT SYSDATETIME()
);
IF COL_LENGTH('otp_verifications', 'created_at') IS NULL
    ALTER TABLE otp_verifications ADD created_at DATETIME2 NOT NULL
        CONSTRAINT DF_otp_created_sync DEFAULT SYSDATETIME() WITH VALUES;

-- Bng newsletter_subscriptions: Lu email ng k nhn bn tin v trng thi ng k.
IF OBJECT_ID('newsletter_subscriptions', 'U') IS NULL
CREATE TABLE newsletter_subscriptions (
    subscription_id INT IDENTITY(1,1) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    status TINYINT NOT NULL CONSTRAINT DF_newsletter_status DEFAULT 1,
    subscribed_at DATETIME2 NOT NULL CONSTRAINT DF_newsletter_date DEFAULT SYSDATETIME(),
    unsubscribed_at DATETIME2 NULL,
    CONSTRAINT CK_newsletter_status CHECK (status IN (0,1))
);
IF COL_LENGTH('newsletter_subscriptions', 'status') IS NULL
    ALTER TABLE newsletter_subscriptions ADD status TINYINT NOT NULL
        CONSTRAINT DF_newsletter_status_sync DEFAULT 1 WITH VALUES;
IF COL_LENGTH('newsletter_subscriptions', 'unsubscribed_at') IS NULL
    ALTER TABLE newsletter_subscriptions ADD unsubscribed_at DATETIME2 NULL;

/* ========================= DANH MỤC VÀ SẢN PHẨM ========================= */

-- Bảng brands: Lưu thông tin thương hiệu được dùng trong danh mục sản phẩm.
IF OBJECT_ID('brands', 'U') IS NULL
CREATE TABLE brands (
    brand_id INT IDENTITY(1,1) PRIMARY KEY,
    brand_name NVARCHAR(100) NOT NULL UNIQUE,
    logo_url NVARCHAR(MAX) NULL,
    country NVARCHAR(100) NULL,
    website_url NVARCHAR(500) NULL,
    description NVARCHAR(MAX) NULL,
    is_featured BIT NOT NULL CONSTRAINT DF_brands_featured DEFAULT 0,
    status TINYINT NOT NULL CONSTRAINT DF_brands_status DEFAULT 1,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_brands_created DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL CONSTRAINT DF_brands_updated DEFAULT SYSDATETIME(),
    CONSTRAINT CK_brands_status CHECK (status IN (0,1))
);

-- Bng categories: Lu cy danh mc v trng thi hin th sn phm.
IF OBJECT_ID('categories', 'U') IS NULL
CREATE TABLE categories (
    category_id INT IDENTITY(1,1) PRIMARY KEY,
    category_name NVARCHAR(100) NOT NULL UNIQUE,
    description NVARCHAR(MAX) NULL,
    status TINYINT NOT NULL CONSTRAINT DF_categories_status DEFAULT 1,
    CONSTRAINT CK_categories_status CHECK (status IN (0,1))
);

-- Bng products: Lu thng tin chung, gi, m t v trng thi sn phm hoc combo.
IF OBJECT_ID('products', 'U') IS NULL
CREATE TABLE products (
    product_id INT IDENTITY(1,1) PRIMARY KEY,
    category_id INT NOT NULL,
    brand_id INT NULL,
    product_name NVARCHAR(150) NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    cost_price DECIMAL(12,2) NULL,
    original_price DECIMAL(12,2) NULL,
    description NVARCHAR(MAX) NULL,
    image_url NVARCHAR(MAX) NULL,
    material NVARCHAR(100) NULL,
    brand NVARCHAR(100) NULL,
    origin NVARCHAR(100) NULL,
    care_instructions NVARCHAR(MAX) NULL,
    fit_guide NVARCHAR(MAX) NULL,
    is_combo BIT NOT NULL CONSTRAINT DF_products_combo DEFAULT 0,
    video_url NVARCHAR(MAX) NULL,
    status TINYINT NOT NULL CONSTRAINT DF_products_status DEFAULT 1,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_products_created DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL CONSTRAINT DF_products_updated DEFAULT SYSDATETIME(),
    CONSTRAINT FK_products_categories FOREIGN KEY (category_id) REFERENCES categories(category_id),
    CONSTRAINT FK_products_brands FOREIGN KEY (brand_id) REFERENCES brands(brand_id),
    CONSTRAINT CK_products_price CHECK (price >= 0),
    CONSTRAINT CK_products_original_price CHECK (original_price IS NULL OR original_price >= price),
    CONSTRAINT CK_products_status CHECK (status IN (0,1))
);

IF COL_LENGTH('products', 'brand') IS NULL
    ALTER TABLE products ADD brand NVARCHAR(100) NULL;
IF COL_LENGTH('products', 'brand_id') IS NULL
    ALTER TABLE products ADD brand_id INT NULL;
IF COL_LENGTH('products', 'care_instructions') IS NULL
    ALTER TABLE products ADD care_instructions NVARCHAR(MAX) NULL;
IF COL_LENGTH('products', 'fit_guide') IS NULL
    ALTER TABLE products ADD fit_guide NVARCHAR(MAX) NULL;
IF COL_LENGTH('products', 'is_combo') IS NULL
    ALTER TABLE products ADD is_combo BIT NOT NULL
        CONSTRAINT DF_products_is_combo_sync DEFAULT 0 WITH VALUES;
IF COL_LENGTH('products', 'created_at') IS NULL
    ALTER TABLE products ADD created_at DATETIME2 NOT NULL
        CONSTRAINT DF_products_created_sync DEFAULT SYSDATETIME() WITH VALUES;
IF COL_LENGTH('products', 'updated_at') IS NULL
    ALTER TABLE products ADD updated_at DATETIME2 NOT NULL
        CONSTRAINT DF_products_updated_sync DEFAULT SYSDATETIME() WITH VALUES;
IF COL_LENGTH('products', 'cost_price') IS NULL
    ALTER TABLE products ADD cost_price DECIMAL(12,2) NULL;
IF NOT EXISTS (
    SELECT 1 FROM sys.foreign_keys
    WHERE name='FK_products_brands' AND parent_object_id=OBJECT_ID('products')
)
    ALTER TABLE products WITH CHECK ADD CONSTRAINT FK_products_brands
        FOREIGN KEY(brand_id) REFERENCES brands(brand_id);

-- Bng product_variants: Lu SKU, mu, kch thc, gi ring v s lng tn kho.
IF OBJECT_ID('product_variants', 'U') IS NULL
CREATE TABLE product_variants (
    variant_id INT IDENTITY(1,1) PRIMARY KEY,
    product_id INT NOT NULL,
    color NVARCHAR(50) NOT NULL,
    size NVARCHAR(20) NOT NULL,
    quantity INT NOT NULL CONSTRAINT DF_variants_quantity DEFAULT 0,
    sku VARCHAR(100) NULL,
    price DECIMAL(12,2) NULL,
    image_url NVARCHAR(MAX) NULL,
    CONSTRAINT UQ_product_variant UNIQUE(product_id, color, size),
    CONSTRAINT FK_variants_products FOREIGN KEY (product_id)
        REFERENCES products(product_id) ON DELETE CASCADE,
    CONSTRAINT CK_variants_quantity CHECK (quantity >= 0),
    CONSTRAINT CK_variants_price CHECK (price IS NULL OR price >= 0)
);

IF COL_LENGTH('product_variants', 'cost_price') IS NULL
    ALTER TABLE product_variants ADD cost_price DECIMAL(12,2) NOT NULL
        CONSTRAINT DF_product_variants_cost DEFAULT 0;

IF OBJECT_ID('stock_import_receipts', 'U') IS NULL
CREATE TABLE stock_import_receipts (
    receipt_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    receipt_code VARCHAR(50) NOT NULL UNIQUE,
    supplier_name NVARCHAR(200) NOT NULL,
    supplier_phone VARCHAR(30) NULL,
    note NVARCHAR(MAX) NULL,
    subtotal_amount DECIMAL(14,2) NOT NULL CONSTRAINT DF_stock_receipts_subtotal DEFAULT 0,
    discount_amount DECIMAL(14,2) NOT NULL CONSTRAINT DF_stock_receipts_discount DEFAULT 0,
    tax_amount DECIMAL(14,2) NOT NULL CONSTRAINT DF_stock_receipts_tax_amount DEFAULT 0,
    tax_rate DECIMAL(5,2) NOT NULL CONSTRAINT DF_stock_receipts_tax_rate DEFAULT 0,
    shipping_fee DECIMAL(14,2) NOT NULL CONSTRAINT DF_stock_receipts_shipping DEFAULT 0,
    other_fee DECIMAL(14,2) NOT NULL CONSTRAINT DF_stock_receipts_other DEFAULT 0,
    total_amount DECIMAL(14,2) NOT NULL,
    created_by VARCHAR(100) NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_stock_receipts_date DEFAULT SYSDATETIME()
);

IF OBJECT_ID('stock_imports', 'U') IS NULL
CREATE TABLE stock_imports (
    stock_import_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    variant_id INT NOT NULL,
    quantity INT NOT NULL,
    unit_cost DECIMAL(12,2) NOT NULL,
    total_cost DECIMAL(14,2) NOT NULL,
    imported_at DATETIME2 NOT NULL CONSTRAINT DF_stock_imports_date DEFAULT SYSDATETIME(),
    CONSTRAINT FK_stock_imports_variant FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id),
    CONSTRAINT CK_stock_imports_quantity CHECK (quantity > 0),
    CONSTRAINT CK_stock_imports_cost CHECK (unit_cost > 0 AND total_cost > 0)
);

IF COL_LENGTH('stock_imports', 'receipt_id') IS NULL
BEGIN
    ALTER TABLE stock_imports ADD receipt_id BIGINT NULL;
    ALTER TABLE stock_imports ADD CONSTRAINT FK_stock_imports_receipt
        FOREIGN KEY(receipt_id) REFERENCES stock_import_receipts(receipt_id);
END;

IF COL_LENGTH('stock_imports', 'stock_after') IS NULL
    ALTER TABLE stock_imports ADD stock_after INT NOT NULL
        CONSTRAINT DF_stock_imports_stock_after DEFAULT 0 WITH VALUES;

IF COL_LENGTH('product_variants', 'price') IS NULL
    ALTER TABLE product_variants ADD price DECIMAL(12,2) NULL;
IF COL_LENGTH('product_variants', 'image_url') IS NULL
    ALTER TABLE product_variants ADD image_url NVARCHAR(MAX) NULL;

;WITH DuplicateSku AS (
    SELECT variant_id, sku,
           ROW_NUMBER() OVER (PARTITION BY sku ORDER BY variant_id) AS duplicate_number
    FROM product_variants
    WHERE sku IS NOT NULL
)
UPDATE DuplicateSku
SET sku = CONCAT(sku, '-V', variant_id)
WHERE duplicate_number > 1;

IF NOT EXISTS (
    SELECT 1 FROM sys.indexes
    WHERE name='UX_product_variants_sku' AND object_id=OBJECT_ID('product_variants')
)
    CREATE UNIQUE INDEX UX_product_variants_sku
        ON product_variants(sku) WHERE sku IS NOT NULL;

-- Bảng product_images: Lưu ảnh đại diện và thư viện ảnh của từng sản phẩm.
IF OBJECT_ID('product_images', 'U') IS NULL
CREATE TABLE product_images (
    image_id INT IDENTITY(1,1) PRIMARY KEY,
    product_id INT NOT NULL,
    image_url NVARCHAR(MAX) NOT NULL,
    is_primary BIT NOT NULL CONSTRAINT DF_product_images_primary DEFAULT 0,
    display_order INT NOT NULL CONSTRAINT DF_product_images_order DEFAULT 1,
    CONSTRAINT FK_product_images_products FOREIGN KEY (product_id)
        REFERENCES products(product_id) ON DELETE CASCADE,
    CONSTRAINT CK_product_images_order CHECK (display_order > 0)
);

-- Bng product_combo_items: Lin kt mt sn phm combo vi cc sn phm thnh phn.
IF OBJECT_ID('product_combo_items', 'U') IS NULL
CREATE TABLE product_combo_items (
    combo_item_id INT IDENTITY(1,1) PRIMARY KEY,
    combo_product_id INT NOT NULL,
    component_product_id INT NOT NULL,
    quantity INT NOT NULL CONSTRAINT DF_combo_items_quantity DEFAULT 1,
    display_order INT NOT NULL CONSTRAINT DF_combo_items_order DEFAULT 1,
    CONSTRAINT UQ_combo_component UNIQUE(combo_product_id, component_product_id),
    CONSTRAINT FK_combo_items_combo FOREIGN KEY (combo_product_id)
        REFERENCES products(product_id) ON DELETE CASCADE,
    CONSTRAINT FK_combo_items_component FOREIGN KEY (component_product_id)
        REFERENCES products(product_id),
    CONSTRAINT CK_combo_not_self CHECK (combo_product_id <> component_product_id),
    CONSTRAINT CK_combo_quantity CHECK (quantity > 0)
);

-- Bng product_price_audit_logs: Ghi lch s thay i gi  kim tra v i chiu.
IF OBJECT_ID('product_price_audit_logs', 'U') IS NULL
CREATE TABLE product_price_audit_logs (
    audit_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    product_id INT NOT NULL,
    old_price DECIMAL(12,2) NOT NULL,
    new_price DECIMAL(12,2) NOT NULL,
    changed_by INT NULL,
    changed_at DATETIME2 NOT NULL CONSTRAINT DF_price_audit_date DEFAULT SYSDATETIME(),
    note NVARCHAR(500) NULL,
    CONSTRAINT FK_price_audit_product FOREIGN KEY (product_id) REFERENCES products(product_id),
    CONSTRAINT FK_price_audit_user FOREIGN KEY (changed_by) REFERENCES users(user_id)
);

/* ========================= GI HNG, KHUYN MI V N HNG ========================= */

-- Bảng carts: Lưu giỏ hàng hiện hành của từng người dùng.
IF OBJECT_ID('carts', 'U') IS NULL
CREATE TABLE carts (
    cart_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    updated_at DATETIME2 NOT NULL CONSTRAINT DF_carts_updated DEFAULT SYSDATETIME(),
    CONSTRAINT FK_carts_users FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
IF COL_LENGTH('carts', 'updated_at') IS NULL
    ALTER TABLE carts ADD updated_at DATETIME2 NOT NULL
        CONSTRAINT DF_carts_updated_sync DEFAULT SYSDATETIME() WITH VALUES;

-- Bng cart_details: Lu tng bin th, s lng v gi ti thi im thm vo gi.
IF OBJECT_ID('cart_details', 'U') IS NULL
CREATE TABLE cart_details (
    cart_detail_id INT IDENTITY(1,1) PRIMARY KEY,
    cart_id INT NOT NULL,
    variant_id INT NOT NULL,
    quantity INT NOT NULL,
    CONSTRAINT UQ_cart_variant UNIQUE(cart_id, variant_id),
    CONSTRAINT FK_cart_details_cart FOREIGN KEY (cart_id) REFERENCES carts(cart_id) ON DELETE CASCADE,
    CONSTRAINT FK_cart_details_variant FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id),
    CONSTRAINT CK_cart_quantity CHECK (quantity > 0)
);

-- Bng saved_for_later: Lu sn phm khch hng tm  dnh mua sau.
IF OBJECT_ID('saved_for_later', 'U') IS NULL
CREATE TABLE saved_for_later (
    saved_item_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    variant_id INT NOT NULL,
    quantity INT NOT NULL CONSTRAINT DF_saved_quantity DEFAULT 1,
    saved_at DATETIME2 NOT NULL CONSTRAINT DF_saved_date DEFAULT SYSDATETIME(),
    CONSTRAINT UQ_saved_user_variant UNIQUE(user_id, variant_id),
    CONSTRAINT FK_saved_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT FK_saved_variant FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id)
);

-- Bng coupons: Lu m gim gi, gi tr, gii hn v phm vi p dng.
IF OBJECT_ID('coupons', 'U') IS NULL
CREATE TABLE coupons (
    coupon_id INT IDENTITY(1,1) PRIMARY KEY,
    coupon_code VARCHAR(50) NOT NULL UNIQUE,
    discount_type TINYINT NOT NULL,
    discount_value DECIMAL(12,2) NOT NULL,
    min_order_value DECIMAL(12,2) NOT NULL CONSTRAINT DF_coupon_min DEFAULT 0,
    max_discount_value DECIMAL(12,2) NULL,
    start_date DATETIME2 NOT NULL,
    end_date DATETIME2 NOT NULL,
    usage_limit INT NOT NULL CONSTRAINT DF_coupon_limit DEFAULT 100,
    used_count INT NOT NULL CONSTRAINT DF_coupon_used DEFAULT 0,
    status TINYINT NOT NULL CONSTRAINT DF_coupon_status DEFAULT 1,
    category_id INT NULL,
    applicable_user_type TINYINT NOT NULL CONSTRAINT DF_coupon_user_type DEFAULT 0,
    applicable_scope TINYINT NOT NULL CONSTRAINT DF_coupon_scope DEFAULT 0,
    applicable_product_ids VARCHAR(1000) NULL,
    CONSTRAINT FK_coupons_category FOREIGN KEY (category_id) REFERENCES categories(category_id),
    CONSTRAINT CK_coupon_type CHECK (discount_type IN (1,2)),
    CONSTRAINT CK_coupon_value CHECK (discount_value > 0),
    CONSTRAINT CK_coupon_dates CHECK (end_date >= start_date),
    CONSTRAINT CK_coupon_usage CHECK (used_count >= 0 AND used_count <= usage_limit),
    CONSTRAINT CK_coupon_status CHECK (status IN (0,1))
);
IF COL_LENGTH('coupons', 'category_id') IS NULL
    ALTER TABLE coupons ADD category_id INT NULL;
IF COL_LENGTH('coupons', 'applicable_user_type') IS NULL
    ALTER TABLE coupons ADD applicable_user_type TINYINT NOT NULL
        CONSTRAINT DF_coupon_user_type_sync DEFAULT 0 WITH VALUES;
IF COL_LENGTH('coupons', 'applicable_scope') IS NULL
    ALTER TABLE coupons ADD applicable_scope TINYINT NOT NULL
        CONSTRAINT DF_coupon_scope_sync DEFAULT 0 WITH VALUES;
IF COL_LENGTH('coupons', 'applicable_product_ids') IS NULL
    ALTER TABLE coupons ADD applicable_product_ids VARCHAR(1000) NULL;
IF NOT EXISTS (
    SELECT 1 FROM sys.foreign_keys
    WHERE name='FK_coupons_category' AND parent_object_id=OBJECT_ID('coupons')
)
    ALTER TABLE coupons WITH CHECK ADD CONSTRAINT FK_coupons_category
        FOREIGN KEY(category_id) REFERENCES categories(category_id);

-- Bng flash_sales: Lu chng trnh gim gi nhanh theo khong thi gian.
IF OBJECT_ID('flash_sales', 'U') IS NULL
CREATE TABLE flash_sales (
    flash_sale_id INT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(200) NOT NULL,
    start_at DATETIME2 NOT NULL,
    end_at DATETIME2 NOT NULL,
    discount_percent DECIMAL(5,2) NOT NULL,
    status TINYINT NOT NULL CONSTRAINT DF_flash_sale_status DEFAULT 1,
    CONSTRAINT CK_flash_sale_dates CHECK (end_at > start_at),
    CONSTRAINT CK_flash_sale_discount CHECK (discount_percent > 0 AND discount_percent <= 100)
);

-- Bng flash_sale_products: Lin kt sn phm v gi u i vi chng trnh flash sale.
IF OBJECT_ID('flash_sale_products', 'U') IS NULL
CREATE TABLE flash_sale_products (
    flash_sale_id INT NOT NULL,
    product_id INT NOT NULL,
    sale_price DECIMAL(12,2) NULL,
    quantity_limit INT NULL,
    PRIMARY KEY(flash_sale_id, product_id),
    CONSTRAINT FK_flash_products_sale FOREIGN KEY (flash_sale_id)
        REFERENCES flash_sales(flash_sale_id) ON DELETE CASCADE,
    CONSTRAINT FK_flash_products_product FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Bng orders: Lu thng tin tng qut, ngi nhn, vn chuyn v trng thi n hng.
IF OBJECT_ID('orders', 'U') IS NULL
CREATE TABLE orders (
    order_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    coupon_id INT NULL,
    order_date DATETIME2 NOT NULL CONSTRAINT DF_orders_date DEFAULT SYSDATETIME(),
    total_amount DECIMAL(12,2) NOT NULL,
    discount_amount DECIMAL(12,2) NOT NULL CONSTRAINT DF_orders_discount DEFAULT 0,
    shipping_fee DECIMAL(12,2) NOT NULL CONSTRAINT DF_orders_shipping DEFAULT 0,
    recipient_name NVARCHAR(100) NOT NULL,
    recipient_phone VARCHAR(15) NOT NULL,
    shipping_address NVARCHAR(500) NOT NULL,
    note NVARCHAR(MAX) NULL,
    cancellation_reason NVARCHAR(500) NULL,
    return_reason NVARCHAR(500) NULL,
    warranty_redelivery BIT NOT NULL CONSTRAINT DF_orders_warranty_redelivery DEFAULT 0,
    delivered_at DATETIME2 NULL,
    shipping_carrier NVARCHAR(100) NULL,
    tracking_code VARCHAR(100) NULL,
    dispatched_at DATETIME2 NULL,
    status TINYINT NOT NULL CONSTRAINT DF_orders_status DEFAULT 0,
    CONSTRAINT FK_orders_users FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT FK_orders_coupons FOREIGN KEY (coupon_id) REFERENCES coupons(coupon_id),
    CONSTRAINT CK_orders_amount CHECK (total_amount >= 0 AND discount_amount >= 0 AND shipping_fee >= 0),
    CONSTRAINT CK_orders_status CHECK (status IN (0,1,2,3,4,5))
);
IF COL_LENGTH('orders', 'note') IS NULL
    ALTER TABLE orders ADD note NVARCHAR(MAX) NULL;
IF COL_LENGTH('orders', 'cancellation_reason') IS NULL
    ALTER TABLE orders ADD cancellation_reason NVARCHAR(500) NULL;
IF COL_LENGTH('orders', 'return_reason') IS NULL
    ALTER TABLE orders ADD return_reason NVARCHAR(500) NULL;
IF COL_LENGTH('orders', 'warranty_redelivery') IS NULL
    EXEC(N'ALTER TABLE orders ADD warranty_redelivery BIT NULL;');
-- Cập nhật đơn hàng cũ trước khi ép cột thành NOT NULL.
EXEC(N'UPDATE orders SET warranty_redelivery = 0 WHERE warranty_redelivery IS NULL;');
EXEC(N'ALTER TABLE orders ALTER COLUMN warranty_redelivery BIT NOT NULL;');
IF NOT EXISTS (
    SELECT 1
    FROM sys.default_constraints dc
    JOIN sys.columns c
      ON c.object_id = dc.parent_object_id
     AND c.column_id = dc.parent_column_id
    WHERE dc.parent_object_id = OBJECT_ID('orders')
      AND c.name = 'warranty_redelivery'
)
    ALTER TABLE orders ADD CONSTRAINT DF_orders_warranty_redelivery_sync
        DEFAULT 0 FOR warranty_redelivery;
IF COL_LENGTH('orders', 'delivered_at') IS NULL
    ALTER TABLE orders ADD delivered_at DATETIME2 NULL;
IF COL_LENGTH('orders', 'shipping_carrier') IS NULL
    ALTER TABLE orders ADD shipping_carrier NVARCHAR(100) NULL;
IF COL_LENGTH('orders', 'tracking_code') IS NULL
    ALTER TABLE orders ADD tracking_code VARCHAR(100) NULL;
IF COL_LENGTH('orders', 'dispatched_at') IS NULL
    ALTER TABLE orders ADD dispatched_at DATETIME2 NULL;

-- Bảng order_details: Lưu từng sản phẩm và bản chụp thông tin tại lúc đặt hàng.
IF OBJECT_ID('order_details', 'U') IS NULL
CREATE TABLE order_details (
    order_detail_id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL,
    variant_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(12,2) NOT NULL,
    product_name_snapshot NVARCHAR(150) NULL,
    variant_snapshot NVARCHAR(200) NULL,
    CONSTRAINT FK_order_details_order FOREIGN KEY (order_id)
        REFERENCES orders(order_id) ON DELETE CASCADE,
    CONSTRAINT FK_order_details_variant FOREIGN KEY (variant_id) REFERENCES product_variants(variant_id),
    CONSTRAINT CK_order_detail_quantity CHECK (quantity > 0),
    CONSTRAINT CK_order_detail_price CHECK (price >= 0)
);
IF COL_LENGTH('order_details', 'product_name_snapshot') IS NULL
    ALTER TABLE order_details ADD product_name_snapshot NVARCHAR(150) NULL;
IF COL_LENGTH('order_details', 'variant_snapshot') IS NULL
    ALTER TABLE order_details ADD variant_snapshot NVARCHAR(200) NULL;
IF COL_LENGTH('order_details', 'cost_price') IS NULL
    ALTER TABLE order_details ADD cost_price DECIMAL(12,2) NULL;

IF COL_LENGTH('orders', 'tax_amount') IS NULL
    ALTER TABLE orders ADD tax_amount DECIMAL(12,2) NOT NULL
        CONSTRAINT DF_orders_tax_amount DEFAULT 0 WITH VALUES;

IF COL_LENGTH('product_combo_items', 'is_gift') IS NULL
    ALTER TABLE product_combo_items ADD is_gift BIT NOT NULL
        CONSTRAINT DF_combo_items_gift DEFAULT 0 WITH VALUES;

IF COL_LENGTH('products', 'flash_sale_start_at') IS NULL
    ALTER TABLE products ADD flash_sale_start_at DATETIME2 NULL;
IF COL_LENGTH('products', 'flash_sale_end_at') IS NULL
    ALTER TABLE products ADD flash_sale_end_at DATETIME2 NULL;

-- Bng payments: Lu giao dch v trng thi thanh ton ca n hng.
IF OBJECT_ID('payments', 'U') IS NULL
CREATE TABLE payments (
    payment_id INT IDENTITY(1,1) PRIMARY KEY,
    order_id INT NOT NULL,
    payment_method NVARCHAR(50) NOT NULL,
    payment_status TINYINT NOT NULL CONSTRAINT DF_payment_status DEFAULT 0,
    transaction_id VARCHAR(100) NULL,
    payment_date DATETIME2 NOT NULL CONSTRAINT DF_payment_date DEFAULT SYSDATETIME(),
    amount DECIMAL(12,2) NOT NULL,
    provider_payload NVARCHAR(MAX) NULL,
    CONSTRAINT FK_payments_order FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    CONSTRAINT CK_payment_status CHECK (payment_status IN (0,1,2)),
    CONSTRAINT CK_payment_amount CHECK (amount >= 0)
);
IF COL_LENGTH('payments', 'provider_payload') IS NULL
    ALTER TABLE payments ADD provider_payload NVARCHAR(MAX) NULL;

-- Bng payment_reconciliations: Lu kt qu i sot giao dch vi nh cung cp thanh ton.
IF OBJECT_ID('payment_reconciliations', 'U') IS NULL
CREATE TABLE payment_reconciliations (
    reconciliation_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    payment_id INT NOT NULL UNIQUE,
    reconciliation_code VARCHAR(100) NOT NULL UNIQUE,
    reconciled_by INT NULL,
    reconciled_at DATETIME2 NOT NULL CONSTRAINT DF_reconciliation_date DEFAULT SYSDATETIME(),
    status VARCHAR(20) NOT NULL CONSTRAINT DF_reconciliation_status DEFAULT 'reconciled',
    note NVARCHAR(500) NULL,
    CONSTRAINT FK_reconciliation_payment FOREIGN KEY (payment_id) REFERENCES payments(payment_id),
    CONSTRAINT FK_reconciliation_user FOREIGN KEY (reconciled_by) REFERENCES users(user_id)
);

-- Bng user_coupons: Theo di m gim gi c cp v  s dng ca tng ngi dng.
IF OBJECT_ID('user_coupons', 'U') IS NULL
CREATE TABLE user_coupons (
    user_id INT NOT NULL,
    coupon_id INT NOT NULL,
    order_id INT NOT NULL,
    used_at DATETIME2 NOT NULL CONSTRAINT DF_user_coupon_used DEFAULT SYSDATETIME(),
    PRIMARY KEY(user_id, coupon_id),
    CONSTRAINT FK_user_coupons_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT FK_user_coupons_coupon FOREIGN KEY (coupon_id) REFERENCES coupons(coupon_id),
    CONSTRAINT FK_user_coupons_order FOREIGN KEY (order_id) REFERENCES orders(order_id)
);

/* ========================= TƯƠNG TÁC KHÁCH HÀNG ========================= */

-- Bng wishlists: Lu danh sch sn phm yu thch ca ngi dng.
IF OBJECT_ID('wishlists', 'U') IS NULL
CREATE TABLE wishlists (
    wishlist_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    added_date DATETIME2 NOT NULL CONSTRAINT DF_wishlist_date DEFAULT SYSDATETIME(),
    CONSTRAINT UQ_wishlist UNIQUE(user_id, product_id),
    CONSTRAINT FK_wishlist_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT FK_wishlist_product FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Bng reviews: Lu nh gi sn phm, trng thi duyt v phn hi qun tr vin.
IF OBJECT_ID('reviews', 'U') IS NULL
CREATE TABLE reviews (
    review_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    order_id INT NULL,
    rating TINYINT NOT NULL,
    comment NVARCHAR(MAX) NULL,
    review_date DATETIME2 NOT NULL CONSTRAINT DF_reviews_date DEFAULT SYSDATETIME(),
    status TINYINT NOT NULL CONSTRAINT DF_reviews_status DEFAULT 1,
    admin_reply NVARCHAR(MAX) NULL,
    replied_at DATETIME2 NULL,
    CONSTRAINT FK_reviews_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT FK_reviews_product FOREIGN KEY (product_id) REFERENCES products(product_id),
    CONSTRAINT FK_reviews_order FOREIGN KEY (order_id) REFERENCES orders(order_id),
    CONSTRAINT CK_reviews_rating CHECK (rating BETWEEN 1 AND 5),
    CONSTRAINT CK_reviews_status CHECK (status IN (0,1))
);
IF COL_LENGTH('reviews', 'order_id') IS NULL
    ALTER TABLE reviews ADD order_id INT NULL;
IF COL_LENGTH('reviews', 'status') IS NULL
    ALTER TABLE reviews ADD status TINYINT NOT NULL
        CONSTRAINT DF_reviews_status_sync DEFAULT 1 WITH VALUES;
IF COL_LENGTH('reviews', 'admin_reply') IS NULL
    ALTER TABLE reviews ADD admin_reply NVARCHAR(MAX) NULL;
IF COL_LENGTH('reviews', 'replied_at') IS NULL
    ALTER TABLE reviews ADD replied_at DATETIME2 NULL;
IF NOT EXISTS (
    SELECT 1 FROM sys.foreign_keys
    WHERE name='FK_reviews_order' AND parent_object_id=OBJECT_ID('reviews')
)
    ALTER TABLE reviews WITH CHECK ADD CONSTRAINT FK_reviews_order
        FOREIGN KEY(order_id) REFERENCES orders(order_id);

-- Bảng banners: Lưu banner, dòng marquee, vị trí và thời gian hiển thị.
IF OBJECT_ID('banners', 'U') IS NULL
CREATE TABLE banners (
    banner_id INT IDENTITY(1,1) PRIMARY KEY,
    title NVARCHAR(150) NOT NULL,
    image_url NVARCHAR(MAX) NOT NULL,
    banner_type VARCHAR(20) NOT NULL CONSTRAINT DF_banners_type DEFAULT 'IMAGE',
    link_url NVARCHAR(MAX) NULL,
    position INT NOT NULL CONSTRAINT DF_banners_position DEFAULT 1,
    display_order INT NOT NULL CONSTRAINT DF_banners_order DEFAULT 1,
    start_at DATETIME2 NULL,
    end_at DATETIME2 NULL,
    status TINYINT NOT NULL CONSTRAINT DF_banners_status DEFAULT 1,
    CONSTRAINT CK_banners_status CHECK (status IN (0,1))
);
IF COL_LENGTH('banners', 'banner_type') IS NULL
    ALTER TABLE banners ADD banner_type VARCHAR(20) NOT NULL
        CONSTRAINT DF_banners_type_sync DEFAULT 'IMAGE' WITH VALUES;
IF COL_LENGTH('banners', 'display_order') IS NULL
    ALTER TABLE banners ADD display_order INT NOT NULL
        CONSTRAINT DF_banners_order_sync DEFAULT 1 WITH VALUES;
IF COL_LENGTH('banners', 'start_at') IS NULL
    ALTER TABLE banners ADD start_at DATETIME2 NULL;
IF COL_LENGTH('banners', 'end_at') IS NULL
    ALTER TABLE banners ADD end_at DATETIME2 NULL;

-- Bng notifications: Lu thng bo c nhn hoc thng bo ton h thng.
IF OBJECT_ID('notifications', 'U') IS NULL
CREATE TABLE notifications (
    notification_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NULL,
    title NVARCHAR(200) NOT NULL,
    content NVARCHAR(MAX) NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    action_url NVARCHAR(500) NULL,
    is_global BIT NOT NULL CONSTRAINT DF_notifications_global DEFAULT 0,
    is_read BIT NOT NULL CONSTRAINT DF_notifications_read DEFAULT 0,
    created_by INT NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_notifications_created DEFAULT SYSDATETIME(),
    CONSTRAINT FK_notifications_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT FK_notifications_creator FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- Bng chat_messages: Lu ni dung hi thoi gia khch hng v nhn vin.
IF OBJECT_ID('chat_messages', 'U') IS NULL
CREATE TABLE chat_messages (
    message_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    channel_id VARCHAR(150) NOT NULL,
    customer_name NVARCHAR(150) NULL,
    sender_id VARCHAR(150) NULL,
    sender_name NVARCHAR(150) NOT NULL,
    sender_role VARCHAR(30) NOT NULL,
    content NVARCHAR(MAX) NOT NULL,
    sent_at DATETIME2 NOT NULL CONSTRAINT DF_chat_sent DEFAULT SYSDATETIME()
);

-- Bảng contact_messages: Lưu yêu cầu được gửi từ biểu mẫu liên hệ trên website.
IF OBJECT_ID('contact_messages', 'U') IS NULL
CREATE TABLE contact_messages (
    contact_message_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NULL,
    full_name NVARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NULL,
    subject NVARCHAR(200) NOT NULL,
    content NVARCHAR(MAX) NOT NULL,
    status VARCHAR(30) NOT NULL CONSTRAINT DF_contact_status DEFAULT 'new',
    assigned_to INT NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_contact_created DEFAULT SYSDATETIME(),
    resolved_at DATETIME2 NULL,
    CONSTRAINT FK_contact_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT FK_contact_assignee FOREIGN KEY (assigned_to) REFERENCES users(user_id)
);

/* ========================= NỘI DUNG VÀ BÀI VIẾT ========================= */

-- Bảng article_topics: Lưu chủ đề dùng để phân loại bài viết.
IF OBJECT_ID('article_topics', 'U') IS NULL
CREATE TABLE article_topics (
    topic_id INT IDENTITY(1,1) PRIMARY KEY,
    topic_name NVARCHAR(150) NOT NULL UNIQUE,
    slug VARCHAR(180) NOT NULL UNIQUE,
    description NVARCHAR(MAX) NULL,
    status TINYINT NOT NULL CONSTRAINT DF_topics_status DEFAULT 1,
    CONSTRAINT CK_topics_status CHECK (status IN (0,1))
);

-- Bng articles: Lu ni dung, tc gi v trng thi xut bn bi vit.
IF OBJECT_ID('articles', 'U') IS NULL
CREATE TABLE articles (
    article_id INT IDENTITY(1,1) PRIMARY KEY,
    topic_id INT NOT NULL,
    author_id INT NULL,
    title NVARCHAR(300) NOT NULL,
    slug VARCHAR(350) NOT NULL UNIQUE,
    summary NVARCHAR(MAX) NULL,
    content NVARCHAR(MAX) NOT NULL,
    image_url NVARCHAR(MAX) NULL,
    extra_image_1 NVARCHAR(MAX) NULL,
    extra_image_2 NVARCHAR(MAX) NULL,
    author_name NVARCHAR(100) NULL,
    view_count INT NOT NULL CONSTRAINT DF_articles_views DEFAULT 0,
    status VARCHAR(20) NOT NULL CONSTRAINT DF_articles_status DEFAULT 'draft',
    published_at DATETIME2 NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_articles_created DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL CONSTRAINT DF_articles_updated DEFAULT SYSDATETIME(),
    CONSTRAINT FK_articles_topic FOREIGN KEY (topic_id) REFERENCES article_topics(topic_id),
    CONSTRAINT FK_articles_author FOREIGN KEY (author_id) REFERENCES users(user_id),
    CONSTRAINT CK_articles_views CHECK (view_count >= 0)
);

IF COL_LENGTH('stock_import_receipts', 'subtotal_amount') IS NULL
    ALTER TABLE stock_import_receipts ADD subtotal_amount DECIMAL(14,2) NOT NULL CONSTRAINT DF_stock_receipts_subtotal_sync DEFAULT 0 WITH VALUES;
IF COL_LENGTH('stock_import_receipts', 'discount_amount') IS NULL
    ALTER TABLE stock_import_receipts ADD discount_amount DECIMAL(14,2) NOT NULL CONSTRAINT DF_stock_receipts_discount_sync DEFAULT 0 WITH VALUES;
IF COL_LENGTH('stock_import_receipts', 'tax_amount') IS NULL
    ALTER TABLE stock_import_receipts ADD tax_amount DECIMAL(14,2) NOT NULL CONSTRAINT DF_stock_receipts_tax_amount_sync DEFAULT 0 WITH VALUES;
IF COL_LENGTH('stock_import_receipts', 'tax_rate') IS NULL
    ALTER TABLE stock_import_receipts ADD tax_rate DECIMAL(5,2) NOT NULL CONSTRAINT DF_stock_receipts_tax_rate_sync DEFAULT 0 WITH VALUES;
IF COL_LENGTH('stock_import_receipts', 'shipping_fee') IS NULL
    ALTER TABLE stock_import_receipts ADD shipping_fee DECIMAL(14,2) NOT NULL CONSTRAINT DF_stock_receipts_shipping_sync DEFAULT 0 WITH VALUES;
IF COL_LENGTH('stock_import_receipts', 'other_fee') IS NULL
    ALTER TABLE stock_import_receipts ADD other_fee DECIMAL(14,2) NOT NULL CONSTRAINT DF_stock_receipts_other_sync DEFAULT 0 WITH VALUES;

-- Đồng bộ các cột bài viết cho database được tạo từ phiên bản website cũ.
IF COL_LENGTH('articles', 'author_id') IS NULL
    ALTER TABLE articles ADD author_id INT NULL;
IF COL_LENGTH('articles', 'author_name') IS NULL
    ALTER TABLE articles ADD author_name NVARCHAR(100) NULL;
IF COL_LENGTH('articles', 'view_count') IS NULL
    ALTER TABLE articles ADD view_count INT NOT NULL
        CONSTRAINT DF_articles_views_sync DEFAULT 0 WITH VALUES;
IF COL_LENGTH('articles', 'published_at') IS NULL
    ALTER TABLE articles ADD published_at DATETIME2 NULL;

-- Bng article_products: Lin kt bi vit vi cc sn phm c gii thiu.
IF OBJECT_ID('article_products', 'U') IS NULL
CREATE TABLE article_products (
    article_id INT NOT NULL,
    product_id INT NOT NULL,
    display_order INT NOT NULL CONSTRAINT DF_article_products_order DEFAULT 1,
    PRIMARY KEY(article_id, product_id),
    CONSTRAINT FK_article_products_article FOREIGN KEY (article_id)
        REFERENCES articles(article_id) ON DELETE CASCADE,
    CONSTRAINT FK_article_products_product FOREIGN KEY (product_id) REFERENCES products(product_id)
);
IF COL_LENGTH('article_products', 'display_order') IS NULL
    ALTER TABLE article_products ADD display_order INT NOT NULL
        CONSTRAINT DF_article_products_order_sync DEFAULT 1 WITH VALUES;

/* ========================= BẢO HÀNH ========================= */

-- Bng warranty_policies: Lu iu kin v thi hn ca chnh sch bo hnh.
IF OBJECT_ID('warranty_policies', 'U') IS NULL
CREATE TABLE warranty_policies (
    policy_id INT IDENTITY(1,1) PRIMARY KEY,
    policy_name NVARCHAR(200) NOT NULL,
    category_id INT NULL,
    duration_days INT NOT NULL,
    conditions NVARCHAR(MAX) NULL,
    status TINYINT NOT NULL CONSTRAINT DF_warranty_policy_status DEFAULT 1,
    CONSTRAINT FK_warranty_policy_category FOREIGN KEY (category_id) REFERENCES categories(category_id),
    CONSTRAINT CK_warranty_duration CHECK (duration_days >= 0)
);

-- Bng warranty_claims: Lu yu cu bo hnh gn vi khch hng, n v sn phm.
IF OBJECT_ID('warranty_claims', 'U') IS NULL
CREATE TABLE warranty_claims (
    claim_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    claim_code VARCHAR(50) NOT NULL UNIQUE,
    order_detail_id INT NOT NULL,
    user_id INT NOT NULL,
    reason NVARCHAR(MAX) NOT NULL,
    evidence_urls NVARCHAR(MAX) NULL,
    status VARCHAR(30) NOT NULL CONSTRAINT DF_warranty_claim_status DEFAULT 'pending',
    received_at DATETIME2 NULL,
    completed_at DATETIME2 NULL,
    handled_by INT NULL,
    resolution_note NVARCHAR(MAX) NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_warranty_claim_created DEFAULT SYSDATETIME(),
    CONSTRAINT FK_warranty_claim_detail FOREIGN KEY (order_detail_id) REFERENCES order_details(order_detail_id),
    CONSTRAINT FK_warranty_claim_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT FK_warranty_claim_staff FOREIGN KEY (handled_by) REFERENCES users(user_id)
);

/* ========================= VẬN CHUYỂN VÀ CẤU HÌNH ========================= */

-- Bảng districts: Lưu khu vực giao hàng, tỉnh thành và mức phí vận chuyển.
IF OBJECT_ID('districts', 'U') IS NULL
CREATE TABLE districts (
    district_id INT IDENTITY(1,1) PRIMARY KEY,
    district_name NVARCHAR(100) NOT NULL,
    province NVARCHAR(100) NOT NULL,
    status TINYINT NOT NULL CONSTRAINT DF_districts_status DEFAULT 1,
    CONSTRAINT UQ_district UNIQUE(province, district_name),
    CONSTRAINT CK_district_status CHECK (status IN (0,1))
);

-- Bng store_branches: Lu a ch, ta  v thng tin lin h ca chi nhnh.
IF OBJECT_ID('store_branches', 'U') IS NULL
CREATE TABLE store_branches (
    branch_id INT IDENTITY(1,1) PRIMARY KEY,
    branch_code VARCHAR(30) NOT NULL UNIQUE,
    branch_name NVARCHAR(150) NOT NULL,
    address NVARCHAR(500) NOT NULL,
    province NVARCHAR(100) NULL,
    district NVARCHAR(100) NULL,
    phone VARCHAR(20) NOT NULL,
    branch_type VARCHAR(30) NOT NULL,
    is_default_pickup BIT NOT NULL CONSTRAINT DF_branch_default DEFAULT 0,
    status VARCHAR(20) NOT NULL CONSTRAINT DF_branch_status DEFAULT 'active',
    latitude DECIMAL(10,7) NULL,
    longitude DECIMAL(10,7) NULL
);

-- Bng shipping_carriers: Lu cc n v vn chuyn v trng thi tch hp.
IF OBJECT_ID('shipping_carriers', 'U') IS NULL
CREATE TABLE shipping_carriers (
    carrier_id INT IDENTITY(1,1) PRIMARY KEY,
    carrier_code VARCHAR(30) NOT NULL UNIQUE,
    carrier_name NVARCHAR(150) NOT NULL,
    api_base_url NVARCHAR(500) NULL,
    api_token_encrypted NVARCHAR(MAX) NULL,
    status TINYINT NOT NULL CONSTRAINT DF_carriers_status DEFAULT 1
);

-- Bng settings: Lu cu hnh dng kha-gi tr dng chung cho website v admin.
IF OBJECT_ID('settings', 'U') IS NULL
CREATE TABLE settings (
    setting_id INT IDENTITY(1,1) PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value NVARCHAR(MAX) NULL,
    description NVARCHAR(255) NULL,
    updated_by INT NULL,
    updated_at DATETIME2 NOT NULL CONSTRAINT DF_settings_updated DEFAULT SYSDATETIME(),
    CONSTRAINT FK_settings_user FOREIGN KEY (updated_by) REFERENCES users(user_id)
);

-- Bảng daily_backups: Lưu bản sao JSON dữ liệu quản trị theo từng ngày.
IF OBJECT_ID('daily_backups', 'U') IS NULL
CREATE TABLE daily_backups (
    backup_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    backup_date DATE NOT NULL,
    created_at DATETIME2 NOT NULL,
    created_by NVARCHAR(100) NOT NULL,
    payload NVARCHAR(MAX) NOT NULL,
    CONSTRAINT UK_daily_backup_date UNIQUE (backup_date)
);
IF COL_LENGTH('settings', 'updated_by') IS NULL
    ALTER TABLE settings ADD updated_by INT NULL;
IF COL_LENGTH('settings', 'updated_at') IS NULL
    ALTER TABLE settings ADD updated_at DATETIME2 NOT NULL
        CONSTRAINT DF_settings_updated_sync DEFAULT SYSDATETIME() WITH VALUES;
IF NOT EXISTS (
    SELECT 1 FROM sys.foreign_keys
    WHERE name='FK_settings_user' AND parent_object_id=OBJECT_ID('settings')
)
    ALTER TABLE settings WITH CHECK ADD CONSTRAINT FK_settings_user
        FOREIGN KEY(updated_by) REFERENCES users(user_id);

/* ========================= BẢO MẬT VÀ CHĂM SÓC KHÁCH HÀNG ========================= */

-- Bảng blocked_contacts: Lưu email hoặc số điện thoại bị chặn cùng lý do.
IF OBJECT_ID('blocked_contacts', 'U') IS NULL
CREATE TABLE blocked_contacts (
    blocked_contact_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    contact_type VARCHAR(20) NOT NULL,
    contact_value VARCHAR(255) NOT NULL,
    reason NVARCHAR(500) NULL,
    blocked_by INT NULL,
    blocked_at DATETIME2 NOT NULL CONSTRAINT DF_blocked_contact_date DEFAULT SYSDATETIME(),
    status TINYINT NOT NULL CONSTRAINT DF_blocked_contact_status DEFAULT 1,
    CONSTRAINT UQ_blocked_contact UNIQUE(contact_type, contact_value),
    CONSTRAINT FK_blocked_contact_user FOREIGN KEY (blocked_by) REFERENCES users(user_id)
);

-- Bng security_events: Ghi nht k ng nhp, cnh bo v s kin bo mt.
IF OBJECT_ID('security_events', 'U') IS NULL
CREATE TABLE security_events (
    security_event_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NULL,
    event_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    ip_address VARCHAR(45) NULL,
    user_agent NVARCHAR(500) NULL,
    description NVARCHAR(MAX) NULL,
    metadata_json NVARCHAR(MAX) NULL,
    occurred_at DATETIME2 NOT NULL CONSTRAINT DF_security_event_date DEFAULT SYSDATETIME(),
    resolved BIT NOT NULL CONSTRAINT DF_security_event_resolved DEFAULT 0,
    CONSTRAINT FK_security_event_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Bng crm_templates: Lu mu ni dung chm sc khch hng theo tng knh.
IF OBJECT_ID('crm_templates', 'U') IS NULL
CREATE TABLE crm_templates (
    template_id INT IDENTITY(1,1) PRIMARY KEY,
    template_name NVARCHAR(150) NOT NULL,
    channel VARCHAR(20) NOT NULL,
    subject NVARCHAR(200) NULL,
    content NVARCHAR(MAX) NOT NULL,
    status TINYINT NOT NULL CONSTRAINT DF_crm_template_status DEFAULT 1
);

-- Bng crm_campaigns: Lu chin dch, nhm khch hng, lch gi v trng thi.
IF OBJECT_ID('crm_campaigns', 'U') IS NULL
CREATE TABLE crm_campaigns (
    campaign_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    campaign_name NVARCHAR(200) NOT NULL,
    template_id INT NULL,
    audience_type VARCHAR(50) NOT NULL,
    channel VARCHAR(20) NOT NULL,
    scheduled_at DATETIME2 NULL,
    sent_at DATETIME2 NULL,
    status VARCHAR(30) NOT NULL CONSTRAINT DF_crm_campaign_status DEFAULT 'draft',
    created_by INT NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT DF_crm_campaign_created DEFAULT SYSDATETIME(),
    CONSTRAINT FK_crm_campaign_template FOREIGN KEY (template_id) REFERENCES crm_templates(template_id),
    CONSTRAINT FK_crm_campaign_user FOREIGN KEY (created_by) REFERENCES users(user_id)
);

-- Bảng crm_message_logs: Lưu kết quả gửi hoặc lỗi của từng thông điệp CRM.
IF OBJECT_ID('crm_message_logs', 'U') IS NULL
CREATE TABLE crm_message_logs (
    message_log_id BIGINT IDENTITY(1,1) PRIMARY KEY,
    campaign_id BIGINT NULL,
    user_id INT NULL,
    destination VARCHAR(255) NOT NULL,
    channel VARCHAR(20) NOT NULL,
    status VARCHAR(30) NOT NULL,
    provider_message_id VARCHAR(150) NULL,
    error_message NVARCHAR(MAX) NULL,
    sent_at DATETIME2 NOT NULL CONSTRAINT DF_crm_log_sent DEFAULT SYSDATETIME(),
    CONSTRAINT FK_crm_log_campaign FOREIGN KEY (campaign_id) REFERENCES crm_campaigns(campaign_id),
    CONSTRAINT FK_crm_log_user FOREIGN KEY (user_id) REFERENCES users(user_id)
);

/* ========================= CHỈ MỤC TỐI ƯU TRUY VẤN ========================= */

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_products_combo_status' AND object_id=OBJECT_ID('products'))
    CREATE INDEX IX_products_combo_status ON products(is_combo, status);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_products_category_status' AND object_id=OBJECT_ID('products'))
    CREATE INDEX IX_products_category_status ON products(category_id, status);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_variants_product' AND object_id=OBJECT_ID('product_variants'))
    CREATE INDEX IX_variants_product ON product_variants(product_id);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_orders_user_date' AND object_id=OBJECT_ID('orders'))
    CREATE INDEX IX_orders_user_date ON orders(user_id, order_date DESC);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_orders_status_date' AND object_id=OBJECT_ID('orders'))
    CREATE INDEX IX_orders_status_date ON orders(status, order_date DESC);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_chat_channel_date' AND object_id=OBJECT_ID('chat_messages'))
    CREATE INDEX IX_chat_channel_date ON chat_messages(channel_id, sent_at);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_notifications_user_read' AND object_id=OBJECT_ID('notifications'))
    CREATE INDEX IX_notifications_user_read ON notifications(user_id, is_read, created_at DESC);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name='IX_security_events_date' AND object_id=OBJECT_ID('security_events'))
    CREATE INDEX IX_security_events_date ON security_events(severity, occurred_at DESC);

COMMIT TRANSACTION;
GO

PRINT N'FoxStyle full schema synchronized successfully.';
GO

/* ========================= DỮ LIỆU MẶC ĐỊNH VÀ CHUYỂN ĐỔI DỮ LIỆU CŨ =========================
   Phn ny c gp  ton d n ch cn chy mt file SQL duy nht.
   Cc lnh thm/chuyn i u kim tra tn ti v gi nguyn d liu ang c.
*/

/*
  FOXSTYLE DATABASE - FULL DEFAULT DATA
  Chạy sau 00_foxstyle_schema_full.sql.
  Dữ liệu được chèn theo kiểu idempotent, không xóa dữ liệu đang có.
*/

USE foxstyle_db;
GO

SET XACT_ABORT ON;
BEGIN TRANSACTION;

/* Dữ liệu mặc định cho vai trò */
IF NOT EXISTS (SELECT 1 FROM roles WHERE role_name='ROLE_ADMIN')
    INSERT roles(role_name,description) VALUES('ROLE_ADMIN',N'Quản trị viên hệ thống');
IF NOT EXISTS (SELECT 1 FROM roles WHERE role_name='ROLE_STAFF')
    INSERT roles(role_name,description) VALUES('ROLE_STAFF',N'Nhân viên vận hành');
IF NOT EXISTS (SELECT 1 FROM roles WHERE role_name='ROLE_CUSTOMER')
    INSERT roles(role_name,description) VALUES('ROLE_CUSTOMER',N'Khách hàng mua sắm');

/* Default accounts - mật khẩu BCrypt tương thích dữ liệu mẫu cũ */
DECLARE @AdminRole INT=(SELECT role_id FROM roles WHERE role_name='ROLE_ADMIN');
DECLARE @StaffRole INT=(SELECT role_id FROM roles WHERE role_name='ROLE_STAFF');
DECLARE @CustomerRole INT=(SELECT role_id FROM roles WHERE role_name='ROLE_CUSTOMER');
DECLARE @SamplePassword VARCHAR(255)='$2a$12$N9qo8uLOqp.PZ.fK7lA52u19Zpx79U6jMlyvAexwXWz0N1Sg4J47K';

IF NOT EXISTS (SELECT 1 FROM users WHERE username='admin')
    INSERT users(role_id,username,password,full_name,email,phone,status,theme,language)
    VALUES(@AdminRole,'admin',@SamplePassword,N'Quản trị FoxStyle','admin@foxstyle.vn','0912345678',1,'light','vi');
IF NOT EXISTS (SELECT 1 FROM users WHERE username='staff')
    INSERT users(role_id,username,password,full_name,email,phone,status,theme,language)
    VALUES(@StaffRole,'staff',@SamplePassword,N'Nhân viên FoxStyle','staff@foxstyle.vn','0987654321',1,'light','vi');
IF NOT EXISTS (SELECT 1 FROM users WHERE username='customer')
    INSERT users(role_id,username,password,full_name,email,phone,status,theme,language)
    VALUES(@CustomerRole,'customer',@SamplePassword,N'Khách hàng mẫu','customer@foxstyle.vn','0901234567',1,'light','vi');

/* Dữ liệu mặc định cho thương hiệu */
IF NOT EXISTS (SELECT 1 FROM brands WHERE brand_name=N'FoxStyle Premium')
INSERT brands(brand_name,logo_url,country,website_url,description,is_featured,status) VALUES
(N'FoxStyle Premium',N'/image_san_pham/photo-1541099649105-f69ad21f3246.jpg',N'Việt Nam',N'https://foxstyle.com',N'Thương hiệu thời trang độc quyền phong cách hiện đại.',1,1);
IF NOT EXISTS (SELECT 1 FROM brands WHERE brand_name=N'Zara')
INSERT brands(brand_name,logo_url,country,website_url,description,is_featured,status) VALUES
(N'Zara',N'/image_quan_tri/photo-1512436991641-6745cdb1723f.jpg',N'Tây Ban Nha',N'https://zara.com',N'Thời trang nhanh phong cách Châu Âu.',1,1);
IF NOT EXISTS (SELECT 1 FROM brands WHERE brand_name=N'Uniqlo')
INSERT brands(brand_name,logo_url,country,website_url,description,is_featured,status) VALUES
(N'Uniqlo',N'/image_san_pham/photo-1521572163474-6864f9cf17ab.jpg',N'Nhật Bản',N'https://uniqlo.com',N'Trang phục tối giản LifeWear chất lượng cao.',0,1);
IF NOT EXISTS (SELECT 1 FROM brands WHERE brand_name=N'Nike Wear')
INSERT brands(brand_name,logo_url,country,website_url,description,is_featured,status) VALUES
(N'Nike Wear',N'/image_quan_tri/photo-1542291026-7eec264c27ff.jpg',N'Mỹ',N'https://nike.com',N'Thương hiệu thể thao và streetwear.',1,1);

/* Dữ liệu mặc định cho danh mục sản phẩm */
DECLARE @Categories TABLE(category_name NVARCHAR(100), description NVARCHAR(500));
INSERT @Categories VALUES
(N'Áo Thun Nam',N'Áo thun nam và unisex'),
(N'Áo Sơ Mi Nam',N'Áo sơ mi công sở và thường ngày'),
(N'Quần Jeans Nam',N'Quần jeans và denim nam'),
(N'Áo Khoác Nam',N'Áo khoác, hoodie và blazer nam'),
(N'Quần Short Nam',N'Quần short nam'),
(N'Áo Thun Nữ',N'Áo thun và croptop nữ'),
(N'Đầm & Váy Nữ',N'Đầm và váy nữ'),
(N'Chân Váy',N'Chân váy thời trang'),
(N'Quần Jeans Nữ',N'Quần jeans nữ'),
(N'Áo Khoác Nữ',N'Áo khoác và blazer nữ'),
(N'Đồ Bộ Mặc Nhà',N'Đồ bộ và đồ mặc nhà'),
(N'Phụ Kiện Thời Trang',N'Giày, túi, mũ và phụ kiện'),
(N'Set Combo Tiết Kiệm',N'Các set phối từ nhiều sản phẩm lẻ');
INSERT categories(category_name,description,status)
SELECT c.category_name,c.description,1
FROM @Categories c
WHERE NOT EXISTS(SELECT 1 FROM categories x WHERE x.category_name=c.category_name);

/* Products - sản phẩm lẻ */
DECLARE @CatAoThun INT=(SELECT category_id FROM categories WHERE category_name=N'Áo Thun Nam');
DECLARE @CatSoMi INT=(SELECT category_id FROM categories WHERE category_name=N'Áo Sơ Mi Nam');
DECLARE @CatJeans INT=(SELECT category_id FROM categories WHERE category_name=N'Quần Jeans Nam');
DECLARE @CatShort INT=(SELECT category_id FROM categories WHERE category_name=N'Quần Short Nam');
DECLARE @CatPhuKien INT=(SELECT category_id FROM categories WHERE category_name=N'Phụ Kiện Thời Trang');
DECLARE @CatCombo INT=(SELECT category_id FROM categories WHERE category_name=N'Set Combo Tiết Kiệm');

IF NOT EXISTS (SELECT 1 FROM products WHERE product_name=N'Áo thun Basic Cotton FoxStyle')
INSERT products(category_id,brand_id,product_name,price,original_price,description,image_url,material,brand,origin,care_instructions,fit_guide,is_combo,status)
VALUES(@CatAoThun,(SELECT brand_id FROM brands WHERE brand_name=N'FoxStyle Premium'),N'Áo thun Basic Cotton FoxStyle',299000,349000,N'o thun cotton mềm mại, form regular.',N'/image_san_pham/photo-1521572163474-6864f9cf17ab.jpg',N'Cotton 100%',N'FoxStyle Premium',N'Việt Nam',N'Giặt nhẹ dưới 30°C.',N'Regular Fit',0,1);

IF NOT EXISTS (SELECT 1 FROM products WHERE product_name=N'Áo sơ mi Oxford công sở')
INSERT products(category_id,brand_id,product_name,price,original_price,description,image_url,material,brand,origin,care_instructions,fit_guide,is_combo,status)
VALUES(@CatSoMi,(SELECT brand_id FROM brands WHERE brand_name=N'Zara'),N'Áo sơ mi Oxford công sở',369000,429000,N'Áo sơ mi Oxford lịch lãm.',N'/image_san_pham/photo-1602810318383-e386cc2a3ccf.jpg',N'Oxford Cotton',N'Zara',N'Việt Nam',N'Giặt riêng màu sáng.',N'Slim Fit',0,1);

IF NOT EXISTS (SELECT 1 FROM products WHERE product_name=N'Quần Jeans Indigo Slim Fit')
INSERT products(category_id,brand_id,product_name,price,original_price,description,image_url,material,brand,origin,care_instructions,fit_guide,is_combo,status)
VALUES(@CatJeans,(SELECT brand_id FROM brands WHERE brand_name=N'Uniqlo'),N'Quần Jeans Indigo Slim Fit',459000,529000,N'Quần jeans denim co giãn.',N'/image_san_pham/photo-1542272604-787c3835535d.jpg',N'Denim co giãn',N'Uniqlo',N'Việt Nam',N'Giặt lộn trái.',N'Slim Fit',0,1);

IF NOT EXISTS (SELECT 1 FROM products WHERE product_name=N'Quần Shorts Kaki Casual')
INSERT products(category_id,brand_id,product_name,price,original_price,description,image_url,material,brand,origin,care_instructions,fit_guide,is_combo,status)
VALUES(@CatShort,(SELECT brand_id FROM brands WHERE brand_name=N'FoxStyle Premium'),N'Quần Shorts Kaki Casual',329000,389000,N'Quần short kaki mặc hằng ngày.',N'/image_san_pham/photo-1591195853828-11db59a44f6b.jpg',N'Kaki Cotton',N'FoxStyle Premium',N'Việt Nam',N'Giặt máy chế độ nhẹ.',N'Regular Fit',0,1);

IF NOT EXISTS (SELECT 1 FROM products WHERE product_name=N'Túi Crossbody Da Bò')
INSERT products(category_id,brand_id,product_name,price,original_price,description,image_url,material,brand,origin,care_instructions,fit_guide,is_combo,status)
VALUES(@CatPhuKien,(SELECT brand_id FROM brands WHERE brand_name=N'FoxStyle Premium'),N'Túi Crossbody Da Bò',399000,499000,N'Túi đeo chéo nh gn.',N'/image_san_pham/photo-1548036328-c9fa89d128fa.jpg',N'Da tổng hợp cao cấp',N'FoxStyle Premium',N'Việt Nam',N'Lau bằng khăn mm.',N'Freesize',0,1);

/* Tạo biến thể cho từng sản phẩm lẻ mẫu */
INSERT product_variants(product_id,color,size,quantity,sku,price,image_url)
SELECT p.product_id,v.color,v.size,v.quantity,
       CONCAT('FS-',p.product_id,'-',v.sku_suffix),p.price,p.image_url
FROM products p
CROSS APPLY (VALUES
    (N'en',N'M',30,'DEN-M'),
    (N'en',N'L',30,'DEN-L'),
    (N'Trắng',N'M',30,'TRANG-M'),
    (N'Trắng',N'L',30,'TRANG-L')
) v(color,size,quantity,sku_suffix)
WHERE p.is_combo=0
  AND p.product_name IN (N'Áo thun Basic Cotton FoxStyle',N'Áo sơ mi Oxford công sở',N'Quần Jeans Indigo Slim Fit',N'Quần Shorts Kaki Casual',N'Túi Crossbody Da Bò')
  AND NOT EXISTS(
      SELECT 1 FROM product_variants pv
      WHERE pv.product_id=p.product_id AND pv.color=v.color AND pv.size=v.size
  );

/* Combo vn l mt sn phm c lp c th bn trc tip */
DECLARE @P1 INT=(SELECT product_id FROM products WHERE product_name=N'Áo thun Basic Cotton FoxStyle');
DECLARE @P4 INT=(SELECT product_id FROM products WHERE product_name=N'Quần Shorts Kaki Casual');
IF NOT EXISTS (SELECT 1 FROM products WHERE product_name=N'[SET COMBO] Áo thun Basic + Quần Shorts Kaki')
INSERT products(category_id,brand_id,product_name,price,original_price,description,image_url,material,brand,origin,care_instructions,fit_guide,is_combo,status)
VALUES(@CatCombo,(SELECT brand_id FROM brands WHERE brand_name=N'FoxStyle Premium'),N'[SET COMBO] Áo thun Basic + Quần Shorts Kaki',529000,628000,
       CONCAT(N'[COMBO:',@P1,N',',@P4,N'] Set phối hè năng động.'),
       N'/image_san_pham/photo-1490481651871-ab68de25d43d.jpg',N'Set phối sẵn',N'FoxStyle Premium',N'Việt Nam',N'Bảo quản theo từng sản phẩm.',N'ủ size',1,1);
DECLARE @Combo INT=(SELECT product_id FROM products WHERE product_name=N'[SET COMBO] Áo thun Basic + Quần Shorts Kaki');
IF NOT EXISTS(SELECT 1 FROM product_combo_items WHERE combo_product_id=@Combo AND component_product_id=@P1)
    INSERT product_combo_items(combo_product_id,component_product_id,quantity,display_order) VALUES(@Combo,@P1,1,1);
IF NOT EXISTS(SELECT 1 FROM product_combo_items WHERE combo_product_id=@Combo AND component_product_id=@P4)
    INSERT product_combo_items(combo_product_id,component_product_id,quantity,display_order) VALUES(@Combo,@P4,1,2);
IF NOT EXISTS(SELECT 1 FROM product_variants WHERE product_id=@Combo)
    INSERT product_variants(product_id,color,size,quantity,sku,price) VALUES
    (@Combo,N'Chuẩn Set',N'M',20,CONCAT('COMBO-',@Combo,'-M'),529000),
    (@Combo,N'Chuẩn Set',N'L',20,CONCAT('COMBO-',@Combo,'-L'),529000);

/* Ảnh mặc định của sản phẩm */
INSERT product_images(product_id,image_url,is_primary,display_order)
SELECT p.product_id,p.image_url,1,1
FROM products p
WHERE p.image_url IS NOT NULL
  AND NOT EXISTS(SELECT 1 FROM product_images pi WHERE pi.product_id=p.product_id AND pi.is_primary=1);

/* To gi hng cn thiu cho khch hng */
INSERT carts(user_id)
SELECT u.user_id FROM users u
JOIN roles r ON r.role_id=u.role_id AND r.role_name='ROLE_CUSTOMER'
WHERE NOT EXISTS(SELECT 1 FROM carts c WHERE c.user_id=u.user_id);

/* D liu mc nh cho m gim gi */
DECLARE @Coupons TABLE(code VARCHAR(50),dtype TINYINT,dvalue DECIMAL(12,2),minval DECIMAL(12,2),maxval DECIMAL(12,2));
INSERT @Coupons VALUES
('WELCOME50',1,50000,300000,50000),
('FOXSTYLE10',2,10,200000,50000),
('FOXSTYLE20',2,20,500000,100000),
('COMBO15',2,15,400000,120000);
INSERT coupons(coupon_code,discount_type,discount_value,min_order_value,max_discount_value,start_date,end_date,usage_limit,used_count,status)
SELECT c.code,c.dtype,c.dvalue,c.minval,c.maxval,'2026-01-01','2027-12-31',1000,0,1
FROM @Coupons c WHERE NOT EXISTS(SELECT 1 FROM coupons x WHERE x.coupon_code=c.code);

/* Dữ liệu banner mặc định */
IF NOT EXISTS(SELECT 1 FROM banners WHERE title=N'FoxStyle Summer Collection')
INSERT banners(title,image_url,link_url,position,display_order,status) VALUES
(N'FoxStyle Summer Collection',N'/image_banner/photo-1441986300917-64674bd600d8.jpg',N'/products',1,1,1),
(N'Set Combo Tiết Kiệm',N'/image_san_pham/photo-1490481651871-ab68de25d43d.jpg',N'/products?category=combo',2,2,1);

/* Dữ liệu chủ đề và bài viết mặc định */
DECLARE @Topics TABLE(name NVARCHAR(150),slug VARCHAR(180),description NVARCHAR(500));
INSERT @Topics VALUES
(N'Xu hướng thời trang','xu-huong-thoi-trang',N'Cập nhật xu hướng mới nhất.'),
(N'Mẹo phối đồ & Mix Match','meo-phoi-do',N'Bí quyết kết hợp trang phục.'),
(N'Bảo quản & Chăm sóc quần áo','bao-quan-quan-ao',N'Hướng dẫn bảo quản trang phục.'),
(N'Bộ sưu tập mới (Lookbook)','bo-suu-tap-moi',N'Câu chuyện bộ sưu tập FoxStyle.');
INSERT article_topics(topic_name,slug,description,status)
SELECT t.name,t.slug,t.description,1 FROM @Topics t
WHERE NOT EXISTS(SELECT 1 FROM article_topics x WHERE x.slug=t.slug);

IF NOT EXISTS(SELECT 1 FROM articles WHERE slug='xu-huong-thoi-trang-he-2026')
INSERT articles(topic_id,author_id,title,slug,summary,content,image_url,author_name,view_count,status,published_at,created_at,updated_at)
VALUES(
 (SELECT topic_id FROM article_topics WHERE slug='xu-huong-thoi-trang'),
 (SELECT user_id FROM users WHERE username='admin'),
 N'Top xu hướng thời trang hè 2026',
 'xu-huong-thoi-trang-he-2026',
 N'Các xu hướng phối đồ nổi bật dành cho mùa hè.',
 N'FoxStyle giới thiệu những phom dáng thoải mái, gam màu trung tính và cách phối đồ linh hoạt.',
 N'/image_san_pham/photo-1490481651871-ab68de25d43d.jpg',
 N'FoxStyle Styling Team',1450,'published','2026-06-15',SYSDATETIME(),SYSDATETIME()
);

/* D liu chnh sch bo hnh mc nh */
IF NOT EXISTS(SELECT 1 FROM warranty_policies WHERE policy_name=N'ổi lỗi sản xuất trong 30 ngày')
INSERT warranty_policies(policy_name,category_id,duration_days,conditions,status) VALUES
(N'ổi lỗi sản xuất trong 30 ngày',NULL,30,N'p dụng cho lỗi đưng may, khóa kéo hoặc sai sản phẩm từ FoxStyle.',1),
(N'Bảo hành phụ kiện 90 ngày',@CatPhuKien,90,N'p dụng cho lỗi kỹ thuật, không áp dụng hao mòn tự nhiên.',1);

/* Dữ liệu khu vực giao hàng mặc định */
DECLARE @Districts TABLE(name NVARCHAR(100),province NVARCHAR(100));
INSERT @Districts VALUES
(N'Quận Hải Châu',N'à Nẵng'),(N'Quận Thanh Khê',N'à Nẵng'),
(N'Quận Sơn Trà',N'à Nẵng'),(N'Quận Ngũ Hành Sơn',N'à Nẵng'),
(N'Quận Liên Chiểu',N'à Nẵng'),(N'Quận Cẩm Lệ',N'à Nẵng'),
(N'Huyện Hòa Vang',N'à Nẵng'),(N'Huyện Hoàng Sa',N'à Nẵng');
INSERT districts(district_name,province,status)
SELECT d.name,d.province,1 FROM @Districts d
WHERE NOT EXISTS(SELECT 1 FROM districts x WHERE x.district_name=d.name AND x.province=d.province);

/* D liu chi nhnh ca hng mc nh */
IF NOT EXISTS(SELECT 1 FROM store_branches WHERE branch_code='CN-DN-01')
INSERT store_branches(branch_code,branch_name,address,province,district,phone,branch_type,is_default_pickup,status,latitude,longitude) VALUES
('CN-DN-01',N'Kho Tổng à Nẵng',N'123 Nguyễn Văn Linh, Hải Châu',N'à Nẵng',N'Quận Hải Châu','02363888888','warehouse',1,'active',16.0544070,108.2021640),
('CN-DN-02',N'FoxStyle Sơn Trà',N'88 Ngô Quyn, Sơn Trà',N'à Nẵng',N'Quận Sơn Trà','02363999999','retail',0,'active',16.0667000,108.2300000);

/* Dữ liệu đơn vị vận chuyển mặc định */
DECLARE @Carriers TABLE(code VARCHAR(30),name NVARCHAR(150));
INSERT @Carriers VALUES
('viettelpost',N'ViettelPost Express'),('ghn',N'Giao Hàng Nhanh'),
('ghtk',N'Giao Hàng Tiết Kiệm'),('standard',N'ViettelPost Tiêu Chuẩn');
INSERT shipping_carriers(carrier_code,carrier_name,status)
SELECT c.code,c.name,1 FROM @Carriers c
WHERE NOT EXISTS(SELECT 1 FROM shipping_carriers x WHERE x.carrier_code=c.code);

/* Cu hnh dng cho trang qun tr vn chuyn v cc module khc */
DECLARE @Settings TABLE(skey VARCHAR(100),svalue NVARCHAR(MAX),description NVARCHAR(255));
INSERT @Settings VALUES
('urban_shipping_fee',N'20000',N'Phí giao nội thành'),
('suburban_shipping_fee',N'30000',N'Phí giao ngoại thành'),
('free_shipping_threshold',N'500000',N'Giá trị đơn được miễn phí vận chuyển'),
('shipping_price_per_km',N'5000',N'Phí vận chuyển mỗi km'),
('default_shipping_carrier',N'viettelpost',N'ơn vị vận chuyển mặc định'),
('vat_percent',N'8',N'Thuế VAT'),
('return_policy_days',N'7',N'Số ngày đổi trả'),
('auto_reply_enabled',N'true',N'Bật trả li chat tự động'),
('flash_sale_enabled',N'true',N'Bật khu vực flash sale'),
('store_branches_list',N'[]',N'Danh sách chi nhánh tương thích giao diện cũ');
INSERT settings(setting_key,setting_value,description)
SELECT s.skey,s.svalue,s.description FROM @Settings s
WHERE NOT EXISTS(SELECT 1 FROM settings x WHERE x.setting_key=s.skey);

/* Mu ni dung chm sc khch hng mc nh */
IF NOT EXISTS(SELECT 1 FROM crm_templates WHERE template_name=N'Chào mừng khách hàng mới')
INSERT crm_templates(template_name,channel,subject,content,status) VALUES
(N'Chào mừng khách hàng mới','email',N'Chào mừng bạn đến FoxStyle',N'Cảm ơn bạn đã đăng ký. Tặng bạn mã WELCOME50.',1),
(N'Nhắc gi hàng chưa thanh toán','email',N'Bạn còn sản phẩm trong gi hàng',N'Hoàn tất đơn hàng để không b lỡ sản phẩm yêu thích.',1),
(N'Cảm ơn sau mua hàng','email',N'Cảm ơn bạn đã mua sắm',N'Hãy chia sẻ đánh giá của bạn v sản phẩm FoxStyle.',1);

/* Thng bo mc nh cho ton h thng */
IF NOT EXISTS(SELECT 1 FROM notifications WHERE title=N'Chào mừng đến với FoxStyle')
INSERT notifications(user_id,title,content,notification_type,action_url,is_global,is_read,created_by)
VALUES(NULL,N'Chào mừng đến với FoxStyle',N'Khám phá sản phẩm mới và các set combo tiết kiệm.',N'announcement',N'/products',1,0,(SELECT user_id FROM users WHERE username='admin'));

COMMIT TRANSACTION;
GO

PRINT N'FoxStyle full default data synchronized successfully.';
GO

/* ========================= ĐỒNG BỘ TRẠNG THÁI ĐƠN HÀNG VÀ GIAO DỊCH =========================
   Giao dch ca n  hy hoc hon hng khng c nm trong nhm ch i sot.
   Khi ny sa d liu c; cc ln cp nht mi  c backend ng b t ng.
*/
UPDATE payment
SET payment_status = 2
FROM payments payment
INNER JOIN orders customer_order
    ON customer_order.order_id = payment.order_id
WHERE customer_order.status IN (4, 5)
  AND payment.payment_status <> 2;
GO

/* ========================= MIGRATE LEGACY COMBOS =========================
   Chuyển dữ liệu combo cũ dạng [COMBO:1,3] sang product_combo_items.
   Khối này an toàn khi chạy lại và không ảnh hưởng sản phẩm lẻ.
*/

SET XACT_ABORT ON;
BEGIN TRANSACTION;

UPDATE products
SET is_combo=1
WHERE is_combo=0
  AND (
      product_name LIKE N'%[[]SET COMBO]%'
      OR description LIKE N'%[[]COMBO:%'
  );

;WITH LegacyCombo AS (
    SELECT
        p.product_id AS combo_product_id,
        SUBSTRING(
            p.description,
            CHARINDEX('[COMBO:',p.description)+7,
            CHARINDEX(']',p.description,CHARINDEX('[COMBO:',p.description))
                - CHARINDEX('[COMBO:',p.description)-7
        ) AS component_ids
    FROM products p
    WHERE p.is_combo=1
      AND p.description LIKE N'%[[]COMBO:%]%'
      AND CHARINDEX(']',p.description,CHARINDEX('[COMBO:',p.description))>0
),
ParsedCombo AS (
    SELECT
        legacy.combo_product_id,
        TRY_CONVERT(INT,LTRIM(RTRIM(parts.value))) AS component_product_id,
        ROW_NUMBER() OVER(
            PARTITION BY legacy.combo_product_id
            ORDER BY (SELECT NULL)
        ) AS display_order
    FROM LegacyCombo legacy
    CROSS APPLY STRING_SPLIT(legacy.component_ids,',') parts
)
INSERT product_combo_items(
    combo_product_id,
    component_product_id,
    quantity,
    display_order
)
SELECT
    parsed.combo_product_id,
    parsed.component_product_id,
    1,
    parsed.display_order
FROM ParsedCombo parsed
INNER JOIN products component
    ON component.product_id=parsed.component_product_id
WHERE parsed.component_product_id IS NOT NULL
  AND parsed.combo_product_id<>parsed.component_product_id
  AND component.is_combo=0
  AND NOT EXISTS(
      SELECT 1
      FROM product_combo_items current_item
      WHERE current_item.combo_product_id=parsed.combo_product_id
        AND current_item.component_product_id=parsed.component_product_id
  );

COMMIT TRANSACTION;
GO

/* ========================= MIGRATE LEGACY MEDIA URLS =========================
   Giữ SQL Server đồng bộ với thư viện /image của website và loại bỏ phụ thuộc
   vào URL Unsplash/Mixkit cũ. Khối này an toàn khi chạy lại.
*/
DECLARE @MediaMap TABLE(source_id VARCHAR(80) PRIMARY KEY, local_url NVARCHAR(500));
INSERT @MediaMap(source_id,local_url) VALUES
('photo-1521572163474-6864f9cf17ab',N'/image_san_pham/photo-1521572163474-6864f9cf17ab.jpg'),
('photo-1541099649105-f69ad21f3246',N'/image_san_pham/photo-1541099649105-f69ad21f3246.jpg'),
('photo-1542272604-787c3835535d',N'/image_san_pham/photo-1542272604-787c3835535d.jpg'),
('photo-1548036328-c9fa89d128fa',N'/image_san_pham/photo-1548036328-c9fa89d128fa.jpg'),
('photo-1551028719-00167b16eac5',N'/image_san_pham/photo-1551028719-00167b16eac5.jpg'),
('photo-1572804013309-59a88b7e92f1',N'/image_san_pham/photo-1572804013309-59a88b7e92f1.jpg'),
('photo-1583743814966-8936f5b7be1a',N'/image_san_pham/photo-1583743814966-8936f5b7be1a.jpg'),
('photo-1588850561407-ed78c282e89b',N'/image_san_pham/photo-1588850561407-ed78c282e89b.jpg'),
('photo-1591047139829-d91aecb6caea',N'/image_san_pham/photo-1591047139829-d91aecb6caea.jpg'),
('photo-1594633312681-425c7b97ccd1',N'/image_san_pham/photo-1594633312681-425c7b97ccd1.jpg'),
('photo-1595777457583-95e059d581b8',N'/image_san_pham/photo-1595777457583-95e059d581b8.jpg'),
('photo-1595950653106-6c9ebd614d3a',N'/image_san_pham/photo-1595950653106-6c9ebd614d3a.jpg'),
('photo-1596755094514-f87e34085b2c',N'/image_san_pham/photo-1596755094514-f87e34085b2c.jpg'),
('photo-1602810318383-e386cc2a3ccf',N'/image_san_pham/photo-1602810318383-e386cc2a3ccf.jpg'),
('photo-1618354691373-d851c5c3a990',N'/image_san_pham/photo-1618354691373-d851c5c3a990.jpg'),
('photo-1625910513413-562a1b9201f8',N'/image_san_pham/photo-1521572163474-6864f9cf17ab.jpg');

UPDATE target SET image_url=media.local_url
FROM products target INNER JOIN @MediaMap media ON target.image_url LIKE '%'+media.source_id+'%';
UPDATE target SET image_url=media.local_url
FROM product_images target INNER JOIN @MediaMap media ON target.image_url LIKE '%'+media.source_id+'%';
UPDATE target SET image_url=media.local_url
FROM product_variants target INNER JOIN @MediaMap media ON target.image_url LIKE '%'+media.source_id+'%';
UPDATE target SET image_url=media.local_url
FROM banners target INNER JOIN @MediaMap media ON target.image_url LIKE '%'+media.source_id+'%';
UPDATE target SET image_url=media.local_url
FROM articles target INNER JOIN @MediaMap media ON target.image_url LIKE '%'+media.source_id+'%';
UPDATE target SET extra_image_1=media.local_url
FROM articles target INNER JOIN @MediaMap media ON target.extra_image_1 LIKE '%'+media.source_id+'%';
UPDATE target SET extra_image_2=media.local_url
FROM articles target INNER JOIN @MediaMap media ON target.extra_image_2 LIKE '%'+media.source_id+'%';
UPDATE target SET logo_url=media.local_url
FROM brands target INNER JOIN @MediaMap media ON target.logo_url LIKE '%'+media.source_id+'%';
UPDATE products SET video_url=N'/video/fashion-showcase.mp4'
WHERE video_url LIKE 'http://%' OR video_url LIKE 'https://%';
UPDATE banners SET image_url=N'/image_banner/photo-1441986300917-64674bd600d8.jpg'
WHERE image_url=N'/images/banners/summer_collection.jpg';
UPDATE banners SET image_url=N'/image_banner/photo-1483985988355-763728e1935b.jpg'
WHERE image_url=N'/images/banners/midyear_sale.jpg';
GO

PRINT N'FoxStyle legacy combo data migrated successfully.';
GO
