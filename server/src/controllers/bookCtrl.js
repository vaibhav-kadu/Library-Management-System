const bookModel=require('../models/bookModel');

exports.addBook = (req, res) => {
    const { title, author, isbn, publisher, category_id, total_copies } = req.body;
    const image = req.file ? req.file.filename : null; // Get uploaded image filename

    const promise = bookModel.addBook(title, author, isbn, publisher, category_id, total_copies, image);
    promise
        .then(() => {
            res.status(200).json({ success: true, message: 'Book Added' });
        })
        .catch((err) => {
            res.status(400).json({ success: false, message: 'Book Not Added Because = ' + err });
        });
};

exports.getAllBooks = (req, res) => {
  let promise = bookModel.getBooks();
  promise
    .then((result) => {
      res.status(200).json({
        success: true,
        books: result   // ✅ consistent with frontend
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Internal Server Error = " + err,
      });
    });
};


exports.getBookBy=(req,res)=>{
    let {book_id}=req.query;
    let promise=bookModel.getBookBy(book_id);
        promise.then((result)=>{
            res.status(200).json({success:true,book:result});
        });
        promise.catch((err)=>{
            res.status(500).json({success:false,message:'Inter Nal Server Error = '+err});
        });
};



exports.updateBook=(req,res)=>{
    let {book_id,title,author,isbn,publisher,category_id,total_copies,issued_copies}=req.body;

    let promise=bookModel.updateBook(book_id,title,author,isbn,publisher,category_id,total_copies,issued_copies);
        promise.then((result)=>{
            res.status(201).json({success:true,message:'Book Updated'});
        });
        promise.catch((err)=>{
            res.catch(500).json({success:false,message:'Internal Server Error = '+err});
        });
};

exports.deleteBook = (req, res) => {
    let { id } = req.body; // ✅ get book id from request body

    if (!id) {
        return res.status(400).json({success:false, message: "Book ID is required" });
    }

    bookModel.deleteBook(id)
        .then((result) => {
            res.status(200).json({success:true, message: "Book Deleted" });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({success:false, message: "Internal Server Error" });
        });
};
