//studentModel.js
const db=require('../config/db.js');


exports.findStudentById=(sid)=>{
    return new Promise((resolve,reject)=>{
        db.query('select * from Students where sid=?',[sid],(err,results)=>{
            if(err) return reject("Data Not Get Because"+err);
            resolve(results[0]);
        });
    });
};



exports.findStudentByEmail=(email)=>{
    return new Promise((resolve,reject)=>{
        db.query('select * from Students where email = ? ',[email],(err,results)=>{
            if(err) return reject("Data Not Get Because"+err);
            resolve(results[0]);
        });
    });
};


exports.addStudent=(name,contact,email,profileImage,password,address)=>{
    return new Promise((resolve,reject)=>{
        db.query('insert into Students (name,contact,email,profileImage,password,address) values(?,?,?,?,?,?)',[name,contact,email,profileImage,password,address],(err,result)=>{
            if(err) return reject('Student Not Added Because = '+err);
            resolve(result);
        });
    });
};

exports.verifyStudent=(lid,sid)=>{
    return new Promise((resolve,reject)=>{
        db.query('update Students set lid=? where sid=?',[lid,sid],(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        });
    });
};

exports.getStudents=()=>{
    return new Promise((resolve,reject)=>{
        db.query('select * from Students',(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        });
    });
};


exports.updateStudent=(sid,name,contact,email,profileImage,address)=>{
    return new Promise((resolve,reject)=>{
        db.query('update Students set name=?,contact=?,email=?,profileImage=?,address=? where sid=?',[name,contact,email,profileImage,address,sid],(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        });
    });
};

exports.deleteStudent=(sid)=>{
    return new Promise((resolve,reject)=>{
        db.query('delete from Students where sid=?',[sid],(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        });
    });
};

