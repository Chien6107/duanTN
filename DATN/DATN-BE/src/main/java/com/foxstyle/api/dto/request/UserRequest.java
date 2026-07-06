package com.foxstyle.api.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

/**
 * Dùng cho ADMIN tạo/cập nhật tài khoản (có thể gán role bất kỳ).
 */
@Data
public class UserRequest {

    @NotBlank(message = "Tên đăng nhập không được để trống")
    private String username;

    // Cho phép null khi cập nhật (giữ mật khẩu cũ)
    private String password;

    @NotBlank(message = "Họ và tên không được để trống")
    private String fullName;

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    private String email;

    private String phone;

    @NotNull(message = "Role không được để trống")
    private Integer roleId;

    @Min(value = 0, message = "Trạng thái chỉ nhận 0 hoặc 1")
    @Max(value = 1, message = "Trạng thái chỉ nhận 0 hoặc 1")
    private Byte status;
}
