import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/styles/global.css'
import '@/styles/dark.css'
import iconComp from '@/components/icons/iconComp'
import DeviceAsIcon from '@/components/DeviceAsIcon'
import SegmentedControl from '@/components/controls/SegmentedControl'
import Dropdown from '@/components/controls/Dropdown'
import Switch from '@/components/controls/Switch'
import Textfield from '@/components/controls/Textfield'
import BtnIcon from '@/components/buttons/BtnIcon'
import Button from '@/components/buttons/Button'
import Loader from '@/components/etc/Loader'

Vue.config.productionTip = false

// import { tryParseJSON } from '@/utils/functions.js';

Vue.component('icon-comp', iconComp)
Vue.component('device-as-icon', DeviceAsIcon)
Vue.component('SegmentedControl', SegmentedControl)
Vue.component('Dropdown', Dropdown)
Vue.component('app-switch', Switch)
Vue.component('Textfield', Textfield)
Vue.component('BtnIcon', BtnIcon)
Vue.component('app-button', Button)
Vue.component('Loader', Loader)

import VueNativeSock from 'vue-native-websocket';
import { passToStoreHandler } from '@/utils/utils.js';
Vue.use(VueNativeSock, 'wss://95.84.154.146:54441', {
  connectManually: true,
  store: store,
  // format: 'json',
  reconnection: true, // (Boolean) whether to reconnect automatically (false)
  reconnectionAttempts: 1, // (Number) number of reconnection attempts before giving up (Infinity),
  reconnectionDelay: 1000, // (Number) how long to initially wait before attempting a new (1000)

  passToStoreHandler
})


import Vue2TouchEvents from 'vue2-touch-events';

Vue.use(Vue2TouchEvents, {
  disableClick: false,
  touchClass: '',
  tapTolerance: 10,
  touchHoldTolerance: 400,
  swipeTolerance: 30,
  longTapTimeInterval: 400
})

import 'swiper/css/swiper.css';
import i18n from './i18n'

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')