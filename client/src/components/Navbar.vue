<script setup >
import {computed, onMounted, reactive, ref, inject} from "vue";
import router from '../router';

const moneys = reactive([]);

const user = inject('user');

const shouldShowNavbar = computed(() => {
  const currentPath = router.currentRoute.value.path;
  return !currentPath.includes('/admin');
});

onMounted(async () => {
    const moneysResponses = await fetch(`http://localhost:3000/owns`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    });

    if (moneysResponses.ok){
      moneys.push(...(await moneysResponses.json()));
    }
});

const premiumMoney = computed(() => moneys.filter(item => item.id_money === 1));
const freeMoney = computed(() => moneys.filter(item => item.id_money === 2));

///daily rewards
const errors = ref({});
const success = ref(false);

async function getDailyRewards() {
  const response = await fetch(`http://localhost:3000/owns`, {
    method: 'PATCH',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token'),
      'Content-type': 'application/json'
    },
  });
  if (response.status === 422) {
    return Promise.reject(await response.json());
  } else if (response.ok) {
    return Promise.resolve(await response.json());
  }
  throw new Error('Fetch failed');
}

function handleGetDailyRewards() {
  getDailyRewards()
    .then(() => {
      success.value = true;
    })
    .catch((err) => {
      errors.value = err;
      setTimeout(() => {
        errors.value = {};
      }, 3000);
    });
}

</script>
  
<template>
  <nav v-if="user && shouldShowNavbar">
    <div class="navbar">
      <router-link to="/"><img src="../assets/logo.png" alt="logo" class="logo"/></router-link>
      <div class="button-rewards">
        <p>Get your daily rewards !</p>
        <p>{{  }}</p>
      </div>
      <div class="moneys">
        <div class="section-money">
          <img class="img-coin" src="../assets/free-coins.svg" />
          <p v-if="freeMoney.length > 0">{{ freeMoney[0].amount }}</p>
        </div>
        <div class="section-money">
          <img class="img-coin" src="../assets/premium-coin.svg" />
          <p v-if="premiumMoney.length > 0">{{ premiumMoney[0].amount }}</p>
        </div>
      </div>
      <div class="dropdown">
        {{ user.login }}
        <img :src="user.media" class="avatar" />
        <div class="dropdown-content">
          <router-link to="/me"><i class="fas fa-user"></i> Mon profil</router-link>
          <button @click="logOut"><i class="fas fa-sign-out-alt"></i> Se déconnecter</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  margin: 0 20px;
}

.navbar a {
  text-decoration: none;
  color: inherit;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropbtn {
  text-decoration: none;
  color: inherit;
  padding: 0;
  cursor: pointer;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  right: 0;
  border-radius: 5px;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-content button {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
}

.dropdown-content a:hover {background-color: #f1f1f1; border-radius: 5px;}
.dropdown-content button:hover {background-color: #f1f1f1; border-radius: 5px;}

.dropdown:hover .dropdown-content {
  display: block;
}

.avatar {
  vertical-align: middle;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-left: 10px;
}

.logo {
  width: 150px;
  height: 150px;
  transition: all 0.3s ease-in-out;
}

.logo:hover {
  filter: drop-shadow(0px 0px 10px rgba(255, 255, 255, 0.9));
}

.moneys {
  display: flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 2%;
  padding: 6px;
  width: 12%;
  justify-content: space-between;
}

.section-money{
  display: flex;
  align-items: center;
}

.img-coin{
  padding-right: 5px;
}

.button-rewards{
  background-color: rgba(225, 10, 10, 0.5);
  border-radius: 2%;
  padding: 6px;
  width: 20%;
  text-align: center;
  cursor: pointer;
}

.button-rewards:hover{
  background-color: rgba(225, 10, 10, 0.8);
}
</style>
  