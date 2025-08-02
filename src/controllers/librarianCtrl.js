const bcrypt=require('bcrypt');
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


