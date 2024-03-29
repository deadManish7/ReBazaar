const server="https://rebazaar4.onrender.com";
// const server="https://rebazaar.store";

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

async function getHome() {
    let data = {
        token: getCookie('admin')
    }
    if (data.token) {
        let resp = await axios.post(server+"/admin", data)
        if (resp.data.code == 1) {
            db_arr = resp.data.content;
            return db_arr;
        }
        else {
            window.location.href = "/";
        }
    }

    else {
        window.location.href = "/";
    }
}

function createDiv(itemId, image_path1, name, price, description, date) {
    let parent = document.getElementById("row-id");
    let child = document.createElement('div');
    // child.id = itemId;
    child.className = 'col col-lg-6 col-md-6 col-sm-6 ';
    child.innerHTML = '<div class="card mb-3 border-dark" ><div class="row g-0"><div class="col-lg-4"><img src=' + image_path1 + ' class="img-fluid rounded-start itemImage" alt="..."></div><div class="col-lg-8"><div class="card-body"><h5 class="card-title">' + price + '</h5><h6 class="item-name">' + name + '</h6><p class="card-text">' + description + '</p><p class="card-text"><small class="text-muted">' + date + '</small></p><button name ="' + (itemId) + '" type="button" class="btn btn-lg btn-success verify"></i>  Verify</button><button name ="' + (itemId) + '"type="button" class="btn btn-lg btn-success delete"></i>  Delete</button>';

    parent.appendChild(child);
}

function createDiv2(image_path1,roomId, User1, User2, itemName, LastMsgTime ,User1Dc ,User2Dc) {
    let parent = document.getElementById("row-id");
    let child = document.createElement('div');
    // child.id = itemId;
    let description = "Item : "+itemName + " , Last MsgTime : "+ LastMsgTime +" , User1Dc : " + User1Dc + " , User2Dc : "+User2Dc
    child.className = 'col col-lg-6 col-md-6 col-sm-6 ';
    child.innerHTML = '<div class="card mb-3 border-dark" ><div class="row g-0"><div class="col-lg-4"><img src=' + image_path1 + ' class="img-fluid rounded-start itemImage" alt="..."></div><div class="col-lg-8"><div class="card-body"><h5 class="card-title">' + roomId + '</h5><h6 class="item-name">User1 : ' +User1 +' , User2 : '+ User2 +'</h6><p class="card-text">' + description + '</p><p class="card-text"><small class="text-muted"></small></p><button name ="" type="button" class="btn btn-lg btn-success verify"></i>  Verify</button><button name =""type="button" class="btn btn-lg btn-success delete"></i>  Delete</button>';

    parent.appendChild(child);
}

function createDiv3(image_path1,roomId,chatId, From, To, Time, Date ,Content) {
    let parent = document.getElementById("row-id");
    let child = document.createElement('div');
    // child.id = itemId;
    let roomChat = "Room : "+roomId+ " , ChatId : "+chatId
    let description = "Date : "+Date + " , Time : "+ Time +" , Content : " + Content ;
    child.className = 'col col-lg-6 col-md-6 col-sm-6 ';
    child.innerHTML = '<div class="card mb-3 border-dark" ><div class="row g-0"><div class="col-lg-4"><img src=' + image_path1 + ' class="img-fluid rounded-start itemImage" alt="..."></div><div class="col-lg-8"><div class="card-body"><h5 class="card-title">' + roomChat + '</h5><h6 class="item-name">From : ' +From +' , To : '+ To +'</h6><p class="card-text">' + description + '</p><p class="card-text"><small class="text-muted"></small></p><button name ="" type="button" class="btn btn-lg btn-success verify"></i>  Verify</button><button name =""type="button" class="btn btn-lg btn-success delete"></i>  Delete</button>';

    parent.appendChild(child);
}

function finalPage() {

    for (i = 0; i < db_arr.length; i++) {
        createDiv(db_arr[i]._id, ("/imagesInDB/" + db_arr[i].ImagePath), db_arr[i].Name, db_arr[i].Price, db_arr[i].Description, db_arr[i].ItemDate);
    }
}

async function verifyEvent() {
    let verifyElements = document.getElementsByClassName("verify");
    for (let i = 0; i < verifyElements.length; i++) {  

        verifyElements[i].addEventListener('click', async function (e) {

            swal({
                title: "Are you sure?",
                text: "This item will be shown on main site !",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then(async (willDelete) => {
                    if (willDelete) {
                        let object_name = verifyElements[i].name;

                        let item = {
                            Name: (object_name)
                        }
                        let resp = await axios.post(server+'/admin/verify', item);

                        if (resp.data == "2") {
                            swal("Success", "Item has been verified ! ", "success");
                            setTimeout(() => {
                                window.location.href = "/admin";
                            }, 2000);

                        }

                        else {
                            swal("Error", "Item has not been verified due to some technical error . ", "error");
                        }
                    }

                    else {

                    }
                })



        })
    }
}

async function deleteEvent() {
    let deleteElements = document.getElementsByClassName("delete");
    for (let i = 0; i < deleteElements.length; i++) { 

        deleteElements[i].addEventListener('click', async function (e) {

            swal({
                title: "Are you sure?",
                text: "This item will be deleted from database !",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then(async (willDelete) => {
                    if (willDelete) {

                        let object_name = deleteElements[i].name;

                        let item = {
                            Name: (object_name)
                        }
                        let resp = await axios.post(server+'/admin/delete', item);

                        if (resp.data == "2") {
                            swal("Success", "Item has been deleted . ", "success");
                            setTimeout(() => {
                                window.location.href = "";
                            }, 2000);

                        }

                        else {
                            swal("Error", "Item has not been deleted due to some technical error . ", "error");
                        }
                    }

                    else {

                    }
                })



        })
    }
}

async function allFunctions() {
    db_arr = await getHome();
    if (db_arr != []) {
        finalPage();
        verifyEvent();
        deleteEvent();
    }
}

async function allUserFunctions(){
    db_arr = await getUsers();
    finalUserPage();
    verifyUserEvent();
    deleteUserEvent();
}

async function getUsers(){
    let data = {
        token: getCookie('admin')
    }
    if (data.token) {
        let resp = await axios.post(server+"/admin/users", data)
        if (resp.data.code == 1) {
            db_arr = resp.data.content;
            return db_arr;
        }
        else {
            window.location.href = "/";
        }
    }

    else {
        window.location.href = "/";
    }
}

function finalUserPage(){
    for (i = 0; i < db_arr.length; i++) {
        createDiv(db_arr[i]._id, "/image/defaultImage.png", db_arr[i].Email, db_arr[i].Name, "Room Joined : "+ db_arr[i].RoomId,db_arr[i]._id );
    }
}

function createRoomPage(){
    for (i = 0; i < db_arr.length; i++) {
        createDiv2("/image/defaultImage.png", db_arr[i].RoomId, db_arr[i].User1, db_arr[i].User2,db_arr[i].ItemName,db_arr[i].LastMsgTime,db_arr[i].User1DcTime,db_arr[i].User2DcTime);
    }
}

function createChatPage(){
    for (i = 0; i < db_arr.length; i++) {
        createDiv3("/image/defaultImage.png", db_arr[i].RoomId,db_arr[i]._id, db_arr[i].From,db_arr[i].To,db_arr[i].Time,db_arr[i].Date,db_arr[i].Message);
    }
}

function verifyUserEvent(){
    let verifyElements = document.getElementsByClassName("verify");
    for (let i = 0; i < verifyElements.length; i++) {
  
        verifyElements[i].style.display = 'none';
 
    }

}

async function deleteUserEvent(){
    let deleteElements = document.getElementsByClassName("delete");
    for (let i = 0; i < deleteElements.length; i++) {

        deleteElements[i].addEventListener('click', async function (e) {

            swal({
                title: "Are you sure?",
                text: "This user will be deleted from database !",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then(async (willDelete) => {
                    if (willDelete) {

                        let object_name = deleteElements[i].name;

                        let item = {
                            Name: (object_name)
                        }
                        let resp = await axios.post(server+'/admin/deleteUser', item);

                        if (resp.data == "2") {
                            swal("Success", "User has been deleted . ", "success");
                            setTimeout(() => {
                                window.location.href = "";
                            }, 2000);

                        }

                        else {
                            swal("Error", "User has not been deleted due to some technical error . ", "error");
                        }
                    }

                    else {

                    }
                })



        })
    }
} 

async function allItemFunctions(){
    db_arr = await getAllItems();
    finalPage();
    verifyItemEvent();
    deleteEvent();
}

async function getAllItems(){

        let resp = await axios.get(server+"/home");
        if (resp.data.content ) {
            db_arr = resp.data.content;
            return db_arr;
        }
        else {
            window.location.href = "/";
        }
}

function verifyItemEvent(){
    let verifyElements = document.getElementsByClassName("verify");

    for (let i = 0; i < verifyElements.length; i++) {
  
        verifyElements[i].style.display = 'none';
 
    }

}

async function getRooms(){
    let data = {
        token: getCookie('admin')
    }
    if (data.token) {
        let resp = await axios.post(server+"/admin/rooms", data)
        if (resp.data.code == 1) {
            db_arr = resp.data.content;
            return db_arr;
        }
        else {
            window.location.href = "/";
        }
    }

    else {
        window.location.href = "/";
    }
}

async function getChats(){
    let data = {
        token: getCookie('admin')
    }
    if (data.token) {
        let resp = await axios.post(server+"/admin/chats", data)
        if (resp.data.code == 1) {
            db_arr = resp.data.content;
            return db_arr;
        }
        else {
            window.location.href = "/";
        }
    }

    else {
        window.location.href = "/";
    }
}


async function allRoomFunctions(){
    db_arr = await getRooms();
    createRoomPage();
}

async function allChatFunctions(){
    db_arr = await getChats();
    createChatPage();
}


let db_arr = [];

let params = new URLSearchParams(location.search);
let type = params.get('type');

if (type == "users"){
    allUserFunctions();
}

else if(type == "allitems"){
    allItemFunctions();
}

else if(type == "rooms"){
    allRoomFunctions();
}

else if(type == 'chats'){
    allChatFunctions();
}

else{
allFunctions();
}

