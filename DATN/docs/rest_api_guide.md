# HƯỚNG DẪN CHI TIẾT THIẾT KẾ VÀ SỬ DỤNG REST WEB API
## Nguyên lý REST, Thiết kế Endpoints, Code mẫu Backend (Spring Boot) & Frontend (Axios)

Tài liệu này cung cấp kiến thức nền tảng và hướng dẫn thực hành chi tiết về **REST API (Representational State Transfer Application Programming Interface)**. Đây là tài liệu quy chuẩn giúp nhóm thống nhất cách viết API ở Backend, cách gọi API ở Frontend và cách viết tài liệu báo cáo thuyết minh đồ án tốt nghiệp.

---

## PHẦN 1: REST API LÀ GÌ? CÁC NGUYÊN TẮC CỐT LÕI

**REST (Representational State Transfer)** là một phong cách kiến trúc thiết kế phần mềm phục vụ cho việc giao tiếp giữa các hệ thống máy tính qua môi trường internet (thông qua giao thức HTTP). Hệ thống cung cấp API theo chuẩn này được gọi là **RESTful API**.

### 1.1. Các nguyên tắc ràng buộc của hệ thống RESTful
1.  **Client - Server Separation (Kiến trúc Khách - Chủ độc lập):** Frontend (Client) và Backend (Server) hoạt động tách biệt hoàn toàn. Frontend lo giao diện và trải nghiệm người dùng, Backend lo cơ sở dữ liệu và xử lý nghiệp vụ. Hai bên giao tiếp với nhau duy nhất qua các HTTP request.
2.  **Statelessness (Không trạng thái):** Server không lưu trữ bất kỳ thông tin ngữ cảnh nào về phiên làm việc của Client (không dùng Session của Server). Mỗi request gửi lên từ Client phải chứa đầy đủ thông tin cần thiết để Server hiểu và xử lý (ví dụ: đính kèm chuỗi xác thực JWT Token trong Header).
3.  **Uniform Interface (Giao diện đồng nhất):** Các tài nguyên (Resource) trên hệ thống phải được định vị bằng một URL duy nhất và được thao tác bằng các phương thức HTTP chuẩn hóa.
4.  **Cacheability (Khả năng lưu trữ bộ nhớ đệm):** Dữ liệu phản hồi từ Server phải tự định nghĩa xem có cho phép lưu trữ tạm thời (cache) ở phía Client hay không để tăng tốc độ phản hồi cho những lần truy cập sau.

---

## PHẦN 2: THÀNH PHẦN CỦA HTTP REQUEST & RESPONSE TRONG REST

Mọi giao tiếp qua REST API đều thực hiện thông qua việc gửi các gói tin HTTP Request từ Client và nhận về HTTP Response từ Server.

### 2.1. Cấu trúc của HTTP Request
*   **Request URL (Đường dẫn):** Chỉ ra tài nguyên cần thao tác (ví dụ: `/api/v1/products`).
*   **HTTP Method (Phương thức truyền tin):**
    *   `GET`: Yêu cầu lấy dữ liệu từ Server (không làm thay đổi dữ liệu dưới DB).
    *   `POST`: Tạo mới một tài nguyên trên Server.
    *   `PUT`: Cập nhật toàn bộ thông tin của một tài nguyên hiện có.
    *   `PATCH`: Cập nhật một phần thông tin của tài nguyên (ví dụ: chỉ cập nhật trạng thái).
    *   `DELETE`: Xóa bỏ tài nguyên khỏi Server.
*   **Request Headers (Thông tin bổ trợ gói tin):**
    *   `Content-Type: application/json`: Khai báo dữ liệu gửi lên định dạng JSON.
    *   `Authorization: Bearer <JWT_Token>`: Gửi kèm token xác thực của người dùng.
*   **Request Body (Thân gói tin):** Dữ liệu JSON gửi lên khi dùng phương thức `POST`, `PUT`, hoặc `PATCH` (không dùng cho `GET` và `DELETE`).

---

### 2.2. Cấu trúc của HTTP Response
*   **HTTP Status Code (Mã trạng thái):** Cho biết kết quả xử lý của Server:
    *   `200 OK`: Xử lý thành công và trả về dữ liệu.
    *   `201 Created`: Tạo mới tài nguyên thành công (thường trả về sau POST).
    *   `204 No Content`: Xử lý thành công nhưng không cần trả dữ liệu về (thường dùng cho DELETE).
    *   `400 Bad Request`: Lỗi cú pháp dữ liệu gửi lên hoặc không vượt qua vòng validate.
    *   `401 Unauthorized`: Chưa đăng nhập hoặc token xác thực hết hạn.
    *   `403 Forbidden`: Đã đăng nhập nhưng không đủ quyền truy cập (ví dụ: Customer vào trang Admin).
    *   `404 Not Found`: Không tìm thấy đường dẫn hoặc tài nguyên yêu cầu.
    *   `500 Internal Server Error`: Lỗi phát sinh trong code Backend.
*   **Response Body (Thân gói tin trả về):** Chuỗi JSON chứa dữ liệu kết quả mà Frontend yêu cầu.

---

## PHẦN 3: NGUYÊN TẮC THIẾT KẾ ENDPOINTS REST API CHUẨN

Để thiết kế hệ thống API trực quan và chuyên nghiệp, nhóm cần tuân thủ các quy tắc sau:

### 3.1. Quy tắc đặt tên đường dẫn (URL)
1.  **Sử dụng danh từ số nhiều** đại diện cho tập hợp tài nguyên thay vì động từ:
    *   *Chuẩn:* `GET /api/v1/products`
    *   *Không chuẩn:* `GET /api/v1/getAllProducts` hoặc `POST /api/v1/createProduct`
2.  **Sử dụng ID làm tham số đường dẫn (Path Parameter)** khi thao tác với một đối tượng cụ thể:
    *   Lấy chi tiết sản phẩm ID = 5: `GET /api/v1/products/5`
    *   Xóa danh mục ID = 2: `DELETE /api/v1/categories/2`
3.  **Thể hiện mối quan hệ phân cấp bằng đường dẫn con (Sub-resources):**
    *   Lấy danh sách đánh giá của sản phẩm ID = 5: `GET /api/v1/products/5/reviews`
4.  **Sử dụng tham số truy vấn (Query Parameters)** cho việc lọc, sắp xếp, phân trang:
    *   Lấy sản phẩm thuộc danh mục 'ao', trang số 1, kích thước trang 10 cái, sắp xếp theo giá tăng dần:
        `GET /api/v1/products?category=ao&page=1&size=10&sort=price,asc`

---

## PHẦN 4: HƯỚNG DẪN VIẾT REST API Ở BACKEND (SPRING BOOT)

Trong Spring Boot, chúng ta sử dụng annotation `@RestController` để tạo các API trả về dữ liệu định dạng JSON trực tiếp cho Client.

### 4.1. Chuẩn hóa dữ liệu trả về (Standard API Response Wrapper)
Tạo class `ApiResponse.java` trong package `dto/response` để thống nhất định dạng dữ liệu trả về:

```java
package com.foxstyle.api.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApiResponse<T> {
    private String status;              // "success" hoặc "error"
    private String message;             // Thông báo chi tiết
    private T data;                     // Dữ liệu payload thực tế (mảng, object hoặc null)
    private LocalDateTime timestamp;    // Thời gian phản hồi
}
```

---

### 4.2. Viết Controller xử lý API sản phẩm (`ProductController.java`)
```java
package com.foxstyle.api.controller;

import com.foxstyle.api.dto.response.ApiResponse;
import com.foxstyle.api.entity.Product;
import com.foxstyle.api.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@CrossOrigin(origins = "*") // Cho phép gọi API từ mọi domain khác (CORS)
public class ProductController {

    @Autowired
    private ProductService productService;

    // 1. API lấy toàn bộ danh sách sản phẩm (có lọc theo danh mục tùy chọn)
    @GetMapping
    public ResponseEntity<ApiResponse<List<Product>>> getAllProducts(
            @RequestParam(value = "category", required = false) String category) {
        
        List<Product> products = productService.getProducts(category);
        
        ApiResponse<List<Product>> response = ApiResponse.<List<Product>>builder()
                .status("success")
                .message("Lấy danh sách sản phẩm thành công")
                .data(products)
                .timestamp(LocalDateTime.now())
                .build();
                
        return ResponseEntity.ok(response);
    }

    // 2. API lấy chi tiết sản phẩm theo ID (Path Parameter)
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> getProductById(@PathVariable("id") int id) {
        Product product = productService.findById(id);
        
        ApiResponse<Product> response = ApiResponse.<Product>builder()
                .status("success")
                .message("Lấy chi tiết sản phẩm thành công")
                .data(product)
                .timestamp(LocalDateTime.now())
                .build();
                
        return ResponseEntity.ok(response);
    }

    // 3. API thêm mới một sản phẩm (Yêu cầu Request Body JSON)
    @PostMapping
    public ResponseEntity<ApiResponse<Product>> createProduct(@RequestBody Product newProduct) {
        Product savedProduct = productService.save(newProduct);
        
        ApiResponse<Product> response = ApiResponse.<Product>builder()
                .status("success")
                .message("Tạo sản phẩm mới thành công")
                .data(savedProduct)
                .timestamp(LocalDateTime.now())
                .build();
                
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
```

---

## PHẦN 5: HƯỚNG DẪN GỌI REST API Ở FRONTEND (REACT & AXIOS)

Sử dụng thư viện **Axios** kết hợp từ khóa `async/await` để thực thi gọi API bất đồng bộ (Asynchronous) một cách tối ưu.

### 5.1. Định nghĩa file gọi API sản phẩm (`src/app/api/productApi.ts`)
```typescript
import axiosClient from "./axiosClient"; // Import Client đã cấu hình Interceptor ở tài liệu trước

export const productApi = {
  // 1. Hàm lấy danh sách sản phẩm (có truyền tham số lọc qua params)
  getAll: (categoryName?: string) => {
    const url = "/v1/products";
    return axiosClient.get(url, {
      params: { category: categoryName } // Tạo request dạng: /api/v1/products?category=ao
    });
  },

  // 2. Hàm lấy chi tiết sản phẩm theo ID
  getById: (id: number) => {
    const url = `/v1/products/${id}`;
    return axiosClient.get(url);
  },

  // 3. Hàm tạo mới một sản phẩm (gửi kèm JSON object sản phẩm)
  create: (data: any) => {
    const url = "/v1/products";
    return axiosClient.post(url, data);
  }
};
```

---

### 5.2. Cách sử dụng API trong React Component (`ProductsPage.tsx`)
```tsx
import { useEffect, useState } from "react";
import { productApi } from "../api/productApi";

interface Product {
  productId: number;
  productName: string;
  price: number;
  imageUrl: string;
}

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Gọi API bất đồng bộ
        const response: any = await productApi.getAll();
        
        if (response.status === "success") {
          setProducts(response.data); // Gán danh sách sản phẩm vào State
        }
      } catch (err: any) {
        setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="text-center py-10">Đang tải dữ liệu sản phẩm...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {products.map((prod) => (
        <div key={prod.productId} className="border rounded-lg p-4 shadow-sm">
          <img src={prod.imageUrl} alt={prod.productName} className="w-full h-48 object-cover rounded-md" />
          <h3 className="font-semibold mt-2">{prod.productName}</h3>
          <p className="text-orange-600 font-bold mt-1">{prod.price.toLocaleString("vi-VN")}đ</p>
        </div>
      ))}
    </div>
  );
}
```

---

## PHẦN 6: TỰ ĐỘNG SINH TÀI LIỆU API VỚI SWAGGER UI (OPENAPI)

Thay vì viết tài liệu mô tả API bằng tay tốn thời gian và dễ lỗi thời, bạn nên cấu hình thư viện **springdoc-openapi** để Spring Boot tự động phân tích code và hiển thị một trang Web mô tả giao tiếp API cho Frontend sử dụng và test trực quan.

### 6.1. Cài đặt thư viện vào file `pom.xml` của Backend
Thêm dependency sau vào dự án Spring Boot Maven:
```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.3.0</version>
</dependency>
```

### 6.2. Xem tài liệu API
Sau khi chạy ứng dụng Spring Boot, Swagger UI tự động tạo trang tài liệu tại đường dẫn:
👉 **`http://localhost:8080/swagger-ui/index.html`**

*Tại đây, lập trình viên Frontend có thể bấm chọn từng API, xem cấu trúc dữ liệu Request/Response chuẩn và bấm nút **"Try it out"** để chạy thử API ngay lập tức mà không cần dùng Postman.*
