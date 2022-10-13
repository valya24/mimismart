<template>
	<div class="icon-mic" :class="{on: isOn}">
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path class="fill-variable" d="M7,6h3v12H7V6z M14,6h3v12h-3V6z"/>
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