package com.foxstyle.api.config;

import com.foxstyle.api.entity.Role;
import com.foxstyle.api.entity.User;
import com.foxstyle.api.repository.RoleRepository;
import com.foxstyle.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Khởi tạo từng vai trò (Roles) nếu chưa tồn tại
        Role adminRole = roleRepository.findByRoleName("ROLE_ADMIN")
                .orElseGet(() -> roleRepository.save(Role.builder()
                        .roleName("ROLE_ADMIN")
                        .description("Quản trị viên hệ thống tối cao")
                        .build()));

        Role staffRole = roleRepository.findByRoleName("ROLE_STAFF")
                .orElseGet(() -> roleRepository.save(Role.builder()
                        .roleName("ROLE_STAFF")
                        .description("Nhân viên vận hành, quản lý kho và đơn hàng")
                        .build()));

        Role customerRole = roleRepository.findByRoleName("ROLE_CUSTOMER")
                .orElseGet(() -> roleRepository.save(Role.builder()
                        .roleName("ROLE_CUSTOMER")
                        .description("Khách hàng mua sắm trực tuyến")
                        .build()));

        // Khởi tạo các tài khoản (Users) mẫu nếu chưa tồn tại
        if (userRepository.count() == 0) {

            // Mật khẩu mã hóa bằng PasswordEncoder của Spring Security
            String defaultHashedPassword = passwordEncoder.encode("123456");

            User adminUser = User.builder()
                    .role(adminRole)
                    .username("admin_fox")
                    .password(defaultHashedPassword)
                    .fullName("Nguyễn Quản Trị")
                    .email("admin@foxstyle.vn")
                    .phone("0912345678")
                    .status((byte) 1)
                    .build();

            User staffUser = User.builder()
                    .role(staffRole)
                    .username("staff_chien")
                    .password(defaultHashedPassword)
                    .fullName("Lê Văn Nhân Viên")
                    .email("staff@foxstyle.vn")
                    .phone("0987654321")
                    .status((byte) 1)
                    .build();

            User customerUser = User.builder()
                    .role(customerRole)
                    .username("customer_demo")
                    .password(defaultHashedPassword)
                    .fullName("Nguyễn Văn Khách Hàng")
                    .email("demo@gmail.com")
                    .phone("0334455667")
                    .status((byte) 1)
                    .build();

            userRepository.save(adminUser);
            userRepository.save(staffUser);
            userRepository.save(customerUser);
            System.out.println("Initialized default users: admin_fox, staff_chien, customer_demo");
        }
    }
}
