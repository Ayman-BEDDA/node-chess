<script setup>
import { ref, provide } from 'vue';
import Navbar from './components/Navbar.vue';
import jwtDecode from 'jwt-decode'

// Font Awesome
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';

const token = localStorage.getItem('token');
const user = ref(token ? jwtDecode(token) : null);

provide('user', user);

</script>

<template>
  <div id="app">
    <Navbar v-if="user" />
    <router-view />
  </div>
</template>

<style>

.logo {
  width: 175px;
  height: 175px;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  flex-direction: column;
}

.form-container {
  flex: 1;
  margin: 0 auto;
}

.alert {
  margin-top: 20px;
  width: 100%;
  text-align: center;
  padding: 10px;
  border-radius: 5px;
  font-weight: bold;
  z-index: 1;
}

.alert-danger {
  color: white;
  background-color: rgba(255, 0, 0, 0.5);
}

.alert-success {
  color: white;
  background-color: rgba(0, 255, 0, 0.5);
}
</style>

<script>
export default {
  name: 'App',
  components: {
    Navbar
  },
  setup() {
    return {
      user
    }
  }
}
</script>
