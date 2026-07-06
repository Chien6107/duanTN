# GITHUB ACTIONS CI/CD & QUY TẮC CẤU HÌNH CLAUDE CODE
## Tự động hóa kiểm thử bằng GitHub Actions & Hướng dẫn thiết lập Quy tắc lập trình tốt hơn với AI

Tài liệu này hướng dẫn cách cấu hình **GitHub Actions** để tự động kiểm thử và xây dựng mã nguồn (CI/CD) mỗi khi nhóm đẩy code lên GitHub, đồng thời hướng dẫn thiết lập tệp quy tắc tùy chỉnh **`.claudecode.md`** để tối ưu hóa khả năng viết code của trợ lý AI **Claude Code**, đảm bảo AI luôn tuân thủ tiêu chuẩn kỹ thuật của dự án.

---

## PHẦN 1: CẤU HÌNH GITHUB ACTIONS (CI/CD WORKFLOW)

**GitHub Actions** là công cụ CI/CD tích hợp sẵn của GitHub. Nhóm sẽ cấu hình để mỗi khi có thành viên Push code hoặc tạo Pull Request lên nhánh `develop` hoặc `main`, GitHub sẽ tự động khởi chạy một máy chủ ảo để biên dịch, quét lỗi cú pháp (Lint) và chạy thử kiểm thử (Test) cả Backend lẫn Frontend.

Tạo thư mục `.github/workflows/` ở thư mục gốc của dự án và tạo tệp cấu hình **`ci.yml`** tại đường dẫn:
👉 **`.github/workflows/ci.yml`**

```yaml
name: FoxStyle CI/CD Pipeline

on:
  push:
    branches: [ "main", "develop" ]
  pull_request:
    branches: [ "main", "develop" ]

jobs:
  # 1. Kiểm thử và Build Backend Spring Boot
  build-backend:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout mã nguồn
      uses: actions/checkout@v4

    - name: Thiết lập JDK 17
      uses: actions/setup-java@v4
      with:
        java-version: '17'
        distribution: 'temurin'
        cache: maven

    - name: Biên dịch và chạy Unit Test Backend
      run: |
        # Di chuyển vào thư mục chứa code Backend (nếu có thư mục con, ví dụ: cd backend)
        mvn clean package -DskipTests=false

  # 2. Quét lỗi cú pháp (Lint) và Build Frontend React
  build-frontend:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout mã nguồn
      uses: actions/checkout@v4

    - name: Thiết lập Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
        cache-dependency-path: './package-lock.json' # Thay đổi đường dẫn nếu nằm trong folder con

    - name: Cài đặt thư viện dependencies
      run: npm install

    - name: Quét lỗi cú pháp bằng ESLint
      run: npx eslint src/

    - name: Chạy thử biên dịch Frontend
      run: npm run build

  # 3. Kiểm tra tính đóng gói bằng Docker
  docker-check:
    runs-on: ubuntu-latest
    needs: [build-backend, build-frontend] # Chỉ chạy khi Backend và Frontend build thành công
    steps:
    - name: Checkout mã nguồn
      uses: actions/checkout@v4

    - name: Kiểm tra cú pháp Dockerfile và build thử Image
      run: |
        docker build -t foxstyle-fe-test ./docs --file ./docs/project_analysis_report.md || true
        # Thay thế bằng đường dẫn Dockerfile thực tế của bạn khi tích hợp
```

---

## PHẦN 2: CẤU HÌNH QUY TẮC CHO CLAUDE CODE (`.claudecode.md`)

Khi sử dụng **Claude Code (CLI)** để lập trình, bạn có thể tạo một file đặc biệt tên là `.claudecode.md` đặt ở thư mục gốc của dự án. 
Mỗi khi khởi chạy bằng lệnh `claude`, trợ lý AI sẽ tự động đọc tệp này để biết ngữ cảnh dự án, tiêu chuẩn viết code và các ràng buộc nghiệp vụ mà không cần bạn phải nhắc lại trong từng câu lệnh prompt.

Tạo tệp **`.claudecode.md`** ở thư mục gốc của dự án với nội dung cấu hình chuẩn hóa sau:

```markdown
# Tiêu chuẩn Phát triển Dự án FoxStyle (Dành cho Trợ lý AI)

Bạn đang hỗ trợ phát triển dự án thương mại điện tử thời trang **FoxStyle**. Khi viết code hoặc thực hiện các thay đổi, bạn bắt buộc phải tuân thủ nghiêm ngặt các quy tắc kỹ thuật sau đây.

## 1. Tiêu chuẩn viết code Backend (Spring Boot & JPA)
*   **Kiến trúc phân tầng:** Tuyệt đối không viết trực tiếp SQL hoặc gọi database trong Controller. Phải đi tuần tự: `Entity` -> `Repository` -> `Service` -> `Controller`.
*   **Xử lý nghiệp vụ tiền tệ:** Luôn sử dụng kiểu dữ liệu `BigDecimal` cho tất cả các trường giá tiền (`price`, `total_amount`, `discount_amount`) để tránh sai số dấu phẩy động. Không được sử dụng `double` hoặc `float`.
*   **Bảo vệ Transaction:** Mọi phương thức trong lớp Service có thực hiện ghi/xóa database từ 2 bảng trở lên (ví dụ: tạo đơn hàng và trừ tồn kho biến thể) bắt buộc phải được đánh dấu bằng `@Transactional(rollbackFor = Exception.class)`.
*   **Bảo mật:**
    *   Mật khẩu người dùng khi lưu vào bảng `users` phải được mã hóa qua `BCryptPasswordEncoder`.
    *   Kiểm soát quyền truy cập của Admin bằng `@PreAuthorize("hasRole('ADMIN')")` tại tầng Controller.
*   **Xử lý lỗi:** Không dùng `try-catch` thô và trả về thông tin lỗi trực tiếp cho Client. Hãy ném ra các RuntimeException tùy chỉnh (ví dụ: `BadRequestException`) để `GlobalExceptionHandler` tự động xử lý.

## 2. Tiêu chuẩn viết code Frontend (React & TypeScript)
*   **Kiểm soát kiểu dữ liệu:** Nghiêm cấm sử dụng kiểu dữ liệu `any`. Phải khai báo `interface` hoặc `type` rõ ràng cho mọi biến, prop và dữ liệu API trả về.
*   **Quản lý giao diện (CSS):** Chỉ sử dụng hệ thống style tiện ích của **Tailwind CSS**. Không tự viết file CSS tùy biến rời rạc trừ khi thực sự cần thiết.
*   **Đồng bộ hóa API:** Mọi yêu cầu HTTP gọi lên Backend bắt buộc phải đi qua đối tượng `axiosClient` chung và được đóng gói trong các tệp dịch vụ API tương ứng nằm trong thư mục `src/app/api/` (ví dụ: `productApi.ts`).
*   **Điều hướng:** Sử dụng thư viện `react-router` (phiên bản v7) để khai báo định tuyến trang trong `routes.tsx`.

## 3. Quy chuẩn làm việc với Database (SQL Server)
*   Mọi sản phẩm quần áo thời trang khi bán ra phải được phân loại theo cặp **Màu sắc (Color) - Kích thước (Size)** thông qua bảng `product_variants`.
*   Không được lưu trữ danh sách ảnh phụ dạng chuỗi trong bảng sản phẩm chính. Phải lưu trữ trong bảng `product_images`.
```

---

## PHẦN 3: CÁC KỊCH BẢN VÀ MẸO RA LỆNH (PROMPTS) ĐỂ LẬP TRÌNH TỐT HƠN

Để tận dụng tối đa sức mạnh của Claude Code (hoặc các AI coding assistant khác), nhóm của bạn có thể áp dụng các cấu trúc prompt sau cho các giai đoạn phát triển khác nhau:

### 3.1. Prompt yêu cầu Rà soát Bảo mật (Security Audit)
> **Prompt:** *"Hãy quét qua toàn bộ mã nguồn của lớp UserService và AuthController. Hãy tìm các lỗ hổng bảo mật tiềm ẩn như SQL Injection, rò rỉ thông tin mật khẩu, lỗi phân quyền (Broken Object Level Authorization) và đề xuất mã nguồn sửa đổi an toàn nhất."*

### 3.2. Prompt yêu cầu Tự động viết Unit Test bao phủ (Test Coverage)
> **Prompt:** *"Tôi vừa viết xong hàm đặt hàng trong lớp OrderService. Hãy viết cho tôi bộ unit test sử dụng thư viện Mockito và JUnit 5 để kiểm thử hàm này. Đảm bảo bao phủ (coverage) ít nhất 3 trường hợp: (1) Đặt hàng thành công có áp dụng coupon, (2) Đặt hàng lỗi do một biến thể sản phẩm hết hàng trong kho, (3) Đặt hàng lỗi do mã giảm giá hết hạn."*

### 3.3. Prompt yêu cầu Refactor tối ưu code (SOLID Principles)
> **Prompt:** *"Đây là đoạn code xử lý thanh toán cũ của hệ thống. Nó đang vi phạm nguyên lý SOLID (đặc biệt là Single Responsibility). Hãy tái cấu trúc (refactor) lại đoạn code này, chia nhỏ các hàm xử lý thành các lớp riêng biệt để dễ kiểm thử và bảo trì sau này."*
