<template>
	<div class="icon-mic" :class="{on: isOn}">
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path class="fill-variable" d="M7,7l9,5l-9,5V7z M17,7h1v10h-1V7z"/>
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