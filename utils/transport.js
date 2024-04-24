const nodemailer = require('nodemailer');


const transporter =
 nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ahman.ayman765@gmail.com',
        pass: 'zdmb redx vykl kjng'
         }
});

// Test the transporter
transporter.verify(function(error, success) {
    if (error) {
        console.error("Error verifying transporter:", error);
    } else {
        console.log("Transporter is ready to send emails");
    }
});

module.exports = transporter;
