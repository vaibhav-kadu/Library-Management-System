const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const libmodel = require("../models/librarianModel.js");

exports.addLibrarian=async(req,res)=>{

    try{
        const {name,contact,email,password}=req.body;
        console.log({name,contact,email,password});
        
        const checkExist= await libmodel.findLibrarianByEmail(email);
            if(checkExist){
                    return res.status(400).json({message:'Librarians Already Added'});
            }
        //save Librarians
        await libmodel.addLibrarian(name,contact,email,password);
    
        res.status(201).json({message:'Librarians Added SuccessFully',librarian:{name,contact,email}});
            
    }catch(error){
        console.error('Librarians Not Add  Error => ',error);
        res.status(500).json({message:'Internal Server Error'});
    }

}

exports.loginLibrarian=(req,res)=>{
    const {password,email}=req.body.formData.librarian;

    let promise=libmodel.findLibrarianByEmail(email);
        promise.then((result)=>{

            if(password===result.password){
                            const token = jwt.sign(
                                {email:result.email},
                                process.env.JWT_KEY, 
                                { expiresIn: '1h' }
                            );

                            res
                            .status(200)
                            .json({
                                success: true, 
                                token, 
                                user:{id:result.librarian_id, name: result.name, role:"librarian"},
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




exports.getLibrarian=(req,res)=>{
console.log("I Am Here");
    let promise = libmodel.getLibrarian();
     promise.then((result)=>{
            res.status(302).json({message:result});//,msg:msg
        }).catch((err)=>{
            res.status(404).json({message:err});
        });

}

exports.updateLibrarian=async(req,res)=>{

    const{librarian_id,name,contact,email,password}=req.body;
            
    const promise=libmodel.updateLibrarian(librarian_id,name,contact,email,password);
            promise.then((result)=>{
                res.status(200).json({message:result});
            });
    
            promise.catch((err)=>{
                res.status(500).json({message:err});
            });

}

exports.deleteLibrarian=(req,res)=>{
    const {librarian_id}=req.body;

    const promise=libmodel.deleteLibrarian(librarian_id);
            promise.then((result)=>{
                res.status(200).json({message:'Librarian Deleted'});
            });

            promise.catch((err)=>{
                res.status(500).json({message:err});
            });

}



