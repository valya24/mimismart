import Vue from 'vue'
import i18n from '@/i18n';

const state = {
  currentMessage: '',
  messageIsShown: false,
  timeout: null
}

const mutations = {
  showMessage(state, { message, timeout }) {
    if (state.timeout) clearTimeout(state.timeout);
    Vue.set(state, 'timeout', timeout);

    Vue.set(state, 'currentMessage', message);
    Vue.set(state, 'messageIsShown', true);
  },
  hideMessage(state) {
    Vue.set(state, 'currentMessage', '');
    Vue.set(state, 'messageIsShown', false);
  },
}

const actions = {
  alert({ commit }, message) {
    let timeout = setTimeout(() => {
      commit('hideMessage');
    }, 2000)

    commit('showMessage', {
      message, timeout
    });
  },

  userEditPermissionAlert({ dispatch }) {
    dispatch('alert', i18n.t("This action is available only for<br>authorized users"))
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}