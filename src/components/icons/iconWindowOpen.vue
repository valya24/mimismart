<template>
	<div class="icon-alarm" :class="{on: isOn}">
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<polygon class="fill-const" points="14,3 14,5 17,5 17,19 14,19 14,21 19,21 19,3 " />
			<path class="fill-variable" d="M5,3v18l9,1V2L5,3z M7,4.8l5-0.6v2.4L7,6.9V4.8z M7,8.9l2-0.1v10.7l-2-0.2V8.9z M10,19.5V13V8.7l2-0.1V12h-1
				c-0.6,0-1,0.4-1,1c0,0.6,0.4,1,1,1h1v5.8L10,19.5z" />
		</svg>
	</div>
</template>

<script>
	export default {
		props: ['isOn']
	}
</script>