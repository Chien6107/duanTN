import { normalizeVietnameseData } from "../utils/vietnameseText";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

export async function request(endpoint, options = {}) {
    const token = localStorage.getItem("foxstyle_token");
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }
    const config = {
        cache: "no-store",
        ...options,
        headers,
    };
    const response = await fetch(`${API_URL}${endpoint}`, config);
    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const error = new Error(errData.message || "Đã xảy ra lỗi hệ thống!");
        error.status = response.status;
        error.data = errData;
        throw error;
    }
    return normalizeVietnameseData(await response.json());
}
