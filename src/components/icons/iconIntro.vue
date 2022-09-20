<template>
	<div class="icon-alarm" :class="{on: isOn}">
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<rect y="11" class="fill-variable" width="7" height="2"/>
			<polygon class="fill-const" points="24,12 18,8 18,11 7,11 7,13 18,13 18,16 "/>
		</svg>
	</div>
</template>

<script>
export default {
	props: ['isOn']
}
</script>