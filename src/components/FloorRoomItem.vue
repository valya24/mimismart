<template>
  <transition name="fade">
	<div class="floor-room-item">
		<div class="room-image">
			<img :src="data.image ? data.image : roomImage" alt="">
		</div>
		<div class="room-name">{{ data.name }}</div>
		<div class="room-devices">{{ $t('elements') }} {{ $t(data.amount, 'devices') }}</div>

		<RoomSensorsShort :sensorsAddrs="data.sensorsAddrs" />
	</div>
  </transition>
</template>

<script>
import RoomSensorsShort from "@/components/RoomSensorsShort";
export default {
	props: {
		data: Object
	},
	data() {
		return {
			roomImage: require('@/assets/room-image_1.jpg'),
		}
	},
  components: {
		RoomSensorsShort
	}
};
</script>

<style lang="less" scoped>

.theme-dark {
	.floor-room-item {
		background: lighten(@colorBgDark, 5%);
		box-shadow: 0px 4px 24px rgba(25, 27, 50, 0.2);
	}
}
.room-image {
	position: relative;
	height: @roomImageHeight;
	background-size: cover;
	border-radius: 10px 10px 0 0;
	margin-bottom: 16px;
	margin-left: -16px;
	margin-right: -16px;
	overflow: hidden;
	img {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		min-width: 100%;
		min-height: 100%;
		height: auto;
		width: 100%;
	}
}
.room-name {
	font-size: 18px;
}
.room-devices {
	font-size: 12px;
	color: #a1a1a1;
	margin-bottom: 16px;
}
.floor-room-item {
	flex-shrink: 0;
	display: inline-block;
	vertical-align: middle;
	// flex-basis: 180px;
	padding-bottom: 16px;
	padding-left: 16px;
	padding-right: 16px;
	width: @floorCardWidth;
	margin-right: 24px;
	background: #fff;
	border-radius: @floorCardRadius;
	box-shadow: 0px 3px 6px rgba(83, 93, 255, 0.15);
	img {
		max-width: 100%;
		border-radius: 10px 10px 0 0;
	}
	.rooms-list & {
		margin-bottom: 16px;
		margin-right: 0;
	}
	&.--active {
		box-shadow: 0px 0px 0px 2px @colorMain;
		.room-name {
			color: @colorMain;
			font-weight: bold;
		}
	}
}
.room-sensors {
	min-height: 24px;
	margin-left: -8px;
}
</style>