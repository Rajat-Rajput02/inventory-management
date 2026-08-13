import { useCallback, useMemo, useState } from "react";

import {
  Box,
  Button,
  Container,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  Category as CategoryIcon,
  CurrencyRupee as CurrencyRupeeIcon,
  Download as DownloadIcon,
  Inventory2 as Inventory2Icon,
  WarningAmber as WarningAmberIcon,
} from "@mui/icons-material";

import PageHeader from "../components/layout/PageHeader";
import StatsCard from "../components/common/StatsCard";
import ProductTable from "../components/product/ProductTable";
import AppSnackbar from "../components/common/AppSnackbar";
import Loader from "../components/common/Loader";
import CategoryPieChart from "../components/charts/CategoryPieChart";
import StockBarChart from "../components/charts/StockBarChart";
import ErrorFallback from "../components/common/ErrorFallback";

import useProducts from "../hooks/useProducts";
import useCategories from "../hooks/useCategories";
import useWarehouses from "../hooks/useWarehouses";
import useSuppliers from "../hooks/useSuppliers";

import exportExcel from "../utils/export/exportExcel";
import exportPDF from "../utils/export/exportPDF";
import { formatCurrency } from "../utils/currency";
import { getCategoryData, getStockData } from "../utils/chartData";
import { formatDate } from "../utils/date";
import PageContainer from "../components/layout/PageContainer";

const noop = () => {};

const toDateValue = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
};

const getCategoryId = (product) =>
  product?.category?._id ??
  (typeof product?.category === "string" ? product.category : "");

const getWarehouseId = (product) =>
  product?.warehouse?._id ??
  (typeof product?.warehouse === "string" ? product.warehouse : "");

const getSupplierId = (product) =>
  product?.supplier?._id ??
  (typeof product?.supplier === "string" ? product.supplier : "");

const Reports = () => {
  const { products, loading, error, refreshProducts } = useProducts();
  const { categories } = useCategories();
  const { warehouses } = useWarehouses();
  const { suppliers = [] } = useSuppliers();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedWarehouse, setSelectedWarehouse] = useState("all");
  const [selectedSupplier, setSelectedSupplier] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const categoryOptions = useMemo(() => categories || [], [categories]);
  const warehouseOptions = useMemo(() => warehouses || [], [warehouses]);
  const supplierOptions = useMemo(() => suppliers || [], [suppliers]);

  const categoryNameById = useMemo(() => {
    const map = new Map();
    categoryOptions.forEach((category) => {
      if (category?._id)
        map.set(category._id, category.name || "Uncategorized");
    });
    return map;
  }, [categoryOptions]);

  const resolveCategoryName = useCallback(
    (product) => {
      if (product?.category && typeof product.category === "object")
        return product.category.name || "Uncategorized";
      if (typeof product?.category === "string")
        return (
          categoryNameById.get(product.category) ||
          product.category ||
          "Uncategorized"
        );
      return "Uncategorized";
    },
    [categoryNameById],
  );

  const filteredProducts = useMemo(() => {
    return (products || []).filter((product) => {
      const prodDate = toDateValue(product?.createdAt);
      const matchesStartDate = !startDate || prodDate >= startDate;
      const matchesEndDate = !endDate || prodDate <= endDate;
      const matchesCategory =
        selectedCategory === "all" ||
        getCategoryId(product) === selectedCategory;
      const matchesWarehouse =
        selectedWarehouse === "all" ||
        getWarehouseId(product) === selectedWarehouse;
      const matchesSupplier =
        selectedSupplier === "all" ||
        getSupplierId(product) === selectedSupplier;

      const qty = Number(product.quantity ?? 0);
      const minStock = Number(product.minStock ?? 0);
      let status = product.status;
      if (!status) {
        if (qty === 0) status = "Out of Stock";
        else if (qty <= minStock) status = "Low Stock";
        else status = "In Stock";
      }

      const matchesStatus =
        selectedStatus === "all" ||
        status.toLowerCase() === selectedStatus.toLowerCase();

      return (
        matchesStartDate &&
        matchesEndDate &&
        matchesCategory &&
        matchesWarehouse &&
        matchesSupplier &&
        matchesStatus
      );
    });
  }, [
    products,
    startDate,
    endDate,
    selectedCategory,
    selectedWarehouse,
    selectedSupplier,
    selectedStatus,
  ]);

  const summary = useMemo(() => {
    const lowStock = filteredProducts.filter(
      (product) =>
        Number(product.quantity ?? 0) <= Number(product.minStock ?? 0),
    ).length;

    const categoriesCount = new Set(
      filteredProducts.map((p) => resolveCategoryName(p)),
    ).size;

    const inventoryValue = filteredProducts.reduce(
      (total, product) =>
        total +
        Number(product.sellingPrice ?? product.price ?? 0) *
          Number(product.quantity ?? 0),
      0,
    );

    return {
      visibleProducts: filteredProducts.length,
      lowStock,
      categoriesCount,
      inventoryValue,
    };
  }, [filteredProducts, resolveCategoryName]);

  const categoryChartData = useMemo(
    () => getCategoryData(filteredProducts),
    [filteredProducts],
  );
  const stockChartData = useMemo(
    () => getStockData(filteredProducts),
    [filteredProducts],
  );

  const summaryCards = useMemo(
    () => [
      {
        title: "Visible Products",
        value: summary.visibleProducts,
        icon: <Inventory2Icon color="primary" />,
      },
      {
        title: "Low Stock",
        value: summary.lowStock,
        icon: <WarningAmberIcon color="warning" />,
      },
      {
        title: "Categories",
        value: summary.categoriesCount,
        icon: <CategoryIcon color="success" />,
      },
      {
        title: "Inventory Value",
        value: formatCurrency(summary.inventoryValue),
        icon: <CurrencyRupeeIcon color="primary" />,
      },
    ],
    [summary],
  );

  const showSnackbar = (message, severity = "success") =>
    setSnackbar({ open: true, message, severity });
  const closeSnackbar = (_, reason) => {
    if (reason !== "clickaway")
      setSnackbar((curr) => ({ ...curr, open: false }));
  };

  const handleExcelExport = () => {
    exportExcel(filteredProducts, summary);
    showSnackbar("Multi-sheet Excel generated successfully!");
  };

  const handlePdfExport = () => {
    exportPDF(filteredProducts, summary);
    showSnackbar("PDF Report exported successfully!");
  };

  if (loading)
    return (
      <Container maxWidth={false} sx={{ py: 4 }}>
        <Loader />
      </Container>
    );
  if (error) {
    return <ErrorFallback message={error} onRetry={refreshProducts} />;
  }
  return (
    <PageContainer
      maxWidth={false}
      disableGutters
      sx={{ width: "100%", px: { xs: 2, sm: 3, md: 4 }, py: 3 }}
    >
      <PageHeader
        title="Reports"
        subtitle="View filtered inventory summaries and exports"
      />

      <Stack spacing={2.25}>
        {/* STEP 7 Toolbar Filters */}
        <Paper sx={{ p: 2.5, borderRadius: 3 }} elevation={2}>
          <Typography variant="subtitle2" fontWeight={700} mb={2}>
            Report Filters
          </Typography>
          <Grid container spacing={2}>
            {/* Category */}
            <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {categoryOptions.map((c) => (
                  <MenuItem key={c._id} value={c._id}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Supplier */}
            <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Supplier"
                value={selectedSupplier}
                onChange={(e) => setSelectedSupplier(e.target.value)}
              >
                <MenuItem value="all">All Suppliers</MenuItem>
                {supplierOptions.map((s) => (
                  <MenuItem key={s._id} value={s._id}>
                    {s.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Warehouse */}
            <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Warehouse"
                value={selectedWarehouse}
                onChange={(e) => setSelectedWarehouse(e.target.value)}
              >
                <MenuItem value="all">All Warehouses</MenuItem>
                {warehouseOptions.map((w) => (
                  <MenuItem key={w._id} value={w._id}>
                    {w.name || w.code}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Status */}
            <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
              <TextField
                select
                fullWidth
                size="small"
                label="Status"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <MenuItem value="all">All Statuses</MenuItem>
                <MenuItem value="In Stock">In Stock</MenuItem>
                <MenuItem value="Low Stock">Low Stock</MenuItem>
                <MenuItem value="Out of Stock">Out of Stock</MenuItem>
              </TextField>
            </Grid>

            {/* Date Range: Start Date & End Date */}
            <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
              <Stack direction="row" spacing={1}>
                <TextField
                  type="date"
                  size="small"
                  label="Start Date"
                  InputLabelProps={{ shrink: true }}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  fullWidth
                />
                <TextField
                  type="date"
                  size="small"
                  label="End Date"
                  InputLabelProps={{ shrink: true }}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  fullWidth
                />
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={2.5}>
          {summaryCards.map((card) => (
            <Grid key={card.title} size={{ xs: 12, sm: 6, lg: 3 }}>
              <StatsCard {...card} />
            </Grid>
          ))}
        </Grid>

        {/* Dynamic Filtered Charts */}
        <Box
          sx={{
            display: "grid",
            gap: 2.5,
            gridTemplateColumns: { xs: "1fr", lg: "repeat(2, minmax(0, 1fr))" },
          }}
        >
          <Box sx={{ display: "flex", minWidth: 0 }}>
            <CategoryPieChart data={categoryChartData} />
          </Box>
          <Box sx={{ display: "flex", minWidth: 0 }}>
            <StockBarChart data={stockChartData} />
          </Box>
        </Box>

        {/* Filtered Data Table */}
        <ProductTable
          products={filteredProducts}
          onView={noop}
          onEdit={noop}
          onDelete={noop}
          onStockIn={noop}
          onStockOut={noop}
        />

        {/* Export Buttons */}
        <Paper sx={{ p: 2.5, borderRadius: 3 }} elevation={2}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            justifyContent="flex-end"
          >
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExcelExport}
              disabled={filteredProducts.length === 0}
            >
              Export Multi-Sheet Excel
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<DownloadIcon />}
              onClick={handlePdfExport}
              disabled={filteredProducts.length === 0}
            >
              Export Formatted PDF
            </Button>
          </Stack>
        </Paper>
      </Stack>

      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={closeSnackbar}
      />
  </PageContainer>
  );
};

export default Reports;
