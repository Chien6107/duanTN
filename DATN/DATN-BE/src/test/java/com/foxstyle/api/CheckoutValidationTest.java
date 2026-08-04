package com.foxstyle.api;

import com.foxstyle.api.dto.request.CartItemRequest;
import com.foxstyle.api.dto.request.CheckoutRequest;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class CheckoutValidationTest {
    private final Validator validator = Validation.buildDefaultValidatorFactory().getValidator();

    @Test
    void checkoutRejectsInvalidPhoneAndUnverifiedAddress() {
        CheckoutRequest request = validCheckout();
        request.setRecipientPhone("12345");
        request.setShippingAddress("Địa chỉ không có tọa độ");
        assertFalse(validator.validate(request).isEmpty());
    }

    @Test
    void checkoutAcceptsVietnamPhoneAndVerifiedAddress() {
        CheckoutRequest request = validCheckout();
        assertTrue(validator.validate(request).isEmpty());
        request.setRecipientPhone("+84912345678");
        assertTrue(validator.validate(request).isEmpty());
    }

    @Test
    void checkoutRejectsEmptyCartAndZeroQuantity() {
        CheckoutRequest request = validCheckout();
        request.getItems().get(0).setQuantity(0);
        assertFalse(validator.validate(request).isEmpty());
        request.setItems(List.of());
        assertFalse(validator.validate(request).isEmpty());
    }

    private CheckoutRequest validCheckout() {
        CartItemRequest item = new CartItemRequest();
        item.setVariantId(1);
        item.setQuantity(1);
        CheckoutRequest request = new CheckoutRequest();
        request.setRecipientName("Nguyễn Văn A");
        request.setRecipientPhone("0912345678");
        request.setShippingAddress("12 Nguyễn Văn Linh, Hải Châu, Đà Nẵng [Định vị: 16.0471, 108.2068]");
        request.setPaymentMethod("COD");
        request.setItems(List.of(item));
        return request;
    }
}
