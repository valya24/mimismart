<template>
	<div class="icon-swing" :class="{on: isOn}">
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path
				class="fill-variable"
				d="M23 7.99998C22.0807 7.99998 21.1705 7.81889 20.3212 7.4671C19.4719 7.11532 18.7002 6.59968 18.0502 5.94967C17.4002 5.29965 16.8846 4.52798 16.5328 3.6787C16.1811 2.82942 16 1.91925 16 1H17C17 2.5913 17.6321 4.1174 18.7573 5.24262C19.8826 6.36784 21.4087 6.99997 23 6.99997V7.99998Z"
			/>
			<path
				class="arrow-top fill-const"
				:class="{ 'active': value == VANE_VER_ALL || value == VANE_VER_TOP_1 || value == VANE_VER_TOP_2 }"
				d="M14.1504 2.64258L3.80469 6.42969L3.10547 4.51758L1 9.05274L5.53516 11.1582L4.83594 9.2461L15.1816 5.45899C14.6828 4.58447 14.3342 3.63245 14.1504 2.64258Z"
			/>
			<path
				class="arrow-middle fill-const"
				:class="{ 'active': value == VANE_VER_ALL || value == VANE_VER_TOP_2 || VANE_VER_MIDDLE || value == VANE_VER_BOTTOM_1 }"
				d="M15.6641 6.21484L7.87305 14.0059L6.43359 12.5664V17.5664H11.4336L9.99414 16.127L17.7852 8.33594C16.9644 7.75254 16.2475 7.03555 15.6641 6.21484Z"
			/>
			<path
				class="arrow-bottom fill-const"
				:class="{ 'active': value == VANE_VER_ALL || value == VANE_VER_BOTTOM_1 || value == VANE_VER_BOTTOM_2 }"
				d="M18.541 8.81836L14.7539 19.1641L12.8418 18.4649L14.9473 23L19.4824 20.8945L17.5723 20.1953L21.3574 9.84961C20.3676 9.66581 19.4155 9.31722 18.541 8.81836Z"
			/>
		</svg>
	</div>
</template>

<script>
import { VANE_VER_STATES } from '@/utils/consts/consts.js';

export default {
	props: ["isOn", "value"],
	data() {
		return {
			...VANE_VER_STATES
		}
	}
};
</script>

<style lang="less" scoped>
.arrow-top,
.arrow-bottom,
.arrow-middle {
	fill: @colorPaleBlue;
}
.active {
	fill: @colorMain;
}
</style>