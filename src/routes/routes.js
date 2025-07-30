let express=require("express");
let authctrl=require("../controllers/authCtrl.js");

let routes=express.Router();
console.log("Router Started");
routes.get("/",authctrl.login);


module.exports=routes;