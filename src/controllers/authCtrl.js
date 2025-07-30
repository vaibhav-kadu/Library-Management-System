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
        const passwordHash=await bcrypt.hash(password,saltRound);

        //save Admin
        await authModel.addAdmin(name,contact,email,passwordHash);//password also

        res.status(201).json({message:'Admin Registered SuccessFully'});
        
    }catch(error){
        console.error('Admin Registration Error => ',error);
        res.status(500).json({message:'Internal Server Error'});
    }

};

