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

let db_arr =[];
let params = new URLSearchParams(location.search);
let userName = params.get('name');
document.getElementById('name-id').textContent = userName;

async function getHome(){
let data = {
    token : getCookie('token')
}

if(data.token){ 
let resp = await axios.post(server+"/myItems",data)
if(resp.data.code == 1){
    db_arr = resp.data.content;
    return db_arr;
}
else{
    window.location.href = "/login";
}}

else{
    window.location.href = "/login";
}}


function createDiv(itemId,image_path1,name,price,description,date){
    let parent = document.getElementById("row-id");
    let child = document.createElement('div');

    child.className='col col-lg-6 col-sm-12';

    child.innerHTML = `<div class="card mb-3 border-dark" ><div class="row g-0"><div class="col-lg-4 col-sm-5" style="text-align: center;"><img src= ${image_path1} alt="Not Found"  class="img-fluid rounded-start itemImage" alt="..."></div><div class="col-lg-8 col-sm-7"><div class="card-body"><h5 class="card-title">₹ ${price}</h5><h6 class="item-name">${name}</h6><p class="card-text">${description}</p><p class="card-text"><small class="">${date} </small></p><button value= ${name} id=${itemId}type="button" class="btn btn-md btn-success contact delete "> Delete Item </button></div></div></div></div>`

    parent.appendChild(child);
}


function finalPage(){

for(i = 0 ; i < db_arr.length ; i++ ){
    createDiv(db_arr[i]._id,("/imagesInDB/"+db_arr[i].ImagePath),db_arr[i].Name,db_arr[i].Price,db_arr[i].Description,db_arr[i].ItemDate);

}
}

async function deleteEvent(){
    let deleteItemElements = document.getElementsByClassName("delete");
    for(let i = 0 ; i < deleteItemElements.length ; i++){     
    
        deleteItemElements[i].addEventListener('click',async function(e){

            swal({
                title: "Are you sure?",
                text: "This item will be deleted permanently !",
                icon: "warning",
                buttons: true,
                dangerMode: true,
            })
                .then(async (willDelete) => {
                    if (willDelete) {

                        let object_name = deleteItemElements[i].name;
    
                        let item = {
                            Name : (object_name)
                        }
                        let resp = await axios.post(server+'/myItems/delete',item);

                        if (resp.data == "2") {
                            swal("Success", "Item has been deleted . ", "success");
                            setTimeout(() => {
                                window.location.href = "/myItems";
                            }, 2000);

                        }

                        else {
                            swal("Error", "Item has not been deleted due to some technical error . ", "error");
                        }
                    }

                    else {

                    }
                })

        } )
    }
    }

    async function allFunctions(){
        db_arr = await getHome();
        if(db_arr.length < 1){
            document.getElementById('ItemsInfo').innerHTML = `
            <div class="noItemDiv"><h1 class="noHeading">No Items here right now. Please sell first. </h1></div>`
        }
        if (db_arr!=[]){
            finalPage();
            deleteEvent();
        }
    }
    
    

allFunctions();

