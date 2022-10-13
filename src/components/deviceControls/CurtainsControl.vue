<template>
	<div class="curtains-control controls-body on">
		<div class="big-icon-control">
			<icon-comp :iconName="`icon-${icon}`" :value="status" />
			<transition name="fade" mode="out-in">
				<div class="status" :key="statusMessage[status]" >
					{{ statusMessage[status] }}
				</div>
			</transition>
			<div class="open-close hbox alic">
				<transition name="fade" mode="out-in">
					<div class="button-bar"
						v-if="status != JALOUSIE_CLOSING && status != JALOUSIE_OPENING">
						<Button :label="$t('Open_1')"
							@click.native="$emit('change', 1)" />
						<Button :label="$t('Close')"
							@click.native="$emit('change', 0)" />
					</div>

					<Button :label="$t('Stop')"
						v-else
						@click.native="$emit('change', 255)" />
				</transition>
			</div>
		</div>
	</div>
</template>

<script>
import Button from '@/components/buttons/Button'

import { JALOUSIE_STATES } from '@/utils/consts/consts.js';

export default {
	props: {
		status: Number,
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
	computed: {
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