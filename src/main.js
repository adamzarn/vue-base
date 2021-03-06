import { createApp } from 'vue';

import App from './App.vue';
import router from './router.js';

import BaseCard from './components/base/BaseCard.vue';
import BaseInput from './components/base/BaseInput.vue';
import BaseButton from './components/base/BaseButton.vue';
import TheHeader from './components/TheHeader.vue';
import BaseModal from './components/base/BaseModal.vue';

const app = createApp(App);

app.component('base-card', BaseCard);
app.component('base-input', BaseInput);
app.component('base-button', BaseButton);
app.component('the-header', TheHeader);
app.component('base-modal', BaseModal);

app.use(router);

app.mount('#app');
