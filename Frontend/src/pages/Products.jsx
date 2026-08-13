import { useState, useEffect } from "react";
import { Container } from "@mui/material"
import { useNavigate, useLocation } from "react-router-dom";
import PageHeader from "../components/layout/PageHeader";

import Loader from "../components/common/Loader";
import Alert from "@mui/material/Alert";

import ProductDetailsDialog from "../components/product/ProductDetailsDialog";
import ProductToolbar from "../components/product/ProductToolbar";
import ProductTable from "../components/product/ProductTable";
import ProductForm from "../components/product/ProductForm";
import TransactionForm from "../components/transaction/TransactionForm";
import DeleteDialog from "../components/product/DeleteDialog";
import EmptyState from "../components/product/EmptyState";


import useProducts from "../hooks/useProducts";
import useDashboard from "../hooks/useDashboard";
import useTransactions from "../hooks/useTransaction";
import useCategories from "../hooks/useCategories";
import { createTransaction as createTransactionApi } from "../services/transactionService"; // Adjust path to transactionService
import AppSnackbar from "../components/common/AppSnackbar";
import ProductDetailsDrawer from "../components/product/ProductDetailsDrawer";
import PageContainer from "../components/layout/PageContainer";

const Products = () => {
  const {
    products,
    loading,
    error,
    addProduct,
    editProduct,
    removeProduct,
    refreshProducts,
  } = useProducts();
  const location = useLocation();
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { createTransaction, reload: reloadTransactions } = useTransactions();
  const { categories } = useCategories();
  const [openDetails, setOpenDetails] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);

  // const [selectedProduct, setSelectedProduct] = useState(null);

  const [transactionType, setTransactionType] = useState("IN");

  const [transactionOpen, setTransactionOpen] = useState(false);
const [drawerOpen, setDrawerOpen] = useState(false);

  const {
    searchTerm,
    setSearchTerm,

    selectedCategory,
    setSelectedCategory,

    selectedProduct,

    openForm,

    deleteDialog,

    deleteProduct,

    snackbar,

    filteredProducts,

    openAddDialog,

    closeForm,

    closeDeleteDialog,

    showSnackbar,

    closeSnackbar,

    setSelectedProduct,

    setDeleteProduct,

    setOpenForm,

    setDeleteDialog,
  } = useDashboard(products);

  // ProductForm and DeleteDialog are controlled components, so we need to manage their open/close state and the selected product for editing or deleting. The following functions handle these actions:
  // ==========================
  // SAVE PRODUCT
  // ==========================
  useEffect(() => {
    if (location.state?.openAddModal) {
      setIsFormOpen(true);
      openAddDialog();
      // Clear location state so refreshing doesn't reopen it
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate, openAddDialog]);

  const handleSave = async (formData) => {
    try {
      if (selectedProduct?._id || selectedProduct?.id) {
const id = selectedProduct._id || selectedProduct.id;
        await editProduct(id, formData);
        showSnackbar("Product Updated Successfully");
      } else {
        await addProduct(formData);

        showSnackbar("Product Added Successfully");
      }
await refreshProducts(); // Refresh DataGrid list
      closeForm();
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      showSnackbar(serverMessage, "error");
    }
  };

  // ==========================
  // DELETE PRODUCT
  // ==========================
const handleDelete = async () => {
    try {
      await removeProduct(deleteProduct._id || deleteProduct.id);
      showSnackbar("Product Deleted Successfully");
      await refreshProducts();
      closeDeleteDialog();
    } catch (err) {
      showSnackbar("Unable to Delete Product", "error");
    }
  };
  // ProductForm handle close function
  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedProduct(null);
  };
  // ==========================
  // TABLE EVENTS
  // ==========================
  const handleViewProduct = (product) => {
    setViewProduct(product);
    setOpenDetails(true);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setOpenForm(true);
  };

  const handleDeleteClick = (product) => {
    setDeleteProduct(product);
    setDeleteDialog(true);
  };
// ==========================
  // TRANSACTION IN / OUT FIX
  // ==========================
  const handleStockIn = (product) => {
    setSelectedProduct(product);
    setTransactionType("IN");
    setTransactionOpen(true);
  };

  const handleStockOut = (product) => {
    setSelectedProduct(product);
    setTransactionType("OUT");
    setTransactionOpen(true);
  };

  const handleTransactionSubmit = async (data) => {
    try {
      // Attach target productId explicitly
const payload = {
  product: selectedProduct?._id || selectedProduct?.id,   // standard Mongoose ref name
  productId: selectedProduct?._id || selectedProduct?.id, // fallback field
  type: transactionType,                                 // "IN" or "OUT"
  quantity: Number(data.quantity || 1),
  unitPrice: Number(data.unitPrice || data.price || selectedProduct?.costPrice || 0),
  notes: data.notes || "",
};

      await createTransaction(payload);
      showSnackbar(`Stock ${transactionType === "IN" ? "Added" : "Removed"} Successfully`);
      
      setTransactionOpen(false);
      setSelectedProduct(null);

      // Force UI updates
      if (refreshProducts) await refreshProducts();
      if (reloadTransactions) await reloadTransactions();
    } catch (err) {
      const msg = err?.response?.data?.message || "Transaction failed";
      showSnackbar(msg, "error");
    }
  };
  // ==========================
  // LOADING
  // ==========================
  if (loading) {
    return (
      <Container maxWidth={false} sx={{ py: 4 }}>
        <Loader />
      </Container>
    );
  }
  // ==========================
  // ERROR
  // ==========================

  if (error) {
    return (
      <Container sx={{ mt: 5 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <PageContainer maxWidth={false}>
      <PageHeader title="Products" subtitle="Manage your inventory products" />
      {/* Toolbar */}
      <ProductToolbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
onAddProduct={openAddDialog}      />
      {/* Table / Empty State */}
      {filteredProducts.length === 0 ? (
        <EmptyState 
        title="No Products"
    subtitle="Start by adding your first product."
    buttonText="Add Product"
    onClick={openAddDialog}
  /> 
      ) : (
        <ProductTable
          products={filteredProducts}
          onView={handleViewProduct}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onStockIn={handleStockIn}
          onStockOut={handleStockOut}
        />
      )}
      {/* Product Details Dialog */}
      <ProductDetailsDialog
        open={openDetails}
        onClose={() => setOpenDetails(false)}
        product={viewProduct}
      />
      {/* Form */}
      <ProductForm
        open={openForm}
        onClose={handleCloseForm}
        // open={isFormOpen}
        // onSubmit={addProduct}
        // onClose={() => setIsFormOpen(false)}
        selectedProduct={selectedProduct}
        categories={categories}
        onSubmit={handleSave}
      />
      {/* Delete */}
      <DeleteDialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        product={deleteProduct}
        onDelete={handleDelete}
      />
      {/* Snackbar */}
      <AppSnackbar
        open={snackbar.open}
        severity={snackbar.severity}
        message={snackbar.message}
        onClose={closeSnackbar}
      />
      {/* <TransactionForm /> */}
      <TransactionForm
        open={transactionOpen}
onClose={() => {
          setTransactionOpen(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        type={transactionType}
        onSubmit={handleTransactionSubmit}
      />
      {/* Product Details Drawer */}
      <ProductDetailsDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        product={viewProduct}
      />
    </PageContainer>
  );
};

export default Products;
