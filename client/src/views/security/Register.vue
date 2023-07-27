<script setup>
import { ref } from 'vue';
import UserForm from '../../components/UserForm.vue';
import router from '../../router';

const verificationMessage = ref('');
const isSuccess = ref('');

async function registerUser(_user) {
  const response = await fetch(`http://149.202.52.182:3000/register`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(_user)
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
}

</script>

<template>
  <div class="container">
    <img src="../../assets/logo.png" alt="logo" class="logo"/>
    <div class="form-container">
      <UserForm :onSubmit="registerUser" />
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

<style scoped></style>