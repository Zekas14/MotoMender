const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const dns = require('dns');
const transporter = require("../utils/transport");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const cron = require('node-cron');
const { upload, multer } = require("../utils/multer");
async function isValidDomain(domain) {
  return new Promise((resolve) => {
      dns.resolve(domain, 'MX', (err) => {
          if (err) {
              resolve(false); 
          } else {
              resolve(true); 
          }
      });
  });
};
const generateSecretKey = () => {
  return crypto.randomBytes(16).toString("hex");
};
const createToken = (payload) => {
  return jwt.sign({ userId: payload }, process.env.SECRET_KEY, {
    expiresIn: "3h",
  });
};
 const signUpWithGoogle = async(req,res)=>{
  try {
    console.log("test");
    res.send({
      message : "AZ"
    })
  } catch (error) {
    
  }
 }
// Register Process
const register = async (req, res) => {
  try {
    const userEmail = req.body.email;
    const domain = userEmail.split('@')[1];
    const isDomainValid = await isValidDomain(domain);
    if (!isDomainValid) {
      return res.status(400).json({
        status: 400,
        message: "Invalid email domain."
      });
    }
    let user = await User.findOne({ email: userEmail });
    if (user) {
      return res.status(400).json({
        status: 400,
        message: "Email is already in use." 
      });
    }
    const verifyEmail = generateOTP();
    transporter.sendMail({
      from: "ahmedzrks123@gmail.com",
      to: userEmail,
      subject: "Verifying Email Request",
      html: `Your Code for Verifying Email is: ${verifyEmail}. This Code is valid for 5 minutes. Do not share it with anyone.`,
    });

    user = new User({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      emailVerify: verifyEmail
    });
    const token = createToken(user._id);
    user.password = req.body.password;
    console.log(user.isModified("password"));
    await user.save();
    cron.schedule('*/30 * * * *', async () => {
      await User.updateOne({ _id: user._id }, { $unset: { emailVerify: 1 } });
    }, {
      scheduled: true,
    });
    res.json({
      status: 200,
      message: "Verification code sent to your email. Please check and verify.",
      user,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};


//upload Profile image
const uploadProfileImage = (req, res) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      console.error(err);
      return res.status(500).json({ error: "File upload error" });
    } else if (err) {
      return res.status(500).json({ error: err.message });
    }

    try {
      const user = await User.findById(req.params.userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      user.profileImage = req.file.path;
      await user.save();
      res.json({ message: "Profile image uploaded successfully", user });
    } catch (error) {
      console.error("Error uploading profile image:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
};
// Log in Process

async function validateEmail(email) {
  try {
    let user = await User.findOne({ email: email });
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
}
async function validatePassword(email, password) {
  let user = await validateEmail(email);
  if (user != null) {
    return await bcrypt.compare(password, user.password);
  } else {
    return false;
  }
}
const isVerified= (user)=>{
  return user.isVerified;
}

const logIn = async (req, res) => {
  try {
    if (await validatePassword(req.body.email, req.body.password)) {
      let user = await User.findOne({ email: req.body.email });
      const token = createToken(user._id);
      console.log(jwt.decode(token));
      if (user.isBlocked) {
        return res.json({ message: "User Is Blocked " });
      }
      if(!isVerified(user)){
        return res.status(400).json({
          status : 400,
          message : "Email is Not Verified"
        })
      }
      console.log();
      res.status(200).json({ status:200,message: "logged in Successfully", user, token });
    } else {
      res.status(404).send({
        status: 404,
        message: "Wrong Email Or Password",
      });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send({
      status: 500,
      message: "Internal Server Error",
    });
  }
};
const resendEmailVerification= async (req,res)=>{
  try {
    let user = await User.findOne({ email: req.params.email });
    if(!user){
      return res.status(404).json({
        status : 404,
        message : "User Not Found"
      })
    }  
  const verifyEmailCode = generateOTP();
  transporter.sendMail({
    from: "ahmedzrks123@gmail.com",
    to: user.email,
    subject: "Verifying Email Request",
    html: `Your Code for Verifying Email is: ${verifyEmailCode}. This Code is valid for 5 minutes. Do not share it with anyone.`,
  });
  res.status(200).json({
    status : 200,
    emailVerifyCode : verifyEmailCode
  })
  } catch (error) {
    
  }
}
// Delete Account
const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.send({
      message: "Account Deleted Successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "User Deletion Failed",
    });
  }
};

// Update Account
const updateAccount = async (req, res) => {
  const id = req.params.userId;
  const { name, phone, address } = req.body;

  try {
    const user = await User.findByIdAndUpdate(id, {
      email: req.body.email,
      name: req.body.name,
      phone: req.body.phone,
    });

    if (!user) {
      return res.status(404).json({ status : 404,message: "User not found" });
    }
    res.json({ message: "Account updated successfully", user });
  } catch (error) {
    console.error("Error updating account:", error);
    res.status(500).json({status: 500,
       message: "Internal Server Error" });
  }
};
const generateOTP = () => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  return otp.toString();
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email :email });
    if (!user) {
      return res.status(404).json({ 
        status : 404,
        message: "User not found"
       });
    }
    const token = crypto.randomBytes(20).toString("hex");
    const otp = generateOTP();

    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = Date.now() + 3600000;
    await user.save();

    await transporter.sendMail({
      from: "ahmedzrks123@gmail.com",
      to: user.email,
      subject: "Password Reset Request",
      html: `Your OTP for password reset is: ${otp}. This OTP is valid for 5 minutes. Do not share it with anyone.`,
    });
 
    res.json({ otp : otp});
  } catch (error) {
    console.error("Error sending password reset email:", error);
    res.status(500).json({ 
      status: 500,
      message : "Internal Server Error"
     });
  }
};

//reset Password
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({ status:404,message: "Email, OTP, and new password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ status:404,message: "User not found" });
    }
    if (user.resetPasswordOTP !== otp) {
      return res.status(400).json({status:404,message: "Invalid OTP" });
    }
    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ status:404,message: "OTP has expired" });
    }

    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: "New Password Added successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ status:500,message: "Internal Server Error" });
  }
};
//USER update password when logged in
const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!(await bcrypt.compare(req.body.currentPassword, user.password))) {
      return res.status(400).json({ error: "Password is incorrect" });
    }
  } catch (error) {
    console.error("Error updating password:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Authorization
// Protect Route
const protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({ error: "Not authorized to access" });
    }
    const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: "invalid signature" });
  }
};

// Restrict Route
const retrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "You do not have permission" });
    }
    next();
  };
};

module.exports = {
  register,
  logIn,
  deleteAccount,
  updateAccount,
  resetPassword,
  forgetPassword,
  uploadProfileImage,
  updatePassword,
  resendEmailVerification,
  signUpWithGoogle,
  protect,
  retrictTo,
};
