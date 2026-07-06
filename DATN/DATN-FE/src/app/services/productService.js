import { request } from "./apiClient";

export const productService = {
    getAll: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.categoryId) queryParams.append("categoryId", params.categoryId);
        if (params.search) queryParams.append("search", params.search);
        if (params.page) queryParams.append("page", params.page);
        if (params.size) queryParams.append("size", params.size);
        
        const queryString = queryParams.toString();
        return request(`/products${queryString ? "?" + queryString : ""}`);
    },
    getById: (id) => request(`/products/${id}`),
    create: (productData) => request("/products", {
        method: "POST",
        body: JSON.stringify(productData),
    }),
    update: (id, productData) => request(`/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(productData),
    }),
    delete: (id) => request(`/products/${id}`, {
        method: "DELETE",
    }),
};
