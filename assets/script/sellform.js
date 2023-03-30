const server="https://rebazaar.onrender.com";

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

async function checkLoginForsell() {
  let data = {
    token: getCookie('token')
  }

  if (data.token) {
    let resp = await axios.post(server + "/id", data);
    if (resp.data == 0) {
      alert("Please login first to sell a item .");
      window.location.href = '/';
    }
    else {
      return resp.data.id;
    }
  }

  else {
    swal("ERROR!", "You need to login first to sell items !", "error");
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);

  }
}

async function bindSellButton() {

  let user_id = await checkLoginForsell();
  let sell_id = document.getElementById('seller');
  sell_id.value = user_id;
}

bindSellButton();

let btn = document.getElementById("resetB");

btn.addEventListener('click', () => {
  // document.getElementsByClassName("sellform-part").value = "";
  let items = document.getElementsByClassName("sellform-part");
  for (let i = 0; i < items.length; i++) {
    items[i].value = "";
  }
})

let submitBtn = document.getElementById("submitB");
submitBtn.addEventListener('click', function () {
  let itemName = document.getElementById('name').value;

  let valid = true;

  if (itemName.length < 2) {
    swal("Error", "Item Name length is less than 2 characters ! ", "error");
    valid = false;
  }

  if (valid) {

    let price = document.getElementById('price').value;

    if (price < 1) {
      swal("Error", "Price must be valid ! ", "error");
      valid = false;
    }
    if (valid) {
      let description = document.getElementById('description').value;
      if (description.length > 100) {
        swal("Error", "Description can't be greater than 100 characters ! ", "error");
        valid = false;
      }

      if(valid){
      
      let file = document.getElementById('image-id');
      if(file.files[0]){
      if (file.files[0].size > (3 * 1048576)) {
        swal("Error !", "Image size is greater than 3 mb", "error");
        valid = false;
      }}

      else{
          swal("Error", "Image is not uploaded ! Please upload before submitting .", "error");
          valid = false;

      }}

      if(valid){
        let name = file.value;
        if (name) {

          if (isImage(name)) {
            swal("Success", "Sell request has been received . We will inform you through email soon after verification . Thanks for your patience .", "success");
            setTimeout(() => {
              document.getElementById('form-id').submit();
            }, 3500);

          }
          else {
            swal("Error", "Uploaded file is not an Image! Please check", "error");
          }
        }
      }
    }}
  }
);

function getExtension(filename) {
  var parts = filename.split('.');
  return parts[parts.length - 1];
}

function isImage(filename) {
  var ext = getExtension(filename);
  switch (ext.toLowerCase()) {
    case 'jpg':
    case 'png':
    case 'jpeg':
    case 'avif':
      //etc
      return true;
  }
  return false;
}

