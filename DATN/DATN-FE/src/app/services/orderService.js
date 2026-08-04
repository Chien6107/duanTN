import { request } from "./apiClient";

export const orderService = {
    getAllAdmin: (status) => {
        const param = status !== undefined
            ? `?status=${status}&size=1000&sort=orderDate,desc`
            : "?size=1000&sort=orderDate,desc";
        return request(`/orders${param}`);
    },
    getMyOrders: () => request("/orders/my-orders"),
    getById: (id) => request(`/orders/${id}`),
    checkout: (checkoutData) => request("/orders/checkout", {
        method: "POST",
        body: JSON.stringify(checkoutData),
    }),
    updateStatus: (id, status, details = {}) => {
        const params = new URLSearchParams({ status: String(status) });
        if (details.reason) params.set("reason", details.reason);
        if (details.warrantyRedelivery !== undefined) {
            params.set("warrantyRedelivery", String(details.warrantyRedelivery));
        }
        return request(`/orders/${id}/status?${params.toString()}`, {
        method: "PUT",
        });
    },
    cancelOrder: (id, reason) => request(`/orders/${id}/cancel?reason=${encodeURIComponent(reason)}`, {
        method: "POST",
    }),
    returnOrder: (id, reason, warrantyRedelivery = false) =>
        request(
            `/orders/${id}/return?reason=${encodeURIComponent(reason)}&warrantyRedelivery=${warrantyRedelivery}`,
            { method: "POST" }
        ),
    dispatch: (id, carrier) =>
        request(`/orders/${id}/dispatch?carrier=${encodeURIComponent(carrier)}`, {
            method: "POST",
        }),
    updateShippingFee: (id, amount) =>
        request(`/orders/${id}/shipping-fee?amount=${amount}`, {
            method: "PATCH",
        }),
};
