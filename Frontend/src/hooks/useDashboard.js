import { useMemo, useState } from "react";

const useDashboard = (products = []) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [openForm, setOpenForm] = useState(false);
const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const categories = useMemo(() => {
    if (!Array.isArray(products)) return [];

    const unique = [];
    const seen = new Set();

    products.forEach((product) => {
      if (!product.category) return;

      if (
        typeof product.category === "object" &&
        product.category.name
      ) {
        const key = product.category._id || product.category.name;

        if (!seen.has(key)) {
          seen.add(key);
          unique.push(product.category);
        }
      } else if (typeof product.category === "string") {
        if (!seen.has(product.category)) {
          seen.add(product.category);

          unique.push({
            _id: product.category,
            name: product.category,
          });
        }
      }
    });

    return unique;
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];

    const search = searchTerm.toLowerCase().trim();

    return products.filter((product) => {
      const matchesSearch =
        !search ||
        product.name?.toLowerCase().includes(search) ||
        product.sku?.toLowerCase().includes(search);

      const categoryId =
        typeof product.category === "object"
          ? product.category?._id
          : product.category;

      const matchesCategory =
        !selectedCategory ||
        categoryId === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const openAddDialog = () => {
    setSelectedProduct(null);
    setOpenForm(true);
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (product) => {
    setSelectedProduct(product);
    setOpenForm(true);
  };

  const closeForm = () => {
    setOpenForm(false);
    setSelectedProduct(null);
  };

  const openDeleteDialog = (product) => {
    setDeleteProduct(product);
    setDeleteDialog(true);
  };
  const closeAddDialog = () => setIsAddDialogOpen(false);

  const closeDeleteDialog = () => {
    setDeleteDialog(false);
    setDeleteProduct(null);
  };

  const showSnackbar = (
    message,
    severity = "success"
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  return {
    searchTerm,
    setSearchTerm,

    selectedCategory,
    setSelectedCategory,

    selectedProduct,
    setSelectedProduct,

    openForm,
    setOpenForm,

    deleteDialog,
    setDeleteDialog,

    deleteProduct,
    setDeleteProduct,

    snackbar,
    setSnackbar,

    categories,
    filteredProducts,

    isAddDialogOpen,
    openAddDialog,
    closeAddDialog,
    openEditDialog,
    openDeleteDialog,

    closeForm,
    closeDeleteDialog,

    showSnackbar,
    closeSnackbar,
  };
};

export default useDashboard;