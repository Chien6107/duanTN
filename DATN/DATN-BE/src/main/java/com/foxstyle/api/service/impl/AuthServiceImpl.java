package com.foxstyle.api.service.impl;

import com.foxstyle.api.dto.request.LoginRequest;
import com.foxstyle.api.dto.request.RegisterRequest;
import com.foxstyle.api.dto.response.AuthResponse;
import com.foxstyle.api.dto.response.UserResponse;
import com.foxstyle.api.entity.Role;
import com.foxstyle.api.entity.User;
import com.foxstyle.api.exception.BadRequestException;
import com.foxstyle.api.exception.ResourceNotFoundException;
import com.foxstyle.api.repository.RoleRepository;
import com.foxstyle.api.repository.UserRepository;
import com.foxstyle.api.security.JwtUtil;
import com.foxstyle.api.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@SuppressWarnings("null")
public class AuthServiceImpl implements AuthService {

    private static final String DEFAULT_CUSTOMER_ROLE = "ROLE_CUSTOMER";

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @Override
    public AuthResponse login(LoginRequest request) {
        // Ném BadCredentialsException/DisabledException nếu sai — GlobalExceptionHandler xử lý
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));

        User user = findUserByUsername(request.getUsername());
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().getRoleName());

        return AuthResponse.builder()
                .accessToken(token)
                .user(convertToUserResponse(user))
                .build();
    }

    @Override
    @Transactional
    public UserResponse register(RegisterRequest request) {
        validateNewAccount(request.getUsername(), request.getEmail());

        User newUser = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .role(getCustomerRole())
                .status((byte) 1)
                .build();

        return convertToUserResponse(userRepository.save(newUser));
    }

    @Override
    public UserResponse getCurrentUser(String username) {
        return convertToUserResponse(findUserByUsername(username));
    }

    // ==================== Private helpers ====================

    private User findUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy tài khoản: " + username));
    }

    private void validateNewAccount(String username, String email) {
        if (userRepository.existsByUsername(username)) {
            throw new BadRequestException("Tên đăng nhập đã tồn tại!");
        }
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email này đã được sử dụng!");
        }
    }

    private Role getCustomerRole() {
        return roleRepository.findByRoleName(DEFAULT_CUSTOMER_ROLE)
                .orElseThrow(() -> new ResourceNotFoundException("Chưa khởi tạo quyền " + DEFAULT_CUSTOMER_ROLE));
    }

    private UserResponse convertToUserResponse(User user) {
        return UserResponse.builder()
                .userId(user.getUserId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .status(user.getStatus())
                .roleName(user.getRole().getRoleName())
                .build();
    }
}
