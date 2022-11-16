<template>
  <div class="sensor-device-wrapper" :key="sensorDeviseValue">
    {{ sensorDeviseValue ? sensorDeviseValue + unit : '--' }}
  </div>
</template>

<script>
import {hexToDecimal} from "@/utils/transformers";

import {mapActions, mapGetters} from "vuex";

export default {
  name: 'sensor-device',

  props: ['sensor', 'unit', 'addr'],

  data: () => ({
    sensorDeviseValue: null,
    roomId: '0-0',
  }),

  async mounted() {
    await this.subscribeRequest(this.sensor.attributes.addr);
  },
  watch: {
    devices: {
      deep: true,
      immediate: true,
      handler(val) {
        if (!val) return
        if (Array.isArray(val)) {
          val.map(item => {
            if (item && this.addr === item.addr) {
              this.sensorDeviseValue = hexToDecimal(item.state, 'sensor-device')
            }
          })
        } else {
          if (val.addr === this.addr) {
            this.sensorDeviseValue = hexToDecimal(val.state, 'sensor-device')
          }
        }
      }
    },
    sensorDevice: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val && val.addr === this.sensor.attributes.addr) {
          this.sensorDeviseValue = hexToDecimal(val.status, 'sensor-device')
        }
      }
    }
  },

  computed: {
    ...mapGetters('ws', ['sensorDevice', 'devices']),
  },

  methods: {
    ...mapActions('modules/settings', ['subscribeRequest'])
  }
}
</script>

<style lang="less" scoped>
.sensor-device-wrapper {
  font-size: 13px;
}
</style>