// authMiddleware.js
let jwt = require('jsonwebtoken')
const { findStudentById } = require('../models/studentModel');
const { findLibrarianById} = require('../models/librarianModel');
const { findAdminById } = require('../models/adminModel');

exports.verifyUser = async (req,res,next) => {
    try{
        const token = req.headers.authorization?.split(' ')[1];
        if(!token) return res.status(404).json({success:false,error:"Token Not Provided"})

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_KEY);
        } catch (err) {
            return res.status(401).json({ success: false, error: "Invalid token" });
        }

        const role = decoded.role;
        let user;

        // Handle different ID field names for different roles
        if (role === 'admin') {
            user = await findAdminById(decoded.id);
            if (user) {
                req.user = { 
                    id: user.id, 
                    name: user.name, 
                    email: user.email, 
                    role: 'admin' 
                };
            }
        } else if (role === 'librarian') {
            user = await findLibrarianById(decoded.lid);
            if (user) {
                req.user = { 
                    id: user.lid, 
                    name: user.name, 
                    email: user.email, 
                    role: 'librarian' 
                };
            }
        } else if (role === 'student') {
            user = await findStudentById(decoded.sid);
            if (user) {
                req.user = { 
                    id: user.sid, 
                    name: user.name, 
                    email: user.email, 
                    role: 'student' 
                };
            }
        } else {
            return res.status(400).json({ success: false, error: "Invalid Role" });
        }

        if(!user) return res.status(404).json({success:false,error:"User Not Found"})

        next();
    }catch(error){
        console.error('Auth middleware error:', error);
        return res.status(500).json({success:false,error:"Server Side Error"})
    }
}

// authCtrl.js - Updated verify function
exports.verify = (req,res) => {
    if(!req.user){
        return res.status(401).json({ success: false, error: "Unauthorized" })
    }

    return res.status(200).json({
        success: true,
        user: {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role
        }
    })
}

// ADMIN Login - Updated
exports.loginAdmin = (req,res) => {
    const {password,email} = req.body;

    let promise = adminModel.findAdminByEmail(email);
    promise.then(async (result) => {
        if(!result) {
            return res.status(404).json({success: false,error:"Admin Not Found"})
        }
            
        if(password == result.password) {
            const token = jwt.sign(
                {id: result.id, role:"admin"}, // Keep id for admin
                process.env.JWT_KEY, 
                { expiresIn: '1h' }
            );

            res.status(200).json({
                success: true,
                token, 
                user: {id: result.id, name: result.name, email: result.email, role:"admin"},
                message:"Login Success"
            });
        } else {
            res.status(400).json({ success: false, error:"Incorrect Password" });
        }
    });
    promise.catch((err) => {
        res.status(500).json({success: false, message: "Server error", error: err});
    });
};

// Librarian Login - Updated
exports.loginLibrarian = (req,res) => {
    const {password,email} = req.body;
    
    let promise = libmodel.findLibrarianByEmail(email);
    promise.then((result) => {
        if(!result) {
            return res.status(404).json({success: false,error:"Librarian Not Found"})
        }
        
        if(password == result.password) {
            const token = jwt.sign(
                {lid: result.lid, role:"librarian"}, // Keep lid for librarian
                process.env.JWT_KEY, 
                { expiresIn: '1h' }
            );

            res.status(200).json({
                success: true, 
                token, 
                user: {id: result.lid, name: result.name, email: result.email, role:"librarian"},
                message:"Login Success"
            });
        } else {
            res.status(400).json({ success: false, error:"Incorrect Password" });
        }
    });
    promise.catch((err) => {
        res.status(500).json({success: false, message: "Server error", error: err});
    });
};

// Student Login - Updated
exports.loginStudent = (req, res) => {
    const { password, email } = req.body;

    let promise = studentModel.findStudentByEmail(email);
    promise.then(async (result) => {
        if (!result) {
            return res.status(404).json({ success: false, error: "Student Not Found" });
        }

        if (password == result.password) {
            const token = jwt.sign(
                { sid: result.sid, role: "student"}, // Keep sid for student
                process.env.JWT_KEY,
                { expiresIn: '1h' }
            );

            return res.status(200).json({
                success: true,
                token,
                user: { id: result.sid, name: result.name, email: result.email, role: "student" },
                message: "Login Success"
            });
        } else {
            return res.status(400).json({ success: false, error: "Incorrect Password" });
        }
    });

    promise.catch((err) => {
        res.status(500).json({ success: false, message: "Server error", error: err });
    });
};