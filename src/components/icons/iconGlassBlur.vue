<template>
	<div class="icon-glass-blur" :class="{on: isOn}">
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<rect id="mask-hl-glassblur" x="5" y="2" class="st0" width="14" height="20"/>
				<clipPath id="clip-path-hl-glassblur">
					<use xlink:href="#mask-hl-glassblur" style="overflow:hidden;" />
				</clipPath>
			</defs>
			<rect x="4" y="1" class="fill-const" width="16" height="22"/>
			<path class="fill-variable" d="M21,24H3V0h18V24z M5,22h14V2H5V22z"/>
			<path class="hand" d="M17.7,12.5c-0.4-0.4-1-0.4-1.3,0l-1.1,1.1c-0.3,0.3-0.6,0.3-0.8,0.1c-0.1-0.2-0.1-0.7,0-1L14.9,8
				c0-0.4-0.2-0.8-0.6-0.9c-0.4-0.1-0.8,0.3-0.8,0.7l-0.6,3.6c0,0.1-0.1,0.1-0.1,0l-0.2-4.7c0-0.4-0.3-0.7-0.7-0.7
				C11.3,6,11,6.3,11,6.7l0,4.7c0,0.1,0,0.1-0.1,0l-0.7-3.7c-0.1-0.4-0.5-0.7-0.9-0.6C9,7.2,8.7,7.7,8.8,8.1l0.6,4.3c0,0.1,0,0.1-0.1,0
				L8.4,10c-0.1-0.4-0.6-0.6-1-0.5c-0.4,0.1-0.6,0.6-0.5,1l1.5,5.1c0,0,0,0.1,0,0.1l0,0c0,0,0,0,0,0C9,17,10.3,18,11.7,18
				c0.9,0,1.9-0.3,2.6-0.9c0.8-0.5,3.4-3.3,3.4-3.3C18.1,13.5,18.1,12.9,17.7,12.5z"/>
			<path clip-path="url(#clip-path-hl-glassblur)" class="highlight" d="M2.6,1.6L22,15.9l-1.8,2.4L0.9,4L2.6,1.6z M3.8-1l19.3,14.2L22.5,14L3.2-0.2L3.8-1z"/>
		</svg>
	</div>
</template>

<script>
export default {
	props: ['isOn']
}
</script>

<style lang="less" scoped>
.hand {
	fill: @colorMain;
	opacity: 1;
	transition: .2s;
	.on & {
		opacity: 0;
	}
}
</style>