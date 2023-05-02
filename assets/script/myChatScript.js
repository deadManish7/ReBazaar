// const server="https://rebazaar.onrender.com";
const server="https://rebazaar.store";

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
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

async function checkLoginForsell(){
  let data = {
    token : getCookie('token')
}

if(data.token){
let resp = await axios.post(server+"/id",data);
if(resp.data == 0){
    swal("OOPS!", "Please login first to access my chats .", "error");
    setTimeout(() => {
        window.location.href = '/';
    }, 2000);
}
else{
    return resp.data.id;
}
}

else{
    swal("OOPS!", "Please login first to access my chats .", "error");
    setTimeout(() => {
        window.location.href = '/';
    }, 2000);

    
}}

function createRoomDiv(senderName,item,roomId,senderId,iblocked,ublocked,lastMsg,dcTime){
    let parent = document.getElementById("myChatRecord");
    let child = document.createElement('div');
    child.className = "chatPerson";
    child.id = roomId;
    child.name = senderId;
    child.value = {
        SenderName : senderName,
        IBlocked : iblocked,
        UBlocked : ublocked
    };
    let markup;

    if(lastMsg > dcTime){
        markup =`
        <i class="fa-solid fa-user"></i> 
        <span ><strong>${senderName}</strong> (Unread Messages)</span>
        <span class="item">Item : <strong>${item}<strong></span>
        `
    }

    else{
    markup =`
    <i class="fa-solid fa-user"></i> 
    <span >${senderName}</span>
    <span class="item">Item : ${item}</span>
    `}

    child.innerHTML = markup;
    parent.appendChild(child);
}

async function getRoom(){
    let data1 = {
        id : userId
    }

    let roomRes = await axios.post(server+"/chat/myChats", data1);

    if(roomRes.data.length > 0){
        let roomData = roomRes.data;
        for(i = 0 ; i < roomData.length ; i++){
            createRoomDiv(roomData[i].User1,roomData[i].ItemName,roomData[i].RoomId,roomData[i].User2,roomData[i].IBlocked,roomData[i].UBlocked,roomData[i].LastMsgTime,roomData[i].User1DcTime)
        }
    }

    else{
        document.getElementById('myChatRecord').innerHTML=`
        <div class="noItemDiv">
        <h1 class="noHeading">No Chats to show right now.</h1>
    </div>`
    }

}

let userId;

function onclick1(){
    let roomDivs = document.getElementsByClassName('chatPerson');
    for(i = 0 ; i < roomDivs.length ;i++){
        let roomId = roomDivs[i].id;
        let sellerId = roomDivs[i].name;
        let senderName = roomDivs[i].value.SenderName;
        roomDivs[i].addEventListener('click',function(){
            window.location.href ="/chat?room="+roomId+"&seller="+sellerId+"&buyer="+userId+"&name="+senderName;
        })
    }
}

async function allFunctions(){
    swal({
        title: "Please Wait ",
        icon: "info",
        text: "My Chats take some time to load !",
        buttons: false,
        timer : 2000
    });
    userId = await checkLoginForsell();
    await getRoom();
    onclick1();
}

allFunctions();

//Adding click methods


