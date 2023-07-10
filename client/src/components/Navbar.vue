<template>
    <nav v-if="shouldShowNavbar">
    <router-link to="/">Home</router-link>
    <router-link to="/admin">Dashboard admin</router-link>
    <button @click="logoutUser"><i class="fas fa-sign-out-alt"></i> Se déconnecter</button>
    </nav>
</template>
  
  <script>
  export default {
    props: {
      user: {
        type: Object,
        required: true
      },
      logoutUser: {
        type: Function,
        required: true
      }
    },
    computed: {
    shouldShowNavbar() {
      const currentPath = this.$route.path;
      return !currentPath.includes('/admin');
    }
  } 
  }
  </script>
  
  <style>
    nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      color: #eee;
    }

    nav a {
      text-decoration: none;
      color:#eee;
    }

    nav button {
      background: none;
      border: none;
      color: #eee;
      font-size: 16px;
      cursor: pointer;
    }
  </style>
  