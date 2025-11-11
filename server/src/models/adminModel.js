//adminModel.js
const db=require('../config/db.js');

// admin

exports.addadmin=(name,contact,email,password)=>{
    return new Promise((resolve,reject)=>{
        db.query('INSERT INTO admin (name,contact,email,password) values(?,?,?,?)',[name,contact,email,password],(err,result)=>{
            if(err) return reject("admin Not Added because "+err);
            resolve(result);
        });
    }); 
};

exports.findadminById=(id)=>{
    return new Promise((resolve,reject)=>{
        db.query('select * from admin where id=?',[id],(err,results)=>{
            if(err) return reject("Data Not Get Because"+err);
            resolve(results[0]);
        });
    });
};

exports.findadminByEmail=(email)=>{
    return new Promise((resolve,reject)=>{
        db.query('select * from admin where email = ? ',[email],(err,results)=>{
            if(err) return reject("Data Not Get Because"+err);
            resolve(results[0]);
        });
    });
};

exports.updateadmin=(id,name,contact,email,password)=>{
    return new Promise((resolve,reject)=>{
        db.query('update admin set name=?,contact=?,email=?,password=? where id=?',[name,contact,email,password,id],(err,result)=>{
            if(err){
                reject(err);
            }else{
                resolve("UPDATED");
            }
        });
    });
};


