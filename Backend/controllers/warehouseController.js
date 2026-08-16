const Warehouse = require("../models/Warehouse");
const Product = require("../models/Product");

// Create
exports.addWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.create({
      ...req.body,
      owner: req.user._id,
    });

    res.status(201).json(warehouse);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All
exports.getWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.find({
      owner: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.json(warehouses);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update
exports.updateWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.user._id,
      },
      req.body,
      {
        new: true,
      }
    );

    if (!warehouse) {
      return res.status(404).json({
        message: "Warehouse not found",
      });
    }

    res.json(warehouse);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete
exports.deleteWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!warehouse) {
      return res.status(404).json({
        message: "Warehouse not found",
      });
    }

    const inUse = await Product.exists({
      warehouse: warehouse._id,
      owner: req.user._id,
    });

    if (inUse) {
      return res.status(409).json({
        message: `Cannot delete warehouse "${warehouse.name}" because it is used by one or more products.`,
      });
    }

    await warehouse.deleteOne();

    res.json({
      message: "Warehouse deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Statistics
exports.getWarehouseStats = async (req, res) => {
  try {
    const total = await Warehouse.countDocuments({
      owner: req.user._id,
    });

    const active = await Warehouse.countDocuments({
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