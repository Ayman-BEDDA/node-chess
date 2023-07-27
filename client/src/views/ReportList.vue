<template>
  <div class="recent-grid">
      <div class="projects">
        <div class="card">
          <div class="card-header">
            <h2>Sanctions</h2>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <div class="search-wrapper">
                <span> </span>
                <input type="search" v-model="searchQuery" placeholder="Chercher une sanction..." />

              </div>
              <table width="100%" v-if="!isLoading">
              <thead>
                <tr>
                  <td>Message</td>
                  <td>Status</td>
                  <td>Utilisateur</td>
                  <td>Utilisateur signalé</td>
                  <td>Crée à</td>
                  <td>Modifié à</td>
                  <td>Actions</td>
                </tr>
              </thead>
              <tbody>
                <tr v-if="filteredReports.length" v-for="report in paginatedReports" :key="report.id">
                  <td>{{ report.message }}</td>
                  <td>{{ report.status }}</td>
                  <td>{{ report.user.login }}</td>
                  <td>{{ report.user_reported.login }}</td>
                  <td>{{ formatDate(report.createdAt) }}</td>
                  <td>{{ formatDate(report.updatedAt) }}</td>
                  <td>
                    <button @click="confirmAcceptReport(report.id)" class="update-button" v-show="report.status !== 'accepted' && report.status !== 'refused'">Accepter</button>
                    <button @click="confirmRefuseReport(report.id)" class="delete-button" v-show="report.status !== 'accepted' && report.status !== 'refused'">Refuser</button>
                    <span v-show="report.status === 'accepted' || report.status === 'refused'" class="done-tag">done</span>
                  </td>
                </tr>
                <tr v-if="filteredReports.length === 0" class="report-list__item report-list__item--empty">
                  <td colspan="4">Pas de sanctions</td>
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

const reports = reactive([]);
const isLoading = ref(true);
const currentPage = ref(1);
const pageSize = 10;
const searchQuery = ref('');
const filteredQuery = ref('');

onMounted(async () => {
  const response = await fetch(`http://149.202.52.182:3000/reports`, {
    headers: {
      Authorization: 'Bearer ' + localStorage.getItem('token')
    }
  });
  if (response.ok) {
    reports.push(...(await response.json()));
    isLoading.value = false;
  } else {
    alert('Error while fetching');
  }
});

const filteredReports = computed(() => {
  if (filteredQuery.value === '') {
    return reports;
  } else {
    const query = filteredQuery.value.toLowerCase();
    return reports.filter(report => report.message.toLowerCase().includes(query) || report.status.toLowerCase().includes(query) || report.user.login.toLowerCase().includes(query) || report.user_reported.login.toLowerCase().includes(query));
  }
});

const paginatedReports = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return filteredReports.value.slice(startIndex, endIndex);
});

const totalPages = computed(() => Math.ceil(filteredReports.value.length / pageSize));

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

watch([filteredReports, currentPage], () => {
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value;
  }
});

function confirmAcceptReport(userId) {
  if (confirm("Êtes-vous sûr de vouloir accepter ce signalement ?")) {
    acceptReport(userId);
  }
}

function confirmRefuseReport(reportId) {
  if (confirm("Êtes-vous sûr de vouloir refuser ce signalement ?")) {
    refuseReport(reportId);
  }
}

async function acceptReport(reportId) {
  const updatedReport = {
    status: 'accepted',
    updatedAt: new Date().toISOString()
  };

  const response = await fetch(`http://149.202.52.182:3000/reports/${reportId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token')
    },
    body: JSON.stringify(updatedReport)
  });

  if (response.ok) {
    const index = reports.findIndex(report => report.id === reportId);
    reports[index] = { ...reports[index], ...updatedReport };
  } else {
    alert('Error while editing report');
  }
}

async function refuseReport(reportId) {
  const updatedReport = {
    status: 'refused',
    updatedAt: new Date().toISOString()
  };

  const response = await fetch(`http://149.202.52.182:3000/reports/${reportId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + localStorage.getItem('token')
    },
    body: JSON.stringify(updatedReport)
  });

  if (response.ok) {
    const index = reports.findIndex(report => report.id === reportId);
    reports[index] = { ...reports[index], ...updatedReport };
  } else {
    alert('Error while editing report');
  }
}
</script>


<style scoped>

.done-tag {
    display: inline-block;
    background-color: #8d54ce;
    color: #ffffff;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: bold;
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
