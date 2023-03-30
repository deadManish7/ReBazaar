const express = require("express");
const myItemRouter = express.Router();
const userModel = require('./userModel.js');
const {sendMail} = require('./nodemailer');
const itemModel = require("./itemModel.js");
const {protectRoute} = require('./protectRoute.js');
const path = require('path');

myItemRouter
.route('/')
.get(loadMyItem)
.post(protectRoute,getMyItems)

// myItemRouter
// .route('/edit')
// .post(editItem)

myItemRouter
.route('/delete')
.post(deleteItem)

function loadMyItem(req,res){
    res.sendFile(path.resolve("./pages/myitems.html"));
}

async function getMyItems(req,res){
    try{
    let items = await itemModel.find({SellerId : req.id});
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
}}

    catch(err){
        res.send();
    }
}


async function verifyItem(req,res){
    let item_id = req.body.Name;
    try{
    let item = await itemModel.findByIdAndUpdate(item_id,{IsVerified : true});
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
        res.send();
    }
}

module.exports = myItemRouter;

