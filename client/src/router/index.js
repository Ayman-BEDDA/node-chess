import { createRouter, createWebHistory } from 'vue-router';
import { ref } from 'vue';
import jwtDecode from 'jwt-decode';
import Home from '../views/Home.vue';
import Admin from '../views/Admin.vue';
import Admin_users from '../views/Admin_users.vue';
import Admin_reports from '../views/Admin_reports.vue';
import Admin_buys from '../views/Admin_buys.vue';
import Admin_articles from '../views/Admin_articles.vue';
import Admin_moneys from '../views/Admin_moneys.vue';
import Stats from '../views/Stats.vue';
import ForgotPassword from '../views/security/ForgotPassword.vue';
import ResetPassword from '../views/security/ResetPassword.vue';
import Login from '../views/security/Login.vue';
import Register from '../views/security/Register.vue';
import Verify from '../views/security/Verify.vue';
import Shop from '../views/Shop.vue'
import Friends from '../views/Friends.vue';
import Game from '../views/Game.vue';
import Profile from '../views/Profile.vue';
import Waiting from "@/views/Waiting.vue";
import NotFound from "@/views/NotFound.vue";

const routes = [
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
    meta: { requiresAuth: false },
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: ResetPassword,
    meta: { requiresAuth: false },
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false },
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false },
  },
  {
    path: '/verify',
    name: 'Verify',
    component: Verify,
    meta: { requiresAuth: false },
  },
  {
    path: '/me',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true },
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/home',
    name: 'Admin',
    component: Admin,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/users',
    name: 'Admin_users',
    component: Admin_users,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/reports',
    name: 'Admin_reports',
    component: Admin_reports,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/admin/buys',
    name: 'Admin_buys',
    component: Admin_buys,
  },
  {
    path: '/admin/articles',
    name: 'Admin_articles',
    component: Admin_articles,
  },
  {
    path: '/admin/moneys',
    name: 'Admin_moneys',
    component: Admin_moneys,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: { requiresAuth: false },
  },
  {
    path: '/stats',
    name: 'Stats',
    component: Stats,
    meta: { requiresAuth: true },
  },
  {
    path: '/shop',
    name: 'Shop',
    component: Shop,
    meta: { requiresAuth: true },
  },
  {
    path: '/play/:gameId',
    name: 'Play',
    component: Game,
    meta: { requiresAuth: true },
  },
  {
    path: '/friends',
    name: 'Friends',
    component: Friends,
    meta: { requiresAuth: true },
  },
    {
    path: '/waiting',
    name: 'Waiting',
    component: Waiting,
    meta: { requiresAuth: true },
    }
  ];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const user = ref(token ? jwtDecode(token) : null);

  const isLogged = !!user.value;
  const isAdmin = user.value?.role_libelle === 'admin';

  if (to.matched.length === 0) {
    next({ name: 'NotFound' });
  } else if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isLogged && to.name !== 'Login' && to.name !== 'Register' && to.name !== 'ForgotPassword' && to.name !== 'ResetPassword' && to.name !== 'Verify') {
      next({ name: 'Login' });
    } else {
      if (to.matched.some(record => record.meta.requiresAdmin)) {
        if (!isAdmin) {
          next({ name: 'Home' });
        } else {
          next();
        }
      } else {
        next();
      }
    }
  } else {
    if (isLogged && (to.name === 'Login' || to.name === 'Register' || to.name === 'ForgotPassword' || to.name === 'ResetPassword' || to.name === 'Verify')) {
      next({ name: 'Home' });
    } else {
      next();
    }
  }
});

export default router;
