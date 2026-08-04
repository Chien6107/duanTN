import { request } from "./apiClient";

export const authService = {
    login: (username, password) => request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
    }),
    register: (username, password, fullName, email, phone, otp) => request("/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, password, fullName, email, phone, otp }),
    }),
    registerStaff: (username, password, fullName, email, phone, otp) => request("/auth/register-staff", {
        method: "POST",
        body: JSON.stringify({ username, password, fullName, email, phone, otp }),
    }),
    sendOtp: (type, email, phone) => request("/auth/otp/send", {
        method: "POST",
        body: JSON.stringify({ type, email, phone }),
    }),
    verifyOtp: (type, email, phone, otp) => request("/auth/otp/verify", {
        method: "POST",
        body: JSON.stringify({ type, email, phone, otp }),
    }),
    firebaseSuccess: (phone, otp) => request("/auth/otp/firebase-success", {
        method: "POST",
        body: JSON.stringify({ phone, otp }),
    }),
    getProfile: () => request("/auth/me"),
    deactivate: () => request("/auth/deactivate", { method: "PUT" }),
    deleteAccount: () => request("/auth/delete-account", { method: "DELETE" }),
    googleLogin: (idToken) => request("/auth/google", {
        method: "POST",
        body: JSON.stringify({ idToken }),
    }),
    sendForgotPasswordOtp: (email) => request("/auth/forgot-password/send-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
    }),
    findAccount: (keyword) => request(`/auth/forgot-password/find-account?keyword=${encodeURIComponent(keyword)}`),
    resetPassword: (email, otp, newPassword) => request("/auth/forgot-password/reset", {
        method: "POST",
        body: JSON.stringify({ email, otp, newPassword }),
    }),
};

