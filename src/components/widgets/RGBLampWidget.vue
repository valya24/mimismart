<template>
  <WidgetItem class="presets" :icon="icon"
    :value="color"
    :name="name" :addr="addr" :isActive="isActive"
    @toggle="handleToggle">
				<BtnColorPreset v-for="(color, i) in colors" :key="i"
          :color="color" @click.native="handleColorChange(color)" />

				<BtnColorPreset class="big" :color="color"
          @click.native="$parent.$emit('callControlApp', addr)" />
			</WidgetItem>
</template>

<script>
import WidgetItem from "@/components/widgets/WidgetItem"
import BtnColorPreset from "@/components/buttons/BtnColorPreset"

import { RGBLampController } from "@/utils/deviceControllers";

import { hexToHsv, hsvToHex } from "@/utils/transformers.js";

export default {
  props: {
    name: String,
    addr: String,
    editPermission: {
			type: Boolean,
			default: true
		}
  },
  data() {
    return {
      // colors: ['#FF7C52', '#FFCF52', '#6AFF52', '#52A2FF', '#E752FF'],
      // colors: ['#ff4300', '#ffb800', '#21ff00', '#007eff', '#d800ff'],
      colors: ['#ff4300', '#21ff00', '#007eff', '#d800ff', '#ffffff'],
      hsvToHex
    }
  },
  computed: {
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
      return this.controller.brightness;
    },
    status() {
      return this.$store.state.itemMap[this.addr].__.status;
    },
    color() {
      return hsvToHex(this.controller.color);
    }
  },
  methods: {
    handleColorChange(value) {
      if (!this.checkEditPermission()) return;

      return this.controller.changeColor(hexToHsv(value));
    },
    handleToggle(value) {
      if (!this.checkEditPermission()) return;

      if (value == undefined) {
				value = !this.isActive;
			}
      return this.controller.toggle(value);
    },

    checkEditPermission() {
      if (!this.editPermission) {
				this.$store.dispatch('modules/alerts/userEditPermissionAlert');
      }

      return this.editPermission;
    }
  },
  created() {
    if (!this.controller) {
      this.$store.commit('saveController', new RGBLampController({
        addr: this.addr,
        status: this.status,
      }));
    }
  },
  components: {
    WidgetItem,
    BtnColorPreset
  }
}
</script>

<style lang="less" scoped>
</style>