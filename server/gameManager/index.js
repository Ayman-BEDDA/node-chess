const socketIo = require('socket.io');
const { startTimer, setPlayerTurn, games } = require('./time.js'); 

const setupGame = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('joinGame', (gameId) => {
      socket.join(gameId);

      if (!games[gameId]) {
        games[gameId] = {
          intervalId: null,
          activePlayer: 'w',
          timeWhite: 600,
          timeBlack: 600,
          gameIsActive: true,
        };
      }

      socket.on('move', (msg) => {
        io.to(gameId).emit('move', msg);
      });

      socket.on('time', (msg) => {
        io.to(gameId).emit('time', msg);
      });

      socket.on('turn', (msg) => {
        setPlayerTurn(msg.turn, gameId); 
      });

      const clientsInRoom = io.sockets.adapter.rooms.get(gameId);

      if (clientsInRoom.size === 1) {
        startTimer(io, gameId);
      }

      socket.on('disconnect', () => {
        console.log('user disconnected');
        socket.leave(gameId);
      });
    });
  });
}

module.exports = setupGame;