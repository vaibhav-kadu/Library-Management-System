//Web framework for handling routing, requests, etc.
const express=require('express');
const path=require('path');
const dotenv=require('dotenv');
const db=require('./config/db.js');
const routes=require('./routes/routes.js');
const bodyParser = require('body-parser');

require('dotenv').config();

//Initializes the Express app.
const app=express();

        app.use(express.urlencoded({extends:true}));
        app.use(bodyParser.urlencoded({extends:true}));
        app.use(express.json());
        app.use(express.static('public'));
        app.set('views',path.join('/views','views'));
        app.set('view engine','ejs');
        app.use('/',routes);
        app.use((req,res)=>{
            res.status(404).render('error',{message:'Page Not Found Custom'});
        });


module.exports=app;
