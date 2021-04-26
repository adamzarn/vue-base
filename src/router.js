import { createRouter, createWebHistory } from 'vue-router';
import LoginRoute from './routes/LoginRoute';
import RegisterRoute from './routes/RegisterRoute';
import HomeRoute from './routes/HomeRoute';
import AccountRoute from './routes/AccountRoute';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/home' },
        LoginRoute,
        RegisterRoute,
        HomeRoute,
        AccountRoute
    ]
})

export default router;