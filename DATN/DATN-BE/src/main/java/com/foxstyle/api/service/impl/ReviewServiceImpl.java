package com.foxstyle.api.service.impl;

import com.foxstyle.api.dto.request.ReviewRequest;
import com.foxstyle.api.dto.response.PageResponse;
import com.foxstyle.api.dto.response.ReviewResponse;
import com.foxstyle.api.entity.Product;
import com.foxstyle.api.entity.Review;
import com.foxstyle.api.entity.User;
import com.foxstyle.api.exception.BadRequestException;
import com.foxstyle.api.exception.ResourceNotFoundException;
import com.foxstyle.api.repository.ProductRepository;
import com.foxstyle.api.repository.ReviewRepository;
import com.foxstyle.api.repository.UserRepository;
import com.foxstyle.api.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Override
    public PageResponse<ReviewResponse> getReviewsByProduct(Integer productId, Pageable pageable) {
        Page<Review> page = reviewRepository.findByProductProductId(productId, pageable);
        return PageResponse.of(page.map(this::convertToResponse));
    }

    @Override
    @Transactional
    public ReviewResponse createReview(String username, ReviewRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản: " + username));
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm có ID: " + request.getProductId()));

        Review review = Review.builder()
                .user(user)
                .product(product)
                .rating(request.getRating())
                .comment(request.getComment())
                .reviewDate(LocalDateTime.now())
                .build();

        return convertToResponse(reviewRepository.save(review));
    }

    @Override
    @Transactional
    public ReviewResponse updateReview(String username, Integer reviewId, ReviewRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đánh giá có ID: " + reviewId));

        if (!review.getUser().getUsername().equals(username)) {
            throw new BadRequestException("Bạn không có quyền chỉnh sửa đánh giá này");
        }

        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setReviewDate(LocalDateTime.now());

        return convertToResponse(reviewRepository.save(review));
    }

    @Override
    @Transactional
    public void deleteReview(String username, boolean isAdmin, Integer reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đánh giá có ID: " + reviewId));

        if (!isAdmin && !review.getUser().getUsername().equals(username)) {
            throw new BadRequestException("Bạn không có quyền xóa đánh giá này");
        }

        reviewRepository.delete(review);
    }

    private ReviewResponse convertToResponse(Review review) {
        return ReviewResponse.builder()
                .reviewId(review.getReviewId())
                .userId(review.getUser().getUserId())
                .userFullName(review.getUser().getFullName())
                .productId(review.getProduct().getProductId())
                .productName(review.getProduct().getProductName())
                .rating(review.getRating())
                .comment(review.getComment())
                .reviewDate(review.getReviewDate())
                .build();
    }
}
