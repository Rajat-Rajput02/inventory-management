const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");
const { protect } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getProfile,
  updateProfile,
  changePassword,
  uploadAvatar,
  getUsers,
  updateUserRole,
  updateUserStatus,
} = require("../controllers/userController");

// Profile
router.get("/profile", protect, getProfile);

router.put("/profile", protect, updateProfile);

router.put("/change-password", protect, changePassword);

router.post(
  "/avatar",
  protect,
  upload.single("avatar"),
  uploadAvatar
);

// Admin user management
router.get(
  "/",
  protect,
  adminMiddleware,
  getUsers
);

router.put(
  "/:id/role",
  protect,
  adminMiddleware,
  updateUserRole
);

router.put(
  "/:id/status",
  protect,
  adminMiddleware,
  updateUserStatus
);

module.exports = router;