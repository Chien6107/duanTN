package com.foxstyle.api;

import com.foxstyle.api.controller.AdminModuleDataController;
import com.foxstyle.api.entity.Order;
import com.foxstyle.api.entity.User;
import com.foxstyle.api.exception.BadRequestException;
import com.foxstyle.api.repository.OrderRepository;
import com.foxstyle.api.service.impl.PaymentServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CriticalBusinessRulesTest {

    @Mock private OrderRepository orderRepository;
    @InjectMocks private PaymentServiceImpl paymentService;

    @Test
    void threeSensitiveAdminModulesAreAdminOnly() {
        PreAuthorize rule = AdminModuleDataController.class.getAnnotation(PreAuthorize.class);
        assertNotNull(rule);
        assertEquals("hasRole('ADMIN')", rule.value());
    }

    @Test
    void paymentStatusOnlyAcceptsZeroOneOrTwo() {
        assertThrows(BadRequestException.class,
                () -> paymentService.updatePaymentStatus(1, (byte) 9, null));
        assertThrows(BadRequestException.class,
                () -> paymentService.updatePaymentStatus(1, (byte) -1, null));
    }

    @Test
    void customerCanOnlyAccessOwnOrderPayment() {
        User owner = User.builder().username("customer1").build();
        Order order = Order.builder().orderId(10).user(owner).build();
        when(orderRepository.findById(10)).thenReturn(Optional.of(order));

        assertDoesNotThrow(() -> paymentService.assertOrderAccess(10, "customer1", false));
        assertThrows(BadRequestException.class,
                () -> paymentService.assertOrderAccess(10, "customer2", false));
        assertDoesNotThrow(() -> paymentService.assertOrderAccess(10, "staff", true));
    }
}
