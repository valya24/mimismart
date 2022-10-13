<template>
  <WidgetItem :icon="icon"
    :name="name" :addr="addr" :isActive="isActive"
    @toggle="handleToggle">

    <Brightness v-if="editPermission" class="fg1" :min="1" :max="255"
      :gray="!isActive"
      :value="brightness"
      @change="handleBrightnessChange" />

    <Brightness v-else class="fg1" :min="1" :max="255"
      :gray="!isActive"
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
    }
  },
  methods: {
    // TODO: Maybe debounce this later
    handleBrightnessChange(value) {
      if (!this.checkEditPermission()) return;

      return this.controller.changeBrightness(value);
    },
    // handleBrightnessChange: debounce(function(value) {
    //   return this.controller.changeBrightness(value);
    // }, 300),
    // ===============================
    handleToggle(value) {
      if (!this.checkEditPermission()) return;

      if (value == undefined) {
				value = !this.isActive;
			}
      return this.controller.toggle(value);
    },

    //  TODO: Refactor this
    checkEditPermission() {
      if (!this.editPermission) {
				this.$store.dispatch('modules/alerts/userEditPermissionAlert');
      }

      return this.editPermission;
    }
  },
  created() {
    if (!this.controller) {
      this.$store.commit('saveController', new DimmerController({
        addr: this.addr,
        status: this.status,
      }));
    }
  },
  components: {
    WidgetItem,
    Brightness
  }
}
</script>

<style>

</style>