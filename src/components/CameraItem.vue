<template>
    <div class="camera" :style="'background-image:url('+imgUrl+')'">
        <div class="camera-name">{{ cameraName }}</div>
    </div>
</template>

<style lang="less" scoped>
.camera {
    position: relative;
    z-index: 1;
    border-radius: 8px;
    background-size: cover;
    height: 128px;
    background-position: 50% 50%;
}
.camera-name {
    position: absolute;
    background-color: rgba(0,0,0,0.23);
    color: #fff;
    font-size: 14px;
    width: 100%;
    bottom: 0;
    text-align: center;
    padding: 4px 0;
    backdrop-filter: blur(9px);
    border-radius: 0 0 8px 8px;
}
</style>

<script>
export default {
    props: ['cameraName'],
    data() {
        return {
            imgUrl: 'https://images.pexels.com/photos/3849554/pexels-photo-3849554.jpeg?cs=srgb&dl=pexels-3849554.jpg&fm=jpg',
        }
    }
}
</script>