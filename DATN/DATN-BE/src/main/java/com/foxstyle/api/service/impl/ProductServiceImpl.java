package com.foxstyle.api.service.impl;

import com.foxstyle.api.dto.request.ProductImageRequest;
import com.foxstyle.api.dto.request.ProductRequest;
import com.foxstyle.api.dto.request.ProductVariantRequest;
import com.foxstyle.api.dto.response.*;
import com.foxstyle.api.entity.*;
import com.foxstyle.api.exception.BadRequestException;
import com.foxstyle.api.exception.ResourceNotFoundException;
import com.foxstyle.api.repository.*;
import com.foxstyle.api.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;
    private final ProductImageRepository imageRepository;
    private final CategoryRepository categoryRepository;
    private final ReviewRepository reviewRepository;

    @Override
    public PageResponse<ProductResponse> getProducts(Integer categoryId, String keyword,
                                                     BigDecimal minPrice, BigDecimal maxPrice,
                                                     Pageable pageable) {
        String normalizedKeyword = StringUtils.hasText(keyword) ? keyword.trim() : null;
        Page<Product> page = productRepository.filterProducts(
                categoryId, normalizedKeyword, minPrice, maxPrice, pageable);
        return PageResponse.of(page.map(this::convertToSummaryResponse));
    }

    @Override
    public PageResponse<ProductResponse> getAllProductsForAdmin(Pageable pageable) {
        return PageResponse.of(productRepository.findAll(pageable).map(this::convertToSummaryResponse));
    }

    @Override
    public ProductResponse getProductById(Integer productId) {
        Product product = findProductById(productId);
        return convertToDetailResponse(product);
    }

    @Override
    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        Product product = Product.builder()
                .category(findCategoryById(request.getCategoryId()))
                .status(request.getStatus() != null ? request.getStatus() : (byte) 1)
                .build();
        applyBasicInfo(product, request);

        Product saved = productRepository.save(product);
        saveVariants(saved, request.getVariants());
        saveImages(saved, request.getImages());

        return convertToDetailResponse(findProductById(saved.getProductId()));
    }

    @Override
    @Transactional
    public ProductResponse updateProduct(Integer productId, ProductRequest request) {
        Product product = findProductById(productId);
        product.setCategory(findCategoryById(request.getCategoryId()));
        applyBasicInfo(product, request);
        if (request.getStatus() != null) {
            product.setStatus(request.getStatus());
        }

        if (request.getVariants() != null) {
            updateVariants(product, request.getVariants());
        }

        return convertToDetailResponse(productRepository.save(product));
    }

    @Override
    @Transactional
    public void deleteProduct(Integer productId) {
        Product product = findProductById(productId);
        // Xóa mềm: chuyển trạng thái ngừng kinh doanh để không phá vỡ đơn hàng cũ
        product.setStatus((byte) 0);
        productRepository.save(product);
    }

    // ==================== Private helpers ====================

    private Product findProductById(Integer productId) {
        return productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm có ID: " + productId));
    }

    private Category findCategoryById(Integer categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy danh mục có ID: " + categoryId));
    }

    private void applyBasicInfo(Product product, ProductRequest request) {
        validatePrices(request);
        product.setProductName(request.getProductName());
        product.setPrice(request.getPrice());
        product.setOriginalPrice(request.getOriginalPrice());
        product.setDescription(request.getDescription());
        product.setImageUrl(request.getImageUrl());
        product.setMaterial(request.getMaterial());
        product.setOrigin(request.getOrigin());
    }

    private void validatePrices(ProductRequest request) {
        if (request.getOriginalPrice() != null
                && request.getOriginalPrice().compareTo(request.getPrice()) < 0) {
            throw new BadRequestException("Giá gốc không được nhỏ hơn giá bán hiện tại");
        }
    }

    private void saveVariants(Product product, List<ProductVariantRequest> variantRequests) {
        if (variantRequests == null) {
            return;
        }
        for (ProductVariantRequest req : variantRequests) {
            ProductVariant variant = ProductVariant.builder()
                    .product(product)
                    .color(req.getColor())
                    .size(req.getSize())
                    .quantity(req.getQuantity())
                    .sku(req.getSku())
                    .build();
            variantRepository.save(variant);
        }
    }

    private void updateVariants(Product product, List<ProductVariantRequest> variantRequests) {
        for (ProductVariantRequest req : variantRequests) {
            if (req.getVariantId() != null) {
                ProductVariant variant = variantRepository.findById(req.getVariantId())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "Không tìm thấy biến thể có ID: " + req.getVariantId()));
                variant.setColor(req.getColor());
                variant.setSize(req.getSize());
                variant.setQuantity(req.getQuantity());
                variant.setSku(req.getSku());
                variantRepository.save(variant);
            } else {
                saveVariants(product, List.of(req));
            }
        }
    }

    private void saveImages(Product product, List<ProductImageRequest> imageRequests) {
        if (imageRequests == null) {
            return;
        }
        for (ProductImageRequest req : imageRequests) {
            ProductImage image = ProductImage.builder()
                    .product(product)
                    .imageUrl(req.getImageUrl())
                    .isPrimary(Boolean.TRUE.equals(req.getIsPrimary()))
                    .displayOrder(req.getDisplayOrder() != null ? req.getDisplayOrder() : 1)
                    .build();
            imageRepository.save(image);
        }
    }

    /** Bản rút gọn cho danh sách (không kèm variants/images chi tiết). */
    private ProductResponse convertToSummaryResponse(Product product) {
        return convertToDetailResponse(product);
    }

    /** Bản đầy đủ cho trang chi tiết sản phẩm. */
    private ProductResponse convertToDetailResponse(Product product) {
        List<ProductVariantResponse> variants = variantRepository
                .findByProductProductId(product.getProductId())
                .stream()
                .map(this::convertVariant)
                .toList();

        List<ProductImageResponse> images = imageRepository
                .findByProductProductIdOrderByDisplayOrderAsc(product.getProductId())
                .stream()
                .map(this::convertImage)
                .toList();

        ProductResponse response = buildBaseResponse(product);
        response.setVariants(variants);
        response.setImages(images);
        return response;
    }

    private ProductResponse buildBaseResponse(Product product) {
        return ProductResponse.builder()
                .productId(product.getProductId())
                .categoryId(product.getCategory().getCategoryId())
                .categoryName(product.getCategory().getCategoryName())
                .productName(product.getProductName())
                .price(product.getPrice())
                .originalPrice(product.getOriginalPrice())
                .description(product.getDescription())
                .imageUrl(product.getImageUrl())
                .material(product.getMaterial())
                .origin(product.getOrigin())
                .status(product.getStatus())
                .averageRating(reviewRepository.findAverageRatingByProductId(product.getProductId()))
                .build();
    }

    private ProductVariantResponse convertVariant(ProductVariant variant) {
        return ProductVariantResponse.builder()
                .variantId(variant.getVariantId())
                .color(variant.getColor())
                .size(variant.getSize())
                .quantity(variant.getQuantity())
                .sku(variant.getSku())
                .build();
    }

    private ProductImageResponse convertImage(ProductImage image) {
        return ProductImageResponse.builder()
                .imageId(image.getImageId())
                .imageUrl(image.getImageUrl())
                .isPrimary(image.getIsPrimary())
                .displayOrder(image.getDisplayOrder())
                .build();
    }
}
