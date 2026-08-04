package com.foxstyle.api.config;

import com.foxstyle.api.entity.Role;
import com.foxstyle.api.entity.User;
import com.foxstyle.api.repository.RoleRepository;
import com.foxstyle.api.repository.UserRepository;
import com.foxstyle.api.util.PasswordPolicy;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Order(10)
@RequiredArgsConstructor
@ConditionalOnProperty(name = "app.seed-admin", havingValue = "true")
@SuppressWarnings("null")
public class AdminAccountInitializer implements ApplicationRunner {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.username}") private String username;
    @Value("${app.admin.password}") private String password;
    @Value("${app.admin.email}") private String email;
    @Value("${app.admin.full-name}") private String fullName;
    @Value("${app.admin.phone}") private String phone;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        validateConfiguration();
        Role adminRole = roleRepository.findByRoleName("ROLE_ADMIN")
                .orElseGet(() -> roleRepository.save(Role.builder()
                        .roleName("ROLE_ADMIN")
                        .description("System administrator")
                        .build()));

        User admin = userRepository.findByUsername(username).orElse(null);
        if (admin == null) {
            userRepository.findByEmail(email).ifPresent(existing -> {
                throw new IllegalStateException("ADMIN_EMAIL is already used by another account");
            });
            admin = User.builder().username(username).email(email).build();
        } else if (!email.equalsIgnoreCase(admin.getEmail()) && userRepository.existsByEmail(email)) {
            throw new IllegalStateException("ADMIN_EMAIL is already used by another account");
        }

        admin.setRole(adminRole);
        admin.setPassword(passwordEncoder.encode(password));
        admin.setEmail(email);
        admin.setFullName(fullName);
        admin.setPhone(phone.isBlank() ? null : phone);
        admin.setStatus((byte) 1);
        admin.setFailedLoginAttempts(0);
        userRepository.save(admin);
        System.out.println("[ADMIN SEED] Administrator account is ready: " + username);
    }

    private void validateConfiguration() {
        if (username.isBlank() || email.isBlank() || fullName.isBlank()) {
            throw new IllegalStateException("ADMIN_USERNAME, ADMIN_EMAIL and ADMIN_FULL_NAME are required");
        }
        if (!PasswordPolicy.isValid(password)) {
            throw new IllegalStateException(PasswordPolicy.MESSAGE);
        }
    }
}
