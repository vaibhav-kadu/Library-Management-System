const db = require('../config/db.js');

// Create
exports.addTransaction = (book_id, sid) => {
    return new Promise((resolve, reject) => {
        // Step 1: Insert into transactions
        const insertSql = `INSERT INTO transactions (book_id, sid) VALUES (?, ?)`;
        db.query(insertSql, [book_id, sid], (err, result) => {
            if (err) return reject(err);

            // Step 2: Update issued_copies for that book
            const updateSql = `UPDATE books 
                               SET issued_copies = IFNULL(issued_copies, 0) + 1 
                               WHERE book_id = ?`;
            db.query(updateSql, [book_id], (updateErr, updateResult) => {
                if (updateErr) return reject(updateErr);

                // Combine both results
                resolve({
                    transaction: result,
                    book_update: updateResult
                });
            });
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
exports.returnBook = (lid, return_date, transaction_id) => {
    return new Promise((resolve, reject) => {
        // Step 1: Update the transaction to returned
        const updateTxnSql = `
            UPDATE transactions 
            SET return_to = ?, return_date = ?, status = ? 
            WHERE transaction_id = ?
        `;
        db.query(updateTxnSql, [lid, return_date, 'returned', transaction_id], (err, result) => {
            if (err) return reject(err);

            if (result.affectedRows === 0) {
                return reject(new Error("Transaction not found"));
            }

            // Step 2: Get the book_id for that transaction
            const getBookSql = `SELECT book_id FROM transactions WHERE transaction_id = ?`;
            db.query(getBookSql, [transaction_id], (bookErr, bookResult) => {
                if (bookErr) return reject(bookErr);

                if (bookResult.length === 0) {
                    return reject(new Error("Book not found for transaction"));
                }

                const book_id = bookResult[0].book_id;

                // Step 3: Decrease issued_copies by 1
                const updateBookSql = `
                    UPDATE books 
                    SET issued_copies = IF(issued_copies > 0, issued_copies - 1, 0) 
                    WHERE book_id = ?
                `;
                db.query(updateBookSql, [book_id], (updateBookErr, updateBookResult) => {
                    if (updateBookErr) return reject(updateBookErr);

                    resolve({
                        transaction: result,
                        book_update: updateBookResult
                    });
                });
            });
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



// Get all transactions for a given student
exports.getTransactionsByStudent = async (sid) => {
  try {
    const [rows] = await db.execute(
      `SELECT t.transaction_id, t.book_id, t.sid, t.issued_by, t.issue_date, t.due_date,
              t.return_to, t.return_date, t.status, t.fine,
              b.title AS book_title, b.author AS book_author
       FROM transactions t
       LEFT JOIN books b ON t.book_id = b.book_id
       WHERE t.sid = ? 
       ORDER BY t.issue_date DESC`,
      [sid]
    );
    return rows;
  } catch (err) {
    console.error("Error in getTransactionsByStudent:", err);
    throw err;
  }
};

