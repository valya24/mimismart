<template>
	<div class="home-rooms">
		<Header v-if="false">
			<a
				class="header__link"
				v-for="(room, i) in rooms"
				:key="i"
				:class="{ '--active': i == activeRoomIndex }"
				@click="handleNavClick(i)"
			>{{ room.$.name }}</a>

			<BtnIcon class="room-settings" icon="icon-tuning" />
			<div class="overlay"></div>
		</Header>

		<div class="room-sensors --white --fixed" ref="roomSensorsFixed">
			<RoomSensor
				v-for="(sensor, i) in filterSensors(currentRoomData.__.sensors)"
				:key="i"
				:icon="'icon-' + sensor.attributes.type.split('-sensor')[0]"
			>
				{{ (isNaN(sensorDeviceInterfaces[sensor.attributes.type].value(sensor.__.status)) ? '--' : sensorDeviceInterfaces[sensor.attributes.type].value(sensor.__.status)) +
				sensorDeviceInterfaces[sensor.attributes.type].unitsLong }}
			</RoomSensor>
		</div>

		<div
			class="swiper-container"
			ref="swiperContainer"
			:class="{ '--ready-to-release': readyToRelease }"
		>
			<div class="pill"></div>

			<div class="swiper-wrapper">
				<SwipeHomeScreen :style="{ 'width': pulledWidth + 'px' }" :ready="readyToRelease" />

				<div class="swiper-slide room" v-for="room in rooms" :key="room.__.id" ref="roomSlides">
					<!-- If cam is available put image from cam -->
					<div class="room-picture">
						<img :src="room.attributes.image ? room.attributes.image : defaultRoomPic" alt />

						<div class="room-sensors --white" ref="roomSensors">
							<RoomSensor
								v-for="(sensor, i) in filterSensors(room.__.sensors)"
								:key="i"
								:icon="'icon-' + sensor.attributes.type.split('-sensor')[0]"
							>
								{{ (isNaN(sensorDeviceInterfaces[sensor.attributes.type].value(sensor.__.status)) ? '--' : sensorDeviceInterfaces[sensor.attributes.type].value(sensor.__.status)) +
								sensorDeviceInterfaces[sensor.attributes.type].unitsLong }}
							</RoomSensor>
						</div>
					</div>
					

					<div v-if="devicesSort == 'byType'" :class="{ '--show-addresses': showDeviceAddresses }">
						<LocationItem
							v-for="(group, key) in room.__.groups"
							:key="key"
							:type="key"
							:title="$t(group.name)"
							:items="filterItemsByGroup(getSortedIcons(room.__.id), group)"
							:widgets="filterItemsByGroup(getSortedWidgets(room.__.id), group)"
							:widgetsOnTop="widgetsOnTop"

							:roomData="currentRoomData"
							@callControlApp="handleCallControlApp"
						/>
					</div>

					<div v-else :class="{ '--show-addresses': showDeviceAddresses }">
						<LocationItem
							title=""
							:items="getSortedIcons(room.__.id)"
							:widgets="getSortedWidgets(room.__.id)"
							:widgetsOnTop="widgetsOnTop"

							:roomData="currentRoomData"
							@callControlApp="handleCallControlApp"
						/>
					</div>

				</div>
			</div>
		</div>

		<ControlAppManager
			:addr="activeItem.attributes.addr"
			:item="activeItem"
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
import Swiper from "swiper";

// import HomeRoomHeader from '@/views/Home/HomeRoom/HomeRoomHeader.vue';
import Header from "@/components/Header.vue";
import RoomSensor from "@/components/RoomSensor";

import SwipeHomeScreen from "@/components/etc/SwipeHomeScreen.vue";

import ControlAppManager from "@/components/deviceControlApps/ControlAppManager.vue";

import LocationItem from "@/components/containers/LocationItem.vue";

import sensorDeviceInterfaces from "@/utils/sensorDeviceInterfaces.js";

const allowedTypes = ["temperature", "illumination", "humidity", "motion"];

import ModalDeviceSettings from "@/components/modals/ModalDeviceSettings";
import ModalInputPassword from "@/components/modals/ModalInputPassword";
import {mapActions} from "vuex";


// function stickySensorsHandler (e, vm) {
// 	console.log(vm, e);
// }

export default {
	data() {
		return {
			activeRoomIndex: 0,
			slider: null,
			// roomPic:
			// 	"https://images.pexels.com/photos/3849554/pexels-photo-3849554.jpeg?cs=srgb&dl=pexels-3849554.jpg&fm=jpg",
			defaultRoomPic: require("@/assets/room-image_2_small.jpg"),
			activeItem: { attributes: {} },
			sensorDeviceInterfaces,
			pulledWidth: 0,
			readyToRelease: false,
      roomId: null,
			roomSensorsSticky: false,
			roomInitSensorsOffset: -1
		};
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
		showDeviceAddresses() {
			return this.$store.state.modules.settings.interface.showDeviceAddresses;
		},
		widgetsOnTop() {
			return this.$store.state.modules.settings.interface.widgetsOnTop;
		},
		deviceGroups() {
			return this.$store.state.groups;
		},

		currentAreaData() {
			return this.$store.getters.getAreaDataById(this.$route.params.id);
		},
		currentRoomData() {
			return this.$store.getters.getRoomDataById(this.$route.params.id);
		},

		floorId() {
      return this.$route.params.id.split('-')[0];
    },
    rooms() {
      return this.$store.getters.getFloorRooms(this.floorId);
    },

		currentSlideEl() {
			return this.slider ? this.$refs.roomSlides[this.slider.activeIndex] : null;
		},
		user() {
			return this.$store.state.modules.settings.user;
		},
	},
	watch: {
    roomId(val) {
      if (val) {
        const icons = this.getSortedIcons(val)
        const addrs = icons.map(icon => icon.attributes.addr)
        this.subscribeRequest(addrs)
        this.getAllDevices()
      }

    },
		currentRoomData(newVal) {
			this.unsubscribeFromAll();
			this.subscribeOnAllStatuses();
			if (this.$route.params.id != newVal.__.id) {
				this.$router.push(`/home/room/${newVal.__.id}`);
			}
		},
		floorId() {
			this.$nextTick(function() {
				this.updateSlider();
				let index = this.getRoomIndex(this.$route.params.id);
				this.slider.slideTo(index);
			})
		},
		currentSlideEl(newVal, oldVal) {
			let offset = newVal.querySelector('.room-sensors').offsetTop;
			this.roomInitSensorsOffset = offset;

			this.stickySensorsHandler({ target: newVal })

			if (oldVal) {
				oldVal.removeEventListener('scroll', this.stickySensorsHandler );
			}
			newVal.addEventListener('scroll', this.stickySensorsHandler );
		}
	},
	methods: {
    ...mapActions('modules/settings', ['subscribeRequest', 'getAllDevices']),
		stickySensorsHandler(e) {
			if (e.target.scrollTop >= this.roomInitSensorsOffset) {
				this.$refs.roomSensorsFixed.classList.remove('--hidden');
				this.$refs.roomSensors.forEach( item => item.classList.add('--hidden') );
				// this.roomSensorsSticky = true;
			} else {
				this.$refs.roomSensorsFixed.classList.add('--hidden');
				this.$refs.roomSensors.forEach( item => item.classList.remove('--hidden') );
				// this.roomSensorsSticky = false;
			}
		},
		getRoomItems(roomId) {
			return this.$store.getters.getRoomItems(roomId);
		},
		sortRoomItems(itemArr) {
			let outArr = itemArr.slice();

			let sortFn = () => 0;

			switch (this.devicesSort) {
				case "byName":
					sortFn = (a, b) => a.attributes.name.localeCompare(b.attributes.name);
					outArr = outArr.sort(sortFn);
					break;
				case "byType":
					sortFn = (a, b) => a.attributes.type ? a.attributes.type.localeCompare(b.attributes.type) : 1;
					outArr = outArr.sort(sortFn);
					break;
				default:
					break;
			}

			if (this.showSystem) {
				return [].concat(
					outArr.filter( item => item.attributes.system != "yes" ),
					outArr.filter( item => item.attributes.system == "yes" )
				)
				// return outArr.sort( (a, b) => (a.attributes.system == "yes" && b.attributes.system != "yes" ? 1 : -1 ) )
			} else {
				return outArr.filter( item => item.name !== 'import-script' && item.attributes.system != "yes" );
			}
		},
		getSortedRoomItems(roomId) {
			return this.sortRoomItems(this.getRoomItems(roomId));
		},
		getSortedWidgets(roomId) {
			return this.getSortedRoomItems(roomId)
				.filter( item => item.attributes.widget == "yes" );
		},
		getSortedIcons(roomId) {
      this.roomId = roomId
			return this.getSortedRoomItems(roomId)
				.filter( item => item.attributes.widget != "yes" );
		},
		filterItemsByGroup(itemArr, group) {
			return itemArr.filter(item =>
				item.attributes["sub-type"]
					? group.types.includes(item.attributes["sub-type"])
					: group.types.includes(item.attributes.type)
			);
		},

		handleCallControlApp(item) {
			this.$set(this, 'activeItem', item);
			// this.activeItem = item;
			this.$store.commit("modules/popups/showPopup", "deviceControl");
		},

		unsubscribeFromAll() {
			this.$store.dispatch("subscribeOnStatuses", {
				reset: true
			});
		},
		subscribeOnAllStatuses() {
			let addrArr = this.getRoomItems(this.$route.params.id)
				// .filter( item => item.$.type == 'lamp')
				.map(item => item.attributes.addr);
			this.$store.dispatch("subscribeOnStatuses", { addr: addrArr });
		},

		handleNavClick(index) {
			this.activeRoomIndex = index;
			this.slider.slideTo(index);
		},
		initSlider() {
			let vm = this;
			const threshold = 0.22;

			this.slider = new Swiper(this.$refs.swiperContainer, {
				resistanceRatio: 0.94,
				setWrapperSize: true,
				initialSlide: vm.getRoomIndex(vm.$route.params.id),
				updateOnWindowResize: true,
				on: {
					init: function() {
						vm.activeRoomIndex = vm.getRoomIndex(vm.$route.params.id);
						// this.slideTo(vm.getRoomIndex(vm.$route.params.id));
					},
					slideChange: function() {
						vm.activeRoomIndex = this.activeIndex;
						let id = vm.rooms[this.activeIndex].__.id;
						if ("" + id != "" + vm.$route.params.id) {
							vm.$router.push({ name: "HomeRoom", params: { id } });
						}
						// vm.$store.commit("selectRoom", vm.rooms[vm.activeRoomIndex].__.id);
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
				},
				breakpoints: {
					768: {
						direction: 'vertical',
						allowTouchMove: false,
					}
				}
			});
		},
		updateSlider() {
			if (this.slider) this.slider.destroy();
			this.initSlider();
		},
		getRoomIndex(roomId) {
			let index = null;
			this.rooms.forEach((room, i) => {
				if (room.__.id == roomId) {
					index = i;
				}
			});

			return index;
		},
		slideToRoomId(roomId) {
			this.slider.slideTo(this.getRoomIndex(roomId));
		},

		// TODO: refactor
		filterSensors(sensorAddrs) {
			let sensors = sensorAddrs.map( addr => this.$store.state.itemMap[addr] );
			if (!sensors || !sensors.length) return [];
			let filledTypes = [];
			let outArr = [];

			sensors.forEach(item => {
				let type = item.attributes.type.split("-sensor")[0];

				if (allowedTypes.includes(type) && !filledTypes.includes(type)) {
					if (item.attributes.type.includes('temperature')) {
						outArr.push(item);
					} else {
						outArr.unshift(item);
					}
					filledTypes.push(type);
				}
			});

			return outArr;
		},

		handleTurnAllOff(itemArr) {
			itemArr.forEach(item => {
				this.$store.dispatch("setStatus", {
					addr: item.attributes.addr,
					status: "0x00"
				});
			});
		},

		getItemEditPermission(item) {
			let viewBool = false;

			if (item.__.permissions) {
        viewBool = item.__.permissions['*'].edit;
  
        if (this.user.key) {
          viewBool = viewBool || item.__.permissions[this.user.key].edit;
        }
			} else if (this.currentRoomData.__.permissions) {
        viewBool = this.currentRoomData.__.permissions['*'].edit;
  
        if (this.user.key) {
          viewBool = viewBool || this.currentRoomData.__.permissions[this.user.key].edit;
        }
			} else {
				viewBool = true;
			}

			return viewBool;
		}
	},
	beforeRouteUpdate(to, from, next) {
		let index = this.getRoomIndex(to.params.id);
		if (index === null) {
			this.subscribeOnAllStatuses();
			this.updateSlider();
			next();
			return;
		}

		if (this.activeRoomIndex === index) {
			next();
		} else {
			this.slider.slideTo(index);
			// next();
		}
	},

	beforeRouteLeave(to, from, next) {
		this.unsubscribeFromAll();
		next();
	},
	beforeRouteEnter(to, from, next) {
		next(vm => {
			vm.subscribeOnAllStatuses();
			vm.updateSlider();
		});
	},
	components: {
		Header,
		RoomSensor,
		ControlAppManager,
		LocationItem,
		SwipeHomeScreen,

		ModalDeviceSettings,
		ModalInputPassword
	}
};
</script>

<style lang="less" scoped>
.theme-dark {
	.swiper-container .swiper-slide {
		background-color: @colorBgDark;
	}
}
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
.location-item:last-of-type {
	margin-bottom: 0;
}
.swiper-container {
	position: relative;
	height: 100%;
	max-height: calc(100vh - 46px);

	// background-color: #f22;
	background: #e1e6ed;
	transition: 0.25s;
	.swiper-slide {
		overflow-x: hidden;
		position: relative;
		z-index: 7;
		min-height: calc(100vh - 46px);
		max-height: calc(100vh - 46px);
		// padding-bottom: 72px + 48px;
		background-color: @colorBg;

		// iOS inertial scroll
		overflow-y: scroll;
		-webkit-overflow-scrolling: touch;
	}
	.swiper-wrapper {
		position: relative;
		z-index: 3;
		&::after {
			content: "";
			position: absolute;
			z-index: 10;
			top: 0;
			left: 100%;
			// right: 0;
			display: block;
			height: 100%;
			min-height: 100%;
			width: 100vw;
			background: #e1e6ed;
		}
	}
	.swipe-home-screen {
		position: absolute;
		top: 0;
		right: 100%;
		z-index: 3;
	}
	&.--ready-to-release {
		background: @colorPaleBlue;
	}

	@media (min-width: @phones) {
		max-height: 100vh;
		.swiper-slide {
			min-height: 100vh;
			max-height: 100vh;
		}
	}
}

.room {
	flex-grow: 1;
	overflow-y: auto;
	// padding-bottom: 56+16px;
	// padding-bottom: 120px;
	* {
		user-select: none;
	}
	.location-item:last-of-type {
		padding-bottom: 120px;
	}
}
.room-picture {
	height: 200px;
	position: relative;
	z-index: 1;
	background-size: cover;
	background-position: 50% 50%;
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
.room-sensors {
	// position: sticky;
	position: absolute;
	left: 0;
	bottom: 0;
	width: 100%;
	overflow-x: hidden;

	z-index: 10;
	display: flex;
	font-size: @roomSensorTextSize;
	height: 40px;
	margin-top: -40px;
	justify-content: space-around;
	background: rgba(0, 0, 0, 0.24);
	backdrop-filter: blur(9px);
	color: #fff;
	// position: absolute;
	// bottom: 0;
	// left: 0;
	// right: 0;
	padding: 8px;
	transition: .2s;
	&.--hidden {
		// position: fixed;
		// bottom: auto;
		// top: 0;
		opacity: 0;
	}
	&.--fixed {
		position: fixed;
		top: 86px;
		left: 0;
		z-index: 101;
		bottom: auto;
	}
	&.--fixed.--hidden {
		transform: translateY(-100%);
		z-index: 0;
	}

	.sensor {
		display: flex;
		justify-content: center;
		&:first-of-type {
			justify-content: flex-start;
		}
		&:last-of-type {
			justify-content: flex-end;
		}
	}
}

.overlay {
	background: red;
	width: 100px;
	position: absolute;
	right: 0;
	height: 100%;
	background: linear-gradient(270deg, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
}

.location-item {
	margin-bottom: 24px;
	display: flex;
	flex-direction: column;
	.grid-icons {
		//margin: 0 16px;
		margin-top: 16px;
		&.--last {
			order: 10;
		}
	}
}
.location-head {
	padding: 16px 16px 0 16px;
}
.col-empty {
	width: @btnHeight;
	height: @btnHeight;
	margin-right: -8px;
}
.col-back {
	margin-left: -8px;
}

@media (min-width: @phones) {
	.room-sensors {
		right: 0;
		width: auto;
		&.--fixed {
			top: 0;
			transform: translateY(100%);
			left: @sidebarWidth;
		}
	}
}
</style>