import apiClient from "../api/apiClient";

export const getSuppliers = async () => {
  const res = await apiClient.get("/suppliers");
  return res.data;
};

export const addSupplier = async (data) => {
  const res = await apiClient.post("/suppliers", data);
  return res.data;
};

export const updateSupplier = async (id, data) => {
  const res = await apiClient.put(`/suppliers/${id}`, data);
  return res.data;
};

export const deleteSupplier = async (id) => {
  const res = await apiClient.delete(`/suppliers/${id}`);
  return res.data;
};

export const getSupplierStats = async () => {
  const res = await apiClient.get("/suppliers/stats");
  return res.data;
};