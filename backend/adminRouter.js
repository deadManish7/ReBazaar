const express = require("express");
const adminRouter = express.Router();
const userModel = require('./userModel.js');
const roomIdModel = require('./roomIdModel.js');
const chatModel = require('./chatModel.js');
const {sendMail} = require('./nodemailer');
const itemModel = require("./itemModel.js");
const {protectRoute} = require('./protectRoute.js');
const {afterVerifyMail} = require('../backend/nodemailer');
const path = require('path');

adminRouter
.route('/')
.get(loadAdmin)
.post(protectRoute,getAdminPage)

adminRouter
.route('/verify')
.post(verifyItem)

adminRouter
.route('/delete')
.post(deleteItem)

adminRouter
.route('/users')
.post(protectRoute,getUsersPage)

adminRouter
.route('/rooms')
.post(protectRoute,getRoomsPage)

adminRouter
.route('/chats')
.post(protectRoute,getChatsPage)

adminRouter
.route('/deleteUser')
.post(deleteUser)

function loadAdmin(req,res){
    res.sendFile(path.resolve("./pages/admin.html"));
}

async function getAdminPage(req,res){
    let items = await itemModel.find({IsVerified : false});
    if(items){
    res.json({
        code : 1,
        content : items,
        
    });}

    else{
        res.json({
            code : 1,
            message : "Not found"
            
    });
}
}

async function getUsersPage(req,res){
    let users = await userModel.find({});
    if(users){
    res.json({
        code : 1,
        content : users,
        
    });}

    else{
        res.json({
            code : 1,
            message : "Not found"
            
    });
}
}
async function getChatsPage(req,res){
    let users = await chatModel.find({});
    if(users){
    res.json({
        code : 1,
        content : users,
        
    });}

    else{
        res.json({
            code : 1,
            message : "Not found"
            
    });
}
}

async function getRoomsPage(req,res){
    let users = await roomIdModel.find({});
    if(users){
    res.json({
        code : 1,
        content : users,
        
    });}

    else{
        res.json({
            code : 1,
            message : "Not found"
            
    });
}
}

async function verifyItem(req,res){
    let item_id = req.body.Name;
    try{
    let item = await itemModel.findByIdAndUpdate(item_id,{IsVerified : true});
    let userId = item.SellerId;
    let user = await userModel.findById(userId);
    afterVerifyMail(item,user);
        res.send("2");
    }

    catch(err){
        res.send();
    }
}

async function deleteItem(req,res){
    let item_id = req.body.Name;
    try{
    let item = await itemModel.findByIdAndDelete(item_id);
        res.send("2");
    }

    catch(err){
        res.send("error");
    }
}

async function deleteUser(req,res){
    let user_id = req.body.Name;
    
    try{
    let user = await userModel.findByIdAndDelete(user_id);
    let items = await itemModel.deleteMany({SellerId : user_id});
        res.send("2");
    }

    catch(err){
        res.send("error");
    }
}

module.exports = adminRouter;

