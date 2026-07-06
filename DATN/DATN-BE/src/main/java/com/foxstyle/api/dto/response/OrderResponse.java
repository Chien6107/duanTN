package com.foxstyle.api.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderResponse {
    private Integer orderId;
    private Integer userId;
    private String customerName;
    private LocalDateTime orderDate;
    private BigDecimal totalAmount;
    private BigDecimal discountAmount;
    private BigDecimal shippingFee;
    private String recipientName;
    private String recipientPhone;
    private String shippingAddress;
    private Byte status;
    private String couponCode;
    private List<OrderDetailResponse> details;
    private List<PaymentResponse> payments;
}
