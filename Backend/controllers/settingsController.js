const Settings = require("../models/Settings");

exports.getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne({
      owner: req.user._id,
    }).populate("defaultWarehouse");

    if (!settings) {
      settings = await Settings.create({
        owner: req.user._id,
      });
    }

    res.json(settings);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      {
        owner: req.user._id,
      },
      { $set: req.body },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    ).populate("defaultWarehouse");

    res.json(settings);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};