import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';
const router=express.Router();

export const registerUser=((req,res,next)=>{
    User.find({email:req.body.email})
            .exec()
            .then(user=>{
                if(user.length>=1){
                    return res.status(409).json({
                        message:"The mail exists"
                    });
                }else{
                        bcrypt.hash(req.body.password,10,(err,hash)=>{
            if(err){
                return res.status(500).json({
                    error:err
                });
            }else{
            const user =new User({
            _id: new mongoose.Types.ObjectId(),
            name:req.body.name,
            email:req.body.email,
            password:hash,
            role:req.body.role
            });
            user.save()    
                .then(result=>{
                    console.log(result);
                    res.status(201).json({
                        message:"User created"
                    })
                })
                .catch(err=>{
                    console.log(err);
                    res.status(500).json({
                        error:err
                    });
                });
            }
         });
        }
    })
});
export const signinUser=((req,res,next)=>{
    User.find({email:req.body.email})
        .exec()
        .then(user=>{
            if(user.length<1){
                return res.status(401).json({
                    message:"Auth failed"
                });
            }
            bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
                if(err){
                     return res.status(401).json({
                    message:"Auth failed"
                });
                }
                if(result){
                    const token=jwt.sign({
                        email:user[0].email,
                        role:user[0].role,
                        userId:user[0]._id
                    },process.env.JWT_KEY,
                    {
                        expiresIn:"12h"
                    },
                    );
                     return res.status(200).json({
                    message:"Auth successful",
                    userId:user[0]._id,
                    token:token
                });
                }
                 res.status(401).json({
                    message:"Auth failed"
                });
            });
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                 error:err
            });
        })
})
export const signoutUser=((req,res,next)=>{
 const authHeader = req.headers["authorization"];
 console.log(authHeader)
 jwt.sign(authHeader,process.env.JWT_KEY,{expiresIn:"1"},(logout, err) => {
    if (logout) {
    res.send({msg : 'You have been Logged Out' });
    } else {
    res.send({msg:'Error'});
    }
    })
})
export const deleteUser=((req,res,next)=>{
    User.remove({_id:req.params.userId})
        .exec()
        .then(result=>{
            res.status(200).json({
                message:"User deleted"
            });
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error:err
            });
        });
});
export default router;