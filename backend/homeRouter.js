const express = require("express");
const app = express();
const homeRouter = express.Router();
const userModel = require('./userModel.js');
const { sendMail } = require('./nodemailer');
const { deleteUserMail } = require('./nodemailer');
const itemModel = require("./itemModel.js");
const imageUpload = require("./uploadItem");
const { protectRoute } = require('./protectRoute.js');
const jwt = require('jsonwebtoken');
const jwt_key = 'manishakarshit123456789';
const cookieparser = require('cookie-parser');
const path = require('path');

app.use(cookieparser());

homeRouter
    .route('/')
    .get(loadHome)

homeRouter
    .route('/home')
    .get(getHomepage)
    .post(protectRoute, getName)

homeRouter
    .route('/home/electronics')
    .get(getElectronicspage)

homeRouter
    .route('/home/footwear')
    .get(getFootwearpage)

homeRouter
    .route('/home/clothes')
    .get(getClothespage)

homeRouter
    .route('/home/vehicle')
    .get(getVehiclepage)

homeRouter
    .route('/home/books')
    .get(getBookspage)

homeRouter
    .route('/deleteInfo')
    .post(protectRoute, deleteInfoF)

function loadHome(req, res) {
    res.sendFile(path.resolve('./index.html'));
}


async function getHomepage(req, res) {
    let items = await itemModel.find({ IsVerified: true })
    let count = await itemModel.find({ IsVerified: true }).count();

    if (items) {
        items.sort(compare);
        res.json({
            content: items
        });
    }

    else {
        res.send("0");//Not found
    }
}
async function getElectronicspage(req, res) {
    let items = await itemModel.find({ IsVerified: true, Category: "Electronics" });
    if (items) {
        items.sort(compare);
        res.json({
            content: items
        });
    }

    else {
        res.send("0");//Not found
    }
}

async function getFootwearpage(req, res) {
    let items = await itemModel.find({ IsVerified: true, Category: "Footwear" });
    if (items) {
        items.sort(compare);
        res.json({
            content: items
        });
    }

    else {
        res.send("0");//Not found
    }
}

async function getClothespage(req, res) {
    let items = await itemModel.find({ IsVerified: true, Category: "Clothes" });

    if (items) {
        items.sort(compare);
        res.json({
            content: items
        });
    }

    else {
        res.send("0");//Not found
    }
}

async function getVehiclepage(req, res) {
    let items = await itemModel.find({ IsVerified: true, Category: "Vehicle" });

    if (items) {
        items.sort(compare);
        res.json({
            content: items
        });
    }

    else {
        res.send("0");//Not found
    }
}

async function getBookspage(req, res) {
    let items = await itemModel.find({ IsVerified: true, Category: "Books" });

    if (items) {
        items.sort(compare);
        res.json({
            content: items
        });
    }

    else {
        res.send("0");//Not found
    }
}

async function getName(req, res) {
    let user = await userModel.findById(req.id);
    if (user) {
        res.json({
            Name: user.Name
        })
    }
    else res.send('');
}

async function deleteInfoF(req, res) {
    let user_id = req.id;
    try {
        let user = await userModel.findByIdAndDelete(user_id);
        deleteUserMail(user);
        let items = await itemModel.deleteMany({ SellerId: user_id });
        res.send("2");
    }

    catch (err) {
        res.send();
    }
}

function compare(a, b) {
    if (a.ItemTime > b.ItemTime) {
        return -1;
    }
    if (a.ItemTime < b.ItemTime) {
        return 1;
    }
    return 0;
}

module.exports = homeRouter;