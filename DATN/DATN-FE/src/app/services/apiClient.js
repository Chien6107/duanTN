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
        ...options,
        headers,
    };
    const response = await fetch(`${API_URL}${endpoint}`, config);
    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Đã xảy ra lỗi hệ thống!");
    }
    return response.json();
}
