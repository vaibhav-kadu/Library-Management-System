let jwt=require('jsonwebtoken')
const { getStudentsBy } = require('../models/authModel');



exports.verifyUser = async (req,res,next) =>{
    try{
        const token=req.headers.authorization.split(' ')[1];
        console.log(token);
        if(!token) return res.status(404).json({success:false,error:"Token Not Provided"})

        const decoded = jwt.verify(token,process.env.JWT_KEY)
        if(!decoded) return res.status(404).json({success:false,error:"Token Not Valid"})

            console.log(decoded);
            
        const user=await getStudentsBy({id:decoded.id})
        if(!user) return res.status(404).json({success:false,error:"User Not Found"})
        
        req.user=user
        next()
    }catch(error){
        console.log(error)
        return res.status(500).json({success:false,error:"Server Side Error"})
    }
}