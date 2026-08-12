import { Box, Button, Grid, Paper, Typography } from "@mui/material";
import { useState } from "react";

import AddIcon from "@mui/icons-material/Add";

import PageHeader from "../components/layout/PageHeader";
import SupplierTable from "../components/supplier/SupplierTable";
import SupplierForm from "../components/supplier/SupplierForm";
import useSuppliers from "../hooks/useSuppliers";

import EmptyState from "../components/product/EmptyState";
import PageContainer from "../components/layout/PageContainer";

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

  const handleAdd = () => {
    setSelected(null);
    setOpen(true);
  };

  const handleEdit = (supplier) => {
    setSelected(supplier);
    setOpen(true);
  };

  const handleDelete = async (supplier) => {
    if (window.confirm(`Delete ${supplier.name}?`)) {
      await deleteSupplier(supplier._id);
      reload();
    }
  };

  const handleSubmit = async (data) => {
    if (selected) {
      await updateSupplier(selected._id, data);
    } else {
      await addSupplier(data);
    }

    setOpen(false);
    reload();
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
    </PageContainer>
  );
};

export default Suppliers;
