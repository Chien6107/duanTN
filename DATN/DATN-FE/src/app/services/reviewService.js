import { request } from "./apiClient";

export const reviewService = {
    getByProduct: (productId) => request(`/reviews/product/${productId}?size=10000&sort=reviewDate,desc`),
    getAll: () => request("/reviews/admin?size=10000&sort=reviewDate,desc"),
    create: (reviewData) => request("/reviews", {
        method: "POST",
        body: JSON.stringify(reviewData),
    }),
    update: (reviewId, reviewData) => request(`/reviews/${reviewId}`, {
        method: "PUT",
        body: JSON.stringify(reviewData),
    }),
    delete: (reviewId) => request(`/reviews/${reviewId}`, {
        method: "DELETE",
    }),
};
