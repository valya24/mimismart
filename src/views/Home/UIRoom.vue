<template>
	<div class="room">
		<HomeRoom>
			<FolderItem />
			<device-as-icon icon="light-scheme" name="Ушел из дома" />
			<device-as-icon icon="curtains" name="Шторы" />
			<device-as-icon icon="script" name="Ушел из дома" />
			<device-as-icon icon="light-scheme" name="Точки" />
			<device-as-icon icon="script" name="Выключить весь свет" />
			<device-as-icon icon="dimer-lamp" :isOn="true" name="Диммер" />
			<device-as-icon icon="rgb-lamp" name="RGB" />
			<device-as-icon icon="lamp" :isOn="true" name="Lamp" />
			<device-as-icon icon="conditioner" name="Кондей" />
			<device-as-icon icon="garage" name="Гараж" />
			<device-as-icon icon="rollets" name="Роллеты" />
			<device-as-icon icon="jalousie-blinds" name="Жалюзи" />
			<device-as-icon icon="temperature" value="13.4" name="На улице" :sensor="true" />
			<device-as-icon icon="sensor-amps" value="50" units="A" name="Ток" :sensor="true" />
			<device-as-icon icon="sensor-volts" value="50" units="V" name="Напряжение" :sensor="true" />
			<device-as-icon icon="leak-dry" value="" name="Протечки нет" :sensor="true" />
			<device-as-icon icon="leak-wet" value="" name="Протечка есть" :isOn="true" :sensor="true" />
			<device-as-icon icon="sensor-gas" value="5" units="%" name="Газ" :sensor="true" />
			<device-as-icon icon="sensor-co2" value="400" units="ppm" name="Газ" :sensor="true" />
			<device-as-icon icon="sensor-smoke" value="" name="Дыма нет" :sensor="true" />
			<device-as-icon icon="sensor-smoke" :isOn="true" value="" name="Дым есть" :sensor="true" />
			<WidgetItem icon="conditioner" class="--disabled" currentTemp="2" name="Кондиционер">
				<BtnIcon icon="icon-snowflake" />
				<BtnIcon icon="icon-powerlevel" />
				<BtnIcon icon="icon-minus" class="right" />
				<div class="value">20&deg;</div>
				<BtnIcon icon="icon-plus" />
			</WidgetItem>
			<WidgetItem state="Закрыто" name="Домофон">
				<app-button label="Открыть" />
			</WidgetItem>
			<WidgetItem icon="curtains" name="Шторы" state="Закрыто" class="--no-toggle --disabled">
				<app-button class="--disabled" label="Открыть" />
				<app-button class="--disabled" label="Закрыть" />
			</WidgetItem>
			<WidgetItem
				icon="speaker"
				state="Играет Jacob Steward - Brunei Darussalam"
				name="Мультирум"
				:isOn="true">
				<BtnIcon icon="icon-volume-mid" />
				<BtnIcon icon="icon-shuffle" />
				<BtnIcon icon="icon-play-prev" />
				<BtnIcon icon="icon-play-next" />
				<BtnIcon icon="icon-pause" />
			</WidgetItem>
			<WidgetItem :isOn="true" icon="dimer-lamp" name="Диммер">
				<Brightness class="fg1" />
			</WidgetItem>
			<WidgetItem class="presets" icon="rgb-lamp" name="RGB лампа">
				<BtnColorPreset color="#ff0" />
				<BtnColorPreset color="#f00" />
				<BtnColorPreset color="#f0f" />
				<BtnColorPreset color="green" />
				<BtnColorPreset color="red" />
				<BtnColorPreset class="big" color="#f0f" />
			</WidgetItem>
			<WidgetItem icon="valve-heating" name="Отопление" currentTemp="2" class="--disabled">
				<BtnIcon icon="icon-comfort" />
				<BtnIcon icon="icon-minus" class="right" />
				<div class="value">20&deg;</div>
				<BtnIcon icon="icon-plus" />
			</WidgetItem>
		</HomeRoom>
		<ModalDropdownList v-if="false">
			<div class="list-item">
				<div class="col-icon"><icon-comp iconName="icon-econom" /></div>
				<div class="col-value">Эконом</div>
				<div class="col-check"><icon-comp iconName="icon-check" /></div>
			</div>
			<div class="list-item">
				<div class="col-icon"><icon-comp iconName="icon-comfort" /></div>
				<div class="col-value">Комфорт</div>
				<div class="col-check"><icon-comp iconName="icon-check" v-if="false" /></div>
			</div>
			<div class="list-item" v-for="i in 1" :key="i">
				<div class="col-icon"><icon-comp iconName="icon-hot" /></div>
				<div class="col-value">Жарко</div>
				<div class="col-check"><icon-comp iconName="icon-check" v-if="false" /></div>
			</div>
		</ModalDropdownList>
		<ModalDeviceSettings
			v-if="false"
			deviceName="Кондиционер">
		</ModalDeviceSettings>
		<ModalDeviceControl
			v-if="false"
			deviceName="Все приложения"
			:tabs="tabs">
			<BinarySensorControl v-if="false" :slot="tabs[1]" />
			<ACControl v-if="false" class="on" :slot="tabs[0]" />
			<ThresholdValues v-if="false" :slot="tabs[0]" />
			<LampControl :slot="tabs[2]" />
			<DimerControl v-if="false" :slot="tabs[3]" />
			<DeviceStatistics v-if="false" :slot="tabs[0]" />
			<ValveHeatingControl :slot="tabs[0]" />
		</ModalDeviceControl>
		<ModalWithButtons title="Выберите иконку" v-if="false">
			<div class="grid-icons-select" slot="body">
				<BtnIcon icon="icon-dimer-lamp" v-for="i in 50" :key="i" />
			</div>
			<app-button slot="footer" label="Cancel" />
			<app-button slot="footer" label="Done" />
		</ModalWithButtons>
		<FolderOverlay v-if="false" />
		<SwipeHomeScreen v-if="false" />
		<ModalCameraView v-if="false" />
		<ModalWithButtons title="Действие не доступно" v-if="false">
			<div class="fz20 lh1-4" slot="body">
				Данное действие доступно только авторизованным пользователям
			</div>
		</ModalWithButtons>
		<alert-notification>Данное действие доступно только<br>авторизованным пользователям</alert-notification>
	</div>
</template>

<script>
import HomeRoom from "@/views/Home/HomeRoom/HomeRoom"
import ModalDeviceControl from "@/components/modals/ModalDeviceControl"
import ModalDeviceSettings from "@/components/modals/ModalDeviceSettings"
import DeviceStatistics from "@/components/deviceControls/DeviceStatistics"
import ACControl from "@/components/deviceControls/ACControl"
import ThresholdValues from "@/components/deviceControls/ThresholdValues"
import LampControl from "@/components/deviceControls/LampControl"
import DimerControl from "@/components/deviceControls/DimerControl"
import BinarySensorControl from "@/components/deviceControls/BinarySensorControl"
import FolderItem from "@/components/etc/FolderItem"
import FolderOverlay from "@/components/etc/FolderOverlay"
import SwipeHomeScreen from "@/components/etc/SwipeHomeScreen"
import WidgetItem from "@/components/widgets/WidgetItem"
import ModalWithButtons from "@/components/modals/ModalWithButtons"
import Brightness from "@/components/controls/Brightness"
import BtnColorPreset from "@/components/buttons/BtnColorPreset"
import ModalDropdownList from "@/components/modals/ModalDropdownList"
import ValveHeatingControl from "@/components/deviceControls/ValveHeatingControl"
import ModalCameraView from "@/components/modals/ModalCameraView"
import AlertNotification from "@/components/etc/AlertNotification"
export default {
	components: {
		HomeRoom,
		ModalDeviceControl,
		ThresholdValues,
		FolderItem,
		FolderOverlay,
		ModalDeviceSettings,
		DeviceStatistics,
		ACControl,
		DimerControl,
		WidgetItem,
		BinarySensorControl,
		ModalWithButtons,
		LampControl,
		Brightness,
		SwipeHomeScreen,
		BtnColorPreset,
		ModalDropdownList,
		ValveHeatingControl,
		ModalCameraView,
		AlertNotification
	},
	data() {
		return {
			tabs:  ['Статистика', 'Пороговые значения'],
		}
	}
}
</script>

<style lang="less" scoped>

</style>