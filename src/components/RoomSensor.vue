<template>
    <div class="sensor">
        <icon-comp :iconName="icon" />
        <slot />
    </div>
</template>

<script>
export default {
    props: ['icon']
}
</script>

<style lang="less" scoped>
.sensor {
    display: flex;
    align-items: center;
    margin-left: 16px;
    &:first-child {margin-left: 0;}
    .icon-holder {
        margin-right: 4px;
        width: 32px;
        height: 32px;
    }
}
.col-meta {
    .icon-holder {
        width: 24px;
        height: 24px;
    }
}

.home-rooms .room-sensors .sensor {
    flex-basis: 25%;
    flex-grow: 1;
    flex-shrink: 0;
    max-width: 25%;
    // min-width: 76px;
    // min-width: 80px;
    // width: 80px;
    // max-width: 80px;
    margin-left: 0;
    padding-left: 8px;

    &:first-child {padding-left: 0;}
}
</style>