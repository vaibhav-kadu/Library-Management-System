let jwt=require('jsonwebtoken')
const { findStudentById } = require('../models/studentModel');
const { findLibrarianById} = require('../models/librarianModel');
const { findAdminById } = require('../models/adminModel');



exports.verifyUser = async (req,res,next) =>{
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
        const roleFunctionMap = {
            admin: findAdminById,
            librarian: findLibrarianById,
            student: findStudentById
        };

        const lookupFunction = roleFunctionMap[role];
        if (!lookupFunction) return res.status(400).json({ success: false, error: "Invalid Role" });

        const user = await lookupFunction(decoded.id);
        if(!user) return res.status(404).json({success:false,error:"User Not Found"})

        // ✅ Add role into user object
        req.user = { ...user, role };

        next();
    }catch(error){
        return res.status(500).json({success:false,error:"Server Side Error"})
    }
}
