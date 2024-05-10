const {ChatRoom} = require('../Models/Support');
const {Message} = require('../Models/Support')



    exports.createChatRoom = async (req, res) => {
        try {
            const { userId, adminId } = req.body;
            const chatRoom = await ChatRoom.create({ participants: [userId, adminId] });
            res.status(201).json(chatRoom);
        } catch (error) {
            console.error(error);
            res.status(500).json({ status : 500, message: 'Internal server error' });
        }
    },
    exports.sendMessage = async (req, res) => {
        try {
            const { senderId, receiverId, content,chatRoomId } = req.body;
            const message = await Message.create({ sender: senderId, receiver: receiverId, content });
            //  TO UPDATE THE MESSAGE ARRAY IN THE CHATROOM
            const updatedChatRoom = await ChatRoom.findByIdAndUpdate(
                chatRoomId,
                { $push: { messages: message._id } },
                { new: true }
            );
            res.status(201).json(message);
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 500,message: 'Internal server error' });
        }
    }

    exports.getChatRoomMessages = async (req,res) => {
        try{
            const {chatRoomId}= req.body
            const chatRoom  = await ChatRoom.findById(chatRoomId).populate('messages');
            
            if(!chatRoom ) {
                res.status(404).json({
                    status: 404,
                    message : "No ChatRoom Was Found with this Id"
                })
            }
            const messages = chatRoom.messages;
            res.status(200).json( {chatRoomId :chatRoomId ,messages :messages });

        }catch (e){ 
            res.status(500).json({
                status: 500,
                message: 'Internal Server Error'
            })
        }
    }


