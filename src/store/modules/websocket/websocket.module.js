const state = {
  socket: {
    isConnected: false,
    message: '',
    reconnectError: false,
    devices: null,
    device: null,
    allDevices: null,
    sensorDevice: null
  },
}

const getters = {
  devices: state => state.socket.devices,
  allDevices: state => state.socket.allDevices,
  selectedDevice: state => state.socket.device,
  sensorDevice: state => state.socket.sensorDevice,
}

const mutations = {
  SOCKET_ONOPEN(state, event) {
    state.$socket = event;
    state.socket.isConnected = true;
    console.log('SOCKET OPEN', event);

    // if (!this.state.logicParsed) {
      // this.dispatch("loadLogic")
      // this.dispatch("subscribeOnLogic")
    // }
    // if (this.state.subscribedDevicesAddrs && this.state.subscribedDevicesAddrs.length) {
    //   this.dispatch('resubscribeOnStatuses');
    // }
  },
  SOCKET_ONCLOSE(state, event) {
    console.log(event);
    alert('Ошибка подключения к серверу!');
    state.socket.isConnected = false
  },
  SOCKET_ONERROR(state, event) {
    console.error(event)
  },
  // default handler called for all methods
  SOCKET_ONMESSAGE(state, message) {
    state.socket.message = message;
    const data = JSON.parse(message.data);
    switch (data.response) {
      case 'get-state':
        if (data.devices) {
          state.socket.devices = data.devices
        } else {
          state.socket.devices = data
        }
        break;
      case 'set-state':
        state.socket.device = data
        break;
      case 'all-devices':
        state.socket.allDevices = data
        break;
      case 'state-changed':
        state.socket.sensorDevice = data
        break;
      default:
        return state
    }
  },
  // mutations for reconnect methods
  SOCKET_RECONNECT(state, count) {
    console.info(count)
  },
  SOCKET_RECONNECT_ERROR(state) {
    state.socket.reconnectError = true;
  },
}

const actions = {
  SOCKET_ONOPEN({ commit }, event) {
    commit('SOCKET_ONOPEN', event)
    // dispatch('loadLogic', null, { root: true });
    // dispatch('modules/settings/loadSettingsFromOldApp', null, { root: true });
  },
  SOCKET_ONCLOSE({ commit }, event) {
    commit('SOCKET_ONCLOSE', event);
  },
  SOCKET_ONERROR({ commit }, event) {
    commit('SOCKET_ONERROR', event);
  },
  SOCKET_ONMESSAGE({ commit }, event) {
    commit('SOCKET_ONMESSAGE', event);
  },
  SOCKET_RECONNECT({ commit }, event) {
    commit('SOCKET_RECONNECT', event);
  },
  SOCKET_RECONNECT_ERROR({ commit }, event) {
    commit('SOCKET_RECONNECT_ERROR', event);
  },
  sendMessage: function (context, message) {
    if (typeof message == 'object') message = JSON.stringify(message);

    if (state.$socket &&
        state.$socket.target &&
        state.$socket.target.readyState == 1) {
      state.$socket.target.send(message);
      // console.log('MESSAGE SENT!', state.$socket.target, message);
    } else {
      console.log('Message sending error, ', state.$socket);
    }
    
    if (state.$socket && state.$socket.target) {
      // console.log('readystate', state.$socket.target.readyState);
      return state.$socket.target.readyState;
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}