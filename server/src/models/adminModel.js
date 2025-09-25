//adminModel.js
const db=require('../config/db.js');

// ADMIN

exports.addAdmin=(name,contact,email,password)=>{
    return new Promise((resolve,reject)=>{
        db.query('INSERT INTO Admin (name,contact,email,password) values(?,?,?,?)',[name,contact,email,password],(err,result)=>{
            if(err) return reject("Admin Not Added because "+err);
            resolve(result);
        });
    }); 
};

exports.findAdminById=(id)=>{
    return new Promise((resolve,reject)=>{
        db.query('select * from Admin where id=?',[id],(err,results)=>{
            if(err) return reject("Data Not Get Because"+err);
            resolve(results[0]);
        });
    });
};

exports.findAdminByEmail=(email)=>{
    return new Promise((resolve,reject)=>{
        db.query('select * from Admin where email = ? ',[email],(err,results)=>{
            if(err) return reject("Data Not Get Because"+err);
            resolve(results[0]);
        });
    });
};

exports.updateAdmin=(id,name,contact,email,password)=>{
    return new Promise((resolve,reject)=>{
        db.query('update Admin set name=?,contact=?,email=?,password=? where id=?',[name,contact,email,password,id],(err,result)=>{
            if(err){
                reject(err);
            }else{
                resolve("UPDATED");
            }
        });
    });
};


