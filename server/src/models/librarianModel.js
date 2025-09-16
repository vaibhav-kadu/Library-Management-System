//librarianModel.js
const db=require('../config/db.js');

exports.addLibrarian=(name,contact,email,password,profileImage)=>{
    return new Promise((resolve,reject)=>{
        db.query('INSERT INTO librarians (name,contact,email,password,profileImage) values(?,?,?,?,?)',[name,contact,email,password,profileImage],(err,result)=>{
            if(err) return reject("Category Not Added because "+err);
            resolve(result);
        });
    }); 
};

exports.findLibrarianById=(lid)=>{
    return new Promise((resolve,reject)=>{
        db.query('select * from Librarians where lid=?',[lid],(err,results)=>{
            if(err) return reject("Data Not Get Because"+err);
            resolve(results[0]);
        });
    });
};

exports.findLibrarianByEmail=(email)=>{
    return new Promise((resolve,reject)=>{
        db.query('select * from Librarians where email = ? ',[email],(err,results)=>{
            if(err) return reject("Data Not Get Because"+err);
            resolve(results[0]);
        });
    });
};


exports.getLibrarian=()=>{

    return new Promise((resolve,reject)=>{

        db.query("select * from librarians",(err,result)=>{

            if(err){

                reject(err);

            }
            else{

                resolve(result);

            }

        });

    });

};

exports.updateLibrarian=(lid,name, contact, email, profileImage)=>{
    return new Promise((resolve,reject)=>{
        db.query('update librarians set name=?, contact=?, email=?, profileImage=? where lid=?',[name,contact,email,profileImage,lid],(err,result)=>{
            if(err){
                reject(err);
            }else{
                resolve("UPDATED");
            }
        });
    });
};

exports.deleteLibrarian=(lid)=>{
    return new Promise((resolve,reject)=>{
        db.query('delete from librarians where lid=?',[lid],(err,result)=>{
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        });
    });
};



