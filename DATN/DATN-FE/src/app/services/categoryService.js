import { request } from "./apiClient";

export const categoryService = {
    getAll: () => request("/categories"),
    getAllAdmin: () => request("/categories/all"),
    create: (categoryData) => request("/categories", {
        method: "POST",
        body: JSON.stringify(categoryData),
    }),
    update: (id, categoryData) => request(`/categories/${id}`, {
        method: "PUT",
        body: JSON.stringify(categoryData),
    }),
    delete: (id) => request(`/categories/${id}`, {
        method: "DELETE",
    }),
};
