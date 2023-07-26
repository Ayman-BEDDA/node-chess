<script setup>
import AdminDashboard from '../components/AdminDashboard.vue';
import MoneyList from './MoneyList.vue';
import { ref, reactive, inject } from 'vue';

const user = inject('user');
</script>

<template>
  <AdminDashboard>
    <template v-slot:title>Liste des monnaies</template>
    <MoneyList v-if="user" />
  </AdminDashboard>
</template>