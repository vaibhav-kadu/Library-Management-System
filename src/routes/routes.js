let express=require("express");
let authctrl=require("../controllers/authCtrl.js");
let catCtrl=require('../controllers/categoryCtrl.js');

let routes=express.Router();
console.log("Router Started");
routes.get("/",authctrl.landingPage);
routes.post("/registerAdmin",authctrl.registerAdmin);
routes.post('/addCategory',catCtrl.addCategory);


module.exports=routes;