package com.foxstyle.api.service;

import com.foxstyle.api.dto.request.LoginRequest;
import com.foxstyle.api.dto.request.RegisterRequest;
import com.foxstyle.api.dto.response.AuthResponse;
import com.foxstyle.api.dto.response.UserResponse;

public interface AuthService {

    /** Đăng nhập, trả về JWT token kèm thông tin người dùng. */
    AuthResponse login(LoginRequest request);

    /** Đăng ký tài khoản khách hàng mới (mặc định ROLE_CUSTOMER). */
    UserResponse register(RegisterRequest request);

    /** Lấy thông tin tài khoản đang đăng nhập. */
    UserResponse getCurrentUser(String username);
}
