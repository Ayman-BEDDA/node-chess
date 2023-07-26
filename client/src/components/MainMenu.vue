<script setup>

import { inject, ref } from 'vue';
import router from '../router';

const user = inject('user');

function navigateTo(route) {
    router.push(`/${route}`);
}

///daily rewards
const errors = ref({});
const success = ref();

async function dailyRwards() {
  try {
    const response = await fetch(`http://localhost:3000/owns`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
        'Content-type': 'application/json'
      },
    });

    if (response.status === 422) {
      throw await response.json();
    } else if (response.ok) {
      success.value = "You got your daily rewards ! (100 credits)";
    } else {
      throw new Error('Fetch failed');
    }
  } catch (error) {
    errors.value = error;
    setTimeout(() => {
      errors.value = {};
    }, 3000);
    throw error; // Ajout de cette ligne pour rejeter la promesse avec l'erreur
  }
}

const handleDailyRewards = () => {
  dailyRwards().then(() => {
    success.value = "You got your daily rewards ! (100 credits)";
    setTimeout(() => {
      success.value = null;
      window.location.reload();
    }, 3000);
  }).catch((error) => {
    errors.value = error;
    setTimeout(() => {
      errors.value = {};
    }, 3000);
  });
};

</script>

<template>
  <div class="main-menu">
    <div class="menu">
      <div class="side-buttons">
        <div class="button" @click="navigateTo('stats')">
          
          <span class="label"><i class="fa-solid fa-chart-pie"></i> Stats</span>
        </div>
        <div class="button" @click="navigateTo('shop')">
          <span class="label"><i class="fa-solid fa-cart-shopping"></i> Shop</span>
        </div>
        <div v-if="user?.id_role === 1" class="button" @click="navigateTo('admin')">
          <span class="label"><i class="fa-solid fa-skull"></i> Admin</span>
        </div>
      </div>
      <div class="title">
        <h1>NodeChess</h1>
      </div>
    </div>
    <div class="bottom-buttons">
      <div class="button" @click="handleDailyRewards()">
          <p><i class="fa-solid fa-coins"></i> Daily rewards !</p>
        <p class="error">{{errors.dailyReward}}</p>
        <p class="success" v-if="success">{{ success }}</p>
      </div>
      <div class="button" @click="navigateTo('play')">
        <span class="label"><i class="fa-solid fa-chess-knight fa-bounce"></i> Play</span>
      </div>
    </div>
    <div class="button v12" @click="navigateTo('friends')">
      <span class="label">Friends</span>
      <span class="icon">
          <span></span>
      </span>
    </div>

  </div>
</template>

  
<style scoped>
@font-face {
  font-family: The Bomb Sound;
  src: url('../assets/fonts/The Bomb Sound.ttf');
}

.daily-rewards {
  font-size: 1rem;
}

.menu {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.menu .title {
  font-family: The Bomb Sound;
  font-weight: bold;
  font-size: 3rem;
  text-align: center;
  text-shadow: 0 0 10px #fff;
  margin-right: 15%;
}

.main-menu {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.main-menu .button {
  font-family: The Bomb Sound;
  font-size: 3rem;
  text-align: center;
  cursor: pointer;
  padding: 2rem;
  transition: all 0.2s ease-in-out;
}

.main-menu .button:hover {
  text-shadow: 0 0 10px #fff;
}

.main-menu .button .label {
  gap: 1rem;
}

.side-buttons {
  margin-top: 5rem;
  display: flex;
  flex-direction: column;
  margin-left: 2rem;
}

.side-buttons .button {
  text-align: center;
  cursor: pointer;
  margin-bottom: 10px;
}

.bottom-buttons {
  width: 100%;
  display: flex;
  justify-content: space-between;
  position: absolute;
  bottom: 0;
}
.bottom-buttons .button {
  text-align: center;
  cursor: pointer;
  padding: 2rem;
}
.error{
  color: red;
}

.success{
  color: green;
}

</style>
  