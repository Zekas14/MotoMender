const ChatRoom = require('../Models/Support');


    exports.createChatRoom = async (req, res) => {
        try {
            const { userId, adminId } = req.body;
            const chatRoom = await ChatRoom.create({ participants: [userId, adminId] });
            res.status(201).json(chatRoom);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    exports.sendMessage = async (req, res) => {
        try {
            const { senderId, receiverId, content } = req.body;
            const message = await Message.create({ sender: senderId, receiver: receiverId, content });
            res.status(201).json(message);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }


