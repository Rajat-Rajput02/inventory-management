const Supplier = require("../models/Supplier");
const Product = require("../models/Product");

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
    const supplier = await Supplier.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!supplier) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    const inUse = await Product.exists({
      supplier: supplier._id,
      owner: req.user._id,
    });

    if (inUse) {
      return res.status(409).json({
        message: `Cannot delete supplier "${supplier.name}" because it is used by one or more products.`,
      });
    }

    await supplier.deleteOne();

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