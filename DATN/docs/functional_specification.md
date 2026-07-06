# TÀI LIỆU PHÂN TÍCH CHỨC NĂNG HỆ THỐNG FOXSTYLE
## Sơ đồ Phân rã Chức năng, Sơ đồ Ca sử dụng (Use Case) & Đặc tả Chi tiết

Tài liệu này phân tích chi tiết các yêu cầu chức năng của hệ thống thương mại điện tử **FoxStyle**, phân rã chức năng theo phân hệ và cung cấp các đặc tả ca sử dụng (Use Case) chi tiết để lập trình viên và người viết báo cáo đồ án tốt nghiệp dễ dàng theo dõi.

---

## PHẦN 1: SƠ ĐỒ PHÂN RÃ CHỨC NĂNG (FUNCTIONAL DECOMPOSITION)

Hệ thống FoxStyle được phân rã thành 2 phân hệ chức năng lớn: **Phân hệ Khách hàng (Storefront)** và **Phân hệ Quản trị (Admin Portal)**.

```
HỆ THỐNG FOXSTYLE
├── 1. Phân hệ Khách hàng (Storefront)
│   ├── 1.1. Đăng ký & Đăng nhập (Thường / Google OAuth2)
│   ├── 1.2. Tìm kiếm & Lọc sản phẩm (Theo danh mục, size, màu, khoảng giá)
│   ├── 1.3. Quản lý Giỏ hàng (Thêm/Sửa số lượng/Xóa biến thể sản phẩm)
│   ├── 1.4. Đặt hàng & Thanh toán (COD / Quét mã QR PayOS)
│   ├── 1.5. Quản lý Hồ sơ cá nhân (Sổ địa chỉ giao hàng, Đổi mật khẩu)
│   ├── 1.6. Sản phẩm yêu thích (Wishlist)
│   └── 1.7. Đánh giá nhận xét sản phẩm (Viết bình luận, Chấm sao)
│
└── 2. Phân hệ Quản trị (Admin & Staff Portal)
    ├── 2.1. Quản lý Sản phẩm (CRUD, hình ảnh phụ, biến thể Size/Màu)
    ├── 2.2. Quản lý Danh mục (CRUD Category)
    ├── 2.3. Quản lý Đơn hàng (Xem, Duyệt đơn, cập nhật trạng thái vận chuyển)
    ├── 2.4. Quản lý Khách hàng (Khóa/Mở tài khoản, phân quyền)
    ├── 2.5. Quản lý Mã giảm giá (Coupons) & Banners quảng cáo
    └── 2.6. Thống kê & Báo cáo (Doanh thu, số lượng đơn, hàng tồn kho)
```

---

## PHẦN 2: MÔ TẢ CHI TIẾT CÁC CHỨC NĂNG (DETAILED FUNCTION DESCRIPTIONS)

Dưới đây là đặc tả chi tiết của từng tính năng nghiệp vụ trong sơ đồ phân rã chức năng ở trên:

### 2.1. Phân hệ Khách hàng (Storefront)

#### 1.1. Đăng ký & Đăng nhập
*   **Đăng ký tài khoản:** Khách vãng lai cung cấp đầy đủ thông tin: *Username, Password, Họ tên, Email*. Hệ thống tiến hành xác thực tính duy nhất của Username và Email trong DB, thực hiện băm mật khẩu bằng thuật toán BCrypt trước khi lưu trữ vào bảng `users`.
*   **Đăng nhập tài khoản:**
    *   *Đăng nhập thông thường:* Người dùng nhập Username/Password. Hệ thống truy vấn, giải băm mật khẩu để so sánh. Nếu đúng, cấp và trả về mã thông báo JWT.
    *   *Đăng nhập bằng Google (OAuth2):* Người dùng đăng nhập qua tài khoản Google. Hệ thống tự động trích xuất Email để tạo tài khoản mới nếu chưa tồn tại trong DB, sau đó cấp JWT Token tương ứng.
*   **Đăng xuất:** Hệ thống tiến hành xóa bỏ chuỗi JWT Token khỏi `localStorage` hoặc Cookie của trình duyệt, chuyển trạng thái người dùng về khách vãng lai và redirect về trang chủ.

#### 1.2. Tìm kiếm & Lọc sản phẩm
*   **Tìm kiếm:** Người dùng nhập từ khóa vào thanh tìm kiếm. Hệ thống thực hiện tìm kiếm toàn văn (Full-text search) trong tên sản phẩm (`product_name`) và bài mô tả (`description`) để trả về kết quả khớp nhất.
*   **Lọc sản phẩm (Filtering):** Hỗ trợ lọc động đa tiêu chí không cần tải lại trang:
    *   *Theo danh mục:* Chọn hiển thị sản phẩm thuộc Áo, Quần, Váy hoặc Phụ kiện.
    *   *Theo kích thước (Size) & Màu sắc:* Lọc các sản phẩm hiện đang còn hàng (tồn kho > 0) tương ứng với size/màu đã chọn.
    *   *Theo khoảng giá:* Nhập mức giá tối thiểu và tối đa.
    *   *Theo khuyến mãi:* Chỉ hiển thị sản phẩm có thiết lập `original_price` (giá gốc cao hơn giá bán hiện tại).

#### 1.3. Quản lý Giỏ hàng
*   **Thêm sản phẩm vào giỏ:** Từ trang chi tiết, khách hàng chọn Màu sắc, Size và nhập số lượng để thêm vào giỏ. Nếu sản phẩm biến thể đó đã tồn tại trong giỏ, hệ thống tự động cộng dồn số lượng.
*   **Cập nhật số lượng giỏ hàng:** Cho phép người dùng chỉnh sửa tăng/giảm trực tiếp số lượng từng mặt hàng. Hệ thống kiểm tra số lượng tồn kho thực tế (`quantity` trong `product_variants`) của biến thể đó để ngăn chặn trường hợp khách đặt quá số lượng có sẵn trong kho.
*   **Xóa sản phẩm khỏi giỏ:** Cho phép xóa từng mặt hàng riêng lẻ hoặc làm trống giỏ hàng (Clear Cart) hoàn toàn.

#### 1.4. Đặt hàng & Thanh toán
*   **Giao diện Checkout:** Hiển thị tóm tắt đơn hàng (tổng tiền hàng, phí ship, số tiền giảm giá từ coupon) và hiển thị danh sách địa chỉ nhận hàng của người dùng để chọn nhanh.
*   **Thanh toán COD (Nhận hàng thanh toán):** Tạo đơn hàng với trạng thái "Chờ duyệt", phương thức thanh toán là COD.
*   **Thanh toán tự động PayOS:** Hệ thống sinh mã QR ngân hàng động chứa thông tin số tiền chính xác và mã đơn hàng. Người dùng quét mã để thanh toán. Webhook của Backend nhận thông báo từ PayOS sẽ tự động chuyển đổi trạng thái đơn sang "Đã thanh toán/Đã duyệt" mà không cần admin duyệt thủ công.

#### 1.5. Quản lý Hồ sơ cá nhân
*   **Cập nhật thông tin cá nhân:** Cho phép chỉnh sửa Họ tên, Email, Số điện thoại của tài khoản.
*   **Quản lý sổ địa chỉ:** Thêm mới, chỉnh sửa thông tin người nhận/địa chỉ nhận hàng phụ và đặt địa chỉ nhận hàng mặc định (`is_default = 1`).
*   **Đổi mật khẩu:** Yêu cầu nhập mật khẩu cũ để xác minh, sau đó cập nhật mật khẩu mới (kiểm tra độ dài tối thiểu 8 ký tự để bảo mật).

#### 1.6. Sản phẩm yêu thích (Wishlist)
*   **Yêu thích sản phẩm:** Khách hàng bấm biểu tượng trái tim tại trang sản phẩm để lưu lại. Hệ thống kiểm tra và thêm cặp `user_id` và `product_id` vào bảng `wishlists`.
*   **Trang Danh sách yêu thích:** Hiển thị tất cả sản phẩm người dùng đã thích để họ dễ dàng xem lại hoặc chuyển nhanh vào giỏ hàng.

#### 1.7. Đánh giá nhận xét sản phẩm
*   **Viết đánh giá:** Khách hàng đã mua sản phẩm đó thành công (đơn hàng ở trạng thái "Đã giao") được quyền đánh giá số sao (1 đến 5 sao) và viết nội dung bình luận cảm nhận kèm thời gian đánh giá thực tế.

---

### 2.2. Phân hệ Quản trị (Admin & Staff Portal)

#### 2.1. Quản lý Sản phẩm
*   **Quản lý thông tin chung:** Thực hiện CRUD thông tin sản phẩm: Tên sản phẩm, giá bán, giá gốc, chất liệu, xuất xứ và hình ảnh đại diện chính.
*   **Quản lý các biến thể (Variants):** Định nghĩa chi tiết số lượng hàng tồn kho cho từng cặp thuộc tính Màu sắc - Size (ví dụ: Áo thun trắng size L còn 50 cái).
*   **Quản lý thư viện hình ảnh (`product_images`):** Thêm nhiều hình ảnh chụp góc cạnh chi tiết của sản phẩm, thay đổi ảnh đại diện chính, hoặc thay đổi thứ tự hiển thị của ảnh trên slide.

#### 2.2. Quản lý Danh mục
*   **CRUD danh mục:** Tạo mới danh mục sản phẩm thời trang, chỉnh sửa tên/mô tả hoặc chuyển trạng thái hiển thị (`status = 0` hoặc `1`) để ẩn/hiện danh mục trên trang Storefront.

#### 2.3. Quản lý Đơn hàng
*   **Theo dõi trạng thái:** Hiển thị danh sách toàn bộ các đơn hàng đặt mua trên hệ thống, phân loại theo trạng thái: *Chờ duyệt, Đã duyệt, Đang giao, Đã giao, Đã hủy*.
*   **Cập nhật tiến trình giao hàng:** Admin hoặc nhân viên cập nhật trạng thái đơn (duyệt đơn -> bàn giao vận chuyển -> xác nhận giao thành công). Hệ thống tự động khóa không cho sửa đổi trạng thái đơn hàng khi đơn đã ở trạng thái kết thúc (Đã giao hoặc Đã hủy).

#### 2.4. Quản lý Khách hàng
*   **Xem danh sách tài khoản:** Liệt kê toàn bộ thông tin các tài khoản trong hệ thống kèm quyền hạn và trạng thái.
*   **Khóa/Mở khóa tài khoản:** Admin có quyền thay đổi cột `status` (về 0 hoặc 1) của người dùng nhằm khóa quyền truy cập/đăng nhập của các tài khoản vi phạm chính sách hoặc spam đánh giá.

#### 2.5. Quản lý Mã giảm giá (Coupons) & Banners
*   **Quản lý Coupon:** Tạo mã giảm giá, cấu hình loại giảm (số tiền cố định hoặc % có giá trị giảm tối đa), thời gian mã có hiệu lực, số lượng mã phát hành, và giá trị đơn tối thiểu được phép áp dụng.
*   **Quản lý Banner:** Thêm mới và cấu hình các ảnh banner quảng cáo trên trang chủ, cài đặt thứ tự hiển thị và link điều hướng khi click vào banner.

#### 2.6. Thống kê & Báo cáo
*   **Báo cáo doanh thu:** Vẽ biểu đồ thống kê tổng doanh thu thực tế nhận được theo khoảng thời gian (ngày, tuần, tháng, năm).
*   **Thống kê số lượng đơn:** Báo cáo tỷ lệ số lượng đơn đặt hàng thành công và số lượng đơn bị hủy bỏ.
*   **Báo cáo hàng tồn kho:** Đưa ra danh sách cảnh báo các sản phẩm hoặc biến thể màu/size sắp hết hàng (số lượng tồn kho dưới 5 cái) để nhân viên kịp thời nhập thêm hàng.

---

## PHẦN 3: SƠ ĐỒ CA SỬ DỤNG (USE CASE DIAGRAMS)

### 3.1. Các tác nhân trong hệ thống (Actors)
*   **Khách vãng lai (Guest):** Người dùng chưa đăng nhập hệ thống. Có quyền xem sản phẩm, tìm kiếm, xem đánh giá.
*   **Khách hàng (Customer):** Người dùng đã đăng nhập. Có đầy đủ quyền mua sắm, thanh toán, quản lý giỏ hàng, viết đánh giá, quản lý địa chỉ.
*   **Nhân viên (Staff):** Người dùng thuộc ban vận hành. Có quyền duyệt đơn hàng, quản lý sản phẩm, quản lý danh mục và phản hồi đánh giá khách hàng.
*   **Quản trị viên (Admin):** Người điều hành tối cao. Có toàn quyền của nhân viên, cộng thêm quyền quản lý nhân viên, cấu hình cổng thanh toán, mã giảm giá và xem báo cáo thống kê doanh thu.

---

### 3.2. Sơ đồ Use Case tổng quát

```mermaid
useCaseDiagram
    rect "Phân hệ Khách hàng"
        usecase UC_ViewProd as "Xem sản phẩm & Tìm kiếm"
        usecase UC_Cart as "Quản lý Giỏ hàng"
        usecase UC_Auth as "Đăng ký & Đăng nhập"
        usecase UC_Checkout as "Đặt hàng & Thanh toán (PayOS)"
        usecase UC_Wishlist as "Quản lý Yêu thích"
        usecase UC_Review as "Đánh giá sản phẩm"
    end

    rect "Phân hệ Quản trị"
        usecase UC_ManageProd as "Quản lý Sản phẩm & Biến thể"
        usecase UC_ManageOrder as "Quản lý Đơn hàng & Duyệt đơn"
        usecase UC_ManageCoupon as "Quản lý Mã giảm giá"
        usecase UC_Stats as "Xem Thống kê Doanh thu"
    end

    actor "Khách vãng lai" as Guest
    actor "Khách hàng" as Customer
    actor "Nhân viên" as Staff
    actor "Quản trị viên" as Admin

    Guest --> UC_ViewProd
    Guest --> UC_Auth

    Customer --> UC_ViewProd
    Customer --> UC_Cart
    Customer --> UC_Checkout
    Customer --> UC_Wishlist
    Customer --> UC_Review

    Staff --> UC_ManageProd
    Staff --> UC_ManageOrder

    Admin --> UC_ManageProd
    Admin --> UC_ManageOrder
    Admin --> UC_ManageCoupon
    Admin --> UC_Stats
```

---

## PHẦN 4: ĐẶC TẢ CHI TIẾT CA SỬ DỤNG TRỌNG TÂM

Để thiết kế cơ sở kiểm thử và luồng xử lý code, dưới đây là đặc tả chi tiết cho 2 ca sử dụng phức tạp nhất của hệ thống:

### 4.1. Đặc tả ca sử dụng: Đặt hàng & Thanh toán trực tuyến (PayOS)

| Thuộc tính | Mô tả chi tiết |
| :--- | :--- |
| **Tên Use Case** | Đặt hàng và Thanh toán trực tuyến qua cổng PayOS |
| **Tác nhân chính** | Khách hàng (Customer) |
| **Mô tả ngắn** | Cho phép khách hàng hoàn tất đặt hàng các sản phẩm trong giỏ hàng và thanh toán trực tuyến tự động thông qua việc quét mã QR ngân hàng do cổng PayOS sinh ra. |
| **Tiền điều kiện** | 1. Người dùng đã đăng nhập vào hệ thống.<br>2. Giỏ hàng có ít nhất một sản phẩm hợp lệ.<br>3. Kết nối internet hoạt động ổn định. |
| **Hậu điều kiện** | 1. Đơn hàng được tạo thành công trong cơ sở dữ liệu với trạng thái "Đã thanh toán".<br>2. Số lượng tồn kho của các biến thể sản phẩm tương ứng bị trừ đi.<br>3. Giỏ hàng hiện tại của khách bị xóa sạch. |
| **Luồng sự kiện chính (Basic Flow)** | 1. Khách hàng vào trang Giỏ hàng và bấm **"Thanh toán"**.<br>2. Hệ thống chuyển sang giao diện Checkout, hiển thị danh sách sản phẩm, giá tiền và yêu cầu chọn địa chỉ nhận hàng.<br>3. Khách hàng chọn địa chỉ nhận hàng, chọn phương thức thanh toán **"Chuyển khoản QR qua PayOS"**, nhập mã giảm giá (nếu có) và bấm **"Đặt hàng"**.<br>4. Hệ thống kiểm tra tồn kho, áp dụng mã giảm giá, tính phí vận chuyển và tạo hóa đơn tạm thời trong cơ sở dữ liệu.<br>5. Hệ thống gọi API sang cổng PayOS để tạo link giao dịch và nhận link thanh toán.<br>6. Hệ thống chuyển hướng khách hàng sang màn hình thanh toán của PayOS hiển thị mã QR.<br>7. Khách hàng dùng ứng dụng ngân hàng quét mã QR trên màn hình điện thoại và thực hiện chuyển khoản thành công.<br>8. Cổng PayOS ghi nhận giao dịch thành công và lập tức gửi tín hiệu Webhook về API của Backend FoxStyle.<br>9. Backend verify dữ liệu, chuyển trạng thái đơn hàng thành "Đã thanh toán/Đã duyệt", và đồng thời trừ số lượng tồn kho của các biến thể trong database.<br>10. Giao diện PayOS chuyển hướng khách hàng quay lại trang "Đơn hàng của tôi" trên website FoxStyle kèm thông báo Đơn đặt hàng thành công. |
| **Luồng rẽ nhánh (Alternative / Exception Flows)** | * **Luồng 3a (Áp dụng mã giảm giá thất bại):** Hệ thống báo mã không hợp lệ, khách hàng có thể đổi mã khác hoặc tiếp tục thanh toán không dùng mã.<br>* **Luồng 4a (Sản phẩm hết hàng đột ngột):** Khi bấm Đặt hàng, hệ thống kiểm tra kho thấy có sản phẩm đã hết hàng trong lúc khách đang xem, hệ thống báo lỗi sản phẩm hết hàng và dừng giao dịch.<br>* **Luồng 7a (Khách hàng hủy thanh toán hoặc giao dịch lỗi):** Khách hàng bấm nút hủy trên trang PayOS, cổng thanh toán redirect khách hàng về lại trang Checkout của FoxStyle, đơn hàng giữ nguyên trạng thái "Chờ thanh toán/Hủy". |

---

### 4.2. Đặc tả ca sử dụng: Áp dụng mã giảm giá (Apply Coupon)

| Thuộc tính | Mô tả chi tiết |
| :--- | :--- |
| **Tên Use Case** | Áp dụng mã giảm giá (Apply Coupon Code) |
| **Tác nhân chính** | Khách hàng (Customer) |
| **Mô tả ngắn** | Khách hàng nhập mã coupon chữ để được giảm giá tiền trực tiếp vào tổng hóa đơn mua hàng. |
| **Tiền điều kiện** | 1. Người dùng đang ở màn hình checkout.<br>2. Đơn hàng đang được tính tổng tiền tạm tính. |
| **Hậu điều kiện** | Tổng giá trị đơn hàng được cập nhật giảm đi một lượng tiền tương ứng với quy định của mã giảm giá. |
| **Luồng sự kiện chính (Basic Flow)** | 1. Khách hàng nhập chuỗi mã giảm giá (ví dụ: `FOXSTYLE50`) vào ô nhập mã tại màn hình tóm tắt đơn hàng và bấm **"Áp dụng"**.<br>2. Hệ thống gửi yêu cầu kiểm tra mã lên API Backend.<br>3. Backend kiểm tra mã có tồn tại trong bảng `coupons` không, kiểm tra trạng thái hoạt động (`status = 1`), ngày có hiệu lực (`start_date` và `end_date`).<br>4. Backend kiểm tra giá trị đơn hàng tạm tính có lớn hơn hoặc bằng giá trị tối thiểu của mã yêu cầu không (`min_order_value`).<br>5. Backend kiểm tra số lượt đã dùng (`used_count`) xem đã vượt giới hạn phát hành (`usage_limit`) hay chưa.<br>6. Backend kiểm tra lịch sử của người dùng này trong bảng `user_coupons` để xác minh người dùng chưa sử dụng mã này lần nào.<br>7. Nếu tất cả điều kiện thỏa mãn, Backend tính toán số tiền được giảm giá (giảm theo số tiền cố định hoặc % có giới hạn tối đa `max_discount_value`) và trả về kết quả thành công cho Frontend.<br>8. Giao diện Frontend hiển thị số tiền được giảm giá và cập nhật lại Tổng thanh toán mới. |
| **Các ngoại lệ (Exception Flows)** | * **Mã không tồn tại hoặc hết lượt dùng/hết hạn:** Hệ thống báo lỗi: "Mã giảm giá không tồn tại hoặc đã hết hạn sử dụng".<br>* **Đơn chưa đủ giá trị tối thiểu:** Hệ thống báo lỗi: "Đơn hàng của bạn chưa đạt giá trị tối thiểu là Xđ để sử dụng mã này".<br>* **User đã từng dùng mã này:** Hệ thống báo lỗi: "Mỗi tài khoản chỉ được sử dụng mã giảm giá này một lần duy nhất". |
