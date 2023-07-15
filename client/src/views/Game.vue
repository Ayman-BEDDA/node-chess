<script setup>
import '../assets/chessboard-1.0.0.min.css'
import '../assets/chess.js'
import { onMounted } from 'vue'

onMounted(() => {
  import('../assets/chessboard-1.0.0.min.js')
  import('../assets/jquery-3.7.0.min.js')
})
const board = Chessboard('board');

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
                <img src="" alt="">
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
    </div>
</template>

<style scoped>
    body{
        margin: 0;
        width: 100%;
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
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
</style>