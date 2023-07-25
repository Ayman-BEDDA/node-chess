<script setup>
import AdminDashboard from '../components/AdminDashboard.vue';
import ReportList from './ReportList.vue';
import { ref, reactive, inject } from 'vue';

const user = inject('user');
</script>

<template>
  <AdminDashboard>
    <template v-slot:title>Liste des sanctions</template>
    <ReportList v-if="user" />
  </AdminDashboard>
</template>