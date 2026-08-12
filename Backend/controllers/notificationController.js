const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
    try {
        const notifications =
            await Notification.find({
                user: req.user._id
            })
                .sort({
                    createdAt: -1
                })
                .limit(20);
        res.json(notifications);
    }
    catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      {
        read: true,
      },
      {
        returnDocument: true,
      }
    );

    res.json(notification);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Mark All Read
exports.markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        user: req.user._id,
        read: false,
      },
      {
        read: true,
      }
    );

    const notifications = await Notification.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};