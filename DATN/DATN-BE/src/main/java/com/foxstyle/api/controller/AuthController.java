package com.foxstyle.api.controller;

import com.foxstyle.api.dto.request.LoginRequest;
import com.foxstyle.api.dto.request.RegisterRequest;
import com.foxstyle.api.dto.response.ApiResponse;
import com.foxstyle.api.dto.response.AuthResponse;
import com.foxstyle.api.dto.response.UserResponse;
import com.foxstyle.api.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse authResponse = authService.login(request);
        ApiResponse<AuthResponse> response = ApiResponse.<AuthResponse>builder()
                .status("success")
                .message("Đăng nhập thành công")
                .data(authResponse)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserResponse>> register(@Valid @RequestBody RegisterRequest request) {
        UserResponse userResponse = authService.register(request);
        ApiResponse<UserResponse> response = ApiResponse.<UserResponse>builder()
                .status("success")
                .message("Đăng ký tài khoản thành công")
                .data(userResponse)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        UserResponse userResponse = authService.getCurrentUser(principal.getName());
        ApiResponse<UserResponse> response = ApiResponse.<UserResponse>builder()
                .status("success")
                .message("Lấy thông tin tài khoản thành công")
                .data(userResponse)
                .timestamp(LocalDateTime.now())
                .build();
        return ResponseEntity.ok(response);
    }
}
