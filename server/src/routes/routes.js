let express=require("express");
const path = require('path');
let authMiddleware=require('../middleware/authMiddleware.js')
let authctrl=require("../controllers/authCtrl.js");
let adminCtrl=require('../controllers/adminCtrl.js')
let libCtrl = require("../controllers/librarianCtrl.js"); 
const studentCtrl=require('../controllers/studentCtrl.js')
let catCtrl=require('../controllers/categoryCtrl.js');
let bookCtrl=require('../controllers/bookCtrl.js');
let transCtrl = require('../controllers/transactionCtrl.js');
let upload=require("../middleware/fileupload.js");
let upload2=require("../middleware/upnewphoto.js");

let routes=express.Router();

//Authentication Routes
routes.get("/verify",authMiddleware.verifyUser,authctrl.verify);
routes.post('/loginAdmin',authctrl.loginAdmin);
routes.post('/loginLibrarian',authctrl.loginLibrarian);
routes.post('/loginStudent',authctrl.loginStudent);

//Admin
routes.post("/registerAdmin",adminCtrl.registerAdmin);
routes.put('/updateAdmin',adminCtrl.updateAdmin);
routes.get('/getAdminByEmail',adminCtrl.getAdminByEmail);
routes.get('/getAdminById',adminCtrl.getAdminById);

//Librarian
routes.post("/addLibrarian",libCtrl.addLibrarian);
routes.get("/getLibrarian",libCtrl.getLibrarian);
routes.get("/getLibrarianById",libCtrl.getLibrarianById);
routes.get("/getLibrarianEmail",libCtrl.getLibrarianByEmail);
routes.put("/updateLibrarian", libCtrl.updateLibrarian);
routes.delete("/deleteLibrarian",libCtrl.deleteLibrarian);

//Students
routes.post('/addStudent',studentCtrl.addStudent);
routes.get('/getStudents',studentCtrl.getStudents); 
routes.get('/getStudentByEmail',studentCtrl.getStudentByEmail);
routes.get('/getStudentById',studentCtrl.getStudentById);
routes.put('/updateStudent',studentCtrl.updateStudent);
routes.delete('/deleteStudent',studentCtrl.deleteStudent);

//Category
routes.post('/addCategory',catCtrl.addCategory);
routes.get("/getCategory",catCtrl.getCategory);
routes.put("/updateCategory",catCtrl.updateCategory);
routes.delete("/deleteCategory",catCtrl.deleteCategory);

//Books 
routes.post('/addBook',upload.single("profilephoto"),bookCtrl.addBook);
routes.get('/getAllBooks',bookCtrl.getAllBooks);
routes.get('/getBookBy',bookCtrl.getBookBy);  // Category_id or Title
routes.put('/updateBook',upload2.single("profilephoto"),bookCtrl.updateBook);
routes.delete('/deleteBook',bookCtrl.deleteBook);

//Transactions
routes.post('/addTransaction', transCtrl.addTransaction);
routes.get('/getAllTransactions', transCtrl.getAllTransactions);
routes.post('/getTransactionById', transCtrl.getTransactionById); // or use :id param
routes.put('/updateTransaction', transCtrl.updateTransaction);
routes.delete('/deleteTransaction', transCtrl.deleteTransaction);

/*


*/

module.exports=routes;