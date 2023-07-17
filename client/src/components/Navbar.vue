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
  
<template>
  <nav v-if="shouldShowNavbar">
    <div class="navbar">
      <router-link to="/"><img src="../assets/logo.png" alt="logo" class="logo"/></router-link>
      <div class="dropdown">
        {{ user.login }}
        <img :src="user.media" class="avatar" />
        <div class="dropdown-content">
          <router-link to="/me"><i class="fas fa-user"></i> Mon profil</router-link>
          <button @click="logoutUser"><i class="fas fa-sign-out-alt"></i> Se déconnecter</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  margin: 0 20px;
}

.navbar a {
  text-decoration: none;
  color: inherit;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropbtn {
  text-decoration: none;
  color: inherit;
  padding: 0;
  cursor: pointer;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
  right: 0;
  border-radius: 5px;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-content button {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
}

.dropdown-content a:hover {background-color: #f1f1f1; border-radius: 5px;}
.dropdown-content button:hover {background-color: #f1f1f1; border-radius: 5px;}

.dropdown:hover .dropdown-content {
  display: block;
}

.avatar {
  vertical-align: middle;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-left: 10px;
}

.logo {
  width: 150px;
  height: 150px;
  transition: all 0.3s ease-in-out;
}

.logo:hover {
  filter: drop-shadow(0px 0px 10px rgba(255, 255, 255, 0.9));
}
</style>
  