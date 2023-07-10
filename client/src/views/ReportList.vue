<template>
  <div class="report-list">
    <input type="text" v-model="searchQuery" placeholder="Search reports" class="search-input">
    <ul v-if="!isLoading" class="report-list__list">
      <li v-if="filteredReports.length" v-for="report in paginatedReports" :key="report.id" class="report-list__item">
        {{ report.id }} {{ report.message }} {{ report.status }}
      </li>
      <li v-if="filteredReports.length === 0" class="report-list__item report-list__item--empty">No reports</li>
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

const reports = reactive([]);
const isLoading = ref(true);
const currentPage = ref(1);
const pageSize = 10;
const searchQuery = ref('');
const filteredQuery = ref('');

onMounted(async () => {
  const response = await fetch(`http://localhost:3000/reports`, {
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
    return reports.filter(report => report.id.toString().includes(query));
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
</script>


<style scoped>
.report-list {
  width: 100%;
  margin: 0 auto;
  padding: 20px;
}

.search-input {
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
}

.report-list__list {
  list-style: none;
  padding: 0;
}

.report-list__item {
  margin-bottom: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  color: black;
}

.report-list__item--empty {
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
</style>
