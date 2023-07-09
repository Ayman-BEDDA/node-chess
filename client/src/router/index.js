import { createRouter, createWebHistory } from 'vue-router';
import { ref } from 'vue';
import jwtDecode from 'jwt-decode';
import Home from '../views/Home.vue';
import Admin from '../views/Admin.vue';
import Stats from '../views/Stats.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: { requiresAuth: true, requiresAdmin: true },
  },
  {
    path: '/stats',
    name: 'Stats',
    component: Stats,
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
  const isAdmin = user.value?.id_role === 3;

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!isLogged) {
      next({ name: 'Home' });
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
    next();
  }
});

export default router;
