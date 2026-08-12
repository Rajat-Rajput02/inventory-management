import apiClient from "../api/apiClient";

export const getNotifications = async () => {
  const { data } = await apiClient.get("/notifications");
  return data;
};

export const markAsRead = async (id) => {
  const { data } = await apiClient.put(`/notifications/${id}`);
  return data;
};

export const markAllRead = async () => {
  const { data } = await apiClient.put("/notifications/read/all");
  return data;
};