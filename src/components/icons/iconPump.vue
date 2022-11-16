<template>
  <div class="icon-curtains" :class="checkOnOff">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clip-path="url(#clip0_1859_8451)">
        <path :class="checkOnOff" class="ezz" d="M0 16H3.93579C5.40777 18.9621 8.46484 21 12 21C15.5352 21 18.5922 18.9621 20.0642 16H24H25V15V9V8H24H20.0642C18.5922 5.03794 15.5352 3 12 3C8.46484 3 5.40777 5.03794 3.93579 8H0H-1V9V15V16H0Z" stroke="#535DFF" stroke-width="2"/>
        <path d="M12 18C14.0414 18 15.0178 16.9156 15.0178 15.5111C15.0178 14.4267 14.432 13.1111 13.3136 11.9911H18C18 9.94667 16.9349 8.98667 15.5148 8.98667C14.432 8.98667 13.1183 9.57333 12 10.6933V6C9.97633 6 8.98225 7.06667 8.98225 8.47111C8.98225 9.57333 9.56805 10.8711 10.6864 11.9911H6C6 14.0178 7.10059 15.0133 8.46746 15.0133C9.56805 15.0133 10.8639 14.4267 11.9822 13.3067V18H12Z" fill="#535DFF"/>
        <path d="M19 12L19.8333 11C20.267 10.4796 21.0663 10.4796 21.5 11V11C21.9337 11.5204 22.733 11.5204 23.1667 11L24 10" stroke="#A6ABFF"/>
        <path d="M0 12L0.833333 11C1.26701 10.4796 2.06632 10.4796 2.5 11V11C2.93368 11.5204 3.73299 11.5204 4.16667 11L5 10" stroke="#A6ABFF"/>
        <path d="M19 14L19.8333 13C20.267 12.4796 21.0663 12.4796 21.5 13V13C21.9337 13.5204 22.733 13.5204 23.1667 13L24 12" stroke="#A6ABFF"/>
        <path d="M0 14L0.833333 13C1.26701 12.4796 2.06632 12.4796 2.5 13V13C2.93368 13.5204 3.73299 13.5204 4.16667 13L5 12" stroke="#A6ABFF"/>
      </g>
      <defs>
        <clipPath id="clip0_1859_8451">
          <rect width="24" height="24" fill="white"/>
        </clipPath>
      </defs>
    </svg>

  </div>
</template>

<script>
export default {
  props: ['isOn', 'state'],
  computed: {
    checkOnOff() {
      return this.state ? 'onPump' : 'icon-pump'
    }
  }
}
</script>

<style lang="less">
.icon-tile {
  color: #fff!important;
}

.onPump {
  stroke: #535DFF;
}

.icon-pump {
  stroke: #fff;
}
</style>