const{ Server} = require('socket.io');

function initializeSocket(server) {
    const io = new Server(server);

    // Socket.IO connection event
    io.on('connection', (socket) => {
        console.log('A user connected');

        // Handle disconnection event
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });

        // Handle message event
        socket.on('message', (data) => {
            console.log('Message received:', data);
            io.emit('message', data);
        });

        socket.on('typing', (data) => {
            console.log('User typing:', data);
            socket.broadcast.emit('typing', data);
        });
        socket.on('stopTyping', (data) => {
            console.log('User stopped typing:', data);
            socket.broadcast.emit('stopTyping', data);
        });
    });

    return io;
}

module.exports = initializeSocket;
