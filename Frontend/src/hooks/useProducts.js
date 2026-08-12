import { useEffect, useState, useCallback } from "react";

import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/productApi";
import { getNotifications } from "../services/notificationService";


const useProducts = () => {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getProducts();

      setProducts(data);

      setError("");
    } catch (err) {
      // console.error(err);
      setError("Unable to fetch products.");
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ADD PRODUCT

  const addProduct = async (product) => {
    try {
      await createProduct(product);

      await fetchProducts();
      getNotifications();
    } catch (err) {
      console.error(err);

      throw err;
    }
  };

  // UPDATE PRODUCT

  const editProduct = async (id, product) => {
    try {
      await updateProduct(id, product);

      await fetchProducts();
      getNotifications();
    } catch (err) {
      console.error(err);

      throw err;
    }
  };

  // DELETE PRODUCT

  const removeProduct = async (id) => {
    try {
      await deleteProduct(id);

      await fetchProducts();
      getNotifications();
    } catch (err) {
      console.error(err);

      throw err;
    }
  };

  return {
    products,
    loading,
    error,

    addProduct,

    editProduct,

    removeProduct,

    refreshProducts: fetchProducts,
  };
};

export default useProducts;