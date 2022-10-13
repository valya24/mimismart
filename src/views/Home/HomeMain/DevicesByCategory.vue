<template>
	<div class="devices-by-category-page">
		
		<div class="swiper-container" ref="swiperContainer"
			:class="{ '--ready-to-release': readyToRelease }">
			<div class="pill"></div>

			<div class="swiper-wrapper">
				<SwipeHomeScreen
					:style="{ 'width': pulledWidth + 'px' }"
					:ready="readyToRelease"
					bgColor="#f7f7f7"
				/>
				<div class="locations-list swiper-slide"
					:class="{ '--show-addresses': showDeviceAddresses }"
					v-for="(category, catKey) in deviceGroups" :key="catKey"
				>
					<LocationItem v-for="(room, i) in getRooms(catKey)" :key="i"
						:title="room.attributes.name"
						:items="filterIcons(filterRoomItems(getRoomItems(room.__.id), catKey))"
						:widgets="filterWidgets(filterRoomItems(getRoomItems(room.__.id), catKey))"
						:toggleTitle="getToggleButtonTitle(catKey)"
						:type="catKey"
						:toggleButtonIcon="getToggleButtonIcon(catKey)"
						:widgetsOnTop="widgetsOnTop"

						@callControlApp="handleCallControlApp"

						:roomData="room"
					/>
				</div>
			</div>
		</div>

		<ControlAppManager
			:addr="activeItem.attributes.addr"
		/>

		<ModalDeviceSettings
			:deviceName="activeItem.attributes.name"
			:addr="activeItem.attributes.addr"
			v-if="activePopup == 'deviceSettings'"
			@hide="$store.commit('modules/popups/showPopup', 'deviceControl')"
		></ModalDeviceSettings>

		<ModalInputPassword
			@pass="$store.commit('modules/singleAction/passPassword')"
			@hide="$store.commit('modules/singleAction/rejectPassword')"
		/>
	</div>
</template>

<script>
// import Header from "@/components/Header";
// import DeviceCategoryItem from "@/components/DeviceCategoryItem";

import ControlAppManager from "@/components/deviceControlApps/ControlAppManager.vue";
import ModalDeviceSettings from "@/components/modals/ModalDeviceSettings";
import ModalInputPassword from "@/components/modals/ModalInputPassword";

import LocationItem from "@/components/containers/LocationItem.vue";

import sensorDeviceInterfaces from "@/utils/sensorDeviceInterfaces.js";
import { JALOUSIE_CLOSING, JALOUSIE_OPENING, hiddenItemTypes } from '@/utils/consts/consts.js';

import { hsvToHex } from "@/utils/transformers.js";

import Swiper from 'swiper';

import SwipeHomeScreen from "@/components/etc/SwipeHomeScreen.vue";

export default {
	data() {
		return {
			sensorDeviceInterfaces,
			activeItem: { attributes: {} },

			pulledWidth: 0,
			readyToRelease: false,

			slider: null
		}
	},
	computed: {
		activePopup() {
			return this.$store.state.modules.popups.activePopup;
		},
		showSystem() {
			return this.$store.state.modules.settings.interface.showSystem;
		},
		devicesSort() {
			return this.$store.state.modules.settings.interface.devicesSort;
		},
		deviceGroups() {
			return this.$store.state.groups;
		},
		// areas() {
		// 	return this.$store.state.areas.area;
		// },
		floors() {
			return this.$store.state.floors;
		},
		// rooms() {
		// 	return this.areas
		// 		.reduce( (accum, item) => item.$.system == 'yes' ? accum : accum.concat(item.area), [])
		// 		.filter( item => item.$.system != 'yes' && this.filterRoomItems([].concat(item.item, item._areaItems, item._refItems)).length );
		// },
		// rooms() {
		// 	return this.floors.
		// 		.reduce( (accum, floor) => {
		// 			if (floor.attributes.system == 'yes') {
		// 				return accum;
		// 			 } else {
		// 				 return accum.concat()
		// 			 }
		// 		}, [])
		// 		.filter( item => item.$.system != 'yes' && this.filterRoomItems([].concat(item.item, item._areaItems, item._refItems)).length );
		// },

		watchedSensors() {
			return this.$store.state.modules.watchedSensors.watchedSensorDevices;
		},

		widgetsOnTop() {
			return this.$store.state.modules.settings.interface.widgetsOnTop;
		},
		showDeviceAddresses() {
			return this.$store.state.modules.settings.interface.showDeviceAddresses;
		},

		toggleButtonTitle() {
			if (this.$route.params.category == 'lights') {
				return this.$t('Turn off all');
			} else if (this.$route.params.category == 'shades') {
				return this.$t('Close all');
			} else {
				return '';
			}
		}
	},
	methods: {
		// getRooms(category) {
		// 	return this.areas
		// 		.reduce( (accum, item) => item.$.system == 'yes' ? accum : accum.concat(item.area), [])
		// 		.filter( item => item.$.system != 'yes' && this.filterRoomItems([].concat(item.item, item._areaItems, item._refItems), category).length );
		// },
		getFloorRooms(floorId) {
			return this.$store.getters.getFloorRooms(floorId);
		},
		getRooms(category) {
			return this.floors
				.reduce( (accum, floor) => {
					if (floor.attributes.system == 'yes') {
						return accum;
					} else {
						return accum.concat(this.getFloorRooms(floor.__.id));
					}
				}, [])
				.filter( room => room.attributes.system != 'yes' && this.filterRoomItems(this.getRoomItems(room.__.id), category).length );
		},
		getRoomItems(roomId) {
			return this.$store.getters.getRoomItems(roomId)
		},

		filterRoomItems(itemArr, category) {
			let arr = (!itemArr || !itemArr.length) ? [] : itemArr;

			category = category ? category : this.$route.params.category;
			let outArr = arr
				.filter( item => (item.attributes["sub-type"] ? this.deviceGroups[category].types.includes(item.attributes["sub-type"]) : this.deviceGroups[category].types.includes(item.attributes.type)) );
			
			if (this.devicesSort == "byName") {
				outArr.sort( (b, a) => a.attributes.name.localeCompare(b.attributes.name) );
			}
			if (this.showSystem) {
				return [].concat(
					outArr.filter( item => item.attributes.system != "yes" && !hiddenItemTypes.includes(item.attributes.type)),
					outArr.filter( item => item.attributes.system == "yes" && hiddenItemTypes.includes(item.attributes.type))
				)
				// return outArr.sort( (a, b) => (a.attributes.system == "yes" && b.attributes.system != "yes" ? 1 : -1 ) )
			} else {
				return outArr.filter( item => item.attributes.system != "yes" && !hiddenItemTypes.includes(item.attributes.type));
			}
		},
		filterIcons(itemArr) {
			return itemArr.filter( item => item.attributes.widget != 'yes' );
		},
		filterWidgets(itemArr) {
			return itemArr.filter( item => item.attributes.widget == 'yes' );
		},
		getAllCategoryDevices(category) {
			return this.getRooms(category)
				.reduce( (accum, room) => accum.concat(this.filterRoomItems(this.getRoomItems(room.__.id), category)), []);
		},

		getToggleButtonTitle(category) {
			if (!category) category = this.$route.params.category;

			if (category == 'lights') {
				return this.$t('Turn off all');
			} else if (category == 'shades') {
				return this.$t('Close all');
			} else {
				return '';
			}
		},
		getToggleButtonIcon(category) {
			if (!category) category = this.$route.params.category;

			return category == 'lights' ? 'icon-power' : '';
		},
		
		handleCategoryNavClick(catKey, index) {
			this.slider.slideTo(index);
		},
		getDeviceOnStatus(item) {
			if (item.attributes.type.includes("leak-sensor")) return Boolean(item.__.status[0]);
			
			if (item.type.includes("sensor")) {
				let watched = this.watchedSensors[item.addr];
				if (watched && watched.enableNotifications) {
					let val = this.getDeviceValue(item);
					return ((watched.watchMin && val < watched.minThreshold) ||
									(watched.watchMax && val > watched.maxThreshold))
				} else {
					return false;
				}
			}

			if (item.type.includes("jalousie") || (item.attributes['sub-type'] && item.attributes['sub-type'].includes("jalousie")))
				return (item.__.status[0] == JALOUSIE_CLOSING) ||
								(item.__.status[0] == JALOUSIE_OPENING);

			return item.__.status[0];
		},
		getDeviceValue(item) {
			//	TODO: maybe refactor this
			if (item.type == 'rgb-lamp') {
				return hsvToHex({
					h: item.__.status[3] * 360 / 250,
					s: item.__.status[2] * 100 / 250,
					v: item.__.status[1]
				});
			}
			return sensorDeviceInterfaces[item.attributes.type] && sensorDeviceInterfaces[item.attributes.type].value ? sensorDeviceInterfaces[item.attributes.type].value(item.__.status) : item.__.status[0];
		},
		getDeviceUnits(item) {
      return sensorDeviceInterfaces[item.attributes.type] && sensorDeviceInterfaces[item.attributes.type].units ? sensorDeviceInterfaces[item.attributes.type].units : '';
		},
		handleCallControlApp(item) {
			this.activeItem = item;
			this.$store.commit("modules/popups/showPopup", "deviceControl");
		},

		subscribeOnAllStatuses(category) {
			let addrArr = this.getAllCategoryDevices(category).map(item => item.attributes.addr);
			this.$store.dispatch("subscribeOnStatuses", { addr: addrArr });
		},

		handleTurnAllOff(itemArr) {
			itemArr.forEach( item => {
				this.$store.dispatch('setStatus', {
					addr: item.attributes.addr,
					status: '0x00'
				});
			})
		},


		initSlider() {
			let vm = this;
			const threshold = 0.22;

			this.slider = new Swiper(this.$refs.swiperContainer, {
				autoHeight: true,
				setWrapperSize: true,
				resistanceRatio: 0.94,
				on: {
					init: function() {
						// console.log(this.activeIndex);
						let categories = Object.entries(vm.deviceGroups).map( item => item[0] );
						let index = categories.indexOf(vm.$route.params.category);
						this.slideTo(index);
					},
					slideChange: function() {
						let categories = Object.entries(vm.deviceGroups).map( item => item[0] );
						let category = categories[this.activeIndex];

						// let targetEl = vm.$refs.navCategories[this.activeIndex].$el;
						// let leftThreshold = 16;
						// let rightThreshold = window.innerWidth - 16;
						// let elLeft = targetEl.getBoundingClientRect().left;
						// let elRight = targetEl.getBoundingClientRect().right;

						// const initScrollLeft = vm.$refs.navCategoriesContainer.scrollLeft;
						// const frames = 18;

						// if (elRight > rightThreshold) {
						// 	let diff = elRight - rightThreshold;

						// 	for (let i = 0; i < frames; i++) {
						// 		setTimeout(() => {
						// 			window.requestAnimationFrame(() => {
						// 				vm.$refs.navCategoriesContainer.scrollLeft = initScrollLeft + (diff / frames) * i;
						// 			})
						// 		}, i * (1000 / 60));
						// 	}
						// }

						// if (elLeft < leftThreshold) {
						// 	let diff = leftThreshold - elLeft;

						// 	for (let i = 0; i < frames; i++) {
						// 		setTimeout(() => {
						// 			window.requestAnimationFrame(() => {
						// 				vm.$refs.navCategoriesContainer.scrollLeft = initScrollLeft - (diff / frames) * i;
						// 			})
						// 		}, i * (1000 / 60));
						// 	}
						// }

						if (category == vm.$route.params.category) return false;

						// console.log('TOSLIDE', category, vm.$route.params.category)
						vm.$router.push({ path: `/home/category/${category}` })
					},
					touchEnd: function() {
						if (this.translate > window.innerWidth * threshold) {
							vm.$router.push("/home");
						}
					},
					sliderMove: function() {
						if (
							this.activeIndex == 0 &&
							this.translate >= 0 &&
							vm.pulledWidth != Math.round(this.translate)
						) {
							window.requestAnimationFrame(() => {
								vm.pulledWidth = Math.round(this.translate);
								vm.readyToRelease =
									this.translate > window.innerWidth * threshold;
							});
						}
					}
				}
			});
		},
		updateSlider() {
			if (this.slider) this.slider.destroy();
			this.initSlider();
		},
	},
	mounted() {
		this.initSlider();
	},

	beforeRouteEnter(to, from, next) {
		next( vm => {
			vm.subscribeOnAllStatuses();
		});
	},
	beforeRouteUpdate(to, from, next) {
		this.subscribeOnAllStatuses(to.params.category);

		let categories = Object.entries(this.deviceGroups).map( item => item[0] );
		let index = categories.indexOf(to.params.category);

		if (this.slider.activeIndex != index) {
			this.slider.slideTo(index);
		}
		// console.log(index);

		// console.log('toFROM', to.params.category, from.params.category);
		// console.log('rout', to, from, to == from)
		next();
	},
	components: {
		// Header,
		// "device-category-item": DeviceCategoryItem,
		ControlAppManager,
		LocationItem,
		SwipeHomeScreen,

		ModalDeviceSettings,
		ModalInputPassword
	}
};
</script>

<style lang="less" scoped>
.pill {
	position: absolute;
	height: 24px;
	width: 100%;
	top: 50%;
	left: 5px;
	transform: translateY(-50%);
	// margin-top: -1px;
	border-radius: 12px;
	background: rgba(0, 0, 0, 0.1);
}
.devices-by-category {
	position: fixed;
	left: 0;
	top: 46px;
	z-index: 2;
	width: 100%;
	background-color: #fff;
	box-shadow: 0px -1px 14px rgba(46, 101, 156, 0.21);

	// iOS inertial scroll
	overflow-x: scroll;
	-webkit-overflow-scrolling: touch;
}
.devices-by-category-page {
	padding-top: 102px;

	display: flex;
	flex-direction: column;
	flex-grow: 1;
}
.devices-by-category-page * {
	user-select: none;
}
.swiper-container {
	position: relative;
	width: 100%;
	flex-grow: 1;
	display: flex;
	// flex-wrap: wrap;
	// align-items: stretch;
	// overflow: hidden;
	transition: .25s;
	.swipe-home-screen {
		position: absolute;
		top: 0;
		right: 100%;
		z-index: 3;
	}
	.swiper-wrapper {
		position: relative;
		z-index: 3;
		background-color: @colorBg;
		min-height: 50vh;
		&::after {
			content: '';
			position: absolute;
			z-index: 10;
			top: 0;
			left: 100%;
			// right: 0;
			display: block;
			height: 100%;
			min-height: 100%;
			width: 100vw;
			background: @colorBg;
		}
	}
	.swiper-slide {
		width: 100%;
		z-index: 7;
		background-color: @colorBg;
		padding-bottom: 120px;
		// iOS inertial scroll
		overflow-y: scroll;
		-webkit-overflow-scrolling: touch;
	}
	&.--ready-to-release {
    background: @colorPaleBlue;
	}
}
</style>