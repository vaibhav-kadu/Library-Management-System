const bcrypt=require('bcrypt');
const catModel=require('../models/categoryModel.js');


exports.addCategory= async(req,res)=>{

    try{
        const {name}=req.body;
        const checkExist= await catModel.findCategoryByName(name);
            if(checkExist){
                return res.status(400).json({message:'Category Already Added'});
            }
        //save Category
        await catModel.addCategory(name);

        res.status(201).json({message:'Category Added SuccessFully'});
        
    }catch(error){
        console.error('Category Not Add  Error => ',error);
        res.status(500).json({message:'Internal Server Error'});
    }

};

