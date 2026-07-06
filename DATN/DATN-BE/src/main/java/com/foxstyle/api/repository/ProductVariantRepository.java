package com.foxstyle.api.repository;

import com.foxstyle.api.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Integer> {
    List<ProductVariant> findByProductProductId(Integer productId);
    Optional<ProductVariant> findByProductProductIdAndColorAndSize(Integer productId, String color, String size);
}
