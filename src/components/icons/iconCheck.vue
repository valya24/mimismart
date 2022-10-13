<template>
	<div class="icon-alarm" :class="{on: isOn}">
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path class="fill-variable" d="M9.7,16c-0.2,0-0.5-0.1-0.7-0.3l-4.7-4.5c-0.4-0.4-0.4-1,0-1.4c0.4-0.4,1-0.4,1.4,0l4,3.8l8.6-8.3
				c0.4-0.4,1-0.4,1.4,0c0.4,0.4,0.4,1,0,1.4l-9.3,9C10.2,15.9,9.9,16,9.7,16z"/>
		</svg>
	</div>
</template>

<script>
export default {
	props: ['isOn']
}
</script>