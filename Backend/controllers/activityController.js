const Activity = require("../models/Activity");

exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.find({
      user: req.user._id,
    })
      .populate("user", "name email")
      .sort({
        createdAt: -1,
      });

    res.json(activities);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};