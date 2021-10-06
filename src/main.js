import { createApp } from "vue";
import { createI18n } from "vue-i18n";

function loadLocaleMessages () {
    const locales = require.context("./locales", true, /[A-Za-z0-9-_,\s]+\.json$/i)
    const messages = {}
    locales.keys().forEach(key => {
      const matched = key.match(/([A-Za-z0-9-_]+)\./i)
      if (matched && matched.length > 1) {
        const locale = matched[1]
        messages[locale] = locales(key)
      }
    })
    return messages
  }

const i18n = createI18n({
    locale: process.env.VUE_APP_I18N_LOCALE || "en",
    fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "en",
    messages: loadLocaleMessages()
})

import App from "./App.vue";
import router from "./router.js";

import BaseCard from "./components/base/BaseCard.vue";
import BaseInput from "./components/base/BaseInput.vue";
import BaseButton from "./components/base/BaseButton.vue";
import TheHeader from "./components/base/TheHeader.vue";
import BaseModal from "./components/base/BaseModal.vue";
import ProfilePhoto from "./components/base/ProfilePhoto.vue";
import AlertModal from "./components/modals/AlertModal.vue";

const app = createApp(App);

app.component("base-card", BaseCard);
app.component("base-input", BaseInput);
app.component("base-button", BaseButton);
app.component("the-header", TheHeader);
app.component("base-modal", BaseModal);
app.component("profile-photo", ProfilePhoto);
app.component("alert-modal", AlertModal);

app.use(router);
app.use(i18n);
app.mount("#app");
