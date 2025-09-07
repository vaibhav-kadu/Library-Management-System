//Web framework for handling routing, requests, etc.
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const db = require('./config/db.js');
const routes = require('./routes/routes.js');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();

//Initializes the Express app.
const app = express();

app.use(express.urlencoded({ extends: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extends: true }));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));
app.use("/book_images", express.static(path.join(__dirname, "public", "book_images")));
app.use("/student_images", express.static(path.join(__dirname, "public", "student_images")));
app.use("/librarian_images", express.static(path.join(__dirname, "public", "librarian_images")));
app.use(cors());
app.use(express.json());
app.use("/", routes);
app.use("/api/routes/", routes);
app.use((req, res) => {
        res.status(404).json({
                success: false,
                error: 'Page Not Found',
                message: 'The requested endpoint does not exist'
        });
});

module.exports = app;
