//Web framework for handling routing, requests, etc.
const express=require('express');
const path=require('path');
const dotenv=require('dotenv');
const db=require('./config/db.js');
const routes=require('./routes/routes.js');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();

//Initializes the Express app.
const app=express();

        app.use(express.urlencoded({extends:true}));  
        app.set('view engine','ejs');
        app.set('views',path.join(__dirname,'views'));
        app.use(express.static("public"));
        app.use(bodyParser.urlencoded({extends:true}));
        app.use(cors());
        app.use(express.json());
        app.use("/",routes);
        app.use((req,res)=>{
            res.status(404).render('error',{message:'Page Not Found Custom'});
        });

module.exports=app;
