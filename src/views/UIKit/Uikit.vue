<template>
  <div class="uikit">
    <div class="uikit-row">
      <Dropdown>
        <option value="">Some value</option>
      </Dropdown>
    </div>
    <div class="uikit-row"
      v-for="icon in icons" :key="icon">
      <IconComp :iconName="icon" />
      <span>{{ icon }}</span>
    </div>

    <div class="uikit-row" v-for="icon in undefinedIcons" :key="icon">
      <span class="--invalid">{{ icon }}</span>
    </div>
  </div>
</template>

<script>
import IconComp from '@/components/icons/iconComp.vue';

export default {
  data() {
    return {
      icons: []
    }
  },
  computed: {
    undefinedIcons() {
      let outArr = [];
      for (let key in this.$store.state.itemMap) {
        let icon = this.$store.state.itemMap[key].$._icon;
        if (
          !this.icons.includes('icon-' + icon) &&
          !outArr.includes('icon-' + icon)
        ) {
            outArr.push('icon-' + icon);
          }
      }
      return outArr;
    }
  },
  mounted() {
    this.icons = Object.keys(this.$options.components.IconComp.components);
  },
  components: {
    IconComp
  }
}
</script>

<style lang="less" scoped>
.uikit {
  padding-bottom: 100px;
}
.uikit-row {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 5px 10px;
  border-bottom: 1px solid #aaa;
  span {
    margin-left: 15px;
    font-size: 14px;
    &.--invalid {
      color: @colorRed;
    }
  }
}
</style>