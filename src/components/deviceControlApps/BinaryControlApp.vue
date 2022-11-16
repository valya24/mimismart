<template>
  <ModalDeviceControl
    :deviceName="name"
    @hide="$store.commit('modules/popups/hidePopup')"
    :tabs="tabs"
  >
    <BinaryControl :slot="tabs[0]"
      :icon="iconDevice"
      @change="handleControlChange"
      :active="isActive" />
  </ModalDeviceControl>
</template>

<script>
import ModalDeviceControl from "@/components/modals/ModalDeviceControl";
import BinaryControl from "@/components/deviceControls/BinaryControl";

import { numberToByteString } from "@/utils/transformers.js";
import {mapActions, mapGetters} from "vuex";

export default {
  props: {
    active: {
      default: false,
      type: Boolean,
    },
    name: String,
    item: Object,
    addr: String,
    status: Array,
    icon: String,
  },

  data: () => ({
    roomId: null
  }),

  mounted() {
    this.roomId = this.$route.params.id
  },
  watch: {
    sensorDevice: {
      deep: true,
      handler(val) {
        if (this.addr === val.addr) {
          this.$store.commit('setLampData', {isActive: val.status});
        }
      }
    }
  },
  computed: {
    ...mapGetters('ws', ['sensorDevice']),
    iconDevice() {
      if (this.item.attributes['sub-type'] && this.item.attributes['sub-type'] === 'socket') {
        return 'socket'
      } else {
        return this.icon
      }
    },
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
    ...mapActions('modules/settings', ['subscribeRequest']),
    async handleControlChange(value) {
      await this.$store.dispatch('setStatus', {
        addr: this.addr,
				status: numberToByteString(value)
      });

      const addrs = this.$store.getters.getRoomItems(this.roomId);
      await this.subscribeRequest(addrs.map(addr => addr.attributes.addr))
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