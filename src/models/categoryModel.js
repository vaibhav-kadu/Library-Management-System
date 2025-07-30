const db=require('../config/db.js');

exports.addCategory=(name)=>{
    return new Promise((resolve,reject)=>{
        db.query('INSERT INTO categories (name) values(?)',[name],(err,result)=>{
            if(err) return reject("Category Not Added because "+err);
            resolve(result);
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

