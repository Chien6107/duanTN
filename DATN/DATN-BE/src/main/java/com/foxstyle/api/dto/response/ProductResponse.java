package com.foxstyle.api.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {
    private Integer productId;
    private Integer categoryId;
    private String categoryName;
    private String productName;
    private BigDecimal price;
    private BigDecimal originalPrice;
    private String description;
    private String imageUrl;
    private String material;
    private String origin;
    private Byte status;
    private Double averageRating;
    private List<ProductVariantResponse> variants;
    private List<ProductImageResponse> images;
}
