const multer = require("multer");
const cloudinary = require("../config/cloudinary");

const {
  CloudinaryStorage,
} = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
  cloudinary,

  params: {
    folder: "inventory-products",

    allowed_formats: [
      "jpg",
      "png",
      "jpeg",
      "webp",
    ],
  },
});

module.exports = multer({
  storage,
});