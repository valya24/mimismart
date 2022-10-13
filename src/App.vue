<template>
	<div id="app" :class="{
			'theme-dark': darkThemeEnabled,
			'--expanded': isHomePage
		}">
		<transition name="fade">
			<AlertNotification v-if="alertMessageShown">
				<span v-html="currentAlertMessage"></span>
			</AlertNotification>
		</transition>

		<div class="connection" @click="$connect()"
			v-if="showSystem">
      <icon-comp :iconName="isConnected ? 'icon-connected' : 'icon-disconnected'" />
		</div>

		<div class="sidebar" :class="{ '--collapsed': isHomePage }">
			<div class="head">Имя дома</div>
			<div class="sidebar-list-container">
				<div class="rooms-list"
					v-for="floor in filteredFloors" :key="floor.__.id"
				>
					<div class="floor-title">{{ floor.attributes.name }}</div>
					<!-- <SidebarItem
						v-for="room in filterFloorRooms(floor)"
						:key="room.__.id"
						:to="`/home/room/${room.__.id}`"
						:roomName="room.attributes.name"
						:sensors="room.__.sensors"
						:image="room.attributes.image"
					/> -->
					<floor-room-item
						v-for="room in filterFloorRooms(floor)"
						:key="room.__.id"
						:class="{
							'--active': $route.path == `/home/room/${room.__.id}`
						}"
						:data="{
							name: room.attributes.name,
							amount: filteredRoomItems(room.__.id).length,
							sensorsAddrs: room.__.sensors,
							image: room.attributes.image
						}"
						@click.native="$router.push(`/home/room/${room.__.id}`)"
					/>
				</div>

				<div class="rooms-list"
					v-for="floor in systemFloors" :key="floor.__.id"
				>
					<div class="floor-title">{{ floor.attributes.name }}</div>
					<!-- <SidebarItem
						v-for="room in filterFloorRooms(floor)"
						:key="room.__.id"
						:to="`/home/room/${room.__.id}`"
						:roomName="room.attributes.name"
						:sensors="room.__.sensors"
						:image="room.attributes.image"
					/> -->

					<floor-room-item
						v-for="room in filterFloorRooms(floor)"
						:key="room.__.id"
						:class="{
							'--active': $route.path == `/home/room/${room.__.id}`
						}"
						:data="{
							name: room.attributes.name,
							amount: filteredRoomItems(room.__.id).length,
							sensorsAddrs: room.__.sensors,
							image: room.attributes.image
						}"
						@click.native="$router.push(`/home/room/${room.__.id}`)"
					/>
				</div>
			</div>
			
		</div>

		<router-view class="app-main-view" />

		<TabBar />

		
	</div>
</template>

<script>
import AlertNotification from "@/components/etc/AlertNotification.vue";

import TabBar from "@/components/TabBar";
// import SidebarItem from "@/components/SidebarItem";

import IconComp from '@/components/icons/iconComp.vue'
import FloorRoomItem from "@/components/FloorRoomItem";

export default {
	data() {
		return {
			deviceControlTabs: ["Управление", "Статистика", "Оповещения"],
			deviceSettingsTabs: [
				"Основные",
				"Автоматизация",
				"Будильник",
				"Кнопки",
				"Кнопки2"
			]
		};
	},
	computed: {
    apiIp() {
      const settings = JSON.parse(localStorage.getItem('settings'));
      return settings ? `${settings.network.remoteIp}:${settings.network.remotePort}` : "95.84.154.146:54441"
    },
		activePopup() {
			return this.$store.state.modules.popups.activePopup;
		},
    user() {
      return this.$store.state.modules.settings.user;
    },
		floors() {
			return this.$store.state.floors;
		},
		visibleFloors() {
			return this.floors.filter( floor => {
				if (floor.__.permissions) {
					let viewBool = floor.__.permissions['*'].view;
					if (this.user.key) {
						viewBool = viewBool || floor.__.permissions[this.user.key].view;
					}
					return viewBool;
				} else {
					return true;
				}
			});
		},
		filteredFloors() {
			return this.visibleFloors
				.filter(floor => floor.attributes.system != "yes" && floor.attributes.system != "true" && this.filterFloorRooms(floor).length );
		},
		systemFloors() {
			return this.showSystem ? this.visibleFloors.filter( floor => floor.attributes.system == "yes" || floor.attributes.system == "true" ) : [];
		},
		rooms() {
			return this.$store.state.floors
				.filter( floor => this.showSystem ? true : floor.attributes.system != "yes" && floor.attributes.system != "true" )
				.reduce((acc, floor) => acc.concat(floor.elements.filter( element => element.name == "area" )), [])
				.filter( room => this.showSystem ? true : room.attributes.system != "yes" && room.attributes.system != "true" );
		},
		localIp() {
			return this.$store.state.modules.settings.network.localIp;
		},
		useTestLogic() {
			return this.$store.state.modules.settings.other.useTestLogic;
		},

		isConnected() {
			return this.$store.state.ws.socket.isConnected;
		},
		showSystem() {
			return this.$store.state.modules.settings.interface.showSystem;
		},
		darkThemeEnabled() {
			return this.$store.state.modules.settings.interface.appearance == 'dark';
		},

		alertMessageShown() {
			return this.$store.state.modules.alerts.messageIsShown;
		},
		currentAlertMessage() {
			return this.$store.state.modules.alerts.currentMessage;
		},

		isHomePage() {
			return this.$route.name == null || this.$route.name === 'Home'
		}
	},
	watch: {
		// localIp(newVal) {
		// 	this.$disconnect();
		// 	let localIp = newVal || "127.0.0.1:55580";
		// 	this.$connect(`ws://${localIp}/api`);
		// },
		useTestLogic(newVal) {
			if (newVal) {
				this.$disconnect();
				this.$store.dispatch("loadLogic");
			} else {
				let localIp = this.localIp || "127.0.0.1:55580";
				this.$connect(`ws://${localIp}/api`);
			}
		}
	},
	methods: {
		filterFloorRooms(floorData) {
      let roomArr = floorData.elements
        .filter( el => el.name == "area" )
        .filter( room => {
          if (room.__.permissions) {
            let viewBool = room.__.permissions['*'].view;
            if (this.user.key) {
              viewBool = viewBool || room.__.permissions[this.user.key].view;
            }
            return viewBool;
          } else {
            return true;
          }
        })

			if (!this.showSystem) {
				return roomArr.filter( room => room.attributes.system != "yes" && room.attributes.system != "true" );
			} else {
				return roomArr;
			}
		},
		getRoomItems(roomId) {
			return this.$store.getters.getRoomItems(roomId);
		},
		filteredRoomItems(roomId) {
			return this.getRoomItems(roomId).filter( item => this.showSystem ? true : item.attributes.system != "yes" );
		},
	},
	async created() {
		this.$store.dispatch("modules/settings/loadSettingsFromLocalStorage");
		this.$store.dispatch(
			"modules/watchedSensors/loadWatchedDevicesFromLocalStorage"
		);

    this.$connect(`ws://${this.apiIp}`);
    const data = localStorage.getItem('logic.xml')
    if (data) {
      this.$store.dispatch('parseAndSaveLogic', data);
    } else {
      this.$store.dispatch("loadLogicXML")
    }

		// if (process.env.NODE_ENV == 'production') {
		// await this.$store.dispatch("loadLogic");
		// }

		//	Reconnect on mobile app focus
		document.addEventListener("visibilitychange", () => {
			if (
				!document.hidden &&
				this.$store.state.ws.$socket &&
				this.$store.state.ws.$socket.currentTarget.readyState == 3
			) {
				this.$connect();
			}
		});
	},
	mounted() {
		// document.body.addEventListener('touchmove', (e) => {
		// 	e.preventDefault();
		// })
		// document.addEventListener('touchmove', (e) => {
		// 	e.preventDefault();
		// })
	},
	components: {
		AlertNotification,
		TabBar,
		// SidebarItem,
		'icon-comp': IconComp,
		"floor-room-item": FloorRoomItem,
	}
};
</script>

<style lang="less">
.rooms-list {
	padding: 0 16px;
}
.floor-title {
	margin-bottom: 10px;
}
html {
	width: 100vw;
	height: 100vh;
	// overflow: hidden;

	user-select: none;
}
body {
	// height: 100vh;
	overflow-x: hidden;
}
* {
	// user-select: inherit;
}
.sidebar {
	padding-top: @headerHeight;
	height: 100%;
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	width: @sidebarWidth;
	z-index: 99;
	background: @colorSidebarBg;
	// background: @colorBg;
	display: none;
	overflow: hidden;
	transition: .3s;
	.head {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: @headerHeight;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #969eaf;
		font-size: 18px;
	}
	&-list-container {
		height: 100%;
		// overflow-y: auto;
		//	iOS inertial scroll
		overflow-y: scroll;
		-webkit-overflow-scrolling: touch;
	}
	&.--collapsed {
		// width: 0;
		transform: translateX(-100%);
	}
	.rooms-list .floor-room-item {
		margin-bottom: 24px;
	}
}

.app-main-view {
	
}
#app {
	// height: 100vh;
	// max-height: 100vh;
	min-height: 100vh;
	overflow-y: scroll;
	display: flex;
	flex-direction: column;
	padding-top: @headerHeight;
	// padding-bottom: 56+24px;
	//user-select: none;
}


.connection {
	position: fixed;
	// top: 46px;
	bottom: 0;
	left: 0;
	// right: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
	padding: 8px;
	background-color: #fff;
	z-index: 101;
	cursor: pointer;

	box-shadow: 1px -3px 5px rgba(#000, .15);
	svg {
		width: 100%;
		height: auto;
		// fill: @colorMain;
	}
}

@media (min-width: @phones) {
	.sidebar {
		display: block;
	}

	#app {
		padding-left: @sidebarWidth;
		padding-top: 0;
		.app-main-view {
			position: relative;
			width: 100%;

			max-width: 100%;
			// width: calc(100% - @sidebarWidth);
			// max-width: calc(100% - @sidebarWidth);
		}
		&.--expanded {
			padding-left: 0;
		}
	}
}

@media (min-width: @tablets-landscape) {
	.sidebar {
		padding-top: 24px;
		.head {display: none;}
	}
	.rooms-list {padding: 0 32px;}
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.counter-enter-active, .counter-leave-active {
  transition: .1s;
}
.counter-enter {
	opacity: 0;
	transform: translateY(-15%);
}
.counter-enter-to {
	opacity: 1;
	transform: translateY(0);
}
.counter-leave-to {
	opacity: 0;
	transform: translateY(15%);
}
</style>
