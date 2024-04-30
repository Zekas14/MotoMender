const nodemailer = require("nodemailer");

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
});

module.exports = transporter;
