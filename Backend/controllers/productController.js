const Product = require("../models/Product");
const updateProductStatus = require("../utils/updateProductStatus");
const mongoose = require("mongoose");
const createActivity = require("../utils/createActivity");
const createNotification = require("../utils/createNotification");
const crypto = require("crypto");

const parseNumber = (val) => {
  const parsed = parseFloat(val);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const normalizePricing = (payload = {}) => {
  const normalized = { ...payload };

  if (normalized.price !== undefined && normalized.sellingPrice === undefined) {
    normalized.sellingPrice = normalized.price;
  }

  ["sellingPrice", "costPrice", "quantity", "minStock"].forEach((field) => {
    if (normalized[field] !== undefined) {
      normalized[field] = parseNumber(normalized[field]);
    }
  });

  delete normalized.price;

  return normalized;
};

const normalizeObjectId = (value) => {
  if (!value) return null;

  if (typeof value === "object") {
    value = value._id;
  }

  if (typeof value !== "string") return null;

  const trimmed = value.trim();
  if (!trimmed || trimmed === "N/A") return null;

  return mongoose.Types.ObjectId.isValid(trimmed) ? trimmed : null;
};

// ===============================
// Add Product
// ===============================

exports.addProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      quantity,
      minStock,
      warehouse,
      unit,
      status,
      brand,
      supplier,
      sku,
      barcode,
      description,
      sellingPrice,
      costPrice,
    } = req.body;
    const imageUrl = req.file ? (req.file.path || req.file.secure_url) : "";

    const finalSku = sku || ("SKU-" + crypto.randomUUID().slice(0, 8).toUpperCase());

    const supplierId = normalizeObjectId(supplier);
    const categoryId = normalizeObjectId(category);
    const warehouseId = normalizeObjectId(warehouse);

    const product = await Product.create({
      name,
      brand,
      sku: finalSku,
      description,
      image: imageUrl,
      barcode,
      category: categoryId,
      // supplier: supplier && supplier.trim() !== "" ? supplier : null,
      supplier: supplierId,
      warehouse: warehouseId,
      costPrice: parseNumber(costPrice),
      sellingPrice: parseNumber(sellingPrice),
      quantity: parseNumber(quantity),
      minStock: parseNumber(minStock),
      unit: unit || "pcs",
      status: status || "In Stock",
      owner: req.user._id,
    });
    updateProductStatus(product);

    await createActivity({
      user: req.user._id,
      action: "CREATE",
      module: "Product",
      description: `Created product "${product.name}"`,
      metadata: {
        productId: product._id,
      },
    });
    await createNotification(
      req.user._id,
      "Product Added",
      `${product.name} added successfully`,
      "success"
    );
    res.status(201).json(product);
  } catch (error) {
    console.error("ADD PRODUCT ERROR STACK:", error);

    if (error?.code === 11000 && error?.keyPattern?.sku) {
      return res.status(409).json({
        message: `SKU "${error?.keyValue?.sku || req.body?.sku || "provided SKU"}" already exists. Please use a unique SKU.`,
        field: "sku",
      });
    }

    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Get All Products
// ===============================

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find({
      owner: req.user._id,
    })
      .populate("category")
      .populate("supplier")
      .sort({
        createdAt: -1,
      });

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Update Product
// ===============================
exports.updateProduct = async (req, res) => {
  try {
    const updateData = normalizePricing(req.body);

    ["_id", "owner", "createdAt", "updatedAt", "__v"].forEach((field) => {
      delete updateData[field];
    });

    if (Object.prototype.hasOwnProperty.call(updateData, "supplier")) {
      updateData.supplier = normalizeObjectId(updateData.supplier);
    }
    if (Object.prototype.hasOwnProperty.call(updateData, "category")) {
      updateData.category = normalizeObjectId(updateData.category);
    }
    if (Object.prototype.hasOwnProperty.call(updateData, "warehouse")) {
      updateData.warehouse = normalizeObjectId(updateData.warehouse);
    }

    if (req.file) {
      updateData.image = req.file.path || req.file.secure_url;
    }

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { $set: updateData },
      { returnDocument: 'after', runValidators: true }
    )
      .populate("category")
      .populate("supplier")   // 👈 Crucial: Populates supplier name
      .populate("warehouse");

    if (!product) {
      return res.status(404).json({ message: "Product not found or unauthorized" });
    }
    // Merge req.body into product
    Object.assign(product, req.body);

    // Recalculate status
    updateProductStatus(product);

    await createActivity({
      user: req.user._id,
      action: "UPDATE",
      module: "Product",
      description: `Updated product "${product.name}"`,
      metadata: {
        productId: product._id,
      },
    });

    await createNotification(
      req.user._id,
      "Inventory Updated",
      `${product.name} updated`,
      "info"
    );

    // Now returns fully populated object containing supplier object
    res.status(200).json(product);
  } catch (error) {
    if (error?.code === 11000 && error?.keyPattern?.sku) {
      return res.status(409).json({
        message: `SKU "${error?.keyValue?.sku || req.body?.sku || "provided SKU"}" already exists. Please use a unique SKU.`,
        field: "sku",
      });
    }

    res.status(500).json({
      message: error.message,
    });
  }
};
// ===============================
// Delete Product
// ===============================

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await product.deleteOne();

    await createActivity({
      user: req.user._id,
      action: "DELETE",
      module: "Product",
      description: `Deleted product "${product.name}"`,
      metadata: {
        productId: product._id,
      },
    });
    await createNotification(
      req.user._id,
      "Product Deleted",
      `${product.name} removed`,
      "warning"
    );
    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// Low Stock Products
// ===============================

exports.lowStockProducts = async (req, res) => {
  try {
    const lowStock = await Product.find({
      owner: req.user._id,
      $expr: {
        $lte: ["$quantity", "$minStock"],
      },
    });
    for (const product of lowStock) {
      if (product.quantity <= product.minStock) {
        await createNotification(
          req.user._id,
          "Low Stock",
          `${product.name} is running low`,
          "warning"
        );
      }
    }

    res.status(200).json(lowStock);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};