const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// Register Process
const register = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });

        if (user) {
            return res.status(400).json({ error: 'Email is already in use.' });
        }   
        let newUser = new User(req.body);
        newUser.password = await bcrypt.hash(req.body.password, 10); // Hashing the password
        await newUser.save();
        res.json({
            message: 'User Registered Successfully',
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Log in Process
const logIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if(user.isBlocked ==true ){
            return res.status(400).json({ message: 'User Is Blocked' });
            
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Wrong Email Or Password' });
        }

        res.json({
            message: 'Logged In Successfully',

            user
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

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

module.exports = {
    register,
    logIn,
    deleteAccount,
    updateAccount,
};
