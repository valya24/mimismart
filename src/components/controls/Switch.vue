<template>
	<div class="switch"
		@click="$emit('change', !checked)"
		:class="{ 'on': checked }">
		<div class="cir">
			<img class="error-sign" src="@/assets/icon-switch-error.svg" alt />
		</div>
	</div>
</template>

<script>
export default {
	props: ['checked'],
	model: {
		prop: 'checked',
		event: 'change'
	}
}
</script>

<style lang="less" scoped>

.theme-dark {
	.switch {
		background: @colorBgDark300;
	}
	.on .switch {
		background: @colorMainDark !important;
		.cir {background: #fff;}
	}
	.cir {background: rgba(255,255,255,0.5);}
}

.switch {
	width: 48px;
	flex-shrink: 0;
	height: 24px;
	background: #c4c4c4;
	border-radius: 48px;
	position: relative;
	z-index: 1;
	cursor: pointer;
	transition: background @defaultTrsTime;
	.on &,
	&.on {
		background: @colorMain;
		.cir {transform: translateX(24px);}
		&.small .cir {transform: translateX(12px);}
	}
	.error & {
		background: @colorRedDark;
	}
	&.small {
		height: 12px;
		width: 24px;
		.cir {
			width: 8px;
			height: 8px;
			top: 2px;
			left: 2px;
		}
	}
}
.cir {
	width: 14px;
	height: 14px;
	background: #fff;
	border-radius: 50%;
	position: absolute;
	z-index: 1;
	top: 5px;
	left: 5px;
	transition: transform @defaultTrsTime, background @defaultTrsTime;
}
.error-sign {
	display: none;
	.error & {
		display: block;
	}
}
</style>