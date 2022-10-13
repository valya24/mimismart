<template>
	<div class="icon-swing-horiz" :class="{on: isOn}">
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path class="fill-variable" d="M3.5,3h17C20.8,3,21,3.2,21,3.5l0,0C21,3.8,20.8,4,20.5,4h-17C3.2,4,3,3.8,3,3.5l0,0C3,3.2,3.2,3,3.5,3z"/>
			<polygon
				class="arrow-left fill-const"
				:class="{ 'active': value == VANE_HOR_LEFT_1 || value == VANE_HOR_LEFT_2 || value == VANE_HOR_LEFT_AND_RIGHT || value == VANE_HOR_ALL }"
				points="9.3,7.7 6.7,6.3 2,14.7 0.7,14 1.5,18.4 5.7,16.9 4.6,16.2 "/>
			<polygon
				class="arrow-center fill-const"
				:class="{ 'active': value == VANE_HOR_LEFT_2 || value == VANE_HOR_MIDDLE || value == VANE_HOR_RIGHT_1 || value == VANE_HOR_ALL }"
				points="13.5,17 13.5,8 10.5,8 10.5,17 9,17 11.9,20.5 14.8,17 "/>
			<polygon
				class="arrow-right fill-const"
				:class="{ 'active': value == VANE_HOR_RIGHT_1 || value == VANE_HOR_RIGHT_2 || value == VANE_HOR_LEFT_AND_RIGHT || value == VANE_HOR_ALL }"
				points="22,14.7 17.3,6.3 14.7,7.7 19.4,16.2 18.3,16.9 22.5,18.4 23.3,14 "/>
		</svg>
	</div>
</template>

<script>
import { VANE_HOR_STATES } from '@/utils/consts/consts.js';

export default {
	props: ['isOn', 'value'],
	data() {
		return {
			...VANE_HOR_STATES
		}
	}
}
</script>

<style lang="less" scoped>

</style>

