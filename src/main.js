import { createApp } from 'vue';

import App from './App.vue';
import router from './router.js';

import BaseCard from './components/ui/BaseCard.vue';
import BaseInput from './components/ui/BaseInput.vue';
import BaseButton from './components/ui/BaseButton.vue';

const app = createApp(App);
app.use(router);

app.component('base-card', BaseCard);
app.component('base-input', BaseInput);
app.component('base-button', BaseButton);

app.mount('#app');
