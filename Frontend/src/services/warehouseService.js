import apiClient from "../api/apiClient";

export const getWarehouses = async () => {
  const { data } = await apiClient.get("/warehouses");
  return data;
};

export const createWarehouse = async (warehouse) => {
  const { data } = await apiClient.post("/warehouses", warehouse);
  return data;
};

export const updateWarehouse = async (id, warehouse) => {
  const { data } = await apiClient.put(`/warehouses/${id}`, warehouse);
  return data;
};

export const deleteWarehouse = async (id) => {
  const { data } = await apiClient.delete(`/warehouses/${id}`);
  return data;
};

export const getWarehouseStats = async () => {
  const { data } = await apiClient.get("/warehouses/stats");
  return data;
};