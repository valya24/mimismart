<template>
    <div class="notification-item">
        <div class="head">
            <div class="col-device">Кондиционер \ Спальня \ 1-й этаж \ 321:54</div>
        </div>
        <div class="notification-body">
            Не достаточно фриона. Требуется замена.
        </div>
        <div class="foot hbox alic just-sb">
            <div class="col-type" :class="'type-' + type"> {{ type }} </div>
            <div class="col-date">15 ноября 2019, 15:50:45</div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        type: {
            type: String,
            default: 'normal'
        }
    }
}
</script>

<style lang="less" scoped>
.head {
    font-size: 12px;
    color: #808080;
}
.notification-body {
    margin: 12px 0;
}
.foot {
    font-size: 12px;
    color: @colorGrayedOut;
}
.col-type {
    font-weight: bold;
}
.notification-item {
    padding: 16px;
    background: #fff;
    box-shadow: 0px 3px 6px rgba(83, 93, 255, 0.1);
    border-radius: 5px;
    margin-top: 16px;
}
.type-normal {color: #666666;}
.type-urgent {color: @colorOrange;}
.type-critical {color: @colorRed;}
.type-intercom {color: @colorMain}
</style>