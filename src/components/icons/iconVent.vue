<template>
	<div class="icon-alarm" :class="{on: isOn}">
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path class="fill-variable" d="M9.9,24c-0.8,0-1.4-0.3-1.8-0.8c-0.4-0.5-0.5-1.3-0.4-2.2l0,0c0.1-1.3,0.6-3,1.5-5.2l0.4-1l1,0.4
				c0.7,0.3,1.6,0.4,2.4,0.2l1.1-0.3l0.1,1.2c0.2,1.7,0.1,3-0.3,4.1C12.9,23,11.1,24,9.9,24z M9.8,22c0,0,0.1,0,0.1,0
				c0.4,0,1.4-0.5,2.1-2.3c0.2-0.5,0.3-1.3,0.3-2.2c-0.5,0-1,0-1.5-0.2c-0.6,1.6-0.9,2.8-1,3.7v0C9.6,21.6,9.7,21.9,9.8,22
				C9.8,22,9.8,22,9.8,22z M21.4,16.3c-0.2,0-0.3,0-0.5,0c-1.3-0.1-3-0.6-5.2-1.5l-1-0.4l0.4-1c0.2-0.5,0.3-1,0.3-1.5
				c0-0.3,0-0.6-0.1-0.9L15.1,10l1.2-0.1c1.7-0.2,3-0.1,4.1,0.3c2.7,0.9,3.6,2.7,3.6,4c0,0.8-0.3,1.4-0.8,1.8
				C22.7,16.2,22.1,16.3,21.4,16.3z M17.4,13.3c1.6,0.6,2.8,0.9,3.7,1l0,0c0.5,0,0.8,0,0.9-0.1c0,0,0-0.1,0-0.1c0-0.4-0.5-1.4-2.3-2.1
				c-0.5-0.2-1.3-0.3-2.2-0.3c0,0.1,0,0.1,0,0.2C17.5,12.4,17.5,12.9,17.4,13.3z M6.2,14.2c-1,0-1.9-0.1-2.6-0.4l0,0
				C1,12.9,0,11.1,0,9.9c0-0.8,0.3-1.4,0.8-1.8c0.5-0.4,1.3-0.5,2.2-0.4c1.3,0.1,3,0.6,5.2,1.5l1,0.4l-0.4,1c-0.2,0.5-0.3,1-0.3,1.5
				c0,0.3,0,0.6,0.1,0.9L8.9,14l-1.2,0.1C7.2,14.2,6.7,14.2,6.2,14.2z M4.3,11.9c0.5,0.2,1.3,0.3,2.2,0.3c0-0.1,0-0.1,0-0.2
				c0-0.4,0.1-0.9,0.2-1.3c-1.6-0.6-2.8-0.9-3.7-1c-0.5,0-0.8,0-0.9,0.1c0,0,0,0.1,0,0.1C2,10.3,2.5,11.3,4.3,11.9L4.3,11.9z M14.4,9.2
				l-1-0.4c-0.7-0.3-1.6-0.4-2.4-0.2L10,8.9L9.9,7.7c-0.2-1.7-0.1-3,0.3-4.1C11.1,1,12.9,0,14.1,0c0.8,0,1.4,0.3,1.8,0.8
				c0.4,0.5,0.5,1.3,0.4,2.2l0,0c-0.1,1.3-0.6,3-1.5,5.2L14.4,9.2z M12,6.5c0.4,0,0.9,0.1,1.3,0.2c0.6-1.6,0.9-2.8,1-3.7l0,0
				c0-0.5,0-0.8-0.1-0.9c0,0-0.1,0-0.1,0c-0.4,0-1.4,0.5-2.1,2.3c-0.2,0.5-0.3,1.3-0.3,2.2C11.9,6.5,11.9,6.5,12,6.5z"/>
			<path class="fill-const" d="M12,14.5c-1.4,0-2.5-1.1-2.5-2.5s1.1-2.5,2.5-2.5s2.5,1.1,2.5,2.5S13.4,14.5,12,14.5z"/>
		</svg>
	</div>
</template>

<script>
export default {
	props: ['isOn']
}
</script>