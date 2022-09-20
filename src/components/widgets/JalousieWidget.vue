<template>
	<WidgetItem
    :addr="addr"
    :name="name"
    :icon="item.__.icon"
    :isActive="isActive"
    :value="value"
    :stateText="statusMessage[value]"
    class="--no-toggle"
  >
    <transition name="fade" mode="out-in">
      <div class="button-bar"
        v-if="!isActive">
        <app-button :label="$t('Open_1')" @click.native="handleOpen" />
        <app-button :label="$t('Close')" @click.native="handleClose" />
      </div>

      <app-button :label="$t('Stop')"
        v-else
        @click.native="handleClose" />
    </transition>
	</WidgetItem>
</template>

<script>
import WidgetItem from "@/components/widgets/WidgetItem";

import { JALOUSIE_STATES } from '@/utils/consts/consts.js';

import { numberToByteString } from "@/utils/transformers.js";

export default {
	props: {
		name: String,
		addr: String,
		editPermission: {
			type: Boolean,
			default: true
		}
	},
	computed: {
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
		handleClose() {
      if (!this.checkEditPermission()) return;

			this.$store.dispatch("setStatus", {
				addr: this.addr,
				status: numberToByteString(0),
			});
		},
		handleOpen() {
      if (!this.checkEditPermission()) return;

			this.$store.dispatch("setStatus", {
				addr: this.addr,
				status: numberToByteString(1),
			});
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