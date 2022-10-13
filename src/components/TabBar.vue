<template>
    <div class="tabbar">
        <TabBarItem icon="icon-home" :overlayIcon="homeOverlayIcon" to="/home" :viewName="$t('Home')" />
        <TabBarItem icon="icon-favs" :to="{name: 'Favorites'}" :viewName="$t('Favorites')" />
        <TabBarItem icon="icon-notifications" :to="{name: 'Notifications'}" :viewName="$t('Notifications')" />
        <TabBarItem icon="icon-settings" overlayIcon="icon-user" :to="{name: 'Settings'}" :viewName="$t('Settings')" />
    </div>
</template>

<script>
import TabBarItem from '@/components/TabBarItem'

export default {
    computed: {
        isConnected() {
			return this.$store.state.ws.socket.isConnected;
        },
        homeOverlayIcon() {
            return this.isConnected ? 'icon-cloud-on' : 'icon-cloud-off';
        }
    },
    components: {
        TabBarItem,
    }
}
</script>

<style lang="less" scoped>
@tabBarHeight: 72px;
.tabbar {
    margin-top: auto;
    position: fixed;
    z-index: 100;
    bottom: 24px;
    left: 16px;
    right: 16px;
    height: @tabBarHeight;
    align-items: center;
    display: flex;
    background: rgba(255,255,255,0.9);
    border-radius: 24px;
    backdrop-filter: blur(10px);
    box-shadow: 0px 3px 14px rgba(46, 101, 156, 0.11);
}
.theme-dark {
    .tabbar {
        background: linear-gradient(200deg, #4D4D65 0%, #363649 100%);
        box-shadow: 0px 14px 32px rgba(0, 0, 0, 0.3);
    }
}
@media only screen and (min-device-height: 812px) {
    //@tabBarHeight: 80px;
    .tabbar {
        height: @tabBarHeight;
    }
}
@media (min-device-width: @phones) {
    .tabbar {
        //max-width: 650px;
        left: 50%;
        transform: translateX(-50%);
    }
}
</style>