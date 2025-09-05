const db=require('../config/db.js');


//Students Model

exports.findStudentById=(id)=>{
    return new Promise((resolve,reject)=>{
        db.query('select * from students where id=?',[id],(err,results)=>{
            if(err) return reject("Data Not Get Because"+err);
            resolve(results[0]);
        });
    });
};

//Students Model

exports.findStudentByEmail=(email)=>{
    return new Promise((resolve,reject)=>{
        db.query('select * from students where email = ? ',[email],(err,results)=>{
            if(err) return reject("Data Not Get Because"+err);
            resolve(results[0]);
        });
    });
};


exports.addStudent=(name,contact,email,image,password,address)=>{
    return new Promise((resolve,reject)=>{
        db.query('insert into students (name,contact,email,image,password,address) values(?,?,?,?,?,?)',[name,contact,email,image,password,address],(err,result)=>{
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

