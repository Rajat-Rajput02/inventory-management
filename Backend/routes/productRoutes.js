const express = require("express");

const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadProductImage");

const {
  addProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  lowStockProducts,
} = require("../controllers/productController");

// Protected Routes
router.post(
  "/",
  protect,
  upload.single("image"),
  addProduct
);

router.get("/", protect, getProducts);

router.put("/:id", protect, upload.single("image"), updateProduct);

router.delete("/:id", protect, deleteProduct);

router.get("/low-stock", protect, lowStockProducts);

module.exports = router;