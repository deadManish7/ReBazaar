const express = require("express");
const app = express();
const cookieparser = require('cookie-parser');
app.use(cookieparser())
const signUpInRouter = express.Router();
const userModel = require('./userModel.js');
const jwt = require('jsonwebtoken');
const jwt_key = 'manishakarshit123456789'
const {sendMail} = require('./nodemailer');
const {otpMail} = require('./nodemailer');
const path = require('path');


signUpInRouter
.route('/signup')
.get(getSignup)
.post(verifyOtp,postSignUp)

signUpInRouter
.route('/signup/otp')
.get(getOtpPage)
.post(sendOtp)

signUpInRouter
.route('/login')
.get(getLogin)
.post(postSignIn)


function getLogin(req,res){
    res.sendFile(path.resolve('./pages/login.html'));
}

function getSignup(req,res){
    res.sendFile(path.resolve('./pages/signup.html'));
}

function getOtpPage(req,res){
    res.sendFile(path.resolve('./pages/otpVerify.html'));
}

async function postSignUp(req,res){
    try{
    let userData = req.cookies.User;
    let user = await userModel.create(userData);
    
    sendMail("signup",user);
    res.clearCookie('User');
    res.send("200");}

    catch(err){
            res.send();
        }
    }

async function postSignIn(req,res){
    let user_email = req.body.Email;
    let user_password = req.body.Password;

    try{
        let db_search_user = await userModel.findOne({Email : user_email});

        if(db_search_user == undefined){
            res.send("0");
        }

        else{
            if(user_password != db_search_user.Password){
                res.send("1");
            }

            else if(db_search_user.isAdmin == true){
                let uid = db_search_user._id;
                let token = jwt.sign({payload : uid},jwt_key);
                res.json({
                    jwt : token,
                    code : 3
                })
            }
            
            else {
                let uid = db_search_user._id;
                let token = jwt.sign({payload : uid},jwt_key);
                res.cookie("isLoggedIn",token); 
                res.json({
                    jwt : token,
                    code : 2
                })
            }
        }
    }

    catch(err){
        res.send();
    }
}   

async function sendOtp(req,res){
    let email=req.body.Email ;
    try{
    let user = await userModel.findOne({Email : email});
    if(user){
        res.send("11000");
    }
    else{
        let otp = await otpMail(email);
        let user = {
            Name : req.body.Name,
            Email : req.body.Email,
            Password : req.body.Password,
            Otp : otp
        }


        res.cookie('User',user,{httpOnly : true});
        res.json ("200");
    }
    }

    catch(err){
            res.send("Error");
        }
    }    

async function verifyOtp(req,res,next){

    let email_otp = Number(req.cookies.User.Otp);
    let got_otp = req.body.Otp;
    got_otp = Number(got_otp);

    if(email_otp == got_otp){
        next();
    }

    else{
        res.send("Incorrect");
    }
}

module.exports=signUpInRouter;