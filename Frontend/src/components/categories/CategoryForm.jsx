import { useEffect, useState } from "react";

import {
  DialogContent,
  Button,
  TextField,
  Stack,
} from "@mui/material";

import AppDialog from "../common/AppDialog";
import AppSnackbar from "../common/AppSnackbar";

const initialState = {
  name: "",
  description: "",
};

const CategoryForm = ({
  open,
  onClose,
  selectedCategory,
  onSubmit,
}) => {
  const [formData, setFormData] = useState(initialState);
  const [saving, setSaving] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const isEdit = Boolean(selectedCategory);

  useEffect(() => {
    if (selectedCategory) {
      setFormData({
        name: selectedCategory.name || "",
        description: selectedCategory.description || "",
      });
    } else {
      setFormData(initialState);
    }
  }, [selectedCategory]);

  const handleSubmit = async () => {
    try {
      setSaving(true);

      await onSubmit(formData);

      showSnackbar(
        `Category ${isEdit ? "updated" : "added"} successfully!`,
        "success",
      );

      setFormData(initialState);
      onClose();
    } catch (error) {
      showSnackbar(
        error?.response?.data?.message || "Failed to save Category",
        "error",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <AppDialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={saving ? undefined : onClose}
        title={isEdit ? "Edit Category" : "Add Category"}
        actions={
          <>
            <Button onClick={onClose} disabled={saving}>
              Cancel
            </Button>

            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : isEdit
                  ? "Update Category"
                  : "Add Category"}
            </Button>
          </>
        }
      >
        <DialogContent>
          <Stack spacing={2} mt={2}>
            <TextField
              label="Category Name"
              autoFocus
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
            />

            <TextField
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
            />
          </Stack>
        </DialogContent>
      </AppDialog>
      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() =>
          setSnackbar((prev) => ({
            ...prev,
            open: false,
          }))
        }
      />
    </>
  );
};

export default CategoryForm;