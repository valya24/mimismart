<template>
    <router-link :to="to" class="tabbar-item">
        <div class="icon">
            <div v-if="overlayIcon" class="overlay-icon" :class="{'connection-info': icon == 'icon-home', 'logged-in': icon == 'icon-settings'}">
                <icon-comp :iconName="overlayIcon" />
            </div>
            <icon-comp :isOn="isOn" :iconName="icon" />
        </div>
        <div class="view-name">{{ viewName }}</div>
    </router-link>
</template>

<style lang="less" scoped>
.icon {
    position: relative;
    z-index: 1;
   & > .icon-holder {
       display: inline-block;
       vertical-align: middle;
    }
}
.tabbar-item {
    flex: 1;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-decoration: none;
    color: #999;
    transition: color 0.2s;
    outline: none;
}
.view-name {
    font-size: 11px;
}
.router-link-active {
    color: @colorMain;
}
.overlay-icon {
    position: absolute;
}
.connection-info {
    right: 0;
    top: -12px;
    .icon-holder {
        width: 12px;
        height: 12px;
    }
}
.logged-in {
    right: 0;
    bottom: 0px;
    z-index: 2;
    .icon-holder {
        width: 14px;
        height: 14px;
    }
}

.theme-dark {
    .tabbar-item {
        color: rgba(255,255,255,0.7);
    }
    .router-link-active {
        color: @colorMainDark;
    }
    .outer-stroke {fill: red !important;}
}
</style>

<script>

export default {
    props: ['viewName', 'to', 'icon', 'overlayIcon'],
    computed: {
        isOn() {
            // return typeof this.to;
            if (typeof this.to == 'string') {
                return this.$route.path.includes(this.to);
            } else {
                return this.$route.name == this.to.name
            }
        },
        routePath() {
            return this.$route.path;
        }
    }
}
</script>