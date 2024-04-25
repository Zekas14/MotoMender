const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const transporter = require('../utils/transport')
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Generate a random secret key
const generateSecretKey = () => {
  return crypto.randomBytes(32).toString('hex'); // Generate a 256-bit (32-byte) key and convert it to hexadecimal format
};
const createToken = (payload)=>
  jwt.sign({userId : payload},generateSecretKey(),{
    expiresIn :"3h"
})

// Register Process
const register = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });

        if (user) {
            return res.status(400).json({ error: 'Email is already in use.' });
        }   
         user = new User({
            name :req.body.name,
            phone :req.body.phone,
            email :req.body.email,
            address : req.body.address
        });
        const token =createToken(user._id);
        user.password = await bcrypt.hash(req.body.password, 10); // Hashing the password
        await user.save();
        res.json({
            message: 'User Registered Successfully',
            user,
            token:token
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Log in Process
async function validateEmail(email){
    try {
        let user = await User.findOne({email : email});
        return user;
    } catch (error) {
        console.log(error);
        return null;
    }
}
async function validatePassword(email,password){
    let user =await validateEmail(email);
    if(user!=null) {
        return  await bcrypt.compare(password, user.password);

    }else {
        return false;
    }
}
const logIn = async (req,res)=>{
    try {
        let user = new User(req.body);
        
        if (await validatePassword(user.email, user.password)) {
            const token =createToken(user._id);
            user = await User.findOne({ email: user.email });
            if(user.isBlocked) {
                return res.json({message : "User Is Blocked "});
            }
            res.json({message : "logged in Successfully" , user,token});
        } else {
            res.status(404).send({
                message: "Wrong Email Or Password"
            });
        }
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).send({
            message: "Internal Server Error"
        });
    }
}

// Delete Account
const deleteAccount = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.send({
            message: 'Account Deleted Successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'User Deletion Failed'
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
            phone: req.body.phone
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'Account updated successfully', user });
    } catch (error) {
        console.error('Error updating account:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
const generateOTP = () => {
    const otp = Math.floor(1000 + Math.random() * 9000);
    return otp.toString();
};

const forgetPassword = async(req,res)=> {
try {
        const {email} =req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const token = crypto.randomBytes(20).toString('hex');    
        const otp = generateOTP();

        user.resetPasswordOTP =otp;
        user.resetPasswordExpires = Date.now() + 3600000; 
        await user.save();
    
        await transporter.sendMail({
            from: 'ahmedzrks123@gmail.com',
            to: user.email,
            subject: 'Password Reset Request',
            html: `Your OTP for password reset is: ${otp}. This OTP is valid for 5 minutes. Do not share it with anyone.`
        });
    
        res.json({ message: "OTP has been sent to your email" });
    
} catch (error) {
    console.error("Error sending password reset email:", error);
    res.status(500).json({ error: "Internal Server Error" });
}
}
//reset Password
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ error: "Email, OTP, and new password are required" });
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
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.json({ message: "New Password Added successfully" });
    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};  

module.exports = {
    register,
    logIn,
    deleteAccount,
    updateAccount,
    resetPassword,
    forgetPassword,
};
