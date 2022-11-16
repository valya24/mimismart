<template>
  <ModalDeviceControl
    :deviceName="name"
    @hide="$store.commit('modules/popups/hidePopup')"
    :tabs="tabs"
  >
    <DimerControl :slot="tabs[0]"
      @change="handleControlChange"
      @toggle="handleToggle"
      :icon="icon"
      :addr="addr"
      :active="isActive"
      :brightness="brightness" />
  </ModalDeviceControl>
</template>

<script>
import ModalDeviceControl from "@/components/modals/ModalDeviceControl";
import DimerControl from "@/components/deviceControls/DimerControl";

import { DimmerController } from "@/utils/deviceControllers";

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
      ];
    },
    item() {
      return this.$store.state.itemMap[this.addr];
    },
    icon() {
      return this.item.__.icon;
    },
    controller() {
      return this.$store.state.controllers[this.addr];
    },
    isActive() {
      return this.controller.isActive;
    },
    brightness() {
      return this.controller.brightness;
    },
  },
  methods: {
    handleControlChange(value) {
      return this.controller.changeBrightness(value);
    },
    handleToggle(value) {
      return this.controller.toggle(value);
    }
  },
  created() {
    if (!this.controller) {
      this.$store.commit('saveController', new DimmerController({
        addr: this.addr,
        status: this.status,
      }));
    }
  },
  components: {
    ModalDeviceControl,
    DimerControl,
  }
}
</script>

<style lang="less" scoped>

</style>