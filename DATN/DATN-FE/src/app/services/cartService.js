import { request } from "./apiClient";

export const cartService = {
    get: () => request("/carts/my-cart"),
    addItem: (variantId, quantity) => request("/carts/items", {
        method: "POST",
        body: JSON.stringify({ variantId, quantity }),
    }),
    updateQuantity: (detailId, quantity) => request(`/carts/items/${detailId}?quantity=${quantity}`, {
        method: "PUT",
    }),
    removeItem: (detailId) => request(`/carts/items/${detailId}`, {
        method: "DELETE",
    }),
};
