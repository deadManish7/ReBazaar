const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const db_link = "mongodb+srv://deadmanish:ManishAkarshit2003@cluster0.fnto0di.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(db_link)
.then(function(db){
    console.log("DB connected");
})

.catch(function(err){
    console.log("Error generated : ",err);
})

const itemSchema = mongoose.Schema({
    Name:{
        type : String,
        require : true,
    },
    
    Price:{
        type : String,
        require :true
    },

    Description:{
        type :String,
    },

    ImagePath:{
        type:String,
    },

    Category:{
        type : String
    },
    
    SellerId:{
        type:String,
        require : true
    },

    IsVerified:{
        type : Boolean,
        default : false
    },

    ItemDate:{
        type : String,
        require : true
    },

    ItemTime:{
        type : Number,
        require : true
    }


})


const itemModel = mongoose.model("itemModel",itemSchema);

module.exports=itemModel;