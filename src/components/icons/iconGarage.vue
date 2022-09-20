<template>
	<div class="icon-garage" :class="{on: isOn}">
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<defs>
				<rect id="mask-garage" x="7" y="12" width="10" height="10" />
			</defs>
			<clipPath id="garage-door-clip-mask">
				<use xlink:href="#mask-garage" style="overflow:hidden;" />
			</clipPath>
			<g class="garage-door-container" clip-path="url(#garage-door-clip-mask)">
				<rect x="9" y="12" class="fill-const garage-door" width="6" height="2" />
				<rect x="9" y="16" class="fill-const garage-door" width="6" height="2" />
				<rect x="7" y="20" class="fill-variable garage-door" width="10" height="2" />
			</g>
			<path id="garage" class="fill-variable" d="M12,2.9L1.1,8.1l0.9,1.8L3,9.4V20c0,1.1,0.9,2,2,2h2h2v-2v-1v-7h6v7v1v2h2h2c1.1,0,2-0.9,2-2V9.4
				l1.1,0.5l0.9-1.8L12,2.9z M19,20h-2V10H7v10H5V8.4l7-3.3l7,3.3V20z" />
		</svg>
	</div>
</template>

<script>
	export default {
		props: ['isOn']
	}
</script>

<style lang="less" scoped>
.garage-door {
	animation: opening-garage 5s linear infinite;
}
@keyframes opening-garage {
	0% {transform: translateY(0);}

	100% {transform: translateY(-9px);}
}
</style>