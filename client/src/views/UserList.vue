<script setup>
import { reactive, onMounted, ref } from 'vue';

const users = reactive([]);
const isLoading = ref(true);

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
</script>

<template>
  <ul v-if="!isLoading">
    <li v-if="users.length" v-for="user in users">{{ user.id }} {{ user.email }}</li>
    <li v-if="users.length === 0">No users</li>
  </ul>
  <h2 v-if="isLoading">Loading ...</h2>
</template>
