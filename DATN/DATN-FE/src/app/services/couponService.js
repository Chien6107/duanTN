import { request } from "./apiClient";

export const couponService = {
    getAllAdmin: () => request("/coupons"),
    create: (couponData) => request("/coupons", {
        method: "POST",
        body: JSON.stringify(couponData),
    }),
    update: (id, couponData) => request(`/coupons/${id}`, {
        method: "PUT",
        body: JSON.stringify(couponData),
    }),
    delete: (id) => request(`/coupons/${id}`, {
        method: "DELETE",
    }),
    validate: (code, orderValue) => request(`/coupons/validate?code=${code}&orderValue=${orderValue}`),
};
