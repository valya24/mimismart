<template>
    <div class="icon-dimer-lamp" :class="{on: isOn}">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <g>
                <defs>
                    <path id="SVGID_1_" d="M12,0C5.9,0,1,4.9,1,11s4.9,11,11,11s11-4.9,11-11S18.1,0,12,0z M7.7,19.7l-0.3-0.8
                        c-0.1-0.5-0.6-1.2-1.1-1.7C4.8,15.5,4,13.5,4,11.3C4,6.7,7.6,3,12,3s8,3.7,8,8.3c0,2.2-0.8,4.2-2.3,5.8c-0.6,0.6-1,1.3-1.1,1.7
                        l-0.3,0.8L7.7,19.7z"/>
                </defs>
                <clipPath id="SVGID_2_">
                    <use xlink:href="#SVGID_1_"  style="overflow:visible;"/>
                </clipPath>
                <g class="light-rays" clip-path="url(#SVGID_2_)">
                    <line class="light-ray stroke-variable" x1="1" y1="11" x2="23" y2="11"/>
                    <line class="light-ray stroke-variable" x1="4.2" y1="3.2" x2="19.8" y2="18.8"/>
                    <line class="light-ray stroke-variable" x1="19.8" y1="3.2" x2="4.2" y2="18.8"/>
                    <line class="light-ray stroke-variable" x1="12" y1="0" x2="12" y2="22"/>
                </g>
            </g>
            <path class="fill-const" d="M14.3,19H9.8C9.3,19,9,19.3,9,19.7v1.2c0,0.4,0.3,0.7,0.7,0.7l0.5,1c0.1,0.2,0.5,0.4,0.8,0.4H13
                c0.3,0,0.6-0.2,0.8-0.4l0.5-1c0.4,0,0.7-0.3,0.7-0.7v-1.2C15,19.3,14.7,19,14.3,19z"/>
            <path class="light" d="M7,11.3C7,8.4,9.2,6,12,6s5,2.4,5,5.3c0,1.4-0.5,2.7-1.5,3.7c-0.5,0.6-1.4,1.7-1.8,3h-3.5
				c-0.4-1.3-1.3-2.4-1.8-3C7.5,14,7,12.7,7,11.3z"/>
            <path class="fill-variable" d="M17,16.4c1.3-1.4,2-3.2,2-5.1c0-4-3.1-7.3-7-7.3c-3.9,0-7,3.3-7,7.3c0,1.9,0.7,3.7,2,5.1
                c0.7,0.7,1.2,1.5,1.4,2.2c0,0,0,0.1,0,0.1c-0.2,0.3-0.4,0.7-0.4,1v1.2c0,0.7,0.4,1.3,1,1.5l0.3,0.6c0.3,0.6,1,0.9,1.6,0.9H13
                c0.7,0,1.3-0.4,1.6-0.9l0.3-0.6c0.6-0.3,1-0.9,1-1.6v-1.2c0-0.4-0.1-0.8-0.4-1c0,0,0-0.1,0-0.1C15.8,17.9,16.3,17.1,17,16.4z
                M7,11.3C7,8.4,9.2,6,12,6s5,2.4,5,5.3c0,1.4-0.5,2.7-1.5,3.7c-0.5,0.6-1.4,1.7-1.8,3h-3.5c-0.4-1.3-1.3-2.4-1.8-3
                C7.5,14,7,12.7,7,11.3z M14,20.6l-0.3,0L12.9,22h-1.8l-0.8-1.4l-0.3,0V20h0.1h3.9H14V20.6z"/>
        </svg>
    </div>
</template>

<script>
export default {
    props: ['isOn']
}
</script>

<style lang="less" scoped>
.light-ray {
    fill:none;
    stroke:#535DFF;
    stroke-width:2;
    stroke-miterlimit:10;
    //Scale from 0.7 to 1 to show intensity
    transform: scale(1);
    transform-origin: center;
}
</style>