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
routes.post('/updateStudent',  upload.single('profileImage'),  studentCtrl.updateStudent);
routes.post('/verifyStudent', studentCtrl.verifyStudent);
routes.get('/getStudents', studentCtrl.getStudents); 
routes.get('/getStudentByEmail', studentCtrl.getStudentByEmail);
routes.get('/getStudentById', studentCtrl.getStudentById);
routes.delete('/deleteStudent', studentCtrl.deleteStudent);

// ---------------- Category ----------------
routes.post('/addCategory', catCtrl.addCategory);
routes.get("/getCategory", catCtrl.getCategory);
routes.get("/categories", catCtrl.getCategoriesForDropdown);
routes.put("/updateCategory/:categoryId", catCtrl.updateCategory);
routes.delete("/deleteCategory/:id", catCtrl.deleteCategory);


// ---------------- Books ----------------
routes.post('/addBook', upload.single('image'), bookCtrl.addBook);
routes.get('/getBooks', bookCtrl.getAllBooks);
routes.get('/getBookBy', bookCtrl.getBookBy);
routes.put('/updateBook', upload2.single("profilephoto"), bookCtrl.updateBook);
routes.delete('/deleteBook', bookCtrl.deleteBook);

// ---------------- Transactions ----------------
routes.post('/addTransaction', transCtrl.addTransaction);
routes.get('/getAllTransactions', transCtrl.getAllTransactions);
routes.post('/getTransactionById', transCtrl.getTransactionById);
routes.put('/updateTransaction', transCtrl.updateTransaction);
routes.delete('/deleteTransaction', transCtrl.deleteTransaction);

module.exports = routes;
