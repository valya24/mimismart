<template>
	<div class="icon-alarm" :class="{ 
		on: isOn,
		'--closed': value == JALOUSIE_CLOSED,
		'--open': value == JALOUSIE_OPEN,
		'--closing': value == JALOUSIE_CLOSING,
		'--opening': value == JALOUSIE_OPENING,
		'--half-open': value == JALOUSIE_HALFOPEN
	}">
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<g class="part-gates">
				<path class="fill-const part-bars" d="M4,10h2v7H4V10z M8,10h2v7H8V10z M12,10h2v7h-2V10z M16,10h2v7h-2V10z"/>
				<path class="fill-variable part-gate-frame" d="M23.7,19H0V8h17.6L23.7,19z M2,17h18.3l-3.9-7H2V17z"/>
			</g>
			<path class="fill-variable part-cols" d="M0,6h2v15H0V6z M1,3c0.6,0,1,0.4,1,1S1.6,5,1,5S0,4.6,0,4S0.4,3,1,3z M22,6h2v15h-2V6z M23,3
				c0.6,0,1,0.4,1,1s-0.4,1-1,1s-1-0.4-1-1S22.4,3,23,3z"/>
		</svg>
	</div>
</template>

<script>
import { JALOUSIE_STATES } from '@/utils/consts/consts.js';

export default {
	props: ['isOn', 'value'],
	data() {
		return {
			...JALOUSIE_STATES
		}
	},
}
</script>

<style lang="less" scoped>
.part-gates {
	transform-origin: center;
	animation: slide-left 2s linear infinite;
}
.--closed .part-gates {
	transform: translateX(0);
	animation: none;
}
.--open .part-gates {
	transform: translateX(-70%);
	animation: none;
}
.--closing .part-gates {
	animation: slide-left 2s linear reverse infinite;
	animation-play-state: running;
}
.--opening .part-gates {
	animation: slide-left 2s linear infinite;
	animation-play-state: running;
}
.--half-open .part-gates {
	transform: translateX(-35%);
	animation: none;
}
</style>