package com.foxstyle.api.config;

import com.foxstyle.api.entity.Role;
import com.foxstyle.api.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * Ensures the core roles exist regardless of SEED_DEMO_DATA/SEED_ADMIN.
 * These are required system data, not demo data — without ROLE_CUSTOMER,
 * every customer registration fails with "Chưa khởi tạo quyền ROLE_CUSTOMER".
 */
@Component
@Order(-300)
@RequiredArgsConstructor
public class RoleInitializer implements ApplicationRunner {

    private final RoleRepository roleRepository;

    @Override
    public void run(ApplicationArguments args) {
        ensureRole("ROLE_ADMIN", "Quản trị viên hệ thống tối cao");
        ensureRole("ROLE_STAFF", "Nhân viên vận hành, quản lý kho và đơn hàng");
        ensureRole("ROLE_CUSTOMER", "Khách hàng mua sắm trực tuyến");
    }

    private void ensureRole(String roleName, String description) {
        roleRepository.findByRoleName(roleName).orElseGet(() -> roleRepository.save(
                Role.builder().roleName(roleName).description(description).build()));
    }
}
