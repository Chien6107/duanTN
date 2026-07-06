import { request } from "./apiClient";

export const userService = {
    getAll: (keyword) => {
        const param = keyword ? `?keyword=${keyword}` : "";
        return request(`/users${param}`);
    },
    updateStatus: (id, status) => request(`/users/${id}/status?status=${status}`, {
        method: "PUT",
    }),
};
