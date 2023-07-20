<template>
    <div class="buy-list">
      <input type="text" v-model="searchQuery" placeholder="Rechercher des achats" class="search-input">
      <table v-if="!isLoading" class="buy-list__table responsive-table">
        <thead>
          <tr>
            <th>Utilisateur</th>
            <th>Article</th>
            <th>Date d'achat</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredBuys.length" v-for="buy in paginatedBuys" :key="buy.id" class="buy-list__item">
            <td>{{ buy.user.login }}</td>
            <td>{{ buy.article.libelle }}</td>
            <td>{{ formatDate(buy.date) }}</td>
          </tr>
          <tr v-if="filteredBuys.length === 0" class="buy-list__item buy-list__item--empty">
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
  </template>

  <script>
      import dayjs from 'dayjs';
      import 'dayjs/locale/fr';

      dayjs.locale('fr');
      export default {
          methods: {
              formatDate(dateString) {
                  const date = dayjs(dateString);
                      // Then specify how you want your dates to be formatted
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
    const response = await fetch(`http://localhost:3000/buys`, {
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
  .buy-list__table {
    width: 100%;
    margin-bottom: 20px;
    border-collapse: collapse;
  }
  
  .buy-list__table td {
    padding: 10px;
    border: 1px solid #ccc;
    text-align: left;
    color: black;
  }
  
  .buy-list__table th {
    padding: 10px;
    border: 1px solid #ccc;
    text-align: left;
    color: black;
    background-color: #28a745;
  }
  
  .buy-list {
    width: 100%;
    margin: 0 auto;
    padding: 20px;
  }
  
  .search-input {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
  }
  
  .buy-list__list {
    list-style: none;
    padding: 0;
  }
  
  .buy-list__item {
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    color: black;
  }
  
  .buy-list__item--empty {
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
  
    /* Ajoutez ces styles pour afficher les en-têtes uniquement pour les écrans plus larges */
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
  