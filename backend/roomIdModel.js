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

const roomIdSchema = mongoose.Schema({
   
    RoomId :{
        type : String,
        require : true
    },

    User1 : {
        type : String,
        require : true
    },

    User2 : {
        type : String,
        require : true
    },

    ItemName :{
        type : String,
        require : true
    },

    User1Blocked:{
        type : Boolean,
        require : true,
        default : false
    }
    ,
    User2Blocked:{
        type : Boolean,
        require : true,
        default : false
    },

    LastMsgTime:{
        type : Number,
        default : 0

    },

    User1DcTime:{
        type : Number,
        default : 0

    },

    User2DcTime:{
        type : Number,
        default : 0

    },

    ItemId :{
        type : String,
        require : true
    }


})


const roomIdModel = mongoose.model("roomIdModel",roomIdSchema);

module.exports=roomIdModel;