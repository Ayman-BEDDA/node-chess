<script setup>
import { onMounted, ref, inject, reactive } from 'vue';
//import $ from "jquery";
import '../assets/chessboard-1.0.0.min.css'
import Chess from '../assets/chess'
import Chessboard from '../assets/chessboard-1.0.0.js'
import { io } from "socket.io-client";
import { useRoute } from 'vue-router';
import Modal from './Modal.vue';

// Ajouter ceci au début de votre fichier pour importer l'API Web Audio
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Créez une nouvelle fonction pour jouer les sons
const playSound = async (soundFile) => {
    const response = await fetch(soundFile);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    const sourceNode = audioContext.createBufferSource();
    sourceNode.buffer = audioBuffer;
    sourceNode.connect(audioContext.destination);
    sourceNode.start();
}


const user = inject('user');


let currentRoute = useRoute(); 
let currentGameid = currentRoute.params.gameId;
const showModal = ref(false);
let intervalId = ref(null);
let gameIsActive = ref(true);
let socket = ref(null);
let timeBlack = ref(600); 
let timeWhite = ref(600);
const userColor = inject('userColor');
const showReportModal = ref(false);
const reported = ref(false);
const newReportForm = reactive({
  message: ''
});
const gameExists = inject('gameExists');
const gameId = inject('gameId');

const showPop = ref(false);
const modalHeader = ref('');
const modalBody = ref('');
const modalFooter = ref('');

function openPop(header, body, footer) {
  modalHeader.value = header;
  modalBody.value = body;
  modalFooter.value = footer;
  showPop.value = true;
}

function closePop() {
  showPop.value = false;
}

const openModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const declareDraw = () => {
  closeModal();
  socket.value.emit('drawAccepted', { gameId: gameId.value });
}

const proposeDraw = () => {
  socket.value.emit('proposeDraw', { gameId: gameId.value });
}

const formatTime = (seconds) => {
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
}

function cancelCreate() {
    showReportModal.value = false;
}

const gameOver = (player) => {
    clearInterval(intervalId);
    openPop('Fin de la partie', 'Fin de la partie, ' + player + ' est à court de temps.', '');
    let winner = gameExists.value.WhiteUserID;
    if(player == "w"){
      winner = gameExists.value.BlackUserID;
    }
    gameIsActive.value = false;
    fetchWinner(winner);
    socket.value.disconnect();
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
        gameIsActive.value = false;

        // Détermination du gagnant
        let winnerId = null;
        if (game.value.in_checkmate()) {
            winnerId = game.value.turn() === 'b' ? gameExists.value.WhiteUserID : gameExists.value.BlackUserID;
            socket.value.emit('checkmate', { gameId: gameId.value });
        }

        fetchWinner(winnerId);
        
    }
}

const fetchDraw = () => {
  fetch(`http://localhost:3000/games/${gameId.value}`, {
      method: 'PATCH',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          GameStatus: 'draw'
      })
  }).then(response => {
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
  }).catch(e => {
      console.error('There was a problem with the fetch operation: ' + e.message);
  });
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

async function createReport(id_user) {
  event.preventDefault();

  const gameResponse = await fetch(`http://localhost:3000/games/${currentGameid}`, {
    headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
        }
  });

  if (gameResponse.ok) {
    const gameInfo = await gameResponse.json();
    let id_user_reported = gameInfo.WhiteUserID == id_user ? gameInfo.BlackUserID : gameInfo.WhiteUserID;

    const newReport = {
        message: newReportForm.message,
        status: 'unread',
        onCreate: new Date().toISOString(),
        onUpdate: new Date().toISOString(),
        id_user: id_user,
        id_user_reported: id_user_reported
    };

    const response = await fetch(`http://localhost:3000/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify(newReport)
    });

    if (response.ok) {
        showReportModal.value = false;
        newReportForm.message = '';
        reported.value = true;
        localStorage.setItem('reportedStatus', true);
    } else {
        alert('Error while creating report');
    }
  } else {
    alert('Error while fetching the current game');
  }
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
        socket.value.emit('playSound', '/src/assets/capture.mp3');
    }else if (game.value.in_check()){
      socket.value.emit('playSound', '/src/assets/capture.mp3');
    }
    else{
      socket.value.emit('playSound', '/src/assets/move-self.mp3');
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

    socket.value.on('capturedPieces', (capturedPieces) => {
      capturedPieces.w.forEach((piece) => {
          taken("w" ,piece);
      });
      capturedPieces.b.forEach((piece) => {
          taken("b" ,piece);
      });
    });

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


    const localStorageReportedStatus = localStorage.getItem('reportedStatus');
    if (localStorageReportedStatus) {
        reported.value = true;
    }
    
    socket.value.on('resign', function () {
      gameIsActive.value = false;
      openPop("Victoire", "L'autre joueur a abandonné. Vous avez gagné la partie.");
    });

    socket.value.on('drawProposed', function () {
      openModal();
    });

    socket.value.on('drawAccepted', function () {
      fetchDraw();
      gameIsActive.value = false;
      openPop("Match nul", "L'autre joueur a accepté votre proposition de match nul. La partie est terminée.");
    });

    socket.value.on('drawProposalCooldown', function () {
      openPop("Attention", "Vous ne pouvez pas proposer un match nul tout de suite. Veuillez attendre 10 secondes.");
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

    socket.value.on('playSound', function (soundFile) {
        playSound(soundFile);
    });

    socket.value.on('gameOver', function (player) {
        gameOver(player);
    });

    socket.value.on('math', function (msg) {
        openPop("Math", msg);
    });

    $(window).resize(function () {
        board.value.resize();
    }).resize();
});
</script>

<template>
    <div id="game_container" class="game_container">
      <div class="player" id="black_player">
        <div class="pic-pseudo">
          <img src="../assets/default_pic.jpg" alt="">
          <span class="player_name">{{ user?.id }}</span>
          <div class="player_rating">(500)</div>
          <div class="timer" id="time_black">10:00</div>
        </div>
      </div>
      <div class="board_container">
        <div class="captured_pieces">
          <div class="piece" id="black_piece"></div>
        </div>
        <div id="board">
        </div>
        <div class="captured_pieces">
          <div class="piece" id="white_piece"></div>
        </div> 
      </div> 
      <div class="player" id="white_player">  
        <div class="pic-pseudo">
          <img src="../assets/default_pic.jpg" alt="">
          <span class="player_name">White player</span>
          <div class="player_rating">(500)</div>
          <div class="timer" id="time_white">10:00</div>
        </div>
      </div>
    </div>
    <div id="moves" class="moves_container">
      <router-link v-if="!gameIsActive" :to="{ name: 'Home' }">
        <button class="back_button"><i class="fas fa-arrow-left"></i> Retour à l'accueil</button>
      </router-link>
      <button class="draw_button" @click="proposeDraw" v-if="gameIsActive">Match nul</button>
      <button class="resign_button" @click="resign" v-if="gameIsActive">Abandonner</button>
      <div v-if="!reported">
          <button @click="showReportModal = true" class="report-button">Signaler</button>
      </div>
      <div v-else>
          <button disabled>Déjà signalé</button>
      </div>
    </div>

    <Modal v-if="showModal">
      <template v-slot:header>
          <button class="modal-close" @click="closeModal">&times;</button>
      </template>
      <template v-slot:body>
          <p style="color: black;">Votre adversaire propose un match nul. Acceptez-vous ?</p>
          <img src="../assets/handshake.png" alt="handshake" width="100" height="100">
      </template>
      <template v-slot:footer>
          <button class="modal-btn modal-btn-no" @click="closeModal">Non</button>
          <button class="modal-btn modal-btn-yes" @click="declareDraw">Oui</button>
      </template>
    </Modal>

    <Modal v-if="showReportModal">
      <template v-slot:header>
          <h3 class="modal-title">Signaler</h3>
          <button type="button" class="modal-close" @click="cancelCreate">&times;</button>
      </template>
      <template v-slot:body>
          <form @submit="() => createReport(user?.id)">
            <div class="form-group">
              <label for="newMessage">Message</label>
              <input type="text" v-model="newReportForm.message" id="newMessage" class="input-field" required>
            </div>
          </form>
      </template>
      <template v-slot:footer>
          <button type="submit" class="modal-btn modal-btn-yes">Créer</button>
          <button type="button" class="modal-btn modal-btn-no" @click="cancelCreate">Annuler</button>
      </template>
    </Modal>

    <Modal v-if="showPop">
      <template v-slot:header>
          {{ modalHeader }}
      </template>
      <template v-slot:body>
          {{ modalBody }}
      </template>
      <template v-slot:footer>
          <button class="modal-btn modal-btn-yes" @click="closePop">OK</button>
      </template>
    </Modal>

  </template>

<style scoped>

.back_button {
  background-color: #333;
  color: #fff;
  border: none;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

  .input-field {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
  .game_container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 20px;
  }

  .player {
    display: flex;
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
    color: #fff;
  }

  .player_rating {
    font-size: 14px;
    color: #fff;
  }

  .timer {
    font-size: 24px;
    font-weight: bold;
    color: #fff;
  }

  #board {
    /* Add your chessboard styling here */
    width: 600px;
    height: 600px;
  }

  /* CSS pour le conteneur principal de l'échiquier */
  .board_container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* CSS pour le conteneur des pièces capturées */
  .captured_pieces {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 5px;
    width: 80px;
    margin: 0 20px;
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
    background-color: rgba(0, 0, 0, 0.7);
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin: 0 5px;
    transition: background-color 0.3s ease-in-out;
  }

  .moves_container button:hover {
    background-color: rgba(0, 0, 0, 0.9);
  }
  
    .form-group {
        margin-bottom: 20px;
        color: black;
    }
    .pic-pseudo{
        display: flex;
        justify-content: start;
    }
    .pic-pseudo > img{
        border: 1px solid #cecece;
        width: 50px;
        height: 50px;
        border-radius: 5px;
    }
    .pic-pseudo > span{
        font-weight: bold;
        margin-left: 5px;
        margin-top: 5px;
    }
    .modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-dialog {
  max-width: 400px;
  background-color: #fff;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.modal-header {
  padding: 10px 20px;
  background-color: #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: black;
}

.modal-close {
  border: none;
  background-color: transparent;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
}

.modal-body {
  padding: 20px;
  color: black;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.modal-footer {
  padding: 10px 20px;
  background-color: #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-btn {
  padding: 10px 20px;
  margin: 0 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
}

.modal-btn-no {
  background-color: #e74c3c;
  color: #fff;
}

.modal-btn-yes {
  background-color: #2ecc71;
  color: #fff;
}
</style>