<template>
    <div class="recent-grid">
      <div class="projects">
        <div class="card">
          <div class="card-header">
            <h2>Monnaies</h2>
            <button @click="showCreateModal = true" class="create-button">Créer une monnaie</button>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <div class="search-wrapper">
                <span> </span>
                <input type="search" v-model="searchQuery" placeholder="Chercher une monnaie..." />

              </div>
              <table width="100%" v-if="!isLoading">
              <thead>
                <tr>
                  <td>Type</td>
                  <td>Crée à</td>
                  <td>Modifié </td>
                  <td>Actions</td>
                </tr>
              </thead>
              <tbody>
                <tr v-if="filteredMoneys.length" v-for="money in paginatedMoneys" :key="money.id">
                  <td>{{ money.type }}</td>
                    <td>{{ formatDate(money.createdAt) }}</td>
                    <td>{{ formatDate(money.updatedAt) }}</td>
                    <td>
                        <button @click="editMoney(money.id)" class="update-button">Modifier</button>
                        <button @click="confirmDeleteMoney(money.id)" class="delete-button">Supprimer</button>
                    </td>
                </tr>
                <tr v-if="filteredMoneys.length === 0">
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
                    <h3 class="modal-title">Créer un money</h3>
                    <button type="button" class="modal-close" @click="cancelCreate">&times;</button>
                </div>
                <div class="modal-body">
                    <form @submit="createMoney">
                        <div class="form-group">
                            <label for="newType">Type</label>
                            <input type="text" v-model="newMoneyForm.type" id="newType" class="input-field" required>
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
  
    <!-- ... -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">Modifier une monnaie</h3>
            <button type="button" class="modal-close" @click="cancelEdit">&times;</button>
          </div>
          <div class="modal-body">
            <form @submit="updateMoney">
              <div class="form-group">
                <label for="type">Type</label>
                <input type="text" v-model="editMoneyForm.type" id="type" class="input-field" required>
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
  
  const moneys = reactive([]);
  const isLoading = ref(true);
  const currentPage = ref(1);
  const pageSize = 10;
  const searchQuery = ref('');
  const filteredQuery = ref('');
  const showEditModal = ref(false);
  const showCreateModal = ref(false);
  const selectedMoneyId = ref(null);
  const editMoneyForm = reactive({
    type: '',
  });

  const newMoneyForm = reactive({
    type: ''
  });
  
  onMounted(async () => {
    const response = await fetch(`http://localhost:3000/moneys`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    });
    if (response.ok) {
        moneys.push(...(await response.json()));
      isLoading.value = false;
    } else {
      alert('Error while fetching');
    }
  });
  
  const filteredMoneys = computed(() => {
    if (filteredQuery.value === '') {
      return moneys;
    } else {
      const query = filteredQuery.value.toLowerCase();
      return moneys.filter(money => money.type.toLowerCase().includes(query));
    }
  });
  
  const paginatedMoneys = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredMoneys.value.slice(startIndex, endIndex);
  });
  
const totalPages = computed(() => Math.ceil(filteredMoneys.value.length / pageSize));
  
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
  
  watch([filteredMoneys, currentPage], () => {
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value;
    }
  });
  
  
  function confirmDeleteMoney(moneyId) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      deleteMoney(moneyId);
    }
  }
  
  function deleteMoney(moneyId) {
    fetch(`http://localhost:3000/moneys/${moneyId}`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    })
      .then(response => {
        if (response.ok) {
          moneys.splice(moneys.findIndex(money => money.id === moneyId), 1);
        } else {
          alert('Error while deleting money');
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  async function createMoney() {
    event.preventDefault();

    const newMoney = {
      type: newMoneyForm.type
    };

    const response = await fetch(`http://localhost:3000/moneys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify(newMoney)
    });

    if (response.ok) {
        const createdMoney = await response.json();
        moneys.unshift(createdMoney);
        showCreateModal.value = false;
        newMoneyForm.type = '';
    } else {
        alert('Error while creating money');
    }
  }


  function cancelCreate() {
      showCreateModal.value = false;
  }

  
  function editMoney(moneyId) {
    const money = moneys.find(money => money.id === moneyId);
    selectedMoneyId.value = moneyId;
  
    showEditModal.value = true;
    editMoneyForm.type = money.type;
  }
  
  async function updateMoney() {
    event.preventDefault();
    const moneyId = selectedMoneyId.value;

    const updatedMoney = {
        type: editMoneyForm.type,
        updatedAt: new Date().toISOString()
    };

    const response = await fetch(`http://localhost:3000/moneys/${moneyId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify(updatedMoney)
    });

    if (response.ok) {
      const index = moneys.findIndex(money => money.id === moneyId);
      moneys[index] = { ...moneys[index], ...updatedMoney };
      showEditModal.value = false;
    } else {
      alert('Error while editing money');
    }
  }

  
  function cancelEdit() {
    showEditModal.value = false;
  }
</script>
  
<style scoped>

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