<template>
  <ModalDeviceControl
    :deviceName="name"
    @hide="$store.commit('modules/popups/hidePopup')"
    :tabs="tabs"
  >
    <RGBControl :slot="tabs[0]"
      @change="handleColorChange"
      @brightness="handleBrightnessChange"
      @toggle="handleToggle"
      :addr="addr"
      :active="isActive"
      :color="color" />
    <!-- <ModalDeviceControlStats :slot="tabs[1]" /> -->
  </ModalDeviceControl>
</template>

<script>
import ModalDeviceControl from "@/components/modals/ModalDeviceControl";
import RGBControl from "@/components/deviceControls/RGBControl";
// import ModalDeviceControlStats from "@/components/modals/ModalDeviceControlStats";

import { RGBLampController } from "@/utils/deviceControllers";

export default {
  props: {
    active: {
      default: false,
      type: Boolean,
    },
    name: String,
    addr: String,
    status: Array
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
      return this.controller.isActive;
    },
    brightness() {
      return parseInt(this.status[1]);
    },
    color() {
      return this.controller.color;
    },
    controller() {
      return this.$store.state.controllers[this.addr];
    }
  },
  methods: {
    handleBrightnessChange(value) {
      return this.controller.changeBrightness(value);
    },
    handleColorChange(value) {
      return this.controller.changeColor(value);
    },
    handleToggle(value) {
      return this.controller.toggle(value);
    }
  },
  created() {
    if (!this.controller) {
      this.$store.commit('saveController', new RGBLampController({
        addr: this.addr,
        status: this.status,
      }));
    }
  },
  components: {
    ModalDeviceControl,
    RGBControl,
    // ModalDeviceControlStats
  }
}
</script>

<style lang="less" scoped>

</style>