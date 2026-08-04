package com.foxstyle.api.util;

import java.util.regex.Pattern;

public final class PasswordPolicy {
    public static final String REGEX = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,100}$";
    public static final String MESSAGE = "Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt";
    private static final Pattern PATTERN = Pattern.compile(REGEX);
    private PasswordPolicy() {}
    public static boolean isValid(String password) {
        return password != null && PATTERN.matcher(password).matches();
    }
}
