const nodemailer = require("nodemailer");

<<<<<<< HEAD

const transporter =
 nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ahmedzrks123@gmail.com',
        pass: 'cgpn rpnh qixb gkux',
        
         }
});

transporter.verify(function(error, success) {
    if (error) {
        console.error("Error verifying transporter:", error);
    } else {
        console.log("Transporter is ready to send emails");
    }
=======
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ahmedzrk123@gmail.com",
    pass: "cgpn rpnh qixb gkux",
  },
});

// Test the transporter
transporter.verify(function (error, success) {
  if (error) {
    console.error("Error verifying transporter:", error);
  } else {
    console.log("Transporter is ready to send emails");
  }
>>>>>>> a38d7e4cde7c54ed6600580351ecb9d7cc037026
});

module.exports = transporter;
