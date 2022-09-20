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
				<rect id="mask-highlights" x="7" y="5" width="10" height="20"/>
				<clipPath id="clip-path-jalousie">
					<use xlink:href="#mask-highlights"  style="overflow:hidden;"/>
				</clipPath>
			</defs>
			<rect id="const" x="5" y="2" class="fill-const" width="14" height="20"/>
			<path class="fill-variable" d="M19,22H5V2h14V22z M7,20h10V4H7V20z"/>
			<g clip-path="url(#clip-path-jalousie)">
				<rect class="highlight" x="9.9" y="-2.1" transform="matrix(0.5933 -0.805 0.805 0.5933 -3.3607 13.2228)" width="3" height="24"/>
				<rect class="highlight" x="12.7" y="-5.5" transform="matrix(0.5933 -0.805 0.805 0.5933 0.1123 13.2671)" width="1" height="24"/>
				<path class="fill-variable blinds" d="M6,18h12v1H6V18z M6,16h12v1H6V16z M6,14h12v1H6V14z M6,12h12v1H6V12z M6,10h12v1H6V10z M6,8h12v1
					H6V8z M6,6h12v1H6V6z M6,4h12v1H6V4z"/>
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
.blinds {
	transform-origin: top center;
	animation: opening-blinds 5s linear infinite;
}

.--closed .blinds {
	transform: scaleY(1);
	animation: none;
}
.--open .blinds {
	transform: scaleY(0.2);
	animation: none;
}
.--closing .blinds {
	animation: opening-blinds 5s linear reverse infinite;
}
.--opening .blinds {
	animation: opening-blinds 5s linear infinite;
}
.--half-open .blinds {
	transform: scaleY(0.6);
	animation: none;
}

@keyframes opening-blinds {
	0% {transform: scaleY(1);}

	100% {transform: scaleY(0.2);}
}
</style>