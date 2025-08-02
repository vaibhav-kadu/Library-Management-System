let express=require("express");
let authctrl=require("../controllers/authCtrl.js");
let catCtrl=require('../controllers/categoryCtrl.js');
let bookCtrl=require('../controllers/bookCtrl.js');
let libCtrl = require("../controllers/librarianCtrl.js"); 

let routes=express.Router();
console.log("Router Started");
routes.get("/",authctrl.landingPage);

//Admin
routes.post("/registerAdmin",authctrl.registerAdmin);
routes.get("/getAdmin",authctrl.getAdmin);
routes.put('/updateAdmin',authctrl.updateAdmin);



//Students
routes.post('/addStudent',authctrl.addStudent);
routes.get('/getStudents',authctrl.getStudents);
routes.put('/updateStudent',authctrl.updateStudent);
routes.delete('/deleteStudent',authctrl.deleteStudent);

//Category
routes.post('/addCategory',catCtrl.addCategory);
routes.get("/getCategory",catCtrl.getCategory);
routes.put("/updateCategory",catCtrl.updateCategory);
routes.delete("/deleteCategory",catCtrl.deleteCategory);

//Librarian
routes.post("/addLibrarian",libCtrl.addLibrarian);

//Books
routes.post('/addBook',bookCtrl.addBook);
routes.get('/getBooks',bookCtrl.getBooks);
routes.get('/getBookBy',bookCtrl.getBookBy);  // Category_id or Title
routes.put('/updateBook',bookCtrl.updateBook);
routes.delete('/deleteBook',bookCtrl.deleteBook);


/*



*/

module.exports=routes;