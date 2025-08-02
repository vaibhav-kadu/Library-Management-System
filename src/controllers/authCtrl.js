const bcrypt=require('bcrypt');
const authModel=require('../models/authModel.js');

exports.landingPage=(req,res)=>{
    
    console.log("Landing ctrl");
    res.render("landingpage.ejs");
};


// ADMIN

exports.registerAdmin= async(req,res)=>{
    try{
        const {name,contact,email,password}=req.body;
        const emailExist= await authModel.findAdminByEmail(email);
            if(emailExist){
                return res.status(400).json({message:'Admin Already Registered'});
            }

        const saltRound=10;
        //const passwordHash=await bcrypt.hash(password,saltRound);
        //save Admin
        await authModel.addAdmin(name,contact,email,password);//password also

        res.status(201).json({message:'Admin Registered SuccessFully'});
        
    }catch(error){
        console.error('Admin Registration Error => ',error);
        res.status(500).json({message:'Internal Server Error'});
    }
};

exports.getAdmin=async (req,res)=>{
    try{
        const {email}=req.body;

        const emailExist= await authModel.findAdminByEmail(email);
                if(emailExist){
                    const{email,password}=emailExist;
                    
                        if(req.body.password===password){
                            res.status(200).json({message:"Login Success" });
                        }else{
                            res.status(400).json({message:"Incorrect Password" });
                        }

                }else {
                    console.log("No admin found with that email.");
                    res.status(404).json({ message: "Admin not found" });
                }
    }catch(error){
        console.log(error);
        res.status(500).json({message:'Internal Server Error'});
    }

};

exports.updateAdmin=async(req,res)=>{
    const{admin_id,name,contact,email,password}=req.body;

    const promise=authModel.updateAdmin(admin_id,name,contact,email,password);
            promise.then((result)=>{
                res.status(200).json({message:result});
            });

            promise.catch((err)=>{
                res.status(500).json({message:err});
            });
};




/*
API of Students CRUD Operation done
    1.Add Student (POST)
    2.View Students (GET)
    3.Update Student (PUT)
    4.Delete Students (DELETE)
    */

//Students Controller

exports.addStudent= async(req,res)=>{
    let {name,contact,email,password,address,librarian_id}=req.body;

    const existEmail=await authModel.findStudentByEmail(email);

        if(existEmail){
            return res.status(400).json({message:'Email Already Exist'});
        }

    let promise=authModel.addStudent(name,contact,email,password,address,librarian_id);
        promise.then((result)=>{
            res.status(201).json({message:'Student Register Successfully'});
        });

        promise.catch((err)=>{
            res.status(500).json({message:'Internal Server Error = '+err});
        });  

};

exports.getStudents=(req,res)=>{
    let promise=authModel.getStudents();
        promise.then((result)=>{
            res.status(200).json({message:result});
        });
        promise.catch((err)=>{
            res.status(500).json({message:'Internal Server Error = '+err});
        });
}

exports.updateStudent=(req,res)=>{
    let {student_id,name,contact,email,password,address}=req.body;

    let promise=authModel.updateStudent(student_id,name,contact,email,password,address);
        promise.then((result)=>{
            res.status(200).json({message:'Update Successfully'});
        });
        promise.catch((err)=>{
            res.status(500).json({message:'Internal Server Error = '+err});
        });
};

exports.deleteStudent=(req,res)=>{
    const {student_id}=req.body;
    let promise=authModel.deleteStudent(student_id);
        promise.then((result)=>{
            res.status(200).json({message:'Student Deleted'});
        });
        promise.catch((err)=>{
            res.status(500).json({message:'Internal Server Error = '+err});
        });
};



