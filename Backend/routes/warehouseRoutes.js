const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  addWarehouse,
  getWarehouses,
  updateWarehouse,
  deleteWarehouse,
  getWarehouseStats,
} = require("../controllers/warehouseController");

router.use(protect);

router.get("/", getWarehouses);

router.post("/", addWarehouse);

router.put("/:id", updateWarehouse);

router.delete("/:id", deleteWarehouse);

router.get("/stats", getWarehouseStats);

module.exports = router;