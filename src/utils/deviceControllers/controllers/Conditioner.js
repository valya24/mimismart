import {
  numberToByteString,
  transformStatusToHalfBytes,
  concatHalfBytes
} from "@/utils/transformers.js";

import DeviceController from './Device';

import store from "@/store/index.js";

import Vue from 'vue';

import sensorDeviceInterfaces from "@/utils/sensorDeviceInterfaces.js";

export class ConditionerController extends DeviceController {
  constructor(props) {
    super(props);

    this.item = store.state.itemMap[this.addr];

    let tempSensorAddr = this.item.attributes['temperature-sensors'];
    if (tempSensorAddr !== undefined) {
      store.watch(
        state => sensorDeviceInterfaces['temperature-sensor'].value(state.itemMap[tempSensorAddr].__.status),
        (val) => {
          this.roomTemp = parseFloat(val);
        },
        { immediate: true })
    }

    this.minTemp = props.minTemp;
    this.maxTemp = props.maxTemp;

    this.modesMask = this.item.attributes.modes != undefined ? parseInt(this.item.attributes.modes) : parseInt('0xff');
    this.modes = [
      {
        key: 0,
        name: 'Fan',
        icon: 'fan'
      },
      {
        key: 1,
        name: 'Cool',
        icon: 'snowflake'
      },
      {
        key: 2,
        name: 'Dry_1',
        icon: 'humidity'
      },
      {
        key: 3,
        name: 'Heat',
        icon: 'hot'
      },
      {
        key: 4,
        name: 'Auto',
        icon: 'auto'
      },
    ].filter(item => {
      return ((1 << (+item.key)) & this.modesMask) == (1 << (+item.key));
    });

    this.powerlevelsMask = this.item.attributes.funs != undefined ? parseInt(this.item.attributes.funs) : parseInt('0xff');
    this.powerlevels = [
      {
        key: 0,
        name: 'Auto',
      },
      {
        key: 1,
        name: 'Low',
      },
      {
        key: 2,
        name: 'Medium',
      },
      {
        key: 3,
        name: 'High',
      }
    ].filter(item => {
      return ((1 << (+item.key)) & this.powerlevelsMask) == (1 << (+item.key));
    });

    this.vaneHorMask = this.item.attributes['vane-hor'] != undefined ? parseInt(this.item.attributes['vane-hor']) : parseInt('0xff');
    this.vaneHorModes = [
      0, 1, 2, 3, 4, 5, 6
    ].filter(item => {
      return ((1 << (+item)) & this.vaneHorMask) == (1 << (+item));
    });

    this.vaneVerMask = this.item.attributes['vane-ver'] != undefined ? parseInt(this.item.attributes['vane-ver']) : parseInt('0xff');
    this.vaneVerModes = [
      0, 1, 2, 3, 4, 5, 6
    ].filter(item => {
      return ((1 << (+item)) & this.vaneVerMask) == (1 << (+item));
    });

    this.halfByteStatus = transformStatusToHalfBytes(this.status);
    while (this.halfByteStatus.length < 5) {
      this.halfByteStatus.push([0, 0]);
    }

    this.isActive = Boolean(this.halfByteStatus[0][0]);
  }
  updateStatus(status) {
    super.updateStatus(status);
    this.halfByteStatus = transformStatusToHalfBytes(status);
    while (this.halfByteStatus.length < 5) {
      this.halfByteStatus.push([0, 0]);
    }
    this.isActive = Boolean(this.halfByteStatus[0][0]);
    Vue.set(this, 'mode', this.halfByteStatus[0][1]);
    // this.mode = this.halfByteStatus[0][1];
    this.powerlevel = this.halfByteStatus[4][0];

    this.vaneHor = this.halfByteStatus[3][0];
    this.vaneVer = this.halfByteStatus[3][1];
  }
  toggle(value) {
    let val = concatHalfBytes([+value, this.halfByteStatus[0][1]]);
    let outStatus = [...this.status];
    outStatus[0] = val;

    super.toggle(outStatus);
  }
  changeTemp(value) {
    let outStatus = [...this.status];
    outStatus[1] = Math.round(value) - this.minTemp;

    return store.dispatch('setStatus', {
      addr: this.addr,
      status: numberToByteString(outStatus)
    });
  }
  changeMode(value) {
    let val = concatHalfBytes([this.halfByteStatus[0][0], +value]);
    let outStatus = [...this.status];
    outStatus[0] = val;

    return store.dispatch('setStatus', {
      addr: this.addr,
      status: numberToByteString(outStatus)
    });
  }
  changePower(value) {
    let val = concatHalfBytes([+value, this.halfByteStatus[0][1]]);
    let outStatus = [...this.status];
    outStatus[4] = val;

    return store.dispatch('setStatus', {
      addr: this.addr,
      status: numberToByteString(outStatus)
    });
  }
  cycleVaneHor() {
    let index = this.vaneHorModes.indexOf(this.vaneHor);
    let nextMode = this.vaneHorModes[(index + 1) % this.vaneHorModes.length];

    let val = concatHalfBytes([+nextMode, this.halfByteStatus[3][1]]);
    let outStatus = [...this.status];
    outStatus[3] = val;

    return store.dispatch('setStatus', {
      addr: this.addr,
      status: numberToByteString(outStatus)
    });
  }
  cycleVaneVer() {
    let index = this.vaneVerModes.indexOf(this.vaneVer);
    let nextMode = this.vaneVerModes[(index + 1) % this.vaneVerModes.length];

    let val = concatHalfBytes([this.halfByteStatus[3][0], +nextMode]);
    let outStatus = [...this.status];
    outStatus[3] = val;

    return store.dispatch('setStatus', {
      addr: this.addr,
      status: numberToByteString(outStatus)
    });
  }
}

export default ConditionerController