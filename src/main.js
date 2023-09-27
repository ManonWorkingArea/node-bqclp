import { createApp } from 'vue';
import { pageTitle } from 'vue-page-title';
import mitt from 'mitt';
import App from './App.vue';
import router from './router';
import BackToTop from 'vue-backtotop';
import Toast from "vue-toastification";
import VueSweetalert2 from 'vue-sweetalert2';
import Storage from 'vue-lsp';
import VueCryptojs from 'vue-cryptojs'
//import ReadMore from 'vue-read-more';

import Tooltip from "@programic/vue3-tooltip";
// Import the CSS or use your own!
import '@programic/vue3-tooltip/dist/index.css';

import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import ContextMenu from '@imengyu/vue3-context-menu'

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fas } from '@fortawesome/free-solid-svg-icons'
//import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { dom } from "@fortawesome/fontawesome-svg-core";

import 'vue-plyr/dist/vue-plyr.css'
import 'sweetalert2/dist/sweetalert2.min.css';
import './assets/css/app.css';
import "vue-toastification/dist/index.css";
import "css-file-icons/build/css-file-icons.css";

import { loadAndStoreConfigData } from '@/plugins/config';
import store from '@/store'

// import VueMarkdownEditor from '@kangc/v-md-editor';
// import '@kangc/v-md-editor/lib/style/base-editor.css';
// import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
// import '@kangc/v-md-editor/lib/theme/style/vuepress.css';

import TooltipPlugin from '@/plugins/TooltipPlugin';
//import '@/plugins/TooltipPlugin.css';

// // Resources for the codemirror editor
// import VueCodemirror from 'vue-codemirror'
// VueMarkdownEditor.Codemirror = VueCodemirror;

// import enUS from '@kangc/v-md-editor/lib/lang/en-US';

// VueMarkdownEditor.lang.use('en-US', enUS);

// VueMarkdownEditor.use(vuepressTheme, {
//   codeHighlightExtensionMap: {
//     vue: 'html',
//   },
// });

library.add(far,fas);
dom.watch();

const saltSecret	  = "Secret Passphrase";

const toastOptions 	= {
  position: "bottom-right",
	timeout: 10000,
	pauseOnHover: true
};

const feather = require('feather-icons');
feather.replace();

(async function() {
  const configuration = await loadAndStoreConfigData();
  const favicon = document.querySelector('link[rel="shortcut icon"]') || document.createElement('link');
  favicon.setAttribute('rel', 'shortcut icon');
  favicon.setAttribute('type', 'image/x-icon');
  favicon.setAttribute('href', configuration.siteFavicon);
  document.head.appendChild(favicon);
  
  const eventBus = mitt();
  const app = createApp(App);

  // Hide warnings
  app.config.warnHandler = () => {};

  app
  .use(router)
  .use(BackToTop)
  .use(Toast, toastOptions)
  //.use(ReadMore)
  .use(VueSweetalert2)
  .use(VueCryptojs)
  .provide('saltSecret', saltSecret)
  .provide('apiServerName', configuration.siteName)
  .provide('config', configuration)
  .use(pageTitle({suffix: '/ ' + configuration.siteName, mixin: true,}))
  // .use(VueMarkdownEditor)
  .use(TooltipPlugin)
  .use(Tooltip)
  .use(ContextMenu, { zIndex: 999999,maxWidth: 200 })
  .use(store) // Use the Vuex store
  .component('font-awesome-icon', FontAwesomeIcon)
  .use(Storage, {
      namespace: '_global_',
      name: 'ls',
      storage: 'local',
    }
  )
  .mount('#app');

  app.config.globalProperties.eventBus = eventBus;
  app.provide('eventBus', eventBus);

  await router.isReady();

  app.mixin({
    created() {
      this.eventBus = this.eventBus || this.$appContext.app.config.globalProperties.eventBus;
    },
  });

})();
