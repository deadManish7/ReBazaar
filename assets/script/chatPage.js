// const server="https://rebazaar.onrender.com";
const server="http://3.140.94.217";

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

async function checkUser() {
    let data = {
        token: getCookie('token')
    };


    if (data.token) {
        let resp = await axios.post(server+"/home", data);

        if (resp.data == '0') {
            alert("Please login first to chat .");
            window.location.href = '/';
        }

        if (resp.data.Name) {
            name1 = resp.data.Name;
        }

    }
}

function sendMessage(msg) {

    let timestamp = new Date();
    let hours = timestamp.getHours();
    let minutes = timestamp.getMinutes();
    let timetype = "am";
    if (hours > 12) {
        hours = hours - 12;
        timetype = "pm";
    }

    if (minutes < 10) {
        minutes = "0" + minutes
    }

    time = hours + ":" + minutes + " " + timetype

    const month1 = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    let dateNo = timestamp.getDate();
    let month = month1[timestamp.getMonth()];
    let year = timestamp.getFullYear();

    date = month + " " + dateNo + "," + year;

    let msgData = {
        Time1: time,
        Date1: date,
        Message: msg.trim()
    }

    appendMessage(msgData, 'incoming');
    scrollToBottom();
    let data = {
        msg: msgData,
        roomName: room,
        to: seller,
        from: buyer,
    }
    socket.emit('message', data);

}

function appendMessage(msgData, type) {

    if (prevdate != msgData.Date1) {
        parent1 = document.getElementById('messageArea');
        let child1 = document.createElement('div');
        child1.classList.add("date");

        let markup1 = `
        <div class="dateContainer">
        <p>${msgData.Date1}</p>
        </div>`;

        child1.innerHTML = markup1;

        parent1.appendChild(child1);
        prevdate = msgData.Date1;
    }

    parent = document.getElementById('messageArea');
    let child = document.createElement('div');
    child.classList.add("message", type);

    let markup;
    if (type == "outgoing") {

        markup = `
    <div class="textContainerLeft">
    <p>${msgData.Message}</p>
    <span class="right">${msgData.Time1}</span>
    </div>`
    }

    else {
        markup = `
        <div class="textContainer">
        <p>${msgData.Message}</p>
        <span class="right">${msgData.Time1}</span>
        </div>`
    }

    child.innerHTML = markup;

    parent.appendChild(child);

}

function scrollToBottom() {
    parent.scrollTop = parent.scrollHeight;
}

function getMsgFromHistory(chatData) {
    let msgArr = chatData.Message1;

    for (i = 0; i < msgArr.length; i++) {

        let msgData = {
            Time1: msgArr[i].Time,
            Message: msgArr[i].Message,
            Date1: msgArr[i].Date
        }

        if (msgArr[i].From == buyer) {
            appendMessage(msgData, 'incoming');
            scrollToBottom();
        }

        else {
            appendMessage(msgData, 'outgoing');
            scrollToBottom();
        }
    }


}

async function chatHistory() {

    let data1 = {
        roomId: room,
        Buyer: buyer,
        Seller: seller
    }

    let historyRes = await axios.post(server+"/chat/history", data1);

    if (historyRes.data.code == '2') {
        let msgInfo = historyRes.data.msginfo;

        let chatData1 = {
            from: historyRes.data.From, //BuyerName
            to: historyRes.data.To,     //SellerName
            Message1: msgInfo,
        }

        getMsgFromHistory(chatData1);
    }

}

async function checkBlock(){
    let data = {
        RoomId : room,
        UserId : buyer
    };

    let res = await axios.post(server+"/chat/blockStatus",data);
    if(res.data){
        iB = res.data.IBlocked;
        uB = res.data.UBlocked;

    }
}

function blockAction(){
    if (uB) {
        let sendDiv = document.getElementById('sendMsg');
        sendDiv.removeAttribute('id');
        sendDiv.className = "blockContainer"
        markup = `
        <p id="blockText">Can't Chat , you have blocked <span id="receiver">${sender}</span> !</p>
            `
    
        sendDiv.innerHTML = markup;

        let blockBtn = document.getElementById('block');
        blockBtn.textContent = 'Unblock';
        blockBtn.classList.remove('btn-danger');
        blockBtn.classList.add('btn-success');

        blockBtn.addEventListener('click',function(e){
            e.preventDefault();
            unBlockEvent();
        })
    }
    
    
    else if (iB) {
        let sendDiv = document.getElementById('sendMsg');
        sendDiv.removeAttribute('id');
        sendDiv.className = "blockContainer"
        markup = `
        <p id="blockText">Can't Chat , you have been blocked by <span id="receiver">${sender}</span> !</p>
            `
    
        sendDiv.innerHTML = markup;

        let blockBtn = document.getElementById('block');
        blockBtn.style.display = 'none';
    }
    }

async function completeBlock(){
    await checkBlock();
    blockAction();
}

async function unBlockEvent(){
    swal({
        title: "Are you sure?",
        text: sender + " will be unblocked ! Please confirm .",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then(async (willDelete) => {
            if (willDelete) {
                socket.emit('unblock',{roomName : room});
                let data7 = {
                    roomId: room,
                    userId: buyer
                };
                let unBlockRes = await axios.post(server+"/chat/unblock", data7);

                if (unBlockRes.data == "2") {
                    swal("SUCCESS !", sender + " has been unblocked .", "success");
                    setTimeout(() => {
                        window.location.href = '';
                    }, 2000)
                }

                else {
                    swal("ERROR !", sender + " has not been unblocked due to some technical reason. Please retry after some time .", "error");
                }

            }

            else {

            }
        
        })}

let time, date, userId, prevdate;

checkUser();



const socket = io();

let params = new URLSearchParams(location.search);
let room = params.get('room');
let seller = params.get('seller');
let buyer = params.get('buyer');
let sender = params.get('name');
let uB=false,iB=false;//uB = blocked by you , iB = you are blocked

completeBlock();


document.getElementById('receiver').textContent = sender;

socket.emit('room', { RoomId1 : room,id : buyer});

chatHistory();

if (uB == false && iB == false) {
    let btn = document.getElementById('send');

    btn.addEventListener('click', function (e) {
        let msg = document.getElementById('textarea').value;
        if(msg){
        document.getElementById('textarea').value = '';
        sendMessage(msg);
        }

        else {
            swal("Error !","Message can't be empty","error"); 
        }


    });
    let textarea = document.getElementById('textarea');
    textarea.addEventListener('keypress', function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            document.getElementById('send').click();
        }
    });

    socket.on('message', function (msgData) {

        appendMessage(msgData, 'outgoing');
        scrollToBottom();
    })


}





let block = document.getElementById('block');
block.addEventListener('click', function (e) {
    e.preventDefault();

    swal({
        title: "Are you sure?",
        text: sender + " will be blocked ! You will not be able to chat further.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then(async (willDelete) => {
            if (willDelete) {
                socket.emit('block',{roomName : room});
                let data7 = {
                    roomId: room,
                    userId: buyer
                };
                let blockRes = await axios.post(server+"/chat/block", data7);

                if (blockRes.data == "2") {
                    swal("SUCCESS !", sender + " has been blocked .", "success");
                    setTimeout(() => {
                        window.location.href = '';
                    }, 2000)
                }

                else {
                    swal("ERROR !", sender + " has not been blocked due to some technical reason. Please retry after some time .", "error");
                }

            }

            else {

            }
        })
})

socket.on('block',function(){
    iB = true;
    blockAction();
})

socket.on('unblock',function(){
    window.location.href = '';
})


