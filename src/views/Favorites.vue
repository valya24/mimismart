<template>
	<div class="favorites">
		<Header>
			<div class="col-location">
				<Dropdown class="flat">
					<option value="">Дача</option>
					<option value="">Дом на Аллее</option>
				</Dropdown>
			</div>
			<div class="col-settings">
				<BtnIcon icon="icon-photo" />
			</div>
		</Header>
		<!-- <div class="favs-head">
		</div> -->
		<div class="locations-list" :class="{ '--show-addresses': showDeviceAddresses }">
			<LocationItem
				v-for="room in rooms" :key="room.__.id"
				:title="room.attributes.name"
				:items="filterIcons(filterRoomItems(getRoomItems(room.__.id)))"
				:widgets="filterWidgets(filterRoomItems(getRoomItems(room.__.id)))"
				:widgetsOnTop="widgetsOnTop"

				@callControlApp="handleCallControlApp"
			/>
		</div>

		<ControlAppManager
			:addr="activeItem.attributes.addr"
		/>

		<ModalDeviceSettings
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
import Header from "@/components/Header";

import ControlAppManager from "@/components/deviceControlApps/ControlAppManager.vue";
import ModalDeviceSettings from "@/components/modals/ModalDeviceSettings";
import ModalInputPassword from "@/components/modals/ModalInputPassword";

import LocationItem from "@/components/containers/LocationItem.vue";
import {mapActions, mapGetters} from "vuex";

export default {
	data() {
		return {
			activeItem: { attributes: {} }
		}
	},
  // watch: {
  //   devices: {
  //     deep: true,
  //     handler(val) {
  //       console.log(val)
  //     }
  //   }
  // },
	computed: {
    ...mapGetters(['itemMap']),
    ...mapGetters('ws', ['sensorDevice', 'devices']),
    showSystem() {
			return this.$store.state.modules.settings.interface.showSystem;
		},
		widgetsOnTop() {
			return this.$store.state.modules.settings.interface.widgetsOnTop;
		},
		showDeviceAddresses() {
			return this.$store.state.modules.settings.interface.showDeviceAddresses;
		},
		activePopup() {
			return this.$store.state.modules.popups.activePopup;
		},
		
		floors() {
			return this.$store.state.floors;
		},
		rooms() {
			return this.floors
				.reduce( (accum, floor) => floor.attributes.system == 'yes' ? accum : accum.concat(this.getFloorRooms(floor.__.id)), [])
				.filter( room => room.attributes.system != 'yes' && this.filterRoomItems(this.getRoomItems(room.__.id)).length );
		},
	},
	methods: {
    ...mapActions('modules/settings', ['subscribeRequest']),
		getFloorRooms(floorId) {
			return this.$store.getters.getFloorRooms(floorId);
		},
		getRoomItems(roomId) {
			return this.$store.getters.getRoomItems(roomId)
		},
		filterRoomItems(itemArr) {
			let arr = (!itemArr || !itemArr.length) ? [] : itemArr;

			return arr
				.filter( item => item.attributes.favorite == 'yes' && (item.attributes.system != 'yes' || this.showSystem) );
		},
		filterIcons(itemArr) {
			return itemArr.filter( item => item.attributes.widget != 'yes' );
		},
		filterWidgets(itemArr) {
			return itemArr.filter( item => item.attributes.widget == 'yes' );
		},

		handleCallControlApp(item) {
			this.activeItem = item;
			this.$store.commit("modules/popups/showPopup", "deviceControl");
		},

		getAllFavoriteDevices() {
			return this.rooms
				.reduce( (accum, room) => accum.concat(this.filterRoomItems(this.getRoomItems(room.__.id))), []);
		},
		subscribeOnAllStatuses() {
			let addrArr = this.getAllFavoriteDevices().map( item => item.attributes.addr );
			this.$store.dispatch("subscribeOnStatuses", { addr: addrArr });
		},
	},
	mounted() {
		this.subscribeOnAllStatuses();
    this.rooms.map(room => {
      const addrs = this.$store.getters.getRoomItems(room.__.id).map(item => item.attributes.addr)
      this.subscribeRequest(addrs)
    })
	},
	components: {
		Header,
		LocationItem,
		ControlAppManager,
		ModalDeviceSettings,
		ModalInputPassword
	}
}
</script>

<style lang="less" scoped>
.col-settings {margin-left: auto;}
.favs-head {
	padding-top: 16px;
	height: 200px;
	background-size: cover;
	background-image: url(https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260);
}
.favorites .locations-list {
	padding-bottom: 120px;
}
</style>