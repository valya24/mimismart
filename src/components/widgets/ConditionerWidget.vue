<template>
	<WidgetItem :icon="icon"
		:currentTemp="isNaN(Math.round(roomTemp)) ? undefined : ''+Math.round(roomTemp)"
		:name="name" :addr="addr" :isActive="isActive"
		:value="status[0]"
		@toggle="handleToggle"
		:active-text="statusMessage"
	>
		<ModeSelectDropdown :class="{ '--disabled': !isActive }"
			:modes="modes"
			:activeMode="controller.mode"
			:valueKey="'key'"
			:emitKey="'key'"
			@selectMode="selectMode"
		/>

		<BtnIcon icon="icon-powerlevel" :disabled="!isActive"
      :value="controller.powerlevel"
      @click.native="handlePowerlevelChange" />

		<BtnIcon icon="icon-minus" class="right"
			:disabled="!isActive"
			@touchstart.native="handleBtnTouchStart(-1)"
			@click.native="handleBtnClick(-1)"
			@touchend.native="handleBtnTouchEnd"
			@touchmove.native="handleBtnTouchEnd"
			@contextmenu.native.prevent.capture=""
		/>
		<transition name="counter" mode="out-in">
			<div class="value" :key="currTemp"
				:class="{ '--disabled': !isActive }">
				{{ currTemp }}&deg;
			</div>
		</transition>

		<BtnIcon icon="icon-plus" :disabled="!isActive"
			@touchstart.native="handleBtnTouchStart(1)"
			@click.native="handleBtnClick(1)"
			@touchend.native="handleBtnTouchEnd"
			@touchmove.native="handleBtnTouchEnd"
			@contextmenu.native.prevent.capture=""
		/>
	</WidgetItem>
</template>

<script>
import WidgetItem from "@/components/widgets/WidgetItem";
import ModeSelectDropdown from "@/components/etc/ModeSelectDropdown"

import { ConditionerController } from "@/utils/deviceControllers";

const MIN_TEMP = 16;
const TEMP_DELTA = 16;

const modesIcons = ['icon-fan', 'icon-snowflake', 'icon-humidity', 'icon-hot', 'icon-auto']

const holdDelay = 500;
const holdInterval = 350;


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
			modesIcons,
			
			interval: null,
			timeout: null,
    };
	},
	computed: {
		controller() {
			return this.$store.state.controllers[this.addr];
		},
		isActive() {
			return this.controller.isActive;
		},
		modes() {
			return this.controller.modes.map( item => ({ ...item, name: this.$t(item.name) }) );
		},
		// activeMode() {
		// 	return this.controller.mode;
		// },
		status() {
			return this.$store.state.itemMap[this.addr].__.status;
		},
		device() {
			return this.$store.state.itemMap[this.addr];
		},
    icon() {
      return this.device.__.icon;
    },
		minTemp() {
			return parseInt(this.device["t-min"]) || MIN_TEMP;
		},
		deltaTemp() {
			return parseInt(this.device["t-delta"]) || TEMP_DELTA;
		},
		maxTemp() {
			return this.minTemp + this.deltaTemp;
		},
		currTemp() {
			return this.minTemp + this.status[1];
		},
		roomTemp() {
			return this.controller.roomTemp
		},
    currentModeIcon() {
      return this.modesIcons[Number(this.controller.mode)];
		},
		
		statusMessage() {
			switch (this.controller.mode) {
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
	methods: {
		handleToggle(value) {
      if (!this.checkEditPermission()) return;

			if (value == undefined) {
				value = !this.isActive;
			}
			return this.controller.toggle(value);
		},
		incrementTemp() {
      if (!this.checkEditPermission()) return;

			let temp = (this.currTemp + 1 <= this.maxTemp) ? this.currTemp + 1 : this.maxTemp;
			this.controller.changeTemp(temp);
		},
		decrementTemp() {
      if (!this.checkEditPermission()) return;

			let temp = (this.currTemp - 1 >= this.minTemp) ? this.currTemp - 1 : this.minTemp;
			this.controller.changeTemp(temp);
    },
    handlePowerlevelChange() {
      if (!this.checkEditPermission()) return;

      this.controller.changePower((this.controller.powerlevel + 1) % 4);
		},
		selectMode(mode) {
      if (!this.checkEditPermission()) return;

      this.controller.changeMode(mode);
		},
		
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
			this.$store.commit(
				"saveController",
				new ConditionerController({
					addr: this.addr,
          status: this.status,
          minTemp: this.minTemp,
          maxTemp: this.maxTemp,
				})
			);
		}
	},
	components: {
		WidgetItem,
		ModeSelectDropdown
	}
};
</script>

<style lang="less" scoped>
// Kostyl
.value {
	display: flex;
	flex-direction: column;
	justify-content: center;
	color: @colorMain;
	font-size: 20px;
	font-weight: 500;
	text-align: center;
	transition: .25s;
}
		
.value.--disabled {
	color: #c4c4c4;
}
</style>