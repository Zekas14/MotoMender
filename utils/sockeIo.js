const { Server } = require('socket.io');
const SupportServices = require('../Apis/SupportServices');

function initializeSocket(server) {
  let admins = [];
  let activeRooms = {}; // Map user ID to their private room ID

  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('adminActive', () => {
      admins.push(socket.id);
      console.log('Admin is now active:', socket.id);
    });

    socket.on('joinRoom', () => {
      if (admins.length > 0) {
        const adminId = admins[0];
        const roomId = generateUniqueRoomId(adminId, socket.id);
        console.log(`The ChatRoomId is ${roomId} and the admin Is ${adminId}`)
        activeRooms[adminId]=roomId
        console.log(activeRooms);

        activeRooms[socket.id] = roomId; // Store user-room association
        console.log(activeRooms);

        socket.join(roomId);
        socket.to(adminId).emit('userJoined', socket.id);
      } else {
        socket.emit('error','No Admins Avilable Now')
      }
    });
    socket.on('adminJoin',()=>{
        const roomId = activeRooms[socket.id];
        admins = admins.filter(id => id !== socket.id); // Remove admin from available list after pairing

        socket.join(roomId);
    })

    socket.on('message', (data) => {
      const { sender, receiver, content } = data;
      const roomId = activeRooms[socket.id];
      if (roomId) {
        socket.to(roomId).emit('message', {
          sender: sender,
          receiver: receiver,
          content: content,
          timestamp: new Date(),
        });
      } else {
        // Handle case where message is sent outside a private room
      }
    });

    socket.on('typing', (data) => {
      const roomId = activeRooms[socket.id];
      console.log('User typing:', roomId);
        socket.to(roomId).emit('typing', data);
      
    });

    socket.on('stopTyping', (data) => {
      console.log('User stopped typing:', data);
      const roomId = activeRooms[socket.id];
      if (roomId) {
        socket.to(roomId).emit('stopTyping', data);
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
      const roomId = activeRooms[socket.id];
      if (roomId) {
        delete activeRooms[socket.id]; // Remove user from room association
        socket.to(roomId).emit('sessionEnd'); // Notify admin about user leaving
      }
    });
  });

  return io;
}

module.exports = initializeSocket;

function generateUniqueRoomId(adminId, userId) {
    // Combine admin and user IDs with a separator
    const separator = '_';
    return `${adminId}${separator}${userId}`;
  }
