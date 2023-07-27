<template>
    <div class="recent-grid">
      <div class="projects">
        <div class="card">
          <div class="card-header">
            <h2>Achats</h2>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <div class="search-wrapper">
                <span> </span>
                <input type="search" v-model="searchQuery" placeholder="Chercher un achat..." />

              </div>
              <table width="100%" v-if="!isLoading">
              <thead>
                <tr>
                  <td>Utilisateur</td>
                  <td>Article</td>
                  <td>Date d'achat</td>
                </tr>
              </thead>
              <tbody>
                <tr v-if="filteredBuys.length" v-for="buy in paginatedBuys" :key="buy.id">
                  <td>{{ buy.user.login }}</td>
                  <td>{{ buy.article.libelle }}</td>
                  <td>{{ formatDate(buy.date) }}</td>
                </tr>
                <tr v-if="filteredBuys.length === 0">
                  <td colspan="4">Pas d'achats</td>
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
  
  const buys = reactive([]);
  const isLoading = ref(true);
  const currentPage = ref(1);
  const pageSize = 10;
  const searchQuery = ref('');
  const filteredQuery = ref('');
  
  onMounted(async () => {
    const response = await fetch(`http://149.202.52.182:3000/buys`, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
      }
    });
    if (response.ok) {
        buys.push(...(await response.json()));
      isLoading.value = false;
    } else {
      alert('Error while fetching');
    }
  });
  
  const filteredBuys = computed(() => {
    if (filteredQuery.value === '') {
      return buys;
    } else {
      const query = filteredQuery.value.toLowerCase();
      return buys.filter(buy => buy.article.libelle.toLowerCase().includes(query) || buy.user.login.toLowerCase().includes(query));
    }
  });
  
  const paginatedBuys = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredBuys.value.slice(startIndex, endIndex);
  });
  
  const totalPages = computed(() => Math.ceil(filteredBuys.value.length / pageSize));
  
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
  
  watch([filteredBuys, currentPage], () => {
    if (currentPage.value > totalPages.value) {
      currentPage.value = totalPages.value;
    }
  });
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

  .search-input {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
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
  }
  </style>
  