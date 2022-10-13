<template>
	<div class="room-sensors">
		<!-- <RoomSensor icon="icon-temperature">24&deg; C</RoomSensor> -->
		<!-- <RoomSensor icon="icon-illumination">80%</RoomSensor> -->
		<RoomSensor v-for="(sensor, i) in filteredSensors" :key="i"
			:icon="'icon-' + sensor.attributes.type.split('-sensor')[0]" >
			{{ getSensorValueString(sensor) }} 
		</RoomSensor>
	</div>
</template>

<script>
import RoomSensor from "@/components/RoomSensor";

import sensorDeviceInterfaces from "@/utils/sensorDeviceInterfaces.js";

//	TODO: Maybe move this logic to parent component
const allowedTypes = ['temperature', 'illumination'];

export default {
	props: {
		// sensors: Array,
		sensorsAddrs: {
			type: Array,
			default() { return [] }
		}
	},
	computed: {
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
		RoomSensor
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