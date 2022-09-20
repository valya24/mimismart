<template>
	<div class="icon-i-left" :class="{on: isOn}">
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path class="fill-variable" d="M23.7,12.7L23.7,12.7l-3,3c-0.4,0.4-1,0.4-1.4,0s-0.4-1,0-1.4l1.3-1.3H16v-2h4.6l-1.3-1.3c-0.4-0.4-0.4-1,0-1.4
	c0.4-0.4,1-0.4,1.4,0l3,3C24.1,11.7,24.1,12.3,23.7,12.7z M15,2c0.6,0,1,0.4,1,1v8h-5c-0.6,0-1,0.4-1,1s0.4,1,1,1h5v8
	c0,0.6-0.4,1-1,1H4c-0.6,0-1-0.4-1-1V3c0-0.6,0.4-1,1-1H15z"/>
		</svg>
	</div>
</template>

<script>
export default {
	props: ['isOn']
}
</script>