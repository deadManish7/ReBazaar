const express = require("express");
const app= express();

const cookieparser = require('cookie-parser');
app.use(cookieparser());
const cors = require("cors");
const userModel = require("./backend/userModel")
const itemModel = require('./backend/itemModel.js')
const chatModel = require('./backend/chatModel.js')
const imageUpload = require("./backend/uploadItem");
const jwt = require('jsonwebtoken');
const upload = require("./backend/uploadItem");
const jwt_key = 'manishakarshit123456789'; 
const {protectRoute} = require('./backend/protectRoute.js');
const {returnId} = require('./backend/protectRoute.js');
const {sellRequestMail, adminVerifyMail} = require('./backend/nodemailer');
const path = require('path');
const fs = require('fs');
const PORT = 3000 || process.env.PORT

app.use(express.json());
// app.use(express.urlencoded());
app.use(cors(
   {credentials :true,
    origin: ['http://127.0.0.1:5500','http://127.0.0.1:5501','http://127.0.0.1:5502','http://3.140.94.217','http://3.140.94.217:3000/']}
));
// app.use(flash);

app.use(express.static(__dirname+"/assets"));

// const https = require('https').createServer({
//     key : fs.readFileSync(path.join(__dirname,'certificates','key.pem')),
//     cert : fs.readFileSync(path.join(__dirname,'certificates','certificates.pem')),
// },app);

http.listen(PORT,()=>{
    console.log("Server started succesfully on" , PORT);
});

const signUpInRouter = require('./backend/signUpInRouter.js');
app.use('/',signUpInRouter);

const forgetRouter = require('./backend/forgetRouter.js');
app.use('/',forgetRouter);

const adminRouter = require('./backend/adminRouter.js');
app.use('/admin',adminRouter);

const myItemRouter = require('./backend/myItemRouter.js');
app.use('/myItems',myItemRouter);

const homeRouter = require('./backend/homeRouter.js');
const { dirname } = require("path");
app.use('/',homeRouter);

const chatRouter = require("./backend/chatRouter.js");
const roomIdModel = require("./backend/roomIdModel");
app.use('/chat',chatRouter);



// For selling item

app.get('/sell',function(req,res){
    res.sendFile(path.resolve('./pages/sellForm.html'));
})

app.post('/sell',upload,async function(req,res)
{

    try{
    let item_complete={
        Name : req.body.itemName,
        Price : req.body.itemPrice,
        Description : req.body.itemDescription,
        ImagePath : req.file.filename,
        Category : req.body.categoryName,
        SellerId : req.body.seller,
        ItemDate : new Date().toLocaleDateString(),
        ItemTime : Date.now()
    }
        let db_item = await itemModel.create(item_complete);
        let user = await userModel.findById(item_complete.SellerId);
        sellRequestMail(db_item,user);
        adminVerifyMail(db_item);

        res.redirect('/');
    }

    catch(err){
        res.send();

    }
})


// Request for getting id

app.post('/id',returnId);


// Socket io code

const io = require('socket.io')(http);

io.on('connection',(socket)=>{
    let roomData;

    socket.on('room',function(data){
        socket.join(data.RoomId1);
        roomData ={
            Room : data.RoomId1,
            Id : data.id
        }
    });

    socket.on('message',async function(data){
        socket.to(data.roomName).emit('message',data.msg);

            let chatData = {
            RoomId : data.roomName,
            From : data.from,
            To : data.to,
            Message : data.msg.Message,
            TimeStamp : Date.now(),
            Date : data.msg.Date1,
            Time :  data.msg.Time1
        }

        let chat = await chatModel.create(chatData);
        let room = await roomIdModel.findOneAndUpdate({RoomId : chatData.RoomId},{LastMsgTime : chatData.TimeStamp});


    })

    socket.on('block',function(data){
        socket.to(data.roomName).emit('block');
    })

    socket.on('unblock',function(data){
        socket.to(data.roomName).emit('unblock');
    })

    socket.on('disconnect',async function(){
        if(roomData){
        let roomId = roomData.Room;
        let dcTime = Date.now();
        let userId = roomData.Id;

        try{

        let room = await roomIdModel.findOne({RoomId : roomId});
        if(userId == room.User1){
            room = await roomIdModel.findByIdAndUpdate(room._id,{User1DcTime : dcTime});
        }

        else{
            room = await roomIdModel.findByIdAndUpdate(room._id,{User2DcTime : dcTime});
        }
    }
    catch(err){
        res.send();
    }}})
})

//Function to return name

app.post('/name',async function (req,res){
    try{
    let userId = req.body.SellerId;
    let user = await userModel.findById(userId);
    if(user){
        res.send(user.Name);
    }}

    catch(err){
        res.send();
    }
    
})



