<template>
	<div class="icon-i-came" :class="{on: isOn}">
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path class="fill-variable" d="M4,2C3.4,2,3,2.4,3,3v18c0,0.6,0.4,1,1,1h11c0.6,0,1-0.4,1-1v-8h-5.6l1.3,1.3c0.4,0.4,0.4,1,0,1.4s-1,0.4-1.4,0
	l-3-3c-0.4-0.4-0.4-1,0-1.4l3-3c0.4-0.4,1-0.4,1.4,0c0.4,0.4,0.4,1,0,1.4L10.4,11H16V3c0-0.6-0.4-1-1-1H4z M22,12c0,0.6-0.4,1-1,1
	h-5v-2h5C21.6,11,22,11.4,22,12z"/>
		</svg>
	</div>
</template>

<script>
export default {
	props: ['isOn']
}
</script>