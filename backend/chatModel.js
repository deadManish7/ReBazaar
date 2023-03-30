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

const chatSchema = mongoose.Schema({
    RoomId:{
        type : String,
        require : true,
    },
    
    From:{
        type : String,
        require :true
    },

    To:{
        type :String,
        require : true,
    },

    Message:{
        type :String,
        require : true,
    },

    TimeStamp:{
        type : Number,
        require : true 
    },

    Date :{
        type : String,
        reuire : true
    },

    Time:{
        type : String,
        require : true
    }
})

// chatSchema.pre('save',async function(){
//     let salt = await bcrypt.genSalt();
//     let hashedString = await bcrypt.hash(this.Password,salt);
//     console.log(hashedString);
    
// })

const chatModel = mongoose.model("chatModel",chatSchema);

module.exports=chatModel;
