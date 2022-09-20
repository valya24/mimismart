<template>
    <div class="btn-icon">
        <icon-comp :iconName="icon" :value="value" :class="{ '--disabled': disabled }" />
    </div>
</template>

<script>
import IconComp from '@/components/icons/iconComp.vue'
export default {
    props: ['icon', 'value', 'disabled'],
    components: {
        'icon-comp': IconComp,
    }
}
</script>

<style lang="less" scoped>
.btn-icon {
    width: @btnHeight;
    height: @btnHeight;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: @btnRadius;
    cursor: pointer;
    &:active {
        background: @colorBtnActive;
        .modal-camera-view & {background: rgba(255,255,255,0.1);}
    }
}
.widget .icon-holder, .stepper .icon-holder {
    width: 32px;
    height: 32px;
}
.rounded {
    border-radius: 50%;
    border: 1px solid @colorGrayedOut;
}
</style>