<script setup>
import { inject, onMounted, ref, reactive, computed } from 'vue'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import utc from 'dayjs/plugin/utc'; // Import the utc plugin separately

dayjs.locale('fr');
dayjs.extend(utc); 

const route = useRoute()
const activeTab = ref(route.query.tab || 'profile')
const isLoading = ref(true);
const userData = ref([]);
const buys = ref([]);
const buyDate = ref('');
const updatedProfileForm = ref({
  avatar: null,
});
const isEditMode = ref(false);

const user = inject('user')

function handleAvatarUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onloadend = () => {
    updatedProfileForm.value.avatar = {
      data: reader.result,
      name: file.name,
    };
  };
  reader.readAsDataURL(file);
}

function getAvatarUrl() {
    const formattedDate = dayjs().utc().format('YYYY-MM-DD_HH:mm'); // Use UTC time zone
    const filename = updatedProfileForm.value.avatar.name;
    return `${formattedDate}_${filename}`;
  }

async function updateProfile() {
  try {
    const data = {
      media: updatedProfileForm.value.avatar ? getAvatarUrl() : null,
    };

    const response = await fetch(`http://localhost:3000/users/${user.value.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify(data),
    });

    console.log(response);


    if (!response.ok) {
      throw new Error('Failed to update profile.');
    }

    if (updatedProfileForm.value.avatar) {
      const imageResponse = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(updatedProfileForm.value.avatar)
        });

      if (imageResponse.ok) {
        userData.value.media = await imageResponse.json();
        userData.value.media = userData.value.media.imageName;
      } else {
        throw new Error('Error while uploading the image');
      }
    }

    updatedProfileForm.value.avatar = null;
    isEditMode.value = false;
  } catch (error) {
    console.error(error);
    alert('Error while updating profile.');
  }
}

async function fetchProfileData() {
    const profileResponse = await fetch(`http://localhost:3000/users/${user.value.id}`, {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
        }
    })

    if (profileResponse.ok) {
        userData.value = await profileResponse.json();
        isLoading.value = false;
    } else {
        alert('Error while fetching profile');
    }
}

function enterEditMode() {
  updatedProfileForm.value.avatar = null;
  isEditMode.value = true;
}

async function fetchBuyData() {
    const buysResponse = await fetch(`http://localhost:3000/users/${user.value.id}/buys`, {
        method: 'GET',
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
        }
    })

    if (buysResponse.ok) {
        buys.value = await buysResponse.json();
        isLoading.value = false;
        buys.value.forEach(buy => {
            buyDate.value = new Date(buy.createdAt).toLocaleDateString('fr-FR');
            buy.createdAt = buyDate.value;
        });
    } else {
        alert('Error while fetching buys');
    }
}

async function changeTab(tab) {
    activeTab.value = tab;

    if (tab === 'profile') {
        await fetchProfileData();
    } else if (tab === 'buy') {
        await fetchBuyData();
    }
}

function isActive(tab) {
    return activeTab.value === tab
}

function getTabClass(tab) {
    return isActive(tab) ? 'is-active' : ''
}

onMounted(async () => {
    await fetchProfileData();
});

const imagePath = computed(() => {
    return userData.value.media ? `http://localhost:3000/${userData.value.media}` : '';
});

</script>

<template>
    <main>
        <div class="tabs">
            <ul>
                <li :class="getTabClass('profile')">
                    <a @click="changeTab('profile')">Profil</a>
                </li>
                <li :class="getTabClass('buy')">
                    <a @click="changeTab('buy')">Achats</a>
                </li>
            </ul>
        </div>
        <div v-show="isActive('profile')">
            <section class="profile">
                <h1>Profil</h1>
                <div class="info">
                <label for="avatar">Avatar</label>
                <img :src="imagePath" width="100" height="100" />
                <input type="file" accept="image/*" @change="handleAvatarUpload" v-if="isEditMode" />
                <button v-if="!isEditMode" @click="enterEditMode">Modifier l'avatar</button>
                <button v-if="isEditMode" @click="updateProfile">Sauvegarder</button>
                </div>
                <div class="info">
                <label for="login">Login</label>
                <span>{{ userData.login }}</span>
                </div>
                <div class="info">
                <label for="email">Email</label>
                <span>{{ userData.email }}</span>
                </div>
            </section>
        </div>
        <div v-show="isActive('buy')">
            <section>
                <h1>Achats</h1>
                <table v-if="buys.length">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Nom</th>
                            <th>Prix</th>
                            <th>Acheté le</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="buy in buys" :key="buy.id">
                            <td><img src="../assets/echiquier-bois.jpg" width="75" height="75"></td>
                            <td>{{ buy.article.libelle }}</td>
                            <td>{{ buy.article.price }}</td>
                            <td>{{ buy.createdAt }}</td>
                        </tr>
                    </tbody>
                </table>
                <p v-else>Aucun achat.</p>
            </section>
        </div>
    </main>
</template>

<style scoped>
    .info {
        display: flex;
        flex-direction: column;
        margin: 10px 0;
    }

    .info label {
        margin-bottom: 5px;
        text-align: center;
    }

    .info input {
        border: none;
        border-radius: 5px;
        padding: 5px;
        text-align: center;
    }

    .profile {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .tabs {
        margin: 10px 5px;
        background-color: rgba(0, 0, 0, 0.5);
    }

    .tabs ul {
        border-bottom: 1px solid #dbdbdb;
        display: flex;
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .tabs ul li {
        margin-bottom: -1px;
    }

    .tabs ul li a {
        border: 1px solid transparent;
        border-radius: 4px 4px 0 0;
        color: #f5f5f5;
        display: block;
        padding: 0.5rem 1rem;
    }

    .tabs ul li a:hover {
        background-color: #f5f5f5;
        color: #363636;
    }

    .tabs ul li.is-active a {
        color: #363636;
        background-color: #fff;
        border-color: #dbdbdb #dbdbdb #fff;
        border-bottom-color: transparent;
        cursor: default;
    }

    .tabs ul li.is-active a:hover {
        background-color: #fff;
    }

    .tabs ul li.is-active a:focus {
        box-shadow: none;
        outline: none;
    }

    section {
        margin: 10px 5px;
        background-color: rgba(0, 0, 0, 0.5);
        padding: 10px;
        border-radius: 5px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
        height: 80vh;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th, td {
        padding: 5px;
        text-align: left;
    }

    img {
        border-radius: 5px;
    }



</style>

<script>
import dayjs from 'dayjs';
import 'dayjs/locale/fr';

dayjs.locale('fr');
export default {
  methods: {
    formatDate(dateString) {
      const date = dayjs(dateString);
      return date.format('dddd D MMMM, YYYY');
    }
  }
}
</script>