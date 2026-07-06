import { request } from "./apiClient";

export const authService = {
    login: (username, password) => request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
    }),
    register: (username, password, fullName, email, phone) => request("/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, password, fullName, email, phone }),
    }),
    getProfile: () => request("/auth/me"),
};
