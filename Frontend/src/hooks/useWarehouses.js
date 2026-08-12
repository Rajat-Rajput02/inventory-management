import { useEffect, useState } from "react";

import {
  getWarehouses,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} from "../services/warehouseService";

const useWarehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadWarehouses = async () => {
    try {
      const data = await getWarehouses();
      setWarehouses(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWarehouses();
  }, []);

  return {
    warehouses,
    loading,
    reload: loadWarehouses,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
  };
};

export default useWarehouses;