const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const transporter = require("../utils/transport");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { upload, multer } = require("../utils/multer");

const generateSecretKey = () => {
  return crypto.randomBytes(16).toString("hex");
};
const createToken = (payload) => {
  return jwt.sign({ userId: payload }, process.env.SECRET_KEY, {
    expiresIn: "3h",
  });
};
// Register Process
const register = async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      return res.status(400).json({ error: "Email is already in use." });
    }
    user = new User({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
    });
    const token = createToken(user._id);
    user.password = req.body.password;
    console.log(user.isModified("password"));
    await user.save();
    res.json({
      message: "User Registered Successfully",
      user,
      token: token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
const logIn = async (req, res) => {
  try {
    if (await validatePassword(req.body.email, req.body.password)) {
      let user = await User.findOne({ email: req.body.email });
      const token = createToken(user._id);
      console.log(jwt.decode(token));
      if (user.isBlocked) {
        return res.json({ message: "User Is Blocked " });
      }
      console.log();
      res.json({ message: "logged in Successfully", user, token });
    } else {
      res.status(404).send({
        message: "Wrong Email Or Password",
      });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send({
      message: "Internal Server Error",
    });
  }
};

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
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "Account updated successfully", user });
  } catch (error) {
    console.error("Error updating account:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const generateOTP = () => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  return otp.toString();
};

const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
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

    res.json({ message: "OTP has been sent to your email" });
  } catch (error) {
    console.error("Error sending password reset email:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
//reset Password
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res
        .status(400)
        .json({ error: "Email, OTP, and new password are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.resetPasswordOTP !== otp) {
      return res.status(400).json({ error: "Invalid OTP" });
    }
    if (user.resetPasswordExpires < Date.now()) {
      return res.status(400).json({ error: "OTP has expired" });
    }

    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
    res.json({ message: "New Password Added successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
  protect,
  retrictTo,
};
