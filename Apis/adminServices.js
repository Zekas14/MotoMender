const User = require('../Models/User')
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
const getOneUser = async (req,res)=>{
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

const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.send({
            message: 'User Deleted Successfully'
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            message: 'User Deletion Failed'
        });
    }
};
const blockUser = async (req,res) => {
    const id = req.params.userId;   
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.updateOne({isBlocked: !user.isBlocked})
        
        res.json({ message: `${user.name} ${user.isBlocked ? "Unblocked" : "Blocked" }`});
    } catch (error) {
        console.error('Error updating account:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

} 
module.exports = {
    getAllUsers,
    getOneUser,
    deleteUser,
    blockUser,
}