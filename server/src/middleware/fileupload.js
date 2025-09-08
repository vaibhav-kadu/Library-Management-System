const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = path.join(__dirname, "..", "public", "uploads"); // default fallback

    if (req.originalUrl.includes("addBook")) {
      uploadPath = path.join(__dirname, "..", "public", "book_images");
    } else if (req.originalUrl.includes("Student")) { 
      uploadPath = path.join(__dirname, "..", "public", "student_images");
    } else if (req.originalUrl.includes("Librarian")) { 
      uploadPath = path.join(__dirname, "..", "public", "librarian_images");
    }

    // Ensure folder exists
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    // Get extension from original filename
    let ext = path.extname(file.originalname);

    // If no extension, fallback to MIME type
    if (!ext) {
      const mimeExt = file.mimetype.split("/")[1]; // e.g. "image/jpeg" -> "jpeg"
      ext = "." + mimeExt;
    }

    const randomStr = crypto.randomBytes(2).toString("hex"); // 4 chars
    const filename = `${Date.now()}-${randomStr}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
