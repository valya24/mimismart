<template>
  <ModalDeviceControl
      :deviceName="name"
      @hide="$store.commit('modules/popups/hidePopup')"
      :tabs="tabs"
  >
    <ValveControl :slot="tabs[0]"
      @change="handleControlChange"
      :addr="addr"
      :active="isActive" />
  </ModalDeviceControl>
</template>

<script>
import ModalDeviceControl from "@/components/modals/ModalDeviceControl";
import ValveControl from "@/components/deviceControls/ValveControl";

import { numberToByteString } from "@/utils/transformers.js";

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
      return Boolean(this.status[0]);
    }
  },
  methods: {
    handleControlChange(value) {
      const status = numberToByteString(value)
      this.$store.dispatch('setStatus', {
        addr: this.addr,
        status: status
      })
      this.$store.commit('setValveData', { status: status });
    }
  },
  components: {
    ValveControl,
    ModalDeviceControl,
    // ModalDeviceControlStats
  }
}
</script>

<style lang="less" scoped>

</style>