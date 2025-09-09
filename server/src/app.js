// app.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer'); // For handling file uploads
const routes = require('./routes/routes'); // Your routes
require('dotenv').config();

const app = express();

// Body parser & JSON middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS
app.use(cors());

// Set view engine (optional if you use EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
app.use('/book_images', express.static(path.join(__dirname, 'public', 'book_images')));
app.use('/student_images', express.static(path.join(__dirname, 'public', 'student_images')));
app.use('/librarian_images', express.static(path.join(__dirname, 'public', 'librarian_images')));

// Use routes
app.use('/', routes);
app.use('/api/routes', routes);

// Multer error handling
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'UNEXPECTED_FIELD') {
      return res.status(400).json({
        success: false,
        error: 'Unexpected field in file upload. Expected field names: bookImage, profileImage'
      });
    }
  }
  next(error);
});

// 404 Not Found handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Page Not Found',
    message: 'The requested endpoint does not exist'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!',
    message: err.message
  });
});

module.exports = app;
