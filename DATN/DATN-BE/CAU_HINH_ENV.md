# Hướng dẫn cấu hình biến môi trường (.env) và các dịch vụ ngoài

Tài liệu này liệt kê toàn bộ biến môi trường backend cần, cách lấy từng giá trị, và các lỗi thường gặp khi deploy (đặc biệt trên Railway).

- File `.env.example` ở cùng thư mục là bản mẫu — copy thành `.env` rồi điền giá trị thật để chạy local.
- Khi deploy (Railway/hosting khác), khai báo đúng các biến này trong mục **Environment Variables** của nền tảng, không dùng file `.env`.
- `.env` đã được `.gitignore` — không commit file này lên Git.

---

## 1. Database (bắt buộc)

```env
DB_URL=jdbc:sqlserver://localhost:1433;databaseName=foxstyle_db;encrypt=true;trustServerCertificate=true
DB_USERNAME=sa
DB_PASSWORD=mật_khẩu_sql
HIBERNATE_DDL_AUTO=update
```

- `DB_URL`: với Azure SQL, dạng `jdbc:sqlserver://<server>.database.windows.net:1433;databaseName=<db>;encrypt=true;trustServerCertificate=false`.
- `HIBERNATE_DDL_AUTO=update`: Hibernate tự tạo/cập nhật bảng theo entity lúc khởi động. **Lưu ý**: nếu bảng đã có dữ liệu, thêm cột `NOT NULL` không có `DEFAULT` sẽ khiến app crash lúc start — khi thêm field bắt buộc mới vào entity, luôn dùng `columnDefinition = "... NOT NULL DEFAULT ..."` thay vì chỉ `nullable = false`.
- Nếu dùng Azure SQL: nhớ vào **Azure Portal → SQL Server → Networking → Firewall rules** thêm IP của server chạy backend (Railway không có IP tĩnh theo mặc định, có thể cần mở dải IP rộng hoặc mua gói static IP).

## 2. Khởi tạo dữ liệu lúc chạy (tùy chọn)

```env
SEED_DEMO_DATA=false
SEED_ADMIN=false
REPAIR_DATABASE_ENCODING=false
```

- `SEED_DEMO_DATA=true`: tạo dữ liệu mẫu (sản phẩm, đơn hàng, khách hàng demo...). **Chỉ bật ở local/dev**, không bật ở production.
- `SEED_ADMIN=true`: tạo/đồng bộ 1 tài khoản admin theo `ADMIN_*` bên dưới. Chỉ cần bật 1 lần đầu, xong tắt lại.
- Role hệ thống (`ROLE_ADMIN`, `ROLE_STAFF`, `ROLE_CUSTOMER`) được `RoleInitializer` tạo tự động mỗi lần khởi động, **không phụ thuộc** vào `SEED_DEMO_DATA` — không cần bật demo data chỉ để có role.

### Tài khoản admin (chỉ cần khi `SEED_ADMIN=true`)
```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Mật_khẩu_mạnh_123!
ADMIN_EMAIL=admin@example.com
ADMIN_FULL_NAME=Quản trị viên
ADMIN_PHONE=
```
`ADMIN_PASSWORD` phải ≥ 8 ký tự, có chữ hoa, chữ thường, số và ký tự đặc biệt — thiếu sẽ crash app lúc start.

### Mật khẩu tài khoản demo (chỉ dùng khi `SEED_DEMO_DATA=true`)
```env
DEMO_ADMIN_PASSWORD=Admin123@
DEMO_STAFF_PASSWORD=Staff123@
DEMO_CUSTOMER_PASSWORD=Chien123@
```
Nên đổi khác giá trị mặc định nếu deploy ở nơi công khai (giá trị mặc định nằm sẵn trong source code public).

## 3. CORS (bắt buộc nếu có frontend riêng domain)

```env
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,https://your-frontend.vercel.app
```
Liệt kê đầy đủ domain frontend được phép gọi API, cách nhau bằng dấu phẩy, **không có dấu `/` ở cuối**. Thiếu domain nào, domain đó sẽ bị lỗi CORS khi gọi API.

## 4. Gửi email

```env
MAIL_PROVIDER=smtp
```
`MAIL_PROVIDER` chọn 1 trong 2: `smtp` (mặc định) hoặc `http`/`brevo`.

⚠️ **Một số nền tảng hosting (đã xác nhận với Railway) chặn toàn bộ port SMTP outbound (25/465/587/2525)** — dù cấu hình đúng 100%, `MAIL_PROVIDER=smtp` sẽ luôn timeout khi kết nối `smtp.gmail.com` hay bất kỳ SMTP relay nào. Nếu gặp lỗi `SocketTimeoutException: Connect timed out` trong log, đổi sang `MAIL_PROVIDER=http`.

### 4a. Chế độ SMTP (`MAIL_PROVIDER=smtp`)
```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=you@gmail.com
MAIL_PASSWORD=app_password_16_ky_tu
MAIL_FROM_NAME=FoxStyle Store
MAIL_ENCODING=UTF-8
MAIL_SMTP_AUTH=true
MAIL_STARTTLS_ENABLE=true
MAIL_STARTTLS_REQUIRED=true
MAIL_SMTP_SSL_TRUST=smtp.gmail.com
MAIL_SSL_ENABLE=false
MAIL_CONNECTION_TIMEOUT=10000
MAIL_TIMEOUT=10000
MAIL_WRITE_TIMEOUT=10000
```
Cách lấy `MAIL_PASSWORD` (Gmail App Password):
1. Đăng nhập Gmail muốn dùng để gửi mail.
2. Vào **myaccount.google.com/security** → bật **Xác minh 2 bước** (bắt buộc phải bật mới tạo được App Password).
3. Vào **myaccount.google.com/apppasswords** → đặt tên bất kỳ → **Tạo** → copy mã 16 ký tự.

Nếu dùng cổng 465 (SSL) thay vì 587 (STARTTLS): đặt `MAIL_PORT=465`, `MAIL_SSL_ENABLE=true`, `MAIL_STARTTLS_ENABLE=false`.

### 4b. Chế độ HTTP API qua Brevo (`MAIL_PROVIDER=http`)
```env
BREVO_API_KEY=xkeysib-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
Vẫn cần khai báo `MAIL_USERNAME` (dùng làm email người gửi) và `MAIL_FROM_NAME` như trên — bỏ qua các biến SMTP còn lại.

Cách lấy `BREVO_API_KEY`:
1. Đăng ký tài khoản miễn phí tại **brevo.com**.
2. Vào **Settings → SMTP & API → API Keys** (khác với mục "SMTP Keys" — API Key mới dùng được cho `MAIL_PROVIDER=http`).
3. **Generate a new API key** → copy ngay (chỉ hiện 1 lần).
4. Vào **Settings → Senders & IP → Senders**, thêm và xác minh email đang đặt ở `MAIL_USERNAME` làm sender — Brevo **từ chối gửi** nếu sender chưa xác minh.

## 5. Cloudinary (upload ảnh/video)

```env
CLOUDINARY_CLOUD_NAME=xxxxxxx
CLOUDINARY_API_KEY=xxxxxxxxxxxxxxx
CLOUDINARY_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxx
```
Lấy tại **cloudinary.com → Dashboard** (sau khi đăng nhập) → mục **Product Environment Credentials**. Bấm **Reveal** để hiện `API Secret` rồi copy trực tiếp, **không gõ tay** — 2 ký tự `l` (L thường) và `I` (i hoa) rất dễ gõ nhầm lẫn nhau và sẽ gây lỗi `Invalid Signature` khi upload.

Thiếu 1 trong 3 biến: app vẫn chạy bình thường, chỉ upload ảnh/video báo lỗi.

## 6. PayOS (thanh toán online)

```env
PAYOS_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
PAYOS_API_KEY=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
PAYOS_CHECKSUM_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
Lấy tại **my.payos.vn → Kênh thanh toán → chọn kênh → Thông tin tích hợp** (bấm icon con mắt để hiện từng giá trị).

Sau khi có key, vào **my.payos.vn → Kênh thanh toán → chọn kênh → Cài đặt → Webhook Url**, điền:
```
https://<domain-backend-that>/api/v1/payments/payos/webhook
```
PayOS sẽ gửi 1 request test tới URL này khi lưu — nếu báo lỗi 400 dù key đúng, kiểm tra backend đã deploy bản mới nhất chưa (webhook cần trả `200` ngay cả với đơn hàng test không tồn tại, miễn chữ ký hợp lệ).

Thiếu 3 biến này: app vẫn chạy, chỉ tính năng thanh toán PayOS báo lỗi.

## 7. JWT (khuyến nghị tự set ở production)

```env
JWT_SECRET=chuỗi_base64_bí_mật_riêng
```
Nếu không set, dùng key mặc định hard-code trong code (chỉ nên dùng cho local/dev, **không an toàn cho production** vì key này công khai trên GitHub).

## 8. Firebase (đăng nhập Google) — cấu hình phía Firebase Console, không phải `.env`

Project Firebase được cấu hình cứng trong `DATN-FE/src/app/services/firebase.js` (không qua biến môi trường). Nếu đăng nhập Google báo lỗi:
```
The current domain is not authorized for OAuth operations...
```
Vào **console.firebase.google.com → chọn project → Authentication → Settings → Authorized domains → Add domain**, thêm đúng domain frontend đang chạy (VD `foxstyle.vercel.app`), không kèm `https://` hay `/`.

---

## Checklist nhanh khi deploy lần đầu lên hosting mới

1. [ ] Set đủ biến DB, test kết nối được (nếu Azure SQL, nhớ mở firewall).
2. [ ] `SEED_ADMIN=true` + đủ `ADMIN_*` cho lần đầu → sau khi có tài khoản admin, đổi lại `SEED_ADMIN=false`.
3. [ ] `CORS_ALLOWED_ORIGINS` có đúng domain frontend thật.
4. [ ] Test gửi mail — nếu timeout, đổi `MAIL_PROVIDER=http` + cấu hình Brevo.
5. [ ] Set đủ `CLOUDINARY_*`, copy trực tiếp từ Dashboard (không gõ tay).
6. [ ] Set đủ `PAYOS_*` + cấu hình Webhook URL trỏ đúng domain backend.
7. [ ] Thêm domain frontend vào Firebase Authorized domains nếu dùng đăng nhập Google.
8. [ ] Set `JWT_SECRET` riêng cho production.
