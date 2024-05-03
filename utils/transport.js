const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "ahmedzrks123@gmail.com",
    pass: "onoc bhxg xbur kpih",
  },
});

// Test the transporter
transporter.verify(function (error, success) {
  if (error) {
    console.error("Error verifying transporter:", error);
  } else {
    console.log("Transporter is ready to send emails");
  }
});

module.exports = transporter;
