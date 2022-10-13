<template>
	<div class="icon-alarm" :class="{on: isOn}">
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path class="fill-const" d="M11,8h2c0.6,0,1,0.4,1,1v6c0,0.6-0.4,1-1,1h-2c-0.6,0-1-0.4-1-1V9C10,8.4,10.4,8,11,8z"/>
			<path class="fill-variable" d="M19,24H5c-1.7,0-3-1.3-3-3V3c0-1.7,1.3-3,3-3h14c1.7,0,3,1.3,3,3v18C22,22.7,20.7,24,19,24z M5,2
				C4.4,2,4,2.4,4,3v18c0,0.6,0.4,1,1,1h14c0.6,0,1-0.4,1-1V3c0-0.6-0.4-1-1-1H5z M13,17h-2c-1.1,0-2-0.9-2-2V9c0-1.1,0.9-2,2-2h2
				c1.1,0,2,0.9,2,2v6C15,16.1,14.1,17,13,17z M11,9L11,9v6h2V9H11z M12,3c0.6,0,1,0.4,1,1s-0.4,1-1,1s-1-0.4-1-1S11.4,3,12,3z M12,19
				c0.6,0,1,0.4,1,1s-0.4,1-1,1s-1-0.4-1-1S11.4,19,12,19z"/>
		</svg>
	</div>
</template>

<script>
export default {
	props: ['isOn']
}
</script>