const db = require('../config/db.js');

// Create
exports.addTransaction = (book_id, student_id, issued_by, due_date) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO transactions (book_id, student_id, issued_by, due_date) VALUES (?, ?, ?, ?)`;
        db.query(sql, [book_id, student_id, issued_by, due_date], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Read All
exports.getAllTransactions = () => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM transactions`, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Read One
exports.getTransactionById = (transaction_id) => {
    return new Promise((resolve, reject) => {
        db.query(`SELECT * FROM transactions WHERE transaction_id = ?`, [transaction_id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Update

exports.updateTransaction = (transaction_id, return_date, status, fine) => {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE transactions SET return_date=?, status=?, fine=? WHERE transaction_id=?`;
        db.query(sql, [return_date, status, fine, transaction_id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};


// Delete
exports.deleteTransaction = (transaction_id) => {
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM transactions WHERE transaction_id = ?`, [transaction_id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};