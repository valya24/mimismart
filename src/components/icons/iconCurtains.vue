<template>
	<div class="icon-curtains"
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
			<g>
				<path
					d="M1 1H23C23.5523 1 24 1.44772 24 2C24 2.55228 23.5523 3 23 3H1C0.447715 3 0 2.55228 0 2C0 1.44772 0.447715 1 1 1Z"
					class="fill-variable"
				/>
				<g id="curtain-left" ref="curtainLeft">
					<rect class="fill-const" x="8" y="15" width="1" height="7" rx="0.5" />
					<rect class="fill-const" x="5" y="15" width="1" height="7" rx="0.5" />
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M8.4999 3.81128L9.24971 4.661C9.43441 4.87031 9.70146 4.9999 10 4.9999C10.3689 4.9999 10.6924 4.80068 10.8668 4.49918L11.1556 3.9999H13.0004L12.9968 13.9999H13V19.9999C13 20.0607 12.9982 20.1213 12.9946 20.1814L12.9939 21.9999H12.2359C11.6875 22.6126 10.8893 22.9999 10 22.9999C9.45369 22.9999 8.94114 22.8534 8.5 22.5983C8.05887 22.8534 7.54631 22.9999 7 22.9999C6.45369 22.9999 5.94114 22.8534 5.5 22.5983C5.05887 22.8534 4.54631 22.9999 4 22.9999C3.11066 22.9999 2.31253 22.6126 1.76405 21.9999H0V3.9999H2.84435L3.13316 4.49918C3.30757 4.80068 3.6311 4.9999 3.99998 4.9999C4.29848 4.9999 4.56548 4.87036 4.75018 4.66113L5.49987 3.81184L6.24957 4.66113C6.43426 4.87036 6.70127 4.9999 6.99977 4.9999C7.29833 4.9999 7.56539 4.87031 7.75008 4.661L8.4999 3.81128ZM11 15.9999H10.9961L10.9993 6.82932C10.6869 6.93973 10.3505 6.9999 10 6.9999C9.45366 6.9999 8.94106 6.85337 8.4999 6.59823C8.05873 6.85337 7.54613 6.9999 6.99977 6.9999C6.4535 6.9999 5.94098 6.85343 5.49987 6.59836C5.05876 6.85343 4.54624 6.9999 3.99998 6.9999C3.23097 6.9999 2.53017 6.71031 2 6.23582V19.9999H2.84435L3.13317 20.4992C3.30758 20.8007 3.63112 20.9999 4 20.9999C4.29853 20.9999 4.56556 20.8703 4.75026 20.6611L5.5 19.8116L6.24974 20.6611C6.43444 20.8703 6.70147 20.9999 7 20.9999C7.29853 20.9999 7.56556 20.8703 7.75026 20.6611L8.5 19.8116L9.24974 20.6611C9.43444 20.8703 9.70147 20.9999 10 20.9999C10.3689 20.9999 10.6924 20.8007 10.8668 20.4992L10.9945 20.2784L10.9946 20.1115L10.9973 20.0751C10.9991 20.0505 11 20.0254 11 19.9999V15.9999Z"
						class="fill-variable"
					/>
				</g>
				<g id="curtain-right" ref="curtainRight">
					<rect class="fill-const" x="15" y="15" width="1" height="7" rx="0.5" fill="#A6ABFF" />
					<rect class="fill-const" x="18" y="15" width="1" height="7" rx="0.5" fill="#A6ABFF" />
					<path
						fill-rule="evenodd"
						clip-rule="evenodd"
						d="M18.4999 3.81128L19.2497 4.661C19.4344 4.87031 19.7015 4.9999 20 4.9999C20.3689 4.9999 20.6924 4.80068 20.8668 4.49918L21.1556 3.9999H24.0004L23.9939 21.9999L22.2359 21.9999C21.6875 22.6126 20.8893 22.9999 20 22.9999C19.4537 22.9999 18.9411 22.8534 18.5 22.5983C18.0589 22.8534 17.5463 22.9999 17 22.9999C16.4537 22.9999 15.9411 22.8534 15.5 22.5983C15.0589 22.8534 14.5463 22.9999 14 22.9999C13.1107 22.9999 12.3125 22.6126 11.764 21.9999H11V3.9999H12.8444L13.1332 4.49918C13.3076 4.80068 13.6311 4.9999 14 4.9999C14.2985 4.9999 14.5655 4.87036 14.7502 4.66113L15.4999 3.81184L16.2496 4.66113C16.4343 4.87036 16.7013 4.9999 16.9998 4.9999C17.2983 4.9999 17.5654 4.87031 17.7501 4.661L18.4999 3.81128ZM13 20.269L13.1332 20.4992C13.3076 20.8007 13.6311 20.9999 14 20.9999C14.2985 20.9999 14.5656 20.8703 14.7503 20.6611L15.5 19.8116L16.2497 20.6611C16.4344 20.8703 16.7015 20.9999 17 20.9999C17.2985 20.9999 17.5656 20.8703 17.7503 20.6611L18.5 19.8116L19.2497 20.6611C19.4344 20.8703 19.7015 20.9999 20 20.9999C20.3689 20.9999 20.6924 20.8007 20.8668 20.4992L21.1556 19.9999H21.9946L21.9996 6.23622C21.4694 6.71047 20.7688 6.9999 20 6.9999C19.4537 6.9999 18.9411 6.85337 18.4999 6.59823C18.0587 6.85337 17.5461 6.9999 16.9998 6.9999C16.4535 6.9999 15.941 6.85343 15.4999 6.59836C15.0588 6.85343 14.5462 6.9999 14 6.9999C13.6492 6.9999 13.3127 6.93965 13 6.82909V20.269Z"
						class="fill-variable"
					/>
				</g>
				<rect x="22" y="6" width="2" height="16" class="fill-variable" />
				<rect y="6" width="2" height="16" class="fill-variable" />
			</g>
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
	},
	watch: {
		value() {
			// if (newValue != 2 || newValue != 3) {
				let transform = window.getComputedStyle(this.$refs.curtainRight).transform;
				if (!transform || transform == 'none' || !transform.split('(')[1]) return false;
				transform = transform.split('(')[1].split(')')[0].split(',').map( item => parseFloat(item));
				let transX = transform[4];

				this.$refs.curtainLeft.style.transform = `translate(-${transX}px, 0)`;
				this.$refs.curtainRight.style.transform = `translate(${transX}px, 0)`;
				setTimeout(() => {
					this.$refs.curtainLeft.style.removeProperty('transform');
					this.$refs.curtainRight.style.removeProperty('transform');
				}, 0)
			// }
		}
	}
};
</script>

<style lang="less" scoped>
#curtain-right {
	animation: opening-right 5s linear reverse infinite;
	transition: 1s;
}
#curtain-left {
	animation: opening-left 5s linear reverse infinite;
	transition: 1s;
}

.icon-curtains.--closed #curtain-left,
.icon-curtains.--closed #curtain-right {
	animation: none;
	// animation-play-state: paused;
}
.icon-curtains.--open #curtain-left {
	animation: none;	
	// animation-play-state: paused;
	transform: translateX(-5.5px);	
}
.icon-curtains.--open #curtain-right {
	animation: none;	
	// animation-play-state: paused;
	transform: translateX(5.5px);
}
.icon-curtains.--closing #curtain-left,
.icon-curtains.--closing #curtain-right {
	animation-direction: reverse;
}
.icon-curtains.--opening #curtain-left,
.icon-curtains.--opening #curtain-right {
	animation-direction: normal;	
}
.icon-curtains.--half-open #curtain-left {
	animation: none;
	// animation-play-state: paused;
	transform: translateX(-3px);
}
.icon-curtains.--half-open #curtain-right {
	animation: none;
	// animation-play-state: paused;
	transform: translateX(3px);
}

@keyframes opening-right {
	0% {
		transform: translateX(0);
	}
	100% {
		transform: translateX(6px);
	}
}
@keyframes opening-left {
	0% {
		transform: translateX(0);
	}
	100% {
		transform: translateX(-6px);
	}
}
</style>