package com.foxstyle.api.entity;

import lombok.*;
import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FlashSaleProductId implements Serializable {
    private Integer flashSale;
    private Integer product;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof FlashSaleProductId that)) return false;
        return Objects.equals(flashSale, that.flashSale) && Objects.equals(product, that.product);
    }

    @Override
    public int hashCode() {
        return Objects.hash(flashSale, product);
    }
}
