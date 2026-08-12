import { useEffect, useState } from "react";

import { getCategories } from "../services/categoryService";

const useCategories = () => {
  const [categories, setCategories] = useState([]);

  const loadCategories = async () => {
    const data = await getCategories();
    setCategories(data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return {
    categories,
    loadCategories,
  };
};

export default useCategories;
