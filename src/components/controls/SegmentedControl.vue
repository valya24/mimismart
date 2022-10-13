<template>
    <div class="segmented-control">
        <slot />
    </div>
</template>

<style lang="less" scoped>

.theme-dark {
    .segmented-control {
        background: @colorBgDark200;
        border-color: @colorMainDark;
    }
    .btn {
        &.active, &.--active {
            background-color: @colorMainDark !important;
        }
    }
}

.segmented-control {
    display: flex;
    border: 1px solid @colorMain;
    border-radius: 4px;
    background: #fff;
    height: @btnHeight;
}
.btn {
    flex: 1;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    color: @colorPaleBlue;
    transition: background-color @defaultTrsTime;
    &.active, &.--active {
        background-color: @colorMain !important;
        color: #fff;
    }
    &:active {
        background-color: @colorBtnActive;
        border-radius: inherit;
    }
}
</style>