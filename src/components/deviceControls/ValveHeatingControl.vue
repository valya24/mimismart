<template>
	<div class="modal-ac controls-body">
		<div class="main-controls">
			<div class="buttons-col right">
				<BtnIcon icon="icon-plus" class="rounded"
					@touchstart.native="handleBtnTouchStart(1)"
					@touchend.native="handleBtnTouchEnd(1)"
					@contextmenu.native.prevent.capture=""
				/>
				<BtnIcon icon="icon-minus" class="rounded"
					@touchstart.native="handleBtnTouchStart(-1)"
					@touchend.native="handleBtnTouchEnd(-1)"
					@contextmenu.native.prevent.capture=""
				/>
			</div>

			<Knob :min="minTemp" :max="maxTemp"
				:value="currTemp" :secondValue="roomTemp"
				@change="handleKnobChange"
				:disabled="mode == 'Manual' || mode == 'always-off'">
				<div class="indicators hbox alic"
					:class="{ 'on': active }">
					<ModeSelectDropdown
						:modes="visibleModes"
						:activeMode="mode == 'always-off' ? lastActiveMode : mode"
						:valueKey="'name'"
						:modeIcon="modeIcon"
						@selectMode="selectMode"
					/>
				</div>
				<div class="temp-info">
					<transition name="counter" mode="out-in">
						<div class="active-temp" :key="computedTemp">
							{{ computedTemp }}
						</div>
					</transition>
					<div class="room-temp">
						{{ $t("Room temp") }}
						<div>
							{{ Math.round(roomTemp) + '&deg;' }}
						</div>
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
		<div class="controls-footer hbox just-sb">
			<div class="col-mode">
				<div class="label">{{ $t('Mode') }}</div>
				<ModeSelectDropdown :class="{ 'on': active }"
					:modes="visibleModes"
					:activeMode="mode == 'always-off' ? lastActiveMode : mode"
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
				@click="$emit('toggle', !active)">
				<div class="label">{{ active ? $t('On_1') : $t('Off_1') }}</div>
				<app-switch :checked="active" />
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

const holdDelay = 500;
const holdInterval = 350;

export default {
	props: {
		active: Boolean,
		controllerIsActive: Boolean,
		minTemp: {
			type: Number,
			default: 16
		},
		maxTemp: {
			type: Number,
			default: 50
		},
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
		mode: {
			type: String,
			default: 'Off'
		},
		lastActiveMode: {
			type: String,
			default: 'Off'
		},
		powerlevel: Number
	},
	data() {
		return {
			currTemp: this.temperature,
			// roomTemp: 24,
			currPowerlevel: 0,
			currMode: 0,
			showModeSelectModal: false,
			timeout: null,
			interval: null,
		}
	},
	computed: {
		modeIcon() {
      let mode = this.mode == 'always-off' ? this.lastActiveMode : this.mode;
      return this.modes.reduce( (accum, item) => item.name == mode ? accum = item.icon : accum, 'close' )
		},
		visibleModes() {
      return this.modes.filter( item => item.key != 'always-off' );
		},
		computedTemp() {
			return this.mode == 'Manual' || this.mode == 'always-off' || this.currTemp == 128 ? '--' : (Math.round(this.currTemp) + '°');
		},

		statusMessage() {
			return (this.controllerIsActive ? this.$t('Heating in mode') : this.$t('Cooling in mode')) + ' ' + this.$t(this.mode);
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
		}, 2000),
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
      this.$emit('changeMode', mode);
      this.showModeSelectModal = false;
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