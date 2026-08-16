import { useState } from "react";

import PageHeader from "../components/layout/PageHeader";

import CategoryTable from "../components/categories/CategoryTable";

import CategoryForm from "../components/categories/CategoryForm";

import ConfirmDialog from "../components/common/ConfirmDialogue";

import useCategories from "../hooks/useCategories";

import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";

import { Button, Stack } from "@mui/material";
import AppSnackbar from "../components/common/AppSnackbar";
import PageContainer from "../components/layout/PageContainer";

const Categories = () => {
  const {
    categories,

    loadCategories,
  } = useCategories();

  const [open, setOpen] = useState(false);

  const [selected, setSelected] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") =>
    setSnackbar({ open: true, message, severity });

  const openAdd = () => {
    setSelected(null);

    setOpen(true);
  };

  const openEdit = (category) => {
    setSelected(category);

    setOpen(true);
  };

  const openDelete = (category) => {
    setSelected(category);

    setDeleteOpen(true);
  };

  const handleSave = async (form) => {
    try {
      if (selected) {
        await updateCategory(selected._id, form);
        showSnackbar("Category updated successfully");
      } else {
        await createCategory(form);
        showSnackbar("Category added successfully");
      }

      await loadCategories();
      setOpen(false);
    } catch (error) {
      showSnackbar(
        error?.response?.data?.message || "Unable to save category",
        "error"
      );
      throw error;
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCategory(selected._id);
      await loadCategories();
      setDeleteOpen(false);
      showSnackbar("Category deleted successfully");
    } catch (error) {
      showSnackbar(
        error?.response?.data?.message || "Unable to delete category",
        "error"
      );
    }
  };

  return (
    <PageContainer maxWidth={false}>
      <PageHeader title="Categories" subtitle="Manage product categories" />

      <Stack direction="row" justifyContent="flex-end" mb={2}>
        <Button variant="contained" onClick={openAdd}>
          Add Category
        </Button>
      </Stack>

      <CategoryTable
        categories={categories}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      <CategoryForm
        open={open}
        onClose={() => setOpen(false)}
        selectedCategory={selected}
        onSubmit={handleSave}
      />

      <ConfirmDialog
        open={deleteOpen}
        title="Delete Category"
        message="Delete this category?"
        onConfirm={handleDelete}
        onClose={() => setDeleteOpen(false)}
      />

      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </PageContainer>
  );
};

export default Categories;
