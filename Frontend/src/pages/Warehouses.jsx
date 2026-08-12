import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

import Loader from "../components/common/Loader";
import AppSnackbar from "../components/common/AppSnackBar";
import StatsCard from "../components/common/StatsCard";
import PageHeader from "../components/layout/PageHeader";
import WarehouseTable from "../components/warehouse/warehouseTable";
import WarehouseForm from "../components/warehouse/warehouseForm";
import EmptyState from "../components/product/EmptyState";
import PageContainer from "../components/layout/PageContainer";

import useWarehouses from "../hooks/useWarehouses";

const Warehouses = () => {
  const {
    warehouses,
    loading,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
    reload,
  } = useWarehouses();

  const [openForm, setOpenForm] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const summaryCards = useMemo(() => {
    const total = warehouses.length;
    const active = warehouses.filter((w) => w.status === "Active").length;
    const inactive = total - active;

    return [
      {
        title: "Total Warehouses",
        value: total,
        icon: <WarehouseIcon color="primary" />,
      },
      {
        title: "Active Warehouses",
        value: active,
        icon: <CheckCircleIcon color="success" />,
      },
      {
        title: "Inactive Warehouses",
        value: inactive,
        icon: <CancelIcon color="error" />,
      },
    ];
  }, [warehouses]);

  const handleOpenAdd = () => {
    setSelectedWarehouse(null);
    setOpenForm(true);
  };

  const handleEdit = (warehouse) => {
    setSelectedWarehouse(warehouse);
    setOpenForm(true);
  };

  const handleDeleteClick = (warehouse) => {
    setDeleteTarget(warehouse);
    setDeleteDialog(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedWarehouse(null);
  };

  const handleSave = async (formData) => {
    try {
      if (selectedWarehouse?._id) {
        await updateWarehouse(selectedWarehouse._id, formData);
        showSnackbar("Warehouse Updated");
      } else {
        await createWarehouse(formData);
        showSnackbar("Warehouse Added");
      }

      await reload();
      handleCloseForm();
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      showSnackbar(serverMessage, "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget?._id) return;

    try {
      await deleteWarehouse(deleteTarget._id);
      showSnackbar("Warehouse Deleted");
      setDeleteDialog(false);
      setDeleteTarget(null);
      await reload();
    } catch (error) {
      const serverMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to Delete Warehouse";
      showSnackbar(serverMessage, "error");
    }
  };

  if (loading) {
    return (
      <Container maxWidth={false} sx={{ py: 4 }}>
        <Loader />
      </Container>
    );
  }

  return (
    <PageContainer maxWidth={false}>
      <PageHeader title="Warehouses" subtitle="Manage warehouses" />

      <Grid container spacing={3} sx={{ mb: 3 }}>
        {summaryCards.map((card) => (
          <Grid key={card.title} size={{ xs: 12, sm: 6, md: 4 }}>
            <StatsCard {...card} />
          </Grid>
        ))}
      </Grid>

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          mb: 2,
        }}
      >
        <Button variant="contained" onClick={handleOpenAdd}>
          + Add Warehouse
        </Button>
      </Box>

      {warehouses.length === 0 ? (
        <EmptyState
    title="No Warehouses"
    subtitle="Start by adding your first warehouse."
    buttonText="Add Warehouse"
    onClick={handleOpenAdd} 
  />
      ) : (
        <WarehouseTable
          warehouses={warehouses}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      )}

      <WarehouseForm
        open={openForm}
        onClose={handleCloseForm}
        selectedWarehouse={selectedWarehouse}
        onSubmit={handleSave}
      />

      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <WarningAmberIcon color="warning" />
          Delete Warehouse
        </DialogTitle>

        <DialogContent>
          <Typography>
            You are about to permanently delete
            <strong> {deleteTarget?.name}</strong>. This action cannot be
            undone.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            autoFocus
            onClick={() => {
              setDeleteDialog(false);
              setDeleteTarget(null);
            }}
          >
            Cancel
          </Button>

          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete Warehouse
          </Button>
        </DialogActions>
      </Dialog>

      <AppSnackbar
        open={snackbar.open}
        severity={snackbar.severity}
        message={snackbar.message}
        onClose={closeSnackbar}
      />
    </PageContainer>
  );
};

export default Warehouses;
