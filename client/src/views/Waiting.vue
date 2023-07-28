<script setup>

import {inject, ref, onMounted, onUnmounted} from "vue";
import router from "@/router";
import { io } from 'socket.io-client';

const isLoading = ref(true);
let socket = ref(null);

const user = inject('user');

async function matchmaking() {
  const response = await fetch(`http://localhost:3000/users/matchmaking`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-type': 'application/json'
    },
    body: JSON.stringify({
      id: user.value.id,
      login: user.value.login
    })
  });

  if (response.ok) {
    const jsonData = await response.json();
    socket.value.emit('matchFound', jsonData);
  }
}

matchmaking();


onMounted(() => {
  socket.value = io("http://localhost:3000");
  socket.value.on('matchFound', (data) => {
    let game = data;
    //isLoading.value = false;
    if(user.value.id == game.BlackUserID || user.value.id == game.WhiteUserID){
      setTimeout(() => {
        router.push(`play/${game.id}`);
      }, 2000);
    }
  });
});

async function cancelMatchmaking() {
  const response = await fetch(`http://localhost:3000/users/${user.value.id}/delete`, {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-type': 'application/json'
    }
  });
}

onUnmounted(() => {
  socket.value.disconnect();
  cancelMatchmaking();
});
</script>
<template>
  <div class="container">
    <div v-if="isLoading" class="centered">
      <img src="../assets/loading.svg" class="rotating-image">
    </div>
  </div>
</template>

<style scoped>
.container{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.centered {
  display: flex;
  justify-content: center;
  align-items: center;
}

.rotating-image {
  width: 100px;
  height: 100px;
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>