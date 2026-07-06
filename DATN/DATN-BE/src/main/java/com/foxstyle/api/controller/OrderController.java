package com.foxstyle.api.controller;

import com.foxstyle.api.dto.request.CheckoutRequest;
import com.foxstyle.api.dto.response.ApiResponse;
import com.foxstyle.api.dto.response.OrderResponse;
import com.foxstyle.api.dto.response.PageResponse;
import com.foxstyle.api.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> getAllOrders(
            @RequestParam(required = false) Byte status,
            Pageable pageable) {
        PageResponse<OrderResponse> orders = orderService.getAllOrders(status, pageable);
        ApiResponse<PageResponse<OrderResponse>> response = ApiResponse.<PageResponse<OrderResponse>>builder()
                .status("success")
                .message("Lấy danh sách đơn hàng thành công")
                .data(orders)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-orders")
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> getMyOrders(
            Principal principal,
            Pageable pageable) {
        PageResponse<OrderResponse> orders = orderService.getMyOrders(principal.getName(), pageable);
        ApiResponse<PageResponse<OrderResponse>> response = ApiResponse.<PageResponse<OrderResponse>>builder()
                .status("success")
                .message("Lấy lịch sử đơn hàng cá nhân thành công")
                .data(orders)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(
            @PathVariable Integer id,
            Principal principal,
            Authentication authentication) {
        boolean isStaff = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        OrderResponse order = orderService.getOrderById(id, principal.getName(), isStaff);
        ApiResponse<OrderResponse> response = ApiResponse.<OrderResponse>builder()
                .status("success")
                .message("Lấy đơn hàng chi tiết thành công")
                .data(order)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<OrderResponse>> checkout(
            Principal principal,
            @Valid @RequestBody CheckoutRequest request) {
        OrderResponse order = orderService.checkout(principal.getName(), request);
        ApiResponse<OrderResponse> response = ApiResponse.<OrderResponse>builder()
                .status("success")
                .message("Đặt hàng thành công")
                .data(order)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable Integer id,
            @RequestParam Byte status) {
        OrderResponse updated = orderService.updateOrderStatus(id, status);
        ApiResponse<OrderResponse> response = ApiResponse.<OrderResponse>builder()
                .status("success")
                .message("Cập nhật trạng thái đơn hàng thành công")
                .data(updated)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(
            @PathVariable Integer id,
            Principal principal) {
        OrderResponse cancelled = orderService.cancelMyOrder(principal.getName(), id);
        ApiResponse<OrderResponse> response = ApiResponse.<OrderResponse>builder()
                .status("success")
                .message("Hủy đơn hàng thành công")
                .data(cancelled)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }
}
