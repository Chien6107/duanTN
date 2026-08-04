package com.foxstyle.api.entity;

import lombok.*;
import java.io.Serializable;
import java.util.Objects;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ArticleProductId implements Serializable {
    private Integer article;
    private Integer product;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ArticleProductId that)) return false;
        return Objects.equals(article, that.article) && Objects.equals(product, that.product);
    }

    @Override
    public int hashCode() {
        return Objects.hash(article, product);
    }
}
