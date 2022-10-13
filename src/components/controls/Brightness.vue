<template>
  <div class="brightness"
    :class="{
      '--vertical': direction == 'vertical',
      '--disabled': disabled || gray
    }"
    @touchstart="handleTouch"
    @touchmove="handleTouch"
    @touchend="handleTouchEnd"
  >
    

    <!-- TODO: Remake animation to scaleX(...) -->
    <div class="brightness-bar"
      :style="{
        'transform': direction == 'horizontal' ? `translate(${inValue * (boundRect.width - 40) + 20 - boundRect.width}px, 0)` : `translate(0, ${20 + (boundRect.height - 40) * (1 - inValue)}px)`,
      }">
      
      <div class="brightness-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="5" fill="white" />
          <path fill-rule="evenodd" clip-rule="evenodd" d="M7.80783 17.6064C7.27174 17.2049 6.79513 16.7283 6.39362 16.1922L4.29289 18.2929L5.70711 19.7071L7.80783 17.6064ZM11 18.9291C11.3266 18.9759 11.6605 19 12 19C12.3395 19 12.6734 18.9759 13 18.9291V22H11V18.9291ZM16.1922 17.6064L18.2929 19.7071L19.7071 18.2929L17.6064 16.1922C17.2049 16.7283 16.7283 17.2049 16.1922 17.6064ZM18.9291 13H22V11H18.9291C18.9759 11.3266 19 11.6605 19 12C19 12.3395 18.9759 12.6734 18.9291 13ZM17.6064 7.80783L19.7071 5.70712L18.2929 4.29291L16.1922 6.39362C16.7283 6.79513 17.2049 7.27174 17.6064 7.80783ZM13 5.07091V2H11V5.07091C11.3266 5.0242 11.6605 5.00002 12 5.00002C12.3395 5.00002 12.6734 5.0242 13 5.07091ZM7.80785 6.39364L5.70711 4.29291L4.29289 5.70712L6.39364 7.80786C6.79515 7.27176 7.27175 6.79516 7.80785 6.39364ZM5.07092 11H2V13H5.07091C5.0242 12.6734 5.00002 12.3395 5.00002 12C5.00002 11.6605 5.0242 11.3266 5.07092 11Z" fill="white" />
        </svg>
      </div>
      </div>
    <!-- <div class="brightness-bar"
      :style="{
        'width': direction == 'horizontal' ? `calc(40px + ${inValue * 100}%)` : '100%',
        'height': direction == 'vertical' ? `calc(40px + ${inValue * 100}%)` : '100%',
      }"></div> -->
  </div>
</template>

<script>
// import { debounce } from '@/utils/functions.js';

export default {
  props: {
    direction: {
      type: String,
      default: 'horizontal'
    },
    value: {
      type: Number,
      default: 1
    },
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 1
    },
    disabled: {
      type: Boolean,
      default: false
    },
    gray: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      inValue: (parseFloat(this.value) - this.min) / (this.max - this.min),
      boundRect: {}
      // inValue: (this.value - this.min) / (this.max - this.min)
    }
  },
  watch: {
    value(newVal) {
      this.inValue = (newVal - this.min) / (this.max - this.min);
    },
    // value: debounce(function(newVal) {
    //   console.log('newval = ', newVal)
    //   // this.inValue = (newVal - this.min) / (this.max - this.min);
    //   let newInValue = (parseFloat(newVal) - this.min) / (this.max - this.min);
    //   if (Math.abs(parseFloat(this.inValue) - newInValue) > 0.03) {
    //     this.inValue = newInValue;
    //   }
    // }, 200),
  },
  methods: {
    calcValue() {
      return this.min + (this.max - this.min) * this.inValue;
    },
    handleTouch(e) {
      // if (e.target.tagName != 'svg' && e.target.tagName != 'circle' && e.target.tagName != 'path' && !e.target.classList.contains('brightness-icon')) {
      //   return false;
      // }
      if (this.disabled) return false;
      
      e.stopPropagation();
      e.preventDefault();

      let boundRect = this.$el.getBoundingClientRect();
      this.boundRect = boundRect;
      this.boundRect.width = this.$el.offsetWidth;
      
      let inValue = 0;

      if (this.direction == 'horizontal') {
        let touchX = e.touches[0].clientX - boundRect.left;
        if (touchX < 20) {
          touchX = 20;
        } else if (touchX > boundRect.width - 20) {
          touchX = boundRect.width - 20;
        }
        inValue = (touchX - 20) / (boundRect.width - 40);
      } else if (this.direction == 'vertical') {
        let touchY = boundRect.height - (e.touches[0].clientY - boundRect.top);
        if (touchY < 20) {
          touchY = 20;
        } else if (touchY > boundRect.height - 20) {
          touchY = boundRect.height - 20;
        }
        inValue = (touchY - 20) / (boundRect.height - 40);
      }
      
      window.requestAnimationFrame(() => {
        if (inValue > 1) {
          this.inValue = 1;
        } else {
          this.inValue = inValue;
        }
      })

      this.$emit('change', this.calcValue())
    },
    handleTouchEnd() {
      this.$emit('change', this.calcValue())
    }
  },
  mounted() {
    this.$nextTick( () => {
      this.boundRect = this.$el.getBoundingClientRect();

      this.boundRect.width = this.$el.offsetWidth;
    })
  }
}
</script>

<style lang="less" scoped>

.theme-dark {
  .brightness {
    background-color: rgba(255,255,255,0.2);
    &.--disabled .brightness-bar,
    &.--disabled .brightness-icon {background: #43464E;}
    &-bar, &-icon {
      background-color: @colorMainDark;
    }
  }
}

.brightness {
  position: relative;
  height: 34px;
  display: flex;
  border-radius: 17px;
  background-color: #EBEBEB;
  overflow: hidden;
  transition: 0;
  // iOS blinking square borders fix
  -webkit-mask-image: -webkit-radial-gradient(white, black);
  &-icon {
    // margin-left: auto;
    position: absolute;
    top: 0;
    right: 0;
    width: 40px;
    height: 34px;
    // position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: @colorMain;
    transition: background-color .1s;

    // border-radius: 17px 0 0 17px;
    border-radius: 17px;
    // overflow: hidden;
    transform: translateX(50%);
    &::before {
      content: '';
      position: absolute;
      top: -25%;
      left: -25%;
      width: 150%;
      height: 150%;
    }
  }
  &-bar {
    position: absolute;
    top: 0;
    // left: -20px;
    // left: 39px;
    left: 0;
    // margin-left: 39px;
    height: 100%;
    width: 100%;
    z-index: 1;
    background-color: @colorMain;
    // transition: .1s;
    transition: background-color .1s;
    transform-origin: 0% 50%;
    
    border-radius: 17px 0 0 17px;
    // transform: scale(0, 1);
  }

  &.--vertical {
    width: 34px;
    height: auto;
  }
  &.--vertical &-icon {
    
    // margin-top: auto;
    width: 34px;
    height: 40px;
    border-radius: 17px 17px 0 0;
    transform: translateY(-50%);
    
  }
  &.--vertical &-bar {
    // top: auto;
    // bottom: 39px;
    // bottom: -20px;
    top: 0;
    bottom: auto;
    left: 0;
    width: 100%;
    // height: auto;
    max-height: 100%;
    transform-origin: 50% 0%;
    border-radius: 0 0 17px 17px;
    // transform: scale(1, 0);
  }

  &.--disabled &-bar,
  &.--disabled &-icon {
    background-color: #c4c4c4;
  }
}
</style>