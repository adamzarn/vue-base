import { createRouter, createWebHistory } from 'vue-router';
import LoginRoute from './routes/LoginRoute';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/login' },
        LoginRoute,
    ]
})

export default router;