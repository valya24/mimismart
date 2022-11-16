<template>
  <ModalDeviceControl
    :deviceName="name"
    @hide="$store.commit('modules/popups/hidePopup')"
    :tabs="tabs"
  >
    <CurtainsControl :slot="tabs[0]"
      @change="handleControlChange"
      :active="isActive"
      :addr="addr"
      :status="status[0]"
      :icon="icon"
    />
    <!-- <ModalDeviceControlStats :slot="tabs[1]" /> -->
  </ModalDeviceControl>
</template>

<script>
import ModalDeviceControl from "@/components/modals/ModalDeviceControl";
import CurtainsControl from "@/components/deviceControls/CurtainsControl";
import {mapActions, mapGetters} from "vuex";

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
  watch: {
    sensorDevice: {
      deep: true,
      immediate: true,
      handler(val) {
        if (this.addr === val.addr) {
          this.$store.commit('setJalousieData', {isActive: val.status, addr: this.addr});
        }
      }
    }
  },
  computed: {
    ...mapGetters('ws', ['sensorDevice']),
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
    ...mapActions('modules/settings', ['subscribeRequest']),
    async handleControlChange(value) {
      await this.$store.dispatch('setStatus', {
        addr: this.addr,
				status: value
      });

      await this.subscribeRequest(this.addr)
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