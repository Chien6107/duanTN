# HƯỚNG DẪN CHI TIẾT LẬP TRÌNH BACKEND (SPRING BOOT REST API)
## Lập trình từng phân tầng: Entity, Repository, DTO, Service, Controller & Exception Handling

Tài liệu này hướng dẫn chi tiết cách viết code Backend sử dụng **Spring Boot** kết hợp **Spring Data JPA** để hiện thực hóa cơ sở dữ liệu `foxstyle_db` đã thiết kế. Nội dung bao gồm mã nguồn mẫu chuẩn hóa của từng tầng kiến trúc, giúp các thành viên trong nhóm hiểu rõ quy trình và viết code đồng bộ.

---

## PHẦN 1: CẤU HÌNH DEPENDENCY & KẾT NỐI DATABASE

### 1.1. Cấu hình các thư viện cốt lõi (`pom.xml`)
Trong file `pom.xml` của dự án Spring Boot, đảm bảo tích hợp đầy đủ các thư viện sau:

```xml
<dependencies>
    <!-- Web API -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>

    <!-- Giao tiếp Cơ sở dữ liệu JPA -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>

    <!-- Trình điều khiển cơ sở dữ liệu Microsoft SQL Server -->
    <dependency>
        <groupId>com.microsoft.sqlserver</groupId>
        <artifactId>mssql-jdbc</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- Thư viện tự động sinh Getter, Setter, Constructor (Lombok) -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>

    <!-- Thư viện kiểm tra ràng buộc dữ liệu gửi lên (Validation) -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
</dependencies>
```

---

## PHẦN 2: LẬP TRÌNH TẦNG ENTITY (ÁNH XẠ CƠ SỞ DỮ LIỆU)

Tầng Entity chứa các class Java ánh xạ trực tiếp 1-1 với các bảng trong SQL Server thông qua cơ chế JPA Hibernate. 

### 2.1. Code mẫu Entity Sản phẩm chính (`Product.java`)
```java
package com.foxstyle.api.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "product_id")
    private Integer productId;

    @Column(name = "product_name", nullable = false, length = 150)
    private String productName;

    @Column(name = "price", nullable = false, precision = 12, scale = 2)
    private BigDecimal price;

    @Column(name = "original_price", precision = 12, scale = 2)
    private BigDecimal originalPrice;

    @Column(name = "description", columnDefinition = "NVARCHAR(MAX)")
    private String description;

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @Column(name = "material", length = 100)
    private String material;

    @Column(name = "origin", length = 100)
    private String origin;

    @Column(name = "status", nullable = false)
    private Byte status = 1; // 1: Đang bán, 0: Ngừng bán

    // Liên kết 1-nhiều với bảng Biến thể sản phẩm (Màu sắc, kích cỡ)
    // CascadeType.ALL: Khi xóa sản phẩm sẽ tự động xóa sạch các biến thể đi kèm
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductVariant> variants;

    // Liên kết 1-nhiều với danh sách ảnh phụ chi tiết
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProductImage> images;
}
```

---

### 2.2. Code mẫu Entity Biến thể Sản phẩm (`ProductVariant.java`)
```java
package com.foxstyle.api.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_variants")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "variant_id")
    private Integer variantId;

    // Liên kết nhiều-1 ngược lại bảng Products
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    @JsonIgnore // Ngăn không cho vòng lặp tuần hoàn khi chuyển sang JSON
    private Product product;

    @Column(name = "color", nullable = false, length = 50)
    private String color;

    @Column(name = "size", nullable = false, length = 20)
    private String size;

    @Column(name = "quantity", nullable = false)
    private Integer quantity = 0; // Tồn kho của màu-size này

    @Column(name = "sku", length = 100, unique = true)
    private String sku;
}
```

---

## PHẦN 3: LẬP TRÌNH TẦNG REPOSITORY (TRUY VẤN DỮ LIỆU)

Tầng Repository kế thừa interface `JpaRepository` của Spring Data JPA. Nó tự động cung cấp các hàm CRUD cơ bản (`save`, `findById`, `findAll`, `deleteById`) mà không cần viết mã SQL.

### 3.1. Code mẫu truy vấn biến thể sản phẩm (`ProductVariantRepository.java`)
```java
package com.foxstyle.api.repository;

import com.foxstyle.api.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Integer> {

    // Tìm kiếm biến thể chính xác theo màu sắc và kích cỡ của sản phẩm
    Optional<ProductVariant> findByProductProductIdAndColorAndSize(Integer productId, String color, String size);

    // Truy vấn Custom JPQL: Tìm các biến thể sắp hết hàng (tồn kho dưới mức cảnh báo)
    @Query("SELECT pv FROM ProductVariant pv WHERE pv.quantity <= :threshold")
    List<ProductVariant> findLowStockVariants(@Param("threshold") int threshold);
}
```

---

## PHẦN 4: LẬP TRÌNH TẦNG DTO & SERVICE (LOGIC NGHIỆP VỤ)

Tầng DTO định nghĩa cấu trúc dữ liệu truyền nhận. Tầng Service xử lý toàn bộ các logic nghiệp vụ phức tạp của hệ thống (ví dụ: đặt hàng, trừ tồn kho, tính toán giảm giá của coupon).

### 4.1. Code mẫu DTO Đặt hàng gửi lên từ Frontend (`CheckoutRequest.java`)
```java
package com.foxstyle.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import java.util.List;

@Data
public class CheckoutRequest {

    @NotBlank(message = "Tên người nhận không được để trống")
    private String recipientName;

    @NotBlank(message = "Số điện thoại nhận hàng không được để trống")
    private String recipientPhone;

    @NotBlank(message = "Địa chỉ giao hàng không được để trống")
    private String shippingAddress;

    private String couponCode; // Có thể null nếu không áp mã giảm giá

    @NotEmpty(message = "Giỏ hàng thanh toán không được rỗng")
    private List<CartItemDto> items;

    @Data
    public static class CartItemDto {
        private Integer variantId; // Mã biến thể cụ thể đã chọn size/màu
        private Integer quantity;  // Số lượng mua
    }
}
```

---

### 4.2. Code mẫu Tầng Service xử lý nghiệp vụ Đặt hàng (`OrderService.java`)
```java
package com.foxstyle.api.service;

import com.foxstyle.api.dto.request.CheckoutRequest;
import com.foxstyle.api.entity.*;
import com.foxstyle.api.repository.*;
import com.foxstyle.api.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductVariantRepository variantRepository;

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private UserRepository userRepository;

    // Annotation @Transactional giúp đảm bảo tính toàn vẹn: 
    // Nếu xảy ra bất kỳ lỗi nào trong quá trình đặt hàng, toàn bộ thao tác ghi DB sẽ bị hủy bỏ (Rollback)
    @Transactional
    public Order createOrder(CheckoutRequest request, Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException("Không tìm thấy tài khoản người dùng"));

        Order order = new Order();
        order.setUser(user);
        order.setRecipientName(request.getRecipientName());
        order.setRecipientPhone(request.getRecipientPhone());
        order.setShippingAddress(request.getShippingAddress());
        order.setStatus((byte) 0); // 0: Chờ duyệt/Chờ thanh toán
        order.setOrderDate(LocalDateTime.now());

        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderDetail> orderDetails = new ArrayList<>();

        // 1. Duyệt qua từng sản phẩm trong yêu cầu thanh toán
        for (CheckoutRequest.CartItemDto itemDto : request.getItems()) {
            ProductVariant variant = variantRepository.findById(itemDto.getVariantId())
                    .orElseThrow(() -> new BadRequestException("Biến thể sản phẩm không tồn tại"));

            // Kiểm tra hàng tồn kho xem còn đủ không
            if (variant.getQuantity() < itemDto.getQuantity()) {
                throw new BadRequestException("Sản phẩm màu " + variant.getColor() + " size " + variant.getSize() + " không đủ số lượng trong kho");
            }

            // Trừ số lượng tồn kho của biến thể
            variant.setQuantity(variant.getQuantity() - itemDto.getQuantity());
            variantRepository.save(variant);

            // Tính tiền tạm tính
            BigDecimal itemPrice = variant.getProduct().getPrice();
            BigDecimal itemTotal = itemPrice.multiply(new BigDecimal(itemDto.getQuantity()));
            subtotal = subtotal.add(itemTotal);

            // Tạo chi tiết dòng hóa đơn
            OrderDetail detail = new OrderDetail();
            detail.setOrder(order);
            detail.setVariant(variant);
            detail.setQuantity(itemDto.getQuantity());
            detail.setPrice(itemPrice);
            orderDetails.add(detail);
        }

        order.setOrderDetails(orderDetails);

        // 2. Xử lý mã giảm giá Coupon (nếu có)
        BigDecimal discount = BigDecimal.ZERO;
        if (request.getCouponCode() != null && !request.getCouponCode().trim().isEmpty()) {
            Coupon coupon = couponRepository.findByCouponCodeAndStatus(request.getCouponCode(), (byte) 1)
                    .orElseThrow(() -> new BadRequestException("Mã giảm giá không tồn tại hoặc đã bị khóa"));

            // Kiểm tra hạn sử dụng
            if (LocalDateTime.now().isAfter(coupon.getEndDate()) || LocalDateTime.now().isBefore(coupon.getStartDate())) {
                throw new BadRequestException("Mã giảm giá đã hết hạn sử dụng");
            }

            // Kiểm tra giá trị đơn tối thiểu
            if (subtotal.compareTo(coupon.getMinOrderValue()) < 0) {
                throw new BadRequestException("Đơn hàng chưa đạt giá trị tối thiểu " + coupon.getMinOrderValue() + "đ để dùng mã");
            }

            // Tính toán số tiền được giảm
            if (coupon.getDiscountType() == 1) { // Giảm tiền mặt cố định
                discount = coupon.getDiscountValue();
            } else if (coupon.getDiscountType() == 2) { // Giảm theo %
                discount = subtotal.multiply(coupon.getDiscountValue().divide(new BigDecimal(100)));
                // Giới hạn mức giảm tối đa nếu có cấu hình max_discount_value
                if (coupon.getMaxDiscountValue() != null && discount.compareTo(coupon.getMaxDiscountValue()) > 0) {
                    discount = coupon.getMaxDiscountValue();
                }
            }
            
            // Tăng số lượt đã sử dụng của coupon lên 1
            coupon.setUsedCount(coupon.getUsedCount() + 1);
            couponRepository.save(coupon);
            order.setCoupon(coupon);
        }

        order.setDiscountAmount(discount);
        
        // Phí vận chuyển đồng giá
        BigDecimal shippingFee = new BigDecimal(30000); 
        order.setShippingFee(shippingFee);

        // Tổng tiền thanh toán cuối cùng = Tiền hàng - Giảm giá + Phí vận chuyển
        BigDecimal totalAmount = subtotal.subtract(discount).add(shippingFee);
        if (totalAmount.compareTo(BigDecimal.ZERO) < 0) {
            totalAmount = BigDecimal.ZERO;
        }
        order.setTotalAmount(totalAmount);

        // Lưu đơn hàng vào database
        return orderRepository.save(order);
    }
}
```

---

## PHẦN 5: LẬP TRÌNH TẦNG CONTROLLER (REST ENDPOINTS)

Controller tiếp nhận yêu cầu HTTP từ Frontend, chuyển đổi dữ liệu và gọi sang lớp Service để thực hiện nghiệp vụ.

### 5.1. Code mẫu Controller đặt hàng (`OrderController.java`)
```java
package com.foxstyle.api.controller;

import com.foxstyle.api.dto.request.CheckoutRequest;
import com.foxstyle.api.dto.response.ApiResponse;
import com.foxstyle.api.entity.Order;
import com.foxstyle.api.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<Order>> checkout(
            @Valid @RequestBody CheckoutRequest request,
            @RequestAttribute("userId") Integer userId) { // userId được trích xuất từ JWT Filter trước đó
        
        Order order = orderService.createOrder(request, userId);

        ApiResponse<Order> response = ApiResponse.<Order>builder()
                .status("success")
                .message("Tạo đơn hàng thành công")
                .data(order)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
```

---

## PHẦN 6: CƠ CHẾ XỬ LÝ LỖI TOÀN CỤC (GLOBAL EXCEPTION HANDLING)

Để bảo vệ hệ thống khỏi việc hiển thị thông báo lỗi Java thô sơ (Stacktrace) lên màn hình khách hàng và thống nhất chuẩn trả về khi xảy ra lỗi.

### 6.1. Định nghĩa Exception Custom (`BadRequestException.java`)
```java
package com.foxstyle.api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}
```

### 6.2. Class xử lý lỗi tập trung (`GlobalExceptionHandler.java`)
```java
package com.foxstyle.api.exception;

import com.foxstyle.api.dto.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. Bắt lỗi Validation (Ví dụ gửi thiếu thông tin trường bắt buộc)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        String errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .collect(Collectors.joining(", "));

        ApiResponse<String> response = ApiResponse.<String>builder()
                .status("error")
                .message("Dữ liệu đầu vào không hợp lệ")
                .data(errors)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    // 2. Bắt lỗi BadRequestException tự định nghĩa trong logic nghiệp vụ
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadRequestException(BadRequestException ex) {
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .status("error")
                .message(ex.getMessage())
                .data(null)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    // 3. Bắt toàn bộ các lỗi Runtime chưa được định nghĩa khác
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleAllExceptions(Exception ex) {
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .status("error")
                .message("Đã xảy ra lỗi hệ thống nghiêm trọng: " + ex.getMessage())
                .data(null)
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
```
