const path = require("path");
const errorHandler = require("./middleware/errorMiddleware");

require("dotenv").config({
  path: path.join(__dirname, ".env"),
});
const cors = require("cors");

const allowedOrigins = [
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const express = require("express");
const connectDB = require("./config/db");

const activityRoutes =
  require("./routes/activityRoutes");
const productRoutes = require("./routes/productRoutes");
const notificationRoutes =
  require("./routes/notificationRoutes");
const categoryRoutes =
  require("./routes/categoryRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const warehouseRoutes = require("./routes/warehouseRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const reportRoutes = require("./routes/reportRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

const app = express();

connectDB();

app.use(cors());

app.use(express.json());

app.use("/api/products", productRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/activities", activityRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/suppliers", supplierRoutes);

app.use("/api/warehouses", warehouseRoutes);

app.use("/api/transactions", transactionRoutes);

app.use("/api/reports", reportRoutes);

app.use("/api/settings", settingsRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "API endpoint not found",
  });
});
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Inventory API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);