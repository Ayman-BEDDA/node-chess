<script setup>
import AdminDashboard from '../components/AdminDashboard.vue';
import ReportList from './ReportList.vue';
import { ref, reactive } from 'vue';
import jwtDecode from 'jwt-decode'

const token = localStorage.getItem('token');
const user = ref(token ? jwtDecode(token) : null);
</script>

<template>
  <AdminDashboard>
    <template v-slot:title>Liste des sanctions</template>
    <ReportList v-if="user" />
  </AdminDashboard>
</template>