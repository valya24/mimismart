import DeviceController from './Device';

import store from "@/store/index.js";
import {numberToByteString} from "@/utils/transformers";

export class DimmerController extends DeviceController {
  constructor(props) {
    super(props)
    // this.brightness = parseInt(this.status[1]);
    this.brightness = this.status.bright;
    this.item = store.state.itemMap[this.addr];
  }
  updateStatus(status) {
    super.updateStatus(status);
    this.brightness = parseInt(this.status[1]);
  }
  toggle(value) {
    return store.dispatch('setStatus', {
      addr: this.addr,
      status: value
    });
  }
  changeBrightness(value) {
    this.brightness = parseInt(value);
    this.item.__.statusUpdateDisabled = true;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.item.__.statusUpdateDisabled = false;
      clearTimeout(this.timeout);
    }, 1000);

    let val = Math.round(value);

    return store.dispatch('setStatus', {
      addr: this.addr,
      status: numberToByteString([254 /* 0xFE */, val, 0])
    });
  }
}

export default DimmerController