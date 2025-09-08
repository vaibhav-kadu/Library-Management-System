const mysql = require('mysql2');
require('dotenv').config();

// Step 1: Create initial connection (no DB)
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

// Step 2: Connect and ensure DB exists
db.connect(err => {
    if (err) throw err;
    console.log("✅ MySQL SERVER CONNECTED...");

    db.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``, (err) => {
        if (err) throw err;
        console.log(`✅ DATABASE '${process.env.DB_NAME}' ready.`);

        // Step 3: Change connection to include DB
        db.changeUser({ database: process.env.DB_NAME }, (err) => {
            if (err) throw err;
            console.log("✅ USING DATABASE:", process.env.DB_NAME);

            initializeTables(db); // ✅ safe to use
        });
    });
});

// Function to create tables if they don't exist
function initializeTables(connection) {
    const tableQueries = [

        `CREATE TABLE IF NOT EXISTS categories (
            category_id INT NOT NULL AUTO_INCREMENT,
            name VARCHAR(200) NOT NULL,
            PRIMARY KEY (category_id),
            UNIQUE KEY (name)
        )`,

        `INSERT INTO categories (name) VALUES
            ('Computer Science & Engineering'),
            ('Electronics & Communication'),
            ('Mechanical Engineering'),
            ('Civil Engineering'),
            ('Management & Commerce')`,


        `CREATE TABLE IF NOT EXISTS librarians (
            lid INT NOT NULL AUTO_INCREMENT,
            name VARCHAR(200) NOT NULL,
            contact VARCHAR(15) NOT NULL,
            email VARCHAR(100) NOT NULL,
            password VARCHAR(255) NOT NULL,
            profileImage VARCHAR(100),
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (lid),
            UNIQUE KEY (email)
        )`,

        `INSERT INTO librarians (name, contact, email, password)
VALUES
('Ravi Sharma', '9876543210', 'ravi.sharma@example.com', '9876543210'),
('Anita Desai', '9123456789', 'anita.desai@example.com', '9123456789'),
('Vikram Patel', '9012345678', 'vikram.patel@example.com', '9012345678'),
('Sunita Reddy', '9988776655', 'sunita.reddy@example.com', '9988776655'),
('Aman Kapoor', '9090909090', 'aman.kapoor@example.com', '9090909090')`
        ,

        `CREATE TABLE IF NOT EXISTS admin (
            id INT NOT NULL AUTO_INCREMENT,
            name VARCHAR(200) NOT NULL,
            contact VARCHAR(15) NOT NULL,
            email VARCHAR(100) NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY (email)
        )`,

        `insert into admin(name,contact,email,password) values('admin','00000','admin@123','admin'),
                                                            ('ad','00','ad@','ad')`
        ,

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
            PRIMARY KEY (sid),
            UNIQUE KEY (email),
            FOREIGN KEY (lid) REFERENCES librarians(lid)
            ON DELETE CASCADE
            ON UPDATE CASCADE
        

        )`,

        `INSERT INTO students (name, contact, email, password, address, lid)
VALUES
('Aarav Mehta', '9000000001', 'aarav.mehta@example.com', '9000000001', 'Mumbai, India', 1),
('Sneha Sharma', '9000000002', 'sneha.sharma@example.com', '9000000002', 'Pune, India', 2),
('Ishaan Verma', '9000000003', 'ishaan.verma@example.com', '9000000003', 'Delhi, India', 3),
('Ananya Joshi', '9000000004', 'ananya.joshi@example.com', '9000000004', 'Bengaluru, India', 4),
('Vivaan Deshmukh', '9000000005', 'vivaan.deshmukh@example.com', '9000000005', 'Chennai, India', 5),
('Kavya Nair', '9000000006', 'kavya.nair@example.com', '9000000006', 'Kochi, India', 1),
('Arjun Gupta', '9000000007', 'arjun.gupta@example.com', '9000000007', 'Ahmedabad, India', 2),
('Diya Reddy', '9000000008', 'diya.reddy@example.com', '9000000008', 'Hyderabad, India', 3),
('Rahul Kapoor', '9000000009', 'rahul.kapoor@example.com', '9000000009', 'Lucknow, India', 4),
('Meera Iyer', '9000000010', 'meera.iyer@example.com', '9000000010', 'Nagpur, India', 5),
('Nikhil Jain', '9000000011', 'nikhil.jain@example.com', '9000000011', 'Indore, India', 1),
('Tanya Saxena', '9000000012', 'tanya.saxena@example.com', '9000000012', 'Bhopal, India', 2),
('Aditya Singh', '9000000013', 'aditya.singh@example.com', '9000000013', 'Varanasi, India', 3),
('Pooja Dey', '9000000014', 'pooja.dey@example.com', '9000000014', 'Kolkata, India', 4),
('Rohan Nair', '9000000015', 'rohan.nair@example.com', '9000000015', 'Trivandrum, India', 5)`
        ,

        `CREATE TABLE IF NOT EXISTS books (
            book_id INT NOT NULL AUTO_INCREMENT,
            title VARCHAR(255) NOT NULL,
            author VARCHAR(100) DEFAULT NULL,
            isbn VARCHAR(30) DEFAULT NULL UNIQUE,
            publisher VARCHAR(100) DEFAULT NULL,
            category_id INT DEFAULT NULL ,
            total_copies INT NOT NULL,
            issued_copies INT ,
            image VARCHAR(255) DEFAULT NULL,
            added_on TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (book_id),
            FOREIGN KEY (category_id) REFERENCES categories(category_id) 
            ON DELETE CASCADE
            ON UPDATE CASCADE
        )`,

        `INSERT INTO books (title, author, isbn, publisher, category_id, total_copies, issued_copies, image) VALUES
            ('Introduction to Algorithms', 'Thomas H. Cormen', '9780262033848', 'MIT Press', 1, 10, 2, 'null'),
            ('Database System Concepts', 'Abraham Silberschatz', '9780078022159', 'McGraw-Hill', 1, 8, 1, 'null'),
            ('Operating System Concepts', 'Abraham Silberschatz', '9781118063330', 'Wiley', 1, 12, 3, 'null'),
            ('Microelectronic Circuits', 'Adel S. Sedra', '9780199339136', 'Oxford University Press', 2, 7, 2, 'null'),
            ('Signals and Systems', 'Alan V. Oppenheim', '9780138147570', 'Pearson', 2, 9, 1, 'null'),
            ('Digital Design', 'M. Morris Mano', '9780132774208', 'Pearson', 2, 10, 4, 'null'),
            ('Engineering Thermodynamics', 'P. K. Nag', '9780070151314', 'McGraw-Hill', 3, 11, 2, 'null'),
            ('Strength of Materials', 'R. K. Bansal', '9788131808146', 'Laxmi Publications', 3, 8, 1, 'null'),
            ('Theory of Machines', 'S. S. Rattan', '9789352602138', 'McGraw-Hill', 3, 9, 3, 'null'),
            ('Basic Structural Analysis', 'C. S. Reddy', '9781259006395', 'McGraw-Hill', 4, 10, 2, 'null'),
            ('Surveying Vol. 1', 'B. C. Punmia', '9789382335121', 'Laxmi Publications', 4, 7, 1, 'null'),
            ('Soil Mechanics and Foundations', 'B. C. Punmia', '9789382335244', 'Laxmi Publications', 4, 8, 2, 'null'),
            ('Principles of Management', 'P. C. Tripathi', '9781259026843', 'McGraw-Hill', 5, 12, 2, 'null'),
            ('Marketing Management', 'Philip Kotler', '9789335518976', 'Pearson', 5, 10, 3, 'null'),
            ('Financial Management', 'I. M. Pandey', '9789352601858', 'Vikas Publishing', 5, 9, 1, 'null')`,


        `CREATE TABLE IF NOT EXISTS transactions (
            transaction_id INT NOT NULL AUTO_INCREMENT,
            book_id INT NOT NULL,
            sid INT NOT NULL,
            issued_by INT DEFAULT NULL,
            issue_date DATETIME DEFAULT NULL,
            due_date DATE ,
    	    return_to INT DEFAULT NULL,
            return_date DATE DEFAULT NULL,
            status ENUM('pending','issued','returned','overdue') DEFAULT 'pending',
            fine DOUBLE DEFAULT 0.0,
            PRIMARY KEY (transaction_id),
            FOREIGN KEY (book_id) REFERENCES books(book_id),
            FOREIGN KEY (sid) REFERENCES students(sid),
            FOREIGN KEY (issued_by) REFERENCES librarians(lid),
    	    FOREIGN KEY (return_to) REFERENCES librarians(lid)
        )`, `INSERT INTO transactions 
(book_id, sid, issued_by, issue_date, due_date, return_to, return_date, status, fine) 
VALUES
(1, 3, 2, '2025-09-01 10:30:00', '2025-09-07', NULL, NULL, 'issued', 0.0),
(2, 5, 1, '2025-08-25 14:00:00', '2025-08-31', 3, '2025-08-30', 'returned', 0.0),
(4, 8, 4, '2025-08-20 09:15:00', '2025-08-26', NULL, NULL, 'overdue', 50.0),
(6, 10, 5, '2025-09-08 11:45:00', '2025-09-14', NULL, NULL, 'issued', 0.0),
(3, 2, 2, '2025-08-15 12:00:00', '2025-08-21', 1, '2025-08-24', 'returned', 30.0),
(7, 6, 3, '2025-09-07 15:00:00', '2025-09-13', NULL, NULL, 'pending', 0.0),
(9, 12, 1, '2025-09-02 10:00:00', '2025-09-08', 4, '2025-09-08', 'returned', 0.0),
(5, 14, 5, '2025-08-10 16:00:00', '2025-08-16', NULL, NULL, 'overdue', 120.0),
(8, 7, 2, '2025-09-06 13:20:00', '2025-09-12', NULL, NULL, 'issued', 0.0),
(10, 1, 3, '2025-08-28 09:40:00', '2025-09-03', 2, '2025-09-05', 'returned', 20.0);
`
    ];

    tableQueries.forEach(query => {
        connection.query(query, (err) => {
            if (err) {
                console.error("❌ SQL Error:", err.sqlMessage);
            } else {
                console.log("✅ Query executed successfully.");
            }
        });
    });
}

module.exports = db;