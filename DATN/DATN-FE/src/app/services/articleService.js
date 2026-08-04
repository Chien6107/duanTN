import { request } from "./apiClient";

export const articleService = {
  getPublished: () => request("/articles"),
  getAll: () => request("/articles/all"),
  create: (article) => request("/articles", {
    method: "POST",
    body: JSON.stringify(article),
  }),
  update: (id, article) => request(`/articles/${id}`, {
    method: "PUT",
    body: JSON.stringify(article),
  }),
  remove: (id) => request(`/articles/${id}`, {
    method: "DELETE",
  }),
};
