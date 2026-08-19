const path = require("path");
const express = require("express");
const cors = require("cors");

require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorMiddleware");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const activityRoutes = require("./routes/activityRoutes");
const productRoutes = require("./routes/productRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const warehouseRoutes = require("./routes/warehouseRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const reportRoutes = require("./routes/reportRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

const app = express();

// ===============================
// DATABASE
// ===============================

connectDB();

// ===============================
// CORS
// ===============================

const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5000/api",
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// ===============================
// BODY PARSER
// ===============================

app.use(express.json());

// ===============================
// API ROUTES
// ===============================

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

// ===============================
// ROOT
// ===============================

app.get("/", (req, res) => {
  res.status(200).send("Inventory API Running");
});

// ===============================
// 404 HANDLER
// ===============================

app.use((req, res) => {
  res.status(404).json({
    message: "API endpoint not found",
  });
});

// ===============================
// GLOBAL ERROR HANDLER
// ===============================

app.use(errorHandler);

// ===============================
// SERVER
// ===============================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});