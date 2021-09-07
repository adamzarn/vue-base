import { createApp } from 'vue';

import App from './App.vue';
import router from './router.js';

import BaseCard from './components/base/BaseCard.vue';
import BaseInput from './components/base/BaseInput.vue';
import BaseButton from './components/base/BaseButton.vue';
import TheHeader from './components/base/TheHeader.vue';
import BaseModal from './components/base/BaseModal.vue';
import ProfilePhoto from './components/base/ProfilePhoto.vue';

const app = createApp(App);

app.component('base-card', BaseCard);
app.component('base-input', BaseInput);
app.component('base-button', BaseButton);
app.component('the-header', TheHeader);
app.component('base-modal', BaseModal);
app.component('profile-photo', ProfilePhoto);

app.use(router);

app.mount('#app');
