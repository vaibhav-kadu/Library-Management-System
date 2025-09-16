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

exports.getBooks = () => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT b.*, c.name as category_name, COALESCE(t.issued_count, 0) as issued_copies FROM books b LEFT JOIN categories c ON b.category_id = c.category_id LEFT JOIN (SELECT book_id, COUNT(*) as issued_count FROM transactions WHERE return_date IS NULL GROUP BY book_id) t ON b.book_id = t.book_id ORDER BY b.book_id DESC',
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }
        );
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

exports.getBooksByCategory=(category_id)=>{    
    return new Promise((resolve,reject)=>{
        db.query('select * from books where category_id=?',[category_id],(err,result)=>{
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