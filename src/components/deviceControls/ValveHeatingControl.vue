<template>
	<div class="modal-ac controls-body">
		<div class="main-controls">
			<div class="buttons-col right">
				<BtnIcon icon="icon-plus" class="rounded"
          :disabled="isManual"
          :class="{ 'on': !isManual }"
					@touchstart.native="handleBtnTouchStart(1)"
					@touchend.native="handleBtnTouchEnd(1)"
					@contextmenu.native.prevent.capture=""
				/>
				<BtnIcon icon="icon-minus" class="rounded"
          :disabled="isManual"
          :class="{ 'on': !isManual }"
					@touchstart.native="handleBtnTouchStart(-1)"
					@touchend.native="handleBtnTouchEnd(-1)"
					@contextmenu.native.prevent.capture=""
				/>
			</div>

			<Knob :min="minTemp" :max="maxTemp"
				:value="valveHeating?.temp" :secondValue="roomTemp"
				@change="handleKnobChange"
				:disabled="isManual">
				<div class="indicators hbox alic"
					:class="{ 'on': isManual }">
					<ModeSelectDropdown
						:modes="visibleModes"
            :disabled="isManual"
						:activeMode="currentModeIcon"
						:valueKey="'name'"
						:modeIcon="modeIcon"
						@selectMode="selectMode"
					/>
				</div>
				<div class="temp-info">
					<transition name="counter" mode="out-in">
						<div class="active-temp" :key="computedTemp">
							{{ !isManual ? valveHeating.temp + '&deg;' : '--' }}
						</div>
					</transition>
					<div class="room-temp">
						{{ $t("Room temp") }}
						<div>
							{{ !isManual ? valveHeating.roomTemp + '&deg;' : '--' }}
						</div>
					</div>
				</div>
			</Knob>
		</div>
		<div class="device-status"
			:class="{ '--hidden': !valveHeating.active }">
			<div class="device-status-title">
				{{ statusMessage }}
			</div>
		</div>
		<div class="controls-footer hbox just-sb">
			<div class="col-mode">
				<div class="label">{{ $t('Mode') }}</div>
				<ModeSelectDropdown :class="{ 'on': isActive }"
					:modes="visibleModes"
					:activeMode="currentMode == 'always-off' ? lastActiveMode : currentMode"
					:valueKey="'name'"
					:modeIcon="modeIcon"
					:showActiveTitle="true"
					@selectMode="selectMode"
				/>
				<!-- <Dropdown
					:value="mode == 'always-off' ? lastActiveMode : mode"
					@change="val => $emit('changeMode', val)">
					<option v-for="(mode, i) in visibleModes" :key="i"
						:value="mode.name">{{ $t(mode.name) }}</option>
				</Dropdown> -->
			</div>
			<div class="col-switch vbox alic"
				@click="handleToggle">
				<div class="label">{{ manualIsActive ? $t('On_1') : $t('Off_1') }}</div>
				<app-switch :checked="manualIsActive" />
			</div>
			<div class="col-empty"></div>
		</div>
	</div>
</template>

<script>
import BtnIcon from "@/components/buttons/BtnIcon";
// import Dropdown from "@/components/controls/Dropdown";
import Switch from "@/components/controls/Switch";
import Knob from "@/components/controls/Knob";

import { debounce } from "@/utils/functions.js";

import ModeSelectDropdown from "@/components/etc/ModeSelectDropdown"
import {mapActions, mapGetters} from "vuex";
import {hexToDecimal} from "@/utils/transformers";
// import {ValveHeatingController} from "@/utils/deviceControllers";

const holdDelay = 500;
const holdInterval = 350;

export default {
	props: {
    addr: String,
    // item: Object,
		active: Boolean,
		controllerIsActive: Boolean,
		// minTemp: {
		// 	type: Number,
		// 	default: 18
		// },
		// maxTemp: {
		// 	type: Number,
		// 	default: 30
		// },
		temperature: {
			type: Number,
			default: 16
		},
		roomTemp: {
			type: Number,
			default: 16
		},
		modes: {
			type: Array,
		},
		// mode: {
		// 	type: String,
		// 	default: 'Off'
		// },
		lastActiveMode: {
			type: String,
			default: 'Off'
		},
		powerlevel: Number
	},
	data() {
		return {
      dynamicKey: 1,
			currTemp: this.temperature,
			currPowerlevel: 0,
			currMode: 0,
			showModeSelectModal: false,
			timeout: null,
			interval: null,
      roomId: null,
      isActive: null,
      currentMode: null,
      valveItem: null,
		}
	},
  async mounted() {
    await this.$store.dispatch("loadLogicXML");
    this.currentMode = this.mode
    this.roomId = this.$route.params.id
  },
  computed: {
    ...mapGetters(['valveHeating', 'itemMap']),
    ...mapGetters('ws', ['sensorDevice']),
    actualModes() {
      return this.isCustom ? this.item.elements.map(mode => mode.attributes) : this.modes
    },
    minTemp() {
      if (this.isCustom) {
        return 99
      } else {
        return this.item.attributes['t-min'] ? +this.item.attributes['t-min'] : 18
      }
    },
    maxTemp() {
      if (this.isCustom) {
        return 0
      } else {
        return this.item.attributes['t-min'] && this.item.attributes['t-delta'] ? +this.item.attributes['t-min'] + +this.item.attributes['t-delta'] : 30
      }
    },
    currentModeIcon() {
      if (this.isCustom) {
        return {icon: 'hot', custom: true}
      } else {
        return this.currentMode && this.currentMode.includes('always-off') ? this.lastActiveMode : this.currentMode
      }
    },
    isCustom() {
      return this.item.attributes.custom === 'yes'
    },
    item() {
      return this.$store.state.itemMap[this.addr];
    },
    controller() {
      return this.$store.state.controllers[this.addr];
    },
    mode() {
      return this.controller.mode;
    },
    manualIsActive() {
      if (!this.currentMode) return false;
      if (this.currentMode === 'always-off') {
        return false
      } else if (this.currentMode.includes('Manual')) {
        return +this.valveHeating.active
      } else {
        return this.active
      }
    },
    isManual() {
      if (!this.currentMode) return
      return this.currentMode === 'Manual' || this.currentMode.includes('always-off')
    },
		modeIcon() {
      let mode = this.currentMode == 'always-off' ? this.lastActiveMode : this.currentMode;
      return this.actualModes.reduce( (accum, item) => item.name == mode ? accum = item.icon : accum, 'close' )
		},
		visibleModes() {
      return this.actualModes.filter( item => item.key != 'always-off' );
		},
		computedTemp() {
      if (!this.currentMode) return
			return this.currentMode == 'Manual' || this.currentMode == 'always-off' || this.currTemp == 128 ? '--' : (Math.round(this.currTemp) + '°');
		},

		statusMessage() {
			return (+this.valveHeating.active ? this.$t('Heating in mode') : this.$t('Cooling in mode')) + ' ' + this.$t(this.currentMode);
		}
	},
	watch: {
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
            temp: +hexToDecimal(val.status.slice(2, 6)) <= 99 ? +hexToDecimal(val.status.slice(2, 6)) : '--',
            roomTemp: +hexToDecimal(val.status.slice(6, 10)) <= 99 ? +hexToDecimal(val.status.slice(6, 10)) : '--',
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
        if (!val) return
        if (Array.isArray(val)) {
          val.map(item => {
            if (item && item.addr === this.addr) {
              const valveHeatingData = {
                state: this.valveHeating.state,
                active: item.state.slice(1, 2),
                temp: +hexToDecimal(item.state.slice(2, 6)) <= 99 ? +hexToDecimal(item.state.slice(2, 6)) : '--',
                roomTemp: +hexToDecimal(item.state.slice(6, 10)) <= 99 ? +hexToDecimal(item.state.slice(6, 10)) : '--',
              }

              this.$store.dispatch("loadLogicXML");
              this.$store.commit('setValveHeatingData', valveHeatingData);
            }
          })
        }
      }
    },

		temperature(newVal) {
			if (Math.abs(this.currTemp - newVal) > 0.5) {
				this.currTemp = newVal;
			}
		},
		currTemp: debounce(function(newVal) {
			if (newVal != this.temperature) this.$emit('changeTemp', newVal);
		}, 2000),
	},
	methods: {
    ...mapActions('modules/settings', ['subscribeRequest']),
    async handleToggle() {
      await this.$store.dispatch("loadLogicXML");
      if (!this.isManual) {
        await this.$emit('toggle', 'as:-10')
      } else if (this.currentMode === 'always-off') {
        await this.$emit('changeMode', this.lastActiveMode);
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
		handleKnobChange: debounce(function (value) {
      this.valveHeating.temp = value.toFixed();
      this.$emit('changeTemp', `ts:${this.valveHeating.temp}0`)
    }, 300),
		incrementTemp() {
			if (this.valveHeating.temp  + 1 <= this.maxTemp) {
        this.valveHeating.temp = +this.valveHeating.temp + 1;
        this.$emit('changeTemp', `ts:${this.valveHeating.temp.toFixed()}0`)
			} else {
				return this.valveHeating.temp  = this.maxTemp;
			}
		},
		decrementTemp() {
			if (this.valveHeating.temp  - 1 >= this.minTemp) {
        this.valveHeating.temp -= 1
        this.$emit('changeTemp', `ts:${this.valveHeating.temp.toFixed()}0`)
			} else {
				return this.valveHeating.temp = this.minTemp;
			}
		},
		handleBtnTouchStart(val) {
      if (this.isManual) return
			if (val > 0) {
				this.incrementTemp();
			} else {
				this.decrementTemp();
			}

			this.timeout = setTimeout( () => {
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
		},

		async selectMode(mode) {
      await this.$store.dispatch("loadLogicXML");
      await this.$emit('changeMode', mode);
      await this.$store.dispatch("loadLogicXML");

      const addrs = this.$store.getters.getRoomItems(this.roomId);
      await this.subscribeRequest(addrs.map(addr => addr.attributes.addr))
      await this.subscribeRequest(this.addr)
      await this.$store.dispatch("loadLogicXML");

    }
	},
	components: {
		BtnIcon,
		// Dropdown,
		"app-switch": Switch,
		Knob,
		ModeSelectDropdown
	}
};
</script>

<style lang="less" scoped>
.col-mode,
.col-empty {
	flex: 1;
}
.col-switch {
	margin-left: 10px;
	margin-right: 10px;
}
.temp-info {
	position: absolute;
	top: 72px;
	left: 50%;
	transform: translateX(-50%);
	white-space: nowrap;
	text-align: center;
	.active-temp {
		font-size: 42px;
		.on & {
			color: @colorMain;
		}
	}
	.room-temp {
		font-size: 12px;
		margin-top: 8px;
		color: #808080;
		div {
			font-size: 18px;
		}
	}
}
.indicators {
	position: absolute;
	z-index: 3;
	top: 24px;
	left: 50%;
	transform: translateX(-50%);
	.btn-icon {
		margin-left: 8px;
		margin-right: 8px;
	}
}
.buttons-col {
	position: absolute;
	z-index: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	height: 200px;
	&.right {
		right: 0;
	}
}
.modal-ac {
	margin-top: 24px;
	position: relative;
	z-index: 1;
}
.knob {
	position: relative;
	z-index: 3;
	width: 200px;
	height: 200px;
	margin-left: auto;
	margin-right: auto;
	box-shadow: 0px 7px 28px rgba(168, 173, 255, 0.29);
	border-radius: 50%;
	svg {
		position: absolute;
		left: -12px;
		top: -12px;
	}
	&.--disabled .active-temp {
		color: @colorGrayedOut;
	}
	
}
.device-status {
	transition: .25s;
	&.--hidden {
		opacity: 0;
		transform: translateY(-3px);
	}
}
</style>

<style lang="less">
.list-item .fill-variable,
.on .fill-variable {
	fill: @colorMain
}
</style>