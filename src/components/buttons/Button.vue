<template>
    <div class="button" :class="{ '--with-icon': icon, '--no-label': !label || !label.length }">
        <icon-comp v-if="icon" :iconName="icon" /> {{ label }}
    </div>
</template>

<script>
export default {
    props: ['label', 'icon'],
}
</script>

<style lang="less" scoped>
.button {
    border: 1px solid @colorMain;
    height: @btnHeight;
    font-size: @btnFontSize;
    display: flex;
    align-items: center;
    justify-content: center;
    background: @btnBg;
    box-shadow: @btnShadow;
    border-radius: @btnRadius;
    padding: 0 16px;
    color: @btnTextColor;
    .icon-holder {margin-right: 4px;}
    &:active {
        box-shadow: inset 0px 3px 3px rgba(0, 0, 0, 0.17);
        background: linear-gradient(180deg, #F1F2FF 0%, #FFFFFF 100%);
    }
    &.small {
        border: 1px solid rgba(0, 0, 0, 0.07);
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.04);
        font-size: 14px;
        background: #fff;
        height: @btnSmallHeight;
        border-radius: 100px;
    }
    &.--with-icon {
        padding: 0 12px 0 8px;
    }
    &.--disabled {
        background: #DFDFDF;
        color: #A6A6A6;
        text-shadow: 0px 1px 0px rgba(255, 255, 255, 0.42);
        border: 1px solid #C7C7C7;
        box-shadow: none;
    }
    &.--no-label {
        padding: 0 9px;
        .icon-holder {
            margin-right: 0;
        }
    }
    .theme-dark & {
        background: linear-gradient(180deg, lighten(@colorBgDark200, 10%) 0%, @colorBgDark200 100%);
        color: #fff;
        border-color: @colorMainDark;
        color: @colorPaleBlue;
    }
}
</style>