package com.foxstyle.api.repository;

import com.foxstyle.api.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
    Page<Order> findByUserUserId(Integer userId, Pageable pageable);
    Page<Order> findByStatus(Byte status, Pageable pageable);
}
