const express = require("express");
const chatRouter = express.Router();
const userModel = require('./userModel.js');
const roomIdModel = require('./roomIdModel.js');
const chatModel = require('./chatModel.js');
const path = require('path');


chatRouter
    .route('/')
    .get(getChatpage)
    .post(checkRoom)

chatRouter
    .route('/addRoom')
    .post(addRoomId)

chatRouter
    .route('/history')
    .post(getHistory)

chatRouter
    .route('/myChats')
    .get(getMyChatPage)
    .post(sendRoom)

chatRouter
    .route('/block')
    .post(blockUser)

chatRouter
    .route('/unblock')
    .post(unblockUser)

chatRouter
    .route('/blockStatus')
    .post(blockStatus)

chatRouter
    .route('/newMessage')
    .post(checkNewMessage)

function getChatpage(req, res) {
    res.sendFile(path.resolve('./pages/chatPage.html'));
}

function getMyChatPage(req, res) {
    res.sendFile(path.resolve('./pages/myChats.html'));
}

async function checkRoom(req, res) {

    try {

        let from = req.body.Buyer;
        let to = req.body.Seller;
        let item = req.body.Item;

        let fromUser = await userModel.findById(from);
        let toUser = await userModel.findById(to);

        let fromUserRoom = fromUser.RoomId;
        let toUserRoom = toUser.RoomId;
        let isPresent = getCommon(fromUserRoom, toUserRoom);
        
        if(isPresent != -1){
        let room = await roomIdModel.findOne({RoomId : isPresent});

        if(room.ItemId != item){
            isPresent = -1;
        }}

        if (isPresent == -1) {
            res.send("0"); // Not present create room id
        }

        else {
            res.send(isPresent);
        }
    }
    catch (err) {
        res.send();
    }
}

// Function to return commonElements
function getCommon(array1, array2) {
    let common;

    for (var i = 0; i < array1.length; i++) {
        for (var j = 0; j < array2.length; j++) {
            if (array1[i] == array2[j]) {
                common = array1[i];
                return common;
            }
        }
    }
    return -1;
}

async function addRoomId(req, res) {

    try {

        let room = req.body.RoomId;
        let seller = req.body.Seller;
        let buyer = req.body.Buyer;
        let item = req.body.Item;
        let itemId = req.body.ItemId;

        let userSeller = await userModel.findById(seller);
        let roomForSeller = userSeller.RoomId;
        roomForSeller.push(room);
        let updatedSeller = await userModel.findByIdAndUpdate(seller, { RoomId: roomForSeller });

        let userBuyer = await userModel.findById(buyer);
        let roomForBuyer = userBuyer.RoomId;
        roomForBuyer.push(room);
        let updatedBuyer = await userModel.findByIdAndUpdate(buyer, { RoomId: roomForBuyer });

        let data = {
            RoomId: room,
            User1: seller,
            User2: buyer,
            ItemName: item,
            ItemId : itemId
        }

        let roomUser = await roomIdModel.create(data);

        res.send();
    }

    catch (err) {
        res.send('0');
    }
}

async function getHistory(req, res) {

    try {

        let chatData = await chatModel.find({ RoomId: req.body.roomId });
        if (chatData) {
            let fromUser = await userModel.findById(req.body.Buyer);
            let toUser = await userModel.findById(req.body.Seller);

            res.json({
                code: "2",
                msginfo: chatData,
                From: fromUser.Name,
                To: toUser.Name
            })
        }

        else {
            res.send();
        }
    }

    catch (err) {
        res.send();
    }
}

async function sendRoom(req, res) {

    try {

        let Id = req.body.id;
        let user = await userModel.findById(Id);
        let userRooms = user.RoomId;
        let roomdata = [];

        for (i = 0; i < userRooms.length; i++) {
            let data = await roomIdModel.findOne({ RoomId: userRooms[i] });

            if (Id == data.User1) {
                let sender = await userModel.findById(data.User2);
                if (sender) {
                    data.User1 = sender.Name;
                }
            }

            else {
                let sender = await userModel.findById(data.User1);
                if(sender){
                data.User2 = data.User1;
                data.User1 = sender.Name;
                data.User1DcTime = data.User2DcTime
            }
                else{
                    data.User1 = "Deleted";
                }
            }


            roomdata.push(data);
        }

        roomdata.sort(compare);
        console.log('Data is :',roomdata);
        res.send(roomdata);
    }

    catch (err) {
        res.send(err);
    }

}

async function blockUser(req, res) {
    let roomId = req.body.roomId;
    let user = req.body.userId;

    try {

        let room = await roomIdModel.findOne({ RoomId : roomId });
        let roomid1 = room._id;

        if (room.User1 == user) {
            let room1 = await roomIdModel.findByIdAndUpdate(roomid1, { User2Blocked : true });
        }
        else {
            let room2 = await roomIdModel.findByIdAndUpdate(roomid1, { User1Blocked : true });
        }
        res.send("2");
    }

    catch (err) {
        res.send(err);
    }
}

async function blockStatus(req, res) {
    let roomId = req.body.RoomId;
    let userId = req.body.UserId;

    try {

        let room = await roomIdModel.findOne({ RoomId : roomId });
        let selfBlocked = false, otherBlocked = false;

        if (userId == room.User1) {
            if (room.User1Blocked == true) {
                selfBlocked = true;
            };
            if (room.User2Blocked == true) {
                otherBlocked = true;
            };
        }
        else {
            if (room.User1Blocked == true) {
                otherBlocked = true;
            };
            if (room.User2Blocked == true) {
                selfBlocked = true;
            };

        }

        let data = {
            UBlocked: otherBlocked,
            IBlocked: selfBlocked
        }

        res.send(data);
    }
    catch (err) {
        res.send();
    }
}

async function unblockUser(req, res) {
    let roomId = req.body.roomId;
    let user = req.body.userId;

    try {

        let room = await roomIdModel.findOne({ RoomId : roomId });
        let roomid1 = room._id;

        if (room.User1 == user) {
            let room1 = await roomIdModel.findByIdAndUpdate(roomid1, { User2Blocked : false });
        }
        else {
            let room2 = await roomIdModel.findByIdAndUpdate(roomid1, { User1Blocked : false });
        }
        res.send("2");
    }

    catch (err) {
        res.send();
    }
}

async function checkNewMessage(req,res){
    let uid = req.body.UserId;
    
    try{
        let user = await userModel.findById(uid);
        let rooms = user.RoomId;
        let newMessage = false;

        for(i = 0 ; i < rooms.length ; i ++){
            let room = await roomIdModel.findOne({RoomId : rooms[i]});
            if(uid == room.User1){
                if(room.User1DcTime < room.LastMsgTime){
                    newMessage = true;
                    break;
                }
            }

            else{
                if(room.User2DcTime < room.LastMsgTime){
                    newMessage = true;
                    break;
                }
            }
        }
        res.send(newMessage);
        
    }

    catch(err){
        res.send();
    }
}

function compare( a, b ) {
    if ( a.LastMsgTime > b.LastMsgTime ){
      return -1;
    }
    if ( a.LastMsgTime < b.LastMsgTime ){
      return 1;
    }
    return 0;
  }

module.exports = chatRouter;