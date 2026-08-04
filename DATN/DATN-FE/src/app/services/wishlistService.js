import { request } from "./apiClient";

export const wishlistService = {
  getAll: () => request("/wishlists?page=0&size=100"),
  add: (productId) => request(`/wishlists/product/${productId}`, { method: "POST" }),
  remove: (productId) => request(`/wishlists/product/${productId}`, { method: "DELETE" })
};
