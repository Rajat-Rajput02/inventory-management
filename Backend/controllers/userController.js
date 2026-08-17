const User = require("../models/User");
const bcrypt = require("bcryptjs");
const logActivity = require("../utils/createActivity");

// ===============================
// GET PROFILE
// ===============================

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ===============================
// UPDATE PROFILE
// ===============================
exports.updateProfile = async (req, res) => {
  try {
    // 1. Destructure email (and other fields if needed) from req.body
    const { email, name, phone, company, bio, avatar } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 2. Check if email is provided and different from current user email
    if (email && email !== user.email) {
      const exists = await User.findOne({ email });

      if (exists) {
        return res.status(400).json({
          message: "Email already exists",
        });
      }

      user.email = email;
    }

    user.name = name ?? user.name;
    user.phone = phone ?? user.phone;
    user.company = company ?? user.company;
    user.bio = bio ?? user.bio;
    user.avatar = avatar ?? user.avatar;

    await user.save();

    await logActivity({
      user: user._id,
      action: "Profile Updated",
      module: "User",
      description: "Profile information updated",
    });
    res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};
// ===============================
// CHANGE PASSWORD
// ===============================

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
//===========================================
//  Upload AvATAR
//==========================================
exports.uploadAvatar = async (req, res) => {
  try {
    // 1. Guard against undefined req.file (Multer failed to parse file)
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Cloudinary file URL
    user.avatar = req.file.path || req.file.secure_url;

    await user.save();

    res.status(200).json({
      message: "Avatar uploaded successfully",
      avatar: user.avatar,
    });
  } catch (error) {
    console.error("Upload Avatar Error:", error);
    res.status(500).json({ message: "Unable to upload avatar", });
  }
};
// =========================================
// --------------------------       .   .
// User Role related code             -
// --------------------------        '_'
// =========================================

// GET ALL USERS
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    console.error("GET USERS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
};

// UPDATE USER ROLE
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const allowedRoles = ["admin", "manager", "user"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Prevent changing your own role
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot change your own role",
      });
    }

    user.role = role;

    await user.save();

    res.status(200).json({
      message: "User role updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("UPDATE ROLE ERROR:", error);

    res.status(500).json({
      message: "Failed to update user role",
    });
  }
};

// ACTIVATE / DEACTIVATE USER
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body || {};

    const user = await User.findById(id);

    if (typeof isActive === 'undefined') {
      return res.status(400).json({ message: "Please provide isActive status" });
    }

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Prevent self-deactivation
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot deactivate your own account",
      });
    }

    user.isActive = Boolean(isActive);

    await user.save();

    res.status(200).json({
      message: `User ${user.isActive ? "activated" : "deactivated"
        } successfully`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    console.error("UPDATE USER STATUS ERROR:", error);

    res.status(500).json({
      message: "Failed to update user status",
    });
  }
};