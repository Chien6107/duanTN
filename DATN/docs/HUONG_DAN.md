# HƯỚNG DẪN KHỞI CHẠY DỰ ÁN FASHION STORE FOXSTYLE

Tài liệu này hướng dẫn các bước giải nén, thiết lập cơ sở dữ liệu, khởi chạy Backend (Spring Boot) và Frontend (React Vite) để chạy thử nghiệm dự án.

---

## 1. GIẢI NÉN VÀ MỞ DỰ ÁN

1.  **Giải nén**: Giải nén file `.zip` của dự án chọn **Extract Here** hoặc **Extract to DATN...**
2.  **Cấu trúc thư mục**:
    *   `DATN-BE/`: Mã nguồn dự án Backend (Spring Boot).
    *   `DATN-FE/`: Mã nguồn dự án Frontend (React Vite).
    *   `foxstyle_db.sql` hoặc `db.sql`: File script cơ sở dữ liệu SQL Server.
    *   `docs/`: Thư mục chứa tài liệu đồ án (bao gồm file hướng dẫn này).

---

## 2. THIẾT LẬP CƠ SỞ DỮ LIỆU (SQL SERVER)

1.  Mở ứng dụng **SQL Server Management Studio (SSMS)** và kết nối tới SQL Server của bạn.
2.  Tạo một cơ sở dữ liệu trống bằng cách chạy lệnh:
    ```sql
    CREATE DATABASE foxstyle_db;
    ```
3.  Mở file script SQL `foxstyle_db.sql` (hoặc `db.sql`) đi kèm ở thư mục gốc dự án trong SSMS.
4.  Nhấp **Execute** (hoặc nhấn phím `F5`) để tạo cấu trúc bảng và nạp dữ liệu mẫu vào cơ sở dữ liệu `foxstyle_db`.
5.  **Cấu hình kết nối cơ sở dữ liệu trong Backend**:
    *   Mở file: `DATN-BE/src/main/resources/application.properties`
    *   Chỉnh sửa cấu hình tài khoản SQL Server của bạn ở các dòng sau (mặc định đang cấu hình tài khoản `chien` / mật khẩu `123456`):
        ```properties
        spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=foxstyle_db;encrypt=true;trustServerCertificate=true
        spring.datasource.username=TÊN_ĐĂNG_NHẬP_CỦA_BẠN
        spring.datasource.password=MẬT_KHẨU_CỦA_BẠN
        ```

---

## 3. HƯỚNG DẪN KHỞI CHẠY BACKEND (SPRING BOOT)

### Cách 1: Sử dụng IntelliJ IDEA (Khuyên dùng)
1.  Mở **IntelliJ IDEA**, chọn **Open** và dẫn tới thư mục `DATN-BE/`.
2.  Đợi IntelliJ đồng bộ các dependency từ file `pom.xml` (Maven).
3.  Tìm đến class `com.foxstyle.api.ApiApplication` nằm theo đường dẫn `src/main/java/com/foxstyle/api/ApiApplication.java`.
4.  Click chuột phải chọn **Run 'ApiApplication.main()'** hoặc nhấn nút **Play** màu xanh.
5.  Backend sẽ chạy mặc định ở port `8080`. Bạn có thể truy cập tài liệu API Swagger tại địa chỉ:
    `http://localhost:8080/swagger`

### Cách 2: Sử dụng dòng lệnh (Terminal/Command Prompt)
1.  Mở terminal tại thư mục `DATN-BE/`.
2.  Chạy lệnh khởi chạy dự án:
    ```bash
    mvn clean spring-boot:run
    ```

---

## 4. HƯỚNG DẪN KHỞI CHẠY FRONTEND (REACT VITE)

1.  Mở thư mục `DATN-FE/` bằng **Visual Studio Code**.
2.  Mở Terminal trong VS Code (`Ctrl + \``).
3.  Cài đặt các thư viện/dependency bằng cách chạy lệnh:
    ```bash
    npm install
    ```
4.  Khởi chạy server phát triển (development server) bằng lệnh:
    ```bash
    npm run dev
    ```
5.  Mở trình duyệt truy cập địa chỉ hiển thị trên terminal (mặc định là `http://localhost:5173`) để trải nghiệm hệ thống.

*Lưu ý: File cấu hình `.env` của frontend mặc định kết nối với API URL tại địa chỉ: `VITE_API_URL=http://localhost:8080/api/v1`*

---

## 5. THÔNG TIN ĐĂNG NHẬP THỬ NGHIỆM

Bạn có thể sử dụng các tài khoản có sẵn trong cơ sở dữ liệu mẫu để đăng nhập trải nghiệm:
*   **Trang Khách hàng (Frontend chính)**: Đăng nhập bằng tài khoản mẫu trong cơ sở dữ liệu hoặc click Đăng ký tài khoản mới trực tiếp trên giao diện.
*   **Trang Quản trị (Admin)**: Truy cập đường dẫn `http://localhost:5173/admin` và đăng nhập bằng tài khoản Admin cấp cao có trong DB để vào quản lý sản phẩm, đơn hàng, danh mục,...
