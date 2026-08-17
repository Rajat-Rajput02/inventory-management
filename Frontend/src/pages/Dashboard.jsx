import { useCallback, useEffect, useState } from "react";
import Loader from "../components/common/Loader";
import Grid from "@mui/material/Grid";
import {
  Container,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Card, CardContent, Button, Stack } from "@mui/material";
import { getDashboardStats, getChartData } from "../services/reportService";

import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import StatsCard from "../components/common/StatsCard";
import ErrorFallback from "../components/common/ErrorFallback";

import useProducts from "../hooks/useProducts";
import useDashboard from "../hooks/useDashboard";
import ProductForm from "../components/product/ProductForm";
import useCategories from "../hooks/useCategories";

import { formatCurrency } from "../utils/currency";
import { formatDate } from "../utils/date";
import { ROUTES } from "../constants/routes";

import CategoryPieChart from "../components/charts/CategoryPieChart";
import StockBarChart from "../components/charts/StockBarChart";
import { getCategoryData, getStockData } from "../utils/chartData";
import LowStockWidget from "../components/dashboard/LowStockWidget";
import InventoryStatistics from "../components/dashboard/InventoryStatistics";
import QuickActions from "../components/dashboard/QuickActions";

import ActivityTimeline from "../components/dashboard/ActivityTimeline";

import { getActivities } from "../services/activityService";
// Material UI Icons
import InventoryIcon from "@mui/icons-material/Inventory";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WarningIcon from "@mui/icons-material/Warning";
import TodayIcon from "@mui/icons-material/Today";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import AppSnackbar from "../components/common/AppSnackbar";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { products, error, refreshProducts, addProduct } = useProducts();
  const { openAddDialog } = useDashboard(products);
  // Derived chart data from utility functions
  const categoryChartData = getCategoryData ? getCategoryData(products) : [];
  const stockChartData = getStockData ? getStockData(products) : [];
  // 1. Dialog state
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
 const showSnackbar = useCallback((message, severity = "success") => {
  setSnackbar({
    open: true,
    message,
    severity,
  });
}, []);

  // 2. Fetch categories required by ProductForm
  const { categories } = useCategories();

const loadDashboardData = useCallback(async () => {
  try {
    setLoading(true);

    const [statsRes, chartsRes, activityData] = await Promise.all([
      getDashboardStats(),
      getChartData(),
      getActivities(),
    ]);

    setStats(statsRes?.data || statsRes);
    setChartData(chartsRes?.data || chartsRes);

    setActivities(
      Array.isArray(activityData)
        ? activityData
        : activityData?.data || [],
    );
  } catch (err) {
    showSnackbar(
      err?.response?.data?.message || "Error fetching dashboard data",
      "error",
    );
  } finally {
    setLoading(false);
  }
}, [showSnackbar]);

  const handleCreateProduct = async (formData) => {
    try {
      await addProduct(formData);
      await refreshProducts();
      await loadDashboardData();
    } catch (error) {
      showSnackbar(
        error?.response?.data?.message || "Failed to Create product",
        "error",
      );
    }
  };

  // Greetings
  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? "Good Morning ☀️"
      : hour < 17
        ? "Good Afternoon 🌤️"
        : "Good Evening 🌙";

  // useEffect data loading for All
  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);
  // ==========================
  // LOADING
  // ==========================
  if (loading) {
    return (
      <Container maxWidth={false} sx={{ py: 4 }}>
        <Loader />
      </Container>
    );
  }
  // ==========================
  // ERROR
  // ==========================
  if (error) {
    return <ErrorFallback message={error} onRetry={refreshProducts} />;
  }
  // ==========================
  // UI
  // ==========================
  return (
    <Container
      maxWidth={false}
      sx={{
        width: "100%",
        maxWidth: "1600px",
        mx: "auto",
        px: {
          xs: 2,
          sm: 3,
          md: 4,
        },
        py: 3,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          mb: 4,
          p: 4,
          borderRadius: 3,
          background: "linear-gradient(135deg,#1976d2,#42a5f5)",
          color: "white",
        }}
      >
        <Grid container spacing={2} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Typography variant="h4" fontWeight={700}>
              {greeting}
            </Typography>

            <Typography mt={1}>
              {formatDate(undefined, {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Typography>
            <Typography variant="caption" color="white">
              Last Updated :{new Date().toLocaleTimeString()}
            </Typography>

            <Typography mt={1}>Manage your inventory efficiently.</Typography>
          </Grid>

          <Grid
            size={{ xs: 12, md: 4 }}
            sx={{
              textAlign: {
                xs: "left",
                md: "right",
              },
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              onClick={() =>
                navigate(ROUTES.PRODUCTS, { state: { openAddModal: true } })
              }
            >
              + Add Product
            </Button>
          </Grid>
        </Grid>
      </Box>
      {/* Top Products */}
      <Grid container spacing={3} mt={1} alignItems="stretch">
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6">Top Inventory</Typography>

            <List>
              {Array.from(
                new Map(
                  (stats?.topProducts || []).map((product) => [
                    product._id,
                    product,
                  ]),
                ).values(),
              ).map((product) => (
                <ListItem key={product._id}>
                  <ListItemText
                    primary={product.name}
                    secondary={formatCurrency(
                      Number(product.quantity ?? 0) *
                        Number(product.sellingPrice ?? product.price ?? 0),
                    )}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
      {/* Custom Category & Stock Charts */}
      <Box
        sx={{
          display: "grid",
          gap: 3,
          mt: 3,
          mb: 3,
          gridTemplateColumns: {
            xs: "1fr",
            lg: "repeat(2, minmax(0, 1fr))",
          },
          alignItems: "stretch",
        }}
      >
        <Box sx={{ display: "flex", minWidth: 0 }}>
          <CategoryPieChart data={categoryChartData} />
        </Box>

        <Box sx={{ display: "flex", minWidth: 0 }}>
          <StockBarChart data={stockChartData} />
        </Box>
      </Box>
      {/* Low Stock & Inventory Stats Widgets */}
      <Box
        sx={{
          display: "grid",
          gap: 3,
          mt: 2,
          gridTemplateColumns: {
            xs: "1fr",
            lg: "repeat(2, minmax(0, 1fr))",
          },
          alignItems: "stretch",
        }}
      >
        <Box sx={{ display: "flex", minWidth: 0 }}>
          <LowStockWidget products={products} />
        </Box>

        <Box sx={{ display: "flex", minWidth: 0 }}>
          <InventoryStatistics products={products} />
        </Box>
      </Box>

      <ProductForm
        open={isProductFormOpen}
        onClose={() => setIsProductFormOpen(false)}
        onSubmit={handleCreateProduct}
        categories={categories}
      />

      {/* start of chart stats */}
      {/* Dashboard Overview Stats Grid */}
      <Box sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h4" fontWeight="bold" mb={3}>
          Dashboard Overview
        </Typography>

        {/* ========================================== */}
        {/* 📊 STEP 5: IMPROVED STATS CARDS            */}
        {/* ========================================== */}
        <Grid container spacing={3} mb={5}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title="Total Products"
              value={stats?.totalProducts || 0}
              icon={<InventoryIcon color="primary" />}
              color="#2196f3"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title="Inventory Worth"
              value={formatCurrency(
                stats?.inventoryValue || stats?.inventoryWorth || 0,
              )}
              icon={<AttachMoneyIcon color="success" />}
              color="#4caf50"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title="Expected Revenue"
              value={formatCurrency(stats?.expectedRevenue || 0)}
              icon={<TrendingUpIcon color="info" />}
              color="#00bcd4"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title="Expected Profit"
              value={formatCurrency(stats?.expectedProfit || 0)}
              icon={<TrendingUpIcon color="info" />}
              color="#00bcd4"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title="Stock Value"
              value={formatCurrency(stats?.stockValue || 0)}
              icon={<AccountBalanceWalletIcon color="secondary" />}
              color="#9c27b0"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title="Low Stock"
              value={stats?.lowStock || 0}
              icon={<WarningIcon color="error" />}
              color="#f44336"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title="Today's Transactions"
              value={stats?.todayTransactions || 0}
              icon={<TodayIcon color="warning" />}
              color="#ff9800"
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard
              title="This Month Transactions"
              value={stats?.thisMonthTransactions || 0}
              icon={<CalendarMonthIcon color="action" />}
              color="#607d8b"
            />
          </Grid>
        </Grid>

        {/* ========================================== */}
        {/* 📈 STEP 6: CHARTS DIRECTLY ON UI           */}
        {/* ========================================== */}
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Analytics & Distribution
        </Typography>

        <Grid container spacing={3}>
          {/* 1. Products per Warehouse */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, borderRadius: 3, height: 350 }}>
              <Typography variant="h6" mb={2}>
                Products per Warehouse
              </Typography>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData?.productsPerWarehouse || []}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1976d2" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* 2. Products per Supplier */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, borderRadius: 3, height: 350 }}>
              <Typography variant="h6" mb={2}>
                Products per Supplier
              </Typography>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData?.productsPerSupplier || []}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#388e3c" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* 3. Transactions Per Month */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, borderRadius: 3, height: 350 }}>
              <Typography variant="h6" mb={2}>
                Transactions Per Month
              </Typography>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={chartData?.transactionsPerMonth || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#8884d8"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* 4. Stock In vs Stock Out */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, borderRadius: 3, height: 350 }}>
              <Typography variant="h6" mb={2}>
                Stock In vs Stock Out
              </Typography>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={chartData?.stockInVsStockOut || []}
                    dataKey="quantity"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {(chartData?.stockInVsStockOut || []).map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry._id === "IN" ? "#2e7d32" : "#ed6c02"}
                        />
                      ),
                    )}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* 5. Low Stock Distribution */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper sx={{ p: 3, borderRadius: 3, height: 350 }}>
              <Typography variant="h6" mb={2}>
                Low Stock Distribution
              </Typography>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={chartData?.lowStockDistribution || []}
                    dataKey="count"
                    nameKey="_id"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    label
                  >
                    {(chartData?.lowStockDistribution || []).map(
                      (entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            entry._id === "Low Stock" ? "#d32f2f" : "#0288d1"
                          }
                        />
                      ),
                    )}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      {/* end of chart stats */}

      {/* Timeline and Quick Actions */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ActivityTimeline
            activities={Array.from(
              new Map(activities.map((item) => [item._id, item])).values(),
            )}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <QuickActions onAdd={openAddDialog} products={products} />
        </Grid>
      </Grid>
      {/* Navigation Shortcuts */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Stack direction="row" spacing={2}>
            <Button
              component={RouterLink}
              to={ROUTES.PRODUCTS}
              variant="contained"
            >
              Manage Products
            </Button>

            <Button
              component={RouterLink}
              to={ROUTES.CATEGORIES}
              variant="outlined"
            >
              Categories
            </Button>

            <Button
              component={RouterLink}
              to={ROUTES.REPORTS}
              variant="outlined"
            >
              Reports
            </Button>
          </Stack>
        </CardContent>
      </Card>
      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </Container>
  );
};

export default Dashboard;
