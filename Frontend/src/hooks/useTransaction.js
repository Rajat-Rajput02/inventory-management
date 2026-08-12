import { useEffect, useState } from "react";

import {
  getTransactions,
  createTransaction,
} from "../services/transactionService";

const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTransactions = async () => {
    try {
      const data = await getTransactions();
      setTransactions(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  return {
    transactions,
    loading,
    reload: loadTransactions,
    createTransaction,
  };
};

export default useTransactions;