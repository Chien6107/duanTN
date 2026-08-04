const configuredUrl = (import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1")
  .trim()
  .replace(/\/+$/, "");

export const API_URL = configuredUrl.endsWith("/api/v1")
  ? configuredUrl
  : configuredUrl.endsWith("/api")
    ? `${configuredUrl}/v1`
    : `${configuredUrl}/api/v1`;
