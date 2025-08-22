let express=require("express");
let authMiddleware=require('../middleware/authMiddleware.js')
let authctrl=require("../controllers/authCtrl.js");
let catCtrl=require('../controllers/categoryCtrl.js');
let bookCtrl=require('../controllers/bookCtrl.js');
let libCtrl = require("../controllers/librarianCtrl.js"); 
let transCtrl = require('../controllers/transactionCtrl.js');
let upload=require("../middleware/fileupload.js");
let upload2=require("../middleware/upnewphoto.js");

let routes=express.Router();
console.log("Router Started");
routes.get("/verify",authMiddleware.verifyUser,authctrl.verify);


//Admin
routes.post("/registerAdmin",authctrl.registerAdmin);
routes.post('/loginAdmin',authctrl.loginAdmin);
routes.put('/updateAdmin',authctrl.updateAdmin);



//Students
routes.post('/loginStudent',authctrl.loginStudent);
routes.post('/addStudent',authctrl.addStudent);
routes.get('/getStudents',authctrl.getStudents); 
//routes.get('/getStudentsBy',authctrl.getStudentsBy);  //By id , Email
routes.put('/updateStudent',authctrl.updateStudent);
routes.delete('/deleteStudent',authctrl.deleteStudent);

//Category
routes.post('/addCategory',catCtrl.addCategory);
routes.get("/getCategory",catCtrl.getCategory);
routes.put("/updateCategory",catCtrl.updateCategory);
routes.delete("/deleteCategory",catCtrl.deleteCategory);

//Librarian
routes.post('/loginLibrarian',libCtrl.loginLibrarian);
routes.post("/addLibrarian",libCtrl.addLibrarian);
routes.get("/getLibrarian",libCtrl.getLibrarian);
routes.put("/updateLibrarian", libCtrl.updateLibrarian);
routes.delete("/deleteLibrarian",libCtrl.deleteLibrarian);

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