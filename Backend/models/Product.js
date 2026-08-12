const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    sku: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    barcode: {
      type: String,
      default: "",
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    brand: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },


    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      default: null,
    },

    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      default: null,
    },

    costPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    sellingPrice: {
      type: Number,
      required: true,
      default: 0,
    },

    quantity: {
      type: Number,
      required: true,
      default: 0,
    },

    minStock: {
      type: Number,
      default: 5,
    },
    unit: {
      type: String,
      default: "pcs",
      enum: ["pcs", "kg", "box", "pack", "liter"],
    },

    image: {
      type: String,
      default: "",
    },

status: {
      type: String,
      default: "In Stock",
      enum: ["In Stock", "Low Stock", "Out of Stock", "Discontinued", "Active", "Inactive"],
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);