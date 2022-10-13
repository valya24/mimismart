import {
  numberToByteString,
} from "@/utils/transformers.js";

import DeviceController from './Device';

import store from "@/store/index.js";

export class RGBLampController extends DeviceController {
  constructor(props) {
    super(props)
    this.color = {
      h: this.status[3] * 360 / 250,
      s: this.status[2] * 100 / 250,
      v: this.status[1]
    };
    this.item = store.state.itemMap[this.addr];
  }
  updateStatus(status) {
    super.updateStatus(status);
    this.color = {
      h: status[3] * 360 / 250,
      s: status[2] * 100 / 250,
      v: status[1]
    };
  }
  changeBrightness(value) {
    this.item.__.statusUpdateDisabled = true;
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.item.__.statusUpdateDisabled = false;
      clearTimeout(this.timeout);
    }, 1000);

    let val = Math.round(value);

    return store.dispatch('setStatus', {
      addr: this.addr,
      status: numberToByteString([254 /* 0xFE */, val, 254 /* 0xFE */, 254 /* 0xFE */])
    });
  }
  changeColor(value) {
    let color = {
      h: Math.round(value.h * 250 / 360),
      s: Math.round(value.s * 250 / 100),
      v: Math.round(value.v * 250 / 100)
    };

    return store.dispatch('setStatus', {
      addr: this.addr,
      status: numberToByteString([254 /* 0xFE */, 254 /* 0xFE */, color.s, color.h])
    });
  }
}

export default RGBLampController