# HƯỚNG DẪN SỬ DỤNG DOCKER, PLAYWRIGHT & CÁC CÔNG CỤ LẬP TRÌNH (ESLINT/POSTMAN/GIT)

## Tài liệu Kỹ thuật Hỗ trợ Đóng gói, Kiểm thử & Quản lý Dự án FoxStyle

Tài liệu này cung cấp hướng dẫn thực tế để đóng gói hệ thống bằng **Docker**, viết kịch bản kiểm thử tự động bằng **Playwright**, cấu hình chuẩn hóa mã nguồn bằng **ESLint/Prettier** (các công cụ linter), sử dụng **Postman** test API và cách triển khai dự án lên đám mây **AWS EC2**.

---

## PHẦN 1: HƯỚNG DẪN DÙNG DOCKER ĐỂ BUILD & DEPLOY HỆ THỐNG

Docker giúp đóng gói toàn bộ ứng dụng (Backend, Frontend, Database) kèm theo tất cả các thư viện phụ thuộc vào trong các "Container" để hệ thống chạy giống nhau trên mọi máy tính mà không sợ lỗi môi trường.

### 1.1. Đóng gói Spring Boot Backend (`backend.Dockerfile`)

Tạo một file tên là `Dockerfile` ở thư mục gốc của dự án **Backend**:

```dockerfile
# Bước 1: Sử dụng Maven để build dự án sang file JAR
FROM maven:3.8.8-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Bước 2: Chạy ứng dụng bằng JDK Runtime nhẹ hơn
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

---

### 1.2. Đóng gói React Frontend (`frontend.Dockerfile`)

Tạo một file tên là `Dockerfile` ở thư mục gốc của dự án **Frontend** (`fe-DATN`):

```dockerfile
# Bước 1: Build mã nguồn React/Vite sang thư mục static (dist)
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Bước 2: Dùng Nginx làm web server phục vụ file tĩnh
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Copy file cấu hình custom của Nginx để xử lý React Router (tránh lỗi 404 khi f5 trang)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

_File cấu hình `nginx.conf` bổ sung (đặt cùng thư mục Dockerfile của Frontend):_

```nginx
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html; # Redirect tất cả request về index.html cho React Router
    }
}
```

---

### 1.3. Khởi chạy toàn bộ hệ thống bằng Docker Compose (`docker-compose.yml`)

Tạo file `docker-compose.yml` ở thư mục gốc chứa cả thư mục backend và frontend của bạn để chạy cả 3 dịch vụ (Database, Backend, Frontend) chỉ bằng **1 lệnh duy nhất**:

```yaml
version: "3.8"

services:
  # 1. Cơ sở dữ liệu MS SQL Server
  db:
    image: mcr.microsoft.com/mssql/server:2022-latest
    container_name: foxstyle_mssql
    ports:
      - "1433:1433"
    environment:
      - ACCEPT_EULA=Y
      - MSSQL_SA_PASSWORD=YourStrongPassword123!
    volumes:
      - mssql_data:/var/opt/mssql

  # 2. Spring Boot Backend API
  backend:
    build:
      context: ./backend-project # Đường dẫn tới folder code Backend
      dockerfile: Dockerfile
    container_name: foxstyle_backend
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:sqlserver://db:1433;databaseName=foxstyle_db;encrypt=true;trustServerCertificate=true
      - SPRING_DATASOURCE_USERNAME=sa
      - SPRING_DATASOURCE_PASSWORD=YourStrongPassword123!
    depends_on:
      - db

  # 3. React Frontend
  frontend:
    build:
      context: ./fe-DATN # Đường dẫn tới folder code Frontend
      dockerfile: Dockerfile
    container_name: foxstyle_frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mssql_data:
```

- **Lệnh khởi chạy hệ thống:** `docker-compose up -d --build`
- **Lệnh tắt hệ thống:** `docker-compose down`

---

## PHẦN 2: HƯỚNG DẪN DÙNG PLAYWRIGHT ĐỂ KIỂM THỬ TỰ ĐỘNG (E2E TESTING)

**Playwright** là thư viện mạnh mẽ để thực hiện kiểm thử tự động giao diện người dùng (End-to-End Testing). Nó giả lập hành vi người dùng thật bấm click chuột, nhập văn bản trực tiếp trên các trình duyệt (Chromium, Firefox, WebKit).

### 2.1. Cài đặt Playwright trong dự án Frontend

Mở terminal tại thư mục Frontend và chạy lệnh:

```bash
npm init playwright@latest
```

_Hệ thống sẽ hỏi và tự động tạo file cấu hình `playwright.config.ts` cùng thư mục chứa code test `tests/`._

### 2.2. Viết kịch bản kiểm thử mẫu (`tests/auth_flow.spec.ts`)

Kịch bản giả lập quá trình khách hàng truy cập website, thực hiện đăng nhập và kiểm tra xem có hiển thị đúng tên tài khoản hay không:

```typescript
import { test, expect } from "@playwright/test";

test.describe("Kịch bản kiểm thử luồng Xác thực khách hàng", () => {
  // Chạy trước mỗi test case: Điều hướng đến trang chủ
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173/"); // Đổi sang cổng chạy local của bạn
  });

  test("Đăng nhập thành công với tài khoản hợp lệ", async ({ page }) => {
    // 1. Click vào icon tài khoản trên Header để mở trang đăng nhập
    await page.click('a[href="/account"]');

    // 2. Kiểm tra URL đã chuyển sang trang Login chưa
    await expect(page).toHaveURL(/.*login/);

    // 3. Nhập thông tin đăng nhập
    await page.fill('input[name="username"]', "customer_demo");
    await page.fill('input[name="password"]', "my_secure_password");

    // 4. Bấm nút đăng nhập
    await page.click('button[type="submit"]');

    // 5. Kiểm tra hệ thống chuyển hướng về trang cá nhân /account thành công
    await expect(page).toHaveURL(/.*account/);

    // 6. Kiểm tra giao diện hiển thị đúng tên khách hàng
    const userHeader = page.locator("h2");
    await expect(userHeader).toContainText("Nguyễn Văn Khách Hàng");
  });
});
```

### 2.3. Các lệnh khởi chạy Playwright Test

- Chạy tất cả các test case ở chế độ ngầm (Headless mode):
  ```bash
  npx playwright test
  ```
- Chạy test hiển thị trực quan trình duyệt giả lập chạy trước mắt (Headed mode):
  ```bash
  npx playwright test --headed
  ```
- Mở công cụ UI Playwright để dễ dàng gỡ lỗi, chạy từng dòng lệnh test:
  ```bash
  npx playwright test --ui
  ```
- Xem báo cáo kết quả kiểm thử dưới dạng trang HTML trực quan:
  ```bash
  npx playwright show-report
  ```

---

## PHẦN 3: HƯỚNG DẪN DÙNG ESLINT & PRETTIER (ECC / LINTERS)

Trong lập trình, **ESLint** (hay bạn gọi là "ecc") là công cụ cực kỳ quan trọng để phân tích tĩnh mã nguồn JavaScript/TypeScript, tự động phát hiện các lỗi cú pháp và cảnh báo code xấu. **Prettier** giúp tự động căn chỉnh code đều, đẹp.

### 3.1. Cài đặt và cấu hình ESLint cho dự án React

1.  Chạy lệnh cài đặt bộ cấu hình của ESLint:
    ```bash
    npm init @eslint/config
    ```
2.  Sau khi cài đặt, file `.eslintrc.json` hoặc `eslint.config.js` được tạo ra.
    _Mẫu cấu hình chuẩn `.eslintrc.json` cho dự án React TS:_
    ```json
    {
      "env": {
        "browser": true,
        "es2021": true
      },
      "extends": [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended"
      ],
      "parser": "@typescript-eslint/parser",
      "parserOptions": {
        "ecmaFeatures": {
          "jsx": true
        },
        "ecmaVersion": "latest",
        "sourceType": "module"
      },
      "plugins": ["react", "@typescript-eslint"],
      "rules": {
        "react/react-in-jsx-scope": "off", // React 17+ không cần import React ở đầu file
        "no-unused-vars": "warn", // Cảnh báo biến khai báo nhưng không dùng
        "@typescript-eslint/no-explicit-any": "error" // Báo lỗi nếu dùng kiểu dữ liệu any
      }
    }
    ```

### 3.2. Lệnh sử dụng ESLint

- Quét toàn bộ dự án để tìm lỗi cú pháp và coding convention:
  ```bash
  npx eslint src/
  ```
- Yêu cầu ESLint tự động sửa các lỗi định dạng nhỏ có thể sửa được:
  ```bash
  npx eslint src/ --fix
  ```

---

## PHẦN 4: CÁC CÔNG CỤ LẬP TRÌNH QUAN TRỌNG KHÁC

### 4.1. Postman (Kiểm thử API)

- **Mục đích:** Giúp lập trình viên Backend test các API Spring Boot độc lập mà không cần chờ giao diện Frontend hoàn thành.
- **Cách sử dụng:**
  1.  Tạo mới một **Collection** mang tên `FoxStyle API`.
  2.  Tạo request đăng nhập: Chọn method `POST`, nhập URL `http://localhost:8080/api/auth/login`, phần Body chọn `raw -> JSON` và nhập thông tin đăng nhập.
  3.  Lưu Token tự động: Trong tab **Tests** của request login, nhập code sau để tự gán JWT Token vào biến môi trường:
      ```javascript
      var jsonData = pm.response.json();
      pm.environment.set("jwt_token", jsonData.accessToken);
      ```
  4.  Gọi API bảo mật: Ở các request lấy thông tin đơn hàng, giỏ hàng, chọn tab **Authorization**, chọn loại `Bearer Token` và nhập giá trị `{{jwt_token}}`.

---

### 4.2. AWS EC2 (Triển khai lên đám mây - Elastic Compute Cloud)

Nếu "ecc" của bạn mang ý nghĩa là **Amazon EC2** (dịch vụ máy chủ ảo đám mây), dưới đây là các bước để triển khai hệ thống lên EC2:

1.  **Tạo Instance:** Đăng nhập console AWS, chọn dịch vụ **EC2**, tạo mới một instance chạy hệ điều hành **Ubuntu Server** (khuyên dùng bản LTS 22.04). Chọn cấu hình free tier (t2.micro).
2.  **Cấu hình Security Group (Mở port):** Cần mở các cổng mạng:
    - Port `22` (SSH) để kết nối điều khiển server.
    - Port `80` (HTTP) và `443` (HTTPS) để truy cập giao diện web khách hàng.
    - Port `8080` (nếu muốn gọi API Backend trực tiếp bên ngoài).
3.  **Kết nối Terminal và cài đặt Docker:**
    Sử dụng lệnh SSH từ máy tính của bạn:
    ```bash
    ssh -i keypair.pem ubuntu@your-ec2-public-ip
    ```
    Sau đó cài đặt Docker và Docker Compose trên Ubuntu:
    ```bash
    sudo apt update
    sudo apt install docker.io docker-compose -y
    sudo usermod -aG docker ubuntu
    ```
4.  **Deploy hệ thống:**
    - Sử dụng Git clone dự án về máy chủ EC2.
    - Tạo các file cấu hình và chạy lệnh `docker-compose up -d --build`. Hệ thống FoxStyle của bạn sẽ chạy công khai trên địa chỉ IP của EC2.
