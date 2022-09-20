<template>
	<div class="icon-alarm" :class="{on: isOn}">
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path class="fill-variable" d="M18,13v3l6-4l-6-4v3V13z M0,11h18v2H0V11z M11.9,9h-2V2.7L8,3.3V1.8l3.7-1.3h0.2V9z"/>
		</svg>
	</div>
</template>

<script>
export default {
	props: ['isOn']
}
</script>