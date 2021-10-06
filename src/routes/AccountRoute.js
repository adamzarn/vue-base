import AccountPage from "../components/pages/Account/AccountPage.vue";
import ProfilePage from "../components/pages/Account/ProfilePage.vue";
import ActivityPage from "../components/pages/Account/ActivityPage.vue";

const AccountRoute = {
    name: "account",
    path: "/account/:userId",
    component: AccountPage,
    children: [
        {
            name: "profile",
            path: "/account/:userId/profile",
            component: ProfilePage
        },
        {
            name: "activity",
            path: "/account/:userId/activity",
            component: ActivityPage
        }
    ]
}

export default AccountRoute;