<script setup>
import AdminDashboard from '../components/AdminDashboard.vue';
import UserList from './UserList.vue';
import { ref, reactive, inject } from 'vue';

const user = inject('user');
</script>

<template>
  <AdminDashboard>
    <template v-slot:title>Liste des utilisateurs</template>
    <UserList v-if="user" />
  </AdminDashboard>
</template>