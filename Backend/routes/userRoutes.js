const express = require("express");
const router = express.Router();

const upload = require("../middleware/uploadMiddleware");

// 1. Destructure protect correctly from authMiddleware
const { protect } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");


// 2. Import Controller Functions
const {
    getProfile,
    updateProfile,
    changePassword,
    uploadAvatar,
    getUsers,
    updateUserRole,
    updateUserStatus,
} = require("../controllers/userController");

// Safety Guards to prevent server crashes if an import is missing
if (typeof protect !== "function") {
    console.error("CRITICAL ERROR: 'protect' middleware is undefined in userRoutes.js!");
}

// 3. Define User Routes
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);
router.post("/avatar", protect, upload.single("avatar"), uploadAvatar);
//user role routes
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