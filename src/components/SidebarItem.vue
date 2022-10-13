<template>
	<router-link :to="to" class="room-item card-white hbox alic">
		<div class="col-img">
			<div class="room-img" :style="'background-image:url('+ (image ? image : roomImage) +')'"></div>
		</div>
		<div class="col-meta">
			<div class="title">{{ roomName }}</div>
			<RoomSensorsShort :sensorsAddrs="sensors" />
		</div>
	</router-link>
</template>

<script>
import RoomSensorsShort from "@/components/RoomSensorsShort";
export default {
	props: ["roomName", "to", "sensors", "image"],
	components: {
		RoomSensorsShort
	},
	data() {
		return {
			roomImage: require('@/assets/room-image_1.jpg'),
		};
	}
};
</script>

<style lang="less" scoped>
.room-item {
	text-decoration: none;
	padding: 0;
	transition: background 0.25s;
	margin: 0 16px 16px;
	border-radius: 10px;
	color: inherit;
	&:visited {color: inherit;}
}
.router-link-exact-active {
	box-shadow: 0px 0px 0px 2px @colorMain;
	.title {
		color: @colorMain;
		font-weight: bold;
	}
}
.room-img {
	width: 80px;
	height: 90px;
	background-size: cover;
	background-position: center center;
	margin-right: 16px;
	border-radius: 8px 0 0 8px;
}
.col-meta {
	.room-sensors {
		margin-top: 6px;
		.icon-holder {
			width: 24px;
			height: 24px;
		}
	}
}
</style>
