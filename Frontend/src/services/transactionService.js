import apiClient from "../api/apiClient";
import { getNotifications } from "./notificationService";
import * as notificationService from "./notificationService"; 

export const createTransaction = async (data) => {
  const response = await apiClient.post("/transactions", data);
  
  // Safely attempt notification update without breaking the main flow
  try {
    if (typeof notificationService.getNotifications === "function") {
      await notificationService.getNotifications();
    }
  } catch (err) {
    console.warn("Notification refresh skipped:", err);
  }

  return response.data;
};

export const getTransactions = async () => {
  const response = await apiClient.get("/transactions");
  return response.data;
};

export const getProductHistory = async (productId) => {
  const response = await apiClient.get(`/transactions/product/${productId}`);
  return response.data;
};