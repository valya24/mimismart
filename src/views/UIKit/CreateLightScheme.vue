<template>
    <div class="create-light-scheme">
        <Header>
            <div class="hbox just-sb alic">
                <div class="col-back">
                    <BtnIcon icon="icon-back" />
                </div>
                <div class="col-header-title tac">
                    Создать световую схему
                </div>
                <div class="col-check">
                    <BtnIcon icon="icon-check" />
                </div>
            </div>
            <div class="scheme-name">
                <Textfield placeholder="Введите имя схемы" />
            </div>
        </Header>
        <div class="locations-list">
            <div class="location-item">
                <div class="location-head">
                    <div class="col-title">Гостиная</div>
                </div>
                <div class="grid-icons">
                    <device-as-icon icon="lamp" :isOn="true" name="Диван" />
                    <device-as-icon :selected="true" icon="lamp" :isOn="true" name="Точки" />
                    <device-as-icon icon="lamp" name="Стол" />
                    <device-as-icon :selected="true" icon="lamp" name="Остров" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Header from "@/components/Header";
export default {
    components: {
        Header,
    }
}
</script>

<style lang="less" scoped>
.create-light-scheme {
    padding-top: 120 - @headerHeight + 16px;
}
.header {
    min-height: 0;
    flex-direction: column;
    align-items: stretch;
    padding: 8px 4px 16px;
}
.scheme-name {
    margin-top: 8px;
    padding: 0 12px;
}
</style>