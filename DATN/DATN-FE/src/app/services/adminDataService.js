import { request } from "./apiClient";

export const adminDataService = {
  list: (module) => request(`/admin-data/${module}`),
  create: (module, data) => request(`/admin-data/${module}`, { method: "POST", body: JSON.stringify(data) }),
  update: (module, id, data) => request(`/admin-data/${module}/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (module, id) => request(`/admin-data/${module}/${id}`, { method: "DELETE" })
};
