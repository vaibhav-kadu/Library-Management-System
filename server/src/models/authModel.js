const db=require('../config/db.js');

// ADMIN

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
            resolve(results);
        });
    });
};

exports.updateAdmin=(id,name,contact,email,password)=>{
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



//Students Model

exports.findStudentByEmail=(input)=>{
    return new Promise((resolve,reject)=>{
        if(!Number.isInteger(input)){
            const search=`%${input}%`;
            db.query('select * from students where email = ? ',[input],(err,results)=>{
                if(err) return reject("Data Not Get Because"+err);
                resolve(results);
            });
        }else{
            db.query('select * from students where id=?',[input],(err,results)=>{
                if(err) return reject("Data Not Get Because"+err);
                resolve(results);
            });
        }
    });
};


exports.addStudent=(name,contact,email,password,address,id)=>{
    return new Promise((resolve,reject)=>{
        db.query('insert into students (name,contact,email,password,address,id) values(?,?,?,?,?,?)',[name,contact,email,password,address,id],(err,result)=>{
            if(err) return reject('Student Not Added Because = '+err);
            resolve(result);
        });
    });
};

exports.getStudents=()=>{
    return new Promise((resolve,reject)=>{
        db.query('select * from students',(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        });
    });
};

exports.updateStudent=(id,name,contact,email,password,address)=>{
    return new Promise((resolve,reject)=>{
        db.query('update students set name=?,contact=?,email=?,password=?,address=? where id=?',[name,contact,email,password,address,id],(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        });
    });
};

exports.deleteStudent=(id)=>{
    return new Promise((resolve,reject)=>{
        db.query('delete from students where id=?',[id],(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        });
    });
};

