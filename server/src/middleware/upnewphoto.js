let empctrl=require("../controllers/empcontroller.js");
let empmodel=require("../models/empmodel.js");
let multer=require("multer");
let path=require("path");
let db=require("../../db.js");

const storage2=multer.diskStorage({
        destination:(req,file,cb)=>{
            cb(null,"public/images");
        },
        filename:async (req,file,cb)=>{
            const eid = req.body.eid;
            db.query("SELECT photo FROM emp WHERE eid = ?", [eid], (err, result) => {
                    if (err) {
                        return cb(err, null);
                    }

                    if (result.length === 0) {
                        return cb(new Error("Employee not found"), null);
                    }

                    const oldPhotoName = result[0].photo;
                   
                    const newFilename = oldPhotoName;

                    cb(null, newFilename);
                });
        }
    });
let upload2=multer({storage:storage2});

module.exports=upload2;
