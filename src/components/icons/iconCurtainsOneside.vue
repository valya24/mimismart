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
			<path class="fill-variable part-top" d="M23,1H1C0.4,1,0,1.4,0,2c0,0.6,0.4,1,1,1h22c0.6,0,1-0.4,1-1C24,1.4,23.6,1,23,1z"/>
			<g class="part-curtain">
				<path class="fill-variable" d="M4.5,4.3L4.2,4H3.8H2H1v18h1h1.4C4.1,22.6,5,23,6,23s1.9-0.4,2.6-1h0.8c0.7,0.6,1.6,1,2.6,1
					s1.9-0.4,2.6-1h0.8c0.7,0.6,1.6,1,2.6,1s1.9-0.4,2.6-1H22h1l0-18h-1h-1.8h-0.4l-0.3,0.3C19.1,4.7,18.6,5,18,5s-1.1-0.3-1.5-0.7
					L16.2,4h-0.4h-1.5h-0.4l-0.3,0.3C13.1,4.7,12.6,5,12,5s-1.1-0.3-1.5-0.7L10.2,4H9.8H8.2H7.8L7.5,4.3C7.1,4.7,6.6,5,6,5
					S4.9,4.7,4.5,4.3z M18,21c-0.6,0-1.1-0.3-1.5-0.7l0,0L16.2,20h-0.4h-1.5h-0.4l-0.3,0.3l0,0C13.1,20.7,12.6,21,12,21
					s-1.1-0.3-1.5-0.7L10.2,20H9.8H8.2H7.8l-0.3,0.3l0,0C7.1,20.7,6.6,21,6,21s-1.1-0.3-1.5-0.7l0,0L4.2,20H3.8H3V6h0.4
					C4.1,6.6,5,7,6,7s1.9-0.4,2.6-1h0.8C10.1,6.6,11,7,12,7s1.9-0.4,2.6-1h0.8C16.1,6.6,17,7,18,7s1.9-0.4,2.6-1H21l0,14h-0.8h-0.4
					l-0.3,0.3l0,0C19.1,20.7,18.6,21,18,21z"/>
				<path class="fill-const" d="M9,8L9,8c0.6,0,1,0.4,1,1v8c0,0.6-0.4,1-1,1l0,0c-0.6,0-1-0.4-1-1V9C8,8.4,8.4,8,9,8z M15,8L15,8
					c0.6,0,1,0.4,1,1v8c0,0.6-0.4,1-1,1l0,0c-0.6,0-1-0.4-1-1V9C14,8.4,14.4,8,15,8z"/>
			</g>
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
.part-curtain {
	transform-origin: center;
	animation: slide-left 2s linear infinite;
}
.--closed .part-curtain {
	transform: translateX(0);
	animation: none;
}
.--open .part-curtain {
	transform: translateX(-70%);
	animation: none;
}
.--closing .part-curtain {
	animation: slide-left 2s linear reverse infinite;
	animation-play-state: running;
}
.--opening .part-curtain {
	animation: slide-left 2s linear infinite;
	animation-play-state: running;
}
.--half-open .part-curtain {
	transform: translateX(-35%);
	animation: none;
}
</style>