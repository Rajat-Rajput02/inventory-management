const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },

    companyName: {
      type: String,
      default: "",
    },

    companyEmail: {
      type: String,
      default: "",
    },

    companyPhone: {
      type: String,
      default: "",
    },

    companyAddress: {
      type: String,
      default: "",
    },

    currency: {
      type: String,
      default: "INR",
    },

    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },

    theme: {
      type: String,
      default: "system",
    },

    defaultPage: {
      type: String,
      default: "/",
    },

    dateFormat: {
      type: String,
      default: "DD/MM/YYYY",
    },

    itemsPerPage: {
      type: Number,
      default: 10,
    },

    defaultWarehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
      default: null,
    },

    emailNotifications: {
      type: Boolean,
      default: true,
    },

    lowStockAlerts: {
      type: Boolean,
      default: true,
    },

    transactionAlerts: {
      type: Boolean,
      default: true,
    },

    weeklyReports: {
      type: Boolean,
      default: false,
    },

    desktopNotifications: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Settings", settingsSchema);