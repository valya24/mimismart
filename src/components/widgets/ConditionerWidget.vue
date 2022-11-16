<template>
	<WidgetItem :icon="icon"
		:currentTemp="isNaN(Math.round(roomTemp)) ? undefined : ''+Math.round(roomTemp)"
		:name="name" :addr="addr" :isActive="+conditioner.isActive"
		:value="status[0]"
    :statusMessage="statusMessage"
		@toggle="handleToggle"
		:active-text="statusMessage"
	>
		<ModeSelectDropdown :class="{ '--disabled': !+conditioner.isActive }"
      v-if="modes.length"
			:modes="modes"
			:activeMode="conditioner.mode"
			:valueKey="'key'"
			:emitKey="'key'"
			@selectMode="selectMode"
		/>

		<BtnIcon icon="icon-powerlevel" :disabled="!+conditioner.isActive"
      v-if="modes.length"
      :value="+conditioner.powerLevel"
      @click.native="handlePowerlevelChange" />

    <BtnIcon icon="icon-powerlevel" :disabled="!+conditioner.isActive"
             v-else
             :value="2"/>

		<BtnIcon icon="icon-minus" class="right"
			:disabled="!+conditioner.isActive"
			@touchstart.native="handleBtnTouchStart(-1)"
			@click.native="handleBtnClick(-1)"
			@touchend.native="handleBtnTouchEnd"
			@touchmove.native="handleBtnTouchEnd"
			@contextmenu.native.prevent.capture=""
		/>
		<transition name="counter" mode="out-in">
			<div class="value" :key="currTemp"
				:class="{ '--disabled': !+conditioner.isActive }">
				{{ Math.round(conditioner.temp) }}&deg;
			</div>
		</transition>

		<BtnIcon icon="icon-plus" :disabled="!+conditioner.isActive"
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
import {mapActions, mapGetters} from "vuex";
import {hexToDecimal, replaceAt} from "@/utils/transformers";

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
      roomId: null,
			interval: null,
			timeout: null,
    };
	},
  async mounted() {
    this.roomId = this.$route.params.id
    await this.subscribeRequest(this.addr);
  },
  watch: {
    devices: {
      deep: true,
      immediate: true,
      handler(val) {
        if (!Array.isArray(val) && val.addr === this.addr) {
          const temp = hexToDecimal(val.state, 'conditioner')
          const conditionerData = {
            temp,
            state: val.state,
            isActive: val.state.charAt(1),
            mode: val.state.charAt(0),
            powerLevel: val.state.charAt(9),
            vaneHorMode: val.state.charAt(7),
            vaneVerMode: val.state.charAt(6)
          }

          this.$store.commit('setConditionerData', conditionerData)
        }
      }
    },
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
  },
  computed: {
    ...mapGetters(['conditioner']),
    ...mapGetters('ws', ['sensorDevice', 'devices']),
		controller() {
			return this.$store.state.controllers[this.addr];
		},
		isActive() {
			return this.controller.isActive;
		},
		modes() {
			return this.controller.modes.map( (item, i) => ({ ...item, key: i, name: this.$t(item.name) }) );
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
    activeModeItem() {
      return this.modes.find( item => item.key === +this.conditioner.mode );
    },
    statusMessage() {
      if (this.activeModeItem) {
        switch (this.activeModeItem.key) {
          case 0:
            return this.$t('Ventilation');
          case 2:
            return this.$t('Drying');
          case 1:
            return this.$t('Cooling');
          case 3:
            return this.$t("Heating");
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
      } else {
        return this.$t('Ventilation')
      }

    }
	},
	methods: {
    ...mapActions('modules/settings', ['subscribeRequest']),
		async handleToggle() {
      let isActive = +this.conditioner.isActive ? '0' : '1'
      const active = replaceAt(this.conditioner.state, 1, isActive)

      this.controller.toggle(active)
      const addrs = this.$store.getters.getRoomItems(this.roomId);
      await this.subscribeRequest(addrs.map(addr => addr.attributes.addr))
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
        this.controller.changeMode(str.join(""));
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
    async handlePowerlevelChange() {
      if (!+this.conditioner.isActive) return;
      const status = this.conditioner.state.split('')
      status[9] = (+this.conditioner.powerLevel + 1) % 4
      this.controller.changeMode(status.join(''))

      const addrs = this.$store.getters.getRoomItems(this.roomId);
      await this.subscribeRequest(addrs.map(addr => addr.attributes.addr))
		},
		selectMode(mode) {
      if (!+this.conditioner.isActive) return;
      const removed = this.conditioner.state.slice(1);
      this.controller.changeMode(`${mode}${removed}`);
		},
		
		checkEditPermission() {
      if (!this.editPermission) {
				this.$store.dispatch('modules/alerts/userEditPermissionAlert');
      }

      return this.editPermission;
		},
		
		//	Plus & Minus buttons hold
		handleBtnClick(val) {
      if (!+this.conditioner.isActive) return;
      if (val > 0) {
        this.incrementTemp();
      } else {
        this.decrementTemp();
      }
    },
		handleBtnTouchStart(val) {
      if (!+this.conditioner.isActive) return;
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