<script setup>

import {inject, ref} from "vue";
import router from "@/router";

const isLoading = ref(true);

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
    setTimeout(() => {
      router.push(`play/${jsonData.id}`);
    }, 2000);
  }
}

matchmaking();

</script>
<template>
  <div class="container">
    <div v-if="isLoading" class="centered">
      <img src="../assets/loading.svg" class="rotating-image">
      <h1>En attente...</h1>
      <button @click="">Annuler</button>
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