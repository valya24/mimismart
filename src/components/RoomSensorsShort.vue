<template>
	<div class="room-sensors">
		<RoomSensor v-for="(sensor, i) in filteredSensors" :key="i"
			:icon="'icon-' + sensor.attributes.type.split('-sensor')[0]" >
      <sensor-device :addr="sensor.attributes.addr" :sensor="sensor" :unit="sensorDeviceInterfaces[sensor.attributes.type].unitsLong"/>
		</RoomSensor>
	</div>
</template>

<script>
import RoomSensor from "@/components/RoomSensor";
import SensorDevice from "@/views/Home/HomeRoom/SensorDevice";

import sensorDeviceInterfaces from "@/utils/sensorDeviceInterfaces.js";
import {mapActions} from "vuex";

//	TODO: Maybe move this logic to parent component
const allowedTypes = ['temperature', 'illumination'];

export default {
  data: () => ({
    sensorDeviceInterfaces
  }),

	props: {
		sensorsAddrs: {
			type: Array,
			default() { return [] }
		}
	},

  watch: {
    isConnected(val) {
      if (val) {
        const addrs = this.filteredSensors.filter(sensor => sensor.attributes?.addr).map(item => item.attributes?.addr)
        if (addrs.length) {
          addrs.map(addr => this.subscribeRequest(addr))
        }
      }
    }
  },
	computed: {
    isConnected() {
      return this.$store.state.ws.socket.isConnected
    },
		sensors() {
			return this.sensorsAddrs.map( addr => this.$store.state.itemMap[addr] );
		},
		//	TODO: MAYBE needs refactoring
		filteredSensors() {
			if (!this.sensors || !this.sensors.length) return [];
			let filledTypes = [];
			let outArr = [];
			
			this.sensors.forEach( item => {
				let type = item.attributes.type.split('-sensor')[0];

				if (allowedTypes.includes(type) && !filledTypes.includes(type)) {
					outArr.push(item);
					filledTypes.push(type);
				}
			});
			return outArr;
		},
	},
	methods: {
    ...mapActions('modules/settings', ['subscribeRequest']),
		getSensorValueString(sensor) {
			return (isNaN(sensorDeviceInterfaces[sensor.attributes.type].value(sensor.__.status)) ? '--' : sensorDeviceInterfaces[sensor.attributes.type].value(sensor.__.status)) +
					sensorDeviceInterfaces[sensor.attributes.type].unitsLong;
		},
		subscribe() {
			// let addrArr = this.filteredSensors.map( item => item.attributes.addr);
			let addrArr = this.sensorsAddrs;
			this.$store.dispatch('subscribeOnStatuses', { addr: addrArr });
		},
		unsubscribe() {
			this.$store.dispatch('subscribeOnStatuses', {
				addr: ['-'],
				reset: true
			});
		},
	},
	mounted() {
		this.subscribe();
	},
	destroyed() {
		this.unsubscribe();
	},
	components: {
		RoomSensor,
    SensorDevice
	}
};
</script>

<style lang="less" scoped>
.room-sensors {
	font-size: 14px;
	display: flex;
	align-items: center;
	color: #6d6d6d;
	background: none !important;
	transition: 0.25s;
	&:active {
		background: @colorBtnActive;
	}
}
.sensor {
	display: flex;
	align-items: center;
	margin-left: 16px;
	&:first-child {
		margin-left: 0;
	}
}
</style>