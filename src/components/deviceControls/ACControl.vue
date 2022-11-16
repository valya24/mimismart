<template>
	<div class="modal-ac controls-body" :class="{ 'on': +conditioner.isActive, '--disabled': !+conditioner.isActive }">
		<div class="main-switch tablets-only"
			@click="handleToggle">
			<div class="label">{{ +conditioner.isActive ? $t('On_1') : $t('Off_1') }}</div>
			<app-switch :checked="+conditioner.isActive" />
		</div>
		<div class="main-controls">
			<div class="buttons-col right">
        <BtnIcon icon="icon-plus" class="rounded"
                 :disabled="+conditioner.isActive"
                 @touchstart.native="handleBtnTouchStart(1)"
                 @touchend.native="handleBtnTouchEnd"
                 @contextmenu.native.prevent.capture=""
        />

				<span class="stepper-title tablets-only">{{ $t('Temperature') }}</span>

        <BtnIcon icon="icon-minus" class="rounded"
                 :disabled="+conditioner.isActive"
                 @touchstart.native="handleBtnTouchStart(-1)"
                 @touchend.native="handleBtnTouchEnd"
                 @contextmenu.native.prevent.capture=""
        />
			</div>
			<div class="buttons-col left" v-if="vaneHorModes && vaneHorModes.length">
				<BtnIcon icon="icon-swing-horiz" class="rounded"
          :disabled="+conditioner.isActive"
					:value="+conditioner.vaneHorMode" @click.native="handleVaneHorCycle" />

				<span class="stepper-title tablets-only">{{ $t('Lamels') }}</span>

				<BtnIcon icon="icon-swing" class="rounded"
					v-if="vaneVerModes && vaneVerModes.length"
          :disabled="+conditioner.isActive"
					:value="+conditioner.vaneVerMode" @click.native="handleVaneVerCycle" />
			</div>
      <div v-else class="buttons-col left"></div>
			<div class="buttons-col power-stepper tablets-only">
				<BtnIcon icon="icon-back" class="rounded" @click.native="cyclePowerlevelsDec" />

				<span class="stepper-title tablets-only">
					{{ $t('Power level') }}
					<span class="value">{{ selectedPowerLevel }}</span>
				</span>

				<BtnIcon icon="icon-back" class="rounded flip-x" @click.native="cyclePowerlevels" />
			</div>

			<Knob :disabled="!+conditioner.isActive"
				:min="minTemp" :max="maxTemp"
				:value="conditioner.temp" :secondValue="roomTemp"
				@change="handleKnobChange">
				<div class="indicators hbox alic">
					<BtnIcon v-if="modes.length" :icon="'icon-' + activeModeIcon" @click.native="cycleModes" />

					<BtnIcon v-if="modes.length" icon="icon-powerlevel" :value="+conditioner.powerLevel" @click.native="cyclePowerlevels" />
					<BtnIcon v-else icon="icon-powerlevel" :value="2" @click.native="cyclePowerlevels" />
				</div>
				<div class="temp-info">
					<transition name="counter" mode="out-in">
						<div class="active-temp" :key="Math.round(conditioner)">
							{{ conditioner ? Math.round(conditioner.temp) : '--' }} <span v-html="tempDim"></span>
						</div>
					</transition>

					<div class="room-temp" v-if="!isNaN(roomTemp)">
						{{ $t("Room temp") }}
						<div>{{ Math.round(roomTemp) }}&deg;</div>
					</div>
				</div>
			</Knob>
		</div>
		<div class="device-status"
			:class="{ '--hidden': !+conditioner.isActive }">
			<div class="device-status-title">
				{{ statusMessage }}
			</div>
		</div>
		<div class="mode-selector tablets-only">
			<div class="mode-item"
				v-for="mode in modes" :key="mode.key"
				:class="{ '--active': conditioner.mode === mode.key }"
				@click="selectMode(mode.key)"
			>
				<div class="mode-icon">
					<icon-comp :iconName="`icon-${mode.icon}`" />
				</div>
				<div class="mode-title">{{ mode.name }}</div>
			</div>
		</div>
		<div class="controls-footer hbox just-sb tablets-hide">
			<div v-if="modes.length" class="col-mode">
				<div class="label">{{ $t('Mode') }}</div>

				<ModeSelectDropdown :class="{ 'on': +conditioner.isActive }"
					:modes="modes"
					:activeMode="activeModeName"
					:valueKey="'name'"
					:emitKey="'key'"
					:showActiveTitle="true"
					@selectMode="selectMode"
				/>
			</div>

			<div class="col-switch vbox alic"
				@click="handleToggle">
        <div class="label">{{ +conditioner.isActive ? $t('On_1') : $t('Off_1') }}</div>
        <app-switch :checked="+conditioner.isActive" />
			</div>

			<div class="col-powerlevel">
				<div class="label" v-if="powerlevels && powerlevels.length">{{ $t('Power level') }}</div>
				<ModeSelectDropdown v-if="powerlevels && powerlevels.length"
					:class="{ 'on': active }"
					:modes="powerlevels"
					:activeMode="activePowerName"
					:valueKey="'name'"
					:emitKey="'key'"
					:showActiveTitle="true"
					:alignRight="true"
					@selectMode="selectPowerlevel"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import BtnIcon from "@/components/buttons/BtnIcon";
import Switch from "@/components/controls/Switch";
import Knob from "@/components/controls/Knob";
import { hexToDecimal, replaceAt } from "@/utils/transformers.js";

import { debounce } from "@/utils/functions.js";

import ModeSelectDropdown from "@/components/etc/ModeSelectDropdown"
import {mapActions, mapGetters} from "vuex";

const holdDelay = 500;
const holdInterval = 350;

export default {
	props: {
		active: Boolean,
    addr: String,
    configData: {
      type: Object
    },
		minTemp: {
			type: Number,
			default: 16
		},
		maxTemp: {
			type: Number,
			default: 32
		},
		temperature: {
			type: Number,
			default: 16
		},
		modes: {
			type: Array,
			default() { return []; }
		},
		mode: {
			type: Number,
			default: 4
		},
		powerlevels: {
			type: Array,
			default() { return []; }
		},
		powerlevel: {
			type: Number,
			default: 0
		},
		vaneHor: {
			type: Number,
			default: 0
		},
		vaneHorModes: {
			type: Array,
			default() { return []; }
		},
		vaneVer: {
			type: Number,
			default: 0
		},
		vaneVerModes: {
			type: Array,
			default() { return []; }
		},
		roomTemp: {
			type: Number,
			default: NaN
		}
	},
	data() {
		return {
			currTemp: this.temperature,
			currPowerlevel: 0,
			currMode: 0,
      roomId: null
		}
	},
  mounted() {
    this.roomId = this.$route.params.id
  },
  computed: {
    ...mapGetters(['conditioner']),
    ...mapGetters('ws', ['sensorDevice']),
		activeModeItem() {
			return this.modes.find( (item, i) => i === this.conditionerMode );
		},
    tempDim () {
      return this.configData.attributes.dim ? `<span>%</span>` : `<span>&deg</span>`;
    },
    selectedPowerLevel () {
      return this.powerlevels[+this.conditioner.powerLevel]?.name
    },
		activeModeName() {
			return this.activeModeItem ? this.activeModeItem.name : this.mode;
		},
		activeModeIcon() {
			return this.activeModeItem ? this.activeModeItem.icon : 'close';
		},
		activePowerName() {
			let item = this.powerlevels.find( item => item.key == +this.conditioner.powerLevel );
			return item ? item.name : this.conditionerMode;
		},
    conditionerMode() {
      return this.modes.length === 1 ? 0 : +this.conditioner.mode
    },

		statusMessage() {
      if (this.activeModeItem) {
        switch (this.activeModeItem.name) {
          case this.$t("Cool"):
            return this.$t('Cooling');
          case this.$t("Dry"):
            return this.$t('Drying');
          case this.$t("Heat"):
            return this.$t('Heating');
          case this.$t("Auto"):
            return this.$t("Ventilation");
          case 4:
            if (this.roomTemp < +this.conditioner.temp) {
              return this.$t("Heating");
            } else if (this.roomTemp > +this.conditioner.temp) {
              return this.$t('Cooling')
            } else {
              return this.$t('Ventilation')
            }
          default: return this.$t('Ventilation');
        }
      } else if (!this.modes.length) {
        return +this.conditioner.isActive ? this.$t('On_1') : this.$t('Off_1')
      }else {
        return this.$t('Ventilation')
      }

		}
	},
	watch: {
    sensorDevice: {
      deep: true,
      handler(val) {
        if (val.addr !== this.addr) return
        const temp = hexToDecimal(val.status, 'conditioner')
        const conditionerData = {
          temp,
          state: val.status,
          isActive: val.status.charAt(1),
          mode: val.status.charAt(0),
          powerLevel: val.status.charAt(9),
          vaneHorMode: val.status.charAt(7),
          vaneVerMode: val.status.charAt(6)
        }
        this.$store.commit('setConditionerData', conditionerData)
      }
    },
		temperature(newVal) {
			if (Math.abs(this.currTemp - newVal) > 0.5) {
				this.currTemp = newVal;
			}
		},
		// currTemp(newVal) {
		// 	if (newVal != this.temperature) this.$emit('changeTemp', newVal);
		// },
		currTemp: debounce(function(newVal) {
			if (newVal != this.temperature) this.$emit('changeTemp', newVal);
		}, 300),
	},
	methods: {
    ...mapActions('modules/settings', ['subscribeRequest']),
		handleKnobChange(value) {
      if (!+this.conditioner.isActive) return
      const dec = Math.abs(value.toFixed()).toString(16);

      const str = this.conditioner.state.split('')

      str[2] = dec[0]
      str[3] = dec[1]
      this.$emit('changeMode', str.join(""));
			this.conditioner.temp = value;
		},
		incrementTemp() {
      let temp
      if (this.conditioner.temp + 1 <= this.maxTemp) {
        let inc = +this.conditioner.temp
        temp = inc += 1;
        const dec = Math.abs(temp.toFixed()).toString(16);

        const str = this.conditioner.state.split('')

        str[2] = dec[0]
        str[3] = dec[1]
        this.$emit('changeMode', str.join(""));
        return temp
      } else {
        temp = this.conditioner.temp = this.maxTemp
        return temp;
      }
		},
		decrementTemp() {
      let temp
      if (this.conditioner.temp - 1 >= this.minTemp) {
        temp = this.conditioner.temp -= 1
        const dec = Math.abs(+temp.toFixed()).toString(16);

        const str = this.conditioner.state.split('')

        str[2] = dec[0]
        str[3] = dec[1]
        this.$emit('changeMode',str.join(""));
        return temp;
      } else {
        temp = this.conditioner.temp = this.minTemp
        return temp;
      }
		},
		handleBtnTouchStart(val) {
      if (!+this.conditioner.isActive) return
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

    async handleToggle() {
      let isActive = +this.conditioner.isActive ? '0' : '1'
      const active = replaceAt(this.conditioner.state, 1, isActive)

      this.$emit('toggle', active)
      const addrs = this.$store.getters.getRoomItems(this.roomId);
      await this.subscribeRequest(addrs.map(addr => addr.attributes.addr))
    },

		selectMode(mode) {
			if (!+this.conditioner.isActive) return false;
      const removed = this.conditioner.state.slice(1);
      this.$emit('changeMode',`${mode}${removed}`);
		},
		cycleModes() {
      if (!+this.conditioner.isActive) return false;

			let index = this.modes.map( item => item.key ).indexOf(this.mode);
			let nextMode = this.modes[(index + 1) % this.modes.length].key;
      const removed = this.conditioner.state.slice(1);
      this.$emit('changeMode',`${nextMode}${removed}`);
		},
		selectPowerlevel(powerlevel) {
      if (!+this.conditioner.isActive) return;
      const status = this.conditioner.state.split('')
      status[9] = powerlevel
			this.$emit('changePower', status.join(''));
		},
		cyclePowerlevels() {
      if (!+this.conditioner.isActive) return;

      const status = this.conditioner.state.split('')
      status[9] = +this.conditioner.state.charAt(9) - 1

			this.$emit('changePower', status.join('') );
		},
		cyclePowerlevelsDec() {
      if (!+this.conditioner.isActive) return;

			const status = this.conditioner.state.split('')
      status[9] = +this.conditioner.state.charAt(9) + 1

			this.$emit('changePower', status.join('') );
		},

		handleVaneHorCycle() {
      if (!+this.conditioner.isActive) return
			this.$emit('cycleVaneHor', this.conditioner.state);
		},
		handleVaneVerCycle() {
      if (!+this.conditioner.isActive) return
			this.$emit('cycleVaneVer', this.conditioner.state);
		},
	},
	components: {
		BtnIcon,
		"app-switch": Switch,
		Knob,

		ModeSelectDropdown
	}
};
</script>

<style lang="less" scoped>

.stepper-title {
	text-align: center;
	font-size: 12px;
	.value {
		display: block;
		font-size: 16px;
		color: @colorMain;
	}
}
.col-mode,
.col-powerlevel {
	flex: 1;
}
.col-powerlevel {
	text-align: right;
}
.col-switch {
	min-width: 72px;
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
		color: #7a7a7a;
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
	z-index: 1;
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
	&.power-stepper {display: none;}
}
.modal-ac {
	margin-top: 24px;
	position: relative;
	z-index: 1;
}
.knob {
	position: relative;
	z-index: 1;
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
}
.device-status {
	transition: .25s;
	&.--hidden {
		opacity: 0;
		transform: translateY(-3px);
	}
}
@media (min-width: @phones) {
	.main-switch {
		display: flex;
		justify-content: center;
		padding-top: 8px;
		align-items: center;
		margin-bottom: 24px;
		.label {margin-right: 8px;}
	}
	.mode-selector {
		display: flex;
		padding: 0 8px;
	}
	.mode-item {
		padding: 8px;
		flex:1;
		font-size: 13px;
		display: flex;
		flex-direction: column;
		align-items: center;
		border-radius: 4px;
		transition: .25s;
		.--disabled & {
			color: #999;
			&.--active {background: #ccc;}
		}
		&.--active {
			background: @colorMain;
			color: #fff;
		}
		.mode-title {margin-top: 6px;}
	}
	.main-controls {
		display: grid;
		grid-template-columns: 1fr 1fr;
		padding: 0 16px;
		// grid-template-rows: auto auto auto;
		// justify-content: space-around;
	}
	.knob {
		margin-left: 0;
		margin-right: 0;
		grid-column-start: 1;
		grid-column-end: 2;
		grid-row-start: 1;
		grid-row-end: 4;
	}
	.buttons-col {
		padding-left: 16px;
		grid-column-start: 2;
		grid-column-end: 3;
		flex-direction: row;
		position: static;
		height: auto;
		align-items: center;
		&.right {
			grid-row-start: 1;
		}
		&.power-stepper {display: flex;}
	}
}
</style>