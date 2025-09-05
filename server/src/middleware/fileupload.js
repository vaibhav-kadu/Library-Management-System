const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = path.join(__dirname, "..", "public", "uploads"); // default fallback

    if (req.originalUrl.includes("addBook")) {
      uploadPath = path.join(__dirname, "..", "public", "book_images");
    } else if (req.originalUrl.includes("addStudent")) {
      uploadPath = path.join(__dirname, "..", "public", "student_images");
    } else if (req.originalUrl.includes("addLibrarian")) {
      uploadPath = path.join(__dirname, "..", "public", "librarian_images");
    }

    // Ensure folder exists
    fs.mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const randomStr = crypto.randomBytes(6).toString("hex");
    const filename = `${Date.now()}-${randomStr}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
