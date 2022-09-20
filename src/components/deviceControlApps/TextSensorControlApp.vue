<template>
  <ModalDeviceControl
    :deviceName="name"
    @hide="$store.commit('modules/popups/hidePopup')"
    :tabs="tabs"
  >
    <TextSensorControl :slot="tabs[0]" :text="text" />
    <!-- <ModalDeviceControlStats :slot="tabs[1]" /> -->
  </ModalDeviceControl>
</template>

<script>
import ModalDeviceControl from "@/components/modals/ModalDeviceControl";
import TextSensorControl from "@/components/deviceControls/TextSensorControl";
// import ModalDeviceControlStats from "@/components/modals/ModalDeviceControlStats";

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
    text() {
      let uintarr = new Uint8Array(this.status.length);
      for (let i = 0; i < this.status.length; i++) {
        uintarr[i] = this.status[i];
      }
      let utf8decoder = new TextDecoder();
      let outStr = utf8decoder.decode(uintarr);
      return outStr;
    },
  },
  components: {
    ModalDeviceControl,
    TextSensorControl,
    // ModalDeviceControlStats
  }
}
</script>

<style lang="less" scoped>

</style>