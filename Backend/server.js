const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, ".env"),
});
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const express = require("express");
const cors = require("cors");

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


app.get("/", (req, res) => {
  res.send("Inventory API Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);