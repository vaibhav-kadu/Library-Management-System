const { request } = require('express');
const studentModel = require('../models/studentModel')
const bcrypt=require('bcrypt');



exports.addStudent = async (req, res) => {
  try {
    
    const { name, contact, email, password, address } = req.body;
    // Get filename from multer
    const profileImage = req.file ? req.file.filename : null;

    if (!name || !contact || !email || !password) {
      return res.status(400).json({ message: "All required fields are missing" });
    }

    // check if email exists
    const existEmail = await studentModel.findStudentByEmail(email);
    if (existEmail) {
      return res.status(400).json({ message: "Email Already Exist" });
    }

    // save to DB
    const result = await studentModel.addStudent(
      name,
      contact,
      email,
      profileImage,
      password,
      address
    );

    return res.status(201).json({
      success: true,
      message: "Student Register Successfully",
      user: {
        name,
        email,
        contact,
        address,
        profileImage,
        role: "student",
      },
    });
  } catch (err) {
    console.error("Error in addStudent:", err);
    return res
      .status(500)
      .json({ message: "Internal Server Error = " + err });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    // Get sid from URL params instead of body
    const { sid } = req.params;
    const { name, contact, email, currentProfileImage, address } = req.body;
    let profileImage = currentProfileImage; // Keep existing image by default

    // Validate required fields
    if (!sid) {
      return res.status(400).json({ 
        success: false, 
        error: 'Student ID is required' 
      });
    }

    if (!name || !contact || !email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name, contact, and email are required' 
      });
    }

    // If a new image is uploaded
    if (req.file) {
      // If there's an existing image, try to replace it
      if (currentProfileImage) {
        const ext = path.extname(req.file.originalname);
        const oldExt = path.extname(currentProfileImage);
        
        // Create new filename with same base name but potentially different extension
        const baseName = path.basename(currentProfileImage, oldExt);
        const newFilename = `${baseName}${ext}`;
        
        const uploadPath = path.join(__dirname, "..", "public", "student_images");
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

    // Update student in database
    const updateResult = await studentModel.updateStudent(sid, name, contact, email, profileImage, address);
    
    if (updateResult) {
      res.status(200).json({ 
        success: true, 
        message: 'Update Successfully', // Match what frontend expects
        profileImage: profileImage 
      });
    } else {
      res.status(400).json({ 
        success: false, 
        error: 'Failed to update student' 
      });
    }

  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal Server Error' 
    });
  }
};

// ---------------- Get All Students ----------------
exports.getStudents = (req, res) => {
    studentModel.getStudents()
        .then((result) => {
            res.status(200).json({
                success: true,
                students: result   // ✅ return as "students"
            });
        })
        .catch((err) => {
            res.status(500).json({
                success: false,
                error: 'Internal Server Error: ' + err
            });
        });
};

exports.verifyStudent=(req,res)=>{
    let {lid,sid}=req.body;

    let promise=studentModel.verifyStudent(lid,sid);
        promise.then((result)=>{
            res.status(200).json({message:'Update Successfully'});
        });
        promise.catch((err)=>{
            res.status(500).json({message:'Internal Server Error = '+err});
        });
};





exports.getStudentById=(req,res)=>{
    const {sid}=req.body;
    let promise=studentModel.findStudentById(sid);
        promise.then((result)=>{
            res.status(200).json({message:result});
        });
        promise.catch((err)=>{
            res.status(500).json({message:'Internal Server Error = '+err});
        });
}

exports.getStudentByEmail=(req,res)=>{
    const {email}=req.body;
    let promise=studentModel.findStudentByEmail(email);
        promise.then((result)=>{
            res.status(200).json({message:result});
        });
        promise.catch((err)=>{
            res.status(500).json({message:'Internal Server Error = '+err});
        });
}

// controller/studentCtrl.js
exports.deleteStudent = (req, res) => {
  const { sid } = req.params;   // ✅ read from params, not body

  let promise = studentModel.deleteStudent(sid);
  promise.then((result) => {
    res.status(200).json({ success: true, message: 'Student Deleted' });
  });
  promise.catch((err) => {
    res.status(500).json({ success: false, message: 'Internal Server Error = ' + err });
  });
};
