<template>
    <div class="icon-rgb-lamp" :class="{on: isOn}" :style="{ color: value || '#2f2' }">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path id="arc-right" class="fill-const" d="M14.5,18h-2v-0.7c0-1.3,0.2-2.5,0.5-3.7l1-3.3l1.9,0.6l-1,3.3c-0.3,1-0.5,2.1-0.5,3.2V18H14.5z" />
            <path id="arc-left" class="fill-const" d="M11.5,18h-2v-0.7c0-1.1-0.2-2.1-0.5-3.2l-1-3.3l1.9-0.6l1,3.3c0.4,1.2,0.5,2.5,0.5,3.7V18H11.5z" />
            <path class="color" d="M19.7,10C19.9,9.3,20,8.6,20,7.9C20,3.5,16.4,0,12,0S4,3.5,4,7.9C4,8.6,4.1,9.3,4.3,10H19.7z"/>
            <path id="bottom" class="fill-const" d="M14.3,22.4l0.6-1.2c0.1-0.1,0.2-0.2,0.3-0.2c0.4,0,0.8-0.3,0.8-0.8V18H8v2.2C8,20.7,8.3,21,8.8,21
                c0.1,0,0.3,0.1,0.3,0.2l0.6,1.2c0.2,0.3,0.5,0.6,0.9,0.6h2.8C13.8,23,14.1,22.8,14.3,22.4z"/>
            <path id="lamp-top" class="lamp-top" d="M17.1,11c0.6-0.9,0.9-2,0.9-3.1C18,4.7,15.3,2,12,2S6,4.7,6,7.9C6,9,6.3,10.1,6.9,11H4.7
                C4.2,10,4,9,4,7.9C4,3.5,7.6,0,12,0s8,3.5,8,7.9C20,9,19.8,10,19.3,11H17.1z"/>
            <path id="lamp" class="fill-variable" d="M20,10c-0.4-0.6-1-1-1.7-1H5.7C5,9,4.4,9.4,4,10s-0.4,1.4,0,2l1.8,3.2C6.6,16.5,7,18.1,7,19.7v0.6
                c0,0.8,0.6,1.5,1.4,1.7l0.5,0.9c0.3,0.7,1,1.1,1.8,1.1h2.8c0.2,0,0.4,0,0.6-0.1c0.5-0.2,1-0.5,1.2-1l0.5-0.9
                c0.8-0.2,1.4-0.9,1.4-1.7v-0.6c0-1.6,0.4-3.1,1.2-4.5L20,12C20.4,11.4,20.4,10.6,20,10z M13.4,22h-2.8L10,20.8
                c-0.2-0.4-0.6-0.7-1-0.7v-0.4V19h6v0.7V20c-0.4,0.1-0.8,0.3-1,0.7L13.4,22z M16.5,14.2C16,15.1,15.6,16,15.4,17H8.7
                c-0.2-1-0.6-1.9-1.1-2.8L5.7,11h12.6L16.5,14.2z"/>
        </svg>
    </div>
</template>

<script>
export default {
    props: ['isOn', 'value']
}
</script>

<style lang="less" scoped>
//Just to set a default light
.color {
    fill: currentColor;
    transition: fill @defaultTrsTime;
}
.lamp-top {
    transition: fill @defaultTrsTime;
    fill: @colorMain;
    .on & {fill: currentColor}
}
</style>