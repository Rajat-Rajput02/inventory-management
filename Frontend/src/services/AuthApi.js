import apiClient from "./apiClient";

// Register
export const register = async (userData) => {
  const response = await apiClient.post("/auth/register", userData);
  return response.data;
};

// Login
export const login = async (userData) => {
  const response = await apiClient.post("/auth/login", userData);
  return response.data;
};

// Get Profile
export const getProfile = async () => {
  const response = await apiClient.get("/users/profile");
  return response.data;
};