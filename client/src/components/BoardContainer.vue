<script setup>
import { onMounted, ref, inject, reactive } from 'vue';
//import $ from "jquery";
import '../assets/chessboard-1.0.0.min.css'
import Chess from '../assets/chess'
import Chessboard from '../assets/chessboard-1.0.0.js'
import { io } from "socket.io-client";
import { useRoute } from 'vue-router';

const user = inject('user');
//window.$ = window.jQuery = $;

let currentRoute = useRoute(); 
let currentGameid = currentRoute.params.gameId;

console.log(currentGameid);

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
    alert('Fin de la partie, ' + player + ' est à court de temps.');
    gameIsActive = false;
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
        alert(status);
    }
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
    if (!gameIsActive) {
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
        var pieceElement = document.createElement('img');
        pieceElement.src = '/src/assets/chesspieces/wikipedia/' + color + '' + move.captured.toUpperCase() + '.png';
        let id = "black_piece";
        if(color == "b"){
            id = "white_piece";
        }
        document.getElementById(id).appendChild(pieceElement);
    }

    updateStatus();
}

const onSnapEnd = () => {
    board.value.position(game.value.fen());
}

let orientation = "white";

if(userColor.value == "b"){
    orientation = "black";
}

const config = {
    draggable: true,
    orientation: orientation,
    position: 'start',
    pieceTheme: '/src/assets/chesspieces/wikipedia/{piece}.png',
    onDrop: onDrop,
    onSnapEnd: onSnapEnd
}

let board = ref(null);

onMounted(() => {
    board.value = Chessboard('board', config);

    socket.value = io("http://localhost:3000");

    let route = useRoute(); 
    let gameId = route.params.gameId;
    socket.value.emit('joinGame', gameId);

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

    socket.value.on('time', function (msg) {
        if (msg.type === 'black') {
            timeBlack.value = msg.time;
            document.getElementById('time_black').textContent = formatTime(timeBlack.value);
        } else {
            timeWhite.value = msg.time;
            document.getElementById('time_white').textContent = formatTime(timeWhite.value);
        }
    });
    $(window).resize(function () {
        board.value.resize();
    }).resize();
});
</script>

<template>
    <div id="game_container" class="game_container">
        <div class="player2">
            <div class="pic-pseudo">
                <img src="../assets/default_pic.jpg" alt="">
                <span>Black player (500)</span>
                <div class="timer" id="time_black">10:00</div>
            </div>
            <div class="piece" id="black_piece"></div>
        </div>
        <div class="board_container">
            <div id="board">
            </div>
        </div>
        <div class="player">
            <div class="piece" id="white_piece"></div>
            <div class="pic-pseudo">
                <img src="../assets/default_pic.jpg" alt="">
                <span>White player (500)</span>
                <div class="timer" id="time_white">10:00</div>
            </div>
        </div>
    </div>
    <div id="moves">
        <button>Match nul</button>
        <button>Abandonner</button>
        <div v-if="!reported">
            <button @click="showReportModal = true" class="report-button">Signaler</button>
        </div>
        <div v-else>
            <button disabled>Déjà signalé</button>
        </div>
    </div>

    <div v-if="showReportModal" class="modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Créer un utilisateur</h3>
          <button type="button" class="modal-close" @click="cancelCreate">&times;</button>
        </div>
        <div class="modal-body">
            <form @submit="() => createReport(user?.id)">
            <div class="form-group">
              <label for="newMessage">Message</label>
              <input type="text" v-model="newReportForm.message" id="newMessage" class="input-field" required>
            </div>

            <div class="modal-footer">
              <button type="submit" class="button primary">Créer</button>
              <button type="button" class="button" @click="cancelCreate">Annuler</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
    .form-group {
        margin-bottom: 20px;
        color: black;
    }
    .board_container{
        width: 100%;
    }
    #board{
        width: 100%;
    }
    .game_container{
        max-width: 600px;
        width: 100%;
        display: flex;
        flex-direction: column;
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
    .piece{
        height: 30px;
        width: 100%;
        display: flex;
        margin-right: 5px;
    }
    .piece > img{
        width: 30px;
    }
    .timer{
        width: 150px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 2em;
        background: grey;
        border: 3px solid black;
        border-radius: 10px;
        color: white;
        margin-left: 40%;
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
}

.modal-footer {
  padding: 10px 20px;
  background-color: #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>