package com.foxstyle.api.service.impl;

import com.foxstyle.api.dto.request.CouponRequest;
import com.foxstyle.api.dto.response.CouponResponse;
import com.foxstyle.api.dto.response.PageResponse;
import com.foxstyle.api.entity.Coupon;
import com.foxstyle.api.exception.BadRequestException;
import com.foxstyle.api.exception.ResourceNotFoundException;
import com.foxstyle.api.repository.CouponRepository;
import com.foxstyle.api.repository.UserCouponRepository;
import com.foxstyle.api.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class CouponServiceImpl implements CouponService {

    private static final byte DISCOUNT_TYPE_FIXED = 1;
    private static final byte DISCOUNT_TYPE_PERCENT = 2;

    private final CouponRepository couponRepository;
    private final UserCouponRepository userCouponRepository;

    @Override
    public PageResponse<CouponResponse> getAllCoupons(Pageable pageable) {
        return PageResponse.of(couponRepository.findAll(pageable).map(this::convertToResponse));
    }

    @Override
    public CouponResponse getCouponById(Integer couponId) {
        return convertToResponse(findCouponById(couponId));
    }

    @Override
    @Transactional
    public CouponResponse createCoupon(CouponRequest request) {
        if (couponRepository.existsByCouponCode(request.getCouponCode())) {
            throw new BadRequestException("Mã giảm giá đã tồn tại: " + request.getCouponCode());
        }
        validateDates(request);

        Coupon coupon = Coupon.builder()
                .couponCode(request.getCouponCode().toUpperCase())
                .discountType(request.getDiscountType())
                .discountValue(request.getDiscountValue())
                .minOrderValue(request.getMinOrderValue() != null ? request.getMinOrderValue() : BigDecimal.ZERO)
                .maxDiscountValue(request.getMaxDiscountValue())
                .startDate(request.getStartDate())
                .endDate(request.getEndDate())
                .usageLimit(request.getUsageLimit() != null ? request.getUsageLimit() : 100)
                .usedCount(0)
                .status(request.getStatus() != null ? request.getStatus() : (byte) 1)
                .build();

        return convertToResponse(couponRepository.save(coupon));
    }

    @Override
    @Transactional
    public CouponResponse updateCoupon(Integer couponId, CouponRequest request) {
        Coupon coupon = findCouponById(couponId);
        validateDates(request);

        boolean codeChanged = !coupon.getCouponCode().equalsIgnoreCase(request.getCouponCode());
        if (codeChanged && couponRepository.existsByCouponCode(request.getCouponCode().toUpperCase())) {
            throw new BadRequestException("Mã giảm giá đã tồn tại: " + request.getCouponCode());
        }

        coupon.setCouponCode(request.getCouponCode().toUpperCase());
        coupon.setDiscountType(request.getDiscountType());
        coupon.setDiscountValue(request.getDiscountValue());
        if (request.getMinOrderValue() != null) {
            coupon.setMinOrderValue(request.getMinOrderValue());
        }
        coupon.setMaxDiscountValue(request.getMaxDiscountValue());
        coupon.setStartDate(request.getStartDate());
        coupon.setEndDate(request.getEndDate());
        if (request.getUsageLimit() != null) {
            coupon.setUsageLimit(request.getUsageLimit());
        }
        if (request.getStatus() != null) {
            coupon.setStatus(request.getStatus());
        }

        return convertToResponse(couponRepository.save(coupon));
    }

    @Override
    @Transactional
    public void deleteCoupon(Integer couponId) {
        Coupon coupon = findCouponById(couponId);
        // Vô hiệu hóa thay vì xóa cứng để bảo toàn lịch sử đơn hàng
        coupon.setStatus((byte) 0);
        couponRepository.save(coupon);
    }

    @Override
    public BigDecimal validateAndCalculateDiscount(String couponCode, BigDecimal orderValue, Integer userId) {
        Coupon coupon = couponRepository.findByCouponCode(couponCode.toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Mã giảm giá không tồn tại: " + couponCode));

        validateCouponUsable(coupon, orderValue, userId);
        return calculateDiscount(coupon, orderValue);
    }

    // ==================== Private helpers ====================

    private Coupon findCouponById(Integer couponId) {
        return couponRepository.findById(couponId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy mã giảm giá có ID: " + couponId));
    }

    private void validateDates(CouponRequest request) {
        if (request.getEndDate().isBefore(request.getStartDate())) {
            throw new BadRequestException("Ngày kết thúc phải sau ngày bắt đầu");
        }
    }

    private void validateCouponUsable(Coupon coupon, BigDecimal orderValue, Integer userId) {
        LocalDateTime now = LocalDateTime.now();

        if (coupon.getStatus() != 1) {
            throw new BadRequestException("Mã giảm giá đã bị vô hiệu hóa");
        }
        if (now.isBefore(coupon.getStartDate()) || now.isAfter(coupon.getEndDate())) {
            throw new BadRequestException("Mã giảm giá không nằm trong thời gian áp dụng");
        }
        if (coupon.getUsedCount() >= coupon.getUsageLimit()) {
            throw new BadRequestException("Mã giảm giá đã hết lượt sử dụng");
        }
        if (orderValue.compareTo(coupon.getMinOrderValue()) < 0) {
            throw new BadRequestException(String.format(
                    "Đơn hàng tối thiểu %,.0fđ mới được áp dụng mã %s",
                    coupon.getMinOrderValue(), coupon.getCouponCode()));
        }
        if (userId != null && userCouponRepository.existsByIdUserIdAndIdCouponId(userId, coupon.getCouponId())) {
            throw new BadRequestException("Bạn đã sử dụng mã giảm giá này rồi");
        }
    }

    private BigDecimal calculateDiscount(Coupon coupon, BigDecimal orderValue) {
        BigDecimal discount;
        if (coupon.getDiscountType() == DISCOUNT_TYPE_FIXED) {
            discount = coupon.getDiscountValue();
        } else if (coupon.getDiscountType() == DISCOUNT_TYPE_PERCENT) {
            discount = orderValue.multiply(coupon.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
            if (coupon.getMaxDiscountValue() != null && discount.compareTo(coupon.getMaxDiscountValue()) > 0) {
                discount = coupon.getMaxDiscountValue();
            }
        } else {
            throw new BadRequestException("Loại giảm giá không hợp lệ");
        }
        // Không cho giảm vượt quá giá trị đơn hàng
        return discount.min(orderValue);
    }

    private CouponResponse convertToResponse(Coupon coupon) {
        return CouponResponse.builder()
                .couponId(coupon.getCouponId())
                .couponCode(coupon.getCouponCode())
                .discountType(coupon.getDiscountType())
                .discountValue(coupon.getDiscountValue())
                .minOrderValue(coupon.getMinOrderValue())
                .maxDiscountValue(coupon.getMaxDiscountValue())
                .startDate(coupon.getStartDate())
                .endDate(coupon.getEndDate())
                .usageLimit(coupon.getUsageLimit())
                .usedCount(coupon.getUsedCount())
                .status(coupon.getStatus())
                .build();
    }
}
