<template>
	<div class="icon-close" :class="{on: isOn}">
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path class="fill-const" d="M20.5,15h-17L4,17l2.5,1.5l3,2H13l3-1l3-2L20.5,15z"/>
			<path class="fill-variable" d="M12,16.1c-0.8,0-1.5-0.2-2.2-0.7c-1.6-1.1-2-3.3-1-5L12,5l3.2,5.4c1,1.7,0.6,3.8-1,5
				C13.5,15.9,12.8,16.1,12,16.1z M12,8.9l-1.5,2.5c-0.5,0.8-0.3,1.8,0.5,2.3l0,0c0.6,0.4,1.4,0.4,2.1,0c0.7-0.5,1-1.5,0.5-2.3L12,8.9z
				M12,22C6.5,22,2,17.5,2,12C2,6.5,6.5,2,12,2c5.5,0,10,4.5,10,10C22,17.5,17.5,22,12,22z M12,4c-4.4,0-8,3.6-8,8s3.6,8,8,8
				s8-3.6,8-8S16.4,4,12,4z"/>
		</svg>
	</div>
</template>

<script>
export default {
	props: ['isOn']
}
</script>

<style lang="less" scoped>
.leak-sign {
	.fill-variable {fill: #F56363}
	.fill-const {fill: #F6ADAD}
}
</style>