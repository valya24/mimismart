<template>
	<div class="swipe-home-screen" :class="{ 'ready-to-release': ready }">
		<div class="text" style="visibility: hidden;">
			К списку
			<br />комнат
		</div>

		<!-- TODO: Refactor - hard-coded color var -->
		<div class="pill-container" :style="{ 'color': ready ? '#A6ABFF' : bgColor }">
			<!-- <div class="pill">
				
			</div> -->
			<div class="cir">
				<icon-comp class="isOn" iconName="icon-home-f" />
			</div>
		</div>
		
		<div class="text">
			К списку
			<br />комнат
		</div>
	</div>
</template>

<script>
export default {
	props: {
		ready: Boolean,
		bgColor: {
			type: String,
			default: '#E1E6ED'
		}
	}
};
</script>

<style lang="less" scoped>
.swipe-home-screen {
	padding: 0 5px;
	// background: #E1E6ED;
	height: 100px;
	position: fixed;
	top: 0;
	width: 100%;
	height: 100%;
	z-index: 2;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	font-size: 12px;
	color: #fff;
	// overflow: hidden;
}
.ready-to-release {
	// background: @colorPaleBlue;
	.text {
		opacity: 1;
	}
	.pill-container {
		color: @colorPaleBlue;
	}
}
.pill-container {
	// display: flex;
	position: relative;
	width: 100%;
	// width: 25%;
	height: 24px;
	// border-radius: 100px;
	// overflow: hidden;
	color: #E1E6ED;
	transition: .25s;
	&::after {
		content: '';
		position: absolute;
		top: 0;
		right: -10px;
		z-index: 1;
		display: block;
		height: 100%;
		width: 22px;
		background-color: currentColor;
	}
}
.pill {
	position: absolute;
	// right: 0;
	right: 17px;
	width: 100vw;
	z-index: 1;
	height: 24px;
	background: rgba(0, 0, 0, 0.1);
}
.cir {
	position: relative;
	z-index: 2;
	margin-left: auto;
	width: 24px;
	height: 24px;
	background: #fff;
	border-radius: 50%;
	display: flex;
	justify-content: center;
	align-items: center;

	.icon-holder {
		opacity: 0.5;
		width: 16px;
		height: 16px;
	}
	
}
.text {
	margin-top: 8px;
	opacity: 0;
	text-align: center;
	transition: opacity @defaultTrsTime;
	white-space: nowrap;
}

@media screen and (min-width: @phones) {
	.swipe-home-screen {
		display: none;
	}
}
</style>