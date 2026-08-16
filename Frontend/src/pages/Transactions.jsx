import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import { Button, Grid } from "@mui/material";
import PageHeader from "../components/layout/PageHeader";
import useTransactions from "../hooks/useTransaction";
import { formatNumber } from "../utils/number";
import EmptyState from "../components/product/EmptyState";
import PageContainer from "../components/layout/PageContainer";
import TransactionForm from "../components/transaction/TransactionForm";
import useProducts from "../hooks/useProducts";

const Transactions = () => {
  const {
    transactions,
    loading,
    createTransaction,
    reload: reloadTransactions,
  } = useTransactions();
   const {
    products,
    refreshProducts,
  } = useProducts();

  const [transactionOpen, setTransactionOpen] = useState(false);
  const [transactionLoading, setTransactionLoading] = useState(false);
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
  const closeSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };
  const rows = Array.isArray(transactions)
    ? transactions
    : transactions?.data || [];
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

// ==========================================
// CREATE TRANSACTION
// ==========================================

  const handleTransactionSubmit = async (data) => {
    try {
      setTransactionLoading(true);

      const payload = {
        product: data.product,
        productId: data.product,
        type: data.type,
        quantity: Number(data.quantity),
        reason: data.reason,
        notes: data.notes || "",
      };

      await createTransaction(payload);

      // Refresh transaction list
      await reloadTransactions();

      // Refresh products so quantity/status are immediately updated
      await refreshProducts();

      setTransactionOpen(false);

      showSnackbar(
        `Stock ${
          data.type === "IN" ? "Added" : "Removed"
        } Successfully`,
        "success",
      );
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        "Transaction failed";

      showSnackbar(message, "error");
    } finally {
      setTransactionLoading(false);
    }
  };

  {
    if (transactions.length === 0) {
      return (
        <EmptyState
          title="No Transaction"
          subtitle="Start by adding your first Transaction."
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
     
      {/* ADD TRANSACTION BUTTON */}
      <Grid container spacing={2} mt={2} mb={2}>
        <Grid size="auto">
          <Button
            variant="contained"
            color="primary"
            onClick={() => setTransactionOpen(true)}
            disabled={products.length === 0}
          >
            + Add Transaction
          </Button>
        </Grid>
      </Grid>

      {/* TRANSACTION TABLE / EMPTY STATE */}

      {rows.length === 0 && !loading ? (
        <EmptyState
          title="No Transactions"
          subtitle={
            products.length === 0
              ? "Add a product before creating a transaction."
              : "Start by adding your first transaction."
          }
          buttonText={
            products.length === 0
              ? undefined
              : "Add Transaction"
          }
          onClick={
            products.length === 0
              ? undefined
              : () => setTransactionOpen(true)
          }
        />
      ) : (
        <DataGrid
          rows={rows}
          columns={columns}
          loading={loading}
          getRowId={(row) => row._id || row.id}
          autoHeight
          pageSizeOptions={[10, 25, 50, 100]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
                page: 0,
              },
            },
          }}
        />
      )}

      {/* TRANSACTION FORM */}

      <TransactionForm
        open={transactionOpen}
        onClose={() => setTransactionOpen(false)}
        products={products}
        type="IN"
        allowTypeChange={true}
        onSubmit={handleTransactionSubmit}
        loading={transactionLoading}
      />

      {/* SNACKBAR */}

      <AppSnackbar
        open={snackbar.open}
        severity={snackbar.severity}
        message={snackbar.message}
        onClose={closeSnackbar}
      />
    </PageContainer>
  );
};

export default Transactions;
