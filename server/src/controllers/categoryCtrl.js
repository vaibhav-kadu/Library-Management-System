const bcrypt=require('bcrypt');
const catModel=require('../models/categoryModel.js');
const bookModel=require('../models/bookModel.js');


exports.addCategory= async(req,res)=>{

    try{
        const {name}=req.body;
        const checkExist= await catModel.findCategoryByName(name);
            if(checkExist){
                return res.status(400).json({success: false, error:'Category Already Added'});
            }
        //save Category
        await catModel.addCategory(name);

        res.status(201).json({success: true, message:'Category Added SuccessFully'});
        
    }catch(error){
        console.error('Category Not Add  Error => ',error);
        res.status(500).json({success: false, message:'Internal Server Error'});
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


exports.getCategoriesForDropdown = (req, res) => {
  catModel.getCategoriesForDropdown()
    .then(results => res.json(results))
    .catch(err => res.status(500).json({ success: false, message: err }));
};



exports.updateCategory=async(req,res)=>{
    
    //const { categoryId } = req.params; 
    const{category_id,name}=req.body;
    
    const checkExist= await catModel.findCategoryByName(name);
            if(checkExist){
                return res.status(400).json({success:false,message:'Category Already Added'});
            }
    const promise=catModel.updateCategory(category_id,name);
            promise.then((result)=>{
                res.status(200).json({success:true,message:"Category updated successfully!"});
            });

            promise.catch((err)=>{
                res.status(500).json({success:false,message:err});
            });
};


exports.deleteCategory =async (req, res) => {
  const { category_id } = req.query; //  Get from body instead of params
  const checkStatus = await bookModel.getBooksByCategory(category_id);
    if (checkStatus.length > 0){
        await catModel.inactiveCategory('inactive',category_id);
        return res.status(200).json({ success: true, message: 'Category is Inactive insted of delete because this category with associated books.' });   
    }
    const promise = catModel.deleteCategory(category_id);
        promise.then((result) => {
            if(result.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Category Not Found' });
            }            
            res.status(200).json({ success: true, message: 'Category Deleted' });
        });
        promise.catch((err) => {
            res.status(500).json({ success: false, error: err });
        });
    
};





