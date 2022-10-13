<template>
	<div class="icon-alarm" :class="{on: isOn}">
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<polygon class="fill-const" points="17,10 17,20 13,20 13,10 11,10 11,20 7,20 7,10 5,10 5,22 19,22 19,10 "/>
			<path class="fill-variable" d="M5,2v8h14V2H5z M17,8H7V4h10v1h-3c-0.6,0-1,0.4-1,1c0,0.6,0.4,1,1,1h3V8z"/>
		</svg>
	</div>
</template>

<script>
export default {
	props: ['isOn']
}
</script>