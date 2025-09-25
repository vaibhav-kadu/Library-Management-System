const db=require('../config/db.js');

exports.addCategory=(name)=>{
    return new Promise((resolve,reject)=>{
        db.query('INSERT INTO Categories (name) values(?)',[name],(err,result)=>{
            if(err) return reject("Category Not Added because "+err);
            resolve(result);
        });
    }); 
};

exports.getCategory=()=>{
    return new Promise((resolve,reject)=>{
        db.query("select * from Categories",(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        });
    });
}

exports.getCategoriesForDropdown = () => {
  return new Promise((resolve, reject) => {
    db.query("SELECT category_id, name FROM Categories", (err, results) => {
      if (err) return reject(err);
      resolve(results);   //  just return data
    });
  });
};


exports.findCategoryByName=(name)=>{
    return new Promise((resolve,reject)=>{
        db.query('select * from Categories where name=? ',[name],(err,results)=>{
            if(err) return reject("category Not Get because= "+err);
           resolve(results[0]);
        });
    });
};

exports.updateCategory=(category_id,name)=>{
    return new Promise((resolve,reject)=>{
        db.query('update Categories set name=? where category_id=?',[name,category_id],(err,result)=>{
            if(err){
                reject(err);
            }else{
                resolve("UPDATED");
            }
        });
    });
};

exports.inactiveCategory=(status,category_id)=>{
    return new Promise((resolve,reject)=>{
        db.query('update Categories set status=? where category_id=?',[status,category_id],(err,result)=>{
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        });
    });
};

exports.deleteCategory=(category_id)=>{
    return new Promise((resolve,reject)=>{
        db.query('delete from Categories where category_id=?',[category_id],(err,result)=>{
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        });
    });
};

