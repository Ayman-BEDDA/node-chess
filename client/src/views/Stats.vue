<script setup>
import { reactive, onMounted, ref, computed} from 'vue';

const lastgames = reactive([]);
const gamestats = reactive([]);
const isLoading = ref(true);
const currentPage = ref(1);
const pageSize = 10;

const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

const user = ref(props.user);

onMounted(async () => {
  const lastgamesResponse = await fetch(`http://localhost:3000/users/${user.value.id}/lastgames`, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
  });

  if (lastgamesResponse.ok) {
    lastgames.push(...(await lastgamesResponse.json()));
    isLoading.value = false;

    // Fetch gamestats
    const gamestatsResponse = await fetch(`http://localhost:3000/users/${user.value.id}/gamestats`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    });

    if (gamestatsResponse.ok) {
      const gamestatsData = await gamestatsResponse.json();
      gamestats.push(gamestatsData);
    } else {
      alert('Error while fetching gamestats');
    }
  } else {
    alert('Error while fetching lastgames');
  }
});

const paginatedLastgames = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return lastgames.slice(startIndex, endIndex);
});

const totalPages = computed(() => Math.ceil(lastgames.length / pageSize));

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

const getGameStyle = (game) => {
  if (game.Winner === user.value?.id) {
    return { color: 'white', fontWeight: 'bold', background: 'linear-gradient(90deg, rgba(64,232,117,1) 0%, rgba(0,0,0,0) 100%' };
  } else if (game.Winner !== null) {
    return { color: 'white', fontWeight: 'bold', background: 'linear-gradient(90deg, rgba(232,64,87,1) 0%, rgba(0,0,0,0) 100%' };
  }
  return { color: 'white', fontWeight: 'bold', background: 'linear-gradient(90deg, rgba(255,255,255,255) 0%, rgba(0,0,0,0) 100%' };
};
</script>

<template>
  <div class="stats">
    <div class="stats-block">
      <h3>Statistiques</h3>
      <div v-if="!isLoading">
        <div class="all-stats">
          <div class="stat">
            <h1>{{ gamestats[0]?.nbGames }}</h1>
            <p>Parties jouées</p>
          </div>
          <div class="gamestats">
            <div class="stat">
              <h1>{{ gamestats[0]?.nbWins }}</h1>
              <p>Victoires</p>     
            </div>
            <div class="stat">
              <h1>{{ gamestats[0]?.nbLosses }}</h1>
              <p>Défaites</p>
            </div>
            <div class="stat">
              <h1>{{ gamestats[0]?.nbDraws }}</h1>
              <p>Égalité</p>
            </div>
          </div>
        </div>
        <div class="separator"></div>
        <div class="stat">
          <h1>{{ gamestats[0]?.winRate }}%</h1>
          <p>Taux de victoire</p>
        </div>
      </div> 
    </div>
    <div class="lastgames-block">
        <h3>Dernières parties</h3>
        <div v-if="!isLoading">
          <div v-for="lastgame in paginatedLastgames" :key="lastgame.id" :style="getGameStyle(lastgame)">
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
                <div class="result">{{ lastgame.Winner === null ? 'NUL' : lastgame.Winner === user.id ? 'VICTOIRE' : 'DEFAITE' }}</div>
              </div>
            </div>
          </div>
          <div class="pagination">
            <p>Parties trouvées : {{ lastgames.length }}</p>
            <button @click="previousPage" :disabled="currentPage === 1" class="pagination__button"><li class="fas fa-chevron-left"></li></button>
            <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination__button"><li class="fas fa-chevron-right"></li></button>
          </div>
          <p v-if="lastgames.length === 0" class="no-games">Aucune partie jouée</p>
      </div>
    </div>
  </div>
</template>

<style scoped>

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 0;
    margin-bottom: 5px;
    margin-left: 10px;
    margin-top: 10px;
  }

  .pagination p {
    color: white;
    margin-right: 10px;
  }

  .pagination__button {
    color: white;
    padding: 5px 10px;
    margin: 0 5px;
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.5);
    border: none;
    cursor: pointer;
  }

  .pagination__button:disabled {
    cursor: not-allowed;
  }
  .stats {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    overflow: auto;
    margin: 0 10px;
    gap: 20px;
    height: 90vh;
  }

  .stats h3 {
    margin-left: 10px;
    text-shadow: 0 0 10px white;
    margin-bottom: 10px;
  }

  .stats-block {
    flex-basis: 50%;
    min-width: 300px;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 10px;
    width: 100%;
    height: 100%;
    padding: 10px;
  }

  .lastgames-block {
    flex-basis: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 10px;
    width: 100%;
    height: 100%;
    padding-top: 10px;
    padding-bottom: 30px;
    position: relative;
  }

  .stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 20px;
  }

  .gamestats {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-top: 20px;
  }

  .game {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    padding: 5px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  }

  .player {
    display: flex;
    align-items: center;
  }

  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
    margin-left: 10px;
  }

  .score {
    font-weight: bold;
    margin: 0 10px;
  }

  .result {
    font-weight: bold;
    margin-left: 10px;
  }

  .no-games {
    text-align: center;
    margin-top: 20px;
  }

  @media screen and (max-width: 768px) {
    .stats {
      flex-direction: row;
      flex-wrap: wrap;
      height: auto;
    }
    .stats-block {
      flex-basis: 100%;
    }

    .gamestats {
      flex-direction: column;
    }

    .avatar {
      display: none;
    }

    .player {
      margin-bottom: 10px;
    }
  }
</style>
