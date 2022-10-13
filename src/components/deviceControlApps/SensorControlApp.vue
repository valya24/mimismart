<template>
  <ModalDeviceControl
    :deviceName="name"
    @hide="$store.commit('modules/popups/hidePopup')"
    :tabs="tabs"
  >
    <ThresholdValues :slot="tabs[0]"
      :active="isActive"
      :min="min"
      :max="max"
      :units="units"
      :step="step"

      :sensorSettings="watchedDevice || {}"
      :enableMinimumThreshold="enableMinimumThreshold"

      @change="handleThresholdChange"
    />
    <!-- <ModalDeviceControlStats :slot="tabs[1]" /> -->
  </ModalDeviceControl>
</template>

<script>
import ModalDeviceControl from "@/components/modals/ModalDeviceControl";
import ThresholdValues from "@/components/deviceControls/ThresholdValues";
// import ModalDeviceControlStats from "@/components/modals/ModalDeviceControlStats";

// import { numberToByteString } from "@/utils/transformers.js";
import sensorInterfaces from "@/utils/sensorDeviceInterfaces.js";

export default {
  props: {
    active: {
      default: false,
      type: Boolean,
    },
    name: String,
    addr: String,
    status: Array,
    type: String,
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
    },
    min() {
      return sensorInterfaces[this.type].minimum;
    },
    max() {
      return sensorInterfaces[this.type].maximum;
    },
    watchedDevice() {
      return this.$store.state.modules.watchedSensors.watchedSensorDevices[this.addr];
    },
    minThreshold() {
      return this.watchedDevice ? this.watchedDevice.minThreshold || this.min : this.min;
    },
    maxThreshold() {
      return this.watchedDevice ? this.watchedDevice.maxThreshold || this.max : this.max;
    },
    units() {
      return sensorInterfaces[this.type].unitsLong || '';
    },
    step() {
      return sensorInterfaces[this.type].step || 1;
    },
    enableMinimumThreshold() {
      return sensorInterfaces[this.type].enableMinimumThreshold;
    }
  },
  methods: {
    handleThresholdChange(data) {
      if (typeof data.minThreshold == 'number' &&
          data.minThreshold >= this.maxThreshold) {
        data.minThreshold = this.maxThreshold - 1;
      }
      if (typeof data.maxThreshold == 'number' &&
          data.maxThreshold <= this.minThreshold &&
          this.enableMinimumThreshold) {
        data.maxThreshold = this.minThreshold + 1;
      }

      this.$store.dispatch('modules/watchedSensors/watchSensorDevices', {
        addr: this.addr,
        ...data
      })
    }
  },
  components: {
    ModalDeviceControl,
    ThresholdValues,
    // ModalDeviceControlStats
  }
}
</script>

<style lang="less" scoped>

</style>