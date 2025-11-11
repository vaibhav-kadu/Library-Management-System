const { log } = require('console');
const bookModel=require('../models/bookModel');

exports.addBook = (req, res) => {
    const { title, author, isbn, publisher, category_id, total_copies } = req.body;
    const bookImage = req.file ? req.file.filename : null; // Get uploaded bookImage filename

    const promise = bookModel.addBook(title, author, isbn, publisher, category_id, total_copies, bookImage);
    promise
        .then(() => {
            res.status(200).json({ success: true, message: 'Book Added' });
        })
        .catch((err) => {
            res.status(400).json({ success: false, message: 'Book Not Added Because = ' + err });
        });
};

exports.updateBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { title, author, isbn, publisher, category_id, total_copies, currentImage } = req.body;
    let bookImage = currentImage; // Keep existing bookImage by default

    // If a new bookImage is uploaded
    if (req.file) {
      bookImage = req.file.filename;
      
      // Optional: Delete old bookImage file
      if (currentImage && currentImage !== 'null') {
        const fs = require('fs');
        const path = require('path');
        const oldImagePath = path.join(__dirname, "..", "public", "book_images", currentImage);
        if (fs.existsSync(oldImagePath)) {
          try {
            fs.unlinkSync(oldImagePath);
          } catch (err) {
            console.log('Could not delete old bookImage:', err);
          }
        }
      }
    }

    const updateResult = await bookModel.updateBook(bookId, title, author, isbn, publisher, category_id, total_copies, bookImage);
    
    if (updateResult) {
      res.status(200).json({ 
        success: true, 
        message: 'Book Updated'
      });
    } else {
      res.status(400).json({ 
        success: false, 
        error: 'Failed to update book' 
      });
    }
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal Server Error' 
    });
  }
};

exports.getAllBooks = (req, res) => {
  let promise = bookModel.getbooks();
  promise
    .then((result) => {
      res.status(200).json({
        success: true,
        books: result   
      });
    })
    .catch((err) => {
      res.status(500).json({
        success: false,
        message: "Internal Server Error = " + err,
      });
    });
};

exports.getBooksByCategory = (req, res) => {
  const {category_id} = req.query;
  console.log(category_id);
  let promise = bookModel.getBooksByCategory(category_id);
  promise
    .then((result) => {
      res.status(200).json({
        success: true,
        books: result   
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
