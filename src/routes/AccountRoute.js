import AccountPage from '../components/pages/Account/AccountPage.vue';
import ProfilePage from '../components/pages/Account/ProfilePage.vue';
import HistoryPage from '../components/pages/Account/HistoryPage.vue';

const AccountRoute = {
    name: 'account',
    path: '/account/:userId',
    component: AccountPage,
    children: [
        {
            name: 'profile',
            path: '/account/:userId/profile',
            component: ProfilePage
        },
        {
            name: 'history',
            path: '/account/:userId/history',
            component: HistoryPage
        }
    ]
}

export default AccountRoute;