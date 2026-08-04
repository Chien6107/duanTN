package com.foxstyle.api.util;

public final class PhonePolicy {
    public static final String REGEX = "^(?:0\\d{9}|\\+84\\d{9})$";
    public static final String OPTIONAL_REGEX = "^$|^(?:0\\d{9}|\\+84\\d{9})$";
    public static final String MESSAGE = "Số điện thoại phải gồm 10 số bắt đầu bằng 0 hoặc +84 theo sau bởi 9 số";

    private PhonePolicy() {}
}
