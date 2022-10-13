<template>
  <transition name="fade-in">
    <component :is="`${computedType}-control-app`"
      v-if="isActive"
      :configData="itemData"

      :name="itemData.attributes.name"
      :addr="itemData.attributes.addr"
      :status="status"
      :type="itemData.attributes.type"
      :icon="icon"
    />
  </transition>
</template>

<script>
import BinaryControlApp from '@/components/deviceControlApps/BinaryControlApp.vue';
// import LampControlApp from '@/components/deviceControlApps/LampControlApp.vue';
import DimerControlApp from '@/components/deviceControlApps/DimerControlApp.vue';
import RGBLampControlApp from '@/components/deviceControlApps/RGBLampControlApp.vue';

import JalousieControlApp from '@/components/deviceControlApps/JalousieControlApp.vue';
import ConditionerControlApp from '@/components/deviceControlApps/ConditionerControlApp.vue';
import ValveHeatingControlApp from '@/components/deviceControlApps/ValveHeatingControlApp.vue';

import SensorControlApp from '@/components/deviceControlApps/SensorControlApp.vue';
import BinarySensorControlApp from '@/components/deviceControlApps/BinarySensorControlApp.vue';

import TextSensorControlApp from '@/components/deviceControlApps/TextSensorControlApp.vue';

import LeakSensorControlApp from '@/components/deviceControlApps/LeakSensorControlApp.vue';

import ImportScriptControlApp from '@/components/deviceControlApps/ImportScriptControlApp.vue';

export default {
  props: {
    // configData: Object,
    addr: String,
    item: Object
  },
  data() {
    return {
      
    }
  },
  computed: {
    activePopup() {
			return this.$store.state.modules.popups.activePopup;
    },
    isActive() {
      return this.activePopup == 'deviceControl';
    },
    itemData() {
      return this.item && this.item.name && this.item.name == 'import-script' ? this.item : this.$store.state.itemMap[this.addr];
    },
    computedType() {
      if (this.item && this.item.name == 'import-script') {
        return 'import-script';
      } else {
        return this.itemData.attributes.type == 'virtual' ? this.itemData.attributes['sub-type'] : this.itemData.attributes.type;
      }
    },
    status() {
      return this.itemData.__ ? this.itemData.__.status : [];
    },
    icon() {
      return this.itemData.__ ? this.itemData.__.icon : [];
    },
  },
  components: {
    'lamp-control-app': BinaryControlApp,
    'light-scheme-control-app': BinaryControlApp,
    'script-control-app': BinaryControlApp,

    'dimer-lamp-control-app': DimerControlApp,
    'rgb-lamp-control-app': RGBLampControlApp,
    'jalousie-control-app': JalousieControlApp,
    'jalousie120-control-app': JalousieControlApp,

    'conditioner-control-app': ConditionerControlApp,
    'valve-heating-control-app': ValveHeatingControlApp,

    'sensor-control-app': SensorControlApp,
    'temperature-sensor-control-app': SensorControlApp,
    'illumination-sensor-control-app': SensorControlApp,
    'humidity-sensor-control-app': SensorControlApp,
    'motion-sensor-control-app': SensorControlApp,
    'co2-sensor-control-app': SensorControlApp,

    'leak-sensor-control-app': LeakSensorControlApp,
    'smoke-sensor-control-app': BinarySensorControlApp,

    'long-text-control-app': TextSensorControlApp,
    'text-control-app': TextSensorControlApp,

    'import-script-control-app': ImportScriptControlApp,
    // 'leak-sensor-control-app': LeakSensorControlApp,
  }
}
</script>

<style lang="less" scoped>
</style>