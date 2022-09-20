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
			<defs>
				<rect id="mask-curtains-roll" x="1" y="10" width="19" height="12"/>
				<clipPath id="mask-curtains-roll-clip">
                    <use xlink:href="#mask-curtains-roll"  style="overflow:hidden;"/>
                </clipPath>
			</defs>
			<circle class="fill-const" cx="20" cy="8" r="3"/>
			<g clip-path="url(#mask-curtains-roll-clip)">
				<polygon class="fill-variable part-roll" points="16,10 16,20 3,20 3,10 1,10 1,22 18,22 18,21 18,20 18,10 "/>
			</g>
			<path class="fill-variable" d="M24,2c0,0.6-0.4,1-1,1H1C0.4,3,0,2.6,0,2c0-0.6,0.4-1,1-1h22C23.6,1,24,1.4,24,2z M24,8c0,2.2-1.8,4-4,4
				c-0.7,0-1.4-0.2-2-0.6V12h-2V8c0-0.7,0.2-1.4,0.6-2H6C4.3,6,3,7.3,3,9v3H1V9c0-2.8,2.2-5,5-5h14C22.2,4,24,5.8,24,8z M22,8
				c0-1.1-0.9-2-2-2s-2,0.9-2,2s0.9,2,2,2S22,9.1,22,8z"/>
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
.part-roll {
	animation: roll-up 4s linear infinite;
}
.--closed .part-roll {
	transform: translateY(0);
	animation: none;
}
.--open .part-roll {
	transform: translateY(-9.5px);
	animation: none;
}
.--closing .part-roll {
	animation: roll-up 4s linear reverse infinite;
}
.--opening .part-roll {
	animation: roll-up 4s linear infinite;
}
.--half-open .part-roll {
	transform: translateY(-4px);
	animation: none;
}

@keyframes roll-up {
	from {transform: translateY(0);}
	to {transform: translateY(-10px);}
}
</style>