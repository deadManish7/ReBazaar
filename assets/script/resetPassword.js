const server="https://rebazaar4.onrender.com";
// const server="https://rebazaar.store";

let btn = document.getElementById("submitB");

btn.addEventListener('click', async function (e) {
    e.preventDefault();

    swal({
        title: "Please Wait ",
        icon: "info",
        text: "Password is being updated.",
        buttons: false,
        allowOutsideClick: false,
    });


    let password1 = document.getElementById('pass').value;
    let confirmPassword1 = document.getElementById('pass1').value;

    if(password1.length<8){
        swal("ERROR !", "Password length is less than 8 characters.", "error");
    }
 
    else if(password1 != confirmPassword1){
        swal("ERROR !", "Password and Confirm Password are not same.", "error");
    }

    else{
        let userData = {
            Password: password1
        }

        const res1 = await axios.post(server+'/resetPass', userData);


        if(res1.data =="2"){
            swal("SUCCESS !", "Password Updated Successfully. Please login .", "success");
            setTimeout(()=>{
                window.location.href='/login';
            },2000)

        }

        else{
            swal("ERROR !", "Password not updated due to some technical error. Please retry after some time.", "error");
            setTimeout(()=>{
                window.location.href='/login';
            },2000)

        }
        
    }
})

function alertT(a){
    document.getElementById('alert').innerHTML = a+`<div class="button-div"><button type="button" id="closebtn" onclick="hideButton()"><b>&times;</b></button></div>`
}