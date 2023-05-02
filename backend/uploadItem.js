const express = require ('express');
const app = express();
const path = require('path');
const multer = require('multer');


const multerStorage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,"assets/imagesInDB/")
    },
    filename : function(req,file,cb){
        cb(null,file.fieldname + "-" +Date.now()+path.extname(file.originalname))
    }
})

const filter = function(req,file,cb){
    if(file.mimetype.startsWith('image')){
        cb(null,true);
    }

    else{
        cb(new Error("Not an image! Please upload an image "),false);
    }
}

const upload = multer({
    storage : multerStorage,
    fileFilter : filter,
}).single('image');


module.exports=upload;