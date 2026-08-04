import { request } from "./apiClient";

export const userService = {
    getAll: (keyword) => {
        const param = keyword
            ? `?keyword=${encodeURIComponent(keyword)}&size=1000`
            : "?size=1000";
        return request(`/users${param}`);
    },
    updateStatus: (id, status) => request(`/users/${id}/status?status=${status}`, {
        method: "PATCH",
    }),
    create: (userData) => request("/users", {
        method: "POST",
        body: JSON.stringify(userData),
    }),
    update: (id, userData) => request(`/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(userData),
    }),
    resetStaffPassword: (id, citizenId, newPassword) => request(`/users/${id}/reset-password`, {
        method: "POST",
        body: JSON.stringify({ citizenId, newPassword }),
    }),
    delete: (id) => request(`/users/${id}`, {
        method: "DELETE",
    }),
};
