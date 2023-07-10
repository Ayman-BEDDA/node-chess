import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Admin from '../views/Admin.vue';
import Admin_users from '../views/Admin_users.vue';
import Admin_reports from '../views/Admin_reports.vue';

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
  },
  {
    path: '/admin/users',
    name: 'Admin_users',
    component: Admin_users,
  },
  {
    path: '/admin/reports',
    name: 'Admin_reports',
    component: Admin_reports,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
