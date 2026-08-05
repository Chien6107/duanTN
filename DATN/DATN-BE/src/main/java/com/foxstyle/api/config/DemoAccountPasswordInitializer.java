package com.foxstyle.api.config;

import com.foxstyle.api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.IntStream;

/** Keeps only the documented sample accounts in sync without reseeding business data. */
@Component
@ConditionalOnProperty(name = "app.seed-demo-data", havingValue = "true")
@RequiredArgsConstructor
public class DemoAccountPasswordInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.demo.admin-password}") private String adminPassword;
    @Value("${app.demo.staff-password}") private String staffPassword;
    @Value("${app.demo.customer-password}") private String customerPassword;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        updatePassword("admin", adminPassword);
        updatePassword("staff", staffPassword);
        IntStream.rangeClosed(1, 10)
                .forEach(index -> updatePassword("customer" + index, customerPassword));
    }

    private void updatePassword(String username, String rawPassword) {
        userRepository.findByUsername(username).ifPresent(user -> {
            if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
                user.setPassword(passwordEncoder.encode(rawPassword));
            }
            user.setStatus((byte) 1);
            user.setFailedLoginAttempts(0);
            userRepository.save(user);
        });
    }
}
