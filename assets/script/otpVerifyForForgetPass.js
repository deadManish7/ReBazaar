const server="https://rebazaar4.onrender.com";
// const server="https://rebazaar.store";

let btn = document.getElementById("submitB");

function hideButton(){
    document.getElementById('alert').style.visibility='hidden';
    document.getElementById('closebtn').style.visibility='hidden';
}

btn.addEventListener('click', async function (e) {
    e.preventDefault();

    swal({
        title: "Please Wait ",
        icon: "info",
        text: "Please wait. OTP is being verified.",
        buttons: false,
        allowOutsideClick: false,
    });

    let otp = document.getElementById("pass").value;

    let obj ={
        Otp : otp
    }

    const res1 = await axios.post(server+'/otpForgetPass', obj);

    if (res1.data =="0"){
        swal("ERROR !", "OTP is incorrect. Please retry .", "error");
    }
    
    else{
        if(res1.data == "2"){
            swal("SUCCESS !", "You will be redirected to set password page in a few moments .", "success");
            setTimeout(()=>{
                window.location.href='/resetPass';
            },2000)

    
        }
    }
})
