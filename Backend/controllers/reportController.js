const Product = require("../models/Product");
const Category = require("../models/Category");
const Supplier = require("../models/Supplier");
const Warehouse = require("../models/Warehouse");
const Transaction = require("../models/Transaction"); // Added missing import
const mongoose = require("mongoose");

// 1. Inventory Summary Endpoint
// GET /api/reports/summary
exports.getInventorySummary = async (req, res) => {
  try {
    const ownerId = req.user._id;

    const [totalProducts, totalCategories, totalSuppliers, totalWarehouses] =
      await Promise.all([
        Product.countDocuments({ owner: ownerId }),
        Category.countDocuments({ owner: ownerId }),
        Supplier.countDocuments({ owner: ownerId }),
        Warehouse.countDocuments({ owner: ownerId }),
      ]);

    res.status(200).json({
      totalProducts,
      totalCategories,
      totalSuppliers,
      totalWarehouses,
    });
  } catch (error) {
    console.error("GET SUMMARY ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// 2. Low Stock Products Endpoint
// GET /api/reports/low-stock
exports.getLowStock = async (req, res) => {
  try {
    const lowStockProducts = await Product.find({
      owner: req.user._id,
      $expr: {
        $lte: ["$quantity", "$minStock"],
      },
    })
      .populate("category")
      .populate("supplier");

    res.status(200).json(lowStockProducts);
  } catch (error) {
    console.error("GET LOW STOCK ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// 3. Inventory Value Endpoint (Mongo Aggregation)
// GET /api/reports/valuation (or /value)
exports.getInventoryValuation = async (req, res) => {
  try {
    const ownerId = new mongoose.Types.ObjectId(req.user._id);

    const result = await Product.aggregate([
      { $match: { owner: ownerId } },
      {
        $group: {
          _id: null,
          inventoryCost: {
            $sum: {
              $multiply: [{ $ifNull: ["$costPrice", 0] }, "$quantity"],
            },
          },
          inventoryWorth: {
            $sum: {
              $multiply: [
                { $ifNull: ["$sellingPrice", { $ifNull: ["$price", 0] }] },
                "$quantity",
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          inventoryCost: 1,
          inventoryWorth: 1,
          expectedProfit: {
            $subtract: ["$inventoryWorth", "$inventoryCost"],
          },
        },
      },
    ]);

    const summary = result[0] || {
      inventoryCost: 0,
      inventoryWorth: 0,
      expectedProfit: 0,
    };

    res.status(200).json(summary);
  } catch (error) {
    console.error("GET INVENTORY VALUE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// 4. Dashboard Stats Endpoint
// GET /api/reports/dashboard-stats
exports.getDashboardStats = async (req, res) => {
  try {
    const ownerId = new mongoose.Types.ObjectId(req.user._id);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [
      products,
      inventoryValues,
      totalProducts,
      lowStockCount,
      todayTransactions,
      monthTransactions,
      recentTransactions,
    ] = await Promise.all([
      Product.find({ owner: ownerId }).populate("category"),

      Product.aggregate([
        { $match: { owner: ownerId } },
        {
          $group: {
            _id: null,
            stockValue: {
              $sum: {
                $multiply: [
                  { $ifNull: ["$costPrice", 0] },
                  "$quantity",
                ],
              },
            },

            inventoryWorth: {
              $sum: {
                $multiply: [
                  {
                    $ifNull: [
                      "$sellingPrice",
                      { $ifNull: ["$price", 0] },
                    ],
                  },
                  "$quantity",
                ],
              },
            },
          },
        },
      ]),

      Product.countDocuments({ owner: ownerId }),

      Product.countDocuments({
        owner: ownerId,
        $expr: {
          $lte: ["$quantity", "$minStock"],
        },
      }),

      Transaction.countDocuments({
        owner: ownerId,
        createdAt: {
          $gte: startOfToday,
        },
      }),

      Transaction.countDocuments({
        owner: ownerId,
        createdAt: {
          $gte: startOfMonth,
        },
      }),

      Transaction.find({ owner: ownerId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("product"),
    ]);

    const values = inventoryValues[0] || {
      stockValue: 0,
      inventoryWorth: 0,
    };

    const expectedProfit =
      values.inventoryWorth - values.stockValue;

    // Category Analytics
    const categoryData = {};

    products.forEach((product) => {
      const name = product.category?.name || "Unknown";

      categoryData[name] =
        (categoryData[name] || 0) + 1;
    });

    // Top Products
    const topProducts = [...products]
      .sort(
        (a, b) =>
          b.quantity * b.sellingPrice -
          a.quantity * a.sellingPrice
      )
      .slice(0, 5);

    res.status(200).json({
      totalProducts,

      inventoryWorth: values.inventoryWorth,

      stockValue: values.stockValue,

      expectedProfit,

      lowStock: lowStockCount,

      todayTransactions,

      thisMonthTransactions: monthTransactions,

      categoryData,

      topProducts,

      recentTransactions,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// 5. Chart Data Endpoint
// GET /api/reports/chart-data
exports.getChartData = async (req, res) => {
  try {
    const ownerId = new mongoose.Types.ObjectId(req.user._id);

    const [
      productsPerWarehouse,
      productsPerSupplier,
      transactionsPerMonth,
      stockInVsStockOut,
      lowStockDistribution,
    ] = await Promise.all([
      Product.aggregate([
        { $match: { owner: ownerId, warehouse: { $ne: null } } },
        { $group: { _id: "$warehouse", count: { $sum: 1 } } },
        {
          $lookup: {
            from: "warehouses",
            localField: "_id",
            foreignField: "_id",
            as: "warehouseDetails",
          },
        },
        { $unwind: "$warehouseDetails" },
        { $project: { _id: 0, name: "$warehouseDetails.name", count: 1 } },
      ]),

      Product.aggregate([
        { $match: { owner: ownerId, supplier: { $ne: null } } },
        { $group: { _id: "$supplier", count: { $sum: 1 } } },
        {
          $lookup: {
            from: "suppliers",
            localField: "_id",
            foreignField: "_id",
            as: "supplierDetails",
          },
        },
        { $unwind: "$supplierDetails" },
        { $project: { _id: 0, name: "$supplierDetails.name", count: 1 } },
      ]),

      Transaction.aggregate([
        { $match: { owner: ownerId } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
            total: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $project: { _id: 0, month: "$_id", total: 1 } },
      ]),

      Transaction.aggregate([
        { $match: { owner: ownerId } },
        {
          $group: {
            _id: "$type",
            count: { $sum: 1 },
            quantity: { $sum: "$quantity" },
          },
        },
      ]),

      Product.aggregate([
        { $match: { owner: ownerId } },
        {
          $project: {
            isLowStock: {
              $cond: [
                { $lte: ["$quantity", "$minStock"] },
                "Low Stock",
                "In Stock",
              ],
            },
          },
        },
        { $group: { _id: "$isLowStock", count: { $sum: 1 } } },
      ]),
    ]);

    res.status(200).json({
      productsPerWarehouse,
      productsPerSupplier,
      transactionsPerMonth,
      stockInVsStockOut,
      lowStockDistribution,
    });
  } catch (error) {
    console.error("CHART DATA ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// 6. Generic Fallback Report Endpoint
exports.getReports = async (req, res) => {
  res.json({ message: "Reports endpoint working" });
};