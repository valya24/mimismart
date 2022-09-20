<template>
	<div class="folder-item">
		<svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path class="folder-path" fill-rule="evenodd" clip-rule="evenodd" d="M3 0C1.34315 0 0 1.34315 0 3V6V7V47C0 49.7614 2.23858 52 5 52H47C49.7614 52 52 49.7614 52 47V11C52 8.23858 49.7614 6 47 6H28.8571L22.8483 0.74227C22.3014 0.263755 21.5995 0 20.8728 0H3Z"/>
		</svg>
		<div class="folder-preview" @click="alert">
			<icon-comp :iconName="icon" />
			<icon-comp :iconName="icon" />
			<icon-comp :iconName="icon" />
			<icon-comp :iconName="icon" />
		</div>
	</div>
</template>

<script>
export default {
	props: {
		icon: {
			type: String,
			default: 'icon-lamp'
			}
	},
	methods: {
		alert() {
			console.log('alert')
		}
	}
}
</script>

<style lang="less" scoped>
.folder-preview {
	position: absolute;
	top: 8px;
	left: 0;
	right: 0;
	padding: 8px 12px 0;
	display: grid;
	grid-template-columns: 1fr 1fr;
	column-gap: 8px;
	row-gap: 0px;
	.icon-holder {
		width: 100%;
		// height: auto;
		margin-left: auto;
		margin-right: auto;
	}
}
.folder-item {
	position: relative;
	z-index: 1;
	svg {
		overflow: visible;
		//box-shadow: 0px 3px 6px rgba(83, 93, 255, 0.15);
		width: 100%;
		-webkit-filter: drop-shadow( 0px 3px 6px rgba(83, 93, 255, 0.15));
		filter: drop-shadow( 0px 3px 6px rgba(83, 93, 255, 0.15));
	}
}
.folder-path {
	fill: #fff;
	border-radius: 5px;
}
.example {
	-webkit-filter: drop-shadow( 3px 3px 2px rgba(0, 0, 0, .7));
	filter: drop-shadow( 3px 3px 2px rgba(0, 0, 0, .7));
}
</style>