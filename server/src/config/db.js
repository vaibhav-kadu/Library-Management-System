const mysql = require('mysql2');
require('dotenv').config();

// Step 1: Create initial connection (no DB yet)
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 3306
});

// Step 2: Connect to MySQL server
db.connect(err => {
    if (err) {
        console.error("❌ MySQL Connection Failed:", err.message);
        process.exit(1);
    }
    console.log("✅ MySQL SERVER CONNECTED...");

    // Ensure database exists
    db.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``, (err) => {
        if (err) {
            console.error("❌ Database creation error:", err.message);
            process.exit(1);
        }
        console.log(`✅ DATABASE '${process.env.DB_NAME}' ready.`);

        // Switch to DB
        db.changeUser({ database: process.env.DB_NAME }, (err) => {
            if (err) {
                console.error("❌ Cannot switch to DB:", err.message);
                process.exit(1);
            }
            console.log("✅ USING DATABASE:", process.env.DB_NAME);

            // Initialize tables
            initializeTables(db);
        });
    });
});

// Sequential execution of queries (avoid duplicate inserts)
async function initializeTables(connection) {
    const queries = [

        // categories
        `CREATE TABLE IF NOT EXISTS categories (
            category_id INT NOT NULL AUTO_INCREMENT,
            name VARCHAR(200) NOT NULL,
            status ENUM('active','inactive'),
            PRIMARY KEY (category_id),
            UNIQUE KEY (name)
        )`,
        `INSERT IGNORE INTO categories (name) VALUES
            ('Computer Science & Engineering'),
            ('Electronics & Communication'),
            ('Mechanical Engineering'),
            ('Civil Engineering'),
            ('Management & Commerce')`,

        // librarians
        `CREATE TABLE IF NOT EXISTS librarians (
            lid INT NOT NULL AUTO_INCREMENT,
            name VARCHAR(200) NOT NULL,
            contact VARCHAR(15) NOT NULL,
            email VARCHAR(100) NOT NULL,
            password VARCHAR(255) NOT NULL,
            profileImage VARCHAR(100),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (lid),
            UNIQUE KEY (email)
        )`,
        `INSERT IGNORE INTO librarians (name, contact, email, password) VALUES
            ('Ravi Sharma', '9876543210', 'ravi.sharma@example.com', '9876543210'),
            ('Sunita Reddy', '9090909090', 'sunita.reddy@example.com', '9090909090')`,

        // admin
        `CREATE TABLE IF NOT EXISTS admin (
            id INT NOT NULL AUTO_INCREMENT,
            name VARCHAR(200) NOT NULL,
            contact VARCHAR(15) NOT NULL,
            email VARCHAR(100) NOT NULL,
            password VARCHAR(255) NOT NULL,
            profileImage VARCHAR(100),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY (email)
        )`,
        `INSERT IGNORE INTO admin (name, contact, email, password) VALUES
            ('admin','00000','admin@123','admin'),
            ('ad','00','ad@','ad')`,

        // students
        `CREATE TABLE IF NOT EXISTS students (
            sid INT NOT NULL AUTO_INCREMENT,
            name VARCHAR(200) NOT NULL,
            contact VARCHAR(15) NOT NULL,
            email VARCHAR(100) NOT NULL,
            profileImage VARCHAR(100),
            password VARCHAR(255) NOT NULL,
            address TEXT,
            lid INT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (sid),
            UNIQUE KEY (email),
            FOREIGN KEY (lid) REFERENCES librarians(lid)
            ON DELETE CASCADE ON UPDATE CASCADE
        )`,
        `INSERT IGNORE INTO students (name, contact, email, password, address, lid) VALUES
            ('Aarav Mehta', '9000000001', 'aarav.mehta@example.com', '9000000001', 'Mumbai, India', 1),
            ('Sneha Sharma', '9000000002', 'sneha.sharma@example.com', '9000000002', 'Pune, India', 2)`,

        // books
        `CREATE TABLE IF NOT EXISTS books (
            book_id INT NOT NULL AUTO_INCREMENT,
            title VARCHAR(255) NOT NULL,
            author VARCHAR(100) DEFAULT NULL,
            isbn VARCHAR(30) DEFAULT NULL UNIQUE,
            publisher VARCHAR(100) DEFAULT NULL,
            category_id INT DEFAULT NULL,
            total_copies INT NOT NULL,
            issued_copies INT,
            bookImage VARCHAR(255),
            added_on TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
            updated_on TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (book_id),
            FOREIGN KEY (category_id) REFERENCES categories(category_id)
            ON DELETE CASCADE ON UPDATE CASCADE
        )`,
        `INSERT IGNORE INTO books (title, author, isbn, publisher, category_id, total_copies, issued_copies) VALUES
            ('Introduction to Algorithms', 'Thomas H. Cormen', '9780262033848', 'MIT Press', 1, 10, 2),
            ('Database System Concepts', 'Abraham Silberschatz', '9780078022159', 'McGraw-Hill', 1, 8, 1)`,

        // transactions
        `CREATE TABLE IF NOT EXISTS transactions (
            transaction_id INT NOT NULL AUTO_INCREMENT,
            book_id INT NOT NULL,
            sid INT NOT NULL,
            issued_by INT DEFAULT NULL,
            issue_date DATETIME DEFAULT NULL,
            due_date DATE,
            return_to INT DEFAULT NULL,
            return_date DATE DEFAULT NULL,
            status ENUM('pending','issued','returned','overdue') DEFAULT 'pending',
            fine DOUBLE DEFAULT 0.0,
            PRIMARY KEY (transaction_id),
            FOREIGN KEY (book_id) REFERENCES books(book_id),
            FOREIGN KEY (sid) REFERENCES students(sid),
            FOREIGN KEY (issued_by) REFERENCES librarians(lid),
            FOREIGN KEY (return_to) REFERENCES librarians(lid)
        )`,
        `INSERT IGNORE INTO transactions 
            (book_id, sid, issued_by, issue_date, due_date, status, fine) VALUES
            (1, 1, 2, '2025-09-01 10:30:00', '2025-09-07', 'issued', 0.0)`
    ];

    // Run queries sequentially
    for (const query of queries) {
        await new Promise((resolve) => {
            connection.query(query, (err) => {
                if (err) {
                    console.error("❌ SQL Error:", err.sqlMessage);
                } else {
                    console.log("✅ Executed:", query.split("(")[0].trim());
                }
                resolve();
            });
        });
    }

    console.log("🎉 All tables initialized successfully!");
}

module.exports = db;
