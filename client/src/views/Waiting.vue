<script setup>

import {inject, ref} from "vue";

const isLoading = ref(true);

const user = inject('user');

</script>
<template>
  <div class="container">
    <div v-if="isLoading" class="centered">
      <img src="../assets/loading.svg" class="rotating-image">
    </div>
  </div>
</template>

<style scoped>
.container{
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.centered {
  display: flex;
  justify-content: center;
  align-items: center;
}

.rotating-image {
  width: 100px;
  height: 100px;
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
