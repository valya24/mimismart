const state = {
  activePopup: null,
}

const mutations = {
  showPopup(state, name) {
    state.activePopup = name;
  },
  hidePopup(state) {
    state.activePopup = null;
  }
}

const actions = {

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}