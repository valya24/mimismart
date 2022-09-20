import Vue from 'vue'

const state = {
  watchedSensorDevices: {}
}

const mutations = {
  watchSensorDevices(state, payload) {
    if (!payload) return false;

    if (!Array.isArray(payload)) payload = [payload];

    payload.forEach( item => {
      let data = state.watchedSensorDevices[item.addr] ? { ...state.watchedSensorDevices[item.addr], ...item } : item;
      Vue.set(state.watchedSensorDevices, item.addr, data);
    });

    return state.watchedSensorDevices;
  },
  saveWatchedSensorsToLocalStorage(state) {
    localStorage.setItem('watchedSensorDevices', JSON.stringify(state.watchedSensorDevices));
  }
}

const actions = {
  loadWatchedDevicesFromLocalStorage({ commit }) {
    let sensorDevices = JSON.parse(localStorage.getItem('watchedSensorDevices'));
    
    if (!sensorDevices) return false;

    let sensorArray = (Object.keys(sensorDevices)).map( key => sensorDevices[key]);
    commit('watchSensorDevices', sensorArray);
  },

  watchSensorDevices({ commit }, payload) {
    if (!payload) return false;

    if (!Array.isArray(payload)) payload = [payload];

    commit('watchSensorDevices', payload);
    commit('saveWatchedSensorsToLocalStorage');    
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}