
import store from "@/store/index.js";

import Vue from 'vue';

export class DeviceController {
  constructor(props) {
    this.addr = props.addr;
    this.status = props.status;
    this.isActive = (this.status && this.status.length && this.status[0] != undefined) ? Boolean(this.status[0]) : false;
  }
  updateStatus(status) {
    Vue.set(this, 'status', status);
    this.isActive = (this.status && this.status.length && this.status[0] != undefined) ? Boolean(this.status[0]) : false;
  }
  toggle(value) {
    return store.dispatch('setStatus', {
      addr: this.addr,
      status: value
    });
  }
}

export default DeviceController