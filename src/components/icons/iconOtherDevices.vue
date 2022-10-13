<template>
	<div class="icon-alarm" :class="{on: isOn}">
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path class="fill-variable" d="M6,5C5.4,5,5,5.4,5,6v12c0,0.6,0.4,1,1,1h12c0.6,0,1-0.4,1-1V6c0-0.6-0.4-1-1-1H6z M21,7v2h3v2h-3v2h3v2h-3v2h3
				v2h-3.2c-0.3,0.8-1,1.5-1.8,1.8V24h-2v-3h-2v3h-2v-3h-2v3H9v-3H7v3H5v-3.2c-0.8-0.3-1.5-1-1.8-1.8H0v-2h3v-2H0v-2h3v-2H0V9h3V7H0V5
				h3.2c0.3-0.8,1-1.5,1.8-1.8V0h2v3h2V0h2v3h2V0h2v3h2V0h2v3.2c0.8,0.3,1.5,1,1.8,1.8H24v2H21z M7,10.3l0.9,1c2.3-2.6,5.9-2.6,8.2,0
				l0.9-1C14.2,7.2,9.8,7.2,7,10.3z M10.6,14.5L12,16l1.4-1.5C12.6,13.6,11.4,13.6,10.6,14.5z M8.8,12.4l0.9,1c1.3-1.4,3.3-1.4,4.5,0
				l0.9-1C13.4,10.4,10.6,10.4,8.8,12.4z"/>
		</svg>
	</div>
</template>

<script>
export default {
	props: ['isOn']
}
</script>