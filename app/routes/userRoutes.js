const express = require('express');
const User = require('../model/User');
const multer = require("multer");
const bcrypt = require("bcrypt");

const router = express.Router();
////////////////////////regular format//////////////////////
const NameReg = /^[a-zA-Z]+$/
const EmailReg  = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const pwdReg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

/////////////////// img format////////////////////////////////


// RegUser
router.post("/RegUser",async (req,res)=>{
    try{
        const {name , email , pwd, role,phone} = req.body;
        if(role!=="Admin" && role!=="User"){
            return res.status(401).send({error:"Invalid Role"});
        }
        if(!name.match(NameReg) || !email.match(EmailReg) || !pwd.match(pwdReg)){
            return res.status(400).json({error:"Validation failed."});
        }
        const saltRound = 10;
        const Newpwd = await bcrypt.hash(pwd,saltRound);
        const user = new User({
            name,
            email,
            role,
            phone,
            pwd:Newpwd
        });
        await user.save();
        res.status(200).json({Message:"User create successfully."});
    }catch(err){
        res.status(400).json({error:"Validation failed."});
    }
});

//User login
/**
 * @param email
 * @param pwd
 */

router.post("/Login",async (req,res)=>{
    const {email,pwd} = req.body;


})
