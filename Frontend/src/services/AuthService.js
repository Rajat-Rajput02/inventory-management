import apiClient from "../api/apiClient";

export const loginUser = async (data) => {
  const response = await apiClient.post("/auth/login", data);
  return response.data;
};

export const registerUser = async (data) => {
  const response = await apiClient.post("/auth/register", data);
  return response.data;
};

// We'll use this once the backend profile API exists
export const getProfile = async () => {
  const response = await apiClient.get("/users/profile");
  return response.data;
};