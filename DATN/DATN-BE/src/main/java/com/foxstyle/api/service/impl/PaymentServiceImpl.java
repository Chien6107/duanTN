package com.foxstyle.api.service.impl;

import com.foxstyle.api.dto.response.PageResponse;
import com.foxstyle.api.dto.response.PaymentResponse;
import com.foxstyle.api.entity.Payment;
import com.foxstyle.api.exception.ResourceNotFoundException;
import com.foxstyle.api.repository.PaymentRepository;
import com.foxstyle.api.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;

    @Override
    public PageResponse<PaymentResponse> getAllPayments(Byte paymentStatus, Pageable pageable) {
        Page<Payment> page = paymentStatus != null
                ? paymentRepository.findByPaymentStatus(paymentStatus, pageable)
                : paymentRepository.findAll(pageable);
        return PageResponse.of(page.map(this::convertToResponse));
    }

    @Override
    public List<PaymentResponse> getPaymentsByOrder(Integer orderId) {
        return paymentRepository.findByOrderOrderId(orderId)
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    @Override
    @Transactional
    public PaymentResponse updatePaymentStatus(Integer paymentId, Byte paymentStatus, String transactionId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy giao dịch thanh toán có ID: " + paymentId));
        payment.setPaymentStatus(paymentStatus);
        if (transactionId != null) {
            payment.setTransactionId(transactionId);
        }
        return convertToResponse(paymentRepository.save(payment));
    }

    private PaymentResponse convertToResponse(Payment payment) {
        return PaymentResponse.builder()
                .paymentId(payment.getPaymentId())
                .orderId(payment.getOrder().getOrderId())
                .paymentMethod(payment.getPaymentMethod())
                .paymentStatus(payment.getPaymentStatus())
                .transactionId(payment.getTransactionId())
                .paymentDate(payment.getPaymentDate())
                .amount(payment.getAmount())
                .build();
    }
}
