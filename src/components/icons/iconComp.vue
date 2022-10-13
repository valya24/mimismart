<template>
    <div class="icon-holder">
        <div class="warning" v-if="!$options.components[iconName]" >{{ iconName }}</div>
        <component :isOn="isOn" :ignoring="ignoring"
            :is="$options.components[iconName] ? iconName : 'icon-cross'"
            :value="value"
            />
    </div>
</template>

<style lang="less">
.icon-holder {
    width: 24px;
    height: 24px;
    .warning {
        position: absolute;
        top: 3px;
        left: 0;
        width: 100%;
        text-align: center;
        color: #000;
        font-size: 10px;
        z-index: 5;
    }
    .warning + div > svg {
        fill: #f22;
    }
    & > div {
        position: relative;
        z-index: 1;
        // width: inherit;
        // height: inherit;
        width: 100%;
        height: 100%;
        display: inline-block;
        //vertical-align: middle;
    }
    .icon-on {
        opacity: 0;
        .router-link-active & {
            opacity: 1;
        }
    }
    .icon-on, .icon-off {
        left: 0;
        top: 0;
        position: absolute;
        transition: opacity @defaultTrsTime;
    }
}

.--disabled {
    .fill-variable {fill: @colorGrayedOut}
    .fill-const {
        fill: lighten(@colorGrayedOut, 12%);
    }
    .level1, .level2, .level3, .level4 {
        fill: lighten(@colorGrayedOut, 12%)
    }
    .level1.active, .level2.active, .level3.active, .level4.active {fill: @colorGrayedOut}
}
.--enabled {
    .fill-variable {fill: @colorMain}
}
.router-link-active .icon-off {
    opacity: 0;
}
// .room-picture .sensor {
//     .fill-const, .fill-orange {fill: rgba(255,255,255,0.6) !important}
// }
// .router-link-exact-active, .room-picture .sensor {
//     .fill-variable {fill: #fff}
//     .icon-illumination {
//         .fill-red {fill: #fff}
//         .fill-orange {fill: @colorPaleBlue}
//     }
// }
.room-sensors.--white .sensor {
    .fill-const, .fill-orange {fill: rgba(255,255,255,0.6) !important}
}

.overlay-icon {.fill-variable {fill: currentColor !important}}
.room-sensors.--white .sensor {
//.router-link-exact-active, .room-sensors.--white .sensor {
    .fill-variable {fill: #fff}
    .icon-illumination {
        .fill-red {fill: #fff}
        .fill-orange {fill: @colorPaleBlue}
    }
}
.fill-variable {
    fill: @colorMain;
    transition: fill 0.2s;
    .modal-camera-view & {fill: #fff}
    .--active .mode-item.--active & {fill: #fff}
}
.folder-overlay .btn-icon {
    .fill-variable {fill: #fff}
}
.fill-const {
    fill: @colorPaleBlue;
}
.stroke-variable {stroke: @colorMain;}
.light {fill: none}
.icon-tile {
    &.on {
        .fill-variable {fill: #fff}
        .stroke-variable {stroke: #fff}
        .light {fill: @colorYellow}
        &.sensor {
            .fill-const {fill: rgba(255,255,255,0.5)}
        }
    }
}
.controls-body, .connected-sensors > div {
    &.on {
        .light {fill: @colorYellow}
        .fill-variable {fill: @colorMain}
        .stroke-variable {stroke: @colorMain}
        .fill-const {fill: @colorPaleBlue}
        .icon-swing .active, .icon-swing-horiz .active {fill: @colorMain}
    }
    .icon-swing .active, .icon-swing-horiz .active {fill: @colorGrayedOut}
    .fill-variable {fill: @colorGrayedOut}
    .fill-const {fill: @colorGrayedOutLighter}
    .stroke-variable {stroke: @colorGrayedOut}
}
.fill-orange {fill: @colorOrange}
.fill-red {fill: @colorRed}
.outer-stroke {
    fill: #fff;
}
.theme-dark {
    .fill-variable {fill: @colorMainDark;}
    .fill-const {fill: @colorSecDark;}
    .outer-stroke {fill: #4C4C63;}
    .icon-tile {
        &.on {
        }
    }
}
// .icon-swing, .icon-swing-horiz {
//     .arrow-top, .arrow-middle, .arrow-bottom {
//         fill: @colorGrayedOutLighter;
//     }
// }
</style>

<script>
import iconHome from './iconHome'
import iconHomeF from './iconHomeF'
import iconFavs from './iconFavs'
import iconRooms from './iconRooms'
import iconSettings from './iconSettings'
import iconCurtains from './iconCurtains'
import iconLightScheme from './iconLightScheme'
import iconScript from './iconScript'
import iconTemp from './iconTemp'
import iconLightness from './iconLightness'
import iconTuning from './iconTuning'
import iconHumidity from './iconHumidity'
import iconMovement from './iconMovement'
import iconClose from './iconClose'
import iconPlus from './iconPlus'
import iconMinus from './iconMinus'
import iconSwing from './iconSwing'
import iconSnowflake from './iconSnowflake'
import iconPowerlevel from './iconPowerlevel'
import iconDimerLamp from './iconDimerLamp'
import iconRGBLamp from './iconRGBLamp'
import iconLamp from './iconLamp'
import iconAlarm from './iconAlarm'
import iconBack from './iconBack'
import iconTrash from './iconTrash'
import iconDuplicate from './iconDuplicate'
import iconEdit from './iconEdit'
import iconConditioner from './iconConditioner'
import iconGarage from './iconGarage'
import iconSensorAmps from './iconSensorAmps'
import iconSensorVolts from './iconSensorVolts'
import iconLeakDry from './iconLeakDry'
import iconLeakWet from './iconLeakWet'
import iconSensorGas from './iconSensorGas'
import iconSensorCO2 from './iconSensorCO2'
import iconSensorSmoke from './iconSensorSmoke'
import iconCamera from './iconCamera'
import iconCameraRotate from './iconCameraRotate'
import iconMic from './iconMic'
import iconRollets from './iconRollets'
import iconFramuga from './iconFramuga'
import iconFramugaOpen from './iconFramugaOpen'
import iconWindow from './iconWindow'
import iconWindowOpen from './iconWindowOpen'
import iconDoor from './iconDoor'
import iconDoorOpen from './iconDoorOpen'
import iconJalousie from './iconJalousie'
import iconPlisse from './iconPlisse'
import iconGlassBlur from './iconGlassBlur'
import iconHumidifierDesk from './iconHumidifierDesk'
import iconHumidifierSplinker from './iconHumidifierSplinker'
import iconSupplyUnit from './iconSupplyUnit'
import iconFanExhaust from './iconFanExhaust.vue'
import iconConvectorFan from './iconConvectorFan.vue'
import iconConvectorFloor from './iconConvectorFloor.vue'
import iconClimateControl from './iconClimateControl.vue'
import iconVent from './iconVent.vue'
import iconGatesSlide from './iconGatesSlide.vue'
import iconFancoil from './iconFancoil.vue'
import iconWatering from './iconWatering.vue'
import iconLedStripe from './iconLedStripe.vue'
import iconFan from './iconFan.vue'
import iconCurtainsOneside from './iconCurtainsOneside.vue'
import iconGates from './iconGates.vue'
import iconFaucet from './iconFaucet.vue'
import iconFountain from './iconFountain.vue'
import iconMeter from './iconMeter.vue'
import iconSocket from './iconSocket.vue'
import iconSwitch from './iconSwitch.vue'
import iconCurtainsRoll from './iconCurtainsRoll.vue'
import iconRadiator from './iconRadiator.vue'
import iconCameraBulb from './iconCameraBulb.vue'
import iconComfort from './iconComfort.vue'
import iconHand from './iconHand.vue'
import iconLoopJust1 from './iconLoopJust1.vue'
import iconJust1 from './iconJust1.vue'
import iconShuffle from './iconShuffle.vue'
import iconIntro from './iconIntro.vue'
import iconCheck from './iconCheck.vue'
import iconHot from './iconHot.vue'
import iconAuto from './iconAuto.vue'
import iconEconom from './iconEconom.vue'
import iconMore from './iconMore.vue'
import iconMultiroom from './iconMultiroom.vue'

import iconCross from './iconClose.vue'

import iconPlayNext from './iconPlayNext.vue'
import iconPlayPrev from './iconPlayPrev.vue'
import iconPlay from './iconPlay.vue'
import iconPause from './iconPause.vue'
import iconVolumeMid from './iconVolumeMid.vue'
import iconPhoto from './iconPhoto.vue'
import iconBellNav from './iconBellNav.vue'
import iconSecurity from './iconSecurity.vue'
import iconOtherDevices from './iconOtherDevices.vue'
import iconText from './iconText.vue'
import iconPower from './iconPower.vue'
import iconSwingHoriz from './iconSwingHoriz.vue'
import iconConnected from './iconConnected.vue'
import iconDisconnected from './iconDisconnected.vue'
import iconOff from './iconOff.vue'
import iconMute from './iconMute.vue'
import iconLockOpened from './iconLockOpened.vue'
import iconLockClosed from './iconLockClosed.vue'
import iconGlobeOff from './iconGlobeOff.vue'
import iconGlobeOn from './iconGlobeOn.vue'
import iconUser from './iconUser.vue'
import iconCloudOff from './iconCloudOff.vue'
import iconCloudOn from './iconCloudOn.vue'
import iconWifiOff from './iconWifiOff.vue'
import iconWifiOn from './iconWifiOn.vue'
import iconSeaVue from './iconSea.vue'
import iconAromaVue from './iconAroma.vue'
import iconICameVue from './iconICame.vue'
import iconILeftVue from './iconILeft.vue'
import iconEveningVue from './iconEvening.vue'
import iconCeilingLampVue from './iconCeilingLamp.vue'
import iconCeilingLamp2Vue from './iconCeilingLamp2.vue'
import iconLampRingsVue from './iconLampRings.vue'
import iconSphereOnVue from './iconSphereOn.vue'
import iconSphereOffVue from './iconSphereOff.vue'
import iconPtichkaRightVue from './iconPtichkaRight.vue'
import iconPtichkaLeftVue from './iconPtichkaLeft.vue'
import iconFireVue from './iconFire.vue'
import iconNightVue from './iconNight.vue'
import iconRomanticVue from './iconRomantic.vue'
import iconCelebrationVue from './iconCelebration.vue'
import iconLeakMaintenance from './iconLeakMaintenance.vue'
import iconAlarmOff from './iconAlarmOff.vue'
import iconMaintenance from './iconMaintenance.vue'
import iconBackspace from './iconBackspace.vue'

export default {
    props: ['iconName', 'isOn', 'value', 'ignoring'],
    components: {
        'icon-home': iconHome,
        'icon-home-f': iconHomeF,
        'icon-favs': iconFavs,
        'icon-rooms': iconRooms,
        'icon-notifications': iconBellNav,
        'icon-settings': iconSettings,
        'icon-curtains': iconCurtains,
        'icon-jalousie': iconCurtains,
        'icon-jalousie120': iconCurtains,
        'icon-light-scheme': iconLightScheme,
        'icon-script': iconScript,
        'icon-tuning': iconTuning,
        'icon-close': iconClose,
        'icon-plus': iconPlus,
        'icon-minus': iconMinus,
        'icon-swing': iconSwing,
        'icon-snowflake': iconSnowflake,
        'icon-powerlevel': iconPowerlevel,
        'icon-dimer-lamp': iconDimerLamp,
        'icon-rgb-lamp': iconRGBLamp,
        'icon-lamp': iconLamp,
        'icon-alarm': iconAlarm,
        'icon-back': iconBack,
        'icon-trash': iconTrash,
        'icon-duplicate': iconDuplicate,
        'icon-edit': iconEdit,
        'icon-conditioner': iconConditioner,
        'icon-garage': iconGarage,
        'icon-temperature': iconTemp,
        'icon-illumination': iconLightness,
        'icon-humidity': iconHumidity,
        'icon-motion': iconMovement,
        'icon-sensor-amps': iconSensorAmps,
        'icon-sensor-volts': iconSensorVolts,
        'icon-leak-dry': iconLeakDry,
        'icon-leak-wet': iconLeakWet,
        'icon-sensor-gas': iconSensorGas,
        'icon-sensor-co2': iconSensorCO2,
        'icon-co2': iconSensorCO2,
        'icon-sensor-smoke': iconSensorSmoke,
        'icon-camera': iconCamera,
        'icon-rtsp': iconCamera,
        'icon-camera-rotate': iconCameraRotate,
        'icon-mic': iconMic,
        'icon-rollets': iconRollets,
        'icon-framuga': iconFramuga,
        'icon-framuga-open': iconFramugaOpen,
        'icon-window': iconWindow,
        'icon-window-open': iconWindowOpen,
        'icon-door': iconDoor,
        'icon-door-open': iconDoorOpen,
        'icon-jalousie-blinds': iconJalousie,
        'icon-plisse': iconPlisse,
        'icon-glass-blur': iconGlassBlur,
        'icon-humidifier-desk': iconHumidifierDesk,
        'icon-humidifier-splinker': iconHumidifierSplinker,
        'icon-supply-unit': iconSupplyUnit,
        'icon-fan-exhaust': iconFanExhaust,
        'icon-convector-fan': iconConvectorFan,
        'icon-convector-floor': iconConvectorFloor,
        'icon-climate-control': iconClimateControl,
        'icon-ventilation': iconVent,
        'icon-gates-slide': iconGatesSlide,
        'icon-fancoil': iconFancoil,
        'icon-watering': iconWatering,
        'icon-led-stripe': iconLedStripe,
        'icon-fan': iconFan,
        'icon-air-fan': iconFan,
        'icon-curtains-oneside': iconCurtainsOneside,
        'icon-gates': iconGates,
        'icon-faucet': iconFaucet,
        'icon-valve': iconFaucet,
        'icon-fountain': iconFountain,
        'icon-meter': iconMeter,
        'icon-socket': iconSocket,
        'icon-switch': iconSwitch,
        'icon-curtains-roll': iconCurtainsRoll,
        'icon-radiator': iconRadiator,
        'icon-valve-heating': iconRadiator,
        'icon-camera-bulb': iconCameraBulb,
        'icon-comfort': iconComfort,
        'icon-hand': iconHand,
        'icon-loop-just1': iconLoopJust1,
        'icon-just1': iconJust1,
        'icon-shuffle': iconShuffle,
        'icon-intro': iconIntro,
        'icon-check': iconCheck,
        'icon-hot': iconHot,
        'icon-auto': iconAuto,
        'icon-econom': iconEconom,
        'icon-more': iconMore,
        'icon-multiroom': iconMultiroom,
        'icon-speaker': iconMultiroom,

        'icon-cross': iconCross,

        'icon-play-next': iconPlayNext,
        'icon-play-prev': iconPlayPrev,
        'icon-play': iconPlay,
        'icon-pause': iconPause,
        'icon-volume-mid': iconVolumeMid,
        'icon-photo': iconPhoto,
        'icon-security': iconSecurity,
        'icon-other-devices': iconOtherDevices,
        'icon-text': iconText,
        'icon-long-text': iconText,
        'icon-power': iconPower,
        'icon-swing-horiz': iconSwingHoriz,
        'icon-connected': iconConnected,
        'icon-disconnected': iconDisconnected,

        'icon-voltage': iconSensorVolts,
        'icon-off': iconOff,
        'icon-mute': iconMute,
        'icon-lock-opened': iconLockOpened,
        'icon-lock-closed': iconLockClosed,
        'icon-globe-off': iconGlobeOff,
        'icon-globe-on': iconGlobeOn,
        'icon-user': iconUser,
        'icon-cloud-off': iconCloudOff,
        'icon-cloud-on': iconCloudOn,
        'icon-wifi-off': iconWifiOff,
        'icon-wifi-on': iconWifiOn,
        'icon-sea': iconSeaVue,
        'icon-aroma': iconAromaVue,
        'icon-i-came': iconICameVue,
        'icon-i-left': iconILeftVue,
        'icon-evening': iconEveningVue,
        'icon-ceiling-lamp': iconCeilingLampVue,
        'icon-ceiling-lamp2': iconCeilingLamp2Vue,
        'icon-lamp-rings': iconLampRingsVue,
        'icon-sphere-on': iconSphereOnVue,
        'icon-sphere-off': iconSphereOffVue,
        'icon-ptichka-right': iconPtichkaRightVue,
        'icon-ptichka-left': iconPtichkaLeftVue,
        'icon-fire': iconFireVue,
        'icon-night': iconNightVue,
        'icon-romantic': iconRomanticVue,
        'icon-celebration': iconCelebrationVue,
        'icon-leak-maintenance': iconLeakMaintenance,
        'icon-alarm-off': iconAlarmOff,
        'icon-maintenance': iconMaintenance,
        'icon-backspace': iconBackspace
    }
}
</script>