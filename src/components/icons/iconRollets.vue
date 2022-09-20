<template>
	<div class="icon-rollets" :class="{ 
			on: isOn,
			'--closed': value == JALOUSIE_CLOSED,
			'--open': value == JALOUSIE_OPEN,
			'--closing': value == JALOUSIE_CLOSING,
			'--opening': value == JALOUSIE_OPENING,
			'--half-open': value == JALOUSIE_HALFOPEN
		}">
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path class="fill-const" d="M13,6h-2H5v16h14V6H13z M7,8h4v12H7V8z M17,20h-4V8h4V20z"/>
			<path class="fill-variable" d="M5,3c0-0.6,0.4-1,1-1h12c0.6,0,1,0.4,1,1v2H5V3z"/>
			<defs>
				<rect id="mask-rollets" x="5" y="6" width="14" height="17"/>
				<clipPath id="clip-path-rollets">
					<use xlink:href="#mask-rollets" style="overflow:hidden;" />
				</clipPath>
			</defs>
			<g clip-path="url(#clip-path-rollets)">
				<path class="fill-variable rollet" d="M18,5H6C5.4,5,5,5.4,5,6v15c0,0.6,0.4,1,1,1h12c0.6,0,1-0.4,1-1V6C19,5.4,18.6,5,18,5z M17,20H7v-1h10V20z
					M17,18H7v-1h10V18z M17,16H7v-1h10V16z M17,14H7v-1h10V14z M17,12H7v-1h10V12z M17,10H7V9h10V10z M17,8H7V7h10V8z"/>
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
.rollet {
	animation: opening-rollets 5s linear infinite;
}
.--closed .rollet {
	transform: translateY(0);
	animation: none;
}
.--open .rollet {
	transform: translateY(-17px);
	animation: none;
}
.--closing .rollet {
	animation: opening-rollets 5s linear reverse infinite;
}
.--opening .rollet {
	animation: opening-rollets 5s linear infinite;
}
.--half-open .rollet {
	transform: translateY(-8px);
	animation: none;
}

@keyframes opening-rollets {
	0% {transform: translateY(0);}

	100% {transform: translateY(-17px);}
}
</style>