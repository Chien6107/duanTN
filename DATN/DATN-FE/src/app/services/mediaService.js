import { API_URL } from "./apiConfig";

export const mediaService = {
  async upload(file, folder) {
    const body = new FormData();
    body.append("file", file);
    body.append("folder", folder);
    const token = localStorage.getItem("foxstyle_token");
    const response = await fetch(`${API_URL}/media/upload`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body,
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || "Không thể lưu tệp media");
    return result;
  },
};
