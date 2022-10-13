<template>
  <ModalDeviceControl
    :deviceName="name"
    @hide="$store.commit('modules/popups/hidePopup')"
    :tabs="tabs"
  >
    <BinarySensorControl :slot="tabs[0]"
      @change="handleControlChange"
      :active="isActive" />
  </ModalDeviceControl>
</template>

<script>
import ModalDeviceControl from "@/components/modals/ModalDeviceControl";
import BinarySensorControl from "@/components/deviceControls/BinarySensorControl";

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
        this.$t("Statistics")
      ];
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
    BinarySensorControl,
  }
}
</script>

<style lang="less" scoped>

</style>