import { createRouter, createWebHistory } from 'vue-router';
import LoginRoute from './routes/LoginRoute';
import RegisterRoute from './routes/RegisterRoute';
import HomeRoute from './routes/HomeRoute';
import ProfileRoute from './routes/ProfileRoute';
import ResetPasswordRoute from './routes/ResetPasswordRoute';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/home' },
        LoginRoute,
        RegisterRoute,
        HomeRoute,
        ProfileRoute,
        ResetPasswordRoute
    ]
})

export default router;