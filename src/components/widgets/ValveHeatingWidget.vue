<template>
  <WidgetItem :icon="icon"
    :name="name" :addr="addr"
    :currentTemp="isNaN(Math.round(roomTemp)) ? undefined : ''+Math.round(roomTemp)"
    :class="{ '--disabled': !manualIsActive }"
    :isActive="manualIsActive"
    :iconInactive="!iconActive"
    :iconTitle="autoModeActive ? $t('Auto') : ''"
    :controlsDisabled="!autoModeActive"
    :activeText="statusMessage"
    :inactiveText="statusMessage"

    @toggle="handleToggle"
  >
    <ModeSelectDropdown
      :modes="visibleModes"
      :activeMode="currentMode && currentMode.includes('always-off') ? lastActiveMode : currentMode"
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
            <span :key="computedTemp">{{ !isManual ? valveHeating.temp + '&deg;' : '--' }}</span>
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
import {mapActions, mapGetters} from "vuex";
import {hexToDecimal} from "@/utils/transformers";

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
			default: 30
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
      currentMode: null
    }
  },

  computed: {
    ...mapGetters(['valveHeating', 'itemMap']),
    ...mapGetters('ws', ['sensorDevice', 'devices']),
    manualIsActive() {
      if (!this.currentMode) return false;
      if (this.currentMode === 'always-off') {
        return false
      } else if (this.currentMode.includes('Manual')) {
        return +this.valveHeating.active
      } else {
        return this.isActive
      }
    },
    statusMessage() {
      return (+this.valveHeating.active ? this.$t('Heating in mode') : this.$t('Cooling in mode')) + ' ' + this.$t(this.currentMode);
    },
    isManual() {
      if (!this.currentMode) return
      return this.currentMode === 'Manual' || this.currentMode.includes('always-off')
    },
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
    },
    itemMap: {
      deep: true,
      handler(val) {
        this.currentMode = val[this.addr].attributes.automation ? val[this.addr].attributes.automation : 'Manual'
      }
    },
    sensorDevice: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val.addr === this.addr) {
          const valveHeatingData = {
            state: this.valveHeating.state,
            active: val.status.slice(1, 2),
            temp: +hexToDecimal(val.status.slice(2, 6)) <= 50 ? +hexToDecimal(val.status.slice(2, 6)) : '--',
            roomTemp: +hexToDecimal(val.status.slice(6, 10)) <= 50 ? +hexToDecimal(val.status.slice(6, 10)) : '--',
          }

          this.$store.dispatch("loadLogicXML");
          this.$store.commit('setValveHeatingData', valveHeatingData);
        }
      }
    },
    devices: {
      deep: true,
      immediate: true,
      handler(val) {
        if (!Array.isArray(val) && val.addr === this.addr) {
          const valveHeatingData = {
            state: this.valveHeating.state,
            active: val.state.slice(1, 2),
            temp: +hexToDecimal(val.state.slice(2, 6)) <= 50 ? +hexToDecimal(val.state.slice(2, 6)) : '--',
            roomTemp: +hexToDecimal(val.state.slice(6, 10)) <= 50 ? +hexToDecimal(val.state.slice(6, 10)) : '--',
          }

          this.$store.dispatch("loadLogicXML");
          this.$store.commit('setValveHeatingData', valveHeatingData);
        }
      }
    },
  },
  methods: {
    ...mapActions('modules/settings', ['subscribeRequest']),
    async handleToggle() {
      await this.$store.dispatch("loadLogicXML");
      if (!this.isManual) {
        await this.controller.toggle('as:-10')
      } else if (this.currentMode === 'always-off') {
        await this.handleChangeMode(this.lastActiveMode)
      } else {
        let isActive = +this.valveHeating.active ? '0' : '1'

        await this.$store.dispatch('setStatus', {
          addr: this.addr,
          status: `0${isActive}`
        });
      }

      const addrs = this.$store.getters.getRoomItems(this.roomId);
      await this.subscribeRequest(addrs.map(addr => addr.attributes.addr))
      await this.subscribeRequest(this.addr)
      await this.$store.dispatch("loadLogicXML");
      this.currentMode = this.item.attributes.automation ? this.item.attributes.automation : 'Manual'
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
      if (+this.valveHeating.temp  + 1 <= this.maxTemp) {
        this.valveHeating.temp = +this.valveHeating.temp + 1;
        this.controller.changeTemp(`ts:${this.valveHeating.temp.toFixed()}0`)
      } else {
        return this.valveHeating.temp  = this.maxTemp;
      }
		},
		decrementTemp() {
      if (+this.valveHeating.temp  - 1 >= this.minTemp) {
        this.valveHeating.temp -= 1
        this.controller.changeTemp(`ts:${this.valveHeating.temp.toFixed()}0`)
      } else {
        return this.valveHeating.temp = this.minTemp;
      }
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
      if (this.isManual) return
      if (val > 0) {
        this.incrementTemp();
      } else {
        this.decrementTemp();
      }
    },
		handleBtnTouchStart(val) {
      if (this.isManual) return
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
      this.$store.commit('saveController', new ValveHeatingController({
        addr: this.addr,
        status: this.status,
        item: this.$store.state.itemMap[this.addr]
      }));
    }
  },
  async mounted() {
    await this.subscribeRequest(this.addr);
    await this.$store.dispatch("loadLogicXML");
    this.currentMode = this.mode
    this.roomId = this.$route.params.id
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