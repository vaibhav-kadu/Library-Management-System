let express=require("express");
let authctrl=require("../controllers/authCtrl.js");
let catCtrl=require('../controllers/categoryCtrl.js');

let routes=express.Router();
console.log("Router Started");
routes.get("/",authctrl.landingPage);

//Admin
routes.post("/registerAdmin",authctrl.registerAdmin);
routes.get("/getAdmin",authctrl.getAdmin);
routes.put('/updateAdmin',authctrl.updateAdmin);

//Category
routes.post('/addCategory',catCtrl.addCategory);
routes.get("/getCategory",catCtrl.getCategory);
routes.put("/updateCategory",catCtrl.updateCategory);
routes.delete("/deleteCategory",catCtrl.deleteCategory);


module.exports=routes;