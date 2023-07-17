<script setup>
import { inject } from 'vue';
import LoginForm from '../../components/LoginForm.vue';

import jwtDecode from 'jwt-decode'
import router from '../../router';

const user = inject('user');

async function loginUser(_user) {
  const response = await fetch(`http://localhost:3000/login`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(_user)
  });
  if (response.status === 422) {
    return Promise.reject(await response.json());
  } else if (response.ok) {
    const data = await response.json();
    const token = data.token;
    user.value = jwtDecode(token);
    localStorage.setItem('token', token);
    return Promise.resolve(data).then(() => {
      router.push('/');
    });
  }
  throw new Error('Fetch failed');
}
</script>

<template>
  <div class="container">
    <img src="../../assets/logo.png" alt="logo" class="logo"/>
    <div class="form-container">
      <LoginForm :onSubmit="loginUser" />
    </div>
  </div>
</template>

<style scoped>
</style>