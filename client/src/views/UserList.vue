<template>
  <div class="user-list">
    <input type="text" v-model="searchQuery" placeholder="Search users" class="search-input">
    <ul v-if="!isLoading" class="user-list__list">
      <li v-if="filteredUsers.length" v-for="user in paginatedUsers" :key="user.id" class="user-list__item">
        {{ user.id }} {{ user.email }}
        <button @click="confirmDeleteUser(user.id)" class="action-button">Supprimer</button>
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
  

  <!-- ... -->
  <div v-if="showEditModal" class="modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Modifier un utilisateur</h3>
          <button type="button" class="modal-close" @click="cancelEdit">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit="updateUser">
            <div class="form-group">
              <label for="login">Login</label>
              <input type="text" v-model="editUserForm.login" id="login" class="input-field" required>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" v-model="editUserForm.email" id="email" class="input-field" required>
            </div>
            <div class="form-group">
              <label for="elo">Elo</label>
              <input type="number" v-model="editUserForm.elo" id="elo" class="input-field" required>
            </div>
            <div class="form-group">
              <label for="isBanned">Bannir:</label>

              <select v-model="editUserForm.isBanned">
                <option disabled value="">En choisir un</option>
                <option value="1">Oui</option>
                <option value="2">Non</option>
              </select>
            </div>
            <div class="form-group">
              <label for="isValid">Validité:</label>

              <select v-model="editUserForm.isValid">
                <option disabled value="">En choisir un</option>
                <option value="1">Oui</option>
                <option value="2">Non</option>
              </select>
            </div>
            <div class="form-group">
              <label for="role">Rôle:</label>

              <select v-model="editUserForm.id_role">
                <option disabled value="">En choisir un</option>
                <option value="1">Utilisateur</option>
                <option value="2">Modérateur</option>
                <option value="3">Administrateur</option>
              </select>
            </div>
            <div class="modal-footer">
              <button type="submit" class="button primary">Confirmer</button>
              <button type="button" class="button" @click="cancelEdit">Annuler</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <!-- ... -->
</template>

<script setup>
import { reactive, onMounted, ref, computed, watch } from 'vue';

const users = reactive([]);
const isLoading = ref(true);
const currentPage = ref(1);
const pageSize = 10;
const searchQuery = ref('');
const filteredQuery = ref('');
const showEditModal = ref(false);
const selectedUserId = ref(null);
const editUserForm = reactive({
  login: '',
  email: '',
  elo: '',
  isBanned: '',
  isValid: '',
  id_role: ''
});

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


function confirmDeleteUser(userId) {
  if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
    deleteUser(userId);
  }
}

function deleteUser(userId) {
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
  const user = users.find(user => user.id === userId);
  selectedUserId.value = userId;

  // Afficher le modal de modification avec les données de l'utilisateur
  showEditModal.value = true;
  editUserForm.login = user.login;
  editUserForm.email = user.email;
  editUserForm.elo = user.elo;
  editUserForm.isBanned = user.isBanned;
  editUserForm.isValid = user.isValid;
  editUserForm.id_role = user.id_role;
}

function updateUser() {
  const userId = selectedUserId.value;

  // Envoyer les nouvelles données de l'utilisateur au serveur
  const updatedUser = {
    login: editUserForm.login,
    email: editUserForm.email,
    elo: editUserForm.elo,
    isBanned: editUserForm.isBanned,
    isValid: editUserForm.isValid,
    id_role: editUserForm.id_role
  };

  // Envoyer les nouvelles données de l'utilisateur au serveur
  fetch(`http://localhost:3000/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token')
    },
    body: JSON.stringify(updatedUser)
  })
    .then(response => {
      if (response.ok) {
        // Modification réussie, mettre à jour les données de l'utilisateur dans la liste
        const index = users.findIndex(user => user.id === userId);
        users[index] = { ...users[index], ...updatedUser };
        showEditModal.value = false; // Fermer le modal de modification
      } else {
        // Gérer les erreurs de modification
        alert('Error while editing user');
      }
    })
    .catch(error => {
      // Gérer les erreurs de connexion ou de requête
      console.error(error);
    });
}

function cancelEdit() {
  showEditModal.value = false; // Fermer le modal de modification
}
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-dialog {
  max-width: 400px;
  background-color: #fff;
  border-radius: 5px;
  overflow: hidden;
}

.modal-header {
  padding: 10px 20px;
  background-color: #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: black;
}

.modal-close {
  border: none;
  background-color: transparent;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
  color: black;
}

.label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.input-field {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.checkbox {
  display: flex;
  align-items: center;
}

.checkbox input[type="checkbox"] {
  margin-right: 5px;
}

.modal-footer {
  padding: 10px 20px;
  background-color: #f2f2f2;
  display: flex;
  justify-content: flex-end;
}

.button {
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.button.primary {
  background-color: #007bff;
  color: #fff;
  border: none;
}

.button {
  margin-left: 10px;
  background-color: #ccc;
  color: #000;
  border: none;
}
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
