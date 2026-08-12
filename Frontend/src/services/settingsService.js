import apiClient from "../api/apiClient";

export const getSettings = async () => {
  const { data } = await apiClient.get("/settings");
  return data;
};

export const updateSettings = async (payload) => {
  const { data } = await apiClient.put("/settings", payload);
  return data;
};