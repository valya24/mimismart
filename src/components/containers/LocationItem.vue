<template>
  <div class="location-item">
    <div class="location-head hbox alic just-sb"
      v-if="title && title.length || toggleTitle && toggleTitle.length">
      <div class="col-title" v-if="title && title.length">{{ title }}</div>
      <div class="col-toggle" v-if="type == 'shades' || toggleTitle && toggleTitle.length">
        <!-- TODO: Maybe refactor this -->
        <app-button v-if="type != 'shades'"
          :icon="toggleButtonIcon" class="small" :label="toggleTitle"
          @click.native="toggleAll" />

        <!-- Shades -->
        <app-button v-if="type == 'shades'"
          :icon="toggleButtonIcon" class="small" :label="$t('Close all')"
          @click.native="closeAll" />
        <app-button v-if="type == 'shades'"
          :icon="toggleButtonIcon" class="small" :label="$t('Open all')"
          @click.native="openAll" />
        <!-- ======= -->
      </div>
    </div>
    <!-- TODO: Needs refactoring -->
    <div class="grid-icons" v-if="widgets && widgets.length"
      :class="{ '--last': !widgetsOnTop }">
      <WidgetManager v-for="(item, i) in widgets"
        :key="item.attributes.name + item.attributes.addr + i"
        :type="item.attributes.type"
        :name="item.attributes.name"
        :addr="item.attributes.addr"
        @callControlApp="handleDeviceTouchHold(item)"

        :editPermission="getItemEditPermission(item)"
      />
    </div>
    <div class="grid-icons" v-if="items && items.length">
      <device-as-icon v-for="(item, i) in items"
        :key="item.attributes.name + item.attributes.addr + i"
        :addr="item.attributes.addr"
        :state="addrState[item.attributes.addr]"
        :itemData="item"

        @change="handleDeviceClick"
        @touchhold="handleDeviceTouchHold(item)"
      />
    </div>
  </div>
</template>

<script>
import { JALOUSIE_CLOSING, JALOUSIE_OPENING } from '@/utils/consts/consts.js';
import { numberToByteString } from "@/utils/transformers.js";

import WidgetManager from "@/components/widgets/WidgetManager.vue";

import { ValveHeatingController } from "@/utils/deviceControllers";

import { mapGetters } from 'vuex';

export default {
  props: {
    title: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: ''
    },
    toggleTitle: {
      type: String,
      default: ''
    },
    toggleButtonIcon: {
      type: String,
      default: ''
    },
    items: {
      type: Array,
      default() { return []; }
    },
    widgets: {
      type: Array,
      default() { return []; }
    },
    widgetsOnTop: {
      type: Boolean,
      default: false
    },

    roomData: {
      type: Object
    }
  },
  data() {
    return {
      allItems: [],
      addrState: null,
			activeItem: { attributes: {} },
      allDevices: null,
      passwordPassed: false,
      showPasswordModal: false,
      checkPasswordPromise: null,
      resolvePasswordPromise: null,
      passedItems: []
    }
  },
  watch: {
    devices: {
      deep: true,
      handler(val) {
        if (val) {
          this.allDevices = val

          this.items.map(item => {
            val.map(device => {
              if (device && item.attributes.addr === device.addr) {
                this.allItems.push({[device.addr]: device.state})
              }
            })
          })

          this.addrState = Object.assign({}, ...this.allItems);
        }
      }
    }
  },
  computed: {
    ...mapGetters('ws', ['devices']),
    user() {
      return this.$store.state.modules.settings.user;
    }
  },
  methods: {
		//	TODO: Move this logic into DeviceAsIcon component

    getDeviceOnStatus(item) {
			if (item.type.includes("leak-sensor")) return Boolean(item.__.status[0]);
			
			if (item.type.includes("sensor")) {
				let watched = this.watchedSensors[item.addr];
				if (watched && watched.enableNotifications) {
					let val = this.getDeviceValue(item);
					return ((watched.watchMin && val < watched.minThreshold) ||
									(watched.watchMax && val > watched.maxThreshold))
				} else {
					return false;
				}
			}

			if (item.type.includes("jalousie") || (item['sub-type'] && item['sub-type'].includes("jalousie")))
				return (item.__.status[0] == JALOUSIE_CLOSING) ||
								(item.__.status[0] == JALOUSIE_OPENING);

			return item.__.status[0];
    },
    async handleDeviceClick(payload) {
      if (payload.name == 'import-script') {
        this.handleDeviceTouchHold(payload);
        return;
      }
			let value = payload.isOn;

      let item = this.$store.state.itemMap[payload.addr];
      this.$set(this, 'activeItem', item);

      if (!this.getItemEditPermission(item)) {
				this.$store.dispatch('modules/alerts/userEditPermissionAlert');
				return;
      }

      let passwordState = await this.checkPassword(item);
      if (!passwordState) {
        return;
      }
      
			if (item.attributes.type.includes('sensor') || (item.attributes['sub-type'] && item.attributes['sub-type'].includes('sensor')) ||
				item.attributes['sub-type'] == 'text' || item.attributes['sub-type'] == 'long-text') {
				this.handleDeviceTouchHold(item);
				return;
			}
			// if (item.attributes.type.includes("sensor")) return false;

			// let isOn = this.getDeviceOnStatus(item);


			//	TODO: REFACTOR THIS!
			if (item.attributes.type == 'valve-heating') {
				let controller = this.$store.state.controllers[payload.addr];
				if (!controller) {
					controller = new ValveHeatingController({
						addr: payload.addr,
						status: item.__.status,
						item: item
					});
					this.$store.commit('saveController', controller);
				}

				controller.toggle();
				return;
			}
			
			if (
				['jalousie', 'gate', 'jalousie120', 'gate120'].includes(item.attributes.type) ||
				['jalousie', 'gate', 'jalousie120', 'gate120'].includes(item.attributes['sub-type'])
			) {
				let status = item.__.status[0];
				if (status == 1 || status == 4) {
					value = 0;
				} else {
					value = 1;
				}
			}

			this.$store.dispatch('setStatus', {
        addr: payload.addr,
				status: numberToByteString(value)
      })
		},
    async handleDeviceTouchHold(item) {
      // return () => {
        if (!this.getItemEditPermission(item)) {
          this.$store.dispatch('modules/alerts/userEditPermissionAlert');
          return;
        }

        let passwordState = await this.checkPassword(item);
        if (!passwordState) {
          return;
        }
      
        this.$emit('callControlApp', item);
      // }
    },

    getItemEditPermission(item) {
			let viewBool = false;

			if (item.__ && item.__.permissions) {
        viewBool = item.__.permissions['*'].edit;
  
        if (this.user.key) {
          viewBool = viewBool || item.__.permissions[this.user.key].edit;
        }
			} else if (this.roomData && this.roomData.__.permissions) {
        viewBool = this.roomData.__.permissions['*'].edit;
  
        if (this.user.key) {
          viewBool = viewBool || this.roomData.__.permissions[this.user.key].edit;
        }
			} else {
				viewBool = true;
			}

			return viewBool;
		},
    toggleAll() {
      this.items.concat(this.widgets).forEach( item => {
        if (!this.getItemEditPermission(item)) return;

        this.$store.dispatch('setStatus', {
          addr: item.attributes.addr,
          status: numberToByteString(0)
        })
      })
    },

    closeAll() {
      this.items.concat(this.widgets).forEach( item => {
        if (!this.getItemEditPermission(item)) return;

        if (this.$store.state.itemMap[item.attributes.addr].__.status[0] == JALOUSIE_OPENING) {
          this.$store.dispatch('setStatus', {
            addr: item.attributes.addr,
            status: numberToByteString(0)
          })
        }

        if (this.$store.state.itemMap[item.attributes.addr].__.status[0] != JALOUSIE_CLOSING) {
          setTimeout(() => {
            this.$store.dispatch('setStatus', {
              addr: item.attributes.addr,
              status: numberToByteString(0)
            })
          }, 250)
        }
      })
    },
    openAll() {
      this.items.concat(this.widgets).forEach( (item) => {
        if (!this.getItemEditPermission(item)) return;
        if (this.$store.state.itemMap[item.attributes.addr].__.status[0] == JALOUSIE_CLOSING) {
          this.$store.dispatch('setStatus', {
            addr: item.attributes.addr,
            status: numberToByteString(1)
          })
        }

        if (this.$store.state.itemMap[item.attributes.addr].__.status[0] != JALOUSIE_OPENING) {
          setTimeout(() => {
            this.$store.dispatch('setStatus', {
              addr: item.attributes.addr,
              status: numberToByteString(1)
            })
          }, 250)
        }
      })
    },

    checkPassword(item) {
      if (
        !item.attributes.password ||
        !item.attributes.password.length
      ) {
        return Promise.resolve(true);
      }
      
      return this.$store.dispatch('modules/singleAction/checkPassword', item);
    },
  },
  components: {
    WidgetManager,
  }
}
</script>

<style lang="less" scoped>
.location-item {
	margin-bottom: 24px;
	display: flex;
	flex-direction: column;
	.grid-icons {
		margin: 0 16px;
		margin-top: 16px;
		&.--last {
			order: 10;
		}
	}
}
.location-head {
	padding: 16px 16px 0 16px;
}
.col-empty {
	width: @btnHeight;
	height: @btnHeight;
	margin-right: -8px;
}
.col-back {
	margin-left: -8px;
}
.col-toggle {
  display: flex;
  & > * {
    margin-right: 10px;
    &:last-of-type {
      margin-right: 0;
    }
  }
}
</style>