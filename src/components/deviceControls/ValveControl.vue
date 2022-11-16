<template>
  <div class="dimer-control controls-body"
       :class="{ 'on': isActive }">
    <div class="big-icon-control">
      <icon-comp iconName="icon-valve"
        @click.native="handleClick"
        :isOn="isActive"/>
    </div>
    <div class="controls-footer hbox just-cn">
      <div class="col-switch vbox alic" @click="handleClick">
        <div class="label">{{ isActive ? $t('On_1') : $t('Off_1') }}</div>
        <app-switch :checked="isActive"/>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";

export default {
  props: {
    addr: String,
    active: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    roomId: null
  }),
  mounted() {
    this.roomId = this.$route.params.id
    this.subscribeRequest(this.addr)
  },
  computed: {
    ...mapGetters(['valve']),
    ...mapGetters('ws', ['sensorDevice', 'devices']),
    isActive() {
      switch (this.valve.status) {
        case '08' || '00':
          return false
        case '09' || '01':
          return true
        default:
          return false
      }
    }
  },
  watch: {
    sensorDevice: {
      deep: true,
      handler(val) {
        if (val.addr === this.addr) {
          this.$store.commit('setValveData', { status: val.status });
        }
      }
    },
    devices: {
      deep: true,
      immediate: true,
      handler(val) {
        if (!Array.isArray(val) && val.addr === this.addr) {
          this.$store.commit('setValveData', { status: val.state });
        }
      }
    },
  },
  methods: {
    ...mapActions('modules/settings', ['subscribeRequest']),
    async handleClick() {
      await this.$emit('change', !this.isActive);
      const addrs = this.$store.getters.getRoomItems(this.roomId);
      await this.subscribeRequest(addrs.map(addr => addr.attributes.addr))
    }
  },
}
</script>

<style lang="less" scoped>
.slider {
  width: 230px;
}
</style>