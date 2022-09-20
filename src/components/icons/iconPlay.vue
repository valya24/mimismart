<template>
	<div class="icon-mic" :class="{on: isOn}">
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path d="M7 4L21 12L7 20V4Z" class="fill-variable"/>
		</svg>
	</div>
</template>

<script>
export default {
	props: ['isOn']
}
</script>

<style lang="less" scoped>
</style>