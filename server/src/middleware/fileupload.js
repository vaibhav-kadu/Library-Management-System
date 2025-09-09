const path = require("path");
const crypto = require("crypto");
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = path.join(__dirname, "..", "public", "uploads"); // default fallback

    // FIXED: Better route detection for proper folder assignment
    if (req.originalUrl.includes("addBook") || req.originalUrl.includes("updateBook")) {
      uploadPath = path.join(__dirname, "..", "public", "book_images");
    } else if (req.originalUrl.includes("Student") || req.originalUrl.includes("student")) { 
      uploadPath = path.join(__dirname, "..", "public", "student_images");
    } else if (req.originalUrl.includes("Librarian") || req.originalUrl.includes("librarian")) { 
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

// FIXED: Add file filter and size limits
const fileFilter = (req, file, cb) => {
  // Check if file is an image
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

module.exports = upload;