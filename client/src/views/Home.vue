<script setup>
import { inject } from 'vue';
import MainMenu from '../components/MainMenu.vue';

inject('user');

</script>

<template>
    <MainMenu />
</template>

<style scoped>
  h1 {
    margin-left: 1rem;
    font-size: 3em;
    padding: 0;
  }

@media (max-width: 1023px) {
  h1 {
    font-size: 40px;
  }
}

@media (max-width: 767px) {
  h1 {
    font-size: 30px;
  }
}

@media (max-width: 479px) {
  h1 {
    font-size: 20px;
  }
}
</style>
