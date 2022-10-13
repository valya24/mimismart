<template>
  <ModalDeviceControl
    :deviceName="name"
    @hide="$store.commit('modules/popups/hidePopup')"
    :tabs="tabs"
  >
    <BinaryControl :slot="tabs[0]"
      :icon="icon"
      @change="handleControlChange"
      :active="isActive" />
    <!-- <ModalDeviceControlStats :slot="tabs[1]" /> -->
  </ModalDeviceControl>
</template>

<script>
import ModalDeviceControl from "@/components/modals/ModalDeviceControl";
import BinaryControl from "@/components/deviceControls/BinaryControl";
// import ModalDeviceControlStats from "@/components/modals/ModalDeviceControlStats";

import { numberToByteString } from "@/utils/transformers.js";

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
      return Boolean(this.$store.state.itemMap[this.addr].__.status[0]);
    }
  },
  methods: {
    handleControlChange(value) {
      this.$store.dispatch('setStatus', {
        addr: this.addr,
				status: numberToByteString(value)
      })
    }
  },
  components: {
    ModalDeviceControl,
    BinaryControl,
    // ModalDeviceControlStats
  }
}
</script>

<style lang="less" scoped>

</style>