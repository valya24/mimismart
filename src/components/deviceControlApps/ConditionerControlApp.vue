<template>
  <ModalDeviceControl
    :deviceName="name"
    @hide="$store.commit('modules/popups/hidePopup')"
    :tabs="tabs"
  >
    <ACControl :slot="tabs[0]"
      :active="isActive"
      :addr="addr"
      :minTemp="minTemp"
      :maxTemp="maxTemp"
      :temperature="minTemp + configData.__.status[1]"
      :roomTemp="roomTemp"
      :configData="configData"
      :modes="modes"
      :mode="controller.mode"
      :powerlevels="powerlevels"
      :powerlevel="controller.powerlevel"

      :vaneHor="controller.vaneHor"
      :vaneHorModes="vaneHorModes"
      :vaneVer="controller.vaneVer"
      :vaneVerModes="vaneVerModes"
      
      @toggle="handleToggle"
      @changeMode="handleChangeMode"
      @changePower="handleChangePower"
      @changeTemp="handleChangeTemp"

      @cycleVaneHor="cycleVaneHor"
      @cycleVaneVer="cycleVaneVer"
    />

    <!-- <ModalDeviceControlStats :slot="tabs[1]" /> -->
  </ModalDeviceControl>
</template>

<script>
import ModalDeviceControl from "@/components/modals/ModalDeviceControl";
import ACControl from "@/components/deviceControls/ACControl";
// import ModalDeviceControlStats from "@/components/modals/ModalDeviceControlStats";

import { ConditionerController } from "@/utils/deviceControllers";

const MIN_TEMP = 16;
const TEMP_DELTA = 16;

export default {
  props: {
    active: {
      default: false,
      type: Boolean,
    },
    name: String,
    addr: String,
    status: Array,
    configData: Object
  },
  computed: {
    tabs() {
      return [
        this.$t("Control"),
        // this.$t("Statistics"),
        // this.$t("Notifications")
      ];
    },
    // isActive() {
    //   return Boolean(this.status[0]);
    // },
    isActive() {
      return this.controller.isActive;
    },
    minTemp() {
      return parseInt(this.configData.attributes['t-min']) || MIN_TEMP;
    },
    deltaTemp() {
      return parseInt(this.configData.attributes['t-delta']) || TEMP_DELTA;
    },
    maxTemp() {
      return (this.minTemp + this.deltaTemp);
    },
    controller() {
      return this.$store.state.controllers[this.addr];
    },
    vaneHorModes() {
      return this.controller.vaneHorModes.map((item, i) => i)
    },
    vaneVerModes() {
      return this.controller.vaneVerModes.map((item, i) => i)
    },
    modes() {
			return this.controller.modes.map( (item, i) => ({ ...item, key: i, name: this.$t(item.name) }) );
    },
    powerlevels() {
			return this.controller.powerlevels.map( item => ({ ...item, name: this.$t(item.name) }) );
    },
    roomTemp() {
			return this.controller.roomTemp
		},
  },
  methods: {
    handleToggle(value) {
      this.controller.toggle(value);
    },
    handleChangeMode(value) {
      this.controller.changeMode(value);
    },
    handleChangePower(value) {
      this.controller.changePower(value);
    },
    handleChangeTemp(value) {
      this.controller.changeTemp(value);
    },

    cycleVaneHor(state) {
      this.controller.cycleVaneHor(state);
    },
    cycleVaneVer(state) {
      this.controller.cycleVaneVer(state);
    },
  },
  created() {
    if (!this.controller) {
      this.$store.commit('saveController', new ConditionerController({
        addr: this.addr,
        minTemp: this.minTemp,
        maxTemp: this.maxTemp,
        status: this.status,
      }));
    }
  },
  components: {
    ModalDeviceControl,
    ACControl,
    // ModalDeviceControlStats
  }
}
</script>

<style lang="less" scoped>

</style>