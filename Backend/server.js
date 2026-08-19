const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

const errorHandler = require("./middleware/errorMiddleware");
const cors = require("cors");
const express = require("express");
const connectDB = require("./config/db");

const app = express();
// CORS 
const allowedOrigins = [
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());

connectDB();

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const activityRoutes = require("./routes/activityRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const warehouseRoutes = require("./routes/warehouseRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const reportRoutes = require("./routes/reportRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

// ==============================
// DATABASE
// ==============================
connectDB();
// ==============================
// API ROUTES
// ==============================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/settings", settingsRoutes);

// ==============================
// HEALTH CHECK
// ==============================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Inventory API Running",
  });
});

// ==============================
// 404 HANDLER
// ==============================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

// ==============================
// GLOBAL ERROR HANDLER
// ==============================
app.use(errorHandler);

// ==============================
// SERVER
// ==============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});