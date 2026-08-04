import { request } from "./apiClient";

export const languageService = {
    getDictionary: (code) => request(`/language/${code}`),
    saveLanguage: (language) => request("/language/save", {
        method: "POST",
        body: JSON.stringify({ language }),
    }),
    saveTheme: (theme) => request("/theme/save", {
        method: "POST",
        body: JSON.stringify({ theme }),
    }),
};
