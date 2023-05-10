const express = require("express");
const app = express();
const app2 = express();

const cookieparser = require('cookie-parser');
app.use(cookieparser());
const cors = require("cors");
const userModel = require("./backend/userModel")
const itemModel = require('./backend/itemModel.js')
const chatModel = require('./backend/chatModel.js')
const roomIdModel = require('./backend/roomIdModel.js')
const imageUpload = require("./backend/uploadItem");
const jwt = require('jsonwebtoken');
const upload = require("./backend/uploadItem");
const jwt_key = 'manishakarshit123456789';
const { protectRoute } = require('./backend/protectRoute.js');
const { returnId } = require('./backend/protectRoute.js');
const { sellRequestMail, adminVerifyMail } = require('./backend/nodemailer');
const { chatRemindMail } = require('./backend/remindMail.js');
const path = require('path');
const fs = require('fs');
const schedule = require('node-schedule');
const PORT = 3000 || process.env.PORT
const PORT2 = 3001 || process.env.PORT

app.use(express.json());
// app.use(express.urlencoded());
app.use(cors(
    {
        credentials: true,
        origin: ['http://127.0.0.1:5500', 'http://127.0.0.1:5501', 'http://127.0.0.1:5502', 'http://3.140.94.217', 'http://3.131.194.227', "http://3.131.194.227", "http://rebazaar.store", "http://rebazaar.store"]
    }
));
// app.use(flash);

app.use(express.static(__dirname + "/assets"));

const http = require('https').createServer({
    key: fs.readFileSync(path.join(__dirname, 'sslCert', 'private.key')),
    cert: fs.readFileSync(path.join(__dirname, 'sslCert', 'certificate.crt')),
}, app);

const http2 = require('http').createServer({}, app2);

http.listen(PORT, () => {
    console.log("HTTPS Server started succesfully on", PORT);
});

http2.listen(PORT2, () => {
    console.log("HTTP Server started succesfully on", PORT2);
})

// For redirecting http to https
app2.get('/', (req, res) => {
    res.redirect("https://rebazaar.store")
})


const signUpInRouter = require('./backend/signUpInRouter.js');
app.use('/', signUpInRouter);

const forgetRouter = require('./backend/forgetRouter.js');
app.use('/', forgetRouter);

const adminRouter = require('./backend/adminRouter.js');
app.use('/admin', adminRouter);

const myItemRouter = require('./backend/myItemRouter.js');
app.use('/myItems', myItemRouter);

const homeRouter = require('./backend/homeRouter.js');
const { dirname } = require("path");
app.use('/', homeRouter);

const chatRouter = require("./backend/chatRouter.js");
const { log } = require("console");
app.use('/chat', chatRouter);



// For selling item

app.get('/sell', function (req, res) {
    res.sendFile(path.resolve('./pages/sellForm.html'));
})

app.post('/sell', upload, async function (req, res) {

    try {

        let item_complete = {
            Name: req.body.itemName,
            Price: req.body.itemPrice,
            Description: req.body.itemDescription,
            ImagePath: req.file.filename,
            Category: req.body.categoryName,
            SellerId: req.body.seller,
            ItemDate: new Date().toLocaleDateString('en-GB'),
            ItemTime: Date.now()
        }
        let db_item = await itemModel.create(item_complete);
        let user = await userModel.findById(item_complete.SellerId);
        sellRequestMail(db_item, user);
        adminVerifyMail(db_item);

        res.redirect('/');
    }

    catch (err) {
        res.send();

    }
})


// Request for getting id

app.post('/id', returnId);


// Socket io code

const io = require('socket.io')(http);

io.on('connection', (socket) => {
    let roomData;

    socket.on('room', function (data) {
        socket.join(data.RoomId1);
        roomData = {
            Room: data.RoomId1,
            Id: data.id
        }
    });

    socket.on('message', async function (data) {
        socket.to(data.roomName).emit('message', data.msg);

        let chatData = {
            RoomId: data.roomName,
            From: data.from,
            To: data.to,
            Message: data.msg.Message,
            TimeStamp: Date.now(),
            Date: data.msg.Date1,
            Time: data.msg.Time1
        }

        let chat = await chatModel.create(chatData);
        let room = await roomIdModel.findOneAndUpdate({ RoomId: chatData.RoomId }, { LastMsgTime: chatData.TimeStamp });


    })

    socket.on('block', function (data) {
        socket.to(data.roomName).emit('block');
    })

    socket.on('unblock', function (data) {
        socket.to(data.roomName).emit('unblock');
    })

    socket.on('disconnect', async function () {
        if (roomData) {
            let roomId = roomData.Room;
            let dcTime = Date.now();
            let userId = roomData.Id;

            try {

                let room = await roomIdModel.findOne({ RoomId: roomId });
                if (userId == room.User1) {
                    room = await roomIdModel.findByIdAndUpdate(room._id, { User1DcTime: dcTime });
                }

                else {
                    room = await roomIdModel.findByIdAndUpdate(room._id, { User2DcTime: dcTime });
                }
            }
            catch (err) {
                res.send();
            }
        }
    })
})

//Function to return name

app.post('/name', async function (req, res) {
    try {
        let userId = req.body.SellerId;
        let user = await userModel.findById(userId);
        if (user) {
            res.send(user.Name);
        }
    }

    catch (err) {
        res.send();
    }

})

// Function to remind unread messages
let j = schedule.scheduleJob("0 */12 * * *",function () {
    remindMail1();
});



async function remindMail1() {
    let alreadySent = [];

    try {

        let data = await roomIdModel.find();

        for (i = 0; i < data.length; i++) {
            if (data[i].User1DcTime < data[i].LastMsgTime && (alreadySent.includes(data[i].User1) == false)) {
                let user = await userModel.findById(data[i].User1);
                let result = chatRemindMail(user);
                alreadySent.push(data[i].User1);
            }

            else if (data[i].User2DcTime < data[i].LastMsgTime && (alreadySent.includes(data[i].User2) == false)) {
                let user = await userModel.findById(data[i].User2);
                let result = chatRemindMail(user);
                alreadySent.push(data[i].User2);
            }


        }
    
}
    catch (err) {
        testEmail();
    }
    alreadySent.length = 0;

}

// //Testing email
async function testEmail(){
let user5 = {
    Name : 'Manish Ni Chlra',
    Email : 'deadmanish7@gmail.com',
}

let res10 =  await chatRemindMail(user5);
}

// testEmail();


// Function to delete chatrooms without msg
let k = schedule.scheduleJob("0 */12 * * *",function () {
    deleteRedundantChat();
});


async function deleteRedundantChat(){

    try{

    let data = await roomIdModel.find();
    for(i = 0 ; i < data.length ; i++){
        if(data[i].LastMsgTime == 0){
            let user1V = await userModel.findById(data[i].User1);
            let arr = user1V.RoomId;
            arr = arr.filter(function(item) {
                return item !== data[i].RoomId;
            })
            user1V = await userModel.findByIdAndUpdate(data[i].User1,{RoomId : arr});

            let user2V = await userModel.findById(data[i].User2);
            let arr2 = user2V.RoomId;
            arr2 = arr2.filter(function(item) {
                return item !== data[i].RoomId;
            })
            user2V = await userModel.findByIdAndUpdate(data[i].User2,{RoomId : arr2});

            let newData = await roomIdModel.deleteOne({_id : data[i]._id});
        }
    }}

    catch(err){
        console.log('err');
    }
}
