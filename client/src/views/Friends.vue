<script setup >
import {computed, inject, onMounted, reactive, ref, watch} from "vue";

const user = inject('user');
const friends = reactive([]);
const users = reactive([]);
const justUsers = reactive([]);
const friendsUsers = reactive([]);
const friendsWaiting = reactive([]);
const friendsAccepted = reactive([]);
const isLoading = ref(true);
const selectedMenu = ref("friends");
const searchQuery = ref('');
const filteredQuery = ref('');
const currentPage = ref(1);
const pageSize = 10;
const isDeleteModalVisible = ref(false);

const openDeleteModal = () => {
  isDeleteModalVisible.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalVisible.value = false;
};

watch(isDeleteModalVisible, () => {
  console.log('isDeleteModalVisible:', isDeleteModalVisible.value);
});


onMounted(async () => {
  const response = await fetch(`http://localhost:3000/users`, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
  });
  if (response.ok) {
    const jsonData = await response.json();
    users.push(...jsonData);
    justUsers.push(...jsonData);
    isLoading.value = false;
  } else {
    alert('Error while fetching');
  }
});

onMounted(async () => {
  const friendsResponses = await fetch(`http://localhost:3000/friends`, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
  });

  if (friendsResponses.ok) {
    const jsonData = await friendsResponses.json();
    const friends = jsonData.filter(friend => friend.id_user === user.value.id);
    const acceptedFriends = friends.filter(friend => friend.status === 'accepted');
    const waitingFriends = friends.filter(friend => friend.status === 'waiting');
    const friendsIds = acceptedFriends.map(friend => friend.id_user_receiver);
    const waitingFriendsIds = waitingFriends.map(friend => friend.id_user_receiver);

    // Effectuer une nouvelle requête pour récupérer les informations des amis
    const usersResponses = await fetch(`http://localhost:3000/users`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    });

    if (usersResponses.ok) {
      const usersData = await usersResponses.json();
      const friendsUsers = usersData.filter(user => friendsIds.includes(user.id));
      const waitingFriendsUsers = usersData.filter(user => waitingFriendsIds.includes(user.id));
      friendsAccepted.push(...friendsUsers);
      friendsWaiting.push(...waitingFriendsUsers);
    } else {
      console.error('Error while fetching user data');
    }
  } else {
    console.error('Error while fetching friends data');
  }
});

const myFriends = computed(() => {
  return friends.filter(friend => friend.id_user === user.value.id);
});

const myFriendsUsers = computed(() => {
  const myFriendsIds = myFriends.value.map(friend => friend.id_user_receiver);

  return users
      .filter(user => myFriendsIds.includes(user.id))
      .map(user => {
        const friend = myFriends.value.find(friend => friend.id_user_receiver === user.id);
        return {
          ...user,
          status: friend.status,
        };
      });
});

const notFriends = computed(() => {
  const myFriendsIds = myFriendsUsers.value.map(friend => friend.id);
  return justUsers.filter(myUser => !myFriendsIds.includes(myUser.id)).filter(item => item.id !== user.value.id);
});


const filteredUsers = computed(() => {
  if (filteredQuery.value === '') {
    return notFriends.value;
  } else {
    const query = filteredQuery.value.toLowerCase();
    return notFriends.value.filter(user => user.email.toLowerCase().includes(query) || user.login.toLowerCase().includes(query) || user.role.libelle.toLowerCase().includes(query));
  }
});

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / pageSize));

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return filteredUsers.value.slice(start, end);
});

function deleteFriend(userId, friendId) {
  fetch(`http://localhost:3000/friends/${userId}/delete/${friendId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
  })
      .then(response => {
        if (response.ok) {
          friends.splice(friends.findIndex(friend => friend.id === friendId), 1);
          friendsAccepted.splice(friendsAccepted.findIndex(user => user.id === friendId), 1);
        } else {
          throw new Error('Fetch failed');
        }
      })
      .catch(error => {
        console.error('Error deleting friend:', error);
      });
}

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

watch(searchQuery, () => {
  currentPage.value = 1;
  filteredQuery.value = searchQuery.value;
});

watch([filteredUsers, currentPage], () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value;
  }
});

async function addFriend(userId ,friendId) {
  try {
    const response = await fetch(`http://localhost:3000/friends/${userId}/send/${friendId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    });

    if (response.ok) {
      justUsers.splice(justUsers.findIndex(user => user.id === friendId), 1);
    } else {
      throw new Error('Fetch failed');
    }
  } catch (error) {
    throw error;
  }
}

async function acceptFriend(userId ,friendId) {

  try {
    const response = await fetch(`http://localhost:3000/friends/${userId}/accept/${friendId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({
        status: 'accepted'
      })
    });

    if (response.ok) {
      friendsWaiting.splice(friendsWaiting.findIndex(user => user.id === friendId), 1);
      friendsAccepted.push(users.find(user => user.id === friendId));
    } else {
      console.log('Unexpected error:', response.statusText);
      throw new Error('Fetch failed');
    }
  } catch (error) {
    console.error('Error adding friend:', error);
    throw error;
  }
}

async function denyFriend(userId, friendId) {

  try {
    const response = await fetch(`http://localhost:3000/friends/${userId}/deny/${friendId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({
        status: 'denied'
      })
    });

    if (response.status === 422) {
      console.log('Validation error:', await response.json());
      return Promise.reject(await response.json());
    } else if (response.ok) {
      friendsWaiting.splice(friendsWaiting.findIndex(user => user.id === friendId), 1);
    } else {
      throw new Error('Fetch failed');
    }
  } catch (error) {
    throw error;
  }
}



watch(selectedMenu, () => {
  currentPage.value = 1;
  searchQuery.value = '';
  filteredQuery.value = '';
})

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options);
};

</script>

<template>
  <div>
    <div>
      <div class="menu">
        <h2 @click="selectedMenu = 'friends'" class="menu-item">Mes amis</h2>
        <h2 @click="selectedMenu = 'invitations'" class="menu-item">Mes demandes d'amis</h2>
        <h2 @click="selectedMenu = 'search'" class="menu-item">Rechercher des amis</h2>
      </div>
      <div v-if="selectedMenu === 'friends'" class="section-friends">
        <table class="friends__table">
          <thead>
          <tr>
            <th>Avatar</th>
            <th>Login</th>
            <th>Elo</th>
            <th>Creation date</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="friend in friendsAccepted" :key="friend.id">
            <td><img :src="friend.avatar" alt="avatar"></td>
            <td>{{friend.login}}</td>
            <td>{{friend.elo}}</td>
            <td>{{ formatDate(friend.createdAt) }}</td>
            <td>
              <button @click="deleteFriend(user.id, friend.id)" class="btn--danger">Supprimer</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div>
      <div v-if="selectedMenu === 'invitations'" class="section-friends">
        <table class="friends__table">
          <thead>
          <tr>
            <th>Avatar</th>
            <th>Login</th>
            <th>Elo</th>
            <th>Creation date</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="friend in friendsWaiting" :key="friend.id"><td><img :src="friend.avatar" alt="avatar"></td>
            <td>{{friend.login}}</td>
            <td>{{friend.elo}}</td>
            <td>{{ formatDate(friend.createdAt) }}</td>
            <td>
              <button @click="acceptFriend( user.id, friend.id)" class="add-friend demand">Accept</button>
              <button @click="denyFriend(user.id, friend.id)" class="btn--danger demand">Deny</button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div>
      <div v-if="selectedMenu === 'search'" class="section-search">
        <input type="text" v-model="searchQuery" placeholder="Rechercher des utilisateurs" class="search-input">
        <table class="friends__table">
          <thead>
          <tr>
            <th>Avatar</th>
            <th>Login</th>
            <th>Elo</th>
            <th>Creation date</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="friend in paginatedUsers" :key="friend.id">
            <td><img :src="friend.avatar" alt="avatar"></td>
            <td>{{friend.login}}</td>
            <td>{{friend.elo}}</td>
            <td>{{ formatDate(friend.createdAt) }}</td>
            <td>
              <button @click="addFriend(user.id ,friend.id)" class="add-friend">Ajouter en ami</button>
            </td>
          </tr>
          </tbody>
        </table>
        <div class="pagination">
          <button @click="previousPage" :disabled="currentPage === 1" class="pagination__button">Précédent</button>
          <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination__button">Suivant</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

.section-friends{
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.friends__table{
  width: 100%;
  height: 100%;
  color: white;
  font-size: 1.5rem;
  text-align: center;
}

.friends__table th{
  padding: 1rem;
}

.friends__table td{
  padding: 1rem;
}

.friends__table tr:nth-child(even){
  background-color: rgba(255, 255, 255, 0.1);
}

.friends__table tr:nth-child(odd){
  background-color: rgba(255, 255, 255, 0.2);
}

.friends__table tr:hover{
  background-color: rgba(255, 255, 255, 0.3);
}

.friends__table tr:hover td{
  color: black;
}

.friends__table th{
  background-color: rgba(255, 255, 255, 0.1);
  font-weight: bold;
}

.friends__table th:hover{
  background-color: rgba(255, 255, 255, 0.2);
}

.friends__table th:hover{
  color: black;
}

.friends__table td button{
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.friends__table td button:hover{
  transform: scale(1.1);
}

.friends__table td button.btn--danger{
  background-color: rgba(255, 0, 0, 0.5);
  color: white;
}

.friends__table td button.btn--danger:hover{
  background-color: rgba(255, 0, 0, 0.7);
}

.menu{
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 1rem 0;
}

.menu-item{
  padding: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.menu-item:hover{
  background-color: rgba(255, 255, 255, 0.2);
}

.menu-item:active{
  transform: scale(1.1);
}

.search-input{
  width: 100%;
  padding: 1rem;
  border-radius: 0.5rem;
  border: none;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.pagination{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
}

.pagination__button:disabled{
  opacity: 0.5;
}

.pagination__button{
  padding: 1rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  margin: 1rem;
}

.pagination__button:hover{
  transform: scale(1.1);
}

.add-friend{
  background-color: rgba(0, 255, 0, 0.5);
  color: white;
}
.demand{
  margin: 0 0.5rem;
}
</style>