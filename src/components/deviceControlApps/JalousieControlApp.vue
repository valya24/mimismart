<template>
  <ModalDeviceControl
    :deviceName="name"
    @hide="$store.commit('modules/popups/hidePopup')"
    :tabs="tabs"
  >
    <CurtainsControl :slot="tabs[0]"
      @change="handleControlChange"
      :active="isActive"
      :status="status[0]"
      :icon="icon"
    />
    <!-- <ModalDeviceControlStats :slot="tabs[1]" /> -->
  </ModalDeviceControl>
</template>

<script>
import ModalDeviceControl from "@/components/modals/ModalDeviceControl";
import CurtainsControl from "@/components/deviceControls/CurtainsControl";
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
    // status: Array
  },
  computed: {
    tabs() {
      return [
        this.$t("Control"),
        // this.$t("Statistics"),
        // this.$t("Notifications")
      ];
    },
    item() {
      return this.$store.state.itemMap[this.addr];
    },
    icon() {
      return this.item.__.icon;
    },
    status() {
      return this.item.__.status;
    },
    isActive() {
      return Boolean(this.status[0]);
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
    CurtainsControl,
    // ModalDeviceControlStats
  }
}
</script>

<style lang="less" scoped>

</style>