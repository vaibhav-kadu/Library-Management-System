let jwt=require('jsonwebtoken')
const { findStudentByEmail,findAdminByEmail } = require('../models/authModel');
const {findLibrarianByEmail} = require('../models/librarianModel');



exports.verifyUser = async (req,res,next) =>{
    try{
        const token=req.headers.authorization.split(' ')[1];
        if(!token) return res.status(404).json({success:false,error:"Token Not Provided"})

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_KEY);
        } catch (err) {
            return res.status(401).json({ success: false, error: "Invalid token" });
        }
        if(!decoded) return res.status(404).json({success:false,error:"Token Not Valid"})

        const role = decoded.role;

        // Function map
        const roleFunctionMap = {
            admin: findAdminByEmail,
            librarian: findLibrarianByEmail,
            student: findStudentByEmail
        };

        const lookupFunction = roleFunctionMap[role];
        

        if (!lookupFunction) {
            return res.status(400).json({ success: false, error: "Invalid Role" });
        }

        const user = await lookupFunction(decoded.id);
        console.log("  user=" ,user);
        
        if(!user) return res.status(404).json({success:false,error:"User Not Found"})
        
        req.user=user
        next()
    }catch(error){
        console.log(error)
        return res.status(500).json({success:false,error:"Server Side Error"})
    }
}