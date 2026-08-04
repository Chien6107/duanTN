import { request } from "./apiClient";

export const chatService = {
  getAll: () => request("/chats"),
  getChannel: (channelId) => request(`/chats/channel/${encodeURIComponent(channelId)}`),
  send: (message) =>
    request("/chats", {
      method: "POST",
      body: JSON.stringify(message)
    })
};
