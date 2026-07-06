import { request } from "./apiClient";

export const reviewService = {
    getByProduct: (productId) => request(`/reviews/product/${productId}`),
    create: (reviewData) => request("/reviews", {
        method: "POST",
        body: JSON.stringify(reviewData),
    }),
};
