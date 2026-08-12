const Supplier = require("../models/Supplier");

exports.addSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.create({
      ...req.body,
      owner: req.user._id,
    });

    res.status(201).json(supplier);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find({
      owner: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.json(suppliers);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.updateSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.user._id,
      },
      req.body,
      {
        returnDocument: 'after',
      }
    );

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    res.json(supplier);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    res.json({
      message: "Supplier deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
exports.getSupplierStats = async (req, res) => {
  try {
    const total = await Supplier.countDocuments({
      owner: req.user._id,
    });

    const active = await Supplier.countDocuments({
      owner: req.user._id,
      status: "Active",
    });

    res.json({
      total,
      active,
      inactive: total - active,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};