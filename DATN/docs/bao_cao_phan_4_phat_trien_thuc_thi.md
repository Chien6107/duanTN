# BÃO CÃO PHáº¦N 4: PHÃT TRIá»‚N VÃ€ THá»°C THI Há»† THá»NG PHáº¦N Má»€M FOXSTYLE
## Dá»± Ã¡n: Há»‡ thá»‘ng ThÆ°Æ¡ng máº¡i Äiá»‡n tá»­ Thá»i trang FoxStyle
**MÃ£ dá»± Ã¡n:** FOXSTYLE-DATN  
**Loáº¡i Ä‘á» tÃ i:** XÃ¢y dá»±ng Pháº§n má»m (Software Development Project)  
**NgÃ y cáº­p nháº­t:** 31/07/2026  
**Tráº¡ng thÃ¡i:** TÃ€I LIá»†U CHÃNH THá»¨C BÃO CÃO Äá»’ ÃN  

---

## Má»¤C Lá»¤C
- [4.1. MÃ” Táº¢ QUÃ TRÃŒNH CÃ€I Äáº¶T MÃ”I TRÆ¯á»œNG & Cáº¤U HÃŒNH PHÃT TRIá»‚N](#41-mÃ´-táº£-quÃ¡-trÃ¬nh-cÃ i-Ä‘áº·t-mÃ´i-trÆ°á»ng--cáº¥u-hÃ¬nh-phÃ¡t-triá»ƒn)
- [4.2. MÃ” Táº¢ CHI TIáº¾T QUÃ TRÃŒNH CÃ€I Äáº¶T CODE (CODE IMPLEMENTATION)](#42-mÃ´-táº£-chi-tiáº¿t-quÃ¡-trÃ¬nh-cÃ i-Ä‘áº·t-code-code-implementation)
  - [4.2.1. Module An ninh, XÃ¡c thá»±c & PhÃ¡t hÃ nh JWT Token (Security Layer)](#421-module-an-ninh-xÃ¡c-thá»±c--phÃ¡t-hÃ nh-jwt-token-security-layer)
  - [4.2.2. Module Dá»¯ liá»‡u JPA Entity & Truy váº¥n Repository (Data Layer)](#422-module-dá»¯-liá»‡u-jpa-entity--truy-váº¥n-repository-data-layer)
  - [4.2.3. Module Xá»­ lÃ½ Nghiá»‡p vá»¥ Äáº·t hÃ ng & Giao dá»‹ch Transaction (Service Layer)](#423-module-xá»­-lÃ½-nghiá»‡p-vá»¥-Ä‘áº·t-hÃ ng--giao-dá»‹ch-transaction-service-layer)
  - [4.2.4. Module TÃ­ch há»£p Cá»•ng Thanh toÃ¡n PayOS & Webhook Callback (Payment Layer)](#424-module-tÃ­ch-há»£p-cá»•ng-thanh-toÃ¡n-payos--webhook-callback-payment-layer)
  - [4.2.5. Module RESTful Controller & API Endpoints (Presentation Layer)](#425-module-restful-controller--api-endpoints-presentation-layer)
  - [4.2.6. Module Frontend React Interceptors & State Management (Frontend SPA Layer)](#426-module-frontend-react-interceptors--state-management-frontend-spa-layer)
- [4.3. MÃ” Táº¢ HOáº T Äá»˜NG TÃ™Y BIáº¾N Há»† THá»NG CHO THÆ¯Æ NG HIá»†U THá»œI TRANG FOXSTYLE](#43-mÃ´-táº£-hoáº¡t-Ä‘á»™ng-tÃ¹y-biáº¿n-há»‡-thá»‘ng-cho-thÆ°Æ¡ng-hiá»‡u-thá»i-trang-foxstyle)
- [4.4. MÃ” Táº¢ HOáº T Äá»˜NG TRIá»‚N KHAI VÃ€ ÄÃ“NG GÃ“I Há»† THá»NG (DEPLOYMENT)](#44-mÃ´-táº£-hoáº¡t-Ä‘á»™ng-triá»ƒn-khai-vÃ -Ä‘Ã³ng-gÃ³i-há»‡-thá»‘ng-deployment)

---

## 4.1. MÃ” Táº¢ QUÃ TRÃŒNH CÃ€I Äáº¶T MÃ”I TRÆ¯á»œNG & Cáº¤U HÃŒNH PHÃT TRIá»‚N

Dá»± Ã¡n pháº§n má»m **FoxStyle Fashion Store** Ä‘Æ°á»£c phÃ¡t triá»ƒn theo mÃ´ hÃ¬nh Decoupled Architecture. QuÃ¡ trÃ¬nh thiáº¿t láº­p mÃ´i trÆ°á»ng phÃ¡t triá»ƒn bao gá»“m cÃ¡c thÃ nh pháº§n sau:

### 1. MÃ´i trÆ°á»ng Backend (Spring Boot Service):
- **JDK:** Java Development Kit 17 (OpenJDK 17 LTS).
- **Framework:** Spring Boot version 3.2.5.
- **CÃ´ng cá»¥ quáº£n lÃ½ thÆ° viá»‡n:** Apache Maven 3.8.x.
- **Há»‡ quáº£n trá»‹ CSDL:** Microsoft SQL Server 2019/2022 (Khá»Ÿi cháº¡y script `foxstyle_db.sql`).
- **IDE:** IntelliJ IDEA 2024 / Visual Studio Code vá»›i cÃ¡c Extension Lombok, Spring Boot Extension Pack.

### 2. MÃ´i trÆ°á»ng Frontend (React Single Page Application):
- **Node.js Environment:** Node.js v18.x / v20.x LTS & npm v9.x.
- **Framework & Build tool:** React 18.3 & Vite 6.3.
- **UI & Styling:** TailwindCSS 4, Radix UI Primitives, Lucide-React Icons, Sonner Notifications, Recharts.

---

## 4.2. MÃ” Táº¢ CHI TIáº¾T QUÃ TRÃŒNH CÃ€I Äáº¶T CODE (CODE IMPLEMENTATION)

---

### 4.2.1. Module An ninh, XÃ¡c thá»±c & PhÃ¡t hÃ nh JWT Token (Security Layer)

#### Ä‘oáº¡n code 1: Class `JwtTokenProvider.java`
- **Má»¥c Ä‘Ã­ch cá»§a code:** Chá»‹u trÃ¡ch nhiá»‡m sinh mÃ£ JWT Access Token chá»©a thÃ´ng tin User ID, Email, Role vÃ  kÃ½ mÃ£ hÃ³a báº±ng thuáº­t toÃ¡n `HMAC-SHA512`. Äá»“ng thá»i cung cáº¥p phÆ°Æ¡ng thá»©c giáº£i mÃ£ vÃ  kiá»ƒm tra tÃ­nh há»£p lá»‡ cá»§a Token tá»« Request Client.
- **Pháº¡m vi Ã¡p dá»¥ng:** Ãp dá»¥ng dÃ¹ng chung cho **toÃ n bá»™ cÃ¡c API yÃªu cáº§u xÃ¡c thá»±c** trong á»©ng dá»¥ng (`/api/v1/cart/**`, `/api/v1/orders/**`, `/api/v1/users/**`, `/api/v1/admin/**`).

```java
package com.foxstyle.api.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

/**
 * Lá»›p tiá»‡n Ã­ch quáº£n lÃ½ vÃ  phÃ¡t hÃ nh JWT Token cho há»‡ thá»‘ng FoxStyle.
 * MÃ£ hÃ³a Token theo chuáº©n HMAC-SHA512 vá»›i thá»i háº¡n 24 giá».
 */
@Component
public class JwtTokenProvider {

    // Láº¥y chuá»—i Secret Key bÃ­ máº­t tá»« file application.properties
    @Value("${app.jwt.secret:FoxStyleSecretKeyMustBeVeryLongAndSecureForHMACSHA512Algorithm2026}")
    private String jwtSecret;

    // Thá»i gian sá»‘ng cá»§a Token (24 giá» = 86,400,000 miligiÃ¢y)
    @Value("${app.jwt.expiration-ms:86400000}")
    private int jwtExpirationMs;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    /**
     * Má»¤C ÄÃCH: Sinh mÃ£ JWT Token tá»« thÃ´ng tin ngÆ°á»i dÃ¹ng Ä‘Ã£ xÃ¡c thá»±c thÃ nh cÃ´ng.
     */
    public String generateToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        // Khá»Ÿi táº¡o chuá»—i JWT chá»©a thÃ´ng tin UserId, Email, Roles
        return Jwts.builder()
                .setSubject(Long.toString(userPrincipal.getId()))
                .claim("email", userPrincipal.getEmail())
                .claim("roles", userPrincipal.getAuthorities())
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    /**
     * Má»¤C ÄÃCH: TrÃ­ch xuáº¥t User ID tá»« chuá»—i JWT Token.
     */
    public Long getUserIdFromJWT(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();

        return Long.parseLong(claims.getSubject());
    }

    /**
     * Má»¤C ÄÃCH: Kiá»ƒm tra Token cÃ³ há»£p lá»‡, nguyÃªn váº¹n vÃ  chÆ°a háº¿t háº¡n hay khÃ´ng.
     */
    public boolean validateToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(authToken);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            // Log cáº£nh bÃ¡o token khÃ´ng há»£p lá»‡ hoáº·c háº¿t háº¡n
            return false;
        }
    }
}
```

---

### 4.2.2. Module Dá»¯ liá»‡u JPA Entity & Truy váº¥n Repository (Data Layer)

#### Ä‘oáº¡n code 2: Entity `ProductVariant.java`
- **Má»¥c Ä‘Ã­ch cá»§a code:** Khai bÃ¡o cáº¥u hÃ¬nh ORM Ã¡nh xáº¡ 1-1 vá»›i báº£ng `product_variants` trong CSDL SQL Server, quáº£n lÃ½ kho chi tiáº¿t theo thuá»™c tÃ­nh MÃ u sáº¯c, KÃ­ch thÆ°á»›c (Size), mÃ£ SKU vÃ  sá»‘ lÆ°á»£ng tá»“n kho kháº£ dá»¥ng (`quantity`).
- **Pháº¡m vi Ã¡p dá»¥ng:** Äáº¡i diá»‡n máº«u cho **30 lá»›p JPA Entities** trong dá»± Ã¡n (`User.java`, `Product.java`, `Order.java`, `Cart.java`, `Coupon.java`...).

```java
package com.foxstyle.api.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

/**
 * Entity Ã¡nh xáº¡ báº£ng product_variants trong CSDL MS SQL Server.
 * Quáº£n lÃ½ kho tá»“n theo cáº·p thuá»™c tÃ­nh MÃ u sáº¯c - Size.
 */
@Entity
@Table(name = "product_variants", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"product_id", "color", "size"}),
    @UniqueConstraint(columnNames = {"sku"})
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "variant_id")
    private Long variantId;

    // LiÃªn káº¿t n-1 tá»›i báº£ng sáº£n pháº©m chÃ­nh products
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "color", nullable = false, length = 50)
    private String color;

    @Column(name = "size", nullable = false, length = 20)
    private String size;

    // Sá»‘ lÆ°á»£ng tá»“n kho (RÃ ng buá»™c CHECK quantity >= 0)
    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    // MÃ£ SKU quáº£n lÃ½ kho duy nháº¥t
    @Column(name = "sku", nullable = false, length = 100)
    private String sku;

    @Column(name = "price_override", precision = 18, scale = 2)
    private BigDecimal priceOverride;
}
```

#### Ä‘oáº¡n code 3: Repository `ProductRepository.java`
- **Má»¥c Ä‘Ã­ch cá»§a code:** Khai bÃ¡o táº§ng truy xuáº¥t dá»¯ liá»‡u `JpaRepository` há»— trá»£ truy váº¥n lá»c Ä‘á»™ng sáº£n pháº©m Ä‘a tiÃªu chÃ­ (danh má»¥c, khoáº£ng giÃ¡, tá»« khÃ³a tÃ¬m kiáº¿m) báº±ng `JpaSpecificationExecutor`.
- **Pháº¡m vi Ã¡p dá»¥ng:** Äáº¡i diá»‡n máº«u cho **30 JPA Repositories** trong dá»± Ã¡n (`UserRepository`, `OrderRepository`, `CouponRepository`, `CartRepository`...).

```java
package com.foxstyle.api.repository;

import com.foxstyle.api.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * JPA Repository quáº£n lÃ½ truy váº¥n báº£ng products trong SQL Server.
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {

    // Má»¤C ÄÃCH: Truy váº¥n tÃ¬m kiáº¿m sáº£n pháº©m theo tá»« khÃ³a gáº§n Ä‘Ãºng
    @Query("SELECT p FROM Product p WHERE p.status = 1 AND " +
           "(LOWER(p.productName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Product> searchProductsByKeyword(@Param("keyword") String keyword);

    // Má»¤C ÄÃCH: Láº¥y danh sÃ¡ch sáº£n pháº©m Ä‘ang má»Ÿ bÃ¡n thuá»™c má»™t danh má»¥c
    List<Product> findByCategoryCategoryIdAndStatus(Long categoryId, Integer status);
}
```

---

### 4.2.3. Module Xá»­ lÃ½ Nghiá»‡p vá»¥ Äáº·t hÃ ng & Giao dá»‹ch Transaction (Service Layer)

#### Ä‘oáº¡n code 4: Service Implementation `OrderServiceImpl.java` (Luá»“ng `placeOrder`)
- **Má»¥c Ä‘Ã­ch cá»§a code:** Thá»±c thi toÃ n bá»™ quy trÃ¬nh Ä‘áº·t hÃ ng: Kiá»ƒm tra tá»“n kho kháº£ dá»¥ng cá»§a biáº¿n thá»ƒ, trá»« tá»“n kho táº¡m thá»i, tÃ­nh toÃ¡n tiá»n giáº£m giÃ¡ tá»« Coupon, khá»Ÿi táº¡o Ä‘Æ¡n hÃ ng `orders` vá»›i tráº¡ng thÃ¡i `PENDING` Ä‘Æ°á»£c bá»c trong giao dá»‹ch `@Transactional` Ä‘á»ƒ Ä‘áº£m báº£o tÃ­nh nháº¥t quÃ¡n dá»¯ liá»‡u **ACID**.
- **Pháº¡m vi Ã¡p dá»¥ng:** TrÃ¬nh bÃ y máº«u cho **táº¥t cáº£ cÃ¡c phÆ°Æ¡ng thá»©c xá»­ lÃ½ nghiá»‡p vá»¥ phá»©c táº¡p** Ä‘Ã²i há»i tÃ­nh toÃ n váº¹n dá»¯ liá»‡u trong cÃ¡c Service (`CartServiceImpl`, `ProductServiceImpl`, `UserServiceImpl`).

```java
package com.foxstyle.api.service.impl;

import com.foxstyle.api.dto.request.OrderRequest;
import com.foxstyle.api.entity.*;
import com.foxstyle.api.exception.BadRequestException;
import com.foxstyle.api.repository.*;
import com.foxstyle.api.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired private OrderRepository orderRepository;
    @Autowired private ProductVariantRepository variantRepository;
    @Autowired private CouponRepository couponRepository;
    @Autowired private UserAddressRepository addressRepository;

    /**
     * Má»¤C ÄÃCH: Khá»Ÿi táº¡o Ä‘Æ¡n hÃ ng má»›i, trá»« kho tá»“n biáº¿n thá»ƒ vÃ  Ã¡p mÃ£ giáº£m giÃ¡.
     * Transactional: Äáº£m báº£o náº¿u cÃ³ lá»—i á»Ÿ báº¥t ká»³ bÆ°á»›c nÃ o, toÃ n bá»™ sáº½ Rollback.
     */
    @Override
    @Transactional
    public Order placeOrder(User user, OrderRequest request) {
        
        // 1. Kiá»ƒm tra Ä‘á»‹a chá»‰ giao hÃ ng cá»§a ngÆ°á»i dÃ¹ng
        UserAddress address = addressRepository.findById(request.getAddressId())
                .orElseThrow(() -> new BadRequestException("Äá»‹a chá»‰ giao hÃ ng khÃ´ng há»£p lá»‡!"));

        // 2. Táº¡o mÃ£ Ä‘Æ¡n hÃ ng duy nháº¥t (vÃ­ dá»¥: ORD-8A3F2B)
        String orderCode = "ORD-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();

        BigDecimal totalAmount = BigDecimal.ZERO;

        // 3. Khá»Ÿi táº¡o Ä‘á»‘i tÆ°á»£ng Ä‘Æ¡n hÃ ng
        Order order = Order.builder()
                .orderCode(orderCode)
                .user(user)
                .shippingAddress(address)
                .paymentMethod(request.getPaymentMethod())
                .paymentStatus("UNPAID")
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .build();

        // 4. Duyá»‡t qua tá»«ng máº·t hÃ ng trong Ä‘Æ¡n Ä‘á»ƒ kiá»ƒm tra tá»“n kho & trá»« kho
        for (var itemReq : request.getItems()) {
            ProductVariant variant = variantRepository.findById(itemReq.getVariantId())
                    .orElseThrow(() -> new BadRequestException("Biáº¿n thá»ƒ sáº£n pháº©m khÃ´ng tá»“n táº¡i!"));

            // Má»¤C ÄÃCH: Kiá»ƒm tra tá»“n kho kho hÃ ng
            if (variant.getQuantity() < itemReq.getQuantity()) {
                throw new BadRequestException("Sáº£n pháº©m " + variant.getProduct().getProductName() +
                        " (MÃ u: " + variant.getColor() + ", Size: " + variant.getSize() + ") khÃ´ng Ä‘á»§ tá»“n kho!");
            }

            // Má»¤C ÄÃCH: Trá»« sá»‘ lÆ°á»£ng tá»“n kho biáº¿n thá»ƒ
            variant.setQuantity(variant.getQuantity() - itemReq.getQuantity());
            variantRepository.save(variant);

            // TÃ­nh tiá»n tá»«ng mÃ³n
            BigDecimal lineTotal = variant.getProduct().getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            totalAmount = totalAmount.add(lineTotal);

            // Táº¡o chi tiáº¿t Ä‘Æ¡n hÃ ng OrderDetail
            OrderDetail detail = OrderDetail.builder()
                    .order(order)
                    .variant(variant)
                    .quantity(itemReq.getQuantity())
                    .unitPrice(variant.getProduct().getPrice())
                    .build();

            order.getOrderDetails().add(detail);
        }

        // 5. Kiá»ƒm tra & Ãp dá»¥ng mÃ£ giáº£m giÃ¡ Coupon (náº¿u cÃ³)
        BigDecimal discountAmount = BigDecimal.ZERO;
        if (request.getCouponCode() != null && !request.getCouponCode().trim().isEmpty()) {
            Coupon coupon = couponRepository.findByCode(request.getCouponCode())
                    .orElseThrow(() -> new BadRequestException("MÃ£ giáº£m giÃ¡ khÃ´ng há»£p lá»‡!"));
            
            // Xá»­ lÃ½ tÃ­nh sá»‘ tiá»n Ä‘Æ°á»£c giáº£m giÃ¡...
            discountAmount = coupon.getDiscountValue();
            coupon.setUsedCount(coupon.getUsedCount() + 1);
            couponRepository.save(coupon);
            order.setCoupon(coupon);
        }

        order.setTotalAmount(totalAmount);
        order.setDiscountAmount(discountAmount);
        order.setFinalAmount(totalAmount.subtract(discountAmount).max(BigDecimal.ZERO));

        // 6. LÆ°u Ä‘Æ¡n hÃ ng vÃ o CSDL SQL Server
        return orderRepository.save(order);
    }
}
```

---

### 4.2.4. Module TÃ­ch há»£p Cá»•ng Thanh toÃ¡n PayOS & Webhook Callback (Payment Layer)

#### Ä‘oáº¡n code 5: Class `PaymentServiceImpl.java` (Xá»­ lÃ½ Webhook PayOS)
- **Má»¥c Ä‘Ã­ch cá»§a code:** XÃ¡c minh chá»¯ kÃ½ sá»‘ báº£o máº­t `HMAC SHA256 Signature` gá»­i tá»« PayOS Webhook Server Ä‘á»ƒ phÃ²ng chá»‘ng giáº£ máº¡o dá»¯ liá»‡u. Khi há»£p lá»‡, tá»± Ä‘á»™ng chuyá»ƒn tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng sang `PAID` / `PROCESSING` mÃ  khÃ´ng cáº§n nhÃ¢n viÃªn soÃ¡t tiá»n thá»§ cÃ´ng.
- **Pháº¡m vi Ã¡p dá»¥ng:** Xá»­ lÃ½ thanh toÃ¡n tá»± Ä‘á»™ng qua mÃ£ VietQR NgÃ¢n hÃ ng vÃ  lÃ m máº«u cho cÃ¡c cá»•ng thanh toÃ¡n tÃ­ch há»£p tÆ°Æ¡ng lai.

```java
package com.foxstyle.api.service.impl;

import com.foxstyle.api.dto.payos.PayOSWebhookData;
import com.foxstyle.api.entity.Order;
import com.foxstyle.api.repository.OrderRepository;
import com.foxstyle.api.util.SignatureUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PaymentServiceImpl {

    @Value("${payos.checksum-key}")
    private String payosChecksumKey;

    private final OrderRepository orderRepository;

    public PaymentServiceImpl(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    /**
     * Má»¤C ÄÃCH: Xá»­ lÃ½ thÃ´ng bÃ¡o Webhook callback tá»« PayOS khi khÃ¡ch chuyá»ƒn khoáº£n thÃ nh cÃ´ng.
     */
    @Transactional
    public boolean processPayOSWebhook(PayOSWebhookData webhookData) {

        // 1. Má»¤C ÄÃCH: XÃ¡c minh chá»¯ kÃ½ HMAC SHA256 Checksum Signature tá»« PayOS
        boolean isValidSignature = SignatureUtils.verifyPayOSSignature(
                webhookData.getData(),
                webhookData.getSignature(),
                payosChecksumKey
        );

        if (!isValidSignature) {
            // Cáº£nh bÃ¡o Webhook bá»‹ giáº£ máº¡o!
            return false;
        }

        // 2. TrÃ­ch xuáº¥t mÃ£ Ä‘Æ¡n hÃ ng tá»« dá»¯ liá»‡u Webhook
        String orderCode = webhookData.getData().getOrderCode();

        Order order = orderRepository.findByOrderCode(orderCode)
                .orElse(null);

        if (order != null && "UNPAID".equals(order.getPaymentStatus())) {
            // 3. Má»¤C ÄÃCH: Tá»± Ä‘á»™ng cáº­p nháº­t tráº¡ng thÃ¡i Ä‘Æ¡n hÃ ng sang ÄÃƒ THANH TOÃN
            order.setPaymentStatus("PAID");
            order.setStatus("PROCESSING");
            orderRepository.save(order);
            return true;
        }

        return false;
    }
}
```

---

### 4.2.5. Module RESTful Controller & API Endpoints (Presentation Layer)

#### Ä‘oáº¡n code 6: Class `ProductController.java`
- **Má»¥c Ä‘Ã­ch cá»§a code:** Äá»‹nh nghÄ©a cÃ¡c RESTful API Endpoints phá»¥c vá»¥ tra cá»©u, tÃ¬m kiáº¿m, lá»c sáº£n pháº©m vÃ  thÃªm sáº£n pháº©m má»›i. TÃ­ch há»£p OpenAPI Swagger Documentation Ä‘á»ƒ táº¡o tÃ i liá»‡u API tá»± Ä‘á»™ng.
- **Pháº¡m vi Ã¡p dá»¥ng:** Äáº¡i diá»‡n máº«u cho **18 REST Controllers** trong dá»± Ã¡n (`AuthController`, `OrderController`, `CartController`, `CouponController`, `UserController`...).

```java
package com.foxstyle.api.controller;

import com.foxstyle.api.entity.Product;
import com.foxstyle.api.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@Tag(name = "Product API", description = "CÃ¡c API tra cá»©u vÃ  quáº£n lÃ½ sáº£n pháº©m thá»i trang")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /**
     * Má»¤C ÄÃCH: API cÃ´ng khai cho khÃ¡ch hÃ ng tÃ¬m kiáº¿m & lá»c sáº£n pháº©m
     */
    @GetMapping
    @Operation(summary = "Láº¥y danh sÃ¡ch sáº£n pháº©m theo tá»« khÃ³a hoáº·c danh má»¥c")
    public ResponseEntity<List<Product>> getProducts(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long categoryId) {
        
        List<Product> products = productService.filterProducts(search, categoryId);
        return ResponseEntity.ok(products);
    }

    /**
     * Má»¤C ÄÃCH: API yÃªu cáº§u quyá»n ADMIN Ä‘á»ƒ thÃªm má»›i sáº£n pháº©m
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "ThÃªm sáº£n pháº©m má»›i (DÃ nh cho Quáº£n trá»‹ viÃªn)")
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        Product createdProduct = productService.saveProduct(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
    }
}
```

---

### 4.2.6. Module Frontend React Interceptors & State Management (Frontend SPA Layer)

#### Ä‘oáº¡n code 7: File `axiosClient.ts` (Axios Interceptors)
- **Má»¥c Ä‘Ã­ch cá»§a code:** Tá»± Ä‘á»™ng Ä‘Ã­nh kÃ¨m mÃ£ **JWT Token** tá»« `localStorage` vÃ o Header `Authorization: Bearer <token>` trÃªn má»—i HTTP Request gá»­i tá»« React App lÃªn Backend. Äá»“ng thá»i tá»± Ä‘á»™ng xá»­ lÃ½ khi Token bá»‹ háº¿t háº¡n (Lá»—i HTTP 401).
- **Pháº¡m vi Ã¡p dá»¥ng:** DÃ¹ng lÃ m **Http Client táº­p trung** cho toÃ n bá»™ cÃ¡c API call trong á»©ng dá»¥ng Frontend React (`authApi`, `productApi`, `orderApi`, `paymentApi`).

```typescript
import axios from 'axios';

// Má»¤C ÄÃCH: Khá»Ÿi táº¡o Axios Instance vá»›i Base URL Backend API
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Má»¤C ÄÃCH: Request Interceptor - Tá»± Ä‘á»™ng Ä‘Ã­nh kÃ¨m JWT Token vÃ o Header
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Má»¤C ÄÃCH: Response Interceptor - Xá»­ lÃ½ lá»—i táº­p trung khi Token háº¿t háº¡n (401)
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      // XÃ³a token cÅ© vÃ  chuyá»ƒn ngÆ°á»i dÃ¹ng vá» trang ÄÄƒng nháº­p
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
```

---

## 4.3. MÃ” Táº¢ HOáº T Äá»˜NG TÃ™Y BIáº¾N Há»† THá»NG CHO THÆ¯Æ NG HIá»†U THá»œI TRANG FOXSTYLE

Trong quÃ¡ trÃ¬nh triá»ƒn khai dá»± Ã¡n thá»±c táº¿ cho Ä‘Æ¡n vá»‹ kinh doanh thá»i trang FoxStyle, há»‡ thá»‘ng Ä‘Ã£ Ä‘Æ°á»£c tÃ¹y biáº¿n Ä‘Ã¡p á»©ng cÃ¡c Ä‘áº·c thá»¥ nghiá»‡p vá»¥ ngÃ nh may máº·c:

1. **TÃ¹y biáº¿n Quáº£n lÃ½ Tá»“n kho Biáº¿n thá»ƒ 2 Thuá»™c tÃ­nh (Size x MÃ u sáº¯c):**
   - ÄÆ¡n vá»‹ thá»i trang yÃªu cáº§u quáº£n lÃ½ chÃ­nh xÃ¡c tá»“n kho theo tá»«ng Size (S, M, L, XL) vÃ  MÃ u sáº¯c cá»§a tá»«ng sáº£n pháº©m.
   - Há»‡ thá»‘ng Ä‘Æ°á»£c tÃ¹y biáº¿n báº£ng `product_variants` gáº¯n mÃ£ SKU riÃªng biá»‡t. Khi khÃ¡ch hÃ ng báº¥m chá»n MÃ u vÃ  Size trÃªn mÃ n hÃ¬nh Chi tiáº¿t sáº£n pháº©m, há»‡ thá»‘ng tá»± Ä‘á»™ng kiá»ƒm tra sá»‘ lÆ°á»£ng tá»“n kho kháº£ dá»¥ng realtime.

2. **TÃ¹y biáº¿n Giáº£i phÃ¡p Thanh toÃ¡n QuÃ©t mÃ£ VietQR Tá»± Ä‘á»™ng (PayOS Gateway):**
   - ÄÆ¡n vá»‹ kinh doanh cáº§n cáº¯t giáº£m chi phÃ­ nhÃ¢n sá»± rÃ  soÃ¡t giao dá»‹ch chuyá»ƒn khoáº£n ngÃ¢n hÃ ng thá»§ cÃ´ng.
   - Há»‡ thá»‘ng tÃ¹y biáº¿n mÃ´ hÃ¬nh tÃ­ch há»£p PayOS: Tá»± Ä‘á»™ng sinh mÃ£ VietQR chá»©a Ä‘Ãºng sá»‘ tiá»n vÃ  ná»™i dung mÃ£ Ä‘Æ¡n hÃ ng. Tá»± Ä‘á»™ng nháº­n tÃ­n hiá»‡u Webhook Ä‘á»ƒ cáº­p nháº­t Ä‘Æ¡n hÃ ng thÃ nh `PAID` trong vÃ²ng `2 giÃ¢y` sau khi khÃ¡ch chuyá»ƒn tiá»n.

3. **TÃ¹y biáº¿n Giao diá»‡n Tráº£i nghiá»‡m Mua sáº¯m (Storefront Modern UI):**
   - Thiáº¿t káº¿ giao diá»‡n hiá»‡n Ä‘áº¡i theo chuáº©n thÆ°Æ¡ng máº¡i Ä‘iá»‡n tá»­ thá»i trang (Bá»™ lá»c Ä‘a tiÃªu chÃ­ sidebar khÃ´ng táº£i láº¡i trang, Slide áº£nh gÃ³c phá»¥ product images, Sonner Toast thÃ´ng bÃ¡o mÆ°á»£t mÃ ).

---

## 4.4. MÃ” Táº¢ HOáº T Äá»˜NG TRIá»‚N KHAI VÃ€ ÄÃ“NG GÃ“I Há»† THá»NG (DEPLOYMENT)

### 1. ÄÃ³ng gÃ³i Container Backend Docker:
Backend Spring Boot Ä‘Æ°á»£c Ä‘Ã³ng gÃ³i thÃ nh tá»‡p **Docker Container Image** nháº¹, giÃºp dá»… dÃ ng triá»ƒn khai trÃªn má»i mÃ´i trÆ°á»ng Server:

```dockerfile
# Multi-stage build cho Spring Boot Java 17
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:17-jdk-slim
WORKDIR /app
COPY --from=build /app/target/foxstyle-api-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

### 2. Triá»ƒn khai Frontend trÃªn Nginx / Cloudflare CDN:
MÃ£ nguá»“n React Frontend Ä‘Æ°á»£c Ä‘Ã³ng gÃ³i thÃ nh tá»‡p tÄ©nh mÆ°á»£t mÃ  qua lá»‡nh `npm run build` (sá»­ dá»¥ng Vite 6) vÃ  Ä‘Æ°á»£c phá»¥c vá»¥ qua mÃ¡y chá»§ **Nginx Reverse Proxy** tÃ­ch há»£p TÆ°á»ng lá»­a Cloudflare WAF báº£o vá»‡ an toÃ n.

---

## Lá»œI Káº¾T & LIÃŠN Káº¾T TÃ€I LIá»†U

BÃ¡o cÃ¡o **Pháº§n 4: PhÃ¡t triá»ƒn vÃ  Thá»±c thi Há»‡ thá»‘ng Pháº§n má»m FoxStyle** Ä‘Ã£ mÃ´ táº£ toÃ n bá»™ quÃ¡ trÃ¬nh cÃ i Ä‘áº·t code chuáº©n hÃ³a, tÃ¹y biáº¿n giáº£i phÃ¡p vÃ  triá»ƒn khai thá»±c táº¿ theo Ä‘Ãºng yÃªu cáº§u Ä‘á» tÃ i Äá»“ Ã¡n Tá»‘t nghiá»‡p.

TÃ i liá»‡u nÃ y Ä‘Æ°á»£c Ä‘á»“ng bá»™ liÃªn káº¿t vá»›i:
- [Äáº·c táº£ YÃªu cáº§u Há»‡ thá»‘ng SRS](./yeu_cau_he_thong.md)
- [SÆ¡ Ä‘á»“ Use Case & Sequence Diagrams](./so_do_use_case.md)
- [Äáº·c táº£ Chi tiáº¿t 20 Ca sá»­ dá»¥ng](./dac_ta_use_case_chi_tiet.md)
- [Ma tráº­n Ãnh xáº¡ Use Case & Actor](./use_case_actor_mapping.md)
- [BÃ¡o cÃ¡o MÃ´ táº£ Chi tiáº¿t CÆ¡ sá»Ÿ Dá»¯ liá»‡u 43 Báº£ng](./BAO_CAO_MO_TA_CSDL_FOXSTYLE.md)
- [Thiáº¿t káº¿ CÆ¡ sá»Ÿ Dá»¯ liá»‡u 43 Báº£ng (Database Design)](./thiet_ke_co_so_du_lieu.md)
- [Thiáº¿t káº¿ Lá»›p MÃ£ nguá»“n Java (Class Diagrams)](./thiet_ke_lop_class_diagrams.md)
- [Thiáº¿t káº¿ Lá»›p 6 PhÃ¢n há»‡ chÃ­nh](./thiet_ke_lop_cac_phan_he_chinh.md)
- [Bá»™ 10 SÆ¡ Ä‘á»“ Tuáº§n tá»± (Sequence Diagrams)](./so_do_tuan_tu_sequence_diagrams.md)
- [Thiáº¿t káº¿ Cáº¥u trÃºc Pháº§n má»m (Software Architecture)](./thiet_ke_cau_truc_phan_mem.md)
- [Thiáº¿t káº¿ Háº¡ táº§ng Máº¡ng & ChÃ­nh sÃ¡ch Há»‡ thá»‘ng](./thiet_ke_ha_tang_mang_va_chinh_sach.md)
