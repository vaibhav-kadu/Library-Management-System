const transactionModel = require('../models/transactionModel.js');

// Add Transaction
exports.addTransaction = (req, res) => {
    const { book_id, sid} = req.body;
    transactionModel.addTransaction(book_id, sid)
        .then(result => res.status(201).json({success:true, message: 'Transaction Created', result }))
        .catch(err => res.status(500).json({success:false,  message: 'Error Creating Transaction', error: err }));
};

// Get All Transactions
exports.getAllTransactions = (req, res) => {
    transactionModel.getAllTransactions()
        .then(result => res.status(200).json({success:true,result}))
        .catch(err => res.status(500).json({success:false, message: 'Error Fetching Transactions', error: err }));
};

// Issue Book
exports.issueBook = (req, res) => {
  const { lid, transaction_id } = req.body;
  const issue_date = new Date().toISOString().slice(0, 19).replace('T', ' '); // current datetime

  transactionModel.issueBook(lid,issue_date, transaction_id)
    .then(result => res.status(200).json({ success: true, result }))
    .catch(err => res.status(404).json({ success: false, message: 'Transaction Not Found', error: err }));
};

// Return Book
exports.returnBook = (req, res) => {
  const { lid, transaction_id } = req.body;
  const return_date = new Date().toISOString().slice(0, 19).replace('T', ' '); // current datetime

  transactionModel.returnBook(lid, return_date, transaction_id)
    .then(result => res.status(200).json({ success: true, result }))
    .catch(err => res.status(404).json({ success: false, message: 'Transaction Not Found', error: err }));
};


// Update Transaction


exports.updateTransaction = async (req, res) => {
    try {
        const { transaction_id } = req.body;

        if (!transaction_id) {
            return res.status(400).json({ message: "transaction_id is required" });
        }

        const returnDate = new Date();
        const transaction = await transactionModel.getTransactionById(transaction_id);

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        const dueDate = new Date(transaction.due_date);
        const dueDateOnly = new Date(dueDate.getFullYear(), dueDate.getMonth(), dueDate.getDate());
        const returnDateOnly = new Date(returnDate.getFullYear(), returnDate.getMonth(), returnDate.getDate());

        let fine = 0;
        const status = 'returned';
console.log(returnDateOnly+"   =  "+dueDate);
        if (returnDateOnly > dueDateOnly) {
            fine = 200;
        }

        const formattedReturnDate = returnDate.toISOString().slice(0, 10);

        await transactionModel.updateTransaction(
            transaction_id,
            formattedReturnDate,
            status,
            fine
        );

        res.status(200).json({
            message: "Transaction Updated",
            transaction_id,
            return_date: formattedReturnDate,
            status,
            fine
        });

    } catch (error) {
        console.error("Transaction Update Error:", error);
        res.status(500).json({ message: "Internal Server Error", error });
    }
};


// Delete Transaction
exports.deleteTransaction = (req, res) => {
    const { transaction_id } = req.body;
    transactionModel.deleteTransaction(transaction_id)
        .then(result => res.status(200).json({ message: 'Transaction Deleted', result }))
        .catch(err => res.status(500).json({ message: 'Delete Failed', error: err }));
};