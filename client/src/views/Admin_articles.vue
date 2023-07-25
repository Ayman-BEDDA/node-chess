<script setup>
import AdminDashboard from '../components/AdminDashboard.vue';
import ArticleList from './ArticleList.vue';
import { ref, reactive, inject } from 'vue';

const user = inject('user');
</script>

<template>
  <AdminDashboard>
    <template v-slot:title>Liste des articles</template>
    <ArticleList v-if="user" />
  </AdminDashboard>
</template>