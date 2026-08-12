import apiClient from "../api/apiClient";

export const getActivities = async () => {
  const { data } = await apiClient.get("/activities");
  return data;
};