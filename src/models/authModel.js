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
            resolve(results[0]);
        });
    });
};

exports.updateAdmin=(admin_id,name,contact,email,password)=>{
    return new Promise((resolve,reject)=>{
        db.query('update admin set name=?,contact=?,email=?,password=? where admin_id=?',[name,contact,email,password,admin_id],(err,result)=>{
            if(err){
                reject(err);
            }else{
                resolve("UPDATED");
            }
        });
    });
};



//Students Model

exports.findStudentByEmail=(email)=>{
    return new Promise((resolve,reject)=>{
        db.query('select * from students where email=?',[email],(err,results)=>{
            if(err) return reject("Data Not Get Because"+err);
            resolve(results[0]);
        });
    });
};


exports.addStudent=(name,contact,email,password,address,librarian_id)=>{
    return new Promise((resolve,reject)=>{
        db.query('insert into students (name,contact,email,password,address,created_by) values(?,?,?,?,?,?)',[name,contact,email,password,address,librarian_id],(err,result)=>{
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

exports.updateStudent=(student_id,name,contact,email,password,address)=>{
    return new Promise((resolve,reject)=>{
        db.query('update students set name=?,contact=?,email=?,password=?,address=? where student_id=?',[name,contact,email,password,address,student_id],(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        });
    });
};

exports.deleteStudent=(students_id)=>{
    return new Promise((resolve,reject)=>{
        db.query('delete from students where students_id=?',[students_id],(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        });
    });
};

