<script setup>
import { reactive, onMounted, ref } from 'vue';
import jwtDecode from 'jwt-decode'

const lastgames = reactive([]);
const isLoading = ref(true);
const token = localStorage.getItem('token');
const user = ref(token ? jwtDecode(token) : null);

onMounted(async () => {
  const response = await fetch(`http://localhost:3000/users/${user.value.id}/lastgames`, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
  });
    if (response.ok) {
        lastgames.push(...(await response.json()));
        isLoading.value = false;
    } else {
        alert('Error while fetching');
    }
});

const getGameStyle = (game) => {
  if (game.Winner === user.value?.id) {
    return { backgroundColor: '#28344E', color: 'white', fontWeight: 'bold', borderRadius: '10px', borderLeft: '5px solid #5383E8'};
  } else if (game.Winner !== null) {
    return { backgroundColor: '#D31A45', color: 'white', fontWeight: 'bold', borderRadius: '10px', borderLeft: '5px solid #E84057',};
  }
  return { backgroundColor: '#000', color: 'white', fontWeight: 'bold', borderRadius: '10px', borderLeft: '5px solid #adadad',};
};
</script>

<template>
  <div class="stats">
    <div class="stats-block">
      <h1>Stats</h1>
    </div>
    <div class="lastgames-block">
      <div v-if="!isLoading">
        <h1>Last games</h1>
          <div v-for="lastgame in lastgames" :key="lastgame.id" :style="getGameStyle(lastgame)">
            <div class="game">
              <div class="player">
                <img class="avatar" :src="lastgame.whiteUser.media" />
                <div class="white">{{ lastgame.whiteUser.login }}</div>
              </div>
              <div class="player">
                <div class="score">VS</div>
              </div>
              <div class="player">
                <div class="black">{{ lastgame.blackUser.login }}</div>
                <img class="avatar" :src="lastgame.blackUser.media" />
              </div>
              
            </div>
          </div>
          <p v-if="lastgames.length === 0">No games found.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.stats h1,
.stats h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .stats h1,
  .stats h3 {
    text-align: left;
    margin: 10px;
  }
}

.stats
{
  display: flex;
  flex-direction: row;
  height: 100vh;
  gap: 10px;
  margin: 10px;
}
.lastgames-block {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: rgba(0,0, 0, .5);
  border-radius: 10px;
}

.stats-block {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, .5);
  border-radius: 10px;
}

.game {
  display: flex;
  text-shadow: 0px 0px 10px rgba(255, 255, 255, 0.5);
  border-radius: 5px;
}

.player {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
  gap: 10px;
}

.avatar {
  vertical-align: middle;
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.result {
  font-size: 1.2rem;
  font-weight: 500;
  margin-left: 10px;
}

</style>
