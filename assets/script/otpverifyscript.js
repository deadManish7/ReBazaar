// const server="https://rebazaar.onrender.com";
const server="http://3.131.194.227";

let btn = document.getElementById("submitB");

function hideButton(){
    document.getElementById('alert').style.visibility='hidden';
    document.getElementById('closebtn').style.visibility='hidden';
}

btn.addEventListener('click', async function (e) {
    e.preventDefault();
    swal("Wait!", "Otp is being verified.", "success");

    let otp = document.getElementById("pass").value;

    let obj ={
        Otp : otp
    }
    

    const res1 = await axios.post(server+'/signup', obj);

    if (res1.data =="Incorrect"){
        swal("ERROR!", "OTP is incorrect.", "error");
    }
    
    else{
        if(res1.data == "200"){
            swal("SUCCESS!", "Signed Up Successfully.You will be redirected to login page in few moments.", "success");
            setTimeout(()=>{
                window.location.href = "/login";
            },3000);
    
        }
    }
})

