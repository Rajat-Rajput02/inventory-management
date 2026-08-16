import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Grid } from "@mui/material";
import PageHeader from "../components/layout/PageHeader";
import useTransactions from "../hooks/useTransaction";
import { formatNumber } from "../utils/number";
import EmptyState from "../components/product/EmptyState";
import PageContainer from "../components/layout/PageContainer";
import TransactionForm from "../components/transaction/TransactionForm"; 

const Transactions = () => {
  const { transactions, loading } = useTransactions();
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const columns = [
    {
      field: "product",
      headerName: "Product",
      width: 200,
      valueGetter: (value, row) => row.product?.name || "",
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 150,
      valueGetter: (value, row) => formatNumber(row.quantity),
    },
    { field: "type", headerName: "Type", width: 150 },
    {
      field: "date",
      headerName: "Date",
      width: 200,
      valueGetter: (value, row) =>
        row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "",
    },
    { field: "reason", headerName: "Reason", width: 300 },
    { field: "notes", headerName: "Notes", width: 300 },
  ];
const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleFormSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (createTransaction) {
        await createTransaction(formData);
      }
      setModalOpen(false);
    } catch (error) {
      console.error("Error adding transaction:", error);
    } finally {
      setSubmitting(false);
    }
  };

  {
    if (!loading && Array.isArray(transactions) && transactions.length === 0) {
      return (
        <EmptyState
          title="No Transaction"
          subtitle="Start by adding your first Transaction."
          onAdd={handleOpenModal}

        />
      );
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="Transactions"
        subtitle="Manage your inventory transactions"
      />
      <DataGrid
      rows={Array.isArray(transactions) ? transactions : transactions?.data || []}
        columns={columns}
        loading={loading}
        getRowId={(row) => row._id || row.id}
      />
      <Grid container spacing={2} mt={2}>
        <Grid size="auto">
          <Button variant="contained" color="primary" onClick={handleOpenModal}>
            + Add Transaction
          </Button>
        </Grid>
      </Grid>
      <TransactionForm
        open={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleFormSubmit}
        loading={submitting}
      />
    </PageContainer>
  );
};

export default Transactions;
