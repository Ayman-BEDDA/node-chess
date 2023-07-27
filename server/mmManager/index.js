const socketIo = require('socket.io');

let io;

const setupMm = (server) => {
  io = socketIo(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
    }
    });
    io.on('connection', (socket) => {
        
    });
}

module.exports =  setupMm ;
