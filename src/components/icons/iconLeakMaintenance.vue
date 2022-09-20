<template>
	<div class="icon-leak-maintenance" :class="{on: isOn, '--ignoring': ignoring}">
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path class="fill-const" d="M20.5,15h-17L4,17l2.5,1.5l3,2H13l3-1l3-2L20.5,15z"/>
<path class="fill-variable" d="M12,22C6.5,22,2,17.5,2,12C2,6.5,6.5,2,12,2c5.5,0,10,4.5,10,10C22,17.5,17.5,22,12,22z M12,4c-4.4,0-8,3.6-8,8
	s3.6,8,8,8s8-3.6,8-8S16.4,4,12,4z M11,5h2v6h-2V5z M11,12h2v2h-2V12z"/>
		</svg>
	</div>
</template>

<script>
export default {
	props: ['isOn', 'ignoring']
}
</script>

<style lang="less" scoped>
.--ignoring {
	.fill-const {
		fill: #F2B27C;
	}
	.fill-variable {
		fill: #ED7A5C;
	}
}
</style>