const bcrypt=require('bcrypt');
const authModel=require('../models/authModel.js');
const jwt=require("jsonwebtoken")



exports.verify = (req,res)=>{
    return res.status(200).json({success:true,user:req.user})
}

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

exports.loginAdmin=(req,res)=>{
    const {password,email}=req.body;

    let promise=authModel.findAdminByEmail(email);
        promise.then(async (results)=>{
            if(!results[0]) res.status(404).json({success: false,error:"Admin Not Found"})
                
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
                                user:{id:results[0].id, name: results[0].name, role:"admin"},
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

exports.updateAdmin=async(req,res)=>{
    const{id,name,contact,email,password}=req.body;

    const promise=authModel.updateAdmin(id,name,contact,email,password);
            promise.then((result)=>{
                res.status(200).json({message:result});
            });

            promise.catch((err)=>{
                res.status(500).json({message:err});
            });
};



exports.addStudent= async(req,res)=>{
    let {name,contact,email,password,address,id}=req.body;

    const existEmail=await authModel.findStudentByEmail(email);

        if(existEmail){
            return res.status(400).json({message:'Email Already Exist'});
        }

    let promise=authModel.addStudent(name,contact,email,password,address,id);
        promise.then((result)=>{
            res.status(201).json({message:'Student Register Successfully'});
        });

        promise.catch((err)=>{
            res.status(500).json({message:'Internal Server Error = '+err});
        });  

};

exports.loginStudent = (req, res) => {
  const { password, email } = req.body;

  let promise = authModel.findStudentByEmail(email);
  promise.then(async (results) => {
    if (!results[0]) {
      return res.status(404).json({ success: false, error: "User Not Found" }); // ✅ added return
    }

    if (password === results[0].password) {
      const token = jwt.sign(
        { email: results[0].email },
        process.env.JWT_KEY,
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        success: true,
        token,
        user: { id: results[0].id, name: results[0].name, role: "student" },
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
    let {id,name,contact,email,password,address}=req.body;

    let promise=authModel.updateStudent(id,name,contact,email,password,address);
        promise.then((result)=>{
            res.status(200).json({message:'Update Successfully'});
        });
        promise.catch((err)=>{
            res.status(500).json({message:'Internal Server Error = '+err});
        });
};

exports.deleteStudent=(req,res)=>{
    const {id}=req.body;
    let promise=authModel.deleteStudent(id);
        promise.then((result)=>{
            res.status(200).json({message:'Student Deleted'});
        });
        promise.catch((err)=>{
            res.status(500).json({message:'Internal Server Error = '+err});
        });
};



