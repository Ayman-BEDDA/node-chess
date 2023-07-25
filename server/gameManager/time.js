let intervalId = null;
let activePlayer = 'w';

let timeWhite = 600;
let timeBlack = 600;
let gameIsActive = true;

const gameOver = (io, player) => {
  if (intervalId) {
      clearInterval(intervalId);
  }
  gameIsActive = false;
  io.emit('gameOver', player);
}

const startTimer = (io) => {
  if (intervalId) {
      clearInterval(intervalId);
  }
  intervalId = setInterval(() => {
      if(gameIsActive){
          if (activePlayer === 'b') {
              timeBlack--;
              if (timeBlack <= 0) {
                  gameOver(io, 'Noir');
              }
              io.emit('time', { type: 'black', time: timeBlack }); 
          } else {
              timeWhite--;
              if (timeWhite <= 0) {
                  gameOver(io, 'Blanc');
              }
              io.emit('time', { type: 'white', time: timeWhite }); 
          }
      }
  }, 1000);
}

const setPlayerTurn = (turn) => {
  activePlayer = turn;
}

module.exports = {
  startTimer,
  setPlayerTurn,
};