<template>
	<div class="curtains-control controls-body on">
		<div class="big-icon-control">
			<icon-comp :iconName="`icon-${icon}`" :value="+gate.isActive.charAt(1)" />
			<transition name="fade" mode="out-in">
				<div class="status" :key="statusMessage[status]" >
					{{ statusMessage[+gate.isActive.charAt(1)] }}
				</div>
			</transition>
			<div class="open-close hbox alic">
				<transition name="fade" mode="out-in">
          <div class="button-bar"
               v-if="gate.isActive === '04'">
            <Button :label="$t('Open_1')"
                    @click.native="$emit('change', '01')" />
            <Button :label="$t('Close')"
                    @click.native="$emit('change', '00')" />
          </div>
          <div class="button-bar" v-else-if="gate.isActive === '00'">
            <Button :label="$t('Open_1')"
                    @click.native="$emit('change', '01')" />
          </div>
          <div class="button-bar" v-else-if="gate.isActive === '01'">
            <Button :label="$t('Close')"
                    @click.native="$emit('change', '00')" />
          </div>

          <Button :label="$t('Stop')"
                  v-else
                  @click.native="$emit('change', '00')" />
				</transition>
			</div>
		</div>
	</div>
</template>

<script>
import Button from '@/components/buttons/Button'

import { JALOUSIE_STATES } from '@/utils/consts/consts.js';
import {mapGetters} from "vuex";

export default {
	props: {
		status: Number,
    addr: String,
		icon: {
			type: String,
			default: 'curtains'
		}
	},
	data() {
		return {
			...JALOUSIE_STATES
		}
	},
  watch: {
    sensorDevice: {
      deep: true,
      handler(val) {
        if (val.addr === this.addr) {
          this.$store.commit('setGateData', {isActive: val.status});
        }
      }
    }
  },
	computed: {
    ...mapGetters(['gate']),
    ...mapGetters('ws', ['sensorDevice']),
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
	components: {
		Button,
	}
}
</script>

<style lang="less" scoped>
.big-icon-control {
	height: auto;
}
.status {
	color: rgba(0,0,0,0.5);
	margin-bottom: 24px;
}
.curtains-control .open-close {
	.button-bar {
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.button {
		margin-right: 24px;
		&:last-of-type {
			margin-right: 0;
		}
	}
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .22s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0.1;
}
</style>