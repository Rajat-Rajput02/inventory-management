const Supplier = require("../models/Supplier");
const Product = require("../models/Product");

const normalizeSupplierData = (body) => ({
  name: body.name?.trim() || "",
  email: body.email?.trim().toLowerCase() || "",
  phone: body.phone?.trim() || "",
  company: body.company?.trim() || "",
  address: body.address?.trim() || "",
  gstNumber: body.gstNumber?.trim() || "",
  notes: body.notes?.trim() || "",
  status: body.status || "Active",
});

const findDuplicateSupplier = async ({ owner, data, excludeId = null }) => {
  const query = {
    owner,
    ...data,
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  return Supplier.findOne(query);
};

exports.addSupplier = async (req, res) => {
  try {
    const supplierData = normalizeSupplierData(req.body);

    if (!supplierData.name) {
      return res.status(400).json({
        message: "Supplier name is required.",
      });
    }

    const duplicate = await findDuplicateSupplier({
      owner: req.user._id,
      data: supplierData,
    });

    if (duplicate) {
      return res.status(409).json({
        message: "A supplier with the same details already exists.",
      });
    }

    const supplier = await Supplier.create({
      ...supplierData,
      owner: req.user._id,
    });

    res.status(201).json(supplier);
  } catch (error) {
    console.error("Add Supplier Error:", error);
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
    const supplierData = normalizeSupplierData(req.body);

    if (!supplierData.name) {
      return res.status(400).json({
        message: "Supplier name is required.",
      });
    }

    const existing = await Supplier.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!existing) {
      return res.status(404).json({
        message: "Supplier not found",
      });
    }

    const duplicate = await findDuplicateSupplier({
      owner: req.user._id,
      data: supplierData,
      excludeId: req.params.id,
    });

    if (duplicate) {
      return res.status(409).json({
        message: "Another supplier with the same details already exists.",
      });
    }

    Object.assign(existing, supplierData);
    await existing.save();

    res.json(existing);
  } catch (error) {
    console.error("Update Supplier Error:", error);
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
