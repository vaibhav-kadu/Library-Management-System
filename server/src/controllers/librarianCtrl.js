const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const libmodel = require("../models/librarianModel.js");
const path = require("path");
const fs = require("fs");

exports.addLibrarian = async (req, res) => {

  try {
    const { name, contact, email, password } = req.body;
    // Get filename from multer
    const profileImage = req.file ? req.file.filename : null;

    const checkExist = await libmodel.findLibrarianByEmail(email);
    if (checkExist) {
      return res.status(400).json({ success: false, message: 'Librarians Already Added' });
    }
    //save Librarians
    await libmodel.addLibrarian(name, contact, email, password, profileImage);

    res.status(200).json({ success: true, message: 'Librarians Added SuccessFully', librarian: { name, contact, email } });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }

}

exports.getLibrarian = (req, res) => {
  let promise = libmodel.getLibrarian();

  promise.then((result) => {
    res.status(200).json({
      success: true,
      librarians: result
    });
  }).catch((err) => {
    res.status(500).json({
      success: false,
      error: err.message || err
    });
  });
};



exports.getLibrarianByEmail = (req, res) => {
  const { email } = req.body;
  let promise = libmodel.findLibrarianByEmail(email);
  promise.then((result) => {
    res.status(302).json({success:true, message: result });//,msg:msg
  }).catch((err) => {
    res.status(404).json({success:false, message: err });
  });
}

exports.getLibrarianById = (req, res) => {
  const { lid } = req.query;
  let promise = libmodel.findLibrarianById(lid);
  promise.then((result) => {
    res.status(200).json({success:true, librarian:result });//,msg:msg
  }).catch((err) => {
    res.status(404).json({success:false, message: err });
  });
}



exports.updateLibrarian = async (req, res) => {
  try {
    const { lid, name, contact, email, currentProfileImage } = req.body;
    let profileImage = currentProfileImage; // Keep existing image by default

    // If a new image is uploaded
    if (req.file) {
      // If there's an existing image, use its filename to overwrite
      if (currentProfileImage) {
        const ext = path.extname(req.file.originalname);
        const oldExt = path.extname(currentProfileImage);
        
        // Create new filename with same base name but potentially different extension
        const baseName = path.basename(currentProfileImage, oldExt);
        const newFilename = `${baseName}${ext}`;
        
        const uploadPath = path.join(__dirname, "..", "public", "librarian_images");
        const oldFilePath = path.join(uploadPath, currentProfileImage);
        const newFilePath = path.join(uploadPath, newFilename);
        
        try {
          // Delete old file if it exists and has different extension
          if (oldExt !== ext && fs.existsSync(oldFilePath)) {
            fs.unlinkSync(oldFilePath);
          }
          
          // Move uploaded file to the desired filename
          fs.renameSync(req.file.path, newFilePath);
          profileImage = newFilename;
          
        } catch (fileError) {
          console.error('File operation error:', fileError);
          // If file operations fail, keep the original uploaded filename
          profileImage = req.file.filename;
        }
      } else {
        // No existing image, use the uploaded file's name
        profileImage = req.file.filename;
      }
    }

    // Update librarian in database
    const updateResult = await libmodel.updateLibrarian(lid, name, contact, email, profileImage);
    
    if (updateResult) {
      res.status(200).json({ 
        success: true, 
        message: 'Librarian updated successfully', 
        profileImage: profileImage 
      });
    } else {
      res.status(400).json({ 
        success: false, 
        error: 'Failed to update librarian' 
      });
    }

  } catch (error) {
    console.error('Update librarian error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal Server Error' 
    });
  }
};

exports.deleteLibrarian = (req, res) => {
  const { lid } = req.query;  // ✅ pick lid from query params

  libmodel.deleteLibrarian(lid)
    .then(() => {
      res.status(200).json({ success: true, message: 'Librarian Deleted' });
    })
    .catch((err) => {
      res.status(500).json({ success: false, error: err.message || err });
    });
};



