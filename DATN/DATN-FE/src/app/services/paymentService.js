import { request } from "./apiClient";

export const paymentService = {
    getAllPayments: (status) => {
        const param = status !== undefined
            ? `?status=${status}&size=1000&sort=paymentDate,desc`
            : "?size=1000&sort=paymentDate,desc";
        return request(`/payments${param}`);
    },
    getPaymentsByOrder: (orderId) => request(`/payments/order/${orderId}`),
    updatePaymentStatus: (paymentId, status, transactionId) => {
        const txParam = transactionId ? `&transactionId=${encodeURIComponent(transactionId)}` : "";
        return request(`/payments/${paymentId}/status?status=${status}${txParam}`, {
            method: "PUT",
        });
    },
    updateReconciliation: (paymentId, reconciled) =>
        request(`/payments/${paymentId}/reconciliation?reconciled=${reconciled}`, {
            method: "PATCH",
        }),
    createPayOSLink: (orderId, returnUrl, cancelUrl) => {
        const params = new URLSearchParams();
        if (returnUrl) params.append("returnUrl", returnUrl);
        if (cancelUrl) params.append("cancelUrl", cancelUrl);
        const query = params.toString() ? `?${params.toString()}` : "";
        return request(`/payments/payos/create-link/${orderId}${query}`, {
            method: "POST",
        });
    },
    checkPayOSStatus: (orderCode) => request(`/payments/payos/check-status/${orderCode}`),
};
