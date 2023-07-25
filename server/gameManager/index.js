const socketIo = require('socket.io');
const { startTimer, setPlayerTurn } = require('./time.js');

const setupGame = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:5173", // Remplacez cette URL par l'URL de votre application client
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('move', (msg) => {
      io.emit('move', msg);
    });

    socket.on('time', (msg) => {
      io.emit('time', msg);
    });

    socket.on('turn', (msg) => {
      setPlayerTurn(msg.turn);
    });

    if (io.engine.clientsCount === 1) {
      startTimer(io);
    }

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
}

module.exports = setupGame;
