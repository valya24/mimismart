<template>
	<div class="icon-alarm" :class="{on: isOn}">
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path class="fill-variable" d="M12,5.2c-0.1,0-0.2,0-0.3,0l-1.5-1.5c-0.4-0.4-1-0.4-1.4,0s-0.4,1,0,1.4l1.5,1.5c0,0.1,0,0.2,0,0.3
				c0,1,0.8,1.8,1.8,1.8c1,0,1.8-0.8,1.8-1.8C13.8,6,13,5.2,12,5.2z"/>
			<rect class="fill-const" x="8" y="16" width="8" height="5"/>
			<path class="fill-variable" d="M18,16c0-1.1-0.9-2-2-2h-1v-0.7h0c2.4-1.2,4-3.6,4-6.3c0-3.9-3.1-7-7-7C8.1,0,5,3.1,5,7
				c0,2.7,1.6,5.2,4,6.3V14H8c-1.1,0-2,0.9-2,2h-8v5h8c0,1.1,0.9,2,2,2h8c1.1,0,2-0.9,2-2h8v-5H18z M7,7c0-2.8,2.2-5,5-5s5,2.2,5,5
				c0,1.9-1.1,3.7-2.9,4.5L13,12.1V14h-2v-1.9l-1.1-0.5C8.1,10.7,7,8.9,7,7z M0,19v-1h6v1H0z M16,17v1v1v1v1H8v-1v-1v-1v-1v-1h2v0h4v0
				h2V17z M24,19h-6v-1h6V19z"/>
		</svg>
	</div>
</template>

<script>
export default {
	props: ['isOn']
}
</script>