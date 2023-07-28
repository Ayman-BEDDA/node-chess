<template>
  <div class="recent-grid">
      <div class="projects">
        <div class="card">
          <div class="card-header">
            <h2>Utilisateurs</h2>
            <button @click="showCreateModal = true" class="create-button">Créer un utilisateur</button>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <div class="search-wrapper">
                <span> </span>
                <input type="search" v-model="searchQuery" placeholder="Chercher un utilisateur..." />

              </div>
              <table width="100%" v-if="!isLoading">
              <thead>
                <tr>
                  <td>Login</td>
                  <td>Email</td>
                  <td>Elo</td>
                  <td>Banni</td>
                  <td>Valide</td>
                  <td>Rôle</td>
                  <td>Crée à</td>
                  <td>Modifié à</td>
                  <td>Actions</td>
                </tr>
              </thead>
              <tbody>
                <tr v-if="filteredUsers.length" v-for="user in paginatedUsers" :key="user.id">
                  <td>{{ user.login }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.elo }}</td>
                  <td>
                    <span class="status green" v-if="user.isBanned"></span>
                    <span class="status red" v-if="!user.isBanned"></span>
                    {{ user.isBanned ? 'Oui' : 'Non' }}
                  </td>
                  <td>
                    <span class="status green" v-if="user.isValid"></span>
                    <span class="status red" v-if="!user.isValid"></span>
                    {{ user.isValid ? 'Oui' : 'Non' }}
                  </td>
                  <td>{{ user.role.libelle }}</td>
                  <td>{{ formatDate(user.createdAt) }}</td>
                  <td>{{ formatDate(user.updatedAt) }}</td>
                  <td>
                    <button @click="editUser(user.id)" class="update-button">Modifier</button>
                    <button @click="confirmDeleteUser(user.id)" class="delete-button">Supprimer</button>
                  </td>
                </tr>
                <tr v-if="filteredUsers.length === 0">
                  <td colspan="4">Pas d'Utilisateurs</td>
                </tr>
              </tbody>

            </table>
            <h2 v-if="isLoading" class="loading-text">Loading ...</h2>
            <div class="pagination">
                <button @click="previousPage" :disabled="currentPage === 1" class="pagination__button">Précédent</button>
                <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination__button">Suivant</button>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  <!-- Create Modal -->
  <div v-if="showCreateModal" class="modal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">Créer un utilisateur</h3>
          <button type="button" class="modal-close" @click="cancelCreate">&times;</button>
        </div>
        <div class="modal-body">
          <form @submit="createUser">
            <div class="form-group">
              <label for="newLogin">Login</label>
              <input type="text" v-model="newUserForm.login" id="newLogin" class="input-field" required>
            </div>
            <div class="form-group">
              <label for="newEmail">Email</label>
              <input type="email" v-model="newUserForm.email" id="newEmail" class="input-field" required>
            </div>
            <div class="form-group">
              <label for="newPassword">Mot de passe</label>
              <input type="password" v-model="newUserForm.password" id="newPassword" class="input-field" required>
            </div>
            <div class="form-group">
              <label for="newElo">Elo</label>
              <input type="number" v-model="newUserForm.elo" id="newElo" class="input-field" required>
            </div>
            <div class="form-group">
              <label for="newImage">Image</label>
              <input type="file" @change="handleImageUpload" id="newImage" class="input-field" accept="image/png, image/jpeg">
            </div>
            <div class="form-group">
              <label for="newIsBanned">Bannir</label>
              <select v-model="newUserForm.isBanned" class="select-field" required>
                <option disabled value="">En choisir un</option>
                <option value="true">Oui</option>
                <option value="false">Non</option>
              </select>
            </div>
            <div class="form-group">
              <label for="newIsValid">Valide</label>
              <select v-model="newUserForm.isValid" class="select-field" required>
                <option disabled value="">En choisir un</option>
                <option value="true">Oui</option>
                <option value="false">Non</option>
              </select>
            </div>
            <div class="form-group">
              <label for="newRole">Rôle</label>
              <select v-model="newUserForm.id_role" class="select-field" required>
                <option disabled value="">En choisir un</option>
                <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.libelle }}</option>
              </select>
            </div>

            <div class="modal-footer">
              <button type="submit" class="button primary">Créer</button>
              <button type="button" class="button" @click="cancelCreate">Annuler</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <!-- ... -->
  

  <!-- Update Modal -->
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
              <select v-model="editUserForm.isBanned" class="select-field">
                <option disabled value="">En choisir un</option>
                <option :value="true">Oui</option>
                <option :value="false">Non</option>
              </select>
            </div>
            <div class="form-group">
              <label for="isValid">Valide:</label>
              <select v-model="editUserForm.isValid" class="select-field">
                <option disabled value="">En choisir un</option>
                <option :value="true">Oui</option>
                <option :value="false">Non</option>
              </select>
            </div>
            <div class="form-group">
              <label for="id_role">Rôle:</label>
              <select v-model="editUserForm.id_role" class="select-field">
                <option disabled value="">En choisir un</option>
                <option v-for="role in roles" :key="role.id" :value="role.id">{{ role.libelle }}</option>
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

<script setup>
import { reactive, onMounted, ref, computed, watch } from 'vue';
import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import utc from 'dayjs/plugin/utc'; // Import the utc plugin separately

dayjs.locale('fr');
dayjs.extend(utc); 

const users = reactive([]);
const isLoading = ref(true);
const currentPage = ref(1);
const pageSize = 10;
const searchQuery = ref('');
const filteredQuery = ref('');
const showEditModal = ref(false);
const showCreateModal = ref(false);
const selectedUserId = ref(null);
const roles = ref([]);
const editUserForm = reactive({
  login: '',
  email: '',
  elo: '',
  isBanned: '',
  isValid: '',
  id_role: ''
});

const newUserForm = reactive({
  login: '',
  email: '',
  password: '',
  elo: '',
  isBanned: '',
  isValid: '',
  id_role: '',
  image: null
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

onMounted(async () => {
  roles.value = await fetchRoles();
});

async function fetchRoles() {
  try {
    const response = await fetch(`http://localhost:3000/roles`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    });

    if (response.ok) {
      const roles = await response.json();
      return roles;
    } else {
      throw new Error('Error while fetching roles');
    }
  } catch (error) {
    console.error(error);
    alert('Error while fetching roles');
    return [];
  }
}

const filteredUsers = computed(() => {
  if (filteredQuery.value === '') {
    return users;
  } else {
    const query = filteredQuery.value.toLowerCase();
    return users.filter(user => user.email.toLowerCase().includes(query) || user.login.toLowerCase().includes(query) || user.role.libelle.toLowerCase().includes(query));
  }
});

const paginatedUsers = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return filteredUsers.value.slice(startIndex, endIndex);
});

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / pageSize));

const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onloadend = () => {
    newUserForm.image = {
      data: reader.result,
      name: file.name
    };
  };
  reader.readAsDataURL(file);
};

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
        users.splice(users.findIndex(user => user.id === userId), 1);
      } else {
        alert('Error while deleting user');
      }
    })
    .catch(error => {
      console.error(error);
    });
}

function getUserImageName() {
  const formattedDate = dayjs().utc().format('YYYY-MM-DD_HH:mm'); // Use UTC time zone
  const filename = newUserForm.image.name;
  return `${formattedDate}_${filename}`;
}

async function createUser() {
  event.preventDefault();

  const newUser = {
    login: newUserForm.login,
    email: newUserForm.email,
    password: newUserForm.password,
    elo: newUserForm.elo,
    isBanned: newUserForm.isBanned,
    isValid: newUserForm.isValid,
    id_role: newUserForm.id_role,
    media: newUserForm.image ? getUserImageName() : null
  };

  const response = await fetch(`http://localhost:3000/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token')
    },
    body: JSON.stringify(newUser)
  });

  if (response.ok && newUserForm.image) {
    try {
      const imageResponse = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token')
        },
        body: JSON.stringify(newUserForm.image)
      });

      if (imageResponse.ok) {
        const createdUser = await response.json();

        const roleResponse = await fetch(`http://localhost:3000/roles/${createdUser.id_role}`, {
        headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')
          }
        });

        if (roleResponse.ok) {
          const role = await roleResponse.json();
          createdUser.role = role;

          users.unshift(createdUser);

          filteredQuery.value = searchQuery.value;

          showCreateModal.value = false;
          newUserForm.login = '';
          newUserForm.email = '';
          newUserForm.password = '';
          newUserForm.elo = '';
          newUserForm.isBanned = '';
          newUserForm.isValid = '';
          newUserForm.id_role = '';
          newUserForm.media = null;
        } else {
          alert('Error while fetching role for the new user');
        }
      } else {
        alert('Error while uploading the image');
      }
    } catch (error) {
      console.error(error);
      alert('Error while uploading the image');
    }
  } else {
    alert('Error while creating user');
  }
}


function cancelCreate() {
  showCreateModal.value = false;
}


function editUser(userId) {
  const user = users.find(user => user.id === userId);
  selectedUserId.value = userId;

  const userRole = roles.value.find(role => role.id === user.id_role);
  
  editUserForm.login = user.login;
  editUserForm.email = user.email;
  editUserForm.elo = user.elo;
  editUserForm.isBanned = user.isBanned;
  editUserForm.isValid = user.isValid;
  editUserForm.id_role = userRole ? userRole.id : '';

  showEditModal.value = true;
}


async function updateUser() {
  event.preventDefault();
  const userId = selectedUserId.value;

  const updatedUser = {
    login: editUserForm.login,
    email: editUserForm.email,
    elo: editUserForm.elo,
    isBanned: editUserForm.isBanned,
    isValid: editUserForm.isValid,
    id_role: editUserForm.id_role,
    updatedAt: new Date().toISOString()
  };

  const response = await fetch(`http://localhost:3000/users/${userId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token')
    },
    body: JSON.stringify(updatedUser)
  });

  if (response.ok) {
    const index = users.findIndex(user => user.id === userId);
    users[index] = { ...users[index], ...updatedUser };

    const roleResponse = await fetch(`http://localhost:3000/roles/${updatedUser.id_role}`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    });

    if (roleResponse.ok) {
      const role = await roleResponse.json();
      users[index].role = role;
    } else {
      alert('Error while fetching role for the updated user');
    }

    showEditModal.value = false;
  } else {
    alert('Error while editing user');
  }
}


function cancelEdit() {
  showEditModal.value = false;
}
</script>

<style scoped>

.title{
  margin-right: 1rem;
}

.status{
  display: inline-block;
  height: 10px;
  width: 10px;
  border-radius: 50%;
  margin-right: 1rem; 
}
.status.purple {
  background: rebeccapurple;
}
.status.red {
  background: rgb(177, 8, 8);
}

.status.green {
  background: rgb(19, 187, 41);
}
.status.pink{
  background: deeppink;
}
.status.orange{
  background: orangered;
}

.search-wrapper {
    border: solid 1px #ccc;
    border-radius: 30px;
    height: 50px;
    display: flex;
    align-items: center;
    overflow-x: hidden;
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    margin-top: 20px;
  }
  .search-wrapper span{
    display: inline-block;
    padding: 0rem 1rem;
    font-size: 1.5rem;
  }
  .search-wrapper input{
    width: 100%;
    height: 100%;
    padding: .5rem;
    border: none;
    outline: none;

  }
  .recent-grid{
    margin-top: 3.5rem;
    display: grid;
    grid-gap: 2rem;
    grid-template-columns: 100% auto;
  
  }
  .card{
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 5px 10px rgba(154,160,185,.05), 0 15px 40px rgba(166,173,201,.2);
    padding: 1rem;
  }
  .card-header
  {
    padding: 1rem;
  }
  .card-header{
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #f0f0f0;
    color: black;
  }
  .card-header button{
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  table{
    border-collapse: collapse;
  }
  thead tr{
    border-top: 1px solid #f0f0f0;
    border-bottom:2px solid #f0f0f0;

  }
  thead td{
    font-weight: 700;
  }
  td{
    padding: .5rem 1rem ;
    font-size: .9rem ;
    color: #222;
    
  }

  tr td:last-child{
    display: flex;
    align-items: center;


  }
  td .status{
    display: inline-block;
    height: 10px;
    width: 10px;
    border-radius: 50%;
    margin-right: 1rem; 
  }

  .table-responsive{
    width: 100%;
    overflow-x: auto;
  }
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

.create-button {
  background-color: #007bff;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.create-button:hover {
  background-color: #0056b3;
}

.modal-footer {
  padding: 10px 20px;
  background-color: #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: center;
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

.select-field {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff;
  color: #000;
  font-size: 16px;
  cursor: pointer;
}

.select-field::-ms-expand {
  display: none;
}

.select-field::after {
  content: "";
  position: absolute;
  top: calc(50% - 2px);
  right: 10px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 4px 4px 0 4px;
  border-color: #888 transparent transparent transparent;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  margin-top: 20px;
}

.loading-text {
  text-align: center;
  margin-top: 20px;
}

.pagination {
  margin-top: 20px;
  margin-bottom: 20px;
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

.update-button {
  margin-left: 10px;
  padding: 5px 10px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.delete-button {
  margin-left: 10px;
  padding: 5px 10px;
  background-color: #d3190b;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.responsive-table {
  width: 100%;
  margin-bottom: 20px;
  border-collapse: collapse;
}

.responsive-table th,
.responsive-table td {
  padding: 10px;
  border: 1px solid #ccc;
  text-align: left;
  color: black;
}

@media (max-width: 600px) {
  .responsive-table td {
    display: block;
    width: 100%;
    box-sizing: border-box;
  }

  .responsive-table th {
    display: none;
  }

  .responsive-table td:before {
    content: attr(data-label);
    font-weight: bold;
    margin-bottom: 5px;
    display: block;
  }

  .card-header button{
    padding: 5px 10px;
  }
}


</style>
