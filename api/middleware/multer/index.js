const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

// 🔹 Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 🔹 Konfigurasi penyimpanan di Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {

    const format = file.mimetype.split("/")[1];


    const allowedFormats = ["jpg", "jpeg", "png", "gif", "webp"];
    if (!allowedFormats.includes(format)) {
      throw new Error("Format file tidak didukung!");
    }

    return {
      folder: "quiz_images",
      format: format, 
      public_id: Date.now() + "-" + file.originalname.replace(/\s+/g, "-"),
    };
  },
});

const upload = multer({ storage });

module.exports = { upload, cloudinary };
