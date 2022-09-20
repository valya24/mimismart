<template>
	<ModalDeviceControl @hide="$store.commit('modules/popups/hidePopup')" :tabs="tabs">
		<leak-sensor :slot="tabs[0]" />
		<ModalDeviceControlStats :slot="tabs[1]" />
	</ModalDeviceControl>
</template>

<script>
	import ModalDeviceControl from "@/components/modals/ModalDeviceControl";
	import LeakSensor from "@/components/deviceControls/LeakSensorControl";
	import ModalDeviceControlStats from "@/components/modals/ModalDeviceControlStats";
	export default {
		data() {
			return {
				isActive: true,
			}
		},
		components: {
			ModalDeviceControl,
			ModalDeviceControlStats,
			LeakSensor
		},
		computed: {
			tabs() {
				return [
					this.$t("Control"),
					this.$t("Statistics"),
					this.$t("Notifications")
				];
			},
		}
	}
</script>