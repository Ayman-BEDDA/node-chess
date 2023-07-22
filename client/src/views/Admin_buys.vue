<script setup>
import AdminDashboard from '../components/AdminDashboard.vue';
import BuyList from './BuyList.vue';
import { ref, reactive } from 'vue';
import jwtDecode from 'jwt-decode'

const token = localStorage.getItem('token');
const user = ref(token ? jwtDecode(token) : null);
</script>

<template>
  <AdminDashboard>
    <template v-slot:title>Liste des achats</template>
    <BuyList v-if="user" />
  </AdminDashboard>
</template>