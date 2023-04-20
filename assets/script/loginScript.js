// const server="https://rebazaar.onrender.com";
const server="http://3.140.94.217";

function ValidateEmail(input) {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (input.match(validRegex)) {
        return true;

    } else {
        return false;
    }
}

function hideButton(){
    document.getElementById('alert').style.visibility='hidden';
    document.getElementById('closebtn').style.visibility='hidden';
}


let btn = document.getElementById("signin-submit");

btn.addEventListener('click', async function (e) {
    e.preventDefault();

    let email1 = document.getElementById('email-id').value;
    let password1 = document.getElementById('password-id').value;
 
    if(ValidateEmail(email1)==false){
        swal("ERROR", "Email Id is not Valid.Please check.", "error");
    }

    else if(password1.length < 8){
        swal("OOPS!", "Password Length is less than 8 characters", "error");
    }

    else{
        let userData = {
            Email: email1,
            Password: password1
        }

        const res1 = await axios.post(server+'/login', userData);

        // Defining notations used
        // 0 = email not registerd
        // 1 = incorrect password
        // 2 = login success
        // 3 = admin login

        if(res1.data == "0"){
            swal("ERROR", "Email Id is not registered.Please sign up.", "error");

        }

        else if(res1.data=="1"){
            swal("ERROR", "Incorrect Password.Please check.", "error");
        }

        else if(res1.data.code =="2"){

            swal("SUCCESS", "User Signed In Successfully.", "success");

            document.cookie=("token="+res1.data.jwt+";path=/;" );

            setTimeout(()=>{
                window.location.href = "/";
            },2000)


        }
        else if(res1.data.code =="3"){
            swal("SUCCESS", "Admin Signed In Successfully.", "success");

            // 1 Day = 24 Hrs = 24*60*60 = 86400.

            document.cookie=("token ="+res1.data.jwt+"; path=/;max-age="+(86400*3));
            document.cookie=("admin ="+res1.data.jwt+"; path=/;max-age="+(86400*3));
            
            setTimeout(()=>{
                window.location.href = "/admin";
            },2000)

        }

        else{
        }
        
    }
});

let eye = document.getElementById("eye");
                   
    
eye.addEventListener("click" , function toggleBoxVisibility() {
  let getPasword = document.getElementById("password-id");  

  if (getPasword.type === "password") {  
  getPasword.type = "text";  
  document.querySelector("i").classList.remove("fa-eye");
  document.querySelector("i").classList.add("fa-eye-slash");
  }  else {  
    getPasword.type = "password";  
    document.querySelector("i").classList.remove("fa-eye-slash");
    document.querySelector("i").classList.add("fa-eye");
  
  }  



});
