const nodemailer = require("nodemailer");

module.exports.chatRemindMail=async function chatRemindMail(user) {

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", 
    port: 465,
    secure: true, // true for 465, false for 587 and other ports
    auth: {
      user: "rebazaar2@gmail.com", // generated gmail user
      pass: "iqfqqxpuyduqrrrz", // generated gmail password
    },
  });

let subjectM ,textM, htmlM;  

    subjectM = `Unread Messages`;
    htmlM = `<pre><h2>Greetings ${user.Name} !<h2><h3>You have unread messages in your inbox. Please check when you have time .

Click this link for accessing our website https://rebazaar.store .

With Regards, 
Team ReBazaar</h3></pre>`
        

let info = await transporter.sendMail({
    from : 'ReBazaar Chats"<rebaazar2@gmail.com>"',
    to : user.Email,
    subject : subjectM,
    html : htmlM

});

}
       