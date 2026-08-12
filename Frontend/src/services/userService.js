import apiClient from "../api/apiClient";
// =========================
// Get Profile
// =========================
export const getProfile = async () => {
  const res = await apiClient.get("/users/profile");

  return res.data;
};
// =========================
// Update Profile
// =========================
export const updateProfile = async (data) => {
  const res = await apiClient.put("/users/profile", data);

  return res.data;
};
// =========================
// Change Password
// =========================
export const changePassword = async (data) => {
  const res = await apiClient.put("/users/change-password",data);

  return res.data;
};
// =========================
// Upload Avatar
// =========================
// export const uploadAvatar = async (file) => {
//   const formData = new FormData();

//   formData.append("avatar", file);

//   const res = await apiClient.post(
//     "/users/avatar",
//     formData,
//     {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     }
//   );

//   return res.data;
// };
export const uploadAvatar = async (formData) => {
  const res = await apiClient.post("/users/avatar", formData);

  return res.data;
};


// user role related code
export const getUsers = async () => {
  const response = await apiClient.get("/users");
  return response.data;
};

export const updateUserRole = async (userId, role) => {
  const response = await apiClient.put(
    `/users/${userId}/role`,
    { role }
  );

  return response.data;
};

export const updateUserStatus = async (userId, isActive) => {
  const response = await apiClient.put(
    `/users/${userId}/status`,
    { isActive }
  );

  return response.data;
};