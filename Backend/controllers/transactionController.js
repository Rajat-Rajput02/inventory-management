const Transaction = require("../models/Transaction");
const Product = require("../models/Product");
const mongoose = require("mongoose");
const updateProductStatus = require("../utils/updateProductStatus");
const createActivity = require("../utils/createActivity");
const createNotification = require("../utils/createNotification");

// ======================================
// Create Transaction
// ======================================

exports.createTransaction = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { product, type, quantity, reason, notes } = req.body;

    // Validation: ID format
    if (!mongoose.Types.ObjectId.isValid(product)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: "Invalid Product ID format" });
    }

    // Validation: Quantity check
    const numQty = Number(quantity);
    if (!Number.isFinite(numQty) || numQty <= 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "Transaction quantity must be greater than 0",
        field: "quantity",
      });
    }

    if (!["IN", "OUT"].includes(type)) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        message: "Transaction type must be IN or OUT",
        field: "type",
      });
    }

    // 1. Find Product bound to the active session
    const existingProduct = await Product.findOne({
      _id: product,
      owner: req.user._id,
    }).session(session);

    if (!existingProduct) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Product not found" });
    }

    // 2. Stock Out validation
    if (type === "OUT" && existingProduct.quantity < numQty) {
      await session.abortTransaction();
      session.endSession();

      return res.status(400).json({
        message: `Insufficient stock. Available quantity: ${existingProduct.quantity}.`,
        field: "quantity",
      });
    }

    // 3. Update quantity & trigger Stock IN / Stock OUT notifications
    if (type === "IN") {
      existingProduct.quantity += numQty;

      await createActivity({
        user: req.user._id,
        action: "STOCK_IN",
        module: "Transaction",
        description: `Added ${numQty} units to ${existingProduct.name}`,
        metadata: {
          productId: existingProduct._id,
          quantity: numQty,
        },
      });

      // Notification: After Stock IN
      await createNotification(
        req.user._id,
        "Stock Added",
        `${existingProduct.name} stock increased by ${numQty}.`,
        "success"
      );

    } else {
      existingProduct.quantity -= numQty;

      await createActivity({
        user: req.user._id,
        action: "STOCK_OUT",
        module: "Transaction",
        description: `Removed ${numQty} units from ${existingProduct.name}`,
        metadata: {
          productId: existingProduct._id,
          quantity: numQty,
        },
      });
      // Notification: After Stock OUT
      await createNotification(
        req.user._id,
        "Stock Removed",
        `${existingProduct.name} stock decreased by ${numQty}.`,
        "warning"
      );
    }

    // Notification: Low Stock Alert (Right after updating product quantity)
    if (existingProduct.quantity <= existingProduct.minStock) {
      await createNotification(
        req.user._id,
        "Low Stock Alert",
        `${existingProduct.name} is running low on stock.`,
        "error"
      );
    }

    // 4. Update status using the helper
    updateProductStatus(existingProduct);

    // 5. Save product within session
    await existingProduct.save({ session });

    // 6. Create transaction within session
    const [transaction] = await Transaction.create(
      [
        {
          product: existingProduct._id,
          owner: req.user._id,
          type,
          quantity: numQty,
          reason,
          notes,
        },
      ],
      { session }
    );

    // 7. Commit & End Session
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json(transaction);
  } catch (error) {
    // Abort transaction and clean up session on failure
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({ message: error.message });
  }
};

// ======================================
// Get Transactions
// ======================================

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      owner: req.user._id,
    })
      .populate("product", "name sku")
      .sort({
        createdAt: -1,
      });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ======================================
// Product History
// ======================================

exports.getProductHistory = async (req, res) => {
  try {
    const history = await Transaction.find({
      owner: req.user._id,
      product: req.params.productId,
    }).sort({
      createdAt: -1,
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};