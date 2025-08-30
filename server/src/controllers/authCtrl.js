const bcrypt=require('bcrypt');
const studentModel=require('../models/studentModel.js');
const libmodel = require("../models/librarianModel.js");
const adminModel=require('../models/adminModel.js')
const jwt=require("jsonwebtoken")



exports.verify = (req,res)=>{
    if(!req.user){
        return res.status(401).json({ success: false, error: "Unauthorized" })
    }

    // Ensure role is sent back
    return res.status(200).json({
        success: true,
        user: {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role   // ✅ make sure role is included
        }
    })
}

// ADMIN Login
exports.loginAdmin=(req,res)=>{
    const {password,email}=req.body;

    let promise=adminModel.findAdminByEmail(email);
        promise.then(async (result)=>{
            if(!result) res.status(404).json({success: false,error:"Admin Not Found"})
                
            //const isMatch = await bcrypt.compare(password, results[0].password)
            //if(!isMatch){res.status(404).json({success: false, error:"Wrong Password"})}
            if(password==result.password){ // isMatch
                            const token = jwt.sign(
                                {id: result.id, role:"admin"},
                                process.env.JWT_KEY, 
                                { expiresIn: '1h' }
                            );

                            res
                            .status(200)
                            .json({
                                success: true,
                                token, 
                                user:{id:result.id, name: result.name, role:"admin"},
                                message:"Login Success"
                            });

                        }else{
                            res.status(400).json({ success: false, error:"Incorrect Password" });
                        }
            //res.status(202).json(results);
        });
        promise.catch((err)=>{
            res.status(404).json({message:err});
        });
};

//Librarian
exports.loginLibrarian=(req,res)=>{
    const {password,email}=req.body;
    let promise=libmodel.findLibrarianByEmail(email);
        promise.then((result)=>{
            
            if(password==result.password){
                            const token = jwt.sign(
                                {id: result.id,role:"librarian"},
                                process.env.JWT_KEY, 
                                { expiresIn: '1h' }
                            );

                            res
                            .status(200)
                            .json({
                                success: true, 
                                token, 
                                user:{id:result.id, name: result.name, role:"librarian"},
                                message:"Login Success"
                            });

                        }else{
                            res.status(400).json({ success: false, error:"Incorrect Password" });
                        }
            //res.status(202).json(results);
        });
        promise.catch((err)=>{
            res.status(404).json({message:err});
        });
};

//Student Login
exports.loginStudent = (req, res) => {
  const { password, email } = req.body;

  let promise = studentModel.findStudentByEmail(email);
  promise.then(async (result) => {
    if (!result) {
      return res.status(404).json({ success: false, error: "User Not Found" }); // ✅ added return
    }

    if (password == result.password) {
      const token = jwt.sign(
        { id: result.id, role: "student"},
        process.env.JWT_KEY,
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        success: true,
        token,
        user: { id: result.id, name: result.name, role: "student" },
        message: "Login Success"
      });
    } else {
      return res.status(400).json({ success: false, error: "Incorrect Password" });
    }
  });

  promise.catch((err) => {
    res.status(500).json({ success: false, message: "Server error", error: err });
  });
};






