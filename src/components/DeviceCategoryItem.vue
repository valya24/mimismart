<template>
	<div class="device-cat"
		:class="{ '--pressed': touching }"
		@touchstart="handleTouchstart"
		@touchend="handleTouchend"
		@blur="handleTouchend"
		@contextmenu.prevent.stop=""
		@click="$emit('click')"
	>
		<div class="icon-tile-wrap">
			<div class="icon-tile" :class="{'on': isOn}">
				<icon-comp :isOn="isOn" :iconName="'icon-'+icon" :value="JALOUSIE_CLOSED" />
			</div>
		</div>
		<div class="device-name" v-if="name">
			&nbsp;
			<br />&nbsp;
			<div class="name-holder">{{ name }}</div>
		</div>
	</div>
</template>

<script>
import { JALOUSIE_CLOSED } from "@/utils/consts/consts.js";

export default {
	props: {
		isOn: Boolean,
		icon: String,
		name: String
	},
	data() {
		return {
			JALOUSIE_CLOSED,
			touching: false,
			holding: false,
			lockTouching: true,
			touchEnded: false,
		};
	},
	methods: {
		handleTouchstart() {
			this.touchEnded = false;
			this.holding = false;
			this.touching = true;
			this.lockTouching = true;
			setTimeout(() => {
				if (this.touchEnded) {
					this.touching = false;
				}
				this.lockTouching = false;
			}, 135);
		},
		handleTouchend() {
			this.touchEnded = true;
			// if (!this.holding) {
			// 	this.$emit('change', { addr: this.addr, isOn: !this.isOn });
			// }
			if (!this.lockTouching) {
				this.touching = false;
			}
		},
	},
};
</script>

<style lang="less" scoped>
.device-cat {
	position: relative;
	z-index: 1;
	width: @catTileWidth;
}
.icon-tile-wrap {
	width: @catTileWidth;
	height: @catTileHeight;
	position: relative;
	transition: .2s cubic-bezier(.47,-0.67,.39,1.68);
}
.device-cat.--pressed {
	.icon-tile-wrap {
		transform: scale(0.87);
	}
}
.icon-tile {
	background: #fff;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	color: @colorMain;
	box-shadow: 0px 3px 6px rgba(83, 93, 255, 0.15);
	.icon-holder {
		width: @catTileIconSize;
		height: @catTileIconSize;
	}
	&::before {
		content: "";
		border-radius: inherit;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background: linear-gradient(135deg, #535dff 13.46%, #897df5 84.13%);
		transition: opacity @defaultTrsTime;
		opacity: 0;
	}
	&.on {
		&::before {
			opacity: 1;
		}
	}
}
.device-name {
	text-align: center;
	font-size: @catTileTextSize;
	margin-top: @catTileTextTopMargin;
	position: relative;
	z-index: 1;
	.name-holder {
		position: absolute;
		top: 0;
		width: @catTileNameHolderWidth;
		left: 50%;
		margin-left: -@catTileNameHolderWidth / 2;
	}
}
</style>