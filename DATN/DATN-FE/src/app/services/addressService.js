import { request } from "./apiClient";

export const addressService = {
    getAll: () => request("/addresses"),
    getById: (id) => request(`/addresses/${id}`),
    create: (addressData) => request("/addresses", {
        method: "POST",
        body: JSON.stringify(addressData),
    }),
    update: (id, addressData) => request(`/addresses/${id}`, {
        method: "PUT",
        body: JSON.stringify(addressData),
    }),
    delete: (id) => request(`/addresses/${id}`, {
        method: "DELETE",
    }),
};
