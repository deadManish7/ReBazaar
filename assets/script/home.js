const server="https://rebazaar.onrender.com/";

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


let db_arr = [], isLogin = false, userName, userId = "0";

async function getHome() {
    let data = {
        token: getCookie('token')
    };


    if (data.token) {
        let resp = await axios.post(server + "/home", data);
        if (resp.data.Name) {
            isLogin = true;
            userName = firstName(resp.data.Name);
            document.getElementById("carouselUser").textContent = "Greetings "+userName +" !";
            let listItem = document.getElementById("userDropdown");
            let markup;

            if (getCookie('admin')) {
                markup = `
                <a class="nav-link dropdown-toggle" href="" id="userName-id" role="button"
                data-bs-toggle="dropdown" aria-expanded="false">
                ${userName}
              </a>
              <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                <li><a class="dropdown-item" onclick="myItemload()">My Items</a></li>
                <li><a class="dropdown-item" onclick="logout()">Logout</a></li>
                <li><a class="dropdown-item" onclick="deleteuser()">Delete Account</a></li>
                <li><a class="dropdown-item" href="/admin">Admin Panel</a></li>
              </ul>
            </li>`;
            }

            else {
                markup = `
            <a class="nav-link dropdown-toggle" href="" id="userName-id" role="button"
            data-bs-toggle="dropdown" aria-expanded="false">
            ${userName}
          </a>
          <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
            <li><a class="dropdown-item" onclick="myItemload()">My Items</a></li>
            <li><a class="dropdown-item" onclick="logout()">Logout</a></li>
            <li><a class="dropdown-item" onclick="deleteuser()">Delete Account</a></li>
          </ul>
        </li>`;
            }

            listItem.innerHTML = markup;
            await getId();
            checkNewMsg();
        }
    }

    let params = new URLSearchParams(location.search);
    let category = params.get('category');
    let resp;
    if (category) {
        if (category == 'Electronics') {
            resp = await axios.get(server + "/home/electronics");
        }
        else if (category == 'Footwear') {
            resp = await axios.get(server + "/home/footwear");
        }
        else if (category == 'Vehicle') {
            resp = await axios.get(server + "/home/vehicle");
        }
        else if (category == 'Clothes') {
            resp = await axios.get(server + "/home/clothes");
        }
        else if (category == 'Books') {
            resp = await axios.get(server + "/home/books");
        }
    }
    else {
        resp = await axios.get(server + "/home");
    }

    if(resp.data.content){
    db_arr = resp.data.content;
    }

    return db_arr;
}

function createDiv(image_path1, name, price, description, date, seller, itemId) {
    let parent = document.getElementById("row-id");
    let child = document.createElement('div');
    child.className = 'col col-lg-6 col-sm-12';

    child.innerHTML = `<div class="card mb-3 border-dark" ><div class="row g-0"><div class="col-lg-4 col-sm-5" style="text-align: center;"><img src= ${image_path1} alt="Not Found"  class="img-fluid rounded-start itemImage" alt="..."></div><div class="col-lg-8 col-sm-7"><div class="card-body"><h5 class="card-title">₹ ${price}</h5><h6 class="item-name">${name}</h6><p class="card-text">${description}</p><p class="card-text"><small class="">${date} </small></p><button value= ${name} id=${itemId} name="${seller}" type="button" class="btn btn-md btn-success contact"><i class="fa-regular fa-message"></i> Chat with Seller</button></div></div></div></div>`;

    parent.appendChild(child);
}

function finalPage() {
    for (i = 0; i < db_arr.length; i++) {
        createDiv(("/imagesInDB/" + db_arr[i].ImagePath), db_arr[i].Name, db_arr[i].Price, db_arr[i].Description, db_arr[i].ItemDate, db_arr[i].SellerId, db_arr[i]._id);
    }
}

async function allFunctions() {
    db_arr = await getHome();
    if(db_arr.length < 1){
        console.log('manish');
        document.getElementById('ItemsInfo').innerHTML = `
        <div class="noItemDiv"><h1 class="noHeading">No Items here right now. Please retry later. </h1></div>`
    }
    else{
        finalPage();
        contactEvent()
    }
}

allFunctions();

// From here are the functions for buttons in homepage


function myChatLogin() {
    if (isLogin) {
        window.location.href = '/chat/myChats';
    }

    else {
        swal("OOPS!", "Please login first to access my chats .", "error");
    }
}

function sellLogin() {
    if (isLogin) {
        window.location.href = '/sell';
    }

    else {
        swal("OOPS!", "Please login first to sell items .", "error");
    }
}

function myItemload() {
    window.location.href = '/myItems?name=' + userName;
}

function logout() {
    // let truth = confirm("Do you want to log out ?");
    swal({
        title: "Are you sure?",
        text: "You will be logged out !",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                swal("Success", "You have been logged out .", {
                    icon: "success",
                });
                document.cookie = 'token=;path=/;Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                document.cookie = 'admin=;path=/;Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                setTimeout(() => {
                    window.location.href = "/";
                }, 2000);
            } else {
            }
        });

}

async function deleteuser() {

    swal({
        title: "Are you sure?",
        text: "Your account and items will be permanently deleted. This change is irrevertible !",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then(async (willDelete) => {
            if (willDelete) {
                let data = {
                    token: getCookie('token')
                }
                let resp = await axios.post(server + "/deleteInfo", data);

                // Codes used 
                // 0 = not deleted,some error
                // 2 = deleted

                if (resp.data == "2") {
                    swal("Success", "Your account has been deleted permanently .", {
                        icon: "success",
                    });
                    setTimeout(() => {
                        window.location.href = "/";
                    }, 2000);
                }

                else {
                    swal("Your account has not been deleted due to some technical problem . Please retry after some time .", {
                        icon: "error",
                    });
                }

            } else {
            }
        });



}

async function getId() {
    let data = {
        token: getCookie('token')
    };
    let resp = await axios.post(server + '/id', data);
    if (resp.data) {
        userId = resp.data.id;
    }

}

async function checkNewMsg() {
    let data = {
        UserId: userId
    };
    let resp = await axios.post(server + '/chat/newMessage', data);
    if (resp.data) {
        if (resp.data == true) {
            document.getElementById('myChatName').innerHTML = `My Chats <sup id="star">⁕</sup>`
        }
    }
}

// Attaching method to contact with seller

async function contactEvent() {
    let contactElements = document.getElementsByClassName("contact");
    for (let i = 0; i < contactElements.length; i++) {

        contactElements[i].addEventListener('click', async function (e) {

            let seller = contactElements[i].name;

            if (userId == "0") {
                swal("OOPS!", "Please login first to chat with seller .", "error");

            }

            else if (userId == seller) {
                swal("", "You are the seller of this item ! Why do you want to chat with yourself :) ", "info");

            }

            else {
                swal('Info', 'Please maintain the decorum of chatroom. Your chat will be monitored.', 'info');

                setTimeout(async () => {
                    let item = contactElements[i].value;
                    let itemId = contactElements[i].id;

                    let userData = {
                        Seller: seller,
                        Buyer: userId,
                        Item: itemId
                    }
                    let resp2 = await axios.post(server + '/chat', userData);

                    let roomId;

                    if (resp2.data == "0") {
                        roomId = Date.now();



                        let contactInfo = {
                            Seller: seller,
                            Buyer: userId,
                            RoomId: roomId,
                            Item: item,
                            ItemId: itemId
                        }

                        let resp3 = await axios.post(server + '/chat/addRoom', contactInfo);

                        if (resp3.data == '0') {
                            alert("Some error occured . Please try after some time.")
                            window.location.href = "/";
                        }
                    }

                    else {
                        roomId = resp2.data;
                    }

                    let data5 = {
                        SellerId: seller
                    }
                    let resp4 = await axios.post(server + '/name', data5);
                    let senderName;
                    if (resp4.data) {
                        senderName = resp4.data;
                    }

                    let data6 = {
                        RoomId: roomId,
                        User: userId
                    }
                    let resp5 = await axios.post(server + '/chat/blockStatus', data6);
                    let uB = resp5.data.UBlocked;
                    let iB = resp5.data.IBlocked;

                    window.location.href = "/chat?room=" + roomId + "&seller=" + seller + "&buyer=" + userId + "&name=" + senderName + "&u=" + uB + "&i=" + iB;
                }
                    , 2000)

            }
        })
    }
}

function firstName(str){
    let words = str.split(" ");
    let firstWord = words[0];

    return firstWord;
}







