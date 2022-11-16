<template>
  <Header class="just-sb">
    <div class="col-back" @click="$router.push('/home')">
      <BtnIcon icon="icon-back" />
    </div>

    <div class="col-header-title tac header__title"
      
    >
      <span ref="titleSpan">{{ $t("Categories") }}</span>
    </div>

    <div class="col-empty"></div>

    <div class="devices-by-category hbox alic" ref="navCategoriesContainer" >
			<device-category-item
				ref="navCategories"
				v-for="(group, key) in deviceGroups"
				:key="key"
				:icon="group.icon"
				:name="$t(group.name)"
				:isOn="key == $route.params.category"
				:value="0"

				@click="$router.push(`/home/category/${key}`)"
			/>
		</div>
  </Header>
</template>

<script>
import Header from "@/components/Header.vue";
import BtnIcon from "@/components/buttons/BtnIcon.vue";

import DeviceCategoryItem from "@/components/DeviceCategoryItem";

const maxProgress = 1.25;

export default {
  data() {
    return {
      pullRatio: 0.5,
      elem: null,
			pulling: false,
      startY: 0,
      startOffsetLeft: 0,
      currentX: 0,
      currentY: 0,
      pulledHeight: 0,
      overpulledHeight: 0,
      pullThresholdRatio: 0.2,

      fixThreshold: 200,
      progress: 0,
      startWidth: 0,

      fromEnd: false,
      
      routeContainers: [],
      
      containerEl: null,
      titleSpan: null
    }
  },
  mounted() {
    this.elem = document.getElementById('header');
  },
  computed: {
    deviceGroups() {
			return this.$store.state.groups;
		},
    category() {
      return this.$route.params.category
    }
  },
  watch: {
    category(newVal) {
      let categories = Object.entries(this.deviceGroups).map( item => item[0] );
      let index = categories.indexOf(newVal);
    
      let targetEl = this.$refs.navCategories[index].$el;
      let leftThreshold = 16;
      let rightThreshold = window.innerWidth - 16;
      let elLeft = targetEl.getBoundingClientRect().left;
      let elRight = targetEl.getBoundingClientRect().right;

      const initScrollLeft = this.$refs.navCategoriesContainer.scrollLeft;
      const frames = 18;

      if (elRight > rightThreshold) {
        let diff = elRight - rightThreshold;

        for (let i = 0; i < frames; i++) {
          setTimeout(() => {
            window.requestAnimationFrame(() => {
              this.$refs.navCategoriesContainer.scrollLeft = initScrollLeft + (diff / frames) * i;
            })
          }, i * (1000 / 60));
        }
      }

      if (elLeft < leftThreshold) {
        let diff = leftThreshold - elLeft;

        for (let i = 0; i < frames; i++) {
          setTimeout(() => {
            window.requestAnimationFrame(() => {
              this.$refs.navCategoriesContainer.scrollLeft = initScrollLeft - (diff / frames) * i;
            })
          }, i * (1000 / 60));
        }
      }
    }
  },
  methods: {
    toggleScrolling() {
      document.body.style['overflow'] = this.pulling ? 'hidden hidden' : 'hidden auto';

      this.routeContainers.forEach( cont => {
        cont.style['overflow'] = this.pulling ? 'hidden' : 'visible';
        // cont.style.transition = '0s'
      })
    },
    initPulling() {
      this.pulling = true;
      this.toggleScrolling();
      this.elem.style.transition = '0s';
      this.containerEl.style.transition = "0s";
      this.containerEl.style['overflow-x'] = "visible";
      this.titleSpan.style.transition = `0s`
    },
    handleTouchStart(e) {
      this.startY = this.pulledHeight ? this.pulledHeight : e.targetTouches[0].screenY;
      this.startX = e.targetTouches[0].screenX;

      this.fromEnd = (this.pulledHeight >= this.fixThreshold * this.pullThresholdRatio);
      // this.routeContainers.forEach( cont => {
      //   cont.style.transition = '0s'
      // })
    },
		handleTouchMove(e) {
      if (this.pulling) {
        e.preventDefault();
        e.stopPropagation();
      }
      let dx = (e.targetTouches[0].screenX - this.startX) - this.currentX;
      let dy = (e.targetTouches[0].screenY - this.startY) - this.currentY;

      if (Math.abs(dy) <= 5 || Math.abs(dy/dx) < 1.7) return;
      
      this.currentX = e.targetTouches[0].screenX - this.startX;

      if (!this.pulling && document.documentElement.scrollTop == 0 && dy > 0) {
        this.initPulling();
        e.preventDefault();
        e.stopPropagation();
      }
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
        // if (dy !== this.currentY && dy !== (maxProgress - 1) * this.fixThreshold) {
        if (dy != e.targetTouches[0].screenY - this.fixThreshold) {
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
      // let transX = this.progress * ((this.$el.offsetWidth - 2.4 * this.startWidth) / 2 - this.startOffsetLeft);
      let transX = (this.progress < 1 ? this.progress : 1) * ( this.elem.offsetWidth - this.startOffsetLeft * 2 - this.startWidth * scale ) / 2;
      if (transX < 0) transX = 0;
      let h = this.titleSpan.clientHeight * scale;
      let transY = -1 * this.progress * (this.pulledHeight - h) / 2;

      this.titleSpan.style.transform = `translate(${transX}px, ${transY}px) scale(${scale})`
      // this.titleSpan.style['letter-spacing'] = `${-0.05 * this.progress}em`;
		},
		handleTouchEnd() {
      this.containerEl.style.transition = ".25s";
      this.titleSpan.style.transition = ".25s";
      this.elem.style.transition = ".25s";
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
        let transX = this.progress * ((this.elem.offsetWidth - scale * this.startWidth) / 2 - this.startOffsetLeft);
        if (transX < 0) transX = 0;
        let h = this.titleSpan.clientHeight * scale;
        let transY = -1 * this.progress * (this.fixThreshold - this.overpulledHeight*0.7 - h) / 2;

        this.titleSpan.style.transform = `translate(${transX}px, ${transY}px) scale(${scale})`
        // this.titleSpan.style['letter-spacing'] = `${-0.05 * this.progress}em`;
      } else {
        this.pulledHeight = 0;
        // this.containerEl.style.transform = `none`;
        this.elem.style.transition = ".25s";
        // this.elem.style.transform = `none`;
        this.titleSpan.style.transition = ".25s"
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
        vm.titleSpan = vm.$refs.titleSpan;
        // vm.startOffsetLeft = vm.titleSpan.getBoundingClientRect().left;
        vm.startOffsetLeft = vm.titleSpan.offsetLeft;
        vm.startWidth = vm.titleSpan.offsetWidth;
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
    Header,
    BtnIcon,

		"device-category-item": DeviceCategoryItem,
  }
}
</script>

<style lang="less" scoped>
.header {
  flex-wrap: wrap;

  //  Temporarily for iPad
  display: flex !important;
  &__title {
    margin-right: auto;
    height: 100%;
    width: auto;
    display: flex;
    align-items: center;
    transition: .3s linear;
    span {
      position: absolute;
      // transition: .25s;
      text-align: center;
      transform-origin: 0% 100%;
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
  .devices-by-category {
    min-width: 100%;
    width: 100vw;
    margin-left: -14px;
    margin-right: -14px;

    text-transform: none;
    font-weight: normal;
    color: #000;
  }
}

</style>