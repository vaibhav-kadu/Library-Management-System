const db=require('../config/db');

exports.addBook=(title,author,isbn,publisher,category_id,total_copies,bookImage)=>{
    return new Promise((resolve,reject )=>{
        db.query('insert into books (title,author,isbn,publisher,category_id,total_copies,bookImage) values(?,?,?,?,?,?,?)',
        [title,author,isbn,publisher,category_id,total_copies,bookImage],(err,result)=>{
            if(err) return reject(err);
            resolve(result);
        });
    });
};


exports.updateBook = (bookId, title, author, isbn, publisher, category_id, total_copies, bookImage) => {
    return new Promise((resolve, reject) => {
        db.query(
            'UPDATE books SET title=?, author=?, isbn=?, publisher=?, category_id=?, total_copies=?, bookImage=? WHERE book_id=?',
            [title, author, isbn, publisher, category_id, total_copies, bookImage, bookId],
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }
        );
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


exports.getBookBy=(id)=>{
    return new Promise((resolve,reject)=>{
        db.query('select * from books where book_id=?',[id],(err,result)=>{
            if(err) return reject(err);
            resolve(result[0]);
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