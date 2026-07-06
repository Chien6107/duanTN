package com.foxstyle.api.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CartItemRequest {

    @NotNull(message = "Biến thể sản phẩm không được để trống")
    private Integer variantId;

    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 1, message = "Số lượng phải lớn hơn 0")
    private Integer quantity;
}
