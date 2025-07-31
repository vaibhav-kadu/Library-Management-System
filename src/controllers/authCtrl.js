const bcrypt=require('bcrypt');
const authModel=require('../models/authModel.js');

exports.landingPage=(req,res)=>{
    console.log("Login ctrl");
};

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

