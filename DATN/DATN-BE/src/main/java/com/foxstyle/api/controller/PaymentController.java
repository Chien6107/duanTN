package com.foxstyle.api.controller;

import com.foxstyle.api.dto.response.ApiResponse;
import com.foxstyle.api.dto.response.PageResponse;
import com.foxstyle.api.dto.response.PaymentResponse;
import com.foxstyle.api.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PageResponse<PaymentResponse>>> getAllPayments(
            @RequestParam(required = false) Byte status,
            Pageable pageable) {
        PageResponse<PaymentResponse> payments = paymentService.getAllPayments(status, pageable);
        ApiResponse<PageResponse<PaymentResponse>> response = ApiResponse.<PageResponse<PaymentResponse>>builder()
                .status("success")
                .message("Lấy danh sách giao dịch thành công")
                .data(payments)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<ApiResponse<List<PaymentResponse>>> getPaymentsByOrder(@PathVariable Integer orderId) {
        List<PaymentResponse> payments = paymentService.getPaymentsByOrder(orderId);
        ApiResponse<List<PaymentResponse>> response = ApiResponse.<List<PaymentResponse>>builder()
                .status("success")
                .message("Lấy giao dịch của đơn hàng thành công")
                .data(payments)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{paymentId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PaymentResponse>> updatePaymentStatus(
            @PathVariable Integer paymentId,
            @RequestParam Byte status,
            @RequestParam(required = false) String transactionId) {
        PaymentResponse payment = paymentService.updatePaymentStatus(paymentId, status, transactionId);
        ApiResponse<PaymentResponse> response = ApiResponse.<PaymentResponse>builder()
                .status("success")
                .message("Cập nhật trạng thái giao dịch thành công")
                .data(payment)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }
}
