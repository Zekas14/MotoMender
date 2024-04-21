const User = require('../Models/User')
const nodemailer = require('nodemailer');
//get all users 
const getAllUsers = async (req,res)=>{
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error });
    }
}
//get user By id  
const getUserbyId = async (req,res)=>{
    const id = req.params.userId;
    try {
        const user = await User.findById(id);
        if(!user) {
        res.status(404).json({messsage : "User Not Found"});

        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error });
    }
}
//register Process
const register = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });

        if(user) {
            return res.status(400).json({ error: 'Email is already in use.' });
        }
        let newUser = new User(req.body);
        await newUser.save();
        res.json({
            message: 'User Registered Successfully',
        });
    } catch (error) {
        res.status(500).json({ error: error });
    }
};
//log in Process
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
        return user.password === password;
    }
}
const logIn = async (req,res)=>{
    try {
        let user = new User(req.body);
        if (await validatePassword(user.email, user.password)) {
            res.send({
                message: "Logged In Successfully"
            });
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
//delete Account

const deleteAccount = async (req,res)=>{
    try {
        let {user} = await User.findByIdAndDelete(req.params.userId);
    res.send({
        message: "User Deleted Successfully"
    });
    } catch (error) {
        console.error(error);
        res.send({
            message: "User Deleted Failed"
        }); 
    }

}
//Update Account
const updateAccount = async (req, res) => {
    const id  = req.params.userId;
    const { name, phone, address } = req.body;

    try {
        const user = await User.findByIdAndUpdate(id,{email : req.body.email,
        name : req.body.name,
        phone : req.body.phone
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
module.exports= {
    register,
    logIn,
    deleteAccount,
    updateAccount,
    getAllUsers,
    getUserbyId 
};