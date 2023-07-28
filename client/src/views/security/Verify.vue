<script setup>
import { onMounted, ref } from 'vue';
import router from '../../router';

const verificationMessage = ref('');
const isSuccess = ref(false);

async function verifyUser() {
  try {
    const token = router.currentRoute.value.query.token;
    const response = await fetch(`http://localhost:3000/verify/${token}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json'
      },
    });

    const message = await response.text();

    if (response.ok) {
      isSuccess.value = true;
      verificationMessage.value = message
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } else {
      isSuccess.value = false;
      verificationMessage.value = message;
    }
  } catch (error) {
    console.error(error);
    isSuccess.value = false;
    verificationMessage.value = error.message;
  }
}

onMounted(() => {
  verifyUser();
});

</script>

<template>
  <div class="container">
    <img src="../../assets/logo.png" alt="logo" class="logo"/>
    <div class="form-container">
      <div v-if="isSuccess" class="alert alert-success" role="alert">
        {{ verificationMessage }}
      </div>
      <div v-else class="alert alert-danger" role="alert">
        {{ verificationMessage }}
        <router-link to="/login">Login</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>


