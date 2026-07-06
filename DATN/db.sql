-- =========================================================================
-- SQL SERVER SCRIPT SINH DỮ LIỆU MẪU HỆ THỐNG FOXSTYLE (>400 SẢN PHẨM & ĐƠN HÀNG)
-- Thiết kế đặc thù cho việc chạy thử nghiệm dự án tốt nghiệp (DATN)
-- =========================================================================

USE foxstyle_db;
GO

-- -------------------------------------------------------------------------
-- 1. LÀM SẠCH DỮ LIỆU CŨ VÀ RESET IDENTITY
-- -------------------------------------------------------------------------
PRINT 'Dang lam sach du lieu cu...';

-- Tạm thời vô hiệu hóa tất cả các ràng buộc khóa ngoại để tránh xung đột khi xóa
EXEC sp_MSforeachtable "ALTER TABLE ? NOCHECK CONSTRAINT all";

-- Xóa dữ liệu các bảng theo thứ tự
DELETE FROM user_coupons;
DELETE FROM reviews;
DELETE FROM wishlists;
DELETE FROM payments;
DELETE FROM order_details;
DELETE FROM orders;
DELETE FROM cart_details;
DELETE FROM carts;
DELETE FROM product_images;
DELETE FROM product_variants;
DELETE FROM products;
DELETE FROM categories;
DELETE FROM user_addresses;
DELETE FROM coupons;
DELETE FROM banners;
DELETE FROM users;
DELETE FROM roles;

-- Kích hoạt lại ràng buộc khóa ngoại
EXEC sp_MSforeachtable "ALTER TABLE ? WITH CHECK CHECK CONSTRAINT all";

-- Đặt lại giá trị tự tăng (Identity) về 0
DBCC CHECKIDENT ('roles', RESEED, 0);
DBCC CHECKIDENT ('users', RESEED, 0);
DBCC CHECKIDENT ('user_addresses', RESEED, 0);
DBCC CHECKIDENT ('categories', RESEED, 0);
DBCC CHECKIDENT ('products', RESEED, 0);
DBCC CHECKIDENT ('product_variants', RESEED, 0);
DBCC CHECKIDENT ('product_images', RESEED, 0);
DBCC CHECKIDENT ('carts', RESEED, 0);
DBCC CHECKIDENT ('cart_details', RESEED, 0);
DBCC CHECKIDENT ('coupons', RESEED, 0);
DBCC CHECKIDENT ('orders', RESEED, 0);
DBCC CHECKIDENT ('order_details', RESEED, 0);
DBCC CHECKIDENT ('payments', RESEED, 0);
DBCC CHECKIDENT ('wishlists', RESEED, 0);
DBCC CHECKIDENT ('reviews', RESEED, 0);
DBCC CHECKIDENT ('banners', RESEED, 0);

PRINT 'Lam sach du lieu thanh cong!';
GO

-- -------------------------------------------------------------------------
-- 2. KHỞI TẠO VAI TRÒ (ROLES) & TÀI KHOẢN (USERS) MẪU
-- -------------------------------------------------------------------------
PRINT 'Dang tao quyen va nguoi dung...';

INSERT INTO roles (role_name, description) VALUES
('ROLE_ADMIN', N'Quản trị viên hệ thống tối cao'),
('ROLE_STAFF', N'Nhân viên vận hành, quản lý kho và đơn hàng'),
('ROLE_CUSTOMER', N'Khách hàng mua sắm trực tuyến');

-- Tài khoản Admin & Staff (Mật khẩu mặc định đã mã hóa Bcrypt: 123456)
INSERT INTO users (role_id, username, password, full_name, email, phone, status) VALUES
(1, 'admin_fox', '$2a$12$N9qo8uLOqp.PZ.fK7lA52u19Zpx79U6jMlyvAexwXWz0N1Sg4J47K', N'Nguyễn Quản Trị', 'admin@foxstyle.vn', '0912345678', 1),
(2, 'staff_chien', '$2a$12$N9qo8uLOqp.PZ.fK7lA52u19Zpx79U6jMlyvAexwXWz0N1Sg4J47K', N'Lê Văn Nhân Viên', 'staff@foxstyle.vn', '0987654321', 1);

-- Sinh tự động 15 tài khoản khách hàng thực tế
DECLARE @cust_idx INT = 1;
WHILE @cust_idx <= 15
BEGIN
    DECLARE @cust_username VARCHAR(50) = 'customer' + CAST(@cust_idx AS VARCHAR(5));
    DECLARE @cust_email VARCHAR(100) = 'customer' + CAST(@cust_idx AS VARCHAR(5)) + '@gmail.com';
    DECLARE @cust_phone VARCHAR(15) = '090' + REPLACE(STR(FLOOR(RAND() * 10000000), 7), ' ', '0');
    DECLARE @cust_fullname NVARCHAR(100);
    
    SELECT TOP 1 @cust_fullname = val 
    FROM (VALUES 
        (N'Nguyễn Văn An'), (N'Trần Thị Bình'), (N'Lê Hoàng Cường'), (N'Phạm Minh Duy'), 
        (N'Hoàng Ngọc Em'), (N'Phan Thanh Hải'), (N'Vũ Minh Khánh'), (N'Đặng Quốc Bảo'), 
        (N'Bùi Thị Linh'), (N'Đỗ Anh Tuấn'), (N'Ngô Quang Huy'), (N'Dương Ngọc Trinh'), 
        (N'Lý Hoàng Nam'), (N'Trần Văn Sang'), (N'Nguyễn Thị Thu Hà')
    ) as Names(val)
    ORDER BY NEWID();

    INSERT INTO users (role_id, username, password, full_name, email, phone, status)
    VALUES (3, @cust_username, '$2a$12$N9qo8uLOqp.PZ.fK7lA52u19Zpx79U6jMlyvAexwXWz0N1Sg4J47K', @cust_fullname, @cust_email, @cust_phone, 1);

    DECLARE @new_user_id INT = SCOPE_IDENTITY();

    -- Tạo giỏ hàng trống cho user
    INSERT INTO carts (user_id) VALUES (@new_user_id);

    -- Tạo địa chỉ giao hàng mẫu
    DECLARE @province NVARCHAR(100);
    DECLARE @district NVARCHAR(100);
    DECLARE @ward NVARCHAR(100);
    DECLARE @detail_address NVARCHAR(255);

    SELECT TOP 1 @province = prov, @district = dist, @ward = wrd, @detail_address = det
    FROM (VALUES 
        (N'TP Hồ Chí Minh', N'Quận 1', N'Phường Bến Nghé', N'123 Đường Nguyễn Huệ'),
        (N'TP Hồ Chí Minh', N'Quận 3', N'Phường Võ Thị Sáu', N'456 Đường Điện Biên Phủ'),
        (N'Hà Nội', N'Quận Cầu Giấy', N'Phường Dịch Vọng', N'78 Đường Trần Thái Tông'),
        (N'Hà Nội', N'Quận Hoàn Kiếm', N'Phường Hàng Đào', N'12 Phố Hàng Đào'),
        (N'Đà Nẵng', N'Quận Hải Châu', N'Phường Thạch Thang', N'89 Đường Bạch Đằng'),
        (N'Cần Thơ', N'Quận Ninh Kiều', N'Phường An Khánh', N'34 Đường Nguyễn Văn Cừ'),
        (N'Hải Phòng', N'Quận Hồng Bàng', N'Phường Minh Khai', N'56 Đường Điện Biên Phủ')
    ) as Addrs(prov, dist, wrd, det)
    ORDER BY NEWID();

    INSERT INTO user_addresses (user_id, recipient_name, phone, province, district, ward, detail_address, is_default)
    VALUES (@new_user_id, @cust_fullname, @cust_phone, @province, @district, @ward, @detail_address, 1);

    SET @cust_idx = @cust_idx + 1;
END;

PRINT 'Khoi tao quyen va nguoi dung thanh cong!';
GO

-- -------------------------------------------------------------------------
-- 3. KHỞI TẠO DANH MỤC SẢN PHẨM (CATEGORIES)
-- -------------------------------------------------------------------------
PRINT 'Dang tao danh muc san pham...';

INSERT INTO categories (category_name, description, status) VALUES
(N'Áo Thun Nam', N'Áo thun ngắn tay, dài tay, cổ tròn, cổ bẻ phom dáng thể thao thoải mái', 1),
(N'Quần Jeans Nam', N'Các sản phẩm quần jeans denim bền bỉ phong cách nam tính', 1),
(N'Áo Sơ Mi Nam', N'Áo sơ mi công sở, sơ mi đi chơi chất liệu thoáng mát phom dáng lịch lãm', 1),
(N'Áo Khoác Nam', N'Áo gió, áo khoác bomber, áo phao giữ nhiệt mùa đông cho nam', 1),
(N'Quần Short Nam', N'Quần short kaki, short nỉ, short thun mặc nhà và đi chơi năng động', 1),
(N'Áo Thun Nữ', N'Áo thun ôm body, thun rộng croptop thời trang nữ tính', 1),
(N'Đầm & Váy Nữ', N'Đầm dự tiệc, váy maxi đi biển, váy công sở thanh lịch quyến rũ', 1),
(N'Chân Váy', N'Chân váy chữ A, chân váy xếp ly, chân váy tennis trẻ trung', 1),
(N'Quần Jeans Nữ', N'Quần jeans baggy, skinny, ống loe tôn dáng phái đẹp', 1),
(N'Áo Khoác Nữ', N'Áo blazer, áo dạ, áo khoác gió mỏng phong cách Hàn Quốc', 1),
(N'Đồ Bộ Mặc Nhà', N'Đồ bộ mặc nhà chất lụa, cotton thoáng mát dễ chịu', 1),
(N'Phụ Kiện Thời Trang', N'Thắt lưng da, mũ lưỡi trai, tất vớ cao cấp', 1);

PRINT 'Danh muc san pham da san sang!';
GO

-- -------------------------------------------------------------------------
-- 4. TẠO CÁC BẢNG TẠM CHỨA TỪ KHÓA ĐỂ TỰ ĐỘNG GHÉP TÊN SẢN PHẨM PHONG PHÚ
-- -------------------------------------------------------------------------
PRINT 'Dang thiet lap tu dien sinh san pham tu dong...';

CREATE TABLE #Nouns (id INT IDENTITY, cat_id INT, noun NVARCHAR(100));
CREATE TABLE #Adjectives (id INT IDENTITY, adj NVARCHAR(100));
CREATE TABLE #Materials (id INT IDENTITY, mat NVARCHAR(100));
CREATE TABLE #Origins (id INT IDENTITY, orig NVARCHAR(100));
CREATE TABLE #ReviewTexts (id INT IDENTITY, rating TINYINT, rev NVARCHAR(MAX));
CREATE TABLE #Colors (id INT IDENTITY, col NVARCHAR(50));
CREATE TABLE #Sizes (id INT IDENTITY, cat_group VARCHAR(10), sz VARCHAR(20));
CREATE TABLE #ImagePool (id INT IDENTITY, cat_id INT, url VARCHAR(255));

-- Bơm dữ liệu từ điển danh từ theo danh mục
INSERT INTO #Nouns (cat_id, noun) VALUES 
(1, N'Áo thun basic cổ tròn'), (1, N'Áo thun polo thể thao'), (1, N'Áo thun tay lỡ form rộng'), 
(1, N'Áo phông nam in hình'), (1, N'Áo thun cổ tim ôm sát'), (1, N'Áo thun unisex Streetwear'),
(1, N'Áo thun raglan phối tay'), (1, N'Áo thun polo cổ dệt'), (1, N'Áo thun dài tay basic'),

(2, N'Quần jean skinny'), (2, N'Quần jean slimfit mài xước'), (2, N'Quần jean baggy trơn'), 
(2, N'Quần jean rách gối cá tính'), (2, N'Quần bò denim ống suông'), (2, N'Quần jean jogger co giãn'),
(2, N'Quần jean đen tuyền trơn'), (2, N'Quần jean wax màu khói'), (2, N'Quần bò cạp chun trẻ trung'),

(3, N'Áo sơ mi trắng công sở'), (3, N'Áo sơ mi cổ tàu thoáng mát'), (3, N'Áo sơ mi Oxford cộc tay'), 
(3, N'Áo sơ mi họa tiết Hawaii'), (3, N'Áo sơ mi caro flannel dạo phố'), (3, N'Áo sơ mi đũi nam cộc tay'),
(3, N'Áo sơ mi linen cổ bẻ'), (3, N'Áo sơ mi denim bụi bặm'), (3, N'Áo sơ mi phối màu Hàn Quốc'),

(4, N'Áo khoác gió 2 lớp chống nước'), (4, N'Áo khoác bomber kaki'), (4, N'Áo khoác cardigan len mỏng'), 
(4, N'Áo khoác dù phối màu'), (4, N'Áo hoodie nỉ bông dày dặn'), (4, N'Áo sweater cổ tròn thu đông'),
(4, N'Áo khoác bò denim retro'), (4, N'Áo khoác phao siêu nhẹ'), (4, N'Áo măng tô dạ dáng lửng'),

(5, N'Quần short kaki basic'), (5, N'Quần short thun thể thao'), (5, N'Quần lửng short đi biển'), 
(5, N'Quần short jean cá tính'), (5, N'Quần đùi nỉ co giãn'), (5, N'Quần short cargo nhiều túi'),
(5, N'Quần short đũi mát lạnh'), (5, N'Quần short chạy bộ chuyên dụng'), (5, N'Quần short mặc nhà thoải mái'),

(6, N'Áo thun nữ ôm tăm lạnh'), (6, N'Áo thun croptop cổ vuông'), (6, N'Áo thun nữ oversize giấu quần'), 
(6, N'Áo phông nữ in hình dễ thương'), (6, N'Áo thun trễ vai sexy'), (6, N'Áo thun polo nữ năng động'),
(6, N'Áo thun dệt kim cổ lọ'), (6, N'Áo hai dây thun gân ôm'), (6, N'Áo ba lỗ thun cotton'),

(7, N'Đầm hoa nhí vintage'), (7, N'Đầm ôm body dự tiệc'), (7, N'Đầm maxi voan tơ đi biển'), 
(7, N'Đầm công sở dáng chữ A'), (7, N'Váy xòe bánh bèo cúp ngực'), (7, N'Đầm trễ vai xếp ly xòe'),
(7, N'Đầm sơ mi thanh lịch'), (7, N'Váy suông đũi mát mẻ'), (7, N'Đầm len body tay dài'),

(8, N'Chân váy chữ A cạp cao'), (8, N'Chân váy tennis xếp ly dài'), (8, N'Chân váy jean cá tính'), 
(8, N'Chân váy xòe công chúa bồng bềnh'), (8, N'Chân váy bút chì công sở'), (8, N'Chân váy midi xẻ tà quyến rũ'),
(8, N'Chân váy kaki túi hộp'), (8, N'Chân váy len ôm mỏng'), (8, N'Chân váy hoa nhí dáng xòe'),

(9, N'Quần jean nữ baggy cạp cao'), (9, N'Quần jean skinny nữ ôm dáng'), (9, N'Quần bò ống rộng retro'), 
(9, N'Quần jean ống loe tôn dáng'), (9, N'Quần jean shorts nữ cạp cao'), (9, N'Quần jean rách gối phá cách'),
(9, N'Quần jean mom fit cổ điển'), (9, N'Quần bò cạp cao co giãn nhẹ'), (9, N'Quần jean nữ phối cúc'),

(10, N'Áo khoác gió nữ chống nắng'), (10, N'Áo blazer công sở thanh lịch'), (10, N'Áo cardigan len dệt kim'), 
(10, N'Áo khoác dạ dáng dài thu đông'), (10, N'Áo hoodie croptop nỉ bông'), (10, N'Áo khoác lửng kaki phong cách'),
(10, N'Áo khoác phao béo ấm áp'), (10, N'Áo khoác da biker cá tính'), (10, N'Áo khoác len mỏng đi biển'),

(11, N'Đồ bộ mặc nhà chất lụa satin'), (11, N'Set đồ đùi cotton thoáng mát'), (11, N'Đồ bộ lửng đũi xước'), 
(11, N'Bộ đồ pijama dài tay ấm áp'), (11, N'Set đồ thể thao nữ cá tính'), (11, N'Đồ bộ sát nách mát mẻ'),
(11, N'Bộ mặc nhà thun lạnh mềm mịn'), (11, N'Set đồ lửng phối viền ren'), (11, N'Bộ pijama cộc tay sang trọng'),

(12, N'Thắt lưng da bò cao cấp'), (12, N'Mũ lưỡi trai thêu chữ cá tính'), (12, N'Combo 5 đôi tất vớ cotton'), 
(12, N'Kính mát thời trang chống tia UV'), (12, N'Mũ rộng vành đi biển gấp gọn'), (12, N'Khăn choàng len thu đông ấm áp'),
(12, N'Túi tote vải canvas in hình'), (12, N'Cà vạt nam lụa bóng lịch lãm'), (12, N'Ví da nam dáng ngang nhỏ gọn');

-- Tính từ
INSERT INTO #Adjectives (adj) VALUES 
(N'Basic'), (N'Premium'), (N'Vintage'), (N'Slimfit'), (N'Oversize'), (N'Regular'), 
(N'Unisex'), (N'Streetwear'), (N'Casual'), (N'Modern'), (N'Hàn Quốc'), (N'Nhật Bản'), 
(N'Local Brand'), (N'Retro'), (N'Thanh lịch'), (N'Cá tính'), (N'Năng động'), (N'Thời trang'),
(N'Trẻ trung'), (N'Sang trọng'), (N'Tinh tế'), (N'Độc đáo'), (N'Nhẹ nhàng'), (N'Quyến rũ');

-- Chất liệu
INSERT INTO #Materials (mat) VALUES 
(N'Cotton 100% tự nhiên'), (N'Denim co giãn cao cấp'), (N'Kaki thun mềm'), (N'Vải Linen (Đũi) thoáng mát'), 
(N'Lụa Satin mềm mịn'), (N'Nỉ da cá dày dặn'), (N'Polyester trượt nước nhẹ'), (N'Vải Tuyết mưa giữ form'), 
(N'Len dệt kim cao cấp'), (N'Voan cát lót lụa'), (N'Chất đũi xước tự nhiên'), (N'Da bò thật 100%');

-- Xuất xứ
INSERT INTO #Origins (orig) VALUES 
(N'Việt Nam'), (N'Quảng Châu (Trung Quốc)'), (N'Hàn Quốc'), (N'Thái Lan'), (N'Nhật Bản');

-- Màu sắc
INSERT INTO #Colors (col) VALUES 
(N'Trắng'), (N'Đen'), (N'Xanh Navy'), (N'Xám Ghi'), (N'Kem Be'), 
(N'Hồng Pastel'), (N'Xanh Rêu'), (N'Vàng Bơ'), (N'Đỏ Đô'), (N'Nâu Cafe');

-- Kích thước theo nhóm
INSERT INTO #Sizes (cat_group, sz) VALUES 
('CLOTH', 'S'), ('CLOTH', 'M'), ('CLOTH', 'L'), ('CLOTH', 'XL'), ('CLOTH', 'XXL'),
('JEANS', '29'), ('JEANS', '30'), ('JEANS', '31'), ('JEANS', '32'), ('JEANS', '33'),
('FREE', 'FreeSize');

-- Nội dung đánh giá mẫu
INSERT INTO #ReviewTexts (rating, rev) VALUES 
(5, N'Sản phẩm đẹp xuất sắc, đóng gói cẩn thận. Chất vải mềm mịn mát lạnh rất đáng tiền.'),
(5, N'Giao hàng nhanh như chớp. Áo đẹp đúng form hình mẫu, mặc vừa vặn ưng ý ghê.'),
(5, N'Đường may rất tỉ mỉ, chất lượng tốt. Sẽ ủng hộ shop nhiều lần tới.'),
(5, N'Shop tư vấn nhiệt tình, ship nhanh. Đồ mặc lên rất sang và tôn dáng nha.'),
(5, N'Tuyệt vời! Vải siêu dày dặn, không xù lông khi giặt máy. Điểm 10 chất lượng!'),
(4, N'Sản phẩm tốt phù hợp giá tiền. Mặc mát, form hơi rộng chút xíu nhưng vẫn đẹp.'),
(4, N'Màu sắc bên ngoài hơi đậm hơn hình tí, nhưng chất lượng vải thì rất ổn áp.'),
(4, N'Giao hàng hơi chậm 1 ngày do mưa bão, nhưng bù lại đóng gói đẹp và sản phẩm rất tốt.'),
(4, N'Vải co giãn thoải mái, mặc dễ chịu. Nói chung là hài lòng trong tầm giá.'),
(3, N'Chất vải tạm ổn, hơi mỏng một chút so với kỳ vọng nhưng mặc ở nhà thì mát.'),
(3, N'Kích thước hơi ôm một chút, khuyên mọi người nên mua tăng 1 size mặc cho thoải mái.'),
(3, N'Đóng gói bình thường, đường may có vài sợi chỉ thừa nhưng cắt đi vẫn dùng tốt.');

-- Kho hình ảnh mẫu từ Unsplash (phân chia theo danh mục sản phẩm)
INSERT INTO #ImagePool (cat_id, url) VALUES
(1, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'),
(1, 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500'),
(1, 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500'),
(1, 'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=500'),
(2, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500'),
(2, 'https://images.unsplash.com/photo-1582552938357-103a21d7c7ed?w=500'),
(2, 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=500'),
(3, 'https://images.unsplash.com/photo-1620012253295-c05518e99309?w=500'),
(3, 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500'),
(3, 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500'),
(4, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500'),
(4, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500'),
(4, 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500'),
(5, 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=500'),
(5, 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=500'),
(5, 'https://images.unsplash.com/photo-1565084888279-aca607ecad0c?w=500'),
(6, 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=500'),
(6, 'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=500'),
(6, 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=500'),
(7, 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500'),
(7, 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500'),
(7, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500'),
(8, 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=500'),
(8, 'https://images.unsplash.com/photo-1583496661160-fb488b2c1a82?w=500'),
(9, 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500'),
(9, 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?w=500'),
(10, 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=500'),
(10, 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=500'),
(11, 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500'),
(11, 'https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?w=500'),
(12, 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=500'),
(12, 'https://images.unsplash.com/photo-1624224971170-2f84fed5eb5e?w=500');

PRINT 'Thiet lap tu dien hoan tat!';
GO

-- -------------------------------------------------------------------------
-- 5. VÒNG LẶP CHÍNH SINH 430 SẢN PHẨM THỜI TRANG & CÁC BIẾN THỂ, ẢNH, ĐÁNH GIÁ
-- -------------------------------------------------------------------------
PRINT 'Dang sinh 430 san pham thoi trang...';

DECLARE @prod_counter INT = 1;
WHILE @prod_counter <= 430
BEGIN
    -- Xác định danh mục dựa trên bước chạy (phân bổ đều từ 1 đến 12)
    DECLARE @cat_id INT = ((@prod_counter - 1) % 12) + 1;
    
    -- Lấy ngẫu nhiên từ khóa để ghép tên sản phẩm
    DECLARE @noun NVARCHAR(100);
    SELECT TOP 1 @noun = noun FROM #Nouns WHERE cat_id = @cat_id ORDER BY NEWID();
    IF @noun IS NULL SET @noun = N'Sản phẩm thời trang';

    DECLARE @adj NVARCHAR(100);
    SELECT TOP 1 @adj = adj FROM #Adjectives ORDER BY NEWID();

    DECLARE @mat NVARCHAR(100);
    SELECT TOP 1 @mat = mat FROM #Materials ORDER BY NEWID();

    DECLARE @orig NVARCHAR(100);
    SELECT TOP 1 @orig = orig FROM #Origins ORDER BY NEWID();

    -- Tạo tên sản phẩm độc nhất bằng mã số để tránh trùng lặp
    DECLARE @product_name NVARCHAR(150) = @noun + N' ' + @adj + N' - F' + CAST(@prod_counter AS NVARCHAR(10));

    -- Tính toán giá bán ngẫu nhiên (từ 150k đến 1tr2)
    DECLARE @price DECIMAL(12,2) = 150000.00 + FLOOR(RAND() * 22) * 50000.00; 
    DECLARE @original_price DECIMAL(12,2) = @price;
    
    -- 60% cơ hội sản phẩm có chương trình giảm giá
    IF RAND() > 0.4 
    BEGIN
        SET @original_price = @price + FLOOR(RAND() * 5 + 1) * 50000.00;
    END

    -- Sinh mô tả chi tiết sản phẩm
    DECLARE @desc NVARCHAR(MAX) = N'Sản phẩm ' + @product_name + N' thiết kế trẻ trung, hiện đại. ' + 
        N'Được làm từ chất liệu ' + @mat + N' mang lại cảm giác thoáng mát, bền đẹp và co giãn tối ưu khi mặc. ' +
        N'Đường may tinh xảo, chắc chắn, phù hợp mặc đi làm, đi chơi hay dạo phố. ' +
        N'Xuất xứ từ ' + @orig + N'. Hướng dẫn giặt ủi: Giặt bằng máy hoặc tay ở nhiệt độ thường, không dùng chất tẩy mạnh, phơi nơi khô ráo thoáng mát.';

    -- Lấy ảnh đại diện
    DECLARE @img_url VARCHAR(255);
    SELECT TOP 1 @img_url = url FROM #ImagePool WHERE cat_id = @cat_id ORDER BY NEWID();
    IF @img_url IS NULL SET @img_url = 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=500';

    -- Thêm sản phẩm chính
    INSERT INTO products (category_id, product_name, price, original_price, description, image_url, material, origin, status)
    VALUES (@cat_id, @product_name, @price, @original_price, @desc, @img_url, @mat, @orig, 1);

    DECLARE @new_product_id INT = SCOPE_IDENTITY();

    -- Thêm hình ảnh sản phẩm (1 ảnh chính và 1 ảnh chi tiết phụ)
    INSERT INTO product_images (product_id, image_url, is_primary, display_order)
    VALUES (@new_product_id, @img_url, 1, 1);

    DECLARE @detail_img_url VARCHAR(255);
    SELECT TOP 1 @detail_img_url = url FROM #ImagePool WHERE cat_id = @cat_id AND url <> @img_url ORDER BY NEWID();
    IF @detail_img_url IS NOT NULL
    BEGIN
        INSERT INTO product_images (product_id, image_url, is_primary, display_order)
        VALUES (@new_product_id, @detail_img_url, 0, 2);
    END

    -- Xác định nhóm kích cỡ phù hợp với danh mục hàng
    DECLARE @sz_group VARCHAR(10) = 'CLOTH';
    IF @cat_id IN (2, 9) SET @sz_group = 'JEANS';
    IF @cat_id = 12 SET @sz_group = 'FREE';

    -- Sinh biến thể sản phẩm (Kế hợp 3 màu khác nhau, mỗi màu có 3 size khác nhau)
    DECLARE @col_loop INT = 1;
    WHILE @col_loop <= 3
    BEGIN
        DECLARE @color_name NVARCHAR(50);
        -- Chọn màu ngẫu nhiên không trùng trong sản phẩm hiện tại
        SELECT TOP 1 @color_name = col FROM #Colors ORDER BY NEWID();

        DECLARE @sz_loop INT = 1;
        WHILE @sz_loop <= 3
        BEGIN
            DECLARE @sz_name VARCHAR(20);
            SELECT TOP 1 @sz_name = sz FROM #Sizes WHERE cat_group = @sz_group ORDER BY NEWID();

            -- Kiểm tra xem sự kết hợp màu-size này đã được chèn cho sản phẩm chưa
            IF NOT EXISTS (SELECT 1 FROM product_variants WHERE product_id = @new_product_id AND color = @color_name AND size = @sz_name)
            BEGIN
                DECLARE @qty INT = 20 + FLOOR(RAND() * 81); -- Tồn kho ngẫu nhiên từ 20 đến 100 cái
                
                -- Định danh SKU
                DECLARE @sku_prefix VARCHAR(10) = 'PROD';
                IF @cat_id = 1 SET @sku_prefix = 'TSH';
                IF @cat_id = 2 SET @sku_prefix = 'JEAN';
                IF @cat_id = 3 SET @sku_prefix = 'SHIR';
                IF @cat_id = 4 SET @sku_prefix = 'JACK';
                IF @cat_id = 5 SET @sku_prefix = 'SHRT';
                IF @cat_id = 6 SET @sku_prefix = 'WTSH';
                IF @cat_id = 7 SET @sku_prefix = 'DRES';
                IF @cat_id = 8 SET @sku_prefix = 'SKRT';
                IF @cat_id = 9 SET @sku_prefix = 'WJEA';
                IF @cat_id = 10 SET @sku_prefix = 'WJAC';
                IF @cat_id = 11 SET @sku_prefix = 'HOME';
                IF @cat_id = 12 SET @sku_prefix = 'ACC';

                DECLARE @color_code VARCHAR(3) = 'COL';
                IF @color_name = N'Trắng' SET @color_code = 'WHT';
                IF @color_name = N'Đen' SET @color_code = 'BLK';
                IF @color_name = N'Xanh Navy' SET @color_code = 'NVY';
                IF @color_name = N'Xám Ghi' SET @color_code = 'GRY';
                IF @color_name = N'Kem Be' SET @color_code = 'BGE';
                IF @color_name = N'Hồng Pastel' SET @color_code = 'PNK';
                IF @color_name = N'Xanh Rêu' SET @color_code = 'GRN';
                IF @color_name = N'Vàng Bơ' SET @color_code = 'YLW';
                IF @color_name = N'Đỏ Đô' SET @color_code = 'RED';
                IF @color_name = N'Nâu Cafe' SET @color_code = 'BRN';

                DECLARE @sku VARCHAR(100) = @sku_prefix + '-' + @color_code + '-' + @sz_name + '-' + CAST(@new_product_id AS VARCHAR(10));

                INSERT INTO product_variants (product_id, color, size, quantity, sku)
                VALUES (@new_product_id, @color_name, @sz_name, @qty, @sku);
            END
            SET @sz_loop = @sz_loop + 1;
        END
        SET @col_loop = @col_loop + 1;
    END

    -- Sinh từ 1 đến 2 đánh giá cho sản phẩm (Xác suất 70%)
    IF RAND() > 0.3
    BEGIN
        DECLARE @rev_loop INT = 0;
        DECLARE @num_reviews INT = 1 + FLOOR(RAND() * 2);
        WHILE @rev_loop < @num_reviews
        BEGIN
            DECLARE @rev_rating INT;
            DECLARE @rev_comment NVARCHAR(MAX);
            DECLARE @rev_user_id INT;

            SELECT TOP 1 @rev_rating = rating, @rev_comment = rev FROM #ReviewTexts ORDER BY NEWID();
            SELECT TOP 1 @rev_user_id = user_id FROM users WHERE role_id = 3 ORDER BY NEWID();

            IF @rev_user_id IS NOT NULL
            BEGIN
                DECLARE @rev_date DATETIME = DATEADD(DAY, -FLOOR(RAND() * 120), GETDATE());
                INSERT INTO reviews (user_id, product_id, rating, comment, review_date)
                VALUES (@rev_user_id, @new_product_id, @rev_rating, @rev_comment, @rev_date);
            END
            SET @rev_loop = @rev_loop + 1;
        END
    END

    SET @prod_counter = @prod_counter + 1;
END

PRINT 'Sinh 430 san pham va bien the hoan tat!';
GO

-- -------------------------------------------------------------------------
-- 6. KHỞI TẠO CÁC MÃ GIẢM GIÁ (COUPONS)
-- -------------------------------------------------------------------------
PRINT 'Dang tao cac ma giam gia...';

INSERT INTO coupons (coupon_code, discount_type, discount_value, min_order_value, max_discount_value, start_date, end_date, usage_limit, used_count, status) VALUES
('FOXSTYLE50', 1, 50000.00, 200000.00, 50000.00, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 1000, 0, 1),
('SUMMER10', 2, 10.00, 150000.00, 80000.00, '2026-06-01 00:00:00', '2026-08-31 23:59:59', 500, 0, 1),
('WELCOME2026', 1, 20000.00, 100000.00, 20000.00, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 2000, 0, 1),
('VIPFOX15', 2, 15.00, 500000.00, 150000.00, '2026-01-01 00:00:00', '2026-12-31 23:59:59', 200, 0, 1);

PRINT 'Ma giam gia khoi tao xong!';
GO

-- -------------------------------------------------------------------------
-- 7. KHỞI TẠO BANNERS
-- -------------------------------------------------------------------------
PRINT 'Dang tao banner trang chu...';

INSERT INTO banners (title, image_url, link_url, position, status) VALUES
(N'Bộ Sưu Tập Thời Trang Hè Mát Mẻ 2026', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000', '/products?category=7', 1, 1),
(N'Siêu Sale Giữa Năm - Đồng Giá Từ 199k', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000', '/products?category=1', 2, 1),
(N'Phong Cách Streetwear Hàn Quốc Độc Đáo', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000', '/products?category=4', 3, 1);

PRINT 'Banners da hieu luc!';
GO

-- -------------------------------------------------------------------------
-- 8. SINH TỰ ĐỘNG ĐƠN HÀNG MẪU (ORDERS & PAYMENTS) ĐỂ PHỤC VỤ BIỂU ĐỒ DOANH THU
-- -------------------------------------------------------------------------
PRINT 'Dang tao 65 don hang mau trong vong 4 thang qua...';

DECLARE @order_counter INT = 1;
WHILE @order_counter <= 65
BEGIN
    DECLARE @ord_user_id INT;
    DECLARE @rec_name NVARCHAR(100);
    DECLARE @rec_phone VARCHAR(15);
    DECLARE @rec_addr NVARCHAR(255);

    -- Lấy ngẫu nhiên thông tin 1 khách hàng và địa chỉ mặc định của họ
    SELECT TOP 1 
        @ord_user_id = u.user_id,
        @rec_name = u.full_name,
        @rec_phone = u.phone,
        @rec_addr = a.detail_address + N', ' + a.ward + N', ' + a.district + N', ' + a.province
    FROM users u
    JOIN user_addresses a ON u.user_id = a.user_id
    WHERE u.role_id = 3
    ORDER BY NEWID();

    IF @ord_user_id IS NOT NULL
    BEGIN
        -- Phân phối ngẫu nhiên trạng thái đơn hàng (ưu tiên trạng thái 3 - Đã giao để có doanh thu mẫu)
        DECLARE @ord_status INT = 3;
        DECLARE @status_rand FLOAT = RAND();
        IF @status_rand < 0.08 SET @ord_status = 0;   -- Chờ duyệt
        ELSE IF @status_rand < 0.15 SET @ord_status = 1;   -- Đã duyệt
        ELSE IF @status_rand < 0.22 SET @ord_status = 2;   -- Đang giao
        ELSE IF @status_rand < 0.85 SET @ord_status = 3;   -- Đã giao thành công
        ELSE SET @ord_status = 4;                           -- Đã hủy

        -- Ngày đặt hàng ngẫu nhiên trong vòng 120 ngày qua
        DECLARE @ord_date DATETIME = DATEADD(DAY, -FLOOR(RAND() * 120), GETDATE());
        SET @ord_date = DATEADD(HOUR, FLOOR(RAND() * 24), @ord_date);
        SET @ord_date = DATEADD(MINUTE, FLOOR(RAND() * 60), @ord_date);

        -- Áp dụng mã giảm giá ngẫu nhiên (xác suất 30%)
        DECLARE @coupon_id INT = NULL;
        DECLARE @discount_amount DECIMAL(12,2) = 0;
        IF RAND() < 0.3
        BEGIN
            SELECT TOP 1 @coupon_id = coupon_id FROM coupons WHERE status = 1 ORDER BY NEWID();
        END

        -- Thêm đơn hàng tạm thời (chờ tính tổng tiền)
        DECLARE @shipping_fee DECIMAL(12,2) = 30000.00;
        INSERT INTO orders (user_id, order_date, total_amount, discount_amount, shipping_fee, recipient_name, recipient_phone, shipping_address, status, coupon_id)
        VALUES (@ord_user_id, @ord_date, 0, 0, @shipping_fee, @rec_name, @rec_phone, @rec_addr, @ord_status, @coupon_id);

        DECLARE @new_order_id INT = SCOPE_IDENTITY();

        -- Chọn ngẫu nhiên từ 1 đến 3 biến thể sản phẩm khác nhau để thêm vào chi tiết đơn hàng
        CREATE TABLE #TempOrderItems (variant_id INT, price DECIMAL(12,2), quantity INT);

        INSERT INTO #TempOrderItems (variant_id, price, quantity)
        SELECT TOP (1 + FLOOR(RAND() * 3)) 
            v.variant_id, 
            p.price,
            (1 + FLOOR(RAND() * 2)) -- Mua số lượng 1 hoặc 2 cái
        FROM product_variants v
        JOIN products p ON v.product_id = p.product_id
        ORDER BY NEWID();

        -- Thêm vào bảng chi tiết hóa đơn
        INSERT INTO order_details (order_id, variant_id, quantity, price)
        SELECT @new_order_id, variant_id, quantity, price FROM #TempOrderItems;

        -- Tính tổng tiền tạm tính của giỏ hàng
        DECLARE @subtotal DECIMAL(12,2) = 0;
        SELECT @subtotal = SUM(price * quantity) FROM #TempOrderItems;

        -- Áp dụng mã giảm giá thực tế nếu thỏa điều kiện
        IF @coupon_id IS NOT NULL
        BEGIN
            DECLARE @disc_type TINYINT;
            DECLARE @disc_val DECIMAL(12,2);
            DECLARE @min_val DECIMAL(12,2);
            DECLARE @max_val DECIMAL(12,2);

            SELECT @disc_type = discount_type, @disc_val = discount_value, @min_val = min_order_value, @max_val = max_discount_value
            FROM coupons WHERE coupon_id = @coupon_id;

            IF @subtotal >= @min_val
            BEGIN
                IF @disc_type = 1 -- Khấu trừ tiền mặt
                BEGIN
                    SET @discount_amount = @disc_val;
                END
                ELSE IF @disc_type = 2 -- Khấu trừ %
                BEGIN
                    SET @discount_amount = @subtotal * (@disc_val / 100.0);
                    IF @max_val IS NOT NULL AND @discount_amount > @max_val
                    BEGIN
                        SET @discount_amount = @max_val;
                    END
                END

                IF @discount_amount > @subtotal SET @discount_amount = @subtotal;
            END
            ELSE
            BEGIN
                -- Không đạt yêu cầu mua tối thiểu của mã giảm giá -> Hủy dùng coupon cho hóa đơn này
                SET @coupon_id = NULL;
                UPDATE orders SET coupon_id = NULL WHERE order_id = @new_order_id;
            END
        END

        DECLARE @total_amount DECIMAL(12,2) = @subtotal - @discount_amount + @shipping_fee;

        -- Cập nhật lại số tiền chuẩn xác của hóa đơn
        UPDATE orders 
        SET total_amount = @total_amount,
            discount_amount = @discount_amount
        WHERE order_id = @new_order_id;

        -- Nếu đơn hàng Đã Giao (status = 3) -> Thiết lập giao dịch thanh toán thành công
        IF @ord_status = 3
        BEGIN
            DECLARE @pay_method NVARCHAR(50);
            SELECT TOP 1 @pay_method = val FROM (VALUES (N'Thẻ ATM nội địa (VNPAY)'), (N'Ví điện tử MoMo'), (N'Thẻ quốc tế Visa/Master'), (N'COD - Thanh toán khi nhận hàng')) as Methods(val) ORDER BY NEWID();
            
            DECLARE @pay_status TINYINT = 1; -- Đã thanh toán
            DECLARE @tx_id VARCHAR(100) = 'TXN' + REPLACE(STR(FLOOR(RAND() * 1000000000), 10), ' ', '0');
            DECLARE @pay_date DATETIME = DATEADD(MINUTE, 10 + FLOOR(RAND() * 40), @ord_date); -- Giao dịch thanh toán sau đặt hàng 10-50 phút

            INSERT INTO payments (order_id, payment_method, payment_status, transaction_id, payment_date, amount)
            VALUES (@new_order_id, @pay_method, @pay_status, @tx_id, @pay_date, @total_amount);

            -- Ghi nhận lịch sử dùng coupon của User
            IF @coupon_id IS NOT NULL
            BEGIN
                INSERT INTO user_coupons (user_id, coupon_id, used_at, order_id)
                VALUES (@ord_user_id, @coupon_id, @pay_date, @new_order_id);

                UPDATE coupons SET used_count = used_count + 1 WHERE coupon_id = @coupon_id;
            END
        END
        -- Nếu đơn hàng Đã Hủy (status = 4) -> 50% cơ hội do cổng thanh toán thất bại
        ELSE IF @ord_status = 4
        BEGIN
            IF RAND() < 0.5
            BEGIN
                DECLARE @cancel_pay_method NVARCHAR(50) = N'Thẻ ATM nội địa (VNPAY)';
                DECLARE @cancel_tx_id VARCHAR(100) = 'TXN_FAIL_' + REPLACE(STR(FLOOR(RAND() * 1000000000), 10), ' ', '0');
                
                INSERT INTO payments (order_id, payment_method, payment_status, transaction_id, payment_date, amount)
                VALUES (@new_order_id, @cancel_pay_method, 2, @cancel_tx_id, @ord_date, @total_amount); -- Status 2: Thất bại
            END
        END
        -- Các trạng thái khác -> COD hoặc Đang chờ xử lý ví điện tử
        ELSE
        BEGIN
            IF RAND() < 0.4
            BEGIN
                INSERT INTO payments (order_id, payment_method, payment_status, transaction_id, payment_date, amount)
                VALUES (@new_order_id, N'Ví điện tử MoMo', 0, NULL, @ord_date, @total_amount); -- Status 0: Chưa thanh toán
            END
        END

        DROP TABLE #TempOrderItems;
    END

    SET @order_counter = @order_counter + 1;
END

PRINT 'Tao 65 don hang mau thanh cong!';
GO

-- -------------------------------------------------------------------------
-- 9. KHỞI TẠO DANH SÁCH YÊU THÍCH (WISHLISTS) MẪU
-- -------------------------------------------------------------------------
PRINT 'Dang tao danh sach san pham yeu thich (Wishlists) cua nguoi dung...';

DECLARE @wish_idx INT = 1;
WHILE @wish_idx <= 45
BEGIN
    DECLARE @w_user_id INT;
    DECLARE @w_prod_id INT;
    
    SELECT TOP 1 @w_user_id = user_id FROM users WHERE role_id = 3 ORDER BY NEWID();
    SELECT TOP 1 @w_prod_id = product_id FROM products ORDER BY NEWID();

    IF @w_user_id IS NOT NULL AND @w_prod_id IS NOT NULL
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM wishlists WHERE user_id = @w_user_id AND product_id = @w_prod_id)
        BEGIN
            INSERT INTO wishlists (user_id, product_id, added_date)
            VALUES (@w_user_id, @w_prod_id, DATEADD(DAY, -FLOOR(RAND() * 30), GETDATE()));
        END
    END
    SET @wish_idx = @wish_idx + 1;
END
GO

-- -------------------------------------------------------------------------
-- 10. THÊM MỘT SỐ SẢN PHẨM VÀO GIỎ HÀNG CHƯA THANH TOÁN (CARTS)
-- -------------------------------------------------------------------------
PRINT 'Dang tao gio hang dang hoat dong cho mot so khach hang...';

DECLARE @cart_idx INT = 1;
WHILE @cart_idx <= 10
BEGIN
    DECLARE @c_user_id INT;
    DECLARE @c_cart_id INT;
    DECLARE @c_variant_id INT;

    SELECT TOP 1 @c_user_id = user_id, @c_cart_id = cart_id FROM carts ORDER BY NEWID();
    SELECT TOP 1 @c_variant_id = variant_id FROM product_variants ORDER BY NEWID();

    IF @c_cart_id IS NOT NULL AND @c_variant_id IS NOT NULL
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM cart_details WHERE cart_id = @c_cart_id AND variant_id = @c_variant_id)
        BEGIN
            INSERT INTO cart_details (cart_id, variant_id, quantity)
            VALUES (@c_cart_id, @c_variant_id, 1 + FLOOR(RAND() * 2));
        END
    END
    SET @cart_idx = @cart_idx + 1;
END
GO

-- -------------------------------------------------------------------------
-- 11. DỌN DẸP CÁC BẢNG TẠM SAU KHI HOÀN TẤT
-- -------------------------------------------------------------------------
PRINT 'Dang xoa cac bang tam, ket thuc qua trinh...';

DROP TABLE #Nouns;
DROP TABLE #Adjectives;
DROP TABLE #Materials;
DROP TABLE #Origins;
DROP TABLE #ReviewTexts;
DROP TABLE #Colors;
DROP TABLE #Sizes;
DROP TABLE #ImagePool;

PRINT '=========================================================================';
PRINT '  KICH BAN SINH DU LIEU HOAN TAT XUAT SAC!';
PRINT '  - Roles: 3';
PRINT '  - Users: 17 (2 Admins/Staffs, 15 Customers)';
PRINT '  - Categories: 12';
PRINT '  - Products: 430 (Moi san pham nhieu anh, dang gia, size & mau)';
PRINT '  - Product Variants: ~1500';
PRINT '  - Coupons: 4';
PRINT '  - Orders & Details & Payments: 65';
PRINT '  - Active Shopping Carts & Wishlists: Da tao';
PRINT '=========================================================================';
GO
