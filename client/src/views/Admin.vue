<script setup>
import AdminDashboard from '../components/AdminDashboard.vue';
import ReportList from './ReportList.vue';
import { ref, reactive } from 'vue';
import jwtDecode from 'jwt-decode'

const token = localStorage.getItem('token');
const user = ref(token ? jwtDecode(token) : null);
</script>

<template>
  <AdminDashboard>
    <template v-slot:title>Dashboard</template>
    
    <div class="main-header">
      <div class="main-header__heading">Hello User</div>
      <div class="main-header__updates">Recent Items</div>
    </div> <!--End Main Header-->
 
    <!--Begin Main Overview-->
    <div class="main-overview">
      <div class="overviewcard">
        <div class="overviewcard__icon">Overview 1</div>
        <div class="overviewcard__info">Card</div>
      </div>
      <div class="overviewcard">
        <div class="overviewcard_icon">Overview 2</div>
        <div class="overviewcard__info">Card</div>
      </div>
      <div class="overviewcard">
        <div class="overviewcard__icon">Overview 3</div>
        <div class="overviewcard__info">Card</div>
      </div>
      <div class="overviewcard">
        <div class="overviewcard__icon">Overview 4</div>
        <div class="overviewcard__info">Card</div>
      </div>
    </div>
   <!--End Main Overview--> 
  
    <!--Begin Main Cards-->
    <div class="main-cards">
      <div class="card">Card</div>
      <div class="card">Card</div>
      <div class="card">Card</div>
    </div>
  </AdminDashboard>
</template>

<style scoped>

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

/* Medium screens breakpoint (1050px) */
@media only screen and (min-width: 65.625em) {
  /* Break out main cards into two columns */
  .main-cards {
    column-count: 2;
  }
}
</style>
