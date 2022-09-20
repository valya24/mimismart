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
			<rect x="4" y="3" class="fill-const" width="16" height="19"/>
			<path class="fill-variable" d="M21,23H3V2h18V23z M5,21h14V4H5V21z"/>
			<g clip-path="url(#clip-path-jalousie)">
				<rect class="highlight" x="9.9" y="-0.1" transform="matrix(0.5933 -0.805 0.805 0.5933 -4.9697 14.0024)" width="3" height="24"/>
				<rect class="highlight" x="12.7" y="-3.5" transform="matrix(0.5933 -0.805 0.805 0.5933 -1.4815 14.0628)" width="1" height="24"/>
			</g>
			<g class="plisse-group">
				<path class="fill-variable" d="M1,2h22l-2,3H3L1,2z M1,8h22l-2,3H3L1,8z M1,14h22l-2,3H3L1,14z M1,20h22l-2,3H3L1,20z"/>
				<path class="fill-const" d="M1,8h22l-2-3H3L1,8z M1,14h22l-2-3H3L1,14z M1,20h22l-2-3H3L1,20z"/>
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
.plisse-group {
	transform-origin: top center;
	animation: opening-plisse 5s linear infinite;
}
.--closed .plisse-group {
	transform: scaleY(1);
	animation: none;
}
.--open .plisse-group {
	transform: scaleY(0.3);
	animation: none;
}
.--closing .plisse-group {
	animation: opening-plisse 5s linear reverse infinite;
}
.--opening .plisse-group {
	animation: opening-plisse 5s linear infinite;
}
.--half-open .plisse-group {
	transform: scaleY(0.6);
	animation: none;
}

@keyframes opening-plisse {
	0% {transform: scaleY(1);}

	100% {transform: scaleY(0.3);}
}
</style>