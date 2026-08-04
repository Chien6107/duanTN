import { request } from "./apiClient";

const payload = (key, value) => ({
    settingKey: key,
    settingValue: value,
    description: "Dữ liệu quản trị đồng bộ"
});

export const settingService = {
    getSiteSettings: () => request("/site-settings"),
    updateSiteSettings: data => request("/site-settings", {
        method: "PUT",
        body: JSON.stringify(data)
    }),
    getByKey: key => request(`/settings/key/${encodeURIComponent(key)}`),
    upsert: async (key, value) => {
        try {
            return await request(`/settings/key/${encodeURIComponent(key)}`, {
                method: "PUT",
                body: JSON.stringify(payload(key, value))
            });
        } catch {
            return request("/settings", {
                method: "POST",
                body: JSON.stringify(payload(key, value))
            });
        }
    }
};
