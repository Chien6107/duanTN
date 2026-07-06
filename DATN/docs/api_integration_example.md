# VÍ DỤ MINH HỌA CHI TIẾT: CÁCH VIẾT VÀ GỌI API (END-TO-END INTEGRATION)
## Tích hợp Chức năng: Quản lý Sản phẩm Yêu thích (Wishlist) từ Backend lên Frontend

Tài liệu này hướng dẫn chi tiết cách phát triển một tính năng hoàn chỉnh từ Cơ sở dữ liệu, viết mã nguồn xử lý ở **Backend (Spring Boot)** đến việc gọi API và hiển thị kết quả lên giao diện **Frontend (React + Axios)**. 

Tính năng được lựa chọn làm ví dụ: **Quản lý danh sách Yêu thích (Wishlist)**.

---

## PHẦN 1: BƯỚC 1 - LẬP TRÌNH API Ở BACKEND (SPRING BOOT)

Mục tiêu: Xây dựng các API cho phép khách hàng lấy danh sách sản phẩm đã thả tim, thêm sản phẩm vào wishlist và xóa sản phẩm khỏi wishlist.

### 1.1. Lập trình tầng Entity (`Wishlist.java`)
Ánh xạ trực tiếp từ bảng `wishlists` trong Database sang class Java:

```java
package com.foxstyle.api.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "wishlists", 
       uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "product_id"})})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Wishlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "wishlist_id")
    private Integer wishlistId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER) // EAGER để tự động join lấy thông tin sản phẩm đi kèm
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "added_date", nullable = false)
    private LocalDateTime addedDate = LocalDateTime.now();
}
```

---

### 1.2. Lập trình tầng Repository (`WishlistRepository.java`)
```java
package com.foxstyle.api.repository;

import com.foxstyle.api.entity.Wishlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, Integer> {
    
    // Lấy danh sách yêu thích của một người dùng cụ thể
    List<Wishlist> findByUserUserId(Integer userId);

    // Tìm kiếm sự tồn tại của sản phẩm trong mục yêu thích của user
    Optional<Wishlist> findByUserUserIdAndProductProductId(Integer userId, Integer productId);
    
    // Xóa sản phẩm khỏi danh sách yêu thích
    void deleteByUserUserIdAndProductProductId(Integer userId, Integer productId);
}
```

---

### 1.3. Lập trình tầng Service (`WishlistService.java`)
```java
package com.foxstyle.api.service;

import com.foxstyle.api.entity.Product;
import com.foxstyle.api.entity.User;
import com.foxstyle.api.entity.Wishlist;
import com.foxstyle.api.exception.BadRequestException;
import com.foxstyle.api.repository.ProductRepository;
import com.foxstyle.api.repository.UserRepository;
import com.foxstyle.api.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    // 1. Lấy danh sách sản phẩm yêu thích của user
    public List<Wishlist> getWishlistByUser(Integer userId) {
        return wishlistRepository.findByUserUserId(userId);
    }

    // 2. Thêm sản phẩm vào danh sách yêu thích
    @Transactional
    public Wishlist addToWishlist(Integer userId, Integer productId) {
        // Kiểm tra sản phẩm đã thích chưa
        if (wishlistRepository.findByUserUserIdAndProductProductId(userId, productId).isPresent()) {
            throw new BadRequestException("Sản phẩm này đã nằm trong danh sách yêu thích");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new BadRequestException("Người dùng không tồn tại"));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new BadRequestException("Sản phẩm không tồn tại"));

        Wishlist wishlist = Wishlist.builder()
                .user(user)
                .product(product)
                .addedDate(LocalDateTime.now())
                .build();

        return wishlistRepository.save(wishlist);
    }

    // 3. Xóa sản phẩm khỏi danh sách yêu thích
    @Transactional
    public void removeFromWishlist(Integer userId, Integer productId) {
        wishlistRepository.findByUserUserIdAndProductProductId(userId, productId)
                .orElseThrow(() -> new BadRequestException("Sản phẩm chưa có trong danh sách yêu thích"));
        
        wishlistRepository.deleteByUserUserIdAndProductProductId(userId, productId);
    }
}
```

---

### 1.4. Lập trình tầng Controller (`WishlistController.java`)
```java
package com.foxstyle.api.controller;

import com.foxstyle.api.dto.response.ApiResponse;
import com.foxstyle.api.entity.Wishlist;
import com.foxstyle.api.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/wishlists")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    // 1. Lấy danh sách sản phẩm yêu thích (GET /api/v1/wishlists)
    @GetMapping
    public ResponseEntity<ApiResponse<List<Wishlist>>> getMyWishlist(
            @RequestAttribute("userId") Integer userId) { // Đọc userId từ JWT Interceptor
        
        List<Wishlist> wishlists = wishlistService.getWishlistByUser(userId);
        
        ApiResponse<List<Wishlist>> response = ApiResponse.<List<Wishlist>>builder()
                .status("success")
                .message("Lấy danh sách yêu thích thành công")
                .data(wishlists)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }

    // 2. Thêm sản phẩm vào yêu thích (POST /api/v1/wishlists?productId=5)
    @PostMapping
    public ResponseEntity<ApiResponse<Wishlist>> addFavorite(
            @RequestParam("productId") Integer productId,
            @RequestAttribute("userId") Integer userId) {
        
        Wishlist wishlist = wishlistService.addToWishlist(userId, productId);
        
        ApiResponse<Wishlist> response = ApiResponse.<Wishlist>builder()
                .status("success")
                .message("Đã thêm vào danh sách yêu thích")
                .data(wishlist)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }

    // 3. Xóa sản phẩm khỏi yêu thích (DELETE /api/v1/wishlists/5)
    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse<Void>> removeFavorite(
            @PathVariable("productId") Integer productId,
            @RequestAttribute("userId") Integer userId) {
        
        wishlistService.removeFromWishlist(userId, productId);
        
        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .status("success")
                .message("Đã xóa khỏi danh sách yêu thích")
                .data(null)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }
}
```

---

## PHẦN 2: BƯỚC 2 - GỌI VÀ HIỂN THỊ API Ở FRONTEND (REACT + AXIOS)

Mục tiêu: Frontend gọi các API vừa viết, đồng bộ trạng thái khi click vào nút Thả tim và tạo trang hiển thị danh sách yêu thích.

### 2.1. Khai báo API Client (`src/app/api/wishlistApi.ts`)
```typescript
import axiosClient from "./axiosClient";

export const wishlistApi = {
  // 1. Lấy danh sách sản phẩm đã thích của tôi
  getFavorites: () => {
    const url = "/v1/wishlists";
    return axiosClient.get(url);
  },

  // 2. Thêm một sản phẩm vào yêu thích
  addFavorite: (productId: number) => {
    const url = `/v1/wishlists?productId=${productId}`;
    return axiosClient.post(url);
  },

  // 3. Xóa sản phẩm khỏi danh sách yêu thích
  removeFavorite: (productId: number) => {
    const url = `/v1/wishlists/${productId}`;
    return axiosClient.delete(url);
  }
};
```

---

### 2.2. Gọi API để xử lý nút "Thả tim" ở trang Chi tiết sản phẩm (`ProductDetailPage.tsx`)
```tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { Heart } from "lucide-react";
import { wishlistApi } from "../api/wishlistApi";

export function ProductDetailPage() {
  const { id } = useParams();
  const productId = Number(id);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [loadingLike, setLoadingLike] = useState<boolean>(false);

  // Kiểm tra xem sản phẩm này đã được thích trước đó chưa
  useEffect(() => {
    const checkLikeStatus = async () => {
      try {
        const response: any = await wishlistApi.getFavorites();
        if (response.status === "success") {
          // Kiểm tra xem ID sản phẩm hiện tại có trong mảng sản phẩm đã thích không
          const list = response.data;
          const found = list.some((item: any) => item.product.productId === productId);
          setIsLiked(found);
        }
      } catch (error) {
        console.error("Lỗi khi kiểm tra trạng thái yêu thích", error);
      }
    };
    checkLikeStatus();
  }, [productId]);

  // Xử lý sự kiện bấm nút Thả tim (Toggle Like)
  const handleToggleLike = async () => {
    if (loadingLike) return;
    setLoadingLike(true);
    try {
      if (isLiked) {
        // Nếu đã thích thì xóa đi
        const res: any = await wishlistApi.removeFavorite(productId);
        if (res.status === "success") {
          setIsLiked(false);
          alert("Đã xóa khỏi danh sách yêu thích");
        }
      } else {
        // Nếu chưa thích thì thêm vào
        const res: any = await wishlistApi.addFavorite(productId);
        if (res.status === "success") {
          setIsLiked(true);
          alert("Đã thêm vào sản phẩm yêu thích");
        }
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Vui lòng đăng nhập để thực hiện chức năng này!");
    } finally {
      setLoadingLike(false);
    }
  };

  return (
    <div className="flex gap-4 p-8">
      {/* ... Thông tin chi tiết sản phẩm khác ... */}
      
      <button 
        onClick={handleToggleLike}
        disabled={loadingLike}
        className={`px-6 py-3 border rounded-lg transition ${
          isLiked 
            ? "bg-red-50 border-red-500 text-red-500 hover:bg-red-100" 
            : "border-gray-300 text-gray-700 hover:bg-gray-50"
        }`}
      >
        <Heart className={`h-5 w-5 ${isLiked ? "fill-red-500" : ""}`} />
      </button>
    </div>
  );
}
```

---

### 2.3. Tạo trang Danh sách sản phẩm yêu thích (`WishlistPage.tsx`)
```tsx
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { wishlistApi } from "../api/wishlistApi";
import { Trash2 } from "lucide-react";

export function WishlistPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Tải danh sách yêu thích
  const loadFavorites = async () => {
    try {
      setLoading(true);
      const response: any = await wishlistApi.getFavorites();
      if (response.status === "success") {
        setFavorites(response.data);
      }
    } catch (error) {
      console.error("Không thể tải danh sách sản phẩm yêu thích", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  // Xóa trực tiếp sản phẩm khỏi danh sách yêu thích
  const handleRemove = async (productId: number) => {
    if (!confirm("Bạn muốn bỏ thích sản phẩm này chứ?")) return;
    try {
      const res: any = await wishlistApi.removeFavorite(productId);
      if (res.status === "success") {
        // Cập nhật lại State loại bỏ sản phẩm vừa xóa trên UI
        setFavorites(favorites.filter(item => item.product.productId !== productId));
      }
    } catch (error) {
      alert("Xử lý thất bại, vui lòng thử lại");
    }
  };

  if (loading) return <div className="text-center py-12">Đang tải sản phẩm yêu thích...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Sản phẩm yêu thích của tôi</h1>

      {favorites.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">Bạn chưa yêu thích sản phẩm nào.</p>
          <Link to="/products" className="inline-block bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-700">
            Xem sản phẩm ngay
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {favorites.map((item) => (
            <div key={item.wishlistId} className="bg-white rounded-lg shadow overflow-hidden border relative group">
              <img src={item.product.imageUrl} alt={item.product.productName} className="w-full h-56 object-cover" />
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1">{item.product.productName}</h3>
                <p className="text-orange-600 font-bold">{item.product.price.toLocaleString("vi-VN")}đ</p>
                
                <div className="mt-4 flex gap-2">
                  <Link to={`/products/${item.product.productId}`} className="flex-1 bg-orange-50 text-orange-600 text-center py-2 rounded-md text-sm font-semibold hover:bg-orange-100">
                    Xem chi tiết
                  </Link>
                  <button onClick={() => handleRemove(item.product.productId)} className="px-3 py-2 bg-gray-50 text-red-500 border rounded-md hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```
