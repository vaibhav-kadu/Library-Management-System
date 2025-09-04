const { request } = require('express');
const studentModel = require('../models/studentModel')
const bcrypt=require('bcrypt');



exports.addStudent= async(req,res)=>{
    console.log(req.body);
    let {name,contact,email,password,address}=req.body;

    const existEmail=await studentModel.findStudentByEmail(email);

        if(existEmail){
            return res.status(400).json({message:'Email Already Exist'});
        }

    let promise=authModel.addStudent(name,contact,email,password,address,id);
        promise.then((result)=>{
            res.status(201).json({message:'Student Register Successfully'});
        });

        promise.catch((err)=>{
            res.status(500).json({message:'Internal Server Error = '+err});
        });  

};

exports.getStudents=(req,res)=>{
    let promise=studentModel.getStudents();
        promise.then((result)=>{
            res.status(200).json({message:result});
        });
        promise.catch((err)=>{
            res.status(500).json({message:'Internal Server Error = '+err});
        });
}

exports.getStudentById=(req,res)=>{
    const {id}=req.body;
    let promise=studentModel.findStudentById(id);
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

exports.updateStudent=(req,res)=>{
    let {id,name,contact,email,password,address}=req.body;

    let promise=studentModel.updateStudent(id,name,contact,email,password,address);
        promise.then((result)=>{
            res.status(200).json({message:'Update Successfully'});
        });
        promise.catch((err)=>{
            res.status(500).json({message:'Internal Server Error = '+err});
        });
};

exports.deleteStudent=(req,res)=>{
    const {id}=req.body;
    let promise=studentModel.deleteStudent(id);
        promise.then((result)=>{
            res.status(200).json({message:'Student Deleted'});
        });
        promise.catch((err)=>{
            res.status(500).json({message:'Internal Server Error = '+err});
        });
};