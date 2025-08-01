const bookModel=require('../models/bookModel');

exports.addBook=(req,res)=>{
    const {title,author,isbn,publisher,category_id,total_copies}=req.body;

    const promise=bookModel.addBook(title,author,isbn,publisher,category_id,total_copies);
            promise.then((result)=>{
                res.status(200).json({message:'Book Added'});
            });
            promise.catch((err)=>{
                res.status(400).json({message:'Book Not Added Because = '+err});
        });
};

exports.getBooks=(req,res)=>{
    let promise=bookModel.getBooks();
        promise.then((result)=>{
            res.status(201).json({result});
        });
        promise.catch((err)=>{
            res.status(500).json({message:'Internal Server Error = '+err});
        });
};

exports.getBookBy=(req,res)=>{
    let {input}=req.body;
    let promise=bookModel.getBookBy(input);
        promise.then((result)=>{
            res.status(200).json({message:result});
        });
        promise.catch((err)=>{
            res.status(500).json({message:'Inter Nal Server Error = '+err});
        });
};

exports.updateBook=(req,res)=>{
    let {book_id,title,author,isbn,publisher,category_id,total_copies,issued_copies}=req.body;

    let promise=bookModel.updateBook(book_id,title,author,isbn,publisher,category_id,total_copies,issued_copies);
        promise.then((result)=>{
            res.status(201).json({message:'Book Updated'});
        });
        promise.catch((err)=>{
            res.catch(500).json({message:'Internal Server Error = '+err});
        });
};

exports.deleteBook=(req,res)=>{
    let {book_id}=req,body;

    let promise=bookModel.deleteBook(book_id);
        promise.then((result)=>{
            res.status(201).json({message:'Book Deleted'});
        });
        promise.catch((err)=>{
            res.status(400).json({message:'Internal Server Error = '+err});
        });
};