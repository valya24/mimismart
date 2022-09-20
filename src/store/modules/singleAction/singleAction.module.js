import Vue from 'vue';

const state = {
  checkPasswordPromise: null,
  resolvePasswordPromise: null,
  activeItem: { attributes: {} },
  showPasswordModal: false
}

const mutations = {
  initCheckPassword(state, item) {
    state.checkPasswordPromise = new Promise( (resolve) => {
      state.resolvePasswordPromise = resolve;
    });

    state.showPasswordModal = true;
    Vue.set(state, 'activeItem', item);
  },
  passPassword(state) {
    state.resolvePasswordPromise(true);
    state.showPasswordModal = false;
  },
  rejectPassword(state) {
    state.resolvePasswordPromise(false);
    state.showPasswordModal = false;
  },
}

const actions = {
  checkPassword({ state, commit }, item) {
    commit('initCheckPassword', item);

    return state.checkPasswordPromise;
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}