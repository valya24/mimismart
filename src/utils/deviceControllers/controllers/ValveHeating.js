import DeviceController from './Device';

import store from "@/store/index.js";

import sensorDeviceInterfaces from "@/utils/sensorDeviceInterfaces.js";

export class ValveHeatingController extends DeviceController {
  constructor(props) {
    super(props);
    this.status = props.item.__.status;

    this.item = props.item;

    this.temperature = this.status[2];

    //  Doesn't work
    this.roomTemp = this.status[4];

    let tempSensorAddr = this.item.attributes['temperature-sensors'];

    store.watch(
      state => sensorDeviceInterfaces['temperature-sensor'].value(state.itemMap[tempSensorAddr].__.status),
      (val) => {
        this.roomTemp = parseFloat(val);
      },
      { immediate: true })

    let modes = props.item.elements.filter(el => el.name == "automation");

    this.modes = modes.map((item) => {
      let icon, key;
      switch (item.attributes.name) {
        case 'Eco':
        case 'Econom':
        case 'Эко':
        case 'Эконом':
          icon = 'econom';
          key = 'econom';
          break;
        case 'Comfort':
        case 'Комфорт':
          icon = 'comfort';
          key = 'comfort';
          break;
        case 'Hot':
        case 'Жарко':
        case 'Горяче':
        case 'Горячо':
          icon = 'hot'
          key = 'hot'
          break;
      }
      
      return {
        name: item.attributes.name,
        key,
        icon,
        hidden: (!icon || !key)
      }
    })
    .filter( item => !item.hidden )
    .concat([
      {
        name: 'always-off',
        key: 'always-off',
        icon: 'off'
      },
      {
        name: 'Manual',
        key: 'manual',
        icon: 'hand'
      }
    ]);

    this.mode = props.item.attributes.automation != undefined ? props.item.attributes.automation : 'Manual';
    this.lastActiveMode = this.item.attributes.lastActiveMode || this.modes[0].name;

    if (props.item.__.status[5] == 254) this.mode = 'always-off'; //always-off
    if (props.item.__.status[5] == 255) this.mode = 'Manual';

    this.autoModeActive = !(['always-off', 'Manual'].includes(this.mode));
  }
  updateStatus(status) {
    super.updateStatus(status);

    this.temperature = status[2];

    //  Doesn't work
    // this.roomTemp = status[4];
  }
  toggle(value) {
    //  TODO: Refactor this probably
    let isActive = this.autoModeActive ? true : this.isActive;
    if (value == undefined) {
      value = !isActive;
    }
    //  TODO: Change use of mode names to mode keys
    if (this.mode == 'always-off' && value) {
      this.changeMode(this.lastActiveMode);
    }
    if (this.mode != "Manual" && this.mode != 'always-off' && !value) {
      this.changeMode('always-off');
    }

    super.toggle(value);
  }
  changeTemp(value) {
    // this.temperature = Math.round(value);

    // let autoObj = this.item.automation.reduce( (accum, item) => {
    //   return item.$.name == this.mode ? item : accum;
    // }, {})
    let autoObj = this.item.elements.find((el) => el.name == 'automation' && el.attributes.name == this.mode);
    autoObj.attributes['temperature-level'] = Math.round(value);

    store.dispatch('changeItemXml', this.item);
  }
  changeMode(modeKey) {
    let mode = modeKey;

    //  TODO: Maybe refactor
    let index = this.modes.map(item => item.key).indexOf(modeKey);
    if (index != -1) {
      mode = this.modes[index].name;
    } else {
      let nameIndex = this.modes.map(item => item.name).indexOf(mode);
      if (nameIndex != -1) {
        modeKey = this.modes[nameIndex].key;
      }
    }

    this.item.attributes.automation = mode == "Off" ? 'always-off' : mode;
    this.lastActiveMode = this.mode;
    this.item.attributes.lastActiveMode = this.lastActiveMode;
    this.mode = this.item.attributes.automation;
    this.autoModeActive = !(['always-off', 'manual'].includes(modeKey));


    if (mode == 'Manual') {
      delete this.item.attributes.automation;
    }
    store.dispatch('changeItemXml', this.item);
  }
}

export default {
  ValveHeatingController
}