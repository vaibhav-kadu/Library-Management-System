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

        `INSERT INTO categories (name) VALUES   ('Science Fiction'),('Romance'),('History'),
                                            ('Biographies'),('Children'),('Fantasy'),('Mystery'),
                                            ('Self-Help'),('Technology'),('Philosophy')`,


        `CREATE TABLE IF NOT EXISTS librarians (
            id INT NOT NULL AUTO_INCREMENT,
            name VARCHAR(200) NOT NULL,
            contact VARCHAR(15) NOT NULL,
            email VARCHAR(100) NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
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
            id INT NOT NULL AUTO_INCREMENT,
            name VARCHAR(200) NOT NULL,
            contact VARCHAR(15) NOT NULL,
            email VARCHAR(100) NOT NULL,
            password VARCHAR(255) NOT NULL,
            address TEXT,
            librarian_id INT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY (email),
            FOREIGN KEY (librarian_id) REFERENCES librarians(id)

        )`,
        
        `INSERT INTO students (name, contact, email, password, address, librarian_id)
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
('Rohan Nair', '9000000015', 'rohan.nair@example.com', '9000000015', 'Trivandrum, India', 5),
('Aisha Khan', '9000000016', 'aisha.khan@example.com', '9000000016', 'Jaipur, India', 1),
('Manav Chauhan', '9000000017', 'manav.chauhan@example.com', '9000000017', 'Surat, India', 2),
('Nitya Patel', '9000000018', 'nitya.patel@example.com', '9000000018', 'Rajkot, India', 3),
('Siddharth Rao', '9000000019', 'siddharth.rao@example.com', '9000000019', 'Mangalore, India', 4),
('Ritika Aggarwal', '9000000020', 'ritika.aggarwal@example.com', '9000000020', 'Amritsar, India', 5),
('Harshit Yadav', '9000000021', 'harshit.yadav@example.com', '9000000021', 'Patna, India', 1),
('Nandini Das', '9000000022', 'nandini.das@example.com', '9000000022', 'Guwahati, India', 2),
('Ayush Bansal', '9000000023', 'ayush.bansal@example.com', '9000000023', 'Rohtak, India', 3),
('Shruti Pillai', '9000000024', 'shruti.pillai@example.com', '9000000024', 'Panaji, India', 4),
('Devansh Arora', '9000000025', 'devansh.arora@example.com', '9000000025', 'Noida, India', 5),
('Ira Mishra', '9000000026', 'ira.mishra@example.com', '9000000026', 'Gorakhpur, India', 1),
('Kunal Bhatt', '9000000027', 'kunal.bhatt@example.com', '9000000027', 'Dehradun, India', 2),
('Tanvi Sinha', '9000000028', 'tanvi.sinha@example.com', '9000000028', 'Raipur, India', 3),
('Rajeev Menon', '9000000029', 'rajeev.menon@example.com', '9000000029', 'Thiruvananthapuram, India', 4),
('Prerna Kaur', '9000000030', 'prerna.kaur@example.com', '9000000030', 'Chandigarh, India', 5)`
        ,

        `CREATE TABLE IF NOT EXISTS books (
            book_id INT NOT NULL AUTO_INCREMENT,
            title VARCHAR(255) NOT NULL,
            author VARCHAR(100) DEFAULT NULL,
            isbn VARCHAR(30) DEFAULT NULL UNIQUE,
            publisher VARCHAR(100) DEFAULT NULL,
            category_id INT DEFAULT NULL,
            total_copies INT NOT NULL,
            issued_copies INT ,
            image VARCHAR(255) DEFAULT NULL,
            added_on TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (book_id),
            FOREIGN KEY (category_id) REFERENCES categories(category_id)
        )`,

        `INSERT INTO books (title, author, isbn, publisher, category_id, total_copies, issued_copies, image)
VALUES
('Dune', 'Frank Herbert', '9780441013593', 'Ace Books', 1, 10, 2, 'dune.jpg'),
('Pride and Prejudice', 'Jane Austen', '9780141439518', 'Penguin Classics', 2, 15, 5, 'pride.jpg'),
('Sapiens: A Brief History of Humankind', 'Yuval Noah Harari', '9780062316097', 'Harper', 3, 8, 3, 'sapiens.jpg'),
('Steve Jobs', 'Walter Isaacson', '9781451648539', 'Simon & Schuster', 4, 6, 1, 'jobs.jpg'),
('Harry Potter and the Sorcerers Stone', 'J.K. Rowling', '9780439708180', 'Scholastic', 5, 20, 10, 'hp1.jpg'),
('The Hobbit', 'J.R.R. Tolkien', '9780261103344', 'HarperCollins', 6, 10, 4, 'hobbit.jpg'),
('The Da Vinci Code', 'Dan Brown', '9780307474278', 'Doubleday', 7, 12, 6, 'davinci.jpg'),
('Atomic Habits', 'James Clear', '9780735211292', 'Penguin Random House', 8, 18, 7, 'atomic.jpg'),
('Clean Code', 'Robert C. Martin', '9780132350884', 'Prentice Hall', 9, 9, 2, 'cleancode.jpg'),
('Meditations', 'Marcus Aurelius', '9780140449334', 'Penguin Classics', 10, 7, 1, 'meditations.jpg'),
('Enders Game', 'Orson Scott Card', '9780812550702', 'Tor Books', 1, 11, 3, 'enders.jpg'),
('Me Before You', 'Jojo Moyes', '9780143124542', 'Penguin Books', 2, 14, 5, 'mebefore.jpg'),
('Gun"s", Germs, and Steel', 'Jared Diamond', '9780393317558', 'W.W. Norton', 3, 10, 2, 'guns.jpg'),
('Becoming', 'Michelle Obama', '9781524763138', 'Crown Publishing', 4, 13, 4, 'becoming.jpg'),
('The Cat in the Hat', 'Dr. Seuss', '9780394800011', 'Random House', 5, 17, 9, 'catinhat.jpg'),
('The Name of the Wind', 'Patrick Rothfuss', '9780756404741', 'DAW Books', 6, 12, 4, 'namewind.jpg'),
('Gone Girl', 'Gillian Flynn', '9780307588371', 'Crown Publishing', 7, 8, 3, 'gonegirl.jpg'),
('The Power of Now', 'Eckhart Tolle', '9781577314806', 'New World Library', 8, 6, 1, 'powerofnow.jpg'),
('The Pragmatic Programmer', 'Andy Hunt', '9780201616224', 'Addison-Wesley', 9, 7, 1, 'pragmatic.jpg'),
('Beyond Good and Evil', 'Friedrich Nietzsche', '9780140449233', 'Penguin Classics', 10, 5, 0, 'beyond.jpg')`,


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
            FOREIGN KEY (student_id) REFERENCES students(id),
            FOREIGN KEY (issued_by) REFERENCES librarians(id)
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
