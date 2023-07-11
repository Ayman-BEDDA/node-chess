<script setup>
import ReportList from './ReportList.vue';
import { ref, reactive } from 'vue';
import jwtDecode from 'jwt-decode'

const token = localStorage.getItem('token');
const user = ref(token ? jwtDecode(token) : null);

document.addEventListener('DOMContentLoaded', function() {
  const menuIconEl = document.querySelector('.menu-icon');
  const sidenavEl = document.querySelector('.sidenav');
  const sidenavCloseEl = document.querySelector('.sidenav__close-icon');

  function toggleClassName(el, className) {
    if (el.classList.contains(className)) {
      el.classList.remove(className);
    } else {
      el.classList.add(className);
    }
  }

  // Open the side nav on click
  menuIconEl.addEventListener('click', function() {
    toggleClassName(sidenavEl, 'active');
  });

  // Close the side nav on click
  sidenavCloseEl.addEventListener('click', function() {
    toggleClassName(sidenavEl, 'active');
  });
});
</script>

<template>
<div class="grid-container">
  <div class="menu-icon">
    <i class="fas fa-bars header__menu"></i>
  </div>
  
  <!-- Begin Header-->
  <header class="header">
    <div class="header__search"> Search...</div>
    <div class="header__avatar">Your face</div>
  </header>
 <!--End Header-->
  
  
 <!--Begin Sidenav-->
  <aside class="sidenav">
    <div class="sidenav__close-icon">
      <i class="fas fa-times sidenav__brand-close"></i>
    </div>
    <ul class="sidenav__list">
      <li class="sidenav__list-item"><router-link to="/admin/" class="nav-link">Dashboard</router-link></li>
      <li class="sidenav__list-item"><router-link to="/admin/users" class="nav-link">Utilisateurs</router-link></li>
      <li class="sidenav__list-item"><router-link to="/admin/reports" class="nav-link">Sanctions</router-link></li>
      <li class="sidenav__list-item"><router-link to="/" class="nav-link">Page d'accueil</router-link></li>
    </ul>
  </aside>
  <!--End Sidenav--> 
  
  <!-- Begin Main-->
  <main>
    <div class="main__col--1">
      <h2>Liste des sanctions</h2>
    </div>

    <ReportList v-if="user" />
  </main>
<!-- End Main -->
 <!--Begin Footer--> 
  <footer class="footer">
    <div class="footer__copyright">&copy; 2023 Node Chess</div>
    <div class="footer__signature">Groupe 3</div>
  </footer>
<!--End Footer-->  
</div>
</template>

<script>
export default {
  name: 'Admin_reports',
  // Logique du composant Admin
}
</script>

<style scoped>
/* Styles spécifiques à Admin_reports.vue */
/* Styles spécifiques à Admin.vue */

* {
  /*
  outline: 1px solid black; */
  box-sizing: border-box;
}

main {
  display: grid;
  grid-template-rows: 100px max-content max-content 1fr;
  background-color: #fff;
  padding: 0 20px;
}

/* Main col 1 */
.main__col--1 {
  align-self: center;
  color: black;
}

body {
  margin: 0;
  padding: 0;
  color: #fff;
  box-sizing: border-box;
  font-family: 'Open Sans', Helvetica, sans-serif;
}

/* Mobile First Format--Assign grid instructions to our parent grid container; hide the sidenav */

.grid-container {
  display: grid;
  grid-template-columns: 1fr; /*Side Nav hidden */
  grid-template-rows: 50px 1fr 50px;
  grid-template-areas:
    'header'
    'main'
    'footer';
  height: 100vh; 
  overflow-y: scroll
}

.nav-link {
  color: white;
  text-decoration: none;
}

.menu-icon {
  position: fixed; /*Needs to stay visible for all mobile scrolling */
  display: flex;
  top: 5px;
  left: 10px;
  align-items: center;
  justify-content: center;
  background-color: #DADAE3;
  border-radius: 50%;
  z-index: 1;
  cursor: pointer;
  padding: 12px;
}

/*Give every child element its grid name*/
.header {
  grid-area: header;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background-color: #252849;
}

/* Make room for the menu icon on mobile */
.header__search {
  margin-left: 42px;
}

.sidenav {
  grid-area: sidenav;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 240px;
  position: fixed;
  overflow-y: auto;
  transform: translateX(-245px);
  transition: all .6s ease-in-out;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08);
  z-index: 2;
  /*Needs to sit above the hamburger menu icon */
  background-color: #202443;
}

.sidenav.active {
  transform: translateX(0);
}

.sidenav__close-icon {
  position: absolute;
  visibility: visible;
  top: 8px;
  right: 12px;
  cursor: pointer;
  font-size: 20px;
  color: #ddd;
}

.sidenav__list {
  padding: 0;
  margin-top: 85px;
  list-style-type: none;
}

.sidenav__list-item {
  padding: 20px 20px 20px 40px;
  color: #ddd;
}

.sidenav__list-item:hover {
  background-color: rgba(255, 255, 255, 0.2);
  cursor: pointer;
}

.main {
  grid-area: main;
  background-color: #fff;
}

.main-header {
  display: flex;
  justify-content: space-between;
  margin: 20px;
  padding: 20px; 
  height: 150px;
  background-color: #cbbcf6;
  color: slategray;
}

.main-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(265px, 1fr));
  grid-auto-rows: 94px;
  grid-gap: 20px;
  margin: 20px;
}

.overviewcard {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background-color: #cbbcf6;
}

.main-cards {
  column-count: 1;
  column-gap: 20px;
  margin: 20px;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background-color: #cbbcf6;
  margin-bottom: 20px;
  -webkit-column-break-inside: avoid;
  padding: 24px;
  box-sizing: border-box;
  
}

/* Force varying heights to simulate dynamic content */

.card:first-child {
  height: 485px;
}

.card:nth-child(2) {
  height: 200px;
}

.card:nth-child(3) {
  height: 256px;
}

.footer {
  grid-area: footer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background-color: #252849;
}

/* Non-mobile styles, 750px breakpoint */
@media only screen and (min-width: 46.875em) {
  /*Show the sidenav */
  .grid-container {
    grid-template-columns: 240px 1fr;
    grid-template-areas: "sidenav header" 
      "sidenav main" 
      "sidenav footer";
  }
  .header__search {
    margin-left: 0;
  }
  .sidenav {
    position: relative;
    transform: translateX(0);
  }
  .sidenav__close-icon {
    visibility: hidden;
  }
}

/* Medium screens breakpoint (1050px) */
@media only screen and (min-width: 65.625em) {
  /* Break out main cards into two columns */
  .main-cards {
    column-count: 2;
  }
}
</style>
