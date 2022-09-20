<template>
	<div class="icon-alarm" :class="{on: isOn}">
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path class="fill-const" d="M18.4,9L19,8.1V22H5V8.1L5.6,9H7v11h4V10h2v10h4V9H18.4z M5,2v4h2V4h10v2h2V2H5z"/>
			<path class="fill-variable" d="M19,10H5L2,5h20L19,10z M6.1,8h11.7l0.6-1H5.5L6.1,8z"/>
		</svg>
	</div>
</template>

<script>
export default {
	props: ['isOn']
}
</script>