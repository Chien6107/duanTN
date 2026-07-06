package com.foxstyle.api.repository;

import com.foxstyle.api.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    List<Payment> findByOrderOrderId(Integer orderId);
    Page<Payment> findByPaymentStatus(Byte paymentStatus, Pageable pageable);
}
