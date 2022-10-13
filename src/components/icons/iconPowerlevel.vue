<template>
    <div class="icon-powerlevel" :class="{on: isOn}">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <rect class="level1 active" :class="{ 'active': parseInt(value) > 0 }"
                x="1" y="7" width="4" height="10" rx="1"/>
            <rect class="level2" :class="{ 'active': parseInt(value) > 1 }"
                x="7" y="7" width="4" height="10" rx="1"/>
            <rect class="level3" :class="{ 'active': parseInt(value) > 2 }"
                x="13" y="7" width="4" height="10" rx="1"/>
            <rect class="level4" :class="{ 'active': parseInt(value) > 2 }"
                x="19" y="7" width="4" height="10" rx="1"/>
        </svg>
    </div>
</template>

<script>
export default {
    props: ['isOn', 'value']
}
</script>

<style lang="less" scoped>
.level1, .level2, .level3, .level4 {
    fill: @colorPaleBlue;
    &.active {fill: @colorMain}
}
</style>