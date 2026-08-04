package com.foxstyle.api.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class UserAddressRequest {

    @NotBlank(message = "Tên người nhận không được để trống")
    private String recipientName;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = com.foxstyle.api.util.PhonePolicy.REGEX, message = com.foxstyle.api.util.PhonePolicy.MESSAGE)
    private String phone;

    @NotBlank(message = "Tỉnh/Thành phố không được để trống")
    private String province;

    @NotBlank(message = "Quận/Huyện không được để trống")
    private String district;

    @NotBlank(message = "Phường/Xã không được để trống")
    private String ward;

    @NotBlank(message = "Địa chỉ chi tiết không được để trống")
    private String detailAddress;

    private Boolean isDefault;
}
