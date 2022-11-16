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
import {mapActions} from "vuex";

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
  data: () => ({
    roomId: null
  }),
  mounted() {
    this.roomId = this.$route.params.id
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
    ...mapActions('modules/settings', ['subscribeRequest']),
    handleIgnore(seconds) {
      const hexToDecimal = hex => parseInt(hex, 16);

      setTimeout(() => {
        this.$store.dispatch('setStatus', {
          addr: this.addr,
          status: hexToDecimal(seconds),
          type: 'leak'
        });

        const addrs = this.$store.getters.getRoomItems(this.roomId);
        this.subscribeRequest(addrs.map(addr => addr.attributes.addr))
      }, 10000);
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