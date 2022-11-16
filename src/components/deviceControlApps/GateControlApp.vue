<template>
  <ModalDeviceControl
    :deviceName="name"
    @hide="$store.commit('modules/popups/hidePopup')"
    :tabs="tabs"
  >
    <GateControl :slot="tabs[0]"
      @change="handleControlChange"
      :active="isActive"
      :status="status[0]"
      :icon="icon"
    />
  </ModalDeviceControl>
</template>

<script>
import ModalDeviceControl from "@/components/modals/ModalDeviceControl";
import {mapActions, mapGetters} from "vuex";
import GateControl from "@/components/deviceControls/GateControl";

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
      handler(val) {
        if (this.addr === val.addr) {
          this.$store.commit('setGateData', {isActive: val.status});
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
    GateControl,
    ModalDeviceControl,
  }
}
</script>

<style lang="less" scoped>

</style>