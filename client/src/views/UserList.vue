<template>
  <div class="user-list">
    <input type="text" v-model="searchQuery" placeholder="Search users" class="search-input">
    <ul v-if="!isLoading" class="user-list__list">
      <li v-if="filteredUsers.length" v-for="user in paginatedUsers" :key="user.id" class="user-list__item">
        {{ user.id }} {{ user.email }}
        <button @click="deleteUser(user.id)" class="action-button">Supprimer</button>
        <button @click="editUser(user.id)" class="action-button">Modifier</button>
      </li>
      <li v-if="filteredUsers.length === 0" class="user-list__item user-list__item--empty">No users</li>
    </ul>
    <h2 v-if="isLoading" class="loading-text">Loading ...</h2>
    <div class="pagination">
      <button @click="previousPage" :disabled="currentPage === 1" class="pagination__button">Previous</button>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination__button">Next</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref, computed, watch } from 'vue';

const users = reactive([]);
const isLoading = ref(true);
const currentPage = ref(1);
const pageSize = 10;
const searchQuery = ref('');
const filteredQuery = ref('');

onMounted(async () => {
  const response = await fetch(`http://localhost:3000/users`, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
  });
  if (response.ok) {
    users.push(...(await response.json()));
    isLoading.value = false;
  } else {
    alert('Error while fetching');
  }
});

const filteredUsers = computed(() => {
  if (filteredQuery.value === '') {
    return users;
  } else {
    const query = filteredQuery.value.toLowerCase();
    return users.filter(user => user.email.toLowerCase().includes(query) || user.id.toString().includes(query));
  }
});

const paginatedUsers = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return filteredUsers.value.slice(startIndex, endIndex);
});

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / pageSize));

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

function deleteUser(userId) {
  // Code pour supprimer l'utilisateur avec l'ID spécifié
  // Utilisez l'API appropriée pour effectuer la suppression côté serveur
  // Vous pouvez utiliser la méthode `fetch` pour envoyer une requête DELETE
  
  // Exemple :
  fetch(`http://localhost:3000/users/${userId}`, {
    method: 'DELETE',
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
  })
    .then(response => {
      if (response.ok) {
        // Suppression réussie, mettre à jour la liste des utilisateurs
        users.splice(users.findIndex(user => user.id === userId), 1);
      } else {
        // Gérer les erreurs de suppression
        alert('Error while deleting user');
      }
    })
    .catch(error => {
      // Gérer les erreurs de connexion ou de requête
      console.error(error);
    });
}

function editUser(userId) {
  // Code pour modifier l'utilisateur avec l'ID spécifié
  // Vous pouvez ouvrir un formulaire de modification ou une boîte de dialogue pour effectuer les modifications
  
  // Exemple :
  const user = users.find(user => user.id === userId);
  // Ouvrir une boîte de dialogue ou un formulaire de modification avec les données de l'utilisateur
}
</script>

<style scoped>
.user-list {
  width: 100%;
  margin: 0 auto;
  padding: 20px;
}

.search-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
}

.user-list__list {
  list-style: none;
  padding: 0;
}

.user-list__item {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  color: black;
}

.user-list__item--empty {
  color: #888;
}

.loading-text {
  text-align: center;
  margin-top: 20px;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}

.pagination__button {
  margin: 0 5px;
  padding: 5px 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.pagination__button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.action-button {
  margin-left: 10px;
  padding: 5px 10px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>
