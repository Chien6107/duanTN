package com.foxstyle.api.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductRequest {

    @NotNull(message = "Danh mục sản phẩm không được để trống")
    private Integer categoryId;

    @NotBlank(message = "Tên sản phẩm không được để trống")
    @Size(max = 150, message = "Tên sản phẩm tối đa 150 ký tự")
    private String productName;

    @NotNull(message = "Giá bán không được để trống")
    @DecimalMin(value = "0.0", message = "Giá bán phải >= 0")
    private BigDecimal price;

    @DecimalMin(value = "0.0", message = "Giá gốc phải >= 0")
    private BigDecimal originalPrice;

    private String description;

    private String imageUrl;

    private String material;

    private String origin;

    @Min(value = 0, message = "Trạng thái chỉ nhận 0 hoặc 1")
    @Max(value = 1, message = "Trạng thái chỉ nhận 0 hoặc 1")
    private Byte status;

    @Valid
    private List<ProductVariantRequest> variants;

    @Valid
    private List<ProductImageRequest> images;
}
