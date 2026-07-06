# HƯỚNG DẪN CHẠY FRONTEND & XỬ LÝ LỖI KHỞI CHẠY (FOXSTYLE)

Tài liệu này hướng dẫn chi tiết các bước để cài đặt và khởi chạy dự án Frontend (`DATN-FE`), đồng thời cung cấp giải pháp xử lý các lỗi thường gặp trong quá trình chạy `pnpm install` và `pnpm run dev`.

---

## 1. Yêu Cầu Cài Đặt Ban Đầu

Để chạy được dự án này ổn định, hãy đảm bảo máy tính của bạn đã cài đặt:
1. **Node.js** (Khuyến nghị phiên bản LTS mới nhất: **v18.x** hoặc **v20.x**).
2. **PNPM Package Manager**:
   * Nếu chưa cài, mở Terminal và chạy lệnh:
     ```bash
     npm install -g pnpm
     ```
   * Kiểm tra phiên bản sau khi cài đặt:
     ```bash
     pnpm -v
     ```

---

## 2. Hướng Dẫn Cài Đặt Dependency (`pnpm install`)

### Bước 1: Di chuyển vào thư mục Frontend
Mở Terminal tại thư mục gốc của dự án và chạy:
```bash
cd DATN-FE
```

### Bước 2: Tiến hành cài đặt các gói thư viện
Chạy lệnh sau để cài đặt:
```bash
pnpm install
```

---

## 3. Cách Xử Lý Các Lỗi Thường Gặp Khi Cài Đặt

### Lỗi 1: Xung đột phiên bản (Peer Dependency Conflicts)
Khi chạy `pnpm install`, nếu hệ thống cảnh báo xung đột phiên bản giữa các gói (peer dependencies) và dừng cài đặt, hãy sử dụng cờ bỏ qua kiểm tra nghiêm ngặt:
```bash
pnpm install --no-frozen-lockfile --strict-peer-dependencies=false
```
*Hoặc bổ sung cấu hình bỏ qua kiểm tra peer dependency vào file `.npmrc` ở thư mục gốc Frontend:*
```properties
strict-peer-dependencies=false
```

### Lỗi 2: Lỗi bộ nhớ cache pnpm bị hỏng hoặc lỗi tải mạng
Nếu việc cài đặt bị treo nửa chừng hoặc báo lỗi checksum hỏng, hãy dọn sạch kho lưu trữ cache của pnpm và thử lại:
1. Xóa thư mục `node_modules` cũ:
   ```powershell
   # Trên Windows (PowerShell)
   Remove-Item -Recurse -Force node_modules
   ```
2. Xóa cache pnpm:
   ```bash
   pnpm store prune
   ```
3. Chạy lại cài đặt sạch:
   ```bash
   pnpm install
   ```

---

## 4. Giải Quyết Lỗi Biên Dịch Khi Chạy `pnpm run dev`

Nếu khi chạy dự án bằng lệnh `pnpm run dev` bạn gặp lỗi parser của Babel dạng:
```
      at E:\PROJECT\CHIEN\DATN\DATN-FE\node_modules\.pnpm\@babel+parser@...
      at JSXParserMixin.withSmartMixTopicForbiddingContext (...)  
      at JSXParserMixin.parseFunction (...)
```

### Nguyên nhân chính & Cách xử lý:
1. **Lỗi cú pháp ẩn (Syntax Error) trong Code JSX:**
   Babel parser bị lỗi ngầm khi phân tích file mã nguồn do viết sai cú pháp JSX (như quên thẻ đóng, dấu ngoặc nhọn `{}` chưa khép kín, hoặc import thiếu thư viện dùng trong JSX).
   > [!IMPORTANT]
   > *Ví dụ:* Trong file `CheckoutPage.jsx` trước đó đã dùng thẻ `<Link to="/products">` nhưng chưa import `Link` từ `react-router`. Lỗi này đã được sửa thành công trong code bằng việc thêm `import { useNavigate, Link } from "react-router";`.

2. **Cập nhật parser Babel trong pnpm lock file:**
   Nếu bạn nghi ngờ gói `@babel/parser` bị lệch phiên bản trong cache pnpm, hãy chạy lệnh nâng cấp riêng gói này:
   ```bash
   pnpm update @babel/parser --depth Infinity
   ```

---

## 5. Khởi Chạy Frontend Development Server

Sau khi cài đặt thành công, chạy lệnh sau để bật server dev:
```bash
pnpm run dev
```

Server sẽ khởi động tại cổng mặc định của Vite, thông thường là:
👉 **`http://localhost:5173/`**

Nhấp chuột vào link trên để kiểm tra giao diện FoxStyle trực quan trên trình duyệt.

---

## 6. Kết Nối Dự Án Với Spring Boot Backend

Hiện tại, Frontend đang lấy dữ liệu tĩnh (Mock Data) tại `src/app/data/products.ts`. Để chuyển sang gọi API từ Backend Spring Boot:
1. Chắc chắn Backend Spring Boot đang chạy ở cổng `http://localhost:8080`.
2. Tạo file cấu hình Axios API client trong Frontend (đã thiết kế cấu trúc tại `src/app/api/`) và thay đổi endpoint sang cổng `http://localhost:8080/api/v1`.
