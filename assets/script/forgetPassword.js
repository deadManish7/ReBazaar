const server="https://rebazaar4.onrender.com";
// const server="https://rebazaar.store";

function ValidateEmail(input) {
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (input.match(validRegex)) {
        return true;

    } else {
        return false;
    }
}

function hideButton() {
    document.getElementById('alert').style.visibility = 'hidden';
    document.getElementById('closebtn').style.visibility = 'hidden';
}


let btn = document.getElementById("submitB");

btn.addEventListener('click', async function (e) {
    e.preventDefault();


    swal({
        title: "Please Wait ",
        icon: "info",
        text: "OTP is being sent. We thank you for your patience.",
        allowOutsideClick: false,
        buttons: false,
    });

    let email1 = document.getElementById('name1').value;

    if (ValidateEmail(email1) == false) {
        swal("OOPS ! ", "Email id is not valid . Please check .", "error");
    }

    else {
        let userData = {
            Email: email1,
        }

        const res1 = await axios.post(server+'/forgetPass', userData);

        // Defining notations used

        // 0 = email not registerd
        // 2 = otp sent

        if (res1.data == "0") {
            swal("ERROR ! ", "Email Id is not registered. Please sign up .", "error");
        }

        else if (res1.data == "2") {
            swal({
                title: "Please Wait ",
                icon: "info",
                text: "You will be redirected to OTP page in few moments.",
                buttons: false,
                allowOutsideClick: false,
            });
            setTimeout(() => {
                window.location.href = "/otpForgetPass";
            }, 2000);


        }

        else {
            
        }

    }
})

