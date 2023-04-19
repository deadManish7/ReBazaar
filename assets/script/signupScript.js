// const server="https://rebazaar.onrender.com";
const server="https://rebazaar.vercel.app";

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



let btn = document.getElementById("signup-submit");

btn.addEventListener('click', async function (e) {
    e.preventDefault();

    
    let name1 = document.getElementById('name-id').value;
    let email1 = document.getElementById('email-id').value;
    let password1 = document.getElementById('password-id').value;
    let confirm_password1 = document.getElementById('confirm-password-id').value;

    if(name1.length < 2){
        swal("OOPS!", "Name Length is less than 2 characters ", "error");
    }
    else if(password1.length < 8){
        swal("OOPS!", "Password Length is less than 8 characters", "error");
    }

    else if (password1 != confirm_password1) {
        swal("OOPS!", "Password and Confirm Password are not same", "error");
    }

    else if (ValidateEmail(email1) == false) {
        swal("OOPS!", "Email Id is not valid.", "error");
    }

    else {
        swal("Wait!", "Please wait. You will be redirected to OTP page in few moments. We thank you for your patience. ", "info");

        let userData = {
            Name: name1,
            Email: email1,
            Password: password1
        }

        const res1 = await axios.post(server+'/signup/otp', userData,{
            withCredentials:true,
        });

        //   ok = 200
        //   duplicate email = 11000

        if(res1.data=='11000'){
            swal("OOPS!", "Email Id is already registered. Please Login.", "error");
        }

        else{
            if (res1.data=="200"){
                window.location.href='/signup/otp';
            }    

        }

    }

})

let eye = document.getElementById("eye");
          let iElements = document.querySelectorAll("i");


          eye.addEventListener("click", function toggleBoxVisibility() {



            let getPasword = document.getElementById("password-id");
            if (getPasword.type === "password") {
              getPasword.type = "text";


              // document.querySelector("i").classList.remove("fa-eye");
              // document.querySelector("i").classList.add("fa-eye-slash");


              iElements[0].classList.remove("fa-eye");
              iElements[0].classList.add("fa-eye-slash");



            } else {
              getPasword.type = "password";
              // document.querySelector("i").classList.remove("fa-eye-slash");
              // document.querySelector("i").classList.add("fa-eye");

              iElements[0].classList.remove("fa-eye-slash");
              iElements[0].classList.add("fa-eye");



            }



          });



          let eye1 = document.getElementById("eye1");


          eye1.addEventListener("click", function toggleBoxVisibility() {



            let getPasword = document.getElementById("confirm-password-id");
            if (getPasword.type === "password") {
              getPasword.type = "text";
              // document.querySelector("i").classList.remove("fa-eye");
              // document.querySelector("i").classList.add("fa-eye-slash");

              iElements[1].classList.remove("fa-eye");
              iElements[1].classList.add("fa-eye-slash");


            } else {
              getPasword.type = "password";
              // document.querySelector("i").classList.remove("fa-eye-slash");
              // document.querySelector("i").classList.add("fa-eye");

              iElements[1].classList.remove("fa-eye-slash");
              iElements[1].classList.add("fa-eye");

            }



          });
