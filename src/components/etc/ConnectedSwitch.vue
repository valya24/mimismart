<template>
    <div class="connected-switch">
        <div class="col-info">
            <div class="switch-name hbox">
                <strong>Выключатель 2</strong>
                <strong class="text-color-device-address">526:32</strong>
            </div>
            <div class="press-mode hbox">
                <label class="hbox alic">
                    <input type="checkbox" name="" id="">
                    <div class="check-label">Двойное нажатие</div>
                </label>
                <div class="div16"></div>
                <label class="hbox alic">
                    <input type="checkbox" name="" id="">
                    <div class="check-label">Тройное</div>
                </label>
            </div>
        </div>
        <div class="col-del">
            <btn-icon icon="icon-trash" class="rounded" />
        </div>
    </div>
</template>

<style lang="less" scoped>
.press-mode {
    margin-top: 8px;
    input {
        width: 18px;
        height: 18px;
        margin-right: 6px;
    }
}
.connected-switch {
    margin-left: -16px;
    margin-right: -16px;
    padding: 16px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(0,0,0,0.1);
    background: rgba(255,255,255,0.5);
    font-size: 14px;
}
.col-info {
    flex: 1;
    padding-right: 16px;
}
.switch-name {
    .text-color-device-address {margin-left: auto;}
}
</style>