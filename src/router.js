import { createRouter, createWebHistory } from "vue-router";
import LoginRoute from "./routes/LoginRoute";
import RegisterRoute from "./routes/RegisterRoute";
import HomeRoute from "./routes/HomeRoute";
import AccountRoute from "./routes/AccountRoute";
import ResetPasswordRoute from "./routes/ResetPasswordRoute";
import ManageUsersRoute from "./routes/ManageUsersRoute";
import VerifyEmailRoute from "./routes/VerifyEmailRoute";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: "/", redirect: "/home" },
        LoginRoute,
        RegisterRoute,
        HomeRoute,
        AccountRoute,
        ResetPasswordRoute,
        ManageUsersRoute,
        VerifyEmailRoute,
        { path: "/:catchAll(.*)", redirect: "/home" }
    ]
})

export default router;