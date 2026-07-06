package com.foxstyle.api.service;

import com.foxstyle.api.dto.response.PageResponse;
import com.foxstyle.api.dto.response.PaymentResponse;
import org.springframework.data.domain.Pageable;
import java.util.List;

public interface PaymentService {

    PageResponse<PaymentResponse> getAllPayments(Byte paymentStatus, Pageable pageable);

    List<PaymentResponse> getPaymentsByOrder(Integer orderId);

    /** Cập nhật kết quả giao dịch từ cổng thanh toán. */
    PaymentResponse updatePaymentStatus(Integer paymentId, Byte paymentStatus, String transactionId);
}
