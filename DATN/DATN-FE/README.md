# HƯỚNG DẪN CHẠY FRONTEND REACT (DATN-FE)

Tài liệu này hướng dẫn chi tiết cách cài đặt các thư viện phụ thuộc, cấu hình biến môi trường và chạy ứng dụng Frontend của dự án FoxStyle (sử dụng React + Vite + Tailwind CSS).

---

## 1. Yêu cầu hệ thống (Prerequisites)
Đảm bảo máy tính của bạn đã cài đặt:
- **Node.js:** Phiên bản **18** trở lên (Khuyến nghị bản LTS mới nhất).
- **pnpm** hoặc **npm**: Khuyên dùng **pnpm** vì dự án đã có cấu hình `pnpm-lock.yaml` và `pnpm-workspace.yaml`.
  - Nếu chưa cài đặt `pnpm`, bạn có thể cài đặt toàn cục bằng lệnh: `npm install -g pnpm`

---

## 2. Di chuyển vào thư mục dự án Frontend
Mở Terminal (Command Prompt, PowerShell hoặc Git Bash).

Nếu bạn đang đứng ở **thư mục gốc của dự án** (thư mục tổng chứa cả hai thư mục `DATN-BE` và `DATN-FE`), chạy lệnh sau để vào thư mục frontend:
```bash
# Di chuyển vào thư mục Frontend từ thư mục gốc
cd DATN-FE
```

Hoặc bạn có thể dùng đường dẫn tuyệt đối tương ứng với vị trí lưu thư mục trên máy của bạn:
```bash
# Di chuyển bằng đường dẫn tuyệt đối
cd <đường_dẫn_thư_mục_dự_án>\DATN-FE
# Ví dụ: cd C:\du-an\DATN\DATN-FE
```

---

## 3. Cấu hình biến môi trường (`.env`)
Tạo một file có tên là `.env` tại thư mục gốc của thư mục `DATN-FE` (nếu chưa có).

Thêm cấu hình trỏ tới cổng API của Backend như sau:

```env
# Địa chỉ URL của Spring Boot Backend API
VITE_API_URL=http://localhost:8080/api/v1
```

---

## 4. Cài đặt các thư viện (Dependencies)
Tại thư mục `DATN-FE`, chạy một trong hai lệnh sau để tải và cài đặt các thư viện cần thiết:

### Cách 1: Sử dụng pnpm (Khuyên dùng)
```bash
pnpm install
```

### Cách 2: Sử dụng npm
```bash
npm install
```

---

## 5. Khởi chạy máy chủ phát triển Frontend
Sau khi cài đặt xong thư viện, chạy lệnh sau để khởi động server:

### Sử dụng pnpm (Khuyên dùng)
```bash
pnpm run dev
```

### Sử dụng npm
```bash
npm run dev
```

Sau khi chạy thành công, terminal sẽ hiển thị địa chỉ local, thông thường là:
👉 **[http://localhost:5173](http://localhost:5173)**

Mở địa chỉ trên bằng trình duyệt của bạn để trải nghiệm giao diện người dùng.

---

## 6. Xử lý một số lỗi thường gặp (Troubleshooting)

### Lỗi 1: Không cài đặt được thư viện hoặc xung đột phiên bản
Nếu gặp lỗi trong quá trình chạy `npm install` hoặc `pnpm install`, hãy xóa thư mục `node_modules` và cài đặt lại sạch sẽ:
```bash
# Windows PowerShell
Remove-Item -Recurse -Force node_modules
pnpm install
```

### Lỗi 2: Lỗi biên dịch CSS / Tailwind
Vite biên dịch Tailwind CSS tự động. Nếu CSS không tải hoặc bị lỗi hiển thị, hãy đảm bảo cổng Backend đã chạy hoặc thử khởi động lại Vite server (Ctrl+C rồi chạy lại `pnpm run dev`).
