import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { useState } from "react";

import AddIcon from "@mui/icons-material/Add";

import PageHeader from "../components/layout/PageHeader";
import SupplierTable from "../components/supplier/SupplierTable";
import SupplierForm from "../components/supplier/SupplierForm";
import useSuppliers from "../hooks/useSuppliers";

import EmptyState from "../components/product/EmptyState";
import PageContainer from "../components/layout/PageContainer";
import AppSnackbar from "../components/common/AppSnackbar";

const StatCard = ({ title, value }) => (
  <Paper sx={{ p: 3, borderRadius: 3 }}>
    <Typography color="text.secondary">{title}</Typography>

    <Typography variant="h4" fontWeight={700}>
      {value}
    </Typography>
  </Paper>
);

const Suppliers = () => {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier, reload } =
    useSuppliers();

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showSnackbar = (message, severity = "success") =>
    setSnackbar({ open: true, message, severity });

  const handleAdd = () => {
    setSelected(null);
    setOpen(true);
  };

  const handleEdit = (supplier) => {
    setSelected(supplier);
    setOpen(true);
  };

  const handleDelete = async (supplier) => {
    if (!window.confirm(`Delete ${supplier.name}?`)) return;

    try {
      await deleteSupplier(supplier._id);
      await reload();
      showSnackbar("Supplier deleted successfully");
    } catch (error) {
      showSnackbar(
        error?.response?.data?.message || "Unable to delete supplier",
        "error"
      );
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (selected) {
        await updateSupplier(selected._id, data);
        showSnackbar("Supplier updated successfully");
      } else {
        await addSupplier(data);
        showSnackbar("Supplier added successfully");
      }

      setOpen(false);
      await reload();
    } catch (error) {
      showSnackbar(
        error?.response?.data?.message || "Unable to save supplier",
        "error"
      );
    }
  };

  const active = suppliers.filter((s) => s.status === "Active").length;

  return (
    <PageContainer>
      <PageHeader
        title="Suppliers"
        subtitle="Manage your suppliers and vendors"
      />

      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="Total Suppliers" value={suppliers.length} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="Active" value={active} />
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard title="Inactive" value={suppliers.length - active} />
        </Grid>
      </Grid>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6" fontWeight={700}>
          Supplier List
        </Typography>

        <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
          Add Supplier
        </Button>
      </Box>

      {suppliers.length === 0 ? (
        <EmptyState
          title="No Suppliers"
          subtitle="Start by adding your first supplier."
          buttonText="Add Supplier"
          onClick={handleAdd} // Or your supplier add function
        />
      ) : (
        <SupplierTable
          suppliers={suppliers}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <SupplierForm
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        supplier={selected}
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

export default Suppliers;
