<template>
	<div class="change-room-photo">
		<Header>
			<div class="hbox just-sb alic">
				<BtnIcon icon="icon-back" @click.native="$router.back()" />
				<div class="header-title">Выбрать фото</div>
				<div class="col-filler"></div>
			</div>
			<div class="tabs-nav">
				<span class="--active">Из стандартных</span>
				<span>Камера</span>
				<span>Галерея телефона</span>
			</div>
		</Header>
		<div class="photopicker">
			<div
				class="photo"
				v-for="(image, i) in images"
				:key="i"
				:style="{ 'background-image': `url(${image})` }"
				:class="{ '--selected': image == currentRoomImage }"
				@click="selectRoomPhoto(image)"
			></div>
		</div>
	</div>
</template>

<script>
import Header from "@/components/Header.vue";

const images = [
	`images/default-room-pics/bathroom1.jpeg`,
	`images/default-room-pics/bathroom2.jpeg`,
	`images/default-room-pics/bedroom1.jpeg`,
	`images/default-room-pics/bedroom2.jpeg`,
	`images/default-room-pics/children1.jpeg`,
	`images/default-room-pics/children2.jpeg`,
	`images/default-room-pics/corridor1.jpg`,
	`images/default-room-pics/corridor2.jpg`,
	`images/default-room-pics/kitchen1.jpeg`,
	`images/default-room-pics/kitchen2.jpeg`,
	`images/default-room-pics/living1.jpeg`,
	`images/default-room-pics/living2.jpeg`,
	`images/default-room-pics/officeroom1.jpeg`,
	`images/default-room-pics/officeroom2.jpg`,
	`images/default-room-pics/su1.jpeg`,
	`images/default-room-pics/su2.jpeg`
];

export default {
	data() {
		return {
			images,
			imageChanged: false
		};
	},
	computed: {
		currentRoomData() {
			return this.$store.getters.getRoomDataById(this.$route.params.id);
		},
		currentRoomImage() {
			return this.currentRoomData ? this.currentRoomData.attributes.image : null;
		}
	},
	methods: {
		selectRoomPhoto(image) {
			this.imageChanged = true;
			this.currentRoomData.attributes.image = image;
		}
	},
	beforeRouteLeave(to, from, next) {
		if (this.imageChanged) {
			this.$store.dispatch('changeGlobalXml');
		}
		next();
	},
	components: {
		Header
	},
};
</script>

<style lang="less" scoped>
.change-room-photo {
	padding-bottom: 120px;
}
.photopicker {
	display: grid;
	padding: 24px;
	grid-gap: 24px;
	margin-top: 43px;
	grid-template-columns: 1fr 1fr;
}
.photo {
	// background-image: url("../../assets/default-pics/bathroom1.jpeg");
	background-size: cover;
	padding-top: 100%;
	border-radius: 5px;
	box-shadow: 0px 3px 6px rgba(83, 93, 255, 0.15);
	position: relative;
	z-index: 1;
	transition: .25s;
	&.--selected {
		border: 2px solid #00d348;
		&::before {
			content: url("../../assets/check-cir.svg");
			position: absolute;
			top: 50%;
			left: 50%;
			margin-left: -6px;
			margin-top: -6px;
			transform: scale(2);
		}
	}
}
.header {
	flex-direction: column;
	align-items: stretch;
	padding-left: 0;
	padding-right: 0;
}
.col-filler {
	width: @btnHeight;
}
</style>