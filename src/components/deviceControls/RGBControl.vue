<template>
  <div class="rgb-control controls-body">
    <div class="rgb-control-main">
      <div class="rgb-control-colors" :class="{ '--disabled': !+rgbLamp.active !== '00' }">
        <div class="rgb-control-colors-item"
          v-for="color in colors" :key="color"
          :style="{ 'background-color': color }"
          @click="handleSampleColorClick(color)">
        </div>
      </div>

      <div ref="picker"
        class="rgb-control-color-picker"
        :class="{ '--disabled': +rgbLamp.active !== '00' }"
        ></div>

      <Brightness direction="vertical"
        :min="1" :max="250"
        :value="brightness"
        :disabled="!+rgbLamp.active"
        @change="handleBrightnessChange"/>
    </div>
    

    <div class="controls-footer hbox just-cn">
			<div class="col-switch vbox alic"
        @click="handleToggle">
				<div class="label">{{ +rgbLamp.active ? $t('On_1') : $t('Off_1') }}</div>
				<app-switch :checked="+rgbLamp.active" />
			</div>
		</div>

  </div>
</template>

<script>
import iro from '@jaames/iro';

import Switch from "@/components/controls/Switch";
import Brightness from "@/components/controls/Brightness";

import { debounce } from '@/utils/functions.js';
import {mapActions, mapGetters} from "vuex";
import {hexToDecimal, replaceAt} from "@/utils/transformers";

const colorChangeThreshold = 10;

export default {
  props: {
    active: Boolean,
    addr: String,
    color: Object
  },
  data() {
    return {
      roomId: null,
      inColor: {
        h: this.color.h || 0,
        s: this.color.s || 0,
        v: 100,
      },
      brightness: this.color.v,
      colorPicker: null,
      // colors: ['#FF7C52', '#FFCF52', '#6AFF52', '#52A2FF', '#E752FF']
      // colors: ['#ff0000', '#ffb800', '#21ff00', '#007eff', '#d800ff'],
      colors: ['#ff0000', '#21ff00', '#007eff', '#d800ff', '#ffffff'],
    }
  },
  computed: {
    ...mapGetters(['rgbLamp']),
    ...mapGetters('ws', ['sensorDevice']),
  },
  watch: {
    color(newVal, oldVal) {
      this.brightness = this.color.v;

      if (Math.abs(newVal.h - oldVal.h) < colorChangeThreshold &&
          Math.abs(newVal.s - oldVal.s) < colorChangeThreshold) {
            return;
          }
      this.inColor = {
        h: Math.round(newVal.h),
        s: Math.round(newVal.s),
        v: 100,
      };

      this.colorPicker.setColors([this.inColor]);      
    },
    sensorDevice: {
      deep: true,
      handler(val) {
        if (val.addr === this.addr) {
          const rgbLampData = {
            active: val.status.slice(1, 2),
            bright: Math.ceil(hexToDecimal(`00${val.status.slice(2, 4)}`, this.icon)),
            state: val.status
          };

          this.$store.commit('setRgbLampData', rgbLampData);
        }
      }
    }
  },
  methods: {
    ...mapActions('modules/settings', ['subscribeRequest']),
    async handleToggle() {
      let isActive = +this.rgbLamp.state.charAt(1) ? '0' : '1';
      const active = replaceAt(this.rgbLamp.state, 1, isActive);
      await this.$emit('toggle', active)
      const addrs = this.$store.getters.getRoomItems(this.roomId);
      await this.subscribeRequest(addrs.map(addr => addr.attributes.addr))
    },
    handleSampleColorClick(color) {
      this.colorPicker.setColors([color]);
    },
    handleBrightnessChange(value) {
      this.brightness = Math.round(value);
      this.$emit('brightness', this.brightness);
      // let newColor = {...this.color.hsva};
      // newColor.v = this.brightness * 100;
      // this.colorPicker.setColors([newColor])
    },
    // handleBrightnessChange: debounce(function(value) {
    //   this.brightness = Math.round(value);
    //   this.$emit('brightness', this.brightness);
    // }, 250),
    handleColorChange: debounce(function(value) {
      this.inColor = value;
      this.$emit('change', value.$);
    }, 100)
    // handleColorChange(value) {
    //   this.$emit('change', value.$);
    // }
  },
  mounted() {
    this.$nextTick(function() {
      this.colorPicker = new iro.ColorPicker(this.$refs.picker, {
        color: this.inColor,
        // layoutDirection: 'horizontal',
        width: 200,
        sliderSize: 16,
        handleRadius: 10,
        // margin: 'auto',
        wheelLightness: false,
        layout: [
          { 
            component: iro.ui.Wheel,
          },
        ]
      });

      this.colorPicker.on([/*'color:init',*/ 'color:change', 'color:setActive'], (color) => {
        if (!+this.rgbLamp.active) {
          this.colorPicker.setColors([this.inColor]);
          return;
        }
        this.handleColorChange(color);
      });
    })
    this.roomId = this.$route.params.id
  },
  components: {
    "app-switch": Switch,
    Brightness,
  }
}
</script>

<style lang="less">
.rgb-control {
  &-main {
    display: flex;
    align-items: stretch;
    justify-content: space-between
  }
  &-color-picker {
    padding: 0 12px;
    display: flex;
    transition: .2s;
    .IroColorPicker {
      // display: flex !important;
      flex-grow: 1;
    }
    &.--disabled {
      filter: contrast(30%) brightness(120%) grayscale(10%);
    }
  }
  &-colors {
    // width: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    // margin-right: calc(50% - 100px - 12px - 8px) !important;
    transition: .2s;
    &-item {
      width: 24px;
      height: 24px;
      border-radius: 3px;

      box-shadow: 0px 2px 4px rgba(#4d4d65,  .18);
    }
    &.--disabled {
      filter: contrast(30%) brightness(120%) grayscale(10%);
    }
  }
  .foot-controls {
    margin-top: 32px;
    justify-content: center;
    .label {
      font-size: 12px;
      margin-bottom: 4px;
      color: #333;
    }
  }
}
</style>