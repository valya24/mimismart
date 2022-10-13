import Vue from 'vue'
import i18n from '../../../i18n';

// import i18n from '@/i18n.js'

import { SETTINGS_MAP } from '@/utils/consts/consts.js';

const state = {
  network: {
    remoteIp: '95.84.154.146',
    key: '1234567890123456',
    //  Mode is Remote
    //  Yes - remote, No - local, Auto - auto
    remoteMode: 'Auto',
    remotePort: '54441',
    localPort: '54441',
    webPort: '15580',
    localWebPort: '15580',
    localIp: '192.168.1.125',
    connectionType: 'TCP',
    password:''
  },
  other: {
    language: 'ru',
    useTestLogic: false,
  },
  interface: {
    appearance: 'light',
    devicesSort: 'none',
    widgetsOnTop: true,
    showDeviceAddresses: false,
    showSystem: false,
  },
  user: {
    name: null,
    key: null
  }
}

const mutations = {
  setSettings(state, payload) {
    if (!payload) return false;
    
    if (payload.name && payload.data) {
      state[payload.name] = payload.data;
    } else {
      for (let key in payload) {
        Vue.set(state, key, Object.assign(state[key], payload[key]));
      }

      if (payload['other'] && payload['other'].language) {
        i18n.locale = payload['other'].language;
      }
    }
  },
  saveSettingsToLocalStorage(state) {
    localStorage.setItem('settings', JSON.stringify(state));
  }
}

const actions = {
  setSettings({ commit }, payload) {
    commit('setSettings', payload);
    commit('saveSettingsToLocalStorage');
  },
  loadSettingsFromLocalStorage({ commit }) {
    let settings = JSON.parse(localStorage.getItem('settings'));
    commit('setSettings', settings);
  },
  loadSettingsFromOldApp({ dispatch }) {
    let settingsKeys = Array.from(Object.keys(SETTINGS_MAP)).join(';');
    dispatch('ws/sendMessage', {
      "request": "executeShiCode",
      "code": `getSettings('${settingsKeys}')`
    }, { root: true });
  },

  subscribeRequest ({dispatch}, data) {
    dispatch('ws/sendMessage', {
      "request": "get-state",
      "addr": data,
      "subscribe": "yes",
      "key": "1234567890123456"
    }, { root: true });
  },

  stopSubscribeRequest ({dispatch}, data) {
    dispatch('ws/sendMessage', {
      "request": "get-state",
      "addr": data,
      "subscribe": "no",
      "key": "1234567890123456"
    }, { root: true });
  },

  getAllDevices ({dispatch}) {
    dispatch('ws/sendMessage', {
      "request": "all-devices",
      "key": "1234567890123456"
    }, { root: true });
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}