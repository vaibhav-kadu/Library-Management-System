const bcrypt=require('bcrypt');
const authModel=require('../models/authModel.js');

exports.landingPage=(req,res)=>{
    console.log("Login ctrl");
};


// ADMIN

exports.registerAdmin= async(req,res)=>{
    try{
        const {name,contact,email,password}=req.body;
        const emailExist= await authModel.findAdminByEmail(email);
            if(emailExist){
                return res.status(400).json({message:'Admin Already Registered'});
            }

        const saltRound=10;
        //const passwordHash=await bcrypt.hash(password,saltRound);
        //save Admin
        await authModel.addAdmin(name,contact,email,password);//password also

        res.status(201).json({message:'Admin Registered SuccessFully'});
        
    }catch(error){
        console.error('Admin Registration Error => ',error);
        res.status(500).json({message:'Internal Server Error'});
    }
};

exports.getAdmin=async (req,res)=>{
    try{
        const {email}=req.body;

        const emailExist= await authModel.findAdminByEmail(email);
                if(emailExist){
                    const{email,password}=emailExist;
                    
                        if(req.body.password===password){
                            res.status(200).json({message:"Login Success" });
                        }else{
                            res.status(400).json({message:"Incorrect Password" });
                        }

                }else {
                    console.log("No admin found with that email.");
                    res.status(404).json({ message: "Admin not found" });
                }
    }catch(error){
        console.log(error);
        res.status(500).json({message:'Internal Server Error'});
    }

};

exports.updateAdmin=async(req,res)=>{
    const{admin_id,name,contact,email,password}=req.body;

    const promise=authModel.updateAdmin(admin_id,name,contact,email,password);
            promise.then((result)=>{
                res.status(200).json({message:result});
            });

            promise.catch((err)=>{
                res.status(500).json({message:err});
            });
};




// LIBRARIANS


exports.addLibrarian= async(req,res)=>{
    let {name,contact,email,password}=req.body;

    const existEmail=await authModel.findLibrarianByEmail(email);

        if(existEmail){
            return res.status(400).json({message:'Email Already Exist'});
        }

    let promise=authModel.addLibrarian(name,contact,email,password);
        promise.then((result)=>{
            res.status(201).json({message:'Librarian Register Successfully'});
        });

        promise.catch((err)=>{
            res.status(500).json({message:'Internal Server Error = '+err});
        });  

};

exports.getLibrarians=(req,res)=>{
    let promise=authModel.getLibrarians();
        promise.then((result)=>{
            res.status(200).json({message:result});
        });
        promise.catch((err)=>{
            res.status(500).json({message:'Internal Server Error = '+err});
        });
}

exports.updateLibrarian=(req,res)=>{
    let {librarian_id,name,contact,email,password}=req.body;

    let promise=authModel.updateLibrarian(librarian_id,name,contact,email,password);
        promise.then((result)=>{
            res.status(200).json({message:'Update Successfully'});
        });
        promise.catch((err)=>{
            res.status(500).json({message:'Internal Server Error = '+err});
        });
};

exports.deleteLibrarian=(req,res)=>{
    //200.500
    const {librarian_id}=req.body;

    let promise=authModel.deleteLibrarian(librarian_id);
        promise.then((result)=>{
            res.status(200).json({message:'Librarian Deleted'});
        });
        promise.catch((err)=>{
            res.status(500).json({message:'Internal Server Error = '+err});
        });
};

