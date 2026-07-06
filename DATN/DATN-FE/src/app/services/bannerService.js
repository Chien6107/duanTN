import { request } from "./apiClient";

export const bannerService = {
    getAll: () => request("/banners"),
};
