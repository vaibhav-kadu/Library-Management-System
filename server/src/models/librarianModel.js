const db=require('../config/db.js');

exports.addLibrarian=(name,contact,email,password)=>{
    return new Promise((resolve,reject)=>{
        db.query('INSERT INTO librarians (name,contact,email,password) values(?,?,?,?)',[name,contact,email,password],(err,result)=>{
            if(err) return reject("Category Not Added because "+err);
            resolve(result);
        });
    }); 
};

exports.findLibrarianById=(id)=>{
    return new Promise((resolve,reject)=>{
        db.query('select * from Librarians where id=?',[id],(err,results)=>{
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

exports.updateLibrarian=(id,name, contact, email, password)=>{
    return new Promise((resolve,reject)=>{
        db.query('update librarians set name=?, contact=?, email=?, password=? where id=?',[name,contact,email,password,id],(err,result)=>{
            if(err){
                reject(err);
            }else{
                resolve("UPDATED");
            }
        });
    });
};

exports.deleteLibrarian=(id)=>{
    return new Promise((resolve,reject)=>{
        console.log(id);
        db.query('delete from librarians where id=?',[id],(err,result)=>{
            if(err){
                reject(err);
            }else{
                resolve(result);
            }
        });
    });
};



