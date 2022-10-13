<template>
  <ModalDeviceControl
    :deviceName="name"
    @hide="$store.commit('modules/popups/hidePopup')"
    :tabs="tabs"
  >
    <LeakSensorControl :slot="tabs[0]"
      :state="computedState"
      @ignore="handleIgnore"
      @reset="handleReset"
    />
    <!-- <ModalDeviceControlStats :slot="tabs[1]" /> -->
  </ModalDeviceControl>
</template>

<script>
import ModalDeviceControl from "@/components/modals/ModalDeviceControl";
import LeakSensorControl from "@/components/deviceControls/LeakSensorControl";
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
    status() {
      return this.item.__.status;
    },
    computedState() {
      switch (this.status[0]) {
        case 0:
          return 'idle';
        case 1:
          return 'wet';
        case 2:
          return 'dryIgnoring';
        case 3:
          return 'wetIgnoring';
        default: break;
      }

      return '';
    }
  },
  methods: {
    handleIgnore(seconds) {
      let num = numberToByteString(seconds).substring(2).padStart(4, '0');
      
      this.$store.dispatch('setStatus', {
        addr: this.addr,
				status: `0x${num}`
      })
    },
    handleReset() {
      this.$store.dispatch('setStatus', {
        addr: this.addr,
				status: numberToByteString(0)
      })
    }
  },
  components: {
    ModalDeviceControl,
    LeakSensorControl,
    // ModalDeviceControlStats
  }
}
</script>

<style lang="less" scoped>

</style>