<template>
	<div class="icon-camera" :class="{on: isOn}">
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path class="fill-const" d="M0.5,13.6c-0.3-0.5-0.1-1.1,0.4-1.4l2.6-1.5L6,15.1l-2.6,1.5c-0.5,0.3-1.1,0.1-1.4-0.4L0.5,13.6z"/>
			<path class="fill-variable" d="M22.5,11.5c-0.6,0-1,0.4-1,1v4h-4.4l-2.5-4.1l4.5-2.6c1-0.6,1.3-1.8,0.7-2.7l-2.5-4.3c-0.3-0.5-0.7-0.8-1.2-0.9
				c-0.5-0.1-1.1-0.1-1.5,0.2l-13,7.5l3.5,6.1c0.3,0.5,0.7,0.8,1.2,0.9c0.2,0,0.3,0.1,0.5,0.1c0.3,0,0.7-0.1,1-0.3l5-2.9l2.8,4.6
				c0.2,0.3,0.5,0.5,0.9,0.5h5v4c0,0.6,0.4,1,1,1s1-0.4,1-1v-5v-5C23.5,11.9,23.1,11.5,22.5,11.5z M6.8,14.6l-2.5-4.3l11.3-6.5l2.5,4.3
				L6.8,14.6z"/>
		</svg>
	</div>
</template>

<script>
export default {
	props: ['isOn']
}
</script>