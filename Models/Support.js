const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
    chatRoomId: {
        type: String,
        default: function () {
          return this._id.toHexString();
        },
        alias: "_id",
      },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now } ,
    messages :  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' ,required : [true, 'ChatRoomId is requierd']}]
});
const messageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

 exports.ChatRoom = mongoose.model('ChatRoom', chatRoomSchema);
 exports.Message = mongoose.model('Message', messageSchema);
 

