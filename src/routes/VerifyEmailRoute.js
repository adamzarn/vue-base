import VerifyEmailPage from "../components/pages/VerifyEmailPage.vue";

const VerifyEmailRoute = {
    name: "verifyEmail",
    path: "/verifyEmail/:tokenId",
    component: VerifyEmailPage
}

export default VerifyEmailRoute;