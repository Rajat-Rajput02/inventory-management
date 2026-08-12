import { DataGrid } from "@mui/x-data-grid";
import { Button, Grid } from "@mui/material";
import PageHeader from "../components/layout/PageHeader";
import useTransactions from "../hooks/useTransaction";
import { formatNumber } from "../utils/number";
import EmptyState from "../components/product/EmptyState";
import PageContainer from "../components/layout/PageContainer";

const Transactions = () => {
  const { transactions, loading } = useTransactions();

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
      <DataGrid
      rows={Array.isArray(transactions) ? transactions : transactions?.data || []}
        columns={columns}
        loading={loading}
        getRowId={(row) => row._id || row.id}
      />
      <Grid container spacing={2} mt={2}>
        <Grid size="auto">
          <Button variant="contained" color="primary">
            + Add Transaction
          </Button>
        </Grid>
      </Grid>
    </PageContainer>
  );
};

export default Transactions;
