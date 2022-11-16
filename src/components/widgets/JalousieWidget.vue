<template>
	<WidgetItem
    v-if="jalousie.isActive"
    :addr="addr"
    :name="name"
    :icon="item.__.icon"
    :isActive="+jalousie.isActive.charAt(1)"
    :value="+jalousie.isActive.charAt(1)"
    :stateText="statusMessage[+jalousie.isActive.charAt(1)]"
    class="--no-toggle"
  >
    <transition name="fade" mode="out-in">
      <div class="button-bar"
           v-if="jalousie?.isActive === '04'">
        <Button :label="$t('Open_1')"
                @click.native="handleToggle('01')" />
        <Button :label="$t('Close')"
                @click.native="handleToggle('00')" />
      </div>
      <div class="button-bar" v-else-if="jalousie?.isActive === '00'">
        <Button :label="$t('Open_1')"
                @click.native="handleToggle('01')" />
      </div>
        <div class="button-bar" v-else-if="jalousie?.isActive === '01'">
        <Button :label="$t('Close')"
                @click.native="handleToggle('00')" />
      </div>

      <app-button :label="$t('Stop')"
        v-else
        @click.native="handleToggle('00')" />
    </transition>
	</WidgetItem>
</template>

<script>
import WidgetItem from "@/components/widgets/WidgetItem";
import Button from '@/components/buttons/Button'
import { JALOUSIE_STATES } from '@/utils/consts/consts.js';

import {mapActions, mapGetters} from "vuex";

export default {
	props: {
		name: String,
		addr: String,
		editPermission: {
			type: Boolean,
			default: true
		}
	},
  data: () => ({
    roomId: null,
  }),
  watch: {
    devices: {
      deep: true,
      immediate: true,
      handler(val) {
        if (!val) return
        if (Array.isArray(val)) {
          val.map(item => {
            if (item && this.addr === item.addr) {
              this.$store.commit('setJalousieData', {isActive: item.state, addr: this.addr});
            }
          })
        }
      }
    },
    sensorDevice: {
      deep: true,
      handler(val) {
        if (this.addr === val.addr) {
          this.$store.commit('setJalousieData', {isActive: val.status, addr: this.addr});
        }
      }
    }
  },
  async created() {
    this.roomId = this.$route.params.id
    // const addrs = this.$store.getters.getRoomItems(this.roomId);
    // await this.subscribeRequest(addrs.filter(addr => addr.attributes && addr.attributes.addr).map(addr => addr.attributes.addr))
  },
  computed: {
    ...mapGetters(['jalousie']),
    ...mapGetters('ws', ['sensorDevice', 'devices']),
		item() {
			return this.$store.state.itemMap[this.addr];
    },
    value() {
      return this.item.__.status[0];
    },
		isActive() {
			return (
				this.value == JALOUSIE_STATES.JALOUSIE_CLOSING ||
				this.value == JALOUSIE_STATES.JALOUSIE_OPENING
			);
    },
    statusMessage() {
			return {
				[JALOUSIE_STATES.JALOUSIE_CLOSED]: this.$t('Closed'),
				[JALOUSIE_STATES.JALOUSIE_OPEN]: this.$t('Open_2'),
				[JALOUSIE_STATES.JALOUSIE_CLOSING]: this.$t('Closing'),
				[JALOUSIE_STATES.JALOUSIE_OPENING]: this.$t('Opening'),
				[JALOUSIE_STATES.JALOUSIE_HALFOPEN]: this.$t('Half-open'),
			}
		}
	},
	methods: {
    ...mapActions('modules/settings', ['subscribeRequest']),
		async handleToggle(value) {
      if (!this.checkEditPermission()) return;

      await this.$store.dispatch('setStatus', {
        addr: this.addr,
        status: value
      });
      await this.subscribeRequest(this.addr)
		},

		checkEditPermission() {
      if (!this.editPermission) {
				this.$store.dispatch('modules/alerts/userEditPermissionAlert');
      }

      return this.editPermission;
    }
	},
	components: {
		WidgetItem,
    Button
	},
};
</script>

<style scoped>
.button-bar {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .22s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0.1;
}
</style>