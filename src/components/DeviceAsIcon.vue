<template>
	<div class="device-as-icon"
		:class="{ '--system': system, '--touching': touching }"
    v-touch:touchhold="handleHold"
		@click="handleClick"
		@touchstart="handleTouchstart"
		@touchend="handleTouchend"
		@touchmove="touching = false"
	>
		<div class="icon-tile-wrap">
			<div
				class="icon-tile"
				:class="{
					'on': iconIsOn,
					'sensor': sensor,
					'no-value': value == undefined,
					'selected': selected,
					'ignored': state === '02',
					'--ignoring': isYellow
				}"
			>
				<div class="device-address">{{ addr }}</div>
        <div v-if="icon === 'gate'" class="jalousie-gate">
          <icon-comp :iconName="`icon-${icon}`" :value="jalousieOrGate" />
        </div>
        <div v-else-if="icon === 'jalousie120'" class="jalousie-gate">
          <icon-comp :iconName="`icon-${icon}`" :value="jalousieOrGate" />
        </div>
        <div v-else-if="icon === 'plisse'" class="jalousie-gate">
          <icon-comp :iconName="`icon-${icon}`" :value="jalousieOrGate" />
        </div>
				<icon-comp
					:iconName="'icon-'+computedIcon"
					:isOn="iconIsOn"
					:value="value"
          :state="state"
					:ignoring="isYellow"
          :class="{ '--disabled': !sensorData }"
					v-else-if="!isImportScript"
				/>
				<div v-else
					class="icon-text"
					:class="{ '--gray': isImportScript && this.item.__ && this.item.__.commented }"
				>
					{{ sIconText }}
				</div>
				<span class="value"
					v-if="displayValue"
					:class="{
						'--text-value': textValue,
						'--co2': type == 'co2-sensor',
						'--temperature': type == 'temperature-sensor'
					}"
				>
					<transition name="counter-long" mode="out-in">
            <span class="span-value" :key="computedValue" v-html="sensorData ? sensorData : '--'">
            </span>
					</transition>
					<span class="units">{{ units && sensorData ? units : '' }}</span>
				</span>
				<span class="caption">{{ caption }}</span>
				<img src="@/assets/check-cir.svg" class="check" alt />
			</div>
		</div>
		<div class="device-name" v-if="name">
			&nbsp;
			<br />&nbsp;
			<div class="name-holder">{{ name }}</div>
		</div>
	</div>
</template>

<script>
import sensorDeviceInterfaces from "@/utils/sensorDeviceInterfaces.js";

import { hsvToHex, hexToDecimal, replaceAt } from "@/utils/transformers.js";

import {
	JALOUSIE_CLOSING,
	JALOUSIE_OPENING,
	CO2_LEVEL_YELLOW,
	CO2_LEVEL_RED
} from "@/utils/consts/consts.js";

import { ValveHeatingController } from "@/utils/deviceControllers";
import {mapActions, mapGetters} from 'vuex';

export default {
	props: [
		// "isOn",
		"addr",
    "state",
    "idRoom",
		"selected",
		// "system"
		"itemData"
	],
	data() {
		return {
			touching: false,
			holding: false,
			lockTouching: true,
			touchEnded: false,
      isOnDevice: false,
			sIconText: '<s/>',
      activeDevice: null,
      roomId: '0-0',
      sensorData: null,
      jalousieOrGate: ''
		}
	},
  async mounted() {
    this.roomId = this.$route.params.id
    await this.subscribeRequest(this.addr);
    this.checkDoorSensor(this.state)
  },
  destroyed() {
    if (this.addr) {
      // this.stopSubscribeRequest(this.addr);
    }
  },
  watch: {
    addr: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) {
          this.subscribeRequest(this.addr);
        }
      }
    },
    selectedDevice: {
      deep: true,
      handler(val) {
        this.activeDevice = val
      }
    },
    sensorDevice: {
      deep: true,
      handler(val) {
        if (this.addr === val.addr) {
          this.checkDoorSensor(val.status)

          if (this.icon === 'gate') {
            this.jalousieOrGate = val.status

            this.$store.commit('setGateData', {isActive: val.status});
            this.subscribeRequest(this.addr);
          } else if (this.icon === 'jalousie120' || this.icon === 'plisse') {
            this.jalousieOrGate = val.status

            this.$store.commit('setJalousieData', {isActive: val.status, addr: this.addr});
            this.subscribeRequest(this.addr);
          }
        }
      }
    },
    state(val) {
      this.checkDoorSensor(val)
    }
  },
  computed: {
    ...mapGetters(['lamp', 'jalousie', 'gate', 'currentRoomAddrs']),
    ...mapGetters('ws', ['selectedDevice', 'allDevices', 'sensorDevice']),
    //	TODO: Maybe refactor
    watchedSensors() {
      return this.$store.state.modules.watchedSensors.watchedSensorDevices;
    },

		item() {
			return this.$store.state.itemMap[this.addr] ? this.$store.state.itemMap[this.addr] : this.itemData;
		},
		isImportScript() {
			return this.item.name == 'import-script';
		},
		status() {
			return this.item.__ ? this.item.__.status : [];
		},
		icon() {
      if (this.item.__.icon) {
        return this.item.__.icon
      } else if (this.item.attributes.image) {
        return this.item.attributes.image
      } else if (this.item.attributes.type) {
        return this.item.attributes.type
      }else if (this.item.attributes['sub-type']) {
        return this.item.attributes['sub-type']
      }

			return this.item.__ ? this.item.__.icon : '';
		},
    iconIsOn() {
      if (this.itemData.attributes.addr === this.addr) {
        switch (this.icon) {
          case "conditioner":
          case "closing-switch":
          case "rgb-lamp":
          case "air-fan":
          case "convector-fan":
          case "sphere-off":
          case "dimer-lamp":
          case "plisse":
            return this.state?.charAt(1) === '1';
          case "gate":
          case "jalousie120":
          case "framuga-open":
            return this.jalousieOrGate === '01' || this.jalousie.active === '01';
          case "valve":
            return this.state?.charAt(1) !== '8'
          default:
            return this.state === '01'
        }
      } else {
        return this.isOnDevice
      }
			// return this.icon && this.icon.includes('glass-blur') ? !this.isOn : this.isOn;
			// return this.icon && this.icon.includes('dimer-lamp') ? !this.isOnDevice : this.isOnDevice;
      // return this.isOnDevice;
		},
		name() {
			return this.item.attributes.name?.replace(/(\\10|&#10;)/g, '\n');
		},
		type() {
			return this.item.attributes.type || '';
		},
		sensor() {
			return (this.item.attributes.type && this.item.attributes.type.includes('sensor')) || this.item.attributes['sub-type'] === 'sensor'
		},
		system() {
			return this.item.attributes.system == 'yes';
		},

		leakState() {
      switch (this.status[0]) {
        case 0:
          return 'idle';
        case 1:
          return 'wet';
        case 2:
        case 3:
          return 'ignoring';
        default: break;
      }

      return '';
    },
		//	TODO: Maybe refactor
		isOn() {
			if (this.isImportScript) return false;

			if (this.type && this.type.includes("leak-sensor")) {
				return this.leakState == 'wet';
			}

			if (this.type && this.type.includes("co2-sensor")) {
				return this.value >= CO2_LEVEL_RED;
			}

			if (this.item.attributes['sub-type'] && this.item.attributes['sub-type'].includes("text")) return false;

			if (this.type && this.type.includes("sensor")) {
				let watched = this.watchedSensors[this.addr];
				if (watched && watched.enableNotifications) {
					let val = this.value;
					return (
						(watched.watchMin && val < watched.minThreshold) ||
						(watched.watchMax && val > watched.maxThreshold)
					);
				} else {
					return false;
				}
			}

			if (
				this.type &&
				this.type.includes("jalousie") ||
				(this.item.attributes["sub-type"] && this.item.attributes["sub-type"].includes("jalousie"))
			)
				return (
					this.status[0] == JALOUSIE_CLOSING ||
					this.status[0] == JALOUSIE_OPENING
				);

			return this.status[0];
		},
		
		value() {
			if (this.isImportScript) {
				return 0;
			}
			//	TODO: maybe refactor this
			if (this.item.attributes.type == "rgb-lamp") {
				return hsvToHex({
					h: (this.item.__.status[3] * 360) / 250,
					s: (this.item.__.status[2] * 100) / 250,
					v: this.item.__.status[1]
				});
			}


			return sensorDeviceInterfaces[this.item.attributes.type] &&
				sensorDeviceInterfaces[this.item.attributes.type].value
				? sensorDeviceInterfaces[this.item.attributes.type].value(this.status)
				: this.status[0];
		},
		//	TODO: Refactor probably
		caption() {
			let caption = '';

			if (this.item.attributes.type == 'valve-heating') {
        let controller = new ValveHeatingController({
          addr: this.addr,
          status: this.state,
          item: this.item
        });
        this.$store.commit('saveController', controller);
				if (controller.mode) {
					caption = this.$t(controller.mode);
				}
			}

			return caption;
		},
		units() {
      if (this.item?.attributes.dim) {
        return this.item.attributes.dim
      }
			return sensorDeviceInterfaces[this.item.attributes.type] &&
				sensorDeviceInterfaces[this.item.attributes.type].units
				? sensorDeviceInterfaces[this.item.attributes.type].units
				: "";
		},
		hideValue() {
			return sensorDeviceInterfaces[this.item.attributes.type] ? sensorDeviceInterfaces[this.item.attributes.type].hideValue : false
		},
		textValue() {
			return ["leak-sensor", "door-sensor"].includes(this.type);
		},
		computedIcon() {
			let icon = this.icon;
			if (icon == "leak") {
				switch (this.state) {
					case '01':
						return 'leak-maintenance';
					case '00':
						return 'leak-dry';
					case '02':
						return 'leak-wet';
					default:
            return 'leak-dry';
				}
			}
			if (icon == "door") {
				return +this.value > 0 ? "door-open" : "door";
			}

      if (this.item.attributes['sub-type'] && this.item.attributes['sub-type'] === 'sensor') {
        return 'other-devices'
      }
			return icon;
		},
		computedValue() {
			let val = this.value;
			if (this.item.attributes.text) {
				let texts = this.item.attributes?.text.split(';');

				return val > 0 ? texts[1] : texts[0];
			}
			if (this.type == "leak-sensor") {
				return this.isOn ? this.$t("Water") : this.$t("Dry_2");
			}
			if (this.type == "door-sensor") {
				return val > 0 ? this.$t("Open_2") : this.$t("Closed");
			}
			return val;
		},
		displayValue() {
			return this.sensor && !this.hideValue;
		},

		isYellow() {
			return (this.type.includes('leak-sensor') && this.leakState == 'ignoring') ||
				(this.type.includes("co2-sensor") && this.value >= CO2_LEVEL_YELLOW && this.value < CO2_LEVEL_RED);
		}
	},
	methods: {
    ...mapActions('modules/settings', ['subscribeRequest', 'stopSubscribeRequest']),
    checkDoorSensor (value) {
      if(this.item.__.icon === 'door') {
        const texts = this.item.attributes.text?.split(';')
        if (this.state === '00' ) {
          this.sensorData = this.item.attributes.text ? texts[0] : 'Закрыто'
        } else if(this.state === '01' ){
          this.sensorData = this.item.attributes.text ? texts[1] : 'Открыто'
        } else {
          this.sensorData = ''
        }

      } else {
        this.jalousieOrGate = value
        this.sensorData = hexToDecimal(value, this.icon)
      }
    },
		async handleClick() {
      console.log(this.state, this.item)

      switch (this.item.__.icon) {
        case "conditioner":
        case "dimer-lamp":
        case "closing-switch":
        case "convector-fan":
        case "light-scheme":
        case "rgb-lamp":
        case "gate":
        case "plisse":
        case "air-fan":
        case "sphere-off":
        case "jalousie120":
        case "framuga-open":
        case "valve-heating":
          // eslint-disable-next-line no-case-declarations
          let isActive = +this.state.charAt(1) ? '0' : '1';
          // eslint-disable-next-line no-case-declarations
          const active = replaceAt(this.state, 1, isActive);
          await this.$store.dispatch('setStatus', {
            addr: this.addr,
            status: active
          })
          break;
        case "valve":
          switch (this.state) {
            case '08':
              await this.$store.dispatch('setStatus', {
                addr: this.addr,
                status: '01'
              });
              break;
            case '09':
              await this.$store.dispatch('setStatus', {
                addr: this.addr,
                status: '00'
              });
              break
            default:
              // eslint-disable-next-line no-case-declarations
              let status
              if (this.state === '00') {
                status = 1
                this.isOnDevice = false
              } else if (this.state === '01') {
                this.isOnDevice = true
                status = 0
              }
              await this.$emit('change', {
                ...this.itemData,
                addr: this.addr,
                isOn: status || '00'
              });
          }
          break;
        default:
          // eslint-disable-next-line no-case-declarations
          let status
          if (this.state === '00') {
            status = 1
            this.isOnDevice = false
          } else if (this.state === '01') {
            this.isOnDevice = true
            status = 0
          }
          await this.$emit('change', {
            ...this.itemData,
            addr: this.addr,
            isOn: status || '00'
          });
      }

      // let addrs;
      // if (this.roomId) {
      //   addrs = this.$store.getters.getRoomItems(this.roomId);
      // } else {
      //   addrs = this.$store.getters.getRoomItems(this.idRoom);
      // }
      await this.subscribeRequest(this.currentRoomAddrs)
    },
		handleTouchstart() {
			this.touchEnded = false;
			this.holding = false;
			this.touching = true;
			this.lockTouching = true;
			setTimeout(() => {
				if (this.touchEnded) {
					this.touching = false;
					this.lockTouching = false;
				}
			}, 135);
		},
		handleTouchend() {
			this.touchEnded = true;
			// if (!this.holding) {
			// 	this.$emit('change', { addr: this.addr, isOn: !this.isOn });
			// }
			if (!this.lockTouching) {
				this.touching = false;
			}
		},
		handleHold() {
      switch (this.icon) {
        case "jalousie120":
        case "framuga-open":
          this.$store.commit('setJalousieData', {isActive: this.jalousieOrGate, addr: this.addr});
          break;
        case "gate":
          this.$store.commit('setGateData', {isActive: this.state});
          break;
        case "conditioner":
          // eslint-disable-next-line no-case-declarations
          const temp = hexToDecimal(this.state)
          // eslint-disable-next-line no-case-declarations
          const conditionerData = {
            temp,
            state: this.state,
            isActive: this.state.charAt(1),
            mode: this.state.charAt(0),
            powerLevel: this.state.charAt(9),
            vaneHorMode: this.state.charAt(7),
            vaneVerMode: this.state.charAt(6)
          };
          this.$store.commit('setConditionerData', conditionerData)
          break;
        case "lamp":
        case "pump":
        case "meter":
        case "leak":
        case "camera":
        case "script":
        case "swing":
        case "plisse":
        case "convector-floor":
        case "sphere-on":
          this.$store.commit('setLampData', {isActive: this.state});
          break;
        case "valve-heating":
          // eslint-disable-next-line no-case-declarations
          const valveHeatingData = {
            state: this.state,
            mode: this.state.charAt(0),
            active: this.state.slice(1, 2),
            temp: +hexToDecimal(this.state.slice(2, 6)),
            roomTemp: +hexToDecimal(this.state.slice(6, 10)),
          };
          this.$store.commit('setValveHeatingData', valveHeatingData);
          break;
        case "dimer-lamp":
        case "sphere-off":
        case "closing-switch":
        case "convector-fan":
          // eslint-disable-next-line no-case-declarations
          const dimmerLampData = {
            addr: this.addr,
            active: this.state.slice(1, 2),
            bright: Math.ceil(hexToDecimal(`00${this.state.slice(2, 4)}`, this.icon))
          };
          this.$store.commit('setDimmerLampData', dimmerLampData);
          break;
        case "rgb-lamp":
          // eslint-disable-next-line no-case-declarations
          const rgbLampData = {
            active: this.state.slice(1, 2),
            bright: Math.ceil(hexToDecimal(`00${this.state.slice(2, 4)}`, this.icon)),
            state: this.state
          };
          this.$store.commit('setRgbLampData', rgbLampData);
          break;
        case "valve":
          switch (this.state) {
            case '08':
              this.$store.commit('setValveData', { status: '08' });
              break;
            case '09':
              this.$store.commit('setValveData', { status: '09' });
              break
            default:
              // eslint-disable-next-line no-case-declarations
              let status
              if (this.state === '00') {
                status = 1
                this.isOnDevice = false
              } else if (this.state === '01') {
                this.isOnDevice = true
                status = 0
              }

              this.$store.commit('setValveData', { status: `0${status}` });
          }
          break;
        default:
          break
      }

			this.$emit('touchhold');
      this.subscribeRequest(this.addr)
			this.touching = false;
			this.holding = true;
		},
	}
};
</script>

<style lang="less" scoped>
.device-as-icon {
  .ignored {
    //background: #FEFFC9!important;

    .span-value {
      color: #535050;
    }
  }
  .icon-tile .icon-holder {
    width: 50px;
  }

  .jalousie-gate {
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.counter-long-enter-active, .counter-long-leave-active {
  transition: .15s;
}
.counter-long-enter {
	opacity: 0;
	transform: translateY(-15%);
}
.counter-long-enter-to {
	opacity: 1;
	transform: translateY(0);
}
.counter-long-leave-to {
	opacity: 0;
	transform: translateY(15%);
}
.span-value {
  text-align: center;
	display: inline-block;
	margin-right: 3px;
}


.icon-text {
	font-weight: 700;
	font-size: 22px;
	&.--gray {
		color: #aaa;
	}
}
.device-as-icon {
	position: relative;
	z-index: 1;
	cursor: pointer;
	// transition: .25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
	transition: .2s cubic-bezier(.47,-0.67,.39,1.68);
	&:active {
		.icon-tile {
			background: @colorBtnActive;
		}
	}
	&:hover {
		// animation: shake 0.25s linear infinite;
	}
	&.--system .device-address {
		background-color: darken(@colorRedDark, 3%);
	}
	&.--touching {
		transform: scale(0.87);
	}
}
.icon-tile-wrap {
	padding-top: 100%;
	position: relative;
}
.icon-tile {
	background: @tileNormalBg;
	border-radius: @tileRadius;
	display: flex;
	align-items: center;
	justify-content: center;
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	color: @colorMain;
	box-shadow: @tileShadow;
	.check {
		position: absolute;
		bottom: -6px;
		left: -6px;
		z-index: 2;
		width: 16px;
		display: none;
	}
	&.selected .check {
		display: block;
	}
	.icon-holder {
		width: @tileIconHeight;
		height: @tileIconHeight;
	}
	&::before {
		content: "";
		border-radius: inherit;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background: @tileActiveBg;
		transition: opacity @defaultTrsTime;
		opacity: 0;
	}
	.caption {
		position: absolute;
		left: 0;
		bottom: 4px;
		width: 100%;
		text-align: center;
		font-size: 12px;
		font-weight: 700;
	}
	&.on {
		&::before {
			opacity: 1;
		}
		.value, .caption {
			color: #fff;
		}
	}
	&.sensor {
		flex-direction: column;
		border-radius: @sensorTileRadius;
		font-size: @sensorValueTextSize;
		font-weight: bold;
		color: @sensorValueTextColor;
		.value {
			position: relative;
			margin-top: 4px;
			white-space: nowrap;
			&.--text-value {
				font-weight: 500;
				font-size: 0.75em;
				letter-spacing: -0.02em;
				color: #222;
			}
			&.--co2 {
				font-size: 14px;
				letter-spacing: -0.03em;
				.units {
					font-size: 11px;
					margin-left: -2px;
					letter-spacing: normal;
				}
			}
			&.--temperature .units {
				font-size: 16px;
				margin-left: -3px;
			}
		}
		.icon-holder {
			width: @sensorIconSize;
			height: @sensorIconSize;
		}
		&.no-value {
			.icon-holder {
				width: @tileIconHeight;
				height: @tileIconHeight;
			}
		}
		.units {
			font-weight: @sensorValueUnitsWeight;
			font-size: @sensorValueUnitsSize;
		}
		&::before {
			background: linear-gradient(135deg, #ff7253 13.46%, #f57d92 84.13%),
				#ffffff;
		}
	}
	&.selected {
		&::after {
			content: "";
			border-radius: inherit;
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			box-shadow: inset 0px 0px 5px #00d348, inset 0px 0px 5px #00d348,
				inset 0px 0px 5px #00d348;
		}
	}
	&.--ignoring {
		background-color: #FEFFCF;
	}
}
.device-name {
	text-align: center;
	margin-top: @deviceNameTopMargin;
	position: relative;
	z-index: 1;
}
.name-holder {
	position: absolute;
	top: 0;
	font-size: @deviceNameTextSize;
	line-height: 1.2;
	width: @deviceNameHolderWidth;
	left: 50%;
	margin-left: -@deviceNameHolderWidth / 2;
	white-space: pre-line;
	overflow: hidden;
	max-height: 2.4em;
	text-overflow: ellipsis;
}

@media (min-width: @phones) {
	.name-holder {
		width: 148px;
		margin-left: -148/2px;
		font-size: 16px;
	}
	.icon-tile .caption {
		bottom: 9px;
		font-size: 14px;
	}
}
@media screen and (min-width: @tablets-landscape + 2px) {
	.icon-tile .caption {
		bottom: 12px;
		font-size: 18px;
	}
}
</style>