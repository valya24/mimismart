<template>
	<div class="room"
		v-touch:swipe.left="swipeLeftHandler"
		v-touch:swipe.right="swipeRightHandler">
		
		<!-- If cam is available put image from cam -->
		<div class="room-picture" :style="'background-image:url('+roomPic+')'">
			<div class="room-sensors --white">
				<RoomSensor icon="icon-temperature">24&deg; C</RoomSensor>
				<RoomSensor icon="icon-illumination">80%</RoomSensor>
				<RoomSensor icon="icon-motion">80%</RoomSensor>
				<RoomSensor icon="icon-humidity">80%</RoomSensor>
			</div>
		</div>

		<div class="sec-icons">
			<div class="grid-icons">
				<slot />
				<device-as-icon v-for="(item, i) in filteredItems" :key="i"
					:icon="item.$._icon" :name="item.$.name"
					:isOn="getDeviceOnStatus(item.$)"
					:sensor="item.$.type.includes('sensor')"
					:value="getDeviceValue(item.$)"
					:units="getDeviceUnits(item.$)"
					@click.native="handleDeviceClick(item)"/>

				<device-as-icon v-for="(item, i) in systemItems" :key="i + filteredItems.length"
					:icon="item.$._icon" :name="item.$.name"
					:isOn="item.$._status && !item.$.type.includes('sensor')"
					:sensor="item.$.type.includes('sensor')"
					:value="item.$._status"
					@click.native="handleDeviceClick(item)"/>
			</div>
		</div>
	</div>
</template>

<script>
import RoomSensor from "@/components/RoomSensor";

export default {
	components: {
		RoomSensor
	},
	data() {
		return {
			roomPic:
				"https://images.pexels.com/photos/3849554/pexels-photo-3849554.jpeg?cs=srgb&dl=pexels-3849554.jpg&fm=jpg"
		};
	},
	computed: {
		showSystem() {
			return this.$store.state.modules.settings.showSystem;
		},
		currentAreaData() {
			return this.$store.state.currentAreaData;
		},
		rooms() {
			return this.currentAreaData.area;
		},
		currentRoomData() {
			return this.$store.state.currentRoomData;
		},
		roomItems() {
			return this.currentRoomData.item || [];
		},
		filteredItems() {
			return this.roomItems.filter( item => item.$.system != 'yes' );
		},
		systemItems() {
			return this.showSystem ? this.roomItems.filter( item => item.$.system == 'yes' ) : [];
		},
	},
	methods: {
		handleDeviceClick(item) {
			this.$store.dispatch('setStatus', {
        addr: item.$.addr,
				status: '0xff'
      })
		},
		subscribeOnAllStatuses() {
			let addrArr = this.roomItems
				// .filter( item => item.$.type == 'lamp')
				.map( item => item.$.addr);
			this.$store.dispatch('subscribeOnStatuses', { addr: addrArr });
		},
		getDeviceOnStatus(item) {
			if (item.type.includes('sensor')) return false;

			return item._status[0];
		},
		getDeviceValue(item) {
			let value = item._status;
			
			if (item.type.includes('sensor')) {
				value = parseFloat(''+item._status[1] + '.' + item._status[0]);
				if (item.type.includes('leak')) {
					value = Boolean(item._status[0]);
				} else if (item.type.includes('temperature')) {
					value = value.toFixed(1);
				} else {
					value = Math.round(value);
				}
			}

			return value;
		},
		getDeviceUnits(item) {
			if (!item.type.includes('sensor')) return null;

			let units = "%";
			if (item.type.includes('temperature')) {
				units = '°';
			} else if (item.type.includes('co2')) {
				units = 'ppm';
			} else if (item.type.includes('leak')) {
				units = '';
			}

			return units;
		},

		swipeLeftHandler() {
			for (let i = 0; i < this.currentAreaData.area.length; i++) {
				let room = this.currentAreaData.area[i];
				if (room.$.id == this.currentRoomData.$.id &&
						i < this.currentAreaData.area.length - 1) {

					let nextRoomId = this.currentAreaData.area[i + 1].$.id;
					this.$router.push({
						path: `/home/room/${nextRoomId}`,
						query: { direction: 'left' }
					});
					break;
				}
			}
		},
		swipeRightHandler() {
			for (let i = 0; i < this.currentAreaData.area.length; i++) {
				let room = this.currentAreaData.area[i];
				if (room.$.id == this.currentRoomData.$.id) {
					if (i == 0) {
						this.$router.push('/home');
						break;
					} else {
						let prevRoomId = this.currentAreaData.area[i - 1].$.id;
						this.$router.push(`/home/room/${prevRoomId}`);
						break;
					}
				}
			}

		},
	},
	mounted() {
		this.subscribeOnAllStatuses();
	},
	async beforeRouteUpdate (to, from, next) {
		if (!this.$store.state.areas.area || !this.$store.state.areas.area.length) {
			let unwatch = this.$store.watch(state => state.logicParsed, function (newVal) {
				if (newVal) {
					this.$store.commit('selectRoom', to.params.id);
					unwatch();
					next();
				}
			});
			await this.$store.dispatch("loadLogic");
		} else {
			this.$store.commit('selectRoom', to.params.id);
			next();
		}
	},

	beforeRouteLeave(to, from, next) {
		this.$store.dispatch('subscribeOnStatuses', {
			reset: true
		});
		next();
	}
};
</script>

<style lang="less" scoped>
.room-cams {
	background: #fff;
	color: #000;
	border-radius: 50px;
	margin-left: auto;
	padding: 0 8px;
	.icon-holder {
		width: 16px;
		height: 16px;
		margin-right: 8px;
		display: block;
	}
}
.room {
	flex-grow: 1;
}
.room-picture {
	height: 200px;
	position: relative;
	z-index: 1;
	background-size: cover;
	background-position: 50% 50%;
	.room-sensors {
		display: flex;
		justify-content: space-between;
		// font-size: 14px;
		background: rgba(0, 0, 0, 0.24);
		backdrop-filter: blur(9px);
		color: #fff;
		bottom: 0;
		position: absolute;
		left: 0;
		right: 0;
		padding: 8px;
		padding-right: 12px;
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
</style>