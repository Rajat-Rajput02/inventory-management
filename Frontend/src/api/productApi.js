import apiClient from "./apiClient";

export const getProducts = async () => {
  const response = await apiClient.get("/products"); 
  return response.data;
};

export const createProduct = async (product) => {
  const formData = new FormData();
  Object.keys(product).forEach((key) => {
    if (product[key] !== null && product[key] !== undefined) {
      formData.append(key, product[key]);
    }
  });
  return apiClient.post("/products", formData);
};

export const updateProduct = async (id, product) => {
  const formData = new FormData();
  Object.keys(product).forEach((key) => {
    if (product[key] !== null && product[key] !== undefined) {
      formData.append(key, product[key]);
    }
  });
  return apiClient.put(`/products/${id}`, formData);
};

export const deleteProduct = async (id) => {
  const response = await apiClient.delete(`/products/${id}`);
  return response.data;
};

export const getLowStockProducts = async () => {
  const response = await apiClient.get("/products/low-stock");
  return response.data;
};