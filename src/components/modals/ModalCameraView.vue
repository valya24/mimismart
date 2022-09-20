<template>
	<div
		class="modal-camera-view"
		@touchmove="(e) => e.preventDefault()"
	>
		<div class="head">
			<div class="row-room-name hbox alic">
				<div class="col-btn">
					<BtnIcon icon="icon-close" />
				</div>
				<div class="col-room-name fg1">Гостиная</div>
				<div class="col-btn">
					<BtnIcon icon="icon-volume-mid" />
				</div>
			</div>
			<div class="row-cameras hbox just-cn">
				<div class="cam-name --active">Камера 1</div>
				<div class="cam-name">Камера 2</div>
			</div>
		</div>
		<div class="camera-view">
			<img src="https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" alt="">
		</div>
		<div class="camera-joystick-wrap">
			<div class="camera-joystick">
				<div class="camera-stick"></div>
			</div>
		</div>
	</div>
</template>

<script>
import BtnIcon from "@/components/buttons/BtnIcon.vue";
export default {
	props: {
		deviceName: {
			type: String,
			default: ""
		},
		tabs: {
			type: Array
		},
	},
	data() {
		return {
			activeTabName: this.tabs[0],
		};
	},
	methods: {
		showSettingsPopup() {
			this.$store.commit("modules/popups/showPopup", "deviceSettings");
		},
		hide() {
			this.$emit('hide');
		}
	},
	components: {
		BtnIcon
	}
};
</script>

<style lang="less" scoped>
.head {
	.btn-icon {
		fill: #fff
	}
}
.camera-joystick-wrap {
	display: flex;
	align-items: center;
	justify-content: center;
	margin: auto 0;
}
.camera-joystick {
	width: 150px;
	height: 150px;
	background-color: rgba(0, 0, 0, 0.12);
	background-image: url('../../assets/camera-joystick.svg');
	background-position: 50% 50%;
	border: 2px solid rgba(255, 255, 255, 0.28);
	border-radius: 20px;
	position: relative;
	z-index: 1;
	.camera-stick {
		background: rgba(255, 255, 255, 0.16);
		width: 60px;
		height: 60px;
		border-radius: 50%;
		position: absolute;
	}
}
.camera-view {
	margin: auto 0;
	img {max-width: 100%;}
}
.cam-name {
	margin: 0 8px;
	opacity: 0.5;
	&.--active {
		opacity: 1;
	}
}
.col-room-name {
	text-align: center;
	font-size: 12px;
}
.modal-camera-view {
	background: #2A2E31;
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 101;
	color: #fff;
	display: flex;
	flex-direction: column;
}
@media (min-width: @phones) {
	
}
</style>