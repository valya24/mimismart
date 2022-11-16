<template>
  <WidgetItem :icon="icon"
    :name="name" :addr="addr" :isActive="+active"
    @toggle="handleToggle(+active)">
    <Brightness v-if="editPermission" class="fg1" :min="1" :max="255"
      :gray="!+active"
      :value="brightness"
      @change="handleBrightnessChange" />

    <Brightness v-else class="fg1" :min="1" :max="255"
      :gray="!+active"
      :value="brightness"

      @touchmove.native.capture.stop="checkEditPermission"
      @touchstart.native.capture.stop="checkEditPermission"
    />
  </WidgetItem>
</template>

<script>
import WidgetItem from "@/components/widgets/WidgetItem"
import Brightness from "@/components/controls/Brightness"

import { DimmerController } from "@/utils/deviceControllers";
import {mapActions, mapGetters} from "vuex";
import {hexToDecimal} from "@/utils/transformers";
import {debounce} from "@/utils/functions";

// import { debounce } from '@/utils/functions.js';

export default {
  props: {
    name: String,
    addr: String,
    editPermission: {
			type: Boolean,
			default: true
		}
  },
  data: () => ({
    roomId: null,
    active: '',
    bright: null,
  }),

  watch: {
    devices: {
      deep: true,
      immediate: true,
      handler(val) {
        if (!val) return
        if (!Array.isArray(val) && val.addr === this.addr) {
          const dimmerLampData = {
            addr: this.addr,
            active: val.state.slice(1, 2),
            bright: Math.ceil(hexToDecimal(`00${val.state.slice(2, 4)}`, this.icon))
          }
          this.handleBrightnessChange(dimmerLampData.bright)
          this.active = dimmerLampData.active
          this.$store.commit('setDimmerLampData', dimmerLampData);

          this.$store.commit('saveController', new DimmerController({
            addr: this.addr,
            status: this.dimmerLamp,
          }));
        }
      }
    },
    sensorDevice: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val.addr === this.addr) {
          const dimmerLampData = {
            addr: this.addr,
            active: val.status.slice(1, 2),
            bright: Math.ceil(hexToDecimal(`00${val.status.slice(2, 4)}`, this.icon))
          }
          this.handleBrightnessChange(dimmerLampData.bright)
          this.active = dimmerLampData.active
          this.$store.commit('setDimmerLampData', dimmerLampData);
        }
      }
    }
  },
  computed: {
    ...mapGetters(['dimmerLamp']),
    ...mapGetters('ws', ['sensorDevice', 'devices']),
    item() {
      return this.$store.state.itemMap[this.addr];
    },
    icon() {
      return this.item.__.icon;
    },
    controller() {
      return this.$store.state.controllers[this.addr];
    },
    isActive() {
      return this.controller.isActive;
    },
    brightness() {
      return this.controller?.brightness;
    },
    status() {
      return this.$store.state.itemMap[this.addr].__.status;
    }
  },
  methods: {
    ...mapActions('modules/settings', ['subscribeRequest']),
    // TODO: Maybe debounce this later
    handleBrightnessChange: debounce(function (value) {
      this.controller.changeBrightness(value)
      const addrs = this.$store.getters.getRoomItems(this.roomId);
      this.subscribeRequest(addrs.filter(addr => addr.attributes && addr.attributes.addr).map(addr => addr.attributes.addr))
    }, 300),
    async handleToggle(value) {
      await this.controller.toggle(value ? '00' : '01')
      const addrs = this.$store.getters.getRoomItems(this.roomId);
      await this.subscribeRequest(addrs.filter(addr => addr.attributes && addr.attributes.addr).map(addr => addr.attributes.addr))
    },

    //  TODO: Refactor this
    checkEditPermission() {
      if (!this.editPermission) {
				this.$store.dispatch('modules/alerts/userEditPermissionAlert');
      }

      return this.editPermission;
    }
  },
  async created() {
    this.roomId = this.$route.params.id
    await this.subscribeRequest(this.addr)
    const addrs = this.$store.getters.getRoomItems(this.roomId);
    await this.subscribeRequest(addrs.filter(addr => addr.attributes && addr.attributes.addr).map(addr => addr.attributes.addr))

    // if (!this.controller) {
    //   this.$store.commit('saveController', new DimmerController({
    //     addr: this.addr,
    //     status: this.dimmerLamp,
    //   }));
    // }

    this.bright = this.dimmerLamp.bright
  },
  components: {
    WidgetItem,
    Brightness
  }
}
</script>

<style>

</style>