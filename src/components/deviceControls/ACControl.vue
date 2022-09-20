<template>
	<div class="modal-ac controls-body" :class="{ 'on': active, '--disabled': !active }">
		<div class="main-switch tablets-only"
			@click="$emit('toggle', !active)">
			<div class="label">{{ active ? $t('On_1') : $t('Off_1') }}</div>
			<app-switch :checked="active" />
		</div>
		<div class="main-controls">
			<div class="buttons-col right">
				<BtnIcon icon="icon-plus" class="rounded"
					@touchstart.native="handleBtnTouchStart(1)"
					@touchend.native="handleBtnTouchEnd"
					@contextmenu.native.prevent.capture=""
				/>

				<span class="stepper-title tablets-only">{{ $t('Temperature') }}</span>

				<BtnIcon icon="icon-minus" class="rounded"
					@touchstart.native="handleBtnTouchStart(-1)"
					@touchend.native="handleBtnTouchEnd"
					@contextmenu.native.prevent.capture=""
				/>
			</div>
			<div class="buttons-col left">
				<BtnIcon icon="icon-swing-horiz" class="rounded"
					v-if="vaneHorModes && vaneHorModes.length"
					:value="vaneHor" @click.native="handleVaneHorCycle" />

				<span class="stepper-title tablets-only">{{ $t('Lamels') }}</span>

				<BtnIcon icon="icon-swing" class="rounded"
					v-if="vaneVerModes && vaneVerModes.length"
					:value="vaneVer" @click.native="handleVaneVerCycle" />
			</div>
			<div class="buttons-col power-stepper tablets-only">
				<BtnIcon icon="icon-back" class="rounded" @click.native="cyclePowerlevelsDec" />

				<span class="stepper-title tablets-only">
					{{ $t('Power level') }}
					<span class="value">{{ activePowerName }}</span>
				</span>

				<BtnIcon icon="icon-back" class="rounded flip-x" @click.native="cyclePowerlevels" />
			</div>

			<Knob :disabled="!active"
				:min="minTemp" :max="maxTemp"
				:value="currTemp" :secondValue="roomTemp"
				@change="handleKnobChange">
				<div class="indicators hbox alic">
					<BtnIcon :icon="'icon-' + activeModeIcon" @click.native="cycleModes" />
					
					<BtnIcon icon="icon-powerlevel" :value="powerlevel" @click.native="cyclePowerlevels" />
				</div>
				<div class="temp-info">
					<transition name="counter" mode="out-in">
						<div class="active-temp" :key="Math.round(currTemp)">
							{{ Math.round(currTemp) }}&deg;
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
			:class="{ '--hidden': !active }">
			<div class="device-status-title">
				{{ statusMessage }}
			</div>
		</div>
		<div class="mode-selector tablets-only">
			<div class="mode-item"
				v-for="mode in modes" :key="mode.key"
				:class="{ '--active': activeModeName == mode.name }"
				@click="selectMode(mode.key)"
			>
				<div class="mode-icon">
					<icon-comp :iconName="`icon-${mode.icon}`" />
				</div>
				<div class="mode-title">{{ mode.name }}</div>
			</div>
		</div>
		<div class="controls-footer hbox just-sb tablets-hide">
			<div class="col-mode">
				<div class="label">{{ $t('Mode') }}</div>

				<ModeSelectDropdown :class="{ 'on': active }"
					:modes="modes"
					:activeMode="activeModeName"
					:valueKey="'name'"
					:emitKey="'key'"
					:showActiveTitle="true"
					@selectMode="selectMode"
				/>
			</div>

			<div class="col-switch vbox alic"
				@click="$emit('toggle', !active)">
				<div class="label">{{ active ? $t('On_1') : $t('Off_1') }}</div>
				<app-switch :checked="active" />
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

import { debounce } from "@/utils/functions.js";

import ModeSelectDropdown from "@/components/etc/ModeSelectDropdown"

const holdDelay = 500;
const holdInterval = 350;

export default {
	props: {
		active: Boolean,
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
		}
	},
	computed: {
		activeModeItem() {
			return this.modes.find( item => item.key == this.mode );
		},
		activeModeName() {
			return this.activeModeItem ? this.activeModeItem.name : this.mode;
		},
		activeModeIcon() {
			return this.activeModeItem ? this.activeModeItem.icon : 'close';
		},
		activePowerName() {
			let item = this.powerlevels.find( item => item.key == this.powerlevel );
			return item ? item.name : this.powerlevel;
		},

		statusMessage() {
			switch (this.activeModeItem.key) {
				case 0:
					return this.$t('Ventilation');
				case 2:
					return this.$t('Drying');
				case 1:
					return (this.roomTemp > this.currTemp) ? this.$t('Cooling') : this.$t('Ventilation');
				case 3:
					return (this.roomTemp < this.currTemp) ? this.$t("Heating") : this.$t('Ventilation');
				case 4:
					if (this.roomTemp < this.currTemp) {
						return this.$t("Heating");
					} else if (this.roomTemp > this.currTemp) {
						return this.$t('Cooling')
					} else {
						return this.$t('Ventilation')
					}
				default: return this.$t('Ventilation');
			}
		}
	},
	watch: {
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
		handleKnobChange(value) {
			this.currTemp = value;
		},
		incrementTemp() {
			if (this.currTemp + 1 <= this.maxTemp) {
				return this.currTemp += 1;
			} else {
				return this.currTemp = this.maxTemp;
			}
		},
		decrementTemp() {
			if (this.currTemp - 1 >= this.minTemp) {
				return this.currTemp -= 1;
			} else {
				return this.currTemp = this.minTemp;
			}
		},
		handleBtnTouchStart(val) {
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

		selectMode(mode) {
			if (!this.modes || this.modes.length <= 1) return false;

			this.$emit('changeMode', mode);
		},
		cycleModes() {
			if (!this.modes || this.modes.length <= 1) return false;

			let index = this.modes.map( item => item.key ).indexOf(this.mode);
			let nextMode = this.modes[(index + 1) % this.modes.length].key;
			this.$emit('changeMode', nextMode);
		},
		selectPowerlevel(powerlevel) {
			if (!this.powerlevels || this.powerlevels.length <= 1) return false;
			this.$emit('changePower', powerlevel);
		},
		cyclePowerlevels() {
			if (!this.powerlevels || this.powerlevels.length <= 1) return false;

			let index = this.powerlevels.map( item => item.key ).indexOf(this.powerlevel);
			let nextPower = this.powerlevels[(index + 1) % this.powerlevels.length].key;
			this.$emit('changePower', nextPower );
		},
		cyclePowerlevelsDec() {
			if (!this.powerlevels || this.powerlevels.length <= 1) return false;

			let index = this.powerlevels.map( item => item.key ).indexOf(this.powerlevel);
			let newIdx = index > 0 ? (index - 1) : this.powerlevels.length - 1;
			let nextPower = this.powerlevels[newIdx].key;
			this.$emit('changePower', nextPower );
		},

		handleVaneHorCycle() {
			this.$emit('cycleVaneHor');
		},
		handleVaneVerCycle() {
			this.$emit('cycleVaneVer');
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