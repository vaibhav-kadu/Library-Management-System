const db = require('../config/db.js');

// Create
exports.addTransaction = (book_id, sid) => {
    return new Promise((resolve, reject) => {
        const sql = `INSERT INTO transactions (book_id, sid) VALUES (?, ?)`;
        db.query(sql, [book_id, sid], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Read All Transactions with Joins
exports.getAllTransactions = () => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        t.transaction_id, s.name AS student_name,s.sid, b.title AS book_name, b.book_id, l1.name AS issued_by,
        l1.lid As issue_lid,t.issue_date, t.due_date, l2.name AS return_to, l2.lid As return_lid, t.return_date, t.status,  t.fine
      FROM transactions t
      INNER JOIN students s ON t.sid = s.sid
      INNER JOIN books b ON t.book_id = b.book_id
      LEFT JOIN librarians l1 ON t.issued_by = l1.lid
      LEFT JOIN librarians l2 ON t.return_to = l2.lid
      ORDER BY t.transaction_id DESC
    `;
    db.query(sql, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};


// Issue Book
exports.issueBook = (lid,issue_date, due_date, transaction_id) => {
    return new Promise((resolve, reject) => {
        db.query(`UPDATE transactions SET issued_by=?, issue_date=?, due_date = ?, status=? WHERE transaction_id = ?`, [lid,issue_date, due_date,'issued',transaction_id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

// Return Book
exports.returnBook = (lid,return_date,transaction_id) => {
    return new Promise((resolve, reject) => {
        db.query(`UPDATE transactions SET return_to=?, return_date=?, status=? WHERE transaction_id = ?`, [lid,return_date,'returned',transaction_id], (err, result) => {
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