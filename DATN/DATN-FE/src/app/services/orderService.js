import { request } from "./apiClient";

export const orderService = {
    getAllAdmin: (status) => {
        const param = status !== undefined ? `?status=${status}` : "";
        return request(`/orders${param}`);
    },
    getMyOrders: () => request("/orders/my-orders"),
    getById: (id) => request(`/orders/${id}`),
    checkout: (checkoutData) => request("/orders/checkout", {
        method: "POST",
        body: JSON.stringify(checkoutData),
    }),
    updateStatus: (id, status) => request(`/orders/${id}/status?status=${status}`, {
        method: "PUT",
    }),
};
