<template>
	<div class="icon-fountain" :class="{on: isOn}">
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path class="fill-variable" d="M20,18h-2v-2c0-1.1-0.9-2-2-2h-1v-3.5c1.7-0.8,2.9-2.5,3-4.5l0-1h-5c0.1-0.6,0.3-1.2,0.7-1.7
				c0.3-0.4,0.3-1.1-0.1-1.4c-0.4-0.3-1.1-0.3-1.4,0.1c-0.1,0.1-0.1,0.2-0.2,0.3C11,0.9,9.4,0,7.5,0C6.2,0,5,0.4,4,1.2
				C3.2,1.9,2.7,2.7,2.3,3.7C2.1,4.2,2.4,4.8,2.9,4.9C3.4,5.1,4,4.9,4.2,4.3c0.2-0.6,0.6-1.1,1.1-1.6C5.9,2.3,6.7,2,7.5,2
				c1.8,0,3.2,1.3,3.4,3H6l0,1c0.1,2,1.3,3.7,3,4.5V14H8c-1.1,0-2,0.9-2,2v2H4c-1.1,0-2,0.9-2,2v2c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2
				v-2C22,18.9,21.1,18,20,18z M8.2,7h7.6c-0.5,1.2-1.6,2-2.9,2h-1.7C9.8,9,8.7,8.2,8.2,7z M13,11v3h-2v-3h0.1h1.7H13z M8,16h2
				c0,0,0,0,0,0h4c0,0,0,0,0,0h2v2H8V16L8,16z M20,22H4l0-2h0h4h8h4V22z M22,5.5v1c0,0.6-0.4,1-1,1s-1-0.4-1-1v-1C20,3.6,18.4,2,16.5,2
				c-0.3,0-0.5,0-0.8,0.1c-0.5,0.1-1.1-0.2-1.2-0.8s0.2-1.1,0.8-1.2C15.7,0,16.1,0,16.5,0C19.5,0,22,2.5,22,5.5z M4,6v0.5
				c0,0.6-0.4,1-1,1s-1-0.4-1-1V6c0-0.6,0.4-1,1-1S4,5.4,4,6z M21,12c-0.6,0-1-0.4-1-1v-1c0-0.6,0.4-1,1-1s1,0.4,1,1v1
				C22,11.6,21.6,12,21,12z M3,11c-0.6,0-1-0.4-1-1V9c0-0.6,0.4-1,1-1s1,0.4,1,1v1C4,10.6,3.6,11,3,11z M3,15c-0.6,0-1-0.4-1-1v-1
				c0-0.6,0.4-1,1-1s1,0.4,1,1v1C4,14.6,3.6,15,3,15z"/>
		</svg>
	</div>
</template>

<script>
export default {
	props: ['isOn']
}
</script>