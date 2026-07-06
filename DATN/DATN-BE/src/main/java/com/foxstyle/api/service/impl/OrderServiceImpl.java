package com.foxstyle.api.service.impl;

import com.foxstyle.api.dto.request.CartItemRequest;
import com.foxstyle.api.dto.request.CheckoutRequest;
import com.foxstyle.api.dto.response.*;
import com.foxstyle.api.entity.*;
import com.foxstyle.api.exception.BadRequestException;
import com.foxstyle.api.exception.ResourceNotFoundException;
import com.foxstyle.api.repository.*;
import com.foxstyle.api.service.CouponService;
import com.foxstyle.api.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class OrderServiceImpl implements OrderService {

    private static final byte STATUS_PENDING = 0;
    private static final byte STATUS_CANCELLED = 4;
    private static final BigDecimal FREE_SHIP_THRESHOLD = BigDecimal.valueOf(300_000);
    private static final BigDecimal DEFAULT_SHIPPING_FEE = BigDecimal.valueOf(30_000);
    private static final String PAYMENT_METHOD_COD = "COD";

    private final OrderRepository orderRepository;
    private final ProductVariantRepository variantRepository;
    private final UserRepository userRepository;
    private final CouponRepository couponRepository;
    private final UserCouponRepository userCouponRepository;
    private final PaymentRepository paymentRepository;
    private final CartRepository cartRepository;
    private final CartDetailRepository cartDetailRepository;
    private final CouponService couponService;

    @Override
    public PageResponse<OrderResponse> getAllOrders(Byte status, Pageable pageable) {
        Page<Order> page = status != null
                ? orderRepository.findByStatus(status, pageable)
                : orderRepository.findAll(pageable);
        return PageResponse.of(page.map(this::convertToResponse));
    }

    @Override
    public PageResponse<OrderResponse> getMyOrders(String username, Pageable pageable) {
        User user = findUserByUsername(username);
        return PageResponse.of(orderRepository.findByUserUserId(user.getUserId(), pageable)
                .map(this::convertToResponse));
    }

    @Override
    public OrderResponse getOrderById(Integer orderId, String username, boolean isStaff) {
        Order order = findOrderById(orderId);
        if (!isStaff && !order.getUser().getUsername().equals(username)) {
            throw new BadRequestException("Bạn không có quyền xem đơn hàng này");
        }
        return convertToResponse(order);
    }

    @Override
    @Transactional
    public OrderResponse checkout(String username, CheckoutRequest request) {
        User user = findUserByUsername(username);

        Order order = buildBaseOrder(user, request);
        BigDecimal subtotal = processOrderItems(order, request.getItems());
        applyPricing(order, user, subtotal, request.getCouponCode());

        Order savedOrder = orderRepository.save(order);
        recordCouponUsage(savedOrder);
        createPaymentRecord(savedOrder, request.getPaymentMethod());
        removeCheckedOutItemsFromCart(user, request.getItems());

        return convertToResponse(savedOrder);
    }

    @Override
    @Transactional
    public OrderResponse updateOrderStatus(Integer orderId, Byte status) {
        Order order = findOrderById(orderId);
        if (order.getStatus() == STATUS_CANCELLED) {
            throw new BadRequestException("Đơn hàng đã hủy, không thể cập nhật trạng thái");
        }
        if (status == STATUS_CANCELLED) {
            restoreStock(order);
        }
        order.setStatus(status);
        return convertToResponse(orderRepository.save(order));
    }

    @Override
    @Transactional
    public OrderResponse cancelMyOrder(String username, Integer orderId) {
        Order order = findOrderById(orderId);
        if (!order.getUser().getUsername().equals(username)) {
            throw new BadRequestException("Bạn không có quyền hủy đơn hàng này");
        }
        if (order.getStatus() != STATUS_PENDING) {
            throw new BadRequestException("Chỉ được hủy đơn hàng khi đang ở trạng thái chờ duyệt");
        }
        restoreStock(order);
        order.setStatus(STATUS_CANCELLED);
        return convertToResponse(orderRepository.save(order));
    }

    // ==================== Private helpers: checkout ====================

    private Order buildBaseOrder(User user, CheckoutRequest request) {
        return Order.builder()
                .user(user)
                .orderDate(LocalDateTime.now())
                .recipientName(request.getRecipientName())
                .recipientPhone(request.getRecipientPhone())
                .shippingAddress(request.getShippingAddress())
                .status(STATUS_PENDING)
                .build();
    }

    /** Kiểm tra kho, trừ tồn kho và tạo các dòng chi tiết. Trả về tổng tiền hàng. */
    private BigDecimal processOrderItems(Order order, List<CartItemRequest> items) {
        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderDetail> details = new ArrayList<>();

        for (CartItemRequest item : items) {
            ProductVariant variant = variantRepository.findById(item.getVariantId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Không tìm thấy biến thể sản phẩm có ID: " + item.getVariantId()));

            subtractStock(variant, item.getQuantity());

            BigDecimal price = variant.getProduct().getPrice();
            subtotal = subtotal.add(price.multiply(BigDecimal.valueOf(item.getQuantity())));

            details.add(OrderDetail.builder()
                    .order(order)
                    .variant(variant)
                    .quantity(item.getQuantity())
                    .price(price)
                    .build());
        }

        order.setOrderDetails(details);
        return subtotal;
    }

    private void subtractStock(ProductVariant variant, int quantity) {
        if (variant.getQuantity() < quantity) {
            throw new BadRequestException(String.format(
                    "Sản phẩm màu %s size %s không đủ số lượng trong kho (còn %d)",
                    variant.getColor(), variant.getSize(), variant.getQuantity()));
        }
        variant.setQuantity(variant.getQuantity() - quantity);
        variantRepository.save(variant);
    }

    private void applyPricing(Order order, User user, BigDecimal subtotal, String couponCode) {
        BigDecimal discount = BigDecimal.ZERO;

        if (StringUtils.hasText(couponCode)) {
            discount = couponService.validateAndCalculateDiscount(couponCode, subtotal, user.getUserId());
            Coupon coupon = couponRepository.findByCouponCode(couponCode.toUpperCase())
                    .orElseThrow(() -> new ResourceNotFoundException("Mã giảm giá không tồn tại: " + couponCode));
            order.setCoupon(coupon);
        }

        BigDecimal shippingFee = subtotal.compareTo(FREE_SHIP_THRESHOLD) >= 0
                ? BigDecimal.ZERO
                : DEFAULT_SHIPPING_FEE;

        BigDecimal total = subtotal.subtract(discount).add(shippingFee).max(BigDecimal.ZERO);

        order.setDiscountAmount(discount);
        order.setShippingFee(shippingFee);
        order.setTotalAmount(total);
    }

    /** Ghi vết user đã dùng coupon và tăng bộ đếm sử dụng. */
    private void recordCouponUsage(Order order) {
        if (order.getCoupon() == null) {
            return;
        }
        Coupon coupon = order.getCoupon();
        coupon.setUsedCount(coupon.getUsedCount() + 1);
        couponRepository.save(coupon);

        UserCoupon userCoupon = UserCoupon.builder()
                .id(new UserCouponId(order.getUser().getUserId(), coupon.getCouponId()))
                .user(order.getUser())
                .coupon(coupon)
                .order(order)
                .usedAt(LocalDateTime.now())
                .build();
        userCouponRepository.save(userCoupon);
    }

    private void createPaymentRecord(Order order, String paymentMethod) {
        Payment payment = Payment.builder()
                .order(order)
                .paymentMethod(StringUtils.hasText(paymentMethod) ? paymentMethod : PAYMENT_METHOD_COD)
                .paymentStatus((byte) 0) // Chưa thanh toán
                .paymentDate(LocalDateTime.now())
                .amount(order.getTotalAmount())
                .build();
        paymentRepository.save(payment);
    }

    /** Sau khi đặt hàng thành công, gỡ các biến thể đã mua ra khỏi giỏ hàng. */
    private void removeCheckedOutItemsFromCart(User user, List<CartItemRequest> items) {
        cartRepository.findByUserUserId(user.getUserId()).ifPresent(cart ->
                items.forEach(item ->
                        cartDetailRepository
                                .findByCartCartIdAndVariantVariantId(cart.getCartId(), item.getVariantId())
                                .ifPresent(cartDetailRepository::delete)));
    }

    private void restoreStock(Order order) {
        for (OrderDetail detail : order.getOrderDetails()) {
            ProductVariant variant = detail.getVariant();
            variant.setQuantity(variant.getQuantity() + detail.getQuantity());
            variantRepository.save(variant);
        }
    }

    // ==================== Private helpers: chung ====================

    private User findUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản: " + username));
    }

    private Order findOrderById(Integer orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đơn hàng có ID: " + orderId));
    }

    private OrderResponse convertToResponse(Order order) {
        List<OrderDetailResponse> details = order.getOrderDetails() != null
                ? order.getOrderDetails().stream().map(this::convertDetail).toList()
                : List.of();

        List<PaymentResponse> payments = paymentRepository.findByOrderOrderId(order.getOrderId())
                .stream()
                .map(this::convertPayment)
                .toList();

        return OrderResponse.builder()
                .orderId(order.getOrderId())
                .userId(order.getUser().getUserId())
                .customerName(order.getUser().getFullName())
                .orderDate(order.getOrderDate())
                .totalAmount(order.getTotalAmount())
                .discountAmount(order.getDiscountAmount())
                .shippingFee(order.getShippingFee())
                .recipientName(order.getRecipientName())
                .recipientPhone(order.getRecipientPhone())
                .shippingAddress(order.getShippingAddress())
                .status(order.getStatus())
                .couponCode(order.getCoupon() != null ? order.getCoupon().getCouponCode() : null)
                .details(details)
                .payments(payments)
                .build();
    }

    private OrderDetailResponse convertDetail(OrderDetail detail) {
        ProductVariant variant = detail.getVariant();
        Product product = variant.getProduct();
        return OrderDetailResponse.builder()
                .orderDetailId(detail.getOrderDetailId())
                .variantId(variant.getVariantId())
                .productId(product.getProductId())
                .productName(product.getProductName())
                .imageUrl(product.getImageUrl())
                .color(variant.getColor())
                .size(variant.getSize())
                .quantity(detail.getQuantity())
                .price(detail.getPrice())
                .lineTotal(detail.getPrice().multiply(BigDecimal.valueOf(detail.getQuantity())))
                .build();
    }

    private PaymentResponse convertPayment(Payment payment) {
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
