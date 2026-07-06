-- =========================================================================
-- SQL SERVER SCRIPT KHỞI TẠO HỆ THỐNG CƠ SỞ DỮ LIỆU FOXSTYLE (TỐI ƯU & HOÀN THIỆN)
-- Thiết kế chuyên biệt cho hệ thống website thương mại điện tử thời trang
-- =========================================================================

-- Tạo cơ sở dữ liệu mới
CREATE DATABASE foxstyle_db;
GO

USE foxstyle_db;
GO

-- =========================================================================
-- 1. Bảng: roles (Quản lý quyền hạn hệ thống)
-- =========================================================================
CREATE TABLE roles (
    role_id INT IDENTITY(1,1) NOT NULL,
    role_name VARCHAR(50) NOT NULL,                  -- Tên quyền (ROLE_ADMIN, ROLE_STAFF, ROLE_CUSTOMER)
    description NVARCHAR(255) NULL,                  -- Mô tả chi tiết quyền hạn bằng tiếng Việt
    CONSTRAINT PK_roles PRIMARY KEY (role_id),
    CONSTRAINT UK_role_name UNIQUE (role_name)
);
GO

-- =========================================================================
-- 2. Bảng: users (Quản lý thông tin tài khoản người dùng)
-- =========================================================================
CREATE TABLE users (
    user_id INT IDENTITY(1,1) NOT NULL,
    role_id INT NOT NULL,                            -- Liên kết nhóm quyền hạn
    username VARCHAR(50) NOT NULL,                   -- Tên đăng nhập
    password VARCHAR(255) NOT NULL,                  -- Mật khẩu đã mã hóa (Bcrypt)
    full_name NVARCHAR(100) NOT NULL,                -- Họ và tên đầy đủ
    email VARCHAR(100) NOT NULL,                     -- Email dùng để khôi phục hoặc nhận thông báo
    phone VARCHAR(15) NULL,                          -- Số điện thoại liên lạc
    status TINYINT NOT NULL CONSTRAINT DF_users_status DEFAULT 1, -- Trạng thái: 0 - Bị khóa, 1 - Hoạt động
    CONSTRAINT PK_users PRIMARY KEY (user_id),
    CONSTRAINT UK_username UNIQUE (username),
    CONSTRAINT UK_email UNIQUE (email),
    CONSTRAINT FK_users_roles FOREIGN KEY (role_id) REFERENCES roles (role_id) ON UPDATE CASCADE,
    CONSTRAINT CHK_user_status CHECK (status IN (0, 1))
);
GO

-- =========================================================================
-- 3. Bảng: user_addresses (Quản lý sổ địa chỉ giao hàng của khách hàng)
-- =========================================================================
CREATE TABLE user_addresses (
    address_id INT IDENTITY(1,1) NOT NULL,
    user_id INT NOT NULL,                            -- Chủ sở hữu địa chỉ này
    recipient_name NVARCHAR(100) NOT NULL,           -- Tên người nhận hàng thực tế
    phone VARCHAR(15) NOT NULL,                      -- Số điện thoại người nhận hàng
    province NVARCHAR(100) NOT NULL,                 -- Tỉnh/Thành phố
    district NVARCHAR(100) NOT NULL,                 -- Quận/Huyện
    ward NVARCHAR(100) NOT NULL,                     -- Phường/Xã
    detail_address NVARCHAR(255) NOT NULL,           -- Số nhà, tên đường cụ thể
    is_default BIT NOT NULL CONSTRAINT DF_address_default DEFAULT 0, -- 1: Địa chỉ mặc định, 0: Địa chỉ phụ
    CONSTRAINT PK_user_addresses PRIMARY KEY (address_id),
    CONSTRAINT FK_user_addresses_users FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE CASCADE
);
GO

-- =========================================================================
-- 4. Bảng: categories (Danh mục sản phẩm thời trang)
-- =========================================================================
CREATE TABLE categories (
    category_id INT IDENTITY(1,1) NOT NULL,
    category_name NVARCHAR(100) NOT NULL,            -- Ví dụ: Áo thun nam, Quần Jeans, Áo khoác
    description NVARCHAR(MAX) NULL,                  -- Mô tả về phom dáng, phong cách danh mục
    status TINYINT NOT NULL CONSTRAINT DF_categories_status DEFAULT 1, -- Trạng thái: 0 - Ẩn, 1 - Hiển thị trên menu
    CONSTRAINT PK_categories PRIMARY KEY (category_id),
    CONSTRAINT CHK_category_status CHECK (status IN (0, 1))
);
GO

-- =========================================================================
-- 5. Bảng: products (Thông tin chung về sản phẩm thời trang)
-- =========================================================================
CREATE TABLE products (
    product_id INT IDENTITY(1,1) NOT NULL,
    category_id INT NOT NULL,                        -- Thuộc danh mục nào
    product_name NVARCHAR(150) NOT NULL,              -- Tên sản phẩm
    price DECIMAL(12,2) NOT NULL,                    -- Giá bán hiện tại (sau khuyến mãi nếu có)
    original_price DECIMAL(12,2) NULL,               -- Giá bán gốc ban đầu (dùng để hiển thị phần trăm giảm giá)
    description NVARCHAR(MAX) NULL,                  -- Mô tả chi tiết chất liệu, phom dáng, cách giặt là
    image_url VARCHAR(255) NULL,                     -- Ảnh đại diện chính của sản phẩm hiển thị ở trang danh sách
    material NVARCHAR(100) NULL,                     -- Chất liệu vải (ví dụ: Cotton 100%, Denim co giãn)
    origin NVARCHAR(100) NULL,                       -- Xuất xứ sản xuất (ví dụ: Việt Nam, Quảng Châu)
    status TINYINT NOT NULL CONSTRAINT DF_products_status DEFAULT 1, -- Trạng thái: 0 - Ngừng kinh doanh, 1 - Đang bán
    CONSTRAINT PK_products PRIMARY KEY (product_id),
    CONSTRAINT FK_products_categories FOREIGN KEY (category_id) REFERENCES categories (category_id) ON UPDATE CASCADE,
    CONSTRAINT CHK_product_price CHECK (price >= 0),
    CONSTRAINT CHK_product_orig_price CHECK (original_price IS NULL OR original_price >= 0),
    CONSTRAINT CHK_product_status CHECK (status IN (0, 1))
);
GO

-- =========================================================================
-- 6. Bảng: product_variants (Quản lý các biến thể chi tiết - Size, Màu & Tồn kho)
-- Giải quyết triệt để bài toán quản lý kho hàng quần áo thời trang cụ thể
-- =========================================================================
CREATE TABLE product_variants (
    variant_id INT IDENTITY(1,1) NOT NULL,
    product_id INT NOT NULL,                         -- Thuộc sản phẩm nào
    color NVARCHAR(50) NOT NULL,                     -- Màu sắc (Đen, Trắng, Navy...)
    size VARCHAR(20) NOT NULL,                       -- Kích thước (S, M, L, XL, 29, 30...)
    quantity INT NOT NULL CONSTRAINT DF_variants_qty DEFAULT 0, -- Số lượng tồn kho của biến thể này
    sku VARCHAR(100) NULL,                           -- Mã định danh hàng tồn kho duy nhất (dễ quét barcode)
    CONSTRAINT PK_product_variants PRIMARY KEY (variant_id),
    CONSTRAINT UK_product_variant_color_size UNIQUE (product_id, color, size), -- Không được trùng cặp thuộc tính trên cùng sản phẩm
    CONSTRAINT FK_product_variants_products FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT CHK_variant_qty CHECK (quantity >= 0)
);
GO

-- =========================================================================
-- 7. Bảng: product_images (Quản lý nhiều hình ảnh chi tiết của sản phẩm)
-- =========================================================================
CREATE TABLE product_images (
    image_id INT IDENTITY(1,1) NOT NULL,
    product_id INT NOT NULL,                         -- Thuộc sản phẩm nào
    image_url VARCHAR(255) NOT NULL,                 -- Đường dẫn ảnh phụ chi tiết
    is_primary BIT NOT NULL CONSTRAINT DF_images_primary DEFAULT 0, -- 1: Ảnh đại diện, 0: Ảnh slide chi tiết
    display_order INT NOT NULL CONSTRAINT DF_images_order DEFAULT 1, -- Thứ tự sắp xếp hiển thị trên slide
    CONSTRAINT PK_product_images PRIMARY KEY (image_id),
    CONSTRAINT FK_product_images_products FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE ON UPDATE CASCADE
);
GO

-- =========================================================================
-- 8. Bảng: carts (Giỏ hàng của từng khách hàng)
-- =========================================================================
CREATE TABLE carts (
    cart_id INT IDENTITY(1,1) NOT NULL,
    user_id INT NOT NULL,                            -- Chủ sở hữu giỏ hàng
    CONSTRAINT PK_carts PRIMARY KEY (cart_id),
    CONSTRAINT UK_cart_user UNIQUE (user_id),        -- Mỗi user chỉ có duy nhất 1 giỏ hàng hoạt động
    CONSTRAINT FK_carts_users FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE CASCADE
);
GO

-- =========================================================================
-- 9. Bảng: cart_details (Chi tiết sản phẩm biến thể nằm trong giỏ hàng)
-- Liên kết trực tiếp tới biến thể sản phẩm cụ thể (Màu, Size) đã chọn
-- =========================================================================
CREATE TABLE cart_details (
    cart_detail_id INT IDENTITY(1,1) NOT NULL,
    cart_id INT NOT NULL,                            -- Thuộc giỏ hàng nào
    variant_id INT NOT NULL,                         -- Chọn mua biến thể nào (Màu sắc & kích thước cụ thể)
    quantity INT NOT NULL,                           -- Số lượng muốn đặt mua
    CONSTRAINT PK_cart_details PRIMARY KEY (cart_detail_id),
    CONSTRAINT UK_cart_variant UNIQUE (cart_id, variant_id), -- Một giỏ hàng không được thêm trùng lặp biến thể sản phẩm
    CONSTRAINT FK_cart_details_carts FOREIGN KEY (cart_id) REFERENCES carts (cart_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FK_cart_details_variants FOREIGN KEY (variant_id) REFERENCES product_variants (variant_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT CHK_cart_detail_quantity CHECK (quantity > 0)
);
GO

-- =========================================================================
-- 10. Bảng: coupons (Quản lý mã giảm giá/Khuyến mãi)
-- =========================================================================
CREATE TABLE coupons (
    coupon_id INT IDENTITY(1,1) NOT NULL,
    coupon_code VARCHAR(50) NOT NULL,                -- Mã giảm giá (ví dụ: FOXSTYLE50, WELCOME2026)
    discount_type TINYINT NOT NULL,                  -- Loại giảm giá: 1 - Tiền cố định (VNĐ), 2 - Phần trăm (%)
    discount_value DECIMAL(12,2) NOT NULL,           -- Giá trị giảm (ví dụ: 50000.00đ hoặc 10.00%)
    min_order_value DECIMAL(12,2) NOT NULL CONSTRAINT DF_coupons_min_order DEFAULT 0, -- Đơn hàng tối thiểu để áp dụng
    max_discount_value DECIMAL(12,2) NULL,           -- Giảm tối đa bao nhiêu (dành cho giảm theo % tránh lỗ nặng)
    start_date DATETIME NOT NULL,                    -- Ngày mã bắt đầu hoạt động
    end_date DATETIME NOT NULL,                      -- Ngày mã hết hạn
    usage_limit INT NOT NULL CONSTRAINT DF_coupons_limit DEFAULT 100, -- Số lượng phát hành tối đa
    used_count INT NOT NULL CONSTRAINT DF_coupons_used DEFAULT 0, -- Số lượng thực tế đã bị dùng
    status TINYINT NOT NULL CONSTRAINT DF_coupons_status DEFAULT 1, -- Trạng thái: 0 - Vô hiệu hóa, 1 - Kích hoạt
    CONSTRAINT PK_coupons PRIMARY KEY (coupon_id),
    CONSTRAINT UK_coupon_code UNIQUE (coupon_code),
    CONSTRAINT CHK_coupon_discount_type CHECK (discount_type IN (1, 2)),
    CONSTRAINT CHK_coupon_discount_value CHECK (discount_value > 0),
    CONSTRAINT CHK_coupon_min_order CHECK (min_order_value >= 0),
    CONSTRAINT CHK_coupon_max_discount CHECK (max_discount_value IS NULL OR max_discount_value >= 0),
    CONSTRAINT CHK_coupon_dates CHECK (end_date >= start_date),
    CONSTRAINT CHK_coupon_status CHECK (status IN (0, 1)),
    CONSTRAINT CHK_coupon_used CHECK (used_count <= usage_limit)
);
GO

-- =========================================================================
-- 11. Bảng: orders (Quản lý đơn đặt hàng)
-- =========================================================================
CREATE TABLE orders (
    order_id INT IDENTITY(1,1) NOT NULL,
    user_id INT NOT NULL,                            -- Khách hàng mua hàng
    order_date DATETIME NOT NULL CONSTRAINT DF_orders_date DEFAULT GETDATE(), -- Ngày giờ đặt hàng
    total_amount DECIMAL(12,2) NOT NULL,              -- Tổng tiền cuối cùng khách phải thanh toán
    discount_amount DECIMAL(12,2) NOT NULL CONSTRAINT DF_orders_discount DEFAULT 0, -- Số tiền được giảm giá từ Coupon
    shipping_fee DECIMAL(12,2) NOT NULL CONSTRAINT DF_orders_ship DEFAULT 0, -- Phí vận chuyển của đơn hàng
    recipient_name NVARCHAR(100) NOT NULL,           -- Tên người nhận chốt lúc mua
    recipient_phone VARCHAR(15) NOT NULL,            -- SĐT người nhận chốt lúc mua
    shipping_address NVARCHAR(255) NOT NULL,         -- Địa chỉ giao hàng chốt lúc mua
    status TINYINT NOT NULL CONSTRAINT DF_orders_status DEFAULT 0, -- 0-Chờ duyệt, 1-Đã duyệt, 2-Đang giao, 3-Đã giao, 4-Đã hủy
    coupon_id INT NULL,                              -- Mã giảm giá được áp dụng (nếu có)
    CONSTRAINT PK_orders PRIMARY KEY (order_id),
    CONSTRAINT FK_orders_users FOREIGN KEY (user_id) REFERENCES users (user_id) ON UPDATE CASCADE,
    CONSTRAINT FK_orders_coupons FOREIGN KEY (coupon_id) REFERENCES coupons (coupon_id) ON UPDATE CASCADE,
    CONSTRAINT CHK_order_total CHECK (total_amount >= 0),
    CONSTRAINT CHK_order_discount CHECK (discount_amount >= 0),
    CONSTRAINT CHK_order_ship CHECK (shipping_fee >= 0),
    CONSTRAINT CHK_order_status CHECK (status IN (0, 1, 2, 3, 4))
);
GO

-- =========================================================================
-- 12. Bảng: order_details (Chi tiết các sản phẩm biến thể được chốt trong hóa đơn)
-- =========================================================================
CREATE TABLE order_details (
    order_detail_id INT IDENTITY(1,1) NOT NULL,
    order_id INT NOT NULL,                            -- Thuộc hóa đơn nào
    variant_id INT NOT NULL,                         -- Mua biến thể sản phẩm nào (đã cố định size và màu)
    quantity INT NOT NULL,                           -- Số lượng mua tại thời điểm chốt
    price DECIMAL(12,2) NOT NULL,                    -- Giá chốt bán tại thời điểm mua (không đổi theo thời gian)
    CONSTRAINT PK_order_details PRIMARY KEY (order_detail_id),
    CONSTRAINT FK_order_details_orders FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FK_order_details_variants FOREIGN KEY (variant_id) REFERENCES product_variants (variant_id) ON UPDATE CASCADE,
    CONSTRAINT CHK_order_detail_quantity CHECK (quantity > 0),
    CONSTRAINT CHK_order_detail_price CHECK (price >= 0)
);
GO

-- =========================================================================
-- 13. Bảng: payments (Thông tin giao dịch thanh toán đơn hàng)
-- =========================================================================
CREATE TABLE payments (
    payment_id INT IDENTITY(1,1) NOT NULL,
    order_id INT NOT NULL,                            -- Cần thanh toán cho đơn hàng nào
    payment_method NVARCHAR(50) NOT NULL,            -- Phương thức: COD, VNPay, Ví MoMo, Chuyển khoản ngân hàng
    payment_status TINYINT NOT NULL CONSTRAINT DF_payments_status DEFAULT 0, -- Trạng thái: 0 - Chưa thanh toán, 1 - Đã thanh toán thành công, 2 - Thất bại/Hoàn tiền
    transaction_id VARCHAR(100) NULL,                -- Mã giao dịch trả về từ cổng thanh toán đối tác
    payment_date DATETIME NOT NULL CONSTRAINT DF_payments_date DEFAULT GETDATE(), -- Ngày giờ giao dịch
    amount DECIMAL(12,2) NOT NULL,                    -- Số tiền đã thực hiện thanh toán
    CONSTRAINT PK_payments PRIMARY KEY (payment_id),
    CONSTRAINT FK_payments_orders FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT CHK_payment_status CHECK (payment_status IN (0, 1, 2)),
    CONSTRAINT CHK_payment_amount CHECK (amount >= 0)
);
GO

-- =========================================================================
-- 14. Bảng: wishlists (Danh sách sản phẩm yêu thích của người dùng)
-- Chỉ lưu vết ở cấp độ sản phẩm chính (không cần lưu đến biến thể màu/size)
-- =========================================================================
CREATE TABLE wishlists (
    wishlist_id INT IDENTITY(1,1) NOT NULL,
    user_id INT NOT NULL,                            -- Khách hàng thả tim
    product_id INT NOT NULL,                         -- Sản phẩm được yêu thích
    added_date DATETIME NOT NULL CONSTRAINT DF_wishlists_date DEFAULT GETDATE(),
    CONSTRAINT PK_wishlists PRIMARY KEY (wishlist_id),
    CONSTRAINT UK_user_product_wishlist UNIQUE (user_id, product_id),
    CONSTRAINT FK_wishlists_users FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FK_wishlists_products FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE ON UPDATE CASCADE
);
GO

-- =========================================================================
-- 15. Bảng: reviews (Đánh giá nhận xét sản phẩm)
-- =========================================================================
CREATE TABLE reviews (
    review_id INT IDENTITY(1,1) NOT NULL,
    user_id INT NOT NULL,                            -- Khách hàng đánh giá
    product_id INT NOT NULL,                         -- Sản phẩm được đánh giá
    rating TINYINT NOT NULL,                         -- Đánh giá số sao (Từ 1 đến 5 sao)
    comment NVARCHAR(MAX) NULL,                      -- Bình luận chi tiết
    review_date DATETIME NOT NULL CONSTRAINT DF_reviews_date DEFAULT GETDATE(),
    CONSTRAINT PK_reviews PRIMARY KEY (review_id),
    CONSTRAINT FK_reviews_users FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FK_reviews_products FOREIGN KEY (product_id) REFERENCES products (product_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT CHK_review_rating CHECK (rating BETWEEN 1 AND 5)
);
GO

-- =========================================================================
-- 16. Bảng: banners (Quản lý slide quảng cáo chiến dịch trên trang chủ)
-- =========================================================================
CREATE TABLE banners (
    banner_id INT IDENTITY(1,1) NOT NULL,
    title NVARCHAR(150) NOT NULL,                    -- Tiêu đề sự kiện quảng cáo
    image_url VARCHAR(255) NOT NULL,                 -- Đường dẫn ảnh thiết kế banner
    link_url VARCHAR(255) NULL,                      -- Đường link dẫn tới khi bấm vào (đến danh mục/sản phẩm)
    position INT NOT NULL CONSTRAINT DF_banners_pos DEFAULT 1, -- Thứ tự sắp xếp ưu tiên hiển thị trước sau
    status TINYINT NOT NULL CONSTRAINT DF_banners_status DEFAULT 1, -- Trạng thái hiển thị: 0 - Ẩn, 1 - Hiện
    CONSTRAINT PK_banners PRIMARY KEY (banner_id),
    CONSTRAINT CHK_banner_status CHECK (status IN (0, 1))
);
GO

-- =========================================================================
-- 17. Bảng: user_coupons (Kiểm soát số lần một user được phép dùng mã giảm giá cụ thể)
-- =========================================================================
CREATE TABLE user_coupons (
    user_id INT NOT NULL,                            -- Tài khoản khách hàng
    coupon_id INT NOT NULL,                          -- Mã giảm giá áp dụng
    used_at DATETIME NOT NULL CONSTRAINT DF_user_coupons_date DEFAULT GETDATE(), -- Thời điểm giao dịch hoàn thành
    order_id INT NOT NULL,                            -- Đơn hàng đã áp dụng
    CONSTRAINT PK_user_coupons PRIMARY KEY (user_id, coupon_id),
    CONSTRAINT FK_user_coupons_users FOREIGN KEY (user_id) REFERENCES users (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FK_user_coupons_coupons FOREIGN KEY (coupon_id) REFERENCES coupons (coupon_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT FK_user_coupons_orders FOREIGN KEY (order_id) REFERENCES orders (order_id)
);
GO

-- =========================================================================
-- PHẦN CHÈN DỮ LIỆU MẪU ĐỂ CHẠY THỬ NGHIỆM HỆ THỐNG (MẪU DỮ LIỆU CHUẨN)
-- =========================================================================

-- 1. Chèn dữ liệu nhóm quyền hạn
INSERT INTO roles (role_name, description) VALUES
('ROLE_ADMIN', N'Quản trị viên hệ thống tối cao'),
('ROLE_STAFF', N'Nhân viên vận hành, quản lý kho và đơn hàng'),
('ROLE_CUSTOMER', N'Khách hàng mua sắm trực tuyến');
GO

-- 2. Chèn dữ liệu tài khoản mẫu
-- Mật khẩu giả định dưới đây thường được mã hóa bằng thuật toán Bcrypt
INSERT INTO users (role_id, username, password, full_name, email, phone, status) VALUES
(1, 'admin_fox', '$2a$12$N9qo8uLOqp.PZ.fK7lA52u19Zpx79U6jMlyvAexwXWz0N1Sg4J47K', N'Nguyễn Quản Trị', 'admin@foxstyle.vn', '0912345678', 1),
(2, 'staff_chien', '$2a$12$N9qo8uLOqp.PZ.fK7lA52u19Zpx79U6jMlyvAexwXWz0N1Sg4J47K', N'Lê Văn Nhân Viên', 'staff@foxstyle.vn', '0987654321', 1),
(3, 'customer_demo', '$2a$12$N9qo8uLOqp.PZ.fK7lA52u19Zpx79U6jMlyvAexwXWz0N1Sg4J47K', N'Nguyễn Văn Khách Hàng', 'demo@gmail.com', '0334455667', 1);
GO

-- 3. Chèn địa chỉ giao hàng cho tài khoản khách hàng
INSERT INTO user_addresses (user_id, recipient_name, phone, province, district, ward, detail_address, is_default) VALUES
(3, N'Nguyễn Văn Khách Hàng', '0334455667', N'TP Hồ Chí Minh', N'Quận 1', N'Phường Bến Nghé', N'123 Đường Nguyễn Huệ', 1),
(3, N'Nguyễn Văn Khách Hàng (Văn phòng)', '0901234567', N'Hà Nội', N'Quận Cầu Giấy', N'Phường Dịch Vọng', N'Tòa nhà Landmark 72', 0);
GO

-- 4. Chèn danh mục sản phẩm mẫu
INSERT INTO categories (category_name, description, status) VALUES
(N'Áo Thun Nam', N'Áo thun ngắn tay, dài tay, cổ tròn, cổ bẻ phom dáng thể thao thoải mái', 1),
(N'Quần Jeans', N'Các sản phẩm quần jeans denim bền bỉ phong cách', 1),
(N'Áo Khoác', N'Áo gió, áo khoác bomber, áo phao giữ nhiệt mùa đông', 1);
GO

-- 5. Chèn sản phẩm thời trang mẫu
INSERT INTO products (category_id, product_name, price, original_price, description, image_url, material, origin, status) VALUES
(1, N'Áo thun basic trắng', 199000.00, 299000.00, N'Áo thun cotton 100% tự nhiên co giãn 4 chiều cực thoải mái, phom rộng Hàn Quốc hợp trend.', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', N'Cotton 100%', N'Việt Nam', 1),
(2, N'Quần jean skinny xanh', 399000.00, 499000.00, N'Quần bò denim cao cấp co giãn nhẹ, giữ phom tốt, không ra màu khi giặt.', 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', N'Denim co giãn', N'Việt Nam', 1),
(3, N'Áo khoác bomber gió', 450000.00, 650000.00, N'Áo khoác gió bomber cản gió tốt, chống thấm nước nhẹ, bên trong lót nỉ ấm áp.', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', N'Polyester cao cấp', N'Việt Nam', 1);
GO

-- 6. Chèn các biến thể chi tiết (Size, Màu và Số lượng kho cụ thể)
INSERT INTO product_variants (product_id, color, size, quantity, sku) VALUES
-- Áo thun basic trắng (ID = 1)
(1, N'Trắng', 'S', 50, 'TSH-WHT-S'),
(1, N'Trắng', 'M', 100, 'TSH-WHT-M'),
(1, N'Trắng', 'L', 80, 'TSH-WHT-L'),
(1, N'Trắng', 'XL', 20, 'TSH-WHT-XL'),
(1, N'Đen', 'M', 45, 'TSH-BLK-M'),
(1, N'Đen', 'L', 60, 'TSH-BLK-L'),

-- Quần jean skinny xanh (ID = 2)
(2, N'Xanh đậm', '29', 30, 'JEAN-BLU-29'),
(2, N'Xanh đậm', '30', 40, 'JEAN-BLU-30'),
(2, N'Xanh đậm', '31', 50, 'JEAN-BLU-31'),
(2, N'Xanh nhạt', '30', 25, 'JEAN-LBLU-30'),

-- Áo khoác bomber gió (ID = 3)
(3, N'Xám rêu', 'M', 15, 'BOMB-GRN-M'),
(3, N'Xám rêu', 'L', 30, 'BOMB-GRN-L'),
(3, N'Đen', 'L', 20, 'BOMB-BLK-L');
GO

-- 7. Chèn hình ảnh phụ chi tiết của sản phẩm
INSERT INTO product_images (product_id, image_url, is_primary, display_order) VALUES
(1, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500', 1, 1),
(1, 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500', 0, 2),
(2, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500', 1, 1),
(3, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500', 1, 1);
GO

-- 8. Tạo giỏ hàng cho tài khoản khách hàng
INSERT INTO carts (user_id) VALUES (3);
GO

-- 9. Thêm các sản phẩm vào giỏ hàng thử nghiệm
-- Giả định User mua 2 Áo thun trắng size M (variant_id = 2) và 1 Quần jean xanh đậm size 30 (variant_id = 8)
INSERT INTO cart_details (cart_id, variant_id, quantity) VALUES
(1, 2, 2),
(1, 8, 1);
GO

-- 10. Chèn mã giảm giá mẫu
INSERT INTO coupons (coupon_code, discount_type, discount_value, min_order_value, max_discount_value, start_date, end_date, usage_limit, used_count, status) VALUES
('FOXSTYLE50', 1, 50000.00, 200000.00, 50000.00, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 1000, 1, 1), -- Giảm 50k cho đơn từ 200k
('SUMMER10', 2, 10.00, 150000.00, 80000.00, '2026-06-01 00:00:00', '2026-07-31 23:59:59', 500, 0, 1);    -- Giảm 10% tối đa 80k cho đơn từ 150k
GO

-- 11. Giả định khách đặt hàng thành công một đơn
-- Áo thun Trắng size M giá 199k x 2 cái = 398k. Áp mã FOXSTYLE50 giảm 50k + ship 30k -> Tổng thanh toán = 378k
INSERT INTO orders (user_id, order_date, total_amount, discount_amount, shipping_fee, recipient_name, recipient_phone, shipping_address, status, coupon_id) VALUES
(3, '2026-06-17 10:00:00', 378000.00, 50000.00, 30000.00, N'Nguyễn Văn Khách Hàng', '0334455667', N'123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP Hồ Chí Minh', 3, 1);
GO

-- 12. Chèn dòng chi tiết của đơn hàng trên
INSERT INTO order_details (order_id, variant_id, quantity, price) VALUES
(1, 2, 2, 199000.00);
GO

-- 13. Ghi nhận giao dịch thanh toán cho đơn hàng
INSERT INTO payments (order_id, payment_method, payment_status, transaction_id, payment_date, amount) VALUES
(1, N'Ví điện tử MoMo', 1, 'MOMO9988776655', '2026-06-17 10:05:00', 378000.00);
GO

-- 14. Thêm sản phẩm yêu thích (Wishlist) cho user 3 đối với sản phẩm Áo khoác bomber (ID = 3)
INSERT INTO wishlists (user_id, product_id) VALUES (3, 3);
GO

-- 15. Khách hàng gửi phản hồi đánh giá sản phẩm sau khi đã mua hàng thành công
INSERT INTO reviews (user_id, product_id, rating, comment) VALUES
(3, 1, 5, N'Vải mặc siêu mát, co giãn thoải mái, đúng form Hàn Quốc. Giao hàng cực kỳ nhanh và tư vấn nhiệt tình!');
GO

-- 16. Chèn dữ liệu Banner sự kiện slide đầu trang chủ
INSERT INTO banners (title, image_url, link_url, position, status) VALUES
(N'Bộ Sưu Tập Thời Trang Hè Mát Mẻ 2026', '/images/banners/summer_collection.jpg', '/products?category=1', 1, 1),
(N'Siêu Sale Giữa Năm - Đồng Giá 199k', '/images/banners/midyear_sale.jpg', '/products?sale=true', 2, 1);
GO

-- 17. Lưu vết khách hàng đã áp dụng coupon thành công
INSERT INTO user_coupons (user_id, coupon_id, order_id) VALUES (3, 1, 1);
GO
