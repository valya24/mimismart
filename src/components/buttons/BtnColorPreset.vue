<template>
    <div class="btn-color-preset">
        <div class="color" :style="'background-color:' + color"></div>
    </div>
</template>

<script>

export default {
    props: {
        color: {
            type: String,
            default: ''
        }
    }
}
</script>

<style lang="less" scoped>
.btn-color-preset {
    width: @btnHeight - 8px;
    height: @btnHeight - 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: @btnRadius;
    &:active {
        background: @colorBtnActive;
    }
    &.big {
        .color {
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }
    }
    &:last-of-type {
        margin-left: 6px;
        margin-right: 10px;
    }
}
.color {
    width: 24px;
    height: 24px;
    border-radius: 3px;
    
    // border: 1px solid rgba(#4D4D65, .3);
    box-shadow: 0px 2px 4px rgba(#4d4d65,  .18);
}
</style>