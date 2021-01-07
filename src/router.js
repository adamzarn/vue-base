import { createRouter, createWebHistory } from 'vue-router';
import LoginRoute from './routes/LoginRoute';
import RegisterRoute from './routes/RegisterRoute';
import HomeRoute from './routes/HomeRoute';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/home' },
        LoginRoute,
        RegisterRoute,
        HomeRoute
    ]
})

export default router;