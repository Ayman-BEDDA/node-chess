<script setup>
import { ref, reactive } from 'vue';
import UserForm from './components/UserForm.vue';
import LoginForm from './components/LoginForm.vue';
import Navbar from './components/Navbar.vue';
import UserList from './views/UserList.vue';
import jwtDecode from 'jwt-decode'


// Font Awesome
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';

const token = localStorage.getItem('token');
const user = ref(token ? jwtDecode(token) : null);

async function registerUser(_user) {
  const response = await fetch(`http://localhost:3000/register`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(_user)
  });
  if (response.status === 422) {
    return Promise.reject(await response.json());
  } else if (response.ok) {
    return Promise.resolve(await response.json());
  }
  throw new Error('Fetch failed');
}
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
    return Promise.resolve(data);
  }
  throw new Error('Fetch failed');
}
async function logoutUser() {
  user.value = null;
  localStorage.removeItem('token');
}

</script>

<template>
    <Navbar v-if="user" :user="user" :logoutUser="logoutUser" /> <!-- Utilisez le composant Navbar ici -->
    <router-view></router-view>
    
    <UserList v-if="user" />

    <div class="container">
      <div class="form-container">
        <UserForm v-if="!user" :onSubmit="registerUser" />
      </div>
      <div class="form-container">
        <LoginForm v-if="!user" :onSubmit="loginUser" />
      </div>
    </div>
</template>

<style>

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.form-container {
  flex: 1;
  margin: 0 auto;
}
</style>

<script></script>