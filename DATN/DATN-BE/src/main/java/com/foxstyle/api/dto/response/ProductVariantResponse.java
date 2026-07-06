package com.foxstyle.api.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariantResponse {
    private Integer variantId;
    private String color;
    private String size;
    private Integer quantity;
    private String sku;
}
