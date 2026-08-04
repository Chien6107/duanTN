export const PHONE_PATTERN = /^(?:0\d{9}|\+84\d{9})$/;
export const PHONE_MESSAGE = "Số điện thoại phải gồm 10 số bắt đầu bằng 0 hoặc +84 theo sau bởi 9 số.";

export const isValidVietnamesePhone = (value) => PHONE_PATTERN.test(String(value || "").trim());
