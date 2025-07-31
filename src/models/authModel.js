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


// LIBRARIANS

exports.findLibrarianByEmail=(email)=>{
    return new Promise((resolve,reject)=>{
        db.query('select * from librarians where email=?',[email],(err,results)=>{
            if(err) return reject("Data Not Get Because"+err);
            resolve(results[0]);
        });
    });
};


exports.addLibrarian=(name,contact,email,password)=>{
    return new Promise((resolve,reject)=>{
        db.query('insert into librarians (name,contact,email,password) values(?,?,?,?)',[name,contact,email,password],(err,result)=>{
            if(err) return reject('Librarian Not Added Because = '+err);
            resolve(result);
        });
    });
};

exports.getLibrarians=()=>{
    return new Promise((resolve,reject)=>{
        db.query('select * from librarians',(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        });
    });
};

exports.updateLibrarian=(librarian_id,name,contact,email,password)=>{
    return new Promise((resolve,reject)=>{
        db.query('update librarians set name=?,contact=?,email=?,password=? where librarian_id=?',[name,contact,email,password,librarian_id],(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        });
    });
};

exports.deleteLibrarian=(librarian_id)=>{
    return new Promise((resolve,reject)=>{
        db.query('delete from librarians where librarian_id=?',[librarian_id],(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        });
    });
};

