<template>
  <WidgetItem :icon="icon"
    :name="name" :addr="addr"
    :currentTemp="isNaN(Math.round(roomTemp)) ? undefined : ''+Math.round(roomTemp)"
    :class="{ '--disabled': !isActive }"
    :isActive="isActive"
    :iconInactive="!iconActive"
    :iconTitle="autoModeActive ? $t('Auto') : ''"
    :controlsDisabled="!autoModeActive"
    :activeText="$t('Heating in mode') + ' ' + $t(mode)"
    :inactiveText="$t('Cooling in mode') + ' ' + $t(mode)"

    @toggle="handleToggle"
  >
    <ModeSelectDropdown
      :modes="visibleModes"
      :activeMode="mode == 'always-off' ? lastActiveMode : mode"
      :valueKey="'name'"
      @selectMode="selectMode"
    />

    <div class="controls-wrapper" :class="{ '--disabled': !autoModeActive }">
      <BtnIcon icon="icon-minus" class="right"
        @touchstart.native="handleBtnTouchStart(-1)"
        @click.native="handleBtnClick(-1)"
        @touchend.native="handleBtnTouchEnd"
        @touchmove.native="handleBtnTouchEnd"
        @contextmenu.native.prevent.capture=""
      />
        <div class="value">
          <transition name="counter" mode="out-in">
            <span :key="computedTemp">{{ computedTemp }}</span>
          </transition>
        </div>

      <BtnIcon icon="icon-plus"
        @touchstart.native="handleBtnTouchStart(1)"
        @click.native="handleBtnClick(1)"
        @touchend.native="handleBtnTouchEnd"
        @touchmove.native="handleBtnTouchEnd"
        @contextmenu.native.prevent.capture=""
      />
    </div>
  </WidgetItem>
</template>

<script>
import WidgetItem from "@/components/widgets/WidgetItem";
import ModeSelectDropdown from "@/components/etc/ModeSelectDropdown"

import { ValveHeatingController } from "@/utils/deviceControllers";

import { debounce } from "@/utils/functions.js";

const holdDelay = 500;
const holdInterval = 350;

export default {
  props: {
		name: String,
    addr: String,

    //  TODO: Refactor this to controller props
    minTemp: {
			type: Number,
			default: 16
		},
		maxTemp: {
			type: Number,
			default: 50
    },
    editPermission: {
			type: Boolean,
			default: true
		}
  },
  data() {
    return {
      timeout: null,
      interval: null,
      temperature: 0,
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
    iconActive() {
      return this.controller.isActive;
    },
    isActive() {
      return this.autoModeActive ? true : this.iconActive;
    },
    // temperature() {
    //   return this.controller.temperature;
    // },
    controllerTemp() {
      return this.controller ? this.controller.temperature : 0;
    },
    roomTemp() {
      return this.controller.roomTemp;
    },
    computedTemp() {
      return !this.autoModeActive || this.temperature == 128 ? '--' : (Math.round(this.temperature) + '°');
    },
    
    modes() {
      return this.controller.modes;
    },
    visibleModes() {
      return this.modes.filter( item => item.key != 'always-off' );
    },
    mode() {
      return this.controller.mode;
    },
    autoModeActive() {
      return this.controller.autoModeActive
    },
    lastActiveMode() {
      return this.controller.lastActiveMode;
    },
  },
  watch: {
    controllerTemp(newVal) {
      this.temperature = newVal;
    }
  },
  methods: {
    handleToggle(value) {
      if (!this.checkEditPermission()) return;

			return this.controller.toggle(value);
    },
    handleChangeMode(value) {
      if (!this.checkEditPermission()) return;

      this.controller.changeMode(value);
    },
    // handleChangeTemp(value) {
    //   if (!this.checkEditPermission()) return;

    //   this.controller.changeTemp(value);
    // },
    changeControllerTemp: debounce(function(value) {
      if (!this.checkEditPermission()) return;

      this.controller.changeTemp(value);
    }, 2000),
    handleChangeTemp(value) {
      if (!this.checkEditPermission()) return;
      this.temperature = value;
      this.changeControllerTemp(value);
    },
    incrementTemp() {
			let temp = (this.temperature + 1 <= this.maxTemp) ? this.temperature + 1 : this.maxTemp;
			this.handleChangeTemp(temp);
		},
		decrementTemp() {
			let temp = (this.temperature - 1 >= this.minTemp) ? this.temperature - 1 : this.minTemp;
			this.handleChangeTemp(temp);
    },
    selectMode(mode) {
      if (!this.checkEditPermission()) return;

      this.handleChangeMode(mode);
    },

    //  TODO: Refactor this
    checkEditPermission() {
      if (!this.editPermission) {
				this.$store.dispatch('modules/alerts/userEditPermissionAlert');
      }

      return this.editPermission;
    },

    //	Plus & Minus buttons hold
    handleBtnClick(val) {
      if (val > 0) {
        this.incrementTemp();
      } else {
        this.decrementTemp();
      }
    },
		handleBtnTouchStart(val) {
			this.timeout = setTimeout( () => {
				this.handleBtnClick(val);
				this.interval = setInterval( () => {
					if (val > 0) {
						this.incrementTemp();
					} else {
						this.decrementTemp();
					}
				}, holdInterval);
			}, holdDelay)
		},
		handleBtnTouchEnd() {
			clearTimeout(this.timeout);
			this.timeout = null;
			clearInterval(this.interval);
			this.interval = null;
		}
  },
  created() {
    if (!this.controller) {
      console.log('creating controller');
      this.$store.commit('saveController', new ValveHeatingController({
        addr: this.addr,
        status: this.status,
        item: this.$store.state.itemMap[this.addr]
      }));
    }
  },
  mounted() {
    this.temperature = this.controller.temperature;
  },
  components: {
    WidgetItem,
    ModeSelectDropdown
  }
}
</script>

<style lang="less">
.modal-dropdown-list {
  margin: 0 !important;
}
.buttonbar .controls-wrapper {
  margin-left: auto;
  display: flex;
  align-items: center;
}
.buttonbar .--disabled .value {
  color: @colorGrayedOut;
}
</style>