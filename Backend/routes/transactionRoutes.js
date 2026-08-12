const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  createTransaction,
  getTransactions,
  getProductHistory,
} = require("../controllers/transactionController");

router.use(protect);

router.post("/", createTransaction);

router.get("/", getTransactions);

router.get("/product/:productId", getProductHistory);

module.exports = router;