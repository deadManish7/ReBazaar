const express = require("express");
const forgetRouter = express.Router();
const userModel = require('./userModel.js');
const {sendMail} = require('./nodemailer');
const {otpMail} = require('./nodemailer');
const {sendPassChangeMail} = require('./nodemailer');
const path = require('path');

forgetRouter
.route('/forgetPass')
.get(getForgetPage)
.post(forgetPasswordF)

forgetRouter
.route('/otpForgetPass')
.get(getOtpPage)
.post(otpForgetPasswordF)

forgetRouter
.route('/resetPass')
.get(getResetPassPage)
.post(resetPasswordF)

function getForgetPage(req,res){
    res.sendFile(path.resolve('./pages/forgot.html'));
}

function getOtpPage(req,res){
    res.sendFile(path.resolve('./pages/otpForForgetPass.html'));
}

function getResetPassPage(req,res){
    res.sendFile(path.resolve('./pages/reset.html'));
}

async function forgetPasswordF(req,res){
    let email = req.body.Email;
    
    try{
        let user = userModel.findOne({Email : email});

        if(user){
            let otp = await otpMail(email);
            let data = {
                Email : email,
                Otp : otp
            }
            res.cookie('Data',data,{httpOnly : true});
            res.send('2');
        }

        else{
            res.send('0');
        }
    }

    catch(err){
        res.send();
    }
}

function otpForgetPasswordF(req,res){
    let email_otp = Number(req.cookies.Data.Otp);
    let got_otp = Number(req.body.Otp);

    if(email_otp == got_otp){
        res.send("2");
    }

    else{
        res.send("0");
    }
}

async function resetPasswordF(req,res){
    let new_password = req.body.Password;

    try{
        let user =await userModel.findOneAndUpdate({Email : req.cookies.Data.Email},{Password : new_password});
        let id = user._id;
        user = await userModel.findById(id);
        sendPassChangeMail(user);
        res.clearCookie('Data');
        res.send("2");
    }   

    catch(err){
        res.send();
    }
}

module.exports = forgetRouter;


