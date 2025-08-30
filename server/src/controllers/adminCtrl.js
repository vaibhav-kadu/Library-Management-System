const bcrypt=require('bcrypt');
const adminModel=require('../models/adminModel');


// ADMIN

exports.registerAdmin= async(req,res)=>{
    try{
        const {name,contact,email,password}=req.body;
        const emailExist= await adminModel.findAdminByEmail(email);
            if(emailExist){
                return res.status(400).json({message:'Admin Already Registered'});
            }

        const saltRound=10;
        //const passwordHash=await bcrypt.hash(password,saltRound);
        //save Admin
        await adminModel.addAdmin(name,contact,email,password);//password also

        res.status(201).json({message:'Admin Registered SuccessFully'});
        
    }catch(error){
        console.error('Admin Registration Error => ',error);
        res.status(500).json({message:'Internal Server Error'});
    }
};

exports.getAdminByEmail=(req,res)=>{
    const {email}=req.body;
    let promise = adminModel.findAdminByEmail(email);
     promise.then((result)=>{
            res.status(302).json({message:result});//,msg:msg
        }).catch((err)=>{
            res.status(404).json({message:err});
        });
}

exports.getAdminById=(req,res)=>{
    const {id}=req.body;
    let promise = adminModel.findAdminById(id);
     promise.then((result)=>{
            res.status(302).json({message:result});//,msg:msg
        }).catch((err)=>{
            res.status(404).json({message:err});
        });
}


exports.updateAdmin=async(req,res)=>{
    const{id,name,contact,email,password}=req.body;

    const promise=adminModel.updateAdmin(id,name,contact,email,password);
            promise.then((result)=>{
                res.status(200).json({message:result});
            });

            promise.catch((err)=>{
                res.status(500).json({message:err});
            });
};


