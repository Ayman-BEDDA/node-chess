<script setup>
import { ref } from 'vue';
import ResetPassForm from '../../components/ResetPassForm.vue';
import router from '../../router';

const verificationMessage = ref('');
const isSuccess = ref('');

async function resetPassword(_user) {
  try {
  const token = router.currentRoute.value.query.token;
  const response = await fetch(`http://149.202.52.182:3000/reset-password/${token}`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ password: _user.password }),
  });

  const message = await response.text();

  if (response.ok) {
    isSuccess.value = true;
    verificationMessage.value = message
    setTimeout(() => {
      router.push('/login');
    }, 5000);
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

</script>

<template>
  <div class="container">
    <img src="../../assets/logo.png" alt="logo" class="logo"/>
    <div class="form-container">
      <ResetPassForm :onSubmit="resetPassword" />
      <div v-if="verificationMessage">
        <div v-if="isSuccess" class="alert alert-success" role="alert">
          {{ verificationMessage }}
        </div>
        <div v-else class="alert alert-danger" role="alert">
          {{ verificationMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>


