const socketIo = require('socket.io');
const { startTimer, setPlayerTurn, games } = require('./time.js');
const drawCooldownDuration = 10000;

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
          
      } else {
        socket.emit('capturedPieces', games[gameId].capturedPieces);
      }

      if (!games[gameId]) {
        games[gameId] = {
          intervalId: null,
          activePlayer: 'w',
          timeWhite: 600,
          timeBlack: 600,
          gameIsActive: true,
          capturedPieces: {
            w: [],
            b: [],
          },
          drawProposalCooldown: false,
          timeoutProposal: null
        };
      }

      socket.on('move', (msg) => {
        io.to(gameId).emit('move', msg);
      });

      socket.on('time', (msg) => {
        io.to(gameId).emit('time', msg);
      });

      socket.on('playSound', (sound) => {
          io.to(gameId).emit('playSound', sound);
      });
    
      

      socket.on('resign', ({ gameId }) => {
        clearInterval(games[gameId].intervalId);
        clearTimeout(games[gameId].timeoutProposal);
        games[gameId].gameIsActive = false;
        io.to(gameId).emit('resign');
      });

      socket.on('checkmate', ({ gameId }) => {
        clearInterval(games[gameId].intervalId);
        clearTimeout(games[gameId].timeoutProposal);
        games[gameId].gameIsActive = false;
        io.to(gameId).emit('math', 'Échec et mat, la partie est terminée.');
      });      

      socket.on('proposeDraw', () => {
        if (!games[gameId].drawProposalCooldown) {
          games[gameId].drawProposalCooldown = true;
          socket.broadcast.to(gameId).emit('drawProposed');
          games[gameId].timeoutProposal = setTimeout(() => {
            games[gameId].drawProposalCooldown = false;
          }, drawCooldownDuration);
        } else {
          socket.emit('drawProposalCooldown');
        }
      });
      
      socket.on('drawAccepted', ({ gameId }) => {
        clearInterval(games[gameId].intervalId);
        clearTimeout(games[gameId].timeoutProposal);
        games[gameId].gameIsActive = false;
        io.to(gameId).emit('drawAccepted');
      });

      socket.on('capture', (msg) => {
        games[gameId].capturedPieces[msg.color].push(msg.piece);
        io.to(gameId).emit('updateCapture', { color: msg.color, piece: msg.piece });
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
