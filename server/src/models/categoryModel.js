const db=require('../config/db.js');

exports.addCategory=(name)=>{
    return new Promise((resolve,reject)=>{
        db.query('INSERT INTO categories (name) values(?)',[name],(err,result)=>{
            if(err) return reject("Category Not Added because "+err);
            resolve(result);
        });
    }); 
};

exports.getCategory=()=>{
    return new Promise((resolve,reject)=>{
        db.query("select * from categories",(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        });
    });
}

exports.getCategoriesForDropdown = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT category_id, name FROM categories", (err, results) => {
      if (err) return reject(err);
      resolve(results);   // ✅ just return data
    });
  });
};


exports.findCategoryByName=(name)=>{
    return new Promise((resolve,reject)=>{
        db.query('select * from categories where name=? ',[name],(err,results)=>{
            if(err) return reject("category Not Get because= "+err);
           resolve(results[0]);
        });
    });
};

exports.updateCategory=(category_id,name)=>{
    return new Promise((resolve,reject)=>{
        db.query('update categories set name=? where category_id=?',[name,category_id],(err,result)=>{
            if(err){
                reject(err);
            }else{
                resolve("UPDATED");
            }
        });
    });
};

exports.deleteCategory=(category_id)=>{
    return new Promise((resolve,reject)=>{
        db.query('delete from categories where category_id=?',[category_id],(err,result)=>{
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        });
    });
};

