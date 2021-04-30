import ResetPasswordPage from '../components/pages/ResetPasswordPage.vue';

const ResetPasswordRoute = {
    name: 'resetPassword',
    path: '/resetPassword/:tokenId',
    component: ResetPasswordPage
}

export default ResetPasswordRoute;