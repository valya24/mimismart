<template>
	<div class="icon-ptichka-left" :class="{on: isOn}">
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path class="fill-variable" d="M17.7,14.1l3.2,1.4L19,12.6L11.6,1.7l-0.2-0.7l0,0l-0.2-0.7h-0.7H10H9.6L9.4,0.6L6.5,3C6.1,3.3,6,3.9,6.3,4.3
	S7,4.9,7.5,4.7l1.2-0.5l0.5,5.6l0.1,0.6l0.5,0.2l0,0l0.6,0.3L5,22.2c-0.2,0.4-0.1,1,0.3,1.3c0.4,0.3,1,0.2,1.3-0.1l9.3-10L17.7,14.1
	L17.7,14.1z M10.7,2.2L10.7,2.2L10.7,2.2L10.7,2.2z M15.4,10.9l-3.3-1.4l-0.9-0.4l-0.4-5L15.4,10.9z M12.2,11.7l1.8,0.8l-4.4,4.7
	L12.2,11.7z M15.7,12.1l0.2-0.5l0,0L15.7,12.1L15.7,12.1z"/>
		</svg>
	</div>
</template>

<script>
export default {
	props: ['isOn']
}
</script>