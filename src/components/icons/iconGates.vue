<template>
	<div class="icon-gates"
		:class="{ 
			on: isOn,
			'--closed': value == JALOUSIE_CLOSED,
			'--open': value == JALOUSIE_OPEN,
			'--closing': value == JALOUSIE_CLOSING,
			'--opening': value == JALOUSIE_OPENING,
			'--half-open': value == JALOUSIE_HALFOPEN
		}"
	>
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<g class="part-gate-right">
				<rect x="17" y="7" class="fill-const" width="2" height="11"/>
				<path class="fill-variable" d="M22,7v2.4C20.7,9,19.9,8.1,19,7c-1.2-1.4-2.6-3-5-3h-1v5h-2v2h2v9h11V7H22z M22,18h-7V6.2
					c0.9,0.3,1.5,1.1,2.5,2.1c1.1,1.3,2.4,2.8,4.5,3.1V18z"/>
			</g>
			<g class="part-gate-left">
				<rect x="5" y="7" class="fill-const" width="2" height="11"/>
				<path class="fill-variable" d="M11,13V4h-1C7.6,4,6.2,5.6,5,7C4.1,8.1,3.3,9,2,9.4V7H0v13h11v-5h2v-2H11z M9,18H2v-6.6
					c2.2-0.4,3.5-1.9,4.5-3.1c0.9-1,1.6-1.8,2.5-2.1V18z"/>
			</g>
			<path id="cols" class="fill-variable" d="M23,4c0.6,0,1,0.4,1,1s-0.4,1-1,1s-1-0.4-1-1S22.4,4,23,4z M24,7h-2v13h2V7z M1,4c0.6,0,1,0.4,1,1
				S1.6,6,1,6S0,5.6,0,5S0.4,4,1,4z M2,7H0v13h2V7z"/>
		</svg>
	</div>
</template>

<script>
import { JALOUSIE_STATES } from '@/utils/consts/consts.js';

export default {
	props: ["isOn", "value"],
	data() {
		return {
			...JALOUSIE_STATES
		}
	}
};
</script>

<style lang="less" scoped>
.part-gate-left, .part-gate-right {
	animation: shrink-to-10 4s infinite;
}
.part-gate-left {transform-origin: left center;}
.part-gate-right {transform-origin: right center;}

.--closed .part-gate-left,
.--closed .part-gate-right {
	transform: scaleX(1);
	animation: none;
}
.--open .part-gate-left,
.--open .part-gate-right {
	transform: scaleX(0.1);
	animation: none;
}
.--closing .part-gate-left,
.--closing .part-gate-right {
	animation: shrink-to-10 4s linear reverse infinite;
}
.--opening .part-gate-left,
.--opening .part-gate-right {
	animation: shrink-to-10 4s linear infinite;
}
.--half-open .part-gate-left,
.--half-open .part-gate-right {
	transform: scaleX(0.75);
	animation: none;
}

@keyframes shrink-to-10 {
	0% {transform: scaleX(1);}
	100% {transform: scaleX(0.1);}
}
</style>