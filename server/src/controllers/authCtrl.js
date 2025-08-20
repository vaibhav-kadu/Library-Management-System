const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const authModel=require('../models/authModel.js');

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
        
        const {password,email}=req.body.formData.admin;

        const admin= await authModel.findAdminByEmail(email);
                if(admin){                    
                        if(password===admin.password){
                            const token = jwt.sign(
                                {email:admin.email},
                                process.env.JWT_KEY, 
                                { expiresIn: '1h' }
                            );

                            res
                            .status(200)
                            .json({
                                success: true, 
                                token, 
                                user:{id:admin.admin_id, name: admin.name, role:"admin"},
                                message:"Login Success"
                            });

                        }else{
                            res.status(400).json({ success: false, error:"Incorrect Password" });
                        }

                }else {
                    res.status(404).json({  success: false, error: "Admin not found with this email" });
                }
    }catch(error){
        res.status(500).json({success:false, error: error.message});
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

exports.loginStudent=(req,res)=>{
    const {password,email}=req.body.formData.student;

    let promise=authModel.getStudentsBy(email);
        promise.then(async (results)=>{
            if(!results[0]) res.status(404).json({success: false,error:"User Not Found"})
                
            //const isMatch = await bcrypt.compare(password, results[0].password)
            //if(!isMatch){res.status(404).json({success: false, error:"Wrong Password"})}
            if(password===results[0].password){ // isMatch
                            const token = jwt.sign(
                                {email:results[0].email},
                                process.env.JWT_KEY, 
                                { expiresIn: '1h' }
                            );

                            res
                            .status(200)
                            .json({
                                success: true, 
                                token, 
                                user:{id:results[0].student_id, name: results[0].name, role:"student"},
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

exports.getStudents=(req,res)=>{
    let promise=authModel.getStudents();
        promise.then((result)=>{
            res.status(200).json({message:result});
        });
        promise.catch((err)=>{
            res.status(500).json({message:'Internal Server Error = '+err});
        });
}

exports.getStudentsBy=(req,res)=>{
    let {input}=req.body;
    let promise=authModel.getStudentsBy(input);
        promise.then((results)=>{
            res.status(202).json(results);
        });
        promise.catch((err)=>{
            res.status(404).json({message:err});
        });
};

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



