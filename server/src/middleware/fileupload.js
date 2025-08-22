const db=require('../config/db.js');
let multer=require("multer");
let path=require("path");
const storage=multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,"public/images");
        },
        filename:(req,file,cb)=>{
            const crypto = require("crypto");
            const ext = path.extname(file.originalname); // e.g., '.jpg'
            const randomStr = crypto.randomBytes(6).toString("hex"); // 12-char hex string
            const filename = `${Date.now()}-${randomStr}${ext}`;
            cb(null,filename);
        }
    });
let upload=multer({storage:storage});


module.exports=upload;