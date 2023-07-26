<script setup>
import { onMounted, ref, inject } from 'vue';
//import $ from "jquery";
import '../assets/chessboard-1.0.0.min.css'
import Chess from '../assets/chess'
import Chessboard from '../assets/chessboard-1.0.0.js'
import { io } from "socket.io-client";
import { useRoute } from 'vue-router';

//window.$ = window.jQuery = $;

let intervalId = ref(null);
let gameIsActive = ref(true);
let socket = ref(null);
let timeBlack = ref(600); 
let timeWhite = ref(600);
const userColor = inject('userColor');
const gameExists = inject('gameExists');
const gameId = inject('gameId');

const formatTime = (seconds) => {
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

const gameOver = (player) => {
    clearInterval(intervalId);
    alert('Fin de la partie, ' + player + ' est à court de temps.');
    let winner = gameExists.value.WhiteUserID;
    if(player == "w"){
      winner = gameExists.value.BlackUserID;
    }
    gameIsActive = false;
    fetchWinner(winner);
}

let game = ref(new Chess());

const updateStatus = () => {
    var status = '';

    var moveColor = 'Blanc';
    if (game.value.turn() === 'b') {
        moveColor = 'Noir';
    }

    if (game.value.in_checkmate()) {
        status = 'Fin de la partie, ' + moveColor + ' est en échec et mat.';
    } else if (game.value.in_draw()) {
        status = 'Fin de la partie, match nul.';
    } else {
        status = moveColor + ' à jouer';
        if (game.value.in_check()) {
            status += ', ' + moveColor + ' est en échec';
        }
    }

    if (game.value.game_over()) {
        gameIsActive = false;

        // Détermination du gagnant
        let winnerId = null;
        if (game.value.in_checkmate()) {
            winnerId = game.value.turn() === 'b' ? gameExists.value.WhiteUserID : gameExists.value.BlackUserID;
        }

        fetchWinner(winnerId);
        
    }
}

const fetchWinner = (winner) => {
  fetch(`http://localhost:3000/games/${gameId.value}`, {
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          GameStatus: 'end',
          Winner: winner
      })
  }).then(response => {
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
  }).catch(e => {
      console.error('There was a problem with the fetch operation: ' + e.message);
  });
}

const taken = (color, piece) => {
  var pieceElement = document.createElement('img');
    pieceElement.src = '/src/assets/chesspieces/wikipedia/' + color + '' + piece + '.png';
    let id = "black_piece";
    if(color == "b"){
        id = "white_piece";
    }
    document.getElementById(id).appendChild(pieceElement);
}


const onDrop = (source, target) => {
    if (!gameIsActive.value) {
        return 'snapback';
    }

    const piece = game.value.get(source);
    if (piece && piece.color !== userColor.value) {
        return 'snapback';
    }

    var move = game.value.move({
        from: source,
        to: target,
        promotion: 'q'
    });

    if (move === null) {
        return 'snapback';
    }else if (move.flags.indexOf('k') !== -1 || move.flags.indexOf('q') !== -1) {
        var isKingSide = move.flags.indexOf('k') !== -1;
        var finalConfig = {};

        finalConfig[(isKingSide ? 'f' : 'd') + move.to.charAt(1)] = isKingSide ? 'wR' : 'wR';
        finalConfig[(isKingSide ? 'h' : 'a') + move.to.charAt(1)] = null;

        board.value.position(game.value.fen(), false);
        board.value.position($.extend(true, {}, board.value.position(), finalConfig), false);
    }

    socket.value.emit('move', move);
    socket.value.emit('turn', { turn: game.value.turn() });

    if(move.captured){
        var color = move.color === 'w' ? 'b' : 'w';

        socket.value.emit('capture', { color: color, piece: move.captured.toUpperCase() });
    }
    fetch(`http://localhost:3000/games/${gameId.value}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "fen": game.value.fen()
        }),
    }).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    }).catch(e => {
        console.error('There was a problem with the fetch operation: ' + e.message);
    });

    updateStatus();
}

const resign = () => {
  let winner = userColor.value == 'w' ? gameExists.value.BlackUserID : gameExists.value.WhiteUserID;
  fetchWinner(winner);
  gameIsActive.value = false;
  socket.value.emit('resign', { gameId: gameId.value });
}

const onSnapEnd = () => {
    board.value.position(game.value.fen());
}
const getChessboard = (board) =>{
    var fenParts = board.split(' ');
    return fenParts[0];
}

let orientation = "white";

if(userColor.value == "b"){
    orientation = "black";
}

const config = {
    draggable: true,
    orientation: orientation,
    position: getChessboard(gameExists.value.fen),
    pieceTheme: '/src/assets/chesspieces/wikipedia/{piece}.png',
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
}

let board = ref(null);

onMounted(() => {
    game.value.load(gameExists.value.fen);
    board.value = Chessboard('board', config);

    socket.value = io("http://localhost:3000");

    let route = useRoute(); 
    let gameId = route.params.gameId;
    socket.value.emit('joinGame', gameId);

    socket.value.on('updateCapture', function (msg) {
        taken(msg.color, msg.piece);
    });

    socket.value.on('move', function (msg) {
        let move = game.value.move(msg);

        if (move === null) {
            return 'snapback';
        }

        board.value.position(game.value.fen());

        updateStatus();
    });

    socket.value.on('resign', function () {
      gameIsActive.value = false;
      alert("L'autre joueur a abandonné. Vous avez gagné la partie.");
    });

    socket.value.on('time', function (msg) {
        if (msg.type === 'black') {
            timeBlack.value = msg.time;
            document.getElementById('time_black').textContent = formatTime(timeBlack.value);
        } else {
            timeWhite.value = msg.time;
            document.getElementById('time_white').textContent = formatTime(timeWhite.value);
        }
    });

    socket.value.on('gameOver', function (player) {
        gameOver(player);
    });

    $(window).resize(function () {
        board.value.resize();
    }).resize();
});
</script>

<template>
    <div id="game_container" class="game_container">
      <div class="player" id="black_player">
        <div class="piece" id="black_piece"></div>
        <div class="pic-pseudo">
          <img src="../assets/default_pic.jpg" alt="">
          <span class="player_name">Black player</span>
          <div class="player_rating">(500)</div>
          <div class="timer" id="time_black">10:00</div>
        </div>
      </div>
      <div class="board_container">
        <div id="board">
        </div>
      </div>
      <div class="player" id="white_player">
        <div class="piece" id="white_piece"></div>
        <div class="pic-pseudo">
          <img src="../assets/default_pic.jpg" alt="">
          <span class="player_name">White player</span>
          <div class="player_rating">(500)</div>
          <div class="timer" id="time_white">10:00</div>
        </div>
      </div>
    </div>
    <div id="moves" class="moves_container">
      <button class="draw_button">Match nul</button>
      <button class="resign_button" @click="resign">Abandonner</button>
    </div>
  </template>

<style scoped>
  /* Modern styling for the chess game */
  .game_container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px;
  }

  .player {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
  }

  .pic-pseudo {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5px;
  }

  .pic-pseudo img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }

  .player_name {
    font-size: 18px;
    font-weight: bold;
    color: #333;
  }

  .player_rating {
    font-size: 14px;
    color: #666;
  }

  .timer {
    font-size: 24px;
    font-weight: bold;
    color: #fff;
  }

  .board_container {
    margin: 0 20px;
  }

  #board {
    /* Add your chessboard styling here */
    width: 600px;
    height: 600px;
  }

  .piece {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

  }

  .moves_container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }

  .moves_container button {
    padding: 10px 20px;
    font-size: 16px;
    color: #fff;
    background-color: #3f51b5;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin: 0 5px;
    transition: background-color 0.3s ease-in-out;
  }

  .moves_container button:hover {
    background-color: #303f9f;
  }
</style>