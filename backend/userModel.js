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

const userSchema = mongoose.Schema({
    Name:{
        type : String,
        require : true,
    },
    
    Email:{
        type : String,
        require :true
    },

    Password:{
        type :String,
        require : true,
    },

    isAdmin:{
        type : Boolean,
        default : false,


    },

    RoomId:{
        type : [String],
    }
})

// userSchema.pre('save',async function(){
//     let salt = await bcrypt.genSalt();
//     let hashedString = await bcrypt.hash(this.Password,salt);
//     console.log(hashedString);
    
// })

const userModel = mongoose.model("userModel",userSchema);

module.exports=userModel;
