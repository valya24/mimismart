<template>
    <div class="alert-notification-wrap">
        <div class="alert-notification">
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    props: ['text']
}
</script>

<style lang="less" scoped>
.alert-notification-wrap {
    position: fixed;
    z-index: 103;
    top: 24px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    margin: 0 auto;
    max-width: 20em;
    text-align: center;
}
.alert-notification {
    background: #F2E1C1;
    box-shadow: 0px 19px 30px rgba(118, 77, 0, 0.1);
    border-radius: 16px;
    font-size: 14px;
    color: #63563F;
    padding: 16px;

    //right: 16px;
}
</style>