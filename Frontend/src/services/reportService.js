import apiClient from "../api/apiClient";

export const getInventorySummary = async () => {
  const res = await apiClient.get("/reports/summary");
  return res.data;
};

export const getLowStockReport = async () => {
  const res = await apiClient.get("/reports/low-stock");
  return res.data;
};

export const getInventoryValuation = async () => {
  const res = await apiClient.get("/reports/valuation");
  return res.data;
};

export const getDashboardStats = async () => {
  const res = await apiClient.get("/reports/dashboard-stats");
  return res.data;
};

export const getChartData = async () => {
  const res = await apiClient.get("/reports/chart-data");
  return res.data;
};