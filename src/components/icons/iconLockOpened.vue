<template>
	<div class="icon-lock-closed" :class="{on: isOn}">
		<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
			<rect fill="none" x="5" y="9" width="14" height="12" rx="1" class="stroke-variable" stroke-width="2"/>
			<circle cx="12" cy="15" r="2" class="fill-const"/>
			<path fill="none" d="M16 9V5.5C16 3.567 17.567 2 19.5 2V2C21.433 2 23 3.567 23 5.5V6" class="stroke-variable" stroke-width="2"/>
		</svg>
	</div>
</template>

<script>
export default {
	props: ['isOn']
}
</script>