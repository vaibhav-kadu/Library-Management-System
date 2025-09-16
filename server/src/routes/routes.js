let express = require("express");
let routes=express.Router();
let authMiddleware = require('../middleware/authMiddleware.js');
let authctrl = require("../controllers/authCtrl.js");
let adminCtrl = require('../controllers/adminCtrl.js');
let libCtrl = require("../controllers/librarianCtrl.js"); 
const studentCtrl = require('../controllers/studentCtrl.js');
let catCtrl = require('../controllers/categoryCtrl.js');
let bookCtrl = require('../controllers/bookCtrl.js');
let transCtrl = require('../controllers/transactionCtrl.js');
let upload = require("../middleware/fileupload.js");
let upload2 = require("../middleware/upnewphoto.js");



// ---------------- Authentication ----------------
routes.get('/verify', authMiddleware.verifyUser, authctrl.verify);
routes.post('/loginAdmin', authctrl.loginAdmin);
routes.post('/loginLibrarian', authctrl.loginLibrarian);
routes.post('/loginStudent', authctrl.loginStudent);

// ---------------- Admin ----------------
routes.post("/registerAdmin", adminCtrl.registerAdmin);
routes.put('/updateAdmin', adminCtrl.updateAdmin);
routes.get('/getAdminByEmail', adminCtrl.getAdminByEmail);
routes.get('/getAdminById', adminCtrl.getAdminById);

// ---------------- Librarian ----------------
// ✅ librarian signup with image
routes.post("/addLibrarian",  upload.single('profileImage'),  libCtrl.addLibrarian);
routes.put("/updateLibrarian", upload.single('profileImage'), libCtrl.updateLibrarian);
routes.get("/getLibrarian", libCtrl.getLibrarian);
routes.get("/getLibrarianById", libCtrl.getLibrarianById);
routes.get("/getLibrarianEmail", libCtrl.getLibrarianByEmail);
routes.delete("/deleteLibrarian", libCtrl.deleteLibrarian);

// ---------------- Students ----------------
// ✅ student signup with image
routes.post('/addStudent',  upload.single('profileImage'),  studentCtrl.addStudent);
routes.put('/updateStudent/:sid',  upload.single('profileImage'),  studentCtrl.updateStudent);
routes.put('/verifyStudent', studentCtrl.verifyStudent);
routes.get('/getStudents', studentCtrl.getStudents); 
routes.get('/getStudentByEmail', studentCtrl.getStudentByEmail);
routes.get('/getStudentById', studentCtrl.getStudentById);
routes.delete('/deleteStudent/:sid', studentCtrl.deleteStudent);


// ---------------- Category ----------------
routes.post('/addCategory', catCtrl.addCategory);
routes.get("/getCategory", catCtrl.getCategory);
routes.get("/categories", catCtrl.getCategoriesForDropdown);
routes.put("/updateCategory", catCtrl.updateCategory);
routes.delete("/deleteCategory", catCtrl.deleteCategory);


// ---------------- Books ----------------
routes.post('/addBook', upload.single('bookImage'), bookCtrl.addBook);
routes.put('/updateBook/:bookId', upload.single('bookImage'), bookCtrl.updateBook);
routes.get('/getBooks', bookCtrl.getAllBooks);
routes.get('/getBookById', bookCtrl.getBookBy);
routes.get('/getBooksByCategoryId', bookCtrl.getBooksByCategory);
routes.delete('/deleteBook', bookCtrl.deleteBook);

// ---------------- Transactions ----------------
routes.post('/borrowBook', transCtrl.addTransaction);
routes.get('/getAllTransactions', transCtrl.getAllTransactions);
routes.put('/issueBook', transCtrl.issueBook);
routes.put('/returnBook', transCtrl.returnBook);
routes.put('/updateTransaction', transCtrl.updateTransaction);
routes.delete('/deleteTransaction', transCtrl.deleteTransaction);
routes.get('/getTransactionsByStudent/:sid', transCtrl.getTransactionsByStudent);

module.exports = routes;
