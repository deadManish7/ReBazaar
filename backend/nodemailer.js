const nodemailer = require("nodemailer");

module.exports.sendMail=async function sendMail(str,data) {

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", 
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "rebazaar1@gmail.com", // generated gmail user
      pass: "xewldppugvzzibqp", // generated gmail password
    },
  });

let subjectM ,textM, htmlM;  

if(str == "signup"){
    subjectM = `Thank you for signing ${data.Name}`;
    htmlM = `<pre><h1>Welcome to ReBazaar</h1><h3>Greetings ${data.Name} ! We wish you a good time on our Website. Happy Shopping 🛒

Your credentials are :

Email - ${data.Email}
Password - ${data.Password}


With Regards, 
Team ReBazaar</h3></pre>`
        }

let info = await transporter.sendMail({
    from : 'ReBazaar "<rebaazarma@gmail.com>"',
    to : data.Email,
    subject : subjectM,
    html : htmlM

});

}
       

module.exports.otpMail = async function otpMail(email){

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com", 
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: "rebazaar1@gmail.com", // generated gmail user
          pass: "xewldppugvzzibqp", // generated gmail password
        },
      });

    let subjectM = "OTP verification";
    let otp =Math.floor((Math.random() * 10000) + 1000);
    let htmlM = `<pre><h2>Your OTP is : ${otp}</h2><h3>With Regards, 
Team ReBazaar</h3></pre>`;



    let info = await transporter.sendMail({
        from : 'ReBazaar "<rebaazarma@gmail.com>"',
        to : email,
        subject : subjectM,
        html : htmlM
});

    return otp;

}

module.exports.sendPassChangeMail=async function sendPassChangeMail(data) {

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", 
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "rebazaar1@gmail.com", // generated gmail user
      pass: "xewldppugvzzibqp", // generated gmail password
    },
  });

let subjectM ,textM, htmlM;  

    subjectM = `Password Change`;
    htmlM = `<pre><h1>Welcome to ReBazaar</h1><h3>Greetings ${data.Name}! Your credentials have been changed .

Your new credentials are : 

Email - ${data.Email}
Password - ${data.Password}

With Regards, 
Team ReBazaar</h3></pre>`;

let info = await transporter.sendMail({
    from : 'ReBazaar "<rebaazarma@gmail.com>"',
    to : data.Email,
    subject : subjectM,
    html : htmlM

});

}  

module.exports.deleteUserMail=async function deleteUserMail(data) {

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", 
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "rebazaar1@gmail.com", // generated gmail user
      pass: "xewldppugvzzibqp", // generated gmail password
    },
  });

let subjectM ,textM, htmlM;  

    subjectM = `Account Deletion`;
    htmlM = `<pre><h1>Welcome to ReBazaar</h1><h3>Greetings ${data.Name} ! Your account has been deleted.</h3
<h3>We feel sorry to not live upto your expectations . We wish you happy future endeavors.

With Regards,
Team ReBazaar</h3></pre>`

let info = await transporter.sendMail({
    from : 'ReBazaar "<rebaazarma@gmail.com>"',
    to : data.Email,
    subject : subjectM,
    html : htmlM

});


}  

module.exports.sellRequestMail=async function sellRequestMail(item,user) {

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", 
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "rebazaar1@gmail.com", // generated gmail user
      pass: "xewldppugvzzibqp", // generated gmail password
    },
  });

let subjectM ,textM, htmlM;  

    subjectM = `Sell Request Received`;
    htmlM = `<pre><h1>Welcome to ReBazaar</h1>
<h3>Greetings ${user.Name} ! Your sell request has been received . We will reach back to you after verification . Thanks for your trust and support .


Your item details are :

Name - ${item.Name}
Price - ${item.Price}
Description - ${item.Description}
Category - ${item.Category}


With Regards, 
Team ReBazaar</h3></pre>`


let info = await transporter.sendMail({
    from : 'ReBazaar "<rebaazarma@gmail.com>"',
    to : user.Email,
    subject : subjectM,
    html : htmlM

});

} 

module.exports.adminVerifyMail=async function adminVerifyMail(item) {

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", 
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "rebazaar1@gmail.com", // generated gmail user
      pass: "xewldppugvzzibqp", // generated gmail password
    },
  });

let subjectM ,textM, htmlM;  

    subjectM = `Sell Request Received`;
    htmlM = `<pre><h1>Welcome to ReBazaar</h1>
            <br><h3>Greetings admin ! A sell request has been received . Please verify it asap .</h3>
        <h4>The item details are :

            Name - ${item.Name}
            Price - ${item.Price}
            Description - ${item.Description}
            Category - ${item.Category}</h4>
        <h3>With Regards, 
            Team ReBazaar</h3></pre>`


let info1 = await transporter.sendMail({
    from : 'ReBazaar "<rebaazarma@gmail.com>"',
    to : "deadmanish7@gmail.com",
    subject : subjectM,
    html : htmlM

});

let info2 = await transporter.sendMail({
    from : 'ReBazaar "<rebaazarma@gmail.com>"',
    to : "12111080@nitkkr.ac.in",
    subject : subjectM,
    html : htmlM

});

}  

module.exports.afterVerifyMail=async function afterVerifyMail(item,user) {

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", 
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "rebazaar1@gmail.com", // generated gmail user
      pass: "xewldppugvzzibqp", // generated gmail password
    },
  });

let subjectM ,textM, htmlM;  

    subjectM = `Sell Request Approved`;
    htmlM = `<pre><h1>Welcome to ReBazaar</h1>
<h3>Greetings ${user.Name} ! Your sell request has been approved. You can see your item on our website. Thanks for your trust and support.


The item details are :

Name - ${item.Name}
Price - ${item.Price}
Description - ${item.Description}
Category - ${item.Category}


With Regards, 
Team ReBazaar</h3></pre>`


let info1 = await transporter.sendMail({
    from : 'ReBazaar "<rebaazarma@gmail.com>"',
    to : user.Email,
    subject : subjectM,
    html : htmlM

});

}  
    
    