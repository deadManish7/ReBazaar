const server="https://rebazaar.onrender.com/";

function hideButton(){
    document.getElementById('alert').style.visibility='hidden';
    document.getElementById('closebtn').style.visibility='hidden';
}

let btn = document.getElementById("submitB");

btn.addEventListener('click', async function (e) {

    e.preventDefault();
    
    alertT("WAIT : Please wait. Otp is being verified.");
    document.getElementById('alert').style.visibility = 'visible';
    document.getElementById('closebtn').style.visibility = 'visible';

    let otp = document.getElementById("pass").value;

    let otpData ={
        Otp : otp
    }

    const res1 = await axios.post(server+'/otpForgetPass', otpData);

    // Notations Used
    // 0 = Incorrect OTP
    // 2 = Correct OTP

    if (res1.data =="0"){
        alertT("ERROR : OTP is incorrect.");

        document.getElementById('alert').style.visibility = 'visible';
        document.getElementById('closebtn').style.visibility = 'visible';
    }
    
    else{
        if(res1.data == "2"){
                alertT("WAIT : Please wait. You will be redirected to password updation page in few moments.")
                document.getElementById('alert').style.backgroundColor="#0000FF";
                document.getElementById('alert').style.visibility = 'visible';
                document.getElementById('closebtn').style.visibility = 'visible';
                window.location.href='/resetPass';
    
        }
    }
})

function alertT(a){
    document.getElementById('alert').innerHTML = a+`<div class="button-div"><button type="button" id="closebtn" onclick="hideButton()"><b>&times;</b></button></div>`
}
