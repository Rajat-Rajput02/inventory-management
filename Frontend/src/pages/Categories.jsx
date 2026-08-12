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

import { Container, Button, Stack } from "@mui/material";
import PageContainer from "../components/layout/PageContainer";

const Categories = () => {
  const {
    categories,

    loadCategories,
  } = useCategories();

  const [open, setOpen] = useState(false);

  const [selected, setSelected] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);

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
    if (selected) {
      await updateCategory(selected._id, form);
    } else {
      await createCategory(form);
    }

    await loadCategories();

    setOpen(false);
  };

  const handleDelete = async () => {
    await deleteCategory(selected._id);

    await loadCategories();

    setDeleteOpen(false);
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
    </PageContainer>
  );
};

export default Categories;
