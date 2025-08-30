const bcrypt=require('bcrypt');
const catModel=require('../models/categoryModel.js');


exports.addCategory= async(req,res)=>{

    try{
        const {name}=req.body;
        const checkExist= await catModel.findCategoryByName(name);
            if(checkExist){
                return res.status(400).json({succes: false, error:'Category Already Added'});
            }
        //save Category
        await catModel.addCategory(name);

        res.status(201).json({succes: true, message:'Category Added SuccessFully'});
        
    }catch(error){
        console.error('Category Not Add  Error => ',error);
        res.status(500).json({succes: false, message:'Internal Server Error'});
    }

};

exports.getCategory= (req,res)=>{
    //let msg=req.query.msg || "";
    let promise=catModel.getCategory();
        promise.then((result)=>{
            res.status(302).json({message:result});//,msg:msg
        });
};

exports.updateCategory=async(req,res)=>{
    const{category_id,name}=req.body;
    const checkExist= await catModel.findCategoryByName(name);
            if(checkExist){
                return res.status(400).json({message:'Category Already Added'});
            }
    const promise=catModel.updateCategory(category_id,name);
            promise.then((result)=>{
                res.status(200).json({message:result});
            });

            promise.catch((err)=>{
                res.status(500).json({message:err});
            });
};

exports.deleteCategory=(req,res)=>{
    const {category_id}=req.body;

    const promise=catModel.deleteCategory(category_id);
            promise.then((result)=>{
                res.status(200).json({message:'Category Deleted'});
            });

            promise.catch((err)=>{
                res.status(500).json({message:err});
            });
}



