import { request } from "./apiClient";

export const bannerService = {
    getAllActive: () => request("/banners"),
    getAllAdmin: (page = 0, size = 100) => request(`/banners/all?page=${page}&size=${size}`),
    getById: (id) => request(`/banners/${id}`),
    create: (data) => request("/banners", {
        method: "POST",
        body: JSON.stringify(data),
    }),
    update: (id, data) => request(`/banners/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    }),
    delete: (id) => request(`/banners/${id}`, {
        method: "DELETE",
    }),
};
