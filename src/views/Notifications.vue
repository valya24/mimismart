<template>
    <div class="notifications">
        <Header title="Оповещения" />
        <div class="hbox alic">
            <div class="col-type-label">Тип оповещений</div>
            <div class="col-control">
                <Dropdown>
                    <option value="">Все</option>
                    <option value="">Обычные</option>
                    <option value="">Важные</option>
                    <option value="">Критичные</option>
                    <option value="">Домофон</option>
                </Dropdown>
            </div>
        </div>
        <div class="notifications-list">
            <NotificationItem type="normal" />
            <NotificationItem type="urgent" />
            <NotificationItem type="critical" />
            <NotificationItem type="intercom" />
        </div>
    </div>
</template>

<script>
import Header from "@/components/Header";
import NotificationItem from "@/components/etc/NotificationItem";
export default {
	components: {
        Header,
        NotificationItem,
	}
}
</script>

<style lang="less" scoped>
.col-type-label {
    margin-right: 8px;
}
.notifications {
    padding: 24px 16px;
}
</style>