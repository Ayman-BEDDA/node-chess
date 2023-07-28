<script setup>
import AdminDashboard from '../components/AdminDashboard.vue';
import BuyList from './BuyList.vue';
import { ref, reactive, inject } from 'vue';

const user = inject('user');
</script>

<template>
  <AdminDashboard>
    <template v-slot:title>Liste des achats</template>
    <BuyList v-if="user" />
  </AdminDashboard>
</template>