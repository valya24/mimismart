<template>
	<div class="icon-alarm" :class="{on: isOn}">
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<path class="fill-variable" d="M5,3v6v12h6v0h2v0h6V9V3H5z M7,5h10v2H7V5z M7,19V9h4v10H7z M17,12h-1c-0.6,0-1,0.4-1,1c0,0.6,0.4,1,1,1h1v5h-4
				V9h4V12z"/>
		</svg>
	</div>
</template>

<script>
export default {
	props: ['isOn']
}
</script>