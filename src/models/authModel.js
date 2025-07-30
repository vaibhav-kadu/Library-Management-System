const db=require('../config/db.js');

exports.addAdmin=(name,contact,email,password)=>{
    return new Promise((resolve,reject)=>{
        db.query('INSERT INTO admin (name,contact,email,password) values(?,?,?,?)',[name,contact,email,password],(err,result)=>{
            if(err) return reject("Admin Not Added because "+err);
            resolve(result);
        });
    }); 
};

exports.findAdminByEmail=(email)=>{
    return new Promise((resolve,reject)=>{
        db.query('select * from admin where email=? ',[email],(err,results)=>{
            if(err) return reject("Data Not Get because= "+err);
            resolve(results[0]);
        });
    });
};

