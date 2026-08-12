const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  addSupplier,
  getSuppliers,
  updateSupplier,
  deleteSupplier,
  getSupplierStats,
} = require("../controllers/supplierController");

router.use(protect);

router.get("/", getSuppliers);

router.post("/", addSupplier);

router.put("/:id", updateSupplier);

router.delete("/:id", deleteSupplier);

router.get("/stats", getSupplierStats);

module.exports = router;