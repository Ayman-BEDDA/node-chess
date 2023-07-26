<script setup >
import {computed, onMounted, reactive, ref, inject} from "vue";
import router from '../router';

const moneys = reactive([]);
const moneysId = reactive([]);
const premiumMoney = reactive([]);
const freeMoney = reactive([]);

const user = inject('user');

const shouldShowNavbar = computed(() => {
  const currentPath = router.currentRoute.value.path;
  return !currentPath.includes('/admin');
});

onMounted(async () => {
  const moneysIdResponses = await fetch(`http://localhost:3000/moneys`, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
  });

  if (moneysIdResponses.ok){
    moneysId.push(...(await moneysIdResponses.json()));
  }
  
  const moneysResponses = await fetch(`http://localhost:3000/owns`, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
  });

  if (moneysResponses.ok){
      const jsonDatas = await moneysResponses.json();
      const premium = jsonDatas.filter(item => item.id_money === moneysId[0]?.id);
      const free = jsonDatas.filter(item => item.id_money === moneysId[1]?.id);
      premiumMoney.push(...premium);
      freeMoney.push(...free);
   }
});

const logOut = () => {
    fetch('http://localhost:3000/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token'),
      },
    })
      .then(response => {
        if (response.ok) {
          localStorage.removeItem('token');
          user.value = null;
          router.push('/login');
        } else {
          console.error('Logout failed');
        }
      })
      .catch(error => {
        console.error('Logout failed:', error);
      });
};

</script>
  
<template>
  <nav v-if="user && shouldShowNavbar">
    <div class="navbar">
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
      <router-link to="/"><img src="../assets/logo.png" alt="logo" class="logo"/></router-link>
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
  margin: 0 10px;
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
  justify-content: space-between;
  gap: 10px;
}

.section-money{
  display: flex;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  gap: 5px;
  border-radius: 15px;
  padding: 5px;
}

.img-coin{
  padding-right: 5px;
}
.error{
  color: red;
}

.success{
  color: green;
}
</style>
  