<script setup>
import { ref, reactive, inject, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const user = inject('user');
const route = useRoute();

const isLinkActive = (path) => {
  return route.path === path;
};

const homeLink = "/";
const dashboardLink = "/admin/home";
const usersLink = "/admin/users";
const reportsLink = "/admin/reports";
const articlesLink = "/admin/articles";
const buysLink = "/admin/buys";
const moneysLink = "/admin/moneys";
</script>

<template>

<input type="checkbox" id="nav-toggle">
    <div class="sidebar">
        <div class="logo-container">
          <router-link to="/"><img src="../assets/logo.png" alt="logo" class="sidebar-brand"/></router-link>
        </div>
        
        <div class="sidebar-menu">
          <ul>
            <li>
              <router-link to="/">
                <span class="fas fa-home"></span>
                <span>Page d'accueil</span>
              </router-link>
            </li>
            <li>
              <router-link :to="dashboardLink" :class="{ 'active': isLinkActive(dashboardLink) }">
                <span class="fas fa-tachometer-alt"></span>
                <span>Dashboard</span>
              </router-link>
            </li>
            <li>
              <router-link :to="usersLink" :class="{ 'active': isLinkActive(usersLink) }">
                <span class="fas fa-users" ></span>
                <span>Utilisateurs</span>
              </router-link>
            </li>
            <li>
              <router-link :to="reportsLink" :class="{ 'active': isLinkActive(reportsLink) }">
                <span class="fas fa-tasks"></span>
                <span>Sanctions</span>
              </router-link>
            </li>
            <li>
              <router-link :to="articlesLink" :class="{ 'active': isLinkActive(articlesLink) }">
                <span class="fas fa-clipboard-list"></span>
                <span>Articles</span>
              </router-link>
            </li>
            <li>
              <router-link :to="buysLink" :class="{ 'active': isLinkActive(buysLink) }">
                <span class="fas fa-shopping-cart"></span>
                <span>Achats</span>
              </router-link>
            </li>
            <li>
              <router-link :to="moneysLink" :class="{ 'active': isLinkActive(moneysLink) }">
                <span class="fas fa-wallet"></span>
                <span>Monnaies</span>
              </router-link>
            </li>
          </ul>
        </div>
    </div>    

    <div class="main-content">
      <header>
        <h2>
          <label for="nav-toggle">
            <span class="fas fa-bars"></span>
          </label>
          Dashboard
        </h2>

        <div class="user-wrapper dropdown">
          <img :src="user.media" class="avatar" />
          <div class="user-info">
            <h4>{{ user.login }}</h4>
            <small>Admin</small>
          </div>
          <div class="dropdown-content">
            <router-link to="/me"><i class="fas fa-user"></i> Mon profil</router-link>
          </div>
        </div>
      </header>

      <main>
        <slot></slot>

        <footer class="footer">
          <div class="footer__content">
            <div class="footer__copyright">
              &copy; 2023 Node Chess | Groupe 3
            </div>
          </div>
        </footer>
      </main>

    </div>
</template>

<script>
export default {
  name: 'Admin_users',
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500&display=swap');

:root{
  --main-color: #11101d;
  --color-dark: #1D2231;
  --text-grey:  #8390A2;
}

*{
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  list-style: none;
  text-decoration: none;
  font-family: 'Poppins' ,sans-serif;
}

.logo-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
}

.sidebar{
  width: 345px;
  position: fixed;
  left: 0;
  top: 0;
  height: 100%;
  z-index: 100; 
  background: var(--main-color);
  transition: width 300ms;
  background-color: #11101d;

}
.sidebar-brand{
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
}

.sidebar-brand:hover {
  filter: drop-shadow(0px 0px 10px rgba(255, 255, 255, 0.9));
}

.sidebar-brand span{
  display: inline-block;
  padding-right: 1rem;
}
.sidebar-menu li{
  width: 100%;
  margin-bottom: 1.7rem;
  padding-left: 1rem;

}
.sidebar-menu{
  margin-top: 1rem;
}
.sidebar-menu a {
  padding-left: 2rem;
  display: flex;
  align-items: center;
  color: #fff;
  font-size: 1.1rem;
}

.sidebar-menu a svg {
  margin-right: 0.5rem;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown span {
  color: black;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f9f9f9;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  right: 0;
  border-radius: 5px;
  top: 100%; 
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

#nav-toggle:checked + .sidebar {
  width: 70px ;
}
#nav-toggle:checked + .sidebar .sidebar-brand,
#nav-toggle:checked + .sidebar li 
{
  padding-left: 1rem;
  text-align: center;
}
#nav-toggle:checked + .sidebar li a
{
  padding-left: 0rem;
}
#nav-toggle:checked + .sidebar .sidebar-brand h1 span:last-child,
#nav-toggle:checked + .sidebar li a span:last-child{
  display: none;
}
.sidebar-menu a span:first-child{
  font-size: 1.5rem;
  padding-right: 1rem;
}
.sidebar-menu a.active{
  background: #fff;
  padding-top: 1rem;
  padding-bottom: 1rem;
  color: black;
  border-radius: 30px 0px 0px 30px;

}
#nav-toggle:checked ~ .main-content {
  margin-left: 70px;

}
#nav-toggle:checked ~ .main-content  header{
  width: calc(100% - 70px);
  left:70px;

}
.main-content{
  transition: margin-left 300ms;
  margin-left: 345px;
}
header{
  background: #fff;
  display: flex;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  position: fixed;
  left: 345px;
  top:0;
  z-index: 100; 
  width: calc(100% - 345px);
  transition: left 300ms;
  }

#nav-toggle{
  display: none;
}
header h2{
  color: #222;
}
header label span{
  font-size: 1.7rem;
  padding-right: 1rem;
}

.user-wrapper{
  display: flex;
  align-items: center;
  color: black;
  position: relative; 
}
.user-wrapper img{
  border-radius: 50%;
  margin-right: .5rem;
}

.user-wrapper small{
  display: inline-block;
  color: var(--text-grey);
  margin-top: -1px !important;

}
main{
  margin-top: 80px;
  padding: 2rem 1.5rem;
  background: #f1f5f9;
  min-height: calc(100vh - 90px);
}

.recent-grid{
  margin-top: 3.5rem;
  display: grid;
  grid-gap: 2rem;
  grid-template-columns: 65% auto;
 
}

table{
  border-collapse: collapse;
}
thead tr{
  border-top: 1px solid #f0f0f0;
  border-bottom:2px solid #f0f0f0;

}
thead td{
  font-weight: 700;
}
td{
  padding: .5rem 1rem ;
  font-size: .9rem ;
  color: #222;
  
}

tr td:last-child{
  display: flex;
  align-items: center;


}
td .status{
  display: inline-block;
  height: 10px;
  width: 10px;
  border-radius: 50%;
  margin-right: 1rem; 
}
.status.purple {
  background: rebeccapurple;
}
.status.pink{
  background: deeppink;
}
.status.orange{
  background: orangered;
}
.table-responsive{
  width: 100%;
  overflow-x: auto;
}
.customer{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: .5rem .7rem;
}
.info{
  display: flex;
  align-items: center;
}
.info img{
  border-radius: 50%;
  margin-right: 1rem;
}
.info h4{
  font-size: .8rem;
  font-weight: 700;
  color: #222;
}
.info small{
  font-weight: 600;
  color: var(--text-grey);
}
.contact span{
  font-size: 1.2rem;
  display: inline-block;
  margin-left: .5rem;
  color:  var(--main-color);

}

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: var(--main-color);
  color: black;
}

.footer__content {
  display: flex;
  justify-content: flex-end; /* Align the content to the right */
  align-items: center;
  padding: 1rem;
}

.footer__copyright {
  font-size: 1rem;
}

@media only screen and (max-width: 1200px){

  .sidebar{
    width: 70px ;
  }
  .sidebar .sidebar-brand,
  .sidebar li 
  {
    padding-left: 1rem;
    text-align: center;
  }
  #nav-toggle:checked + .sidebar li a
  {
    padding-left: 0rem;
  }
  .sidebar .sidebar-brand h1 span:last-child,
  .sidebar li a span:last-child{
    display: none;

  }
  
  .main-content {
  margin-left: 70px;

  }
  .main-content  header{
    width: calc(100% - 70px);
    left:70px;

  }
}

@media only screen and (max-width: 960px){
  .cards{
    grid-template-columns: repeat(3, 1fr);
  }
  .recent-grid{
    grid-template-columns: 60% 40%;
  }
}

@media only screen and (max-width: 768px){
  .cards{
    grid-template-columns: repeat(2, 1fr);
  }
  .recent-grid{
    grid-template-columns: 100%;
  }
  .search-wrapper{
    display: none;
  }
  .sidebar {
    
    left: -100% !important;
  }
  header h2{
    display: flex;
    align-items: center;
  }
  header h2 label{
    display: inline-block;
    text-align: center;
    background: var(--main-color);
    padding-right: 0rem;
    margin-right: 1rem;
    height: 40px;
    width: 40px;
    border-radius: 50%;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center !important;
    background-color: #11101d;
  }
  header h2 span{
    text-align: center;
    padding-right: 0rem;
  }
  header h2{
    font-size: 1.1rem;
  }
  .main-content{
    width: 100%;
    margin-left: 0rem;
  }
  header{
    width: 100% !important;
    left: 0 !important;
  }
  #nav-toggle:checked + .sidebar{
    left: 0 !important;
    z-index: 100;
    width: 345px;
  }
  
  #nav-toggle:checked .sidebar .sidebar-brand,
  #nav-toggle:checked + .sidebar li 
  {
    padding-left: 2rem;
    text-align: left;
  }

  #nav-toggle:checked + .sidebar li a
  {
    padding-left: 1rem;
  }
  #nav-toggle:checked  + .sidebar .sidebar-brand h1 span:last-child,
  #nav-toggle:checked + .sidebar li a span:last-child{
    display: inline;

  }
  #nav-toggle:checked ~ .main-content{
    margin-left: 0rem !important;
  }
}
@media only screen and (max-width: 560px){
  .cards{
    grid-template-columns: 100%;
  }
}
</style>
