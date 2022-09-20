<template>
  <ModalDeviceControl
    :deviceName="name"
    @hide="$store.commit('modules/popups/hidePopup')"
    :tabs="tabs"
  >
    <ValveHeatingControl :slot="tabs[0]"
      :active="isActive"
      :controllerIsActive="controllerIsActive"
      :temperature="temperature"
      :roomTemp="+roomTemp"
      :modes="modes"
      :mode="mode"
      :lastActiveMode="lastActiveMode"
      
      @toggle="handleToggle"
      @changeMode="handleChangeMode"
      @changeTemp="handleChangeTemp"
    />
    <!-- <ModalDeviceControlStats :slot="tabs[1]" /> -->
  </ModalDeviceControl>
</template>

<script>
import ModalDeviceControl from "@/components/modals/ModalDeviceControl";
import ValveHeatingControl from "@/components/deviceControls/ValveHeatingControl";
// import ModalDeviceControlStats from "@/components/modals/ModalDeviceControlStats";

import { ValveHeatingController } from "@/utils/deviceControllers";

export default {
  props: {
    active: {
      default: false,
      type: Boolean,
    },
    name: String,
    addr: String,
    status: Array,
    icon: String
  },
  computed: {
    tabs() {
      return [
        this.$t("Control"),
        // this.$t("Statistics"),
        // this.$t("Notifications")
      ];
    },
    isActive() {
      return this.mode == 'Manual' || this.mode == "always-off" ? this.controller.isActive : true;
    },
    controllerIsActive() {
      return this.controller.isActive;
    },
    controller() {
      return this.$store.state.controllers[this.addr];
    },
    temperature() {
      return this.controller.temperature;
    },
    roomTemp() {
      return this.controller.roomTemp;
    },

    modes() {
      return this.controller.modes;
    },
    mode() {
      return this.controller.mode;
    },
    lastActiveMode() {
      return this.controller.lastActiveMode;
    },
  },
  methods: {
    handleToggle(value) {
			return this.controller.toggle(value);
    },
    handleChangeMode(value) {
      this.controller.changeMode(value);
    },
    handleChangeTemp(value) {
      this.controller.changeTemp(value);
    },
  },
  created() {
    if (!this.controller) {
      this.$store.commit('saveController', new ValveHeatingController({
        addr: this.addr,
        status: this.status,
        item: this.$store.state.itemMap[this.addr]
      }));
    }
  },
  components: {
    ModalDeviceControl,
    ValveHeatingControl,
    // ModalDeviceControlStats
  }
}
</script>

<style lang="less" scoped>

</style>