//This imports the mysql2 library. It allows you to interact with MySQL databases.
const mysql=require('mysql2');

//This line loads environment variables from a .env file into process.env.
require('dotenv').config();

//Here, you're creating a new MySQL database connection using credentials pulled from environment variables
const db=mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME
});

//Establish the database connection.
db.connect(err=>{
    if(err) throw err;
    console.log("DATABASE CONNECTED...");
});


//This exports the db object so that it can be reused in other parts of your application
module.exports=db;
