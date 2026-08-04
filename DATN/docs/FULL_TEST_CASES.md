# BỘ TEST CASE ĐẦY ĐỦ HỆ THỐNG FOXSTYLE

## 1. Thông tin tài liệu

| Thuộc tính | Giá trị |
|---|---|
| Hệ thống | FoxStyle E-commerce |
| Phạm vi | Storefront, Admin Portal, REST API, phân quyền, tích hợp PayOS/Google/OTP |
| Nguồn đối chiếu | `functional_specification.md`, route React, controller/service/DTO Spring Boot, `SecurityConfig` |
| Phiên bản | 1.0 |
| Ngày lập | 30/07/2026 |
| Trạng thái | Sẵn sàng review và thực thi |

## 2. Quy ước

- Vai trò: `GUEST` = chưa đăng nhập; `CUSTOMER` = khách hàng; `STAFF` = nhân viên; `ADMIN` = quản trị viên.
- Mức ưu tiên: `P0` = chặn phát hành/an toàn dữ liệu; `P1` = nghiệp vụ chính; `P2` = chức năng phụ; `P3` = giao diện/tiện ích.
- Kết quả HTTP chuẩn: thành công `200/201/204`; dữ liệu sai `400`; chưa xác thực `401`; không đủ quyền `403`; không tìm thấy `404`.
- Với API thành công có body, kiểm tra tối thiểu: `status = success`, `message` phù hợp, `data` đúng kiểu và `timestamp` tồn tại.
- Với API phân trang, kiểm tra thêm số trang, kích thước trang, tổng phần tử và không trùng/mất bản ghi giữa các trang.
- Các test thay đổi dữ liệu phải kiểm tra đồng thời giao diện, response API và dữ liệu liên quan sau khi tải lại.

## 3. Dữ liệu và tiền điều kiện chuẩn

| Mã | Dữ liệu |
|---|---|
| U01 | Customer hoạt động: `customer01`, email hợp lệ, có JWT |
| U02 | Customer khác: `customer02`, có JWT |
| U03 | Staff hoạt động, có JWT |
| U04 | Admin hoạt động, có JWT |
| U05 | Customer bị khóa, `status=0` |
| P01 | Sản phẩm hoạt động; biến thể V01 màu Đen, size M, tồn kho 10, giá 200.000đ |
| P02 | Sản phẩm hoạt động; biến thể V02 hết hàng |
| P03 | Sản phẩm ẩn, `status=0` |
| C01 | Coupon tiền cố định còn hiệu lực, min order 300.000đ, còn lượt dùng |
| C02 | Coupon phần trăm 10%, giảm tối đa 100.000đ, còn hiệu lực |
| C03 | Coupon hết hạn |
| C04 | Coupon hết lượt dùng |
| A01 | Địa chỉ mặc định thuộc U01 |
| O01 | Đơn U01 trạng thái PENDING |
| O02 | Đơn U01 trạng thái DELIVERED |
| O03 | Đơn thuộc U02 |

## 4. Test case chức năng

### 4.1. Điều hướng, giao diện chung và khả năng tương thích

| ID | Pri | Tiền điều kiện / Dữ liệu | Bước thực hiện | Kết quả mong đợi |
|---|---|---|---|---|
| NAV-001 | P1 | Không | 1. Mở `/`.<br>2. Chờ tải hoàn tất. | Trang chủ hiển thị header, nội dung chính, footer; không có lỗi console nghiêm trọng; API công khai không trả 401. |
| NAV-002 | P1 | Không | Mở lần lượt `/products`, `/products/{id}`, `/about`, `/contact`. | Đúng trang tương ứng; URL và nội dung đồng bộ; refresh trực tiếp không trả 404 từ web server. |
| NAV-003 | P1 | U01 | Mở `/cart`, `/checkout`, `/account`, `/orders`, `/wishlist`. | Người đã đăng nhập truy cập được; dữ liệu thuộc đúng U01. |
| NAV-004 | P0 | GUEST | Mở trực tiếp `/checkout`, `/account`, `/orders`, `/wishlist`. | Chuyển đến đăng nhập hoặc hiển thị yêu cầu đăng nhập; không lộ dữ liệu người dùng trước. |
| NAV-005 | P0 | CUSTOMER | Mở trực tiếp `/admin` và từng route admin. | Bị chặn/chuyển hướng; không hiển thị dữ liệu quản trị dù gọi URL trực tiếp. |
| NAV-006 | P1 | U03/U04 | Mở `/admin` và các menu được cấp quyền. | Layout admin tải đúng; menu và thao tác đúng vai trò. |
| NAV-007 | P2 | Không | Nhập một URL không tồn tại. | Hiển thị trang lỗi/404 thân thiện, có nút về trang chủ; không lộ stack trace hoặc thông tin máy chủ. |
| NAV-008 | P2 | Giả lập lazy-load lỗi | Ngắt mạng khi chuyển trang lazy-load, sau đó bấm “Tải lại trang”. | Error boundary hiển thị; nút tải lại hoạt động; không tạo vòng lặp vô hạn. |
| NAV-009 | P2 | Không | Thay đổi kích thước 320px, 768px, 1024px, 1440px. | Không tràn ngang; menu, bảng, modal và form vẫn dùng được; nội dung quan trọng không bị che. |
| NAV-010 | P2 | Không | Dùng bàn phím Tab/Shift+Tab/Enter/Escape qua header, form, modal. | Thứ tự focus hợp lý, nhìn thấy focus, kích hoạt/đóng được thành phần; không mắc kẹt bàn phím. |
| NAV-011 | P3 | Không | Kiểm tra Chrome, Edge, Firefox phiên bản hiện hành. | Luồng chính và bố cục hoạt động nhất quán. |
| NAV-012 | P2 | U01 | Chuyển theme/ngôn ngữ, tải lại và đăng nhập lại. | Cài đặt được lưu và áp dụng nhất quán; không làm mất phiên đăng nhập. |

### 4.2. Đăng ký, OTP, đăng nhập và khôi phục mật khẩu

| ID | Pri | Tiền điều kiện / Dữ liệu | Bước thực hiện | Kết quả mong đợi |
|---|---|---|---|---|
| AUTH-001 | P0 | Email/username mới, OTP hợp lệ | 1. Mở đăng ký.<br>2. Nhập username 4–50 ký tự, password 6–100, họ tên, email, phone hợp lệ.<br>3. Nhập OTP và gửi. | Tạo customer `status=1`, role CUSTOMER; mật khẩu không lưu dạng rõ; HTTP 201; có thể đăng nhập. |
| AUTH-002 | P1 | Không | Bỏ trống lần lượt username, password, họ tên, email, OTP rồi gửi. | Không tạo tài khoản; hiển thị đúng lỗi bắt buộc tại trường; API 400. |
| AUTH-003 | P1 | Không | Thử username dài 3, 4, 50, 51 ký tự. | 3 và 51 bị từ chối; 4 và 50 được chấp nhận nếu dữ liệu khác hợp lệ. |
| AUTH-004 | P1 | Không | Thử password dài 5, 6, 100, 101 ký tự. | Theo code hiện tại: 5/101 bị từ chối; 6/100 hợp lệ. Ghi defect nếu BA chốt tối thiểu 8. |
| AUTH-005 | P1 | Username đã tồn tại | Đăng ký bằng username cũ với email mới. | HTTP 400; thông báo username đã tồn tại; không tạo bản ghi mới. |
| AUTH-006 | P1 | Email đã tồn tại | Đăng ký bằng email cũ với username mới. | HTTP 400; thông báo email đã sử dụng; không tạo bản ghi mới. |
| AUTH-007 | P1 | Không | Nhập email sai định dạng: thiếu `@`, thiếu domain, có khoảng trắng sai vị trí. | Bị từ chối; lỗi định dạng email; không gửi OTP/không đăng ký. |
| AUTH-008 | P1 | Không | Thử phone rỗng, `0912345678`, `+84912345678`, chữ, quá ngắn, quá dài. | Rỗng và hai số hợp lệ được chấp nhận; dữ liệu sai regex bị từ chối. |
| AUTH-009 | P0 | OTP hết hạn/sai/đã dùng | Gửi đăng ký với từng OTP. | HTTP 400; không tạo user; OTP đã dùng không thể tái sử dụng. |
| AUTH-010 | P1 | Email hợp lệ | Gửi OTP hai lần liên tiếp và vượt giới hạn dự kiến. | Có kiểm soát resend/rate limit; mã mới làm mã cũ hết hiệu lực; không trả OTP trong response production. |
| AUTH-011 | P0 | U01 | Đăng nhập bằng username và password đúng. | HTTP 200; trả JWT và đúng user/role; chuyển trang phù hợp; token dùng gọi `/auth/me` được. |
| AUTH-012 | P1 | U01 | Đăng nhập bằng email và password đúng. | Đăng nhập thành công như username. |
| AUTH-013 | P0 | U01 | Nhập sai mật khẩu 1–4 lần. | Mỗi lần bị từ chối; chưa khóa trước lần 5; không cấp token. |
| AUTH-014 | P0 | U01 | Nhập sai mật khẩu lần thứ 5. | Tài khoản chuyển `status=0`; thông báo đã khóa; lần đăng nhập đúng sau đó vẫn bị từ chối. |
| AUTH-015 | P1 | U01 có 1–4 lần sai | Đăng nhập đúng trước lần sai thứ 5, sau đó sai lại một lần. | Bộ đếm sai được đặt lại 0; lần sai mới được tính là 1. |
| AUTH-016 | P0 | U05 | Đăng nhập bằng thông tin đúng. | HTTP 401/403 phù hợp; không cấp JWT; thông báo tài khoản bị khóa. |
| AUTH-017 | P1 | Không | Gửi username/password rỗng hoặc chỉ khoảng trắng. | HTTP 400; thông báo bắt buộc; không tăng sai cho một user không xác định. |
| AUTH-018 | P0 | Token giả/hết hạn | Gọi endpoint cần xác thực. | HTTP 401; không trả dữ liệu; frontend xóa phiên và yêu cầu đăng nhập lại. |
| AUTH-019 | P0 | U01 | Đăng xuất, dùng nút Back và gọi lại API bằng token đã xóa ở client. | UI về guest, dữ liệu nhạy cảm không còn trên màn hình/cache; client không gửi token cũ. |
| AUTH-020 | P1 | Google token hợp lệ, email mới | Đăng nhập Google. | Tạo CUSTOMER mới duy nhất, username không trùng, cấp JWT, HTTP 200. |
| AUTH-021 | P1 | Google token hợp lệ, email đã tồn tại | Đăng nhập Google. | Dùng đúng tài khoản hiện có; không tạo bản ghi trùng; cấp JWT đúng role. |
| AUTH-022 | P0 | Token Google giả/hết hạn | Gọi `/auth/google`. | HTTP 400; không tạo user/không cấp JWT; không lộ chi tiết xác thực nhạy cảm. |
| AUTH-023 | P0 | Không | Gọi công khai `/auth/register-staff` với dữ liệu/OTP hợp lệ. | Kỳ vọng bảo mật: GUEST không được tự tạo STAFF. Nếu HTTP 201 thì ghi defect P0 vì route hiện đang `permitAll`. |
| AUTH-024 | P1 | U01 | Gọi `/auth/me`. | Trả đúng U01, không chứa password/hash/OTP. |
| AUTH-025 | P0 | GUEST | Gọi `/auth/me`, `/deactivate`, `/delete-account` không token. | HTTP 401; không thay đổi dữ liệu. |
| AUTH-026 | P1 | U01 | Tìm tài khoản quên mật khẩu bằng username, email, phone đúng. | Trả username/họ tên và email/phone đã che; không lộ đầy đủ thông tin nhạy cảm. |
| AUTH-027 | P1 | Dữ liệu không tồn tại/rỗng | Tìm tài khoản. | HTTP 400/404; thông báo phù hợp; không liệt kê tài khoản gần giống. |
| AUTH-028 | P0 | Email U01 | Gửi OTP quên mật khẩu; nhập OTP đúng và password mới >=6. | Reset thành công; password cũ thất bại, password mới đăng nhập được; failed-attempt reset 0. |
| AUTH-029 | P0 | U01 | Reset với OTP sai/hết hạn/đã dùng hoặc email không khớp OTP. | HTTP 400; mật khẩu không đổi; không thể dò OTP bằng response khác biệt quá mức. |
| AUTH-030 | P1 | U01 | Reset với password 5 và 6 ký tự. | Theo code: 5 bị từ chối, 6 được nhận; ghi defect nếu yêu cầu chính thức là 8 ký tự. |
| AUTH-031 | P0 | U04 username `admin_fox` | Gọi tự khóa và tự xóa. | HTTP 400; tài khoản quản trị hệ thống không đổi. |
| AUTH-032 | P0 | U01 | Gọi xóa tài khoản. | Soft-delete: status 0, tên/email/phone/password được ẩn/xóa; đơn hàng còn toàn vẹn; không đăng nhập lại được. |
| AUTH-033 | P0 | GUEST | Gọi `POST /auth/repair-db`. | Kỳ vọng bị cấm. Nếu thực thi được, ghi defect P0 vì endpoint bảo trì hiện nằm dưới `/auth/**` công khai. |

### 4.3. Danh sách và chi tiết sản phẩm

| ID | Pri | Tiền điều kiện / Dữ liệu | Bước thực hiện | Kết quả mong đợi |
|---|---|---|---|---|
| PROD-001 | P1 | Có nhiều sản phẩm | Mở `/products`. | Chỉ sản phẩm được phép bán hiển thị; ảnh, tên, giá, trạng thái tồn kho đúng. |
| PROD-002 | P1 | Từ khóa khớp tên | Tìm bằng toàn bộ/một phần tên, khác hoa thường, có khoảng trắng đầu cuối. | Kết quả đúng, từ khóa được trim; không phân biệt hoa thường theo yêu cầu. |
| PROD-003 | P2 | Từ khóa khớp mô tả | Tìm từ khóa chỉ có trong mô tả. | Trả đúng sản phẩm theo đặc tả full-text. |
| PROD-004 | P1 | Không | Tìm từ khóa không tồn tại và chuỗi ký tự đặc biệt. | Hiển thị trạng thái rỗng thân thiện; không lỗi SQL/XSS. |
| PROD-005 | P1 | Có nhiều danh mục | Lọc từng danh mục và bỏ lọc. | Chỉ sản phẩm thuộc danh mục; bỏ lọc phục hồi danh sách. |
| PROD-006 | P1 | P01/V01 | Lọc màu và size có hàng. | Chỉ sản phẩm có biến thể khớp và tồn >0. |
| PROD-007 | P1 | P02 | Lọc biến thể hết hàng. | Không trả sản phẩm như “còn hàng”; trạng thái hết hàng đúng. |
| PROD-008 | P1 | Có giá biên | Lọc min=max; min nhỏ hơn max; min=0. | Kết quả bao gồm đúng giá biên và không có giá ngoài khoảng. |
| PROD-009 | P1 | Không | Nhập min âm, max âm, min>max, chữ, số quá lớn. | Validation rõ ràng; không gửi query sai hoặc API 400; danh sách không hỏng. |
| PROD-010 | P2 | Có sản phẩm giảm giá | Bật lọc khuyến mãi. | Chỉ sản phẩm có originalPrice > price; phần trăm/giá hiển thị tính đúng. |
| PROD-011 | P1 | Có nhiều trang | Chuyển trang, thay page size, dùng Back. | Đúng số phần tử; không trùng/mất; giữ bộ lọc/từ khóa hợp lý. |
| PROD-012 | P2 | Có nhiều giá/tên | Sắp xếp giá tăng/giảm, mới nhất/tên nếu có. | Thứ tự đúng và ổn định qua phân trang. |
| PROD-013 | P1 | P01 | Mở chi tiết. | Đúng thông tin, gallery, giá, mô tả, biến thể và đánh giá; không lộ sản phẩm khác. |
| PROD-014 | P1 | ID không tồn tại/sai kiểu | Mở `/products/{id}`. | 404/empty state thân thiện; không crash hoặc lộ stack trace. |
| PROD-015 | P0 | P03 | GUEST truy cập trực tiếp chi tiết sản phẩm ẩn. | Kỳ vọng không thể mua; 404 hoặc trạng thái không hoạt động rõ ràng. |
| PROD-016 | P2 | Ảnh lỗi/rỗng | Mở danh sách/chi tiết. | Ảnh fallback hiển thị; bố cục không vỡ. |
| PROD-017 | P1 | P01 | Chọn lần lượt màu/size. | Giá, ảnh, SKU, tồn kho cập nhật đúng biến thể; không giữ tổ hợp không tồn tại. |
| PROD-018 | P0 | Dữ liệu có HTML/script | Hiển thị tên/mô tả/review. | Nội dung được escape/sanitize; script không chạy. |

### 4.4. Giỏ hàng

| ID | Pri | Tiền điều kiện / Dữ liệu | Bước thực hiện | Kết quả mong đợi |
|---|---|---|---|---|
| CART-001 | P0 | U01, V01 tồn 10 | Chọn V01, số lượng 1, thêm vào giỏ. | Tạo dòng giỏ đúng variant/giá/số lượng; tổng tiền 200.000đ; HTTP thành công. |
| CART-002 | P1 | U01, V01 đã có qty 2 | Thêm tiếp V01 qty 3. | Không tạo dòng trùng; qty thành 5; tổng tiền tính lại. |
| CART-003 | P1 | U01 | Thêm hai variant khác nhau cùng sản phẩm. | Tạo hai dòng riêng, thuộc tính đúng từng variant. |
| CART-004 | P1 | U01 | Thêm khi chưa chọn màu/size. | UI chặn và báo trường cần chọn; không tạo dòng. |
| CART-005 | P0 | V01 tồn 10 | Thêm qty 10 rồi thêm 1. | Lần đầu thành công; lần sau bị từ chối, qty vẫn 10. |
| CART-006 | P0 | V02 tồn 0 | Thêm V02. | Bị từ chối; không tạo dòng giỏ. |
| CART-007 | P1 | U01 | Gửi qty 0, âm, null, chữ qua UI/API. | HTTP 400/validation; giỏ không đổi. |
| CART-008 | P1 | U01 | Gửi variantId không tồn tại. | HTTP 404; không tạo dòng. |
| CART-009 | P0 | GUEST | Gọi mọi API `/carts/**`. | HTTP 401; không tạo giỏ mồ côi. |
| CART-010 | P1 | U01 có dòng qty 2 | Tăng/giảm qty trong giới hạn. | Qty và tổng dòng/tổng giỏ cập nhật chính xác sau mỗi thao tác. |
| CART-011 | P0 | U01 có dòng, tồn bị giảm phía admin | Cập nhật qty vượt tồn mới. | Bị từ chối và hiển thị số tồn hiện tại; giá trị cũ không đổi. |
| CART-012 | P1 | U01 có dòng | Cập nhật qty về 0. | Theo API hiện tại phải bị từ chối; UI có thể yêu cầu dùng Xóa; không âm tồn. |
| CART-013 | P1 | U01 có dòng | Xóa một dòng và xác nhận. | Chỉ dòng được chọn bị xóa; tổng tiền cập nhật; reload vẫn đã xóa. |
| CART-014 | P1 | U01 có nhiều dòng | Clear cart và xác nhận. | Tất cả dòng U01 bị xóa; giỏ U02 không ảnh hưởng. |
| CART-015 | P0 | U01/U02 có giỏ | U01 sửa/xóa `detailId` thuộc U02 qua API. | HTTP 400/403/404; giỏ U02 giữ nguyên. |
| CART-016 | P1 | U01, giá variant khác giá product | Xem giỏ. | Dùng đúng giá variant; tổng = tổng(price × qty), làm tròn/định dạng VND đúng. |
| CART-017 | P1 | U01 có giỏ | Đăng xuất/đăng nhập lại trên thiết bị khác. | Giỏ server của U01 được giữ và không lẫn guest/U02. |
| CART-018 | P0 | Hai request đồng thời, tồn giới hạn | Gửi đồng thời cập nhật/thêm vượt tổng tồn. | Không để qty giỏ hoặc tồn sau checkout vượt giới hạn; lỗi nhất quán. |

### 4.5. Địa chỉ và hồ sơ tài khoản

| ID | Pri | Tiền điều kiện / Dữ liệu | Bước thực hiện | Kết quả mong đợi |
|---|---|---|---|---|
| ACC-001 | P1 | U01 | Mở tài khoản. | Hiển thị đúng họ tên, email, phone, theme/language; không có password. |
| ACC-002 | P1 | U01 | Cập nhật thông tin hợp lệ nếu UI/API hỗ trợ. | Lưu thành công; header và `/auth/me` đồng bộ sau reload. |
| ACC-003 | P1 | U01 | Nhập email/phone sai, dữ liệu quá dài, chỉ khoảng trắng. | Validation; không ghi dữ liệu sai. |
| ADDR-001 | P1 | U01 chưa có địa chỉ | Tạo địa chỉ với đủ 6 trường bắt buộc. | HTTP 201; địa chỉ thuộc U01; hiển thị trong checkout. |
| ADDR-002 | P1 | U01 | Bỏ trống lần lượt người nhận, phone, tỉnh, huyện, xã, chi tiết. | HTTP 400; báo đúng trường; không tạo địa chỉ. |
| ADDR-003 | P1 | U01 | Tạo địa chỉ đầu tiên với `isDefault` null/false. | Kiểm tra quy tắc mặc định; hệ thống nên bảo đảm có địa chỉ mặc định hoặc hiển thị rõ chưa có. |
| ADDR-004 | P1 | U01 có A01 mặc định | Tạo địa chỉ mới `isDefault=true`. | Địa chỉ mới thành mặc định; A01 tự bỏ mặc định; chỉ một mặc định. |
| ADDR-005 | P1 | U01 có 2 địa chỉ | Sửa địa chỉ phụ thành mặc định. | Cập nhật đúng nội dung; địa chỉ cũ không còn mặc định. |
| ADDR-006 | P1 | U01 | Sửa địa chỉ hợp lệ nhưng `isDefault=null`. | Giữ trạng thái mặc định cũ; không tự đổi ngoài ý muốn. |
| ADDR-007 | P1 | U01 | Xóa địa chỉ phụ. | Chỉ địa chỉ đó bị xóa; danh sách/checkout cập nhật. |
| ADDR-008 | P0 | U01/U02 | U01 đọc/sửa/xóa addressId của U02. | HTTP 404/403; dữ liệu U02 không lộ và không đổi. |
| ADDR-009 | P1 | GUEST | Gọi `/addresses`. | HTTP 401. |
| ADDR-010 | P1 | U01 có địa chỉ được đơn cũ tham chiếu | Xóa địa chỉ. | Không làm mất địa chỉ giao hàng đã chụp trong đơn cũ; xử lý FK an toàn. |

### 4.6. Wishlist và đánh giá

| ID | Pri | Tiền điều kiện / Dữ liệu | Bước thực hiện | Kết quả mong đợi |
|---|---|---|---|---|
| WISH-001 | P1 | U01, P01 chưa thích | Bấm tim/thêm P01. | Tạo đúng cặp U01-P01; trạng thái tim và danh sách đồng bộ. |
| WISH-002 | P1 | U01 đã thích P01 | Thêm lại P01 nhiều lần. | Không tạo bản ghi trùng; UI giữ trạng thái đã thích. |
| WISH-003 | P1 | U01 đã thích P01 | Xóa P01 khỏi wishlist. | Chỉ bản ghi U01-P01 bị xóa; reload đồng bộ. |
| WISH-004 | P1 | GUEST | Bấm thích hoặc gọi API. | Yêu cầu đăng nhập/HTTP 401; không tạo dữ liệu. |
| WISH-005 | P1 | U01 | Thêm/xóa productId không tồn tại. | 404 phù hợp; wishlist không đổi. |
| WISH-006 | P0 | U01/U02 | Kiểm tra danh sách mỗi user. | Mỗi user chỉ thấy wishlist của mình. |
| REV-001 | P1 | P01 có review | GUEST mở chi tiết P01. | Xem được review, tên hiển thị phù hợp, rating/date đúng; phân trang đúng. |
| REV-002 | P0 | U01 đã mua P01 và O02 DELIVERED | Tạo review rating 1–5 và comment hợp lệ. | Tạo review thuộc U01/P01; điểm trung bình cập nhật; không cho giả user. |
| REV-003 | P0 | U01 chưa mua P01 | Gọi tạo review. | Theo đặc tả phải bị từ chối. Nếu tạo được, ghi defect P0. |
| REV-004 | P0 | U01 có đơn PENDING/SHIPPING chứa P01 | Tạo review. | Bị từ chối cho đến DELIVERED. |
| REV-005 | P1 | U01 | Gửi rating null, -1, 0, 1, 5, 6. | null/-1/6 bị từ chối; 1/5 hợp lệ; 0 phải bị từ chối theo nghiệp vụ. Nếu API nhận 0, ghi defect do DTO đang `@Min(0)`. |
| REV-006 | P1 | U01 đã review P01 | Tạo review lần hai. | Theo quy tắc một review/user/product: bị từ chối hoặc cập nhật bản cũ; không tạo trùng. |
| REV-007 | P0 | U01/U02 có review | U02 sửa/xóa review của U01. | HTTP 403/404; review U01 không đổi. |
| REV-008 | P1 | U01 có review | U01 sửa rating/comment hợp lệ. | Cập nhật đúng review; điểm trung bình tính lại. |
| REV-009 | P1 | U01 có review | U01 xóa review. | Review biến mất; điểm trung bình/số review tính lại. |
| REV-010 | P0 | Comment chứa script/HTML/SQL-like | Tạo và hiển thị review. | Script không chạy; dữ liệu được escape; truy vấn không bị tác động. |
| REV-011 | P1 | STAFF/ADMIN | Mở danh sách review admin với filter/phân trang. | Xem đúng tất cả review và metadata; CUSTOMER/GUEST không truy cập API admin. |

### 4.7. Coupon và newsletter

| ID | Pri | Tiền điều kiện / Dữ liệu | Bước thực hiện | Kết quả mong đợi |
|---|---|---|---|---|
| CPV-001 | P0 | U01, subtotal >= min, C01 | Validate C01. | Hợp lệ; giảm đúng số tiền cố định; tổng không âm. |
| CPV-002 | P0 | U01, C02, subtotal 2.000.000đ | Validate C02. | 10%=200.000 nhưng giảm bị chặn ở 100.000đ. |
| CPV-003 | P1 | U01, subtotal dưới min | Validate C01. | Bị từ chối; nêu giá trị đơn tối thiểu; tổng không đổi. |
| CPV-004 | P1 | C03 | Validate coupon hết hạn/trước ngày bắt đầu. | Bị từ chối; không áp dụng. |
| CPV-005 | P1 | Coupon status 0 | Validate. | Bị từ chối. |
| CPV-006 | P0 | C04 | Validate. | Bị từ chối vì hết lượt; usedCount không vượt usageLimit. |
| CPV-007 | P0 | U01 đã dùng C01 | Dùng lại trong đơn khác. | Bị từ chối nếu giới hạn một lần/user; không tăng usedCount. |
| CPV-008 | P1 | Coupon chỉ áp dụng danh mục/sản phẩm | Dùng với giỏ không khớp, khớp một phần, khớp toàn bộ. | Chỉ mặt hàng/phạm vi hợp lệ được tính theo quy tắc; số giảm chính xác. |
| CPV-009 | P1 | Coupon theo loại thành viên | Dùng bằng user mới/cũ không đúng đối tượng. | Chỉ đúng nhóm được áp dụng. |
| CPV-010 | P1 | Không | Nhập mã khác hoa thường, có khoảng trắng, không tồn tại, rỗng. | Trim/chuẩn hóa theo quy định; mã sai báo rõ; không crash. |
| CPV-011 | P0 | Nhiều request đồng thời, còn 1 lượt | Hai user checkout đồng thời. | Chỉ một lần sử dụng thành công; không vượt giới hạn. |
| CPV-012 | P0 | Coupon hợp lệ lúc validate | Admin vô hiệu/hết lượt trước checkout. | Checkout kiểm tra lại và từ chối/không áp coupon; không tin dữ liệu client. |
| NEWS-001 | P2 | Email mới hợp lệ | Đăng ký newsletter. | Lưu một subscription; phản hồi thành công; không trả coupon/secret ngoài quy định. |
| NEWS-002 | P2 | Email đã đăng ký | Đăng ký lại. | Không tạo trùng; thông báo đã đăng ký hoặc idempotent. |
| NEWS-003 | P1 | Email sai/rỗng | Đăng ký. | HTTP 400; không lưu. |

### 4.8. Checkout và đơn hàng

| ID | Pri | Tiền điều kiện / Dữ liệu | Bước thực hiện | Kết quả mong đợi |
|---|---|---|---|---|
| CHK-001 | P0 | U01, giỏ hợp lệ, A01 | Checkout COD với đủ người nhận, phone, địa chỉ, items. | HTTP 201; tạo một đơn PENDING, payment method COD; chi tiết/giá chụp đúng; tổng đúng. |
| CHK-002 | P0 | U01 | Bỏ trống từng trường recipientName/Phone/shippingAddress/paymentMethod/items. | HTTP 400; không tạo order/payment; giỏ và tồn không đổi. |
| CHK-003 | P0 | U01, items rỗng/null | Checkout. | HTTP 400; không tạo đơn. |
| CHK-004 | P0 | U01 gửi item V01 qty 0/âm/null | Checkout qua API. | HTTP 400; không tạo đơn; không thay đổi tồn. |
| CHK-005 | P0 | U01 gửi variant không tồn tại/ẩn/hết hàng | Checkout. | 400/404; rollback toàn bộ. |
| CHK-006 | P0 | V01 tồn 10 | Checkout qty 11. | Bị từ chối; tồn vẫn 10; không có đơn dở dang. |
| CHK-007 | P0 | Giá/tổng/phí giả từ client | Sửa request shippingFee âm, isPaid=true, giá/tổng ở client. | Server không tin quyền thanh toán/giá client; tổng và paid tính phía server; phí âm bị từ chối. |
| CHK-008 | P0 | U01 gửi item không nằm trong giỏ hoặc giỏ U02 | Checkout. | Áp quy tắc server; tuyệt đối không lấy/xóa giỏ U02; không mua bằng dữ liệu không được phép nếu yêu cầu checkout từ giỏ. |
| CHK-009 | P0 | Nhiều items, một item thiếu tồn | Checkout. | Transaction rollback: không tạo đơn/payment, không trừ bất kỳ item nào, coupon không tăng lượt. |
| CHK-010 | P0 | C01 hợp lệ | Checkout với coupon. | Server validate lại; discount và grand total đúng; đánh dấu sử dụng đúng một lần khi đơn được tạo theo quy tắc. |
| CHK-011 | P0 | Coupon sai | Checkout. | Không tạo đơn với số tiền giảm giả; trả lỗi rõ hoặc bỏ coupon theo đặc tả đã chốt. |
| CHK-012 | P0 | Hai user, V01 chỉ đủ một đơn | Checkout đồng thời. | Chỉ số đơn phù hợp tồn thành công; tồn không âm; request còn lại báo hết hàng. |
| CHK-013 | P1 | Double-click nút đặt hàng | Nhấn hai lần nhanh/gửi lại cùng request. | Chỉ tạo một đơn hoặc có idempotency; không trừ tồn/usedCount hai lần. |
| CHK-014 | P0 | Lỗi DB ở bước giữa | Giả lập lỗi sau khi tạo header trước detail/payment. | Rollback toàn bộ; không có order mồ côi hoặc tồn/coupon lệch. |
| ORD-001 | P1 | U01 có nhiều đơn | Mở `/orders`, phân trang. | Chỉ đơn U01; trạng thái, tổng, ngày, items đúng; mới nhất theo quy định. |
| ORD-002 | P0 | U01/U02 | U01 gọi chi tiết O03. | HTTP 403/404; không lộ tên, địa chỉ, phone, payment của U02. |
| ORD-003 | P1 | U04 | Admin xem mọi đơn và lọc từng trạng thái 0–5. | Danh sách đúng filter, kể cả RETURNED=5; tổng/phân trang đúng. |
| ORD-004 | P1 | U03 | Staff xem chi tiết đơn. | Được phép theo vai trò vận hành. Nếu bị chặn, ghi defect: controller chỉ nhận `ROLE_ADMIN` là staff khi kiểm ownership. |
| ORD-005 | P0 | GUEST/CUSTOMER | Gọi GET all orders. | 401/403; không lộ danh sách. |
| ORD-006 | P0 | O01 thuộc U01 | U01 hủy với lý do hợp lệ. | Chuyển CANCELLED; lưu lý do; hoàn tồn/coupon/payment đúng quy tắc; không hủy lần hai. |
| ORD-007 | P0 | Đơn PROCESSING/SHIPPING/DELIVERED | Customer thử hủy. | Chỉ trạng thái được phép mới hủy; trạng thái khác bị từ chối, dữ liệu không đổi. |
| ORD-008 | P0 | O03 thuộc U02 | U01 gọi cancel/return O03. | 403/404; O03 không đổi. |
| ORD-009 | P1 | O02 DELIVERED | U01 gửi yêu cầu return với lý do. | Chuyển RETURNED hoặc tạo yêu cầu theo code; lưu lý do; lịch sử rõ ràng. |
| ORD-010 | P1 | Đơn chưa giao/đã quá hạn đổi trả | Gửi return. | Bị từ chối theo chính sách; không đổi trạng thái. |
| ORD-011 | P1 | U03/U04, O01 | Cập nhật PENDING→PROCESSING→SHIPPING→DELIVERED. | Chỉ chuyển hợp lệ; timestamp/lịch sử tương ứng cập nhật. |
| ORD-012 | P0 | Đơn DELIVERED/CANCELLED | Thử cập nhật sang trạng thái khác. | Bị khóa theo đặc tả; không thay đổi đơn/tồn/payment. |
| ORD-013 | P0 | CUSTOMER | Gọi API update status/dispatch/shipping fee. | HTTP 403. |
| ORD-014 | P1 | U03/U04, đơn hợp lệ | Dispatch với carrier hỗ trợ. | Đẩy thành công, lưu carrier/tracking nếu có, trạng thái đúng; retry không tạo shipment trùng. |
| ORD-015 | P1 | Carrier rỗng/không hỗ trợ | Dispatch. | HTTP 400; đơn không đổi. |
| ORD-016 | P0 | U03/U04 | Cập nhật phí ship =0, số dương, số âm, quá lớn. | 0/dương theo quy định; âm/quá giới hạn bị từ chối; tổng đơn tính lại nhất quán. |
| ORD-017 | P0 | Đơn đã thanh toán | Sửa phí/tổng/trạng thái. | Không làm sai số tiền payment/reconciliation; thay đổi nhạy cảm có kiểm soát/audit. |

### 4.9. PayOS và thanh toán

| ID | Pri | Tiền điều kiện / Dữ liệu | Bước thực hiện | Kết quả mong đợi |
|---|---|---|---|---|
| PAY-001 | P0 | U01, đơn PayOS hợp lệ | Tạo payment link. | Link/orderCode duy nhất; amount bằng tổng server; return/cancel URL đúng; không lộ secret. |
| PAY-002 | P0 | orderId không tồn tại/không thuộc user | Tạo link. | 404/403; không tạo payment. |
| PAY-003 | P0 | Đơn COD/đã thanh toán/đã hủy | Yêu cầu link PayOS. | Bị từ chối hoặc idempotent đúng; không tạo giao dịch trùng. |
| PAY-004 | P0 | PayOS timeout/5xx | Tạo link. | Hiển thị lỗi có thể thử lại; trạng thái đơn/payment không bị đánh dấu paid; không tạo dữ liệu mồ côi. |
| PAY-005 | P0 | Webhook hợp lệ, thanh toán thành công | Gửi webhook chữ ký đúng. | Xác minh chữ ký; đúng orderCode/amount; payment SUCCESS và đơn cập nhật đúng đúng một lần. |
| PAY-006 | P0 | Webhook chữ ký sai/thiếu | Gửi webhook. | HTTP từ chối; không thay đổi payment/order/tồn/coupon. |
| PAY-007 | P0 | Webhook amount/orderCode sai | Gửi webhook có chữ ký/dữ liệu không khớp. | Không đánh dấu paid; ghi reconciliation/lỗi để xử lý. |
| PAY-008 | P0 | Cùng webhook hợp lệ | Gửi lặp 2–5 lần. | Idempotent; không trừ tồn, tăng coupon hay tạo payment nhiều lần. |
| PAY-009 | P0 | Webhook đến trước/sau redirect | Hoàn tất thanh toán và mở return URL ở các thứ tự. | Trạng thái cuối nhất quán; frontend poll/check status đúng; không phụ thuộc redirect để xác nhận tiền. |
| PAY-010 | P0 | Thanh toán bị hủy/hết hạn | Hủy trên PayOS/quá thời gian. | Payment/đơn chuyển trạng thái theo quy tắc; không đánh dấu paid; tồn được xử lý nhất quán. |
| PAY-011 | P1 | orderCode hợp lệ/không tồn tại | Gọi check-status. | Trả đúng trạng thái; mã không tồn tại không lộ thông tin đơn khác. |
| PAY-012 | P0 | GUEST | Gọi `/payments/order/{orderId}` của U01. | Kỳ vọng bị 401; người dùng đăng nhập khác cũng không được xem payment không thuộc mình. |
| PAY-013 | P0 | CUSTOMER/STAFF | Gọi list/update status/reconciliation admin. | CUSTOMER/STAFF bị 403 theo controller; chỉ ADMIN được phép. |
| PAY-014 | P1 | ADMIN | Cập nhật reconciliation với dữ liệu hợp lệ và lặp lại. | Lưu đúng trạng thái/audit, idempotent; không tự thay đổi doanh thu sai. |

### 4.10. Quản trị sản phẩm, danh mục, banner

| ID | Pri | Tiền điều kiện / Dữ liệu | Bước thực hiện | Kết quả mong đợi |
|---|---|---|---|---|
| AP-001 | P1 | ADMIN | Tạo product đầy đủ, ít nhất một variant và ảnh. | HTTP 201; product/variant/image liên kết đúng; hiển thị storefront nếu status=1. |
| AP-002 | P1 | ADMIN | Bỏ categoryId/name/price; name 151; price âm; status -1/2. | HTTP 400 từng trường; không tạo một phần. |
| AP-003 | P1 | ADMIN | Tạo name 150, price 0, status 0/1. | Biên hợp lệ theo DTO; status 0 không xuất hiện storefront. |
| AP-004 | P0 | ADMIN | Tạo variant thiếu color/size/qty/price; qty âm; price 0. | HTTP 400; rollback cả product; không có variant mồ côi. |
| AP-005 | P1 | ADMIN | Tạo variant qty 0, price 0.01. | Thành công theo DTO; hiển thị hết hàng. |
| AP-006 | P1 | ADMIN | Tạo hai variant trùng color-size/SKU. | Bị từ chối nếu uniqueness yêu cầu; không tạo bản ghi trùng gây sai tồn. |
| AP-007 | P1 | ADMIN | Tạo nhiều ảnh, hai ảnh `isPrimary=true`, displayOrder trùng. | Hệ thống chuẩn hóa chỉ một ảnh chính và thứ tự xác định hoặc báo lỗi rõ. |
| AP-008 | P1 | ADMIN | Cập nhật product, thêm/sửa/xóa variant và ảnh. | Thay đổi đúng; không xóa nhầm variant đã có trong order; storefront đồng bộ. |
| AP-009 | P0 | ADMIN | Giảm tồn dưới số đang giữ/đã bán hoặc sửa giá khi có giỏ. | Không làm tồn âm; đơn cũ giữ giá snapshot; giỏ hiển thị giá/tồn mới rõ ràng. |
| AP-010 | P0 | ADMIN | Xóa product có order/review/wishlist. | Soft delete hoặc từ chối an toàn; không phá FK/lịch sử đơn. |
| AP-011 | P0 | STAFF/CUSTOMER/GUEST | Gọi product admin CRUD. | Theo code hiện tại chỉ ADMIN: 403/401. |
| AP-012 | P1 | ADMIN | Dùng tìm kiếm/filter/sort/phân trang admin. | Bao gồm cả status 0; kết quả/chỉ số đúng. |
| CAT-001 | P1 | ADMIN | Tạo category hợp lệ. | HTTP 201; xuất hiện theo status. |
| CAT-002 | P1 | ADMIN | Name rỗng, 101 ký tự, status -1/2, name trùng. | Validation/uniqueness phù hợp; không tạo dữ liệu sai. |
| CAT-003 | P1 | ADMIN | Cập nhật tên/mô tả/status. | Storefront cập nhật; status 0 ẩn category và xử lý product con đúng quy tắc. |
| CAT-004 | P0 | ADMIN | Xóa category đang có product. | Từ chối hoặc soft delete an toàn; không làm product mất liên kết. |
| CAT-005 | P0 | STAFF/CUSTOMER/GUEST | Gọi CRUD category. | Chỉ ADMIN thành công theo controller. |
| BAN-001 | P1 | ADMIN | Tạo IMAGE/MARQUEE, title<=150, position>=1, status 0/1. | Lưu đúng; banner active hiển thị theo position; link hoạt động an toàn. |
| BAN-002 | P1 | ADMIN | Title/image rỗng, type sai, position 0, status 2. | HTTP 400; không tạo banner. |
| BAN-003 | P2 | ADMIN | Hai banner cùng position, sửa thứ tự. | Thứ tự hiển thị xác định/được chuẩn hóa; không mất banner. |
| BAN-004 | P0 | CUSTOMER/STAFF/GUEST | Gọi banner CRUD/all-admin. | 401/403; GET public chỉ trả banner được phép hiển thị. |

### 4.11. Quản trị coupon, user, quận huyện, cấu hình

| ID | Pri | Tiền điều kiện / Dữ liệu | Bước thực hiện | Kết quả mong đợi |
|---|---|---|---|---|
| ACP-001 | P1 | ADMIN | Tạo coupon fixed hợp lệ. | HTTP 201; usedCount=0; validate đúng trong thời gian hiệu lực. |
| ACP-002 | P1 | ADMIN | Tạo coupon percent hợp lệ có max discount. | Lưu đúng type/value/cap và áp dụng đúng. |
| ACP-003 | P1 | ADMIN | Thử code rỗng/>50/trùng; type 0/3; value 0; usageLimit 0; status 2. | HTTP 400; không tạo/cập nhật sai. |
| ACP-004 | P0 | ADMIN | startDate >= endDate; percent >100; scope/category/product không khớp. | Kỳ vọng bị từ chối. Nếu lưu được, ghi defect validation nghiệp vụ. |
| ACP-005 | P1 | ADMIN | Sửa coupon đã có người dùng/đang áp dụng. | Không làm sai đơn cũ; thay đổi mới có hiệu lực có kiểm soát. |
| ACP-006 | P0 | ADMIN | Xóa coupon đã được dùng. | Soft delete/disable; lịch sử user_coupons và order còn toàn vẹn. |
| ACP-007 | P0 | STAFF/CUSTOMER/GUEST | Gọi CRUD coupon. | Chỉ ADMIN thành công. |
| USR-001 | P1 | ADMIN/STAFF theo quyền hiện tại | Liệt kê/tìm/filter user. | Không trả password/hash/OTP; phân trang đúng. |
| USR-002 | P0 | ADMIN | Tạo user hợp lệ với role tồn tại. | User tạo đúng role/status; password được hash. |
| USR-003 | P1 | ADMIN | Tạo/sửa với username/email trùng, email sai, role không tồn tại, status 2. | HTTP 400/404; không thay đổi một phần. |
| USR-004 | P0 | STAFF | Thử tạo ADMIN, đổi role thành ADMIN, khóa/xóa ADMIN. | Kỳ vọng bị cấm theo least privilege. Nếu thành công do class cho cả STAFF, ghi defect P0. |
| USR-005 | P0 | ADMIN | Khóa U01 rồi dùng JWT cũ gọi API. | JWT cũ phải bị vô hiệu/không được tiếp tục thao tác; đăng nhập mới bị chặn. |
| USR-006 | P0 | ADMIN | Xóa user có đơn/payment/review. | Soft delete/anonymize hoặc từ chối an toàn; sổ giao dịch còn nguyên. |
| USR-007 | P0 | CUSTOMER/GUEST | Gọi `/users/**`. | 403/401. |
| DIST-001 | P1 | STAFF/ADMIN | Tạo/sửa district name/province hợp lệ. | Thành công; GET public trả đúng district active. |
| DIST-002 | P1 | STAFF/ADMIN | Name/province rỗng/>100, status 2, bản ghi trùng. | Validation; không tạo sai. |
| DIST-003 | P0 | STAFF | Xóa district. | 403; chỉ ADMIN được xóa. |
| SET-001 | P1 | STAFF/ADMIN | Tạo/lấy/sửa setting theo key đúng quyền. | Giá trị lưu/đọc đúng; key duy nhất; thay đổi áp dụng đúng nơi dùng. |
| SET-002 | P1 | Không | Key rỗng/>100, description>255. | HTTP 400; không lưu. |
| SET-003 | P0 | STAFF | Sửa theo id/xóa setting. | Theo controller: sửa id và xóa chỉ ADMIN; STAFF bị 403. |
| SET-004 | P0 | CUSTOMER/GUEST | Gọi `/settings/**`. | 403/401; không lộ cấu hình nhạy cảm (PayOS key, secret, mail credential). |

### 4.12. Chat, dashboard và các trang admin mở rộng

| ID | Pri | Tiền điều kiện / Dữ liệu | Bước thực hiện | Kết quả mong đợi |
|---|---|---|---|---|
| CHAT-001 | P1 | GUEST | Gửi chat với channelId/content hợp lệ. | Tạo message đúng channel; sender được xác định an toàn; không cần token theo cấu hình. |
| CHAT-002 | P1 | GUEST | Gửi channelId/content rỗng, payload quá lớn. | HTTP 400/413 phù hợp; không lưu spam rỗng. |
| CHAT-003 | P0 | GUEST | Giả senderName là ADMIN hoặc dùng channel của khách khác. | Không được mạo danh/đọc dữ liệu; server gắn danh tính đáng tin cậy. |
| CHAT-004 | P0 | CUSTOMER/GUEST | Gọi GET all/channel của người khác. | Chỉ ADMIN/STAFF được GET; 401/403. |
| CHAT-005 | P1 | STAFF/ADMIN | Xem list, mở channel, gửi phản hồi. | Đúng lịch sử theo thời gian; phản hồi hiển thị cho đúng khách; không trùng khi retry. |
| DASH-001 | P1 | ADMIN | Mở dashboard/stats với dữ liệu mẫu. | Tổng đơn/doanh thu/customer/tồn khớp truy vấn nguồn. |
| DASH-002 | P0 | Có đơn COD chưa thu, PayOS fail, cancel, delivered | Xem doanh thu. | Chỉ giao dịch đủ điều kiện được cộng; không cộng đơn fail/cancel/trùng webhook. |
| DASH-003 | P1 | Có dữ liệu nhiều ngày/tháng | Đổi khoảng thời gian và timezone Asia/Saigon. | Biên từ–đến chính xác; biểu đồ và tổng số khớp; không lệch ngày do UTC. |
| DASH-004 | P1 | Có variant tồn 0,4,5 | Xem cảnh báo tồn. | 0 và 4 được cảnh báo theo ngưỡng <5; 5 không bị cảnh báo. |
| EXT-001 | P2 | ADMIN/STAFF | Mở từng route brands, topics, articles, deliveries, transactions, promotions, banners, staff, notifications, shipping-settings, reviews, warranties, security, CRM. | Trang tải không crash; tiêu đề/menu đúng; trạng thái loading/empty/error rõ ràng. |
| EXT-002 | P0 | CUSTOMER/GUEST | Mở trực tiếp từng route EXT-001. | Không truy cập dữ liệu/chức năng admin. |
| EXT-003 | P2 | Trang chỉ là mock/chưa có API | Thêm/sửa/xóa dữ liệu trên UI rồi reload. | Không báo “thành công” giả. Nếu chưa triển khai phải khóa thao tác/ghi rõ; dữ liệu thật không bị hiểu nhầm. |
| EXT-004 | P1 | ADMIN | Mở transactions và đối chiếu payment/order. | Số tiền, phương thức, trạng thái, mã đơn khớp; không lộ secret/token. |
| EXT-005 | P1 | ADMIN/STAFF | Mở deliveries, lọc carrier/status và cập nhật. | Dữ liệu khớp order; chuyển trạng thái hợp lệ; retry không tạo vận đơn trùng. |
| EXT-006 | P1 | ADMIN | Quản lý staff. | Chỉ ADMIN tạo/đổi quyền/khóa staff; không thể hạ/xóa admin hệ thống ngoài quy trình. |

## 5. Test case phi chức năng và bảo mật

| ID | Pri | Tiền điều kiện / Dữ liệu | Bước thực hiện | Kết quả mong đợi |
|---|---|---|---|---|
| SEC-001 | P0 | Không | Thử SQL injection ở login, search, filter, reason, chat, coupon. | Không bypass đăng nhập/không lỗi DB; chuỗi được coi là dữ liệu. |
| SEC-002 | P0 | Không | Thử stored/reflected XSS ở profile, product, category, review, chat, banner link. | Script không chạy ở storefront/admin; output được encode/sanitize. |
| SEC-003 | P0 | U01/U02 | Thay mọi ID trên URL/API bằng ID của U02. | Ownership được kiểm tra server-side cho order, address, cart, review, wishlist, payment. |
| SEC-004 | P0 | Token CUSTOMER | Sửa payload/role claim hoặc gọi endpoint ADMIN. | Chữ ký token bị kiểm; role từ server; HTTP 403. |
| SEC-005 | P0 | Token hết hạn/sai chữ ký/thiếu Bearer | Gọi API bảo vệ. | HTTP 401 thống nhất; không có dữ liệu hoặc stack trace. |
| SEC-006 | P0 | Không | Kiểm tra response/log/network. | Không lộ password, hash, OTP, JWT, PayOS secret, Firebase key riêng, stack trace, SQL. |
| SEC-007 | P0 | Không | Kiểm tra OTP/login/chat/newsletter với tần suất cao. | Có rate limit/lockout/CAPTCHA phù hợp; không gây mail/SMS bombing. |
| SEC-008 | P0 | Trình duyệt từ origin không được phép | Gọi API có credential/Authorization. | CORS từ chối origin lạ; origin hợp lệ hoạt động. |
| SEC-009 | P1 | Không | Gửi JSON sai kiểu, malformed, content-type sai, body rất lớn. | 400/415/413 phù hợp; server ổn định; không lộ lỗi nội bộ. |
| SEC-010 | P0 | Không | Kiểm tra public endpoints và Swagger production. | Chỉ endpoint cần thiết công khai; repair-db/register-staff được bảo vệ; Swagger theo chính sách môi trường. |
| SEC-011 | P0 | Admin/Staff | Thực hiện khóa user, đổi role, sửa order/payment/setting. | Có audit gồm ai, lúc nào, trước/sau, lý do; log không sửa được bởi user thường. |
| PERF-001 | P1 | Dataset >=10.000 product | Tải danh sách/filter/search 20 lần. | p95 API/list đáp ứng theo SLA (đề xuất <=2s); không tải toàn bộ dữ liệu; UI không treo. |
| PERF-002 | P1 | Dataset >=10.000 order | Admin lọc/phân trang/stats. | p95 theo SLA; query không N+1 nghiêm trọng; bộ nhớ ổn định. |
| PERF-003 | P0 | Tồn giới hạn | 50 request add-cart/checkout/webhook đồng thời. | Không deadlock kéo dài, không tồn âm, không đơn/payment/coupon trùng. |
| REL-001 | P0 | Có thể ngắt DB/PayOS/mail | Ngắt từng dependency giữa giao dịch. | Rollback/timeout/retry có giới hạn; thông báo rõ; không mất tính toàn vẹn. |
| REL-002 | P1 | API chậm 5–30 giây | Thực hiện search/cart/checkout. | Có loading, disable nút gây submit trùng, timeout và retry an toàn. |
| A11Y-001 | P2 | Screen reader | Kiểm tra form login/register/checkout và dialog. | Label, lỗi, role/status được đọc; ảnh có alt; modal quản lý focus. |
| A11Y-002 | P2 | Zoom 200%/contrast | Kiểm tra các trang chính. | Nội dung vẫn dùng được; chữ/nút đủ tương phản; không che cắt thao tác. |

## 6. Các điểm không thống nhất phải được chốt trước nghiệm thu

| ID | Phát hiện | Kỳ vọng cần chốt |
|---|---|---|
| GAP-001 | Tài liệu chức năng yêu cầu mật khẩu tối thiểu 8 ký tự; `RegisterRequest` và `ResetPasswordRequest` hiện nhận từ 6. | Chọn một chuẩn duy nhất, khuyến nghị >=8 và áp dụng FE/BE/tài liệu. |
| GAP-002 | `ReviewRequest` có `@Min(0)` nhưng message/đặc tả nói 1–5 sao. | Rating hợp lệ phải là 1–5. |
| GAP-003 | `OrderStatus` có RETURNED=5; DTO cũ `UpdateOrderStatusRequest` chỉ 0–4, trong khi controller nhận enum trực tiếp. | Thống nhất 0–5 và ma trận chuyển trạng thái. |
| GAP-004 | `GET /orders/{id}` chỉ coi `ROLE_ADMIN` là staff trong biến `isStaff`; ROLE_STAFF có thể bị kiểm ownership như customer. | ADMIN và STAFF được xem đơn theo quyền vận hành. |
| GAP-005 | `/api/v1/auth/**` công khai nên `register-staff` và `repair-db` đang công khai. | Chỉ ADMIN được tạo staff; endpoint sửa DB phải tắt hoặc chỉ ADMIN/internal. |
| GAP-006 | Security cho phép public `GET /reviews/**`, bao gồm `/reviews/admin`; method security vẫn bảo vệ nhưng cần regression. | `/reviews/admin` chỉ ADMIN/STAFF. |
| GAP-007 | Checkout nhận `shippingFee` và `isPaid` từ client. | Server phải tự tính/verify, không tin quyền thanh toán hoặc phí âm từ client. |
| GAP-008 | Nhiều route admin mở rộng có thể mới là UI/mock và chưa có backend tương ứng. | Phân loại “đã triển khai/chưa triển khai”; không nghiệm thu chức năng chỉ dựa trên giao diện. |

## 7. Tiêu chí hoàn thành kiểm thử

- 100% test P0 và P1 đã chạy; không còn lỗi P0/P1 mở.
- Tất cả endpoint thay đổi dữ liệu đã có test hợp lệ, validation, phân quyền, ownership và rollback.
- Các luồng đăng ký–đăng nhập, giỏ–checkout–payment, cập nhật đơn và coupon chạy xuyên suốt trên môi trường gần production.
- Không có tồn kho âm, đơn/payment trùng, coupon vượt lượt, hoặc truy cập chéo dữ liệu người dùng.
- Các GAP ở mục 6 đã có quyết định nghiệp vụ và test case được cập nhật theo quyết định đó.
- Báo cáo thực thi phải ghi: môi trường/build, người chạy, thời gian, Actual Result, Pass/Fail/Blocked, mã lỗi và bằng chứng ảnh/log không chứa dữ liệu nhạy cảm.
