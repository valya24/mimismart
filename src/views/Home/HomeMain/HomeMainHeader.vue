<template>
  <Header id="header" ref="headerContainer">
    <div class="header__title" ref="title">
      <div class="header__title-icon" ref="titleIcon">
        <icon-comp :isOn="true" iconName="icon-home"/>
      </div>
      <span ref="titleSpan" class="ios-style">
        {{ 'Мой Дом' }}
      </span>
    </div>
  </Header>
</template>

<script>
import Header from "@/components/Header.vue";
import {isPlatform} from "@ionic/vue";

const maxProgress = 1.25;
const iconYOffset = 54;
const opacityThreshold = 0.65;

export default {
  data() {
    return {
      isIos: null,
      pullRatio: 0.5,
      elem: null,
			pulling: false,
			startY: 0,
      currentX: 0,
      currentY: 0,
      pulledHeight: 0,
      overpulledHeight: 0,
      pullThresholdRatio: 0.2,

      fixThreshold: 200,
      progress: 0,
      startWidth: 0,
      endWidth: 0,

      fromEnd: false,
      
      routeContainers: [],
      
      containerEl: null,
      titleSpan: null,
      
      dynamicHeaderEnabled: false,
    }
  },
  mounted() {
    this.isIos = isPlatform('ios')
    this.elem = document.getElementById('header');
  },
  methods: {
    toggleScrolling() {
      // document.body.style['overflow'] = this.pulling ? 'hidden hidden' : 'hidden auto';

      this.routeContainers.forEach( cont => {
        cont.style['overflow'] = this.pulling ? 'hidden' : 'visible';
      })
    },
    initPulling() {
      this.pulling = true;
      this.toggleScrolling();
			// this.elem.style.transition = '0s';
      // this.containerEl.style.transition = "0s";
      this.containerEl.style['overflow-x'] = "visible";
      this.titleSpan.style.transition = `0s`
      this.titleIcon.style.transition = "0s";
    },
    handleTouchStart(e) {
      this.startY = this.pulledHeight ? this.pulledHeight : e.targetTouches[0].screenY;
      this.startX = e.targetTouches[0].screenX;

      this.fromEnd = (this.pulledHeight >= this.fixThreshold * this.pullThresholdRatio);
    },
		handleTouchMove(e) {
      if (this.pulling) {
        if (!e.target.closest('.devices-by-category')) {
          e.preventDefault();
        }
        e.stopPropagation();
      }
      let dx = (e.targetTouches[0].screenX - this.startX) - this.currentX;
      let dy = (e.targetTouches[0].screenY - this.startY) - this.currentY;

      if (Math.abs(dy) <= 5 || Math.abs(dy/dx) < 1.7) return;
      
      this.currentX = e.targetTouches[0].screenX - this.startX;

      // if (!this.pulling && document.documentElement.scrollTop == 0 && dy > 0) {
      //   this.initPulling();
      //   if (!e.target.closest('.devices-by-category')) {
      //     e.preventDefault();
      //   }
      //   e.stopPropagation();
      // }
      if (dy < 0 && this.containerEl.scrollTop == 0 && !this.pulling) {
        return;
      }

			if (e.targetTouches[0].screenY - this.startY <= 0) {
				this.currentY = 0;
			} else {
        this.currentY = e.targetTouches[0].screenY - this.startY;
			}
      
      if (!this.pulling) return;
      
      if (this.pulledHeight + dy * this.pullRatio < 0) {
        this.pulledHeight = 0;
      } else if (this.pulledHeight + dy * this.pullRatio > this.fixThreshold) {
        this.pulledHeight = this.fixThreshold;
        //  KOSTYL
        // if (dy !== (maxProgress - 1) * this.fixThreshold) {
        if (dy !== this.currentY) {
          this.overpulledHeight += dy * this.pullRatio * 0.5;
          if (this.overpulledHeight > this.fixThreshold * (maxProgress - 1) ) {
            this.overpulledHeight = this.fixThreshold * (maxProgress - 1)
          }
        }
      } else {
        this.pulledHeight += dy * this.pullRatio;
      }
      this.containerEl.style.transform = `translateY(${this.pulledHeight + this.overpulledHeight}px)`;
      this.elem.style.transform = `translateY(${this.pulledHeight + this.overpulledHeight}px)`;
      
      this.progress = (this.pulledHeight + this.overpulledHeight) / this.fixThreshold;
      if (this.progress > maxProgress) {
        this.progress = maxProgress
      }
      let scale = 1 + this.progress * 1.4;
      // let transX = this.progress * (this.$el.offsetWidth - 28 - scale * this.startWidth) / 2;
      // let transX = this.progress * (this.$el.offsetWidth - 28 - this.endWidth) / 2;
      let transX = (this.progress < 1 ? this.progress : 1) * ( this.elem.offsetWidth - 28 - this.startWidth * scale ) / 2;
      let h = this.titleSpan.clientHeight * scale;
      let transY = -1 * this.progress * (this.pulledHeight - this.overpulledHeight*0.7 - h) / 2;

      this.titleSpan.style.transform = `translate(${transX}px, ${transY}px) scale(${scale})`

      this.titleIcon.style.transform = `translate(-50%, ${transY - iconYOffset}px) scale(${scale})`
      // this.titleIcon.style.opacity = (scale - 2) / 0.4;
      this.titleIcon.style.opacity = this.pulledHeight < opacityThreshold * this.pulledHeight ? 0 : ((this.progress - opacityThreshold) * (1 / (1 - opacityThreshold)));
      
      // this.titleSpan.style['letter-spacing'] = `${-0.05 * this.progress}em`;
		},
		handleTouchEnd() {
      // this.containerEl.style.transition = ".3s";
      this.titleSpan.style.transition = ".2s";
      this.titleIcon.style.transition = "transform .2s";
      this.elem.style.transition = ".2s";
      this.pulling = false;
      this.toggleScrolling();
      this.startY = 0;
      this.currentY = 0;
      this.overpulledHeight = 0;

      if (
        (!this.fromEnd &&
        this.pulledHeight >= this.fixThreshold * this.pullThresholdRatio) ||
        (this.fromEnd &&
        (this.fixThreshold - this.pulledHeight) <= this.fixThreshold * this.pullThresholdRatio)
      ) {
        this.pulledHeight = this.fixThreshold;
        this.containerEl.style.transform = `translateY(${this.pulledHeight}px)`;
        this.elem.style.transform = `translateY(${this.pulledHeight}px)`;

        this.progress = 1;
        let scale = 1 + this.progress * 1.4;
        let transX = this.progress * (this.elem.offsetWidth - 28 - scale * this.startWidth) / 2;
        let h = this.titleSpan.clientHeight * scale;
        let transY = -1 * this.progress * (this.fixThreshold - h) / 2;

        this.titleSpan.style.transform = `translate(${transX}px, ${transY}px) scale(${scale})`
        this.titleIcon.style.transform = `translate(-50%, ${transY - iconYOffset}px) scale(${scale})`
        // this.titleIcon.style.opacity = (scale - 2) / 0.4;
        // this.titleIcon.style.opacity = this.pulledHeight < opacityThreshold * this.pulledHeight ? 0 : ((this.progress - opacityThreshold) * (1 / (1 - opacityThreshold)));
        this.titleIcon.style.opacity = 1;

        // this.titleSpan.style['letter-spacing'] = `${-0.05 * this.progress}em`;
      } else {
        this.pulledHeight = 0;
        // this.containerEl.style.transform = `none`;
        this.elem.style.transition = '.3s';
        // this.elem.style.transform = `none`;
        this.titleSpan.style.transition = `.3s`
        // this.titleSpan.style.transform = `none`
      }
    },
    handleScroll(e) {
      e.preventDefault();
    },

    init() {
      // this.routeContainers = this.$router.currentRoute.matched.map( route => route.instances.default.$el );

      this.containerEl = this.routeContainers[this.routeContainers.length - 1];

      // this.containerEl.addEventListener('touchstart', this.handleTouchStart);
      // this.containerEl.addEventListener('touchmove', this.handleTouchMove);
      // this.containerEl.addEventListener('touchend', this.handleTouchEnd);

      document.addEventListener('scroll', this.handleScroll);
    },
    destroyDynamicHeaderProcessing() {
      this.pulledHeight = 0;
      this.handleTouchEnd();

      // this.containerEl.removeEventListener('touchstart', this.handleTouchStart);
      // this.containerEl.removeEventListener('touchmove', this.handleTouchMove);
      // this.containerEl.removeEventListener('touchend', this.handleTouchEnd);

      document.removeEventListener('scroll', this.handleScroll);

      this.routeContainers.forEach( cont => {
        cont.removeAttribute('style');
      })
      this.elem.removeAttribute('style');
    }
  },
  beforeRouteEnter(to, from, next) {
    next( vm => {
      vm.dynamicHeaderEnabled = (window.innerWidth < 767);

      if (vm.dynamicHeaderEnabled) {
        const endWidthCoef = 2.4;

        vm.titleSpan = vm.$refs.titleSpan;
        vm.titleIcon = vm.$refs.titleIcon;
        vm.startWidth = vm.titleSpan.offsetWidth;
        vm.endWidth = vm.titleSpan.offsetWidth * endWidthCoef;
        vm.init();
      }
    })
  },
  beforeRouteLeave(to, from, next) {
    if (this.dynamicHeaderEnabled) {
      this.destroyDynamicHeaderProcessing();
    }

    next();
  },
  components: {
    Header
  }
}
</script>

<style lang="less">
.header {
  position: relative;
  transition: .3s;
  &__title {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    transition: .3s linear;
    &-icon {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, -50px);
      transition: .3s linear;
    }
    span {
      position: absolute;
      // transition: .25s;
      text-align: center;
      transform-origin: 0% 100%;
    }
    .ios-style {
      bottom: -48px;
    }
    &::before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      display: block;
      width: 100%;
      height: 100vh;
      background-color: #fff;
    }
  }
}
</style>