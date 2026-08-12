const express = require("express");
const router = express.Router();

// 1. Import Auth Middleware
// Verify this path matches your folder structure:
const { protect } = require("../middleware/authMiddleware");

// 2. Import Report Controller Functions
const reportController = require("../controllers/reportController");

const {
  getInventorySummary,
  getLowStock,
  getInventoryValuation,
  getChartData,
  getDashboardStats,
  getReports,
} = reportController;

// 3. Apply protect middleware safely
if (typeof protect === "function") {
  router.use(protect);
} else {
  console.error("CRITICAL WARNING: 'protect' middleware is undefined! Check authMiddleware.js export.");
}

// 4. Define Routes with Safety Guards
if (typeof getInventorySummary === "function") router.get("/summary", getInventorySummary);
if (typeof getLowStock === "function") router.get("/low-stock", getLowStock);
if (typeof getInventoryValuation === "function") router.get("/valuation", getInventoryValuation);
if (typeof getChartData === "function") router.get("/chart-data", getChartData);
if (typeof getDashboardStats === "function") router.get("/dashboard-stats", getDashboardStats);
if (typeof getReports === "function") router.get("/", getReports);

module.exports = router;