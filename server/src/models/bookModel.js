const db=require('../config/db');

exports.addBook=(title,author,isbn,publisher,category_id,total_copies,image)=>{
    return new Promise((resolve,reject )=>{
        db.query('insert into books (title,author,isbn,publisher,category_id,total_copies,image) values(?,?,?,?,?,?,?)',
        [title,author,isbn,publisher,category_id,total_copies,image],(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        });
    });
};

exports.getBooks=()=>{
    return new Promise((resolve,reject)=>{
        db.query('select * from books',(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        });
    });
};


exports.getBookBy=(input)=>{
    return new Promise((resolve,reject)=>{
        if(!Number.isInteger(input)){
            db.query('select * from books where title=?',[input],(err,result)=>{
                if(err) return reject(err);
                resolve(result);
            });
        }
        else{
            db.query('select * from books where category_id=?',[input],(err,result)=>{
                if(err) return reject(err);
                resolve(result);
            });
        };
    });
};

exports.updateBook=(book_id,title,author,isbn,publisher,category_id,total_copies,issued_copies)=>{
    return new Promise((resolve,reject)=>{
        db.query('update books set title=?,author=?,isbn=?,publisher=?,category_id=?,total_copies=?, issued_copies=? where book_id=?',[title,author,isbn,publisher,category_id,total_copies,issued_copies,book_id],(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        });
    });
};

exports.deleteBook=(book_id)=>{
    return new Promise((resolve,reject)=>{
        db.query('delete from books where book_id=?',[book_id],(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        });
    });
};