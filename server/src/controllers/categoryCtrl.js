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

exports.getCategory = (req,res)=>{
    let promise = catModel.getCategory();
    promise.then((result)=>{
        res.status(200).json({
            success: true,
            categories: result   // ✅ consistent name
        });
    }).catch(err => {
        console.error(err);
        res.status(500).json({
            success: false,
            error: "Failed to fetch categories"
        });
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

// controller
exports.deleteCategory = (req, res) => {
  const { id } = req.params; // ✅ param, not body

  const promise = catModel.deleteCategory(id);
  promise.then(() => {
    res.status(200).json({ success: true, message: 'Category Deleted' });
  });
  promise.catch((err) => {
    res.status(500).json({ success: false, error: err });
  });
};





