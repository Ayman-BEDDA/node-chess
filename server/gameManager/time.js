let games = {}; // new object to store state for each game

const gameOver = (io, player, gameId) => {
  if (games[gameId].intervalId) {
    clearInterval(games[gameId].intervalId);
    clearTimeout(games[gameId].timeoutProposal);
  }
   
  
  games[gameId].gameIsActive = false;
  io.to(gameId).emit('gameOver', player);
}

const startTimer = (io, gameId) => {
  if (games[gameId].intervalId) {
    clearInterval(games[gameId].intervalId);
  }
  games[gameId].intervalId = setInterval(() => {
    if(games[gameId].gameIsActive){
      if (games[gameId].activePlayer === 'b') {
        games[gameId].timeBlack--;
        if (games[gameId].timeBlack < 0) {
          gameOver(io, 'b', gameId);
        }
        io.to(gameId).emit('time', { type: 'black', time: games[gameId].timeBlack }); 
      } else {
        games[gameId].timeWhite--;
        if (games[gameId].timeWhite < 0) {
          gameOver(io, 'w', gameId);
        }
        io.to(gameId).emit('time', { type: 'white', time: games[gameId].timeWhite }); 
      }
    }
  }, 1000);
}

const setPlayerTurn = (turn, gameId) => {
  games[gameId].activePlayer = turn;
}

module.exports = {
  startTimer,
  setPlayerTurn,
  games // export games so it can be used in index.js
};
