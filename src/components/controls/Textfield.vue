<template>
    <input type="text" class="textfield"
        :class="{
            '--invalid': invalid
        }"
        :value="value"
        @change="e => $emit('change', e.target.value)"
        @input="e => $emit('input', e.target.value)">
</template>

<script>
export default {
    props: {
        value: {
            type: String,
            default: ''
        },
        invalid: {
            type: Boolean,
            default: false
        }
    },
}
</script>

<style lang="less" scoped>
.theme-dark {
    .textfield {
        background: @colorBgDark200;
        border-color: @colorMainDark;
        color: @headerText;
    }
}
.textfield {
    background: #fff;
    border-radius: 4px;
    margin: 0;
    border: 1px solid @colorMain;
    font-family: @fontMain;
    height: @btnHeight;
    box-shadow: inset 0px 2px 4px rgba(83, 93, 255, 0.2);
    padding: 0 8px;
    display: block;
    width: 100%;
    font-size: 16px;
    color: #666;
    transition: .25s;
    &.--invalid {
        border-color: @colorRedDark;
    }
}
</style>