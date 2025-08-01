const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect and then initialize tables
db.connect(err => {
    if (err) throw err;
    console.log("✅ DATABASE CONNECTED...");
    initializeTables();
});

// Function to create tables if they don't exist
function initializeTables() {
    const tableQueries = [

        `CREATE TABLE IF NOT EXISTS categories (
            category_id INT NOT NULL AUTO_INCREMENT,
            name VARCHAR(200) NOT NULL,
            PRIMARY KEY (category_id),
            UNIQUE KEY (name)
        )`,

        `CREATE TABLE IF NOT EXISTS librarians (
            librarian_id INT NOT NULL AUTO_INCREMENT,
            name VARCHAR(200) NOT NULL,
            contact VARCHAR(15) NOT NULL,
            email VARCHAR(100) NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (librarian_id),
            UNIQUE KEY (email)
        )`,

        `CREATE TABLE IF NOT EXISTS admin (
            admin_id INT NOT NULL AUTO_INCREMENT,
            name VARCHAR(200) NOT NULL,
            contact VARCHAR(15) NOT NULL,
            email VARCHAR(100) NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (admin_id),
            UNIQUE KEY (email)
        )`,

        `CREATE TABLE IF NOT EXISTS students (
            student_id INT NOT NULL AUTO_INCREMENT,
            name VARCHAR(200) NOT NULL,
            contact VARCHAR(15) NOT NULL,
            email VARCHAR(100) NOT NULL,
            password VARCHAR(255) NOT NULL,
            address TEXT,
            created_by INT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (student_id),
            UNIQUE KEY (email),
            FOREIGN KEY (created_by) REFERENCES librarians(librarian_id)

        )`,

        `CREATE TABLE IF NOT EXISTS books (
            book_id INT NOT NULL AUTO_INCREMENT,
            title VARCHAR(255) NOT NULL,
            author VARCHAR(100) DEFAULT NULL,
            isbn VARCHAR(30) DEFAULT NULL UNIQUE,
            category_id INT DEFAULT NULL,
            total_copies INT NOT NULL,
            status ENUM('available','issued') DEFAULT 'available',
            image VARCHAR(255) DEFAULT NULL,
            added_by INT DEFAULT NULL,
            added_on TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (book_id),
            FOREIGN KEY (category_id) REFERENCES categories(category_id),
            FOREIGN KEY (added_by) REFERENCES librarians(librarian_id)
        )`,

        `CREATE TABLE IF NOT EXISTS transactions (
            transaction_id INT NOT NULL AUTO_INCREMENT,
            book_id INT NOT NULL,
            student_id INT NOT NULL,
            issued_by INT NOT NULL,
            issue_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            due_date DATE NOT NULL,
            return_date DATE DEFAULT NULL,
            status ENUM('issued','returned','overdue') DEFAULT 'issued',
            fine DOUBLE DEFAULT NULL,
            PRIMARY KEY (transaction_id),
            FOREIGN KEY (book_id) REFERENCES books(book_id),
            FOREIGN KEY (student_id) REFERENCES students(student_id),
            FOREIGN KEY (issued_by) REFERENCES librarians(librarian_id)
        )`
    ];

    tableQueries.forEach(query => {
        db.query(query, (err, result) => {
            if (err) {
                console.error("❌ Error creating table:", err.sqlMessage);
            } else {
                console.log("✅ Table checked/created successfully.");
            }
        });
    });
}

module.exports = db;
