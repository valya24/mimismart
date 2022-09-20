<template>
	<div class="dropdown-list">
    <div class="dropdown-list-container"
      :class="{
        '--expanded': expanded,
        '--to-top': toTop,
        '--align-right': alignRight,
        '--menu': menu
      }">
      <div class="dropdown-list-item"
      :class="{'--checked': item[valueKey] == value}"
        v-for="(item, i) in items" :key="i"
        @click="$emit('selectMode', item[emitKey])">
        <div class="dropdown-list-item__icon" v-if="item.icon">
          <icon-comp :iconName="'icon-' + item.icon" />
        </div>
        <div class="dropdown-list-item__name">{{ item.name }}</div>
        <div class="dropdown-list-item__check" v-if="!menu">
          <icon-comp iconName="icon-check" v-if="item[valueKey] == value" />
        </div>
      </div>
    </div>
	</div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array
    },
    expanded: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number]
    },
    valueKey: {
      type: String,
      default: 'name'
    },
    emitKey: {
      type: String,
      default: 'name'
    },
    toTop: {
      type: Boolean,
      default: false
    },
    alignRight: {
			type: Boolean,
			default: false
    },
    menu: {
			type: Boolean,
			default: false
		}
  }
};
</script>

<style lang="less" scoped>
@transitionLength: 0.25s;

.dropdown-list {
  position: relative;
  z-index: 10;
  
  &-container {
    height: 0;
    position: absolute;
    top: 0;
    left: 0;
    box-shadow: 0 2px 5px rgba(#222, .15);
    // background: @colorBg;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    &.--expanded {
      height: auto;
    }
    &.--to-top {
      top: initial;
      bottom: 0;
    }
    &.--align-right {
      left: auto;
      right: 0;
    }
  }
  &-item {
    display: flex;
    align-items: center;
    padding: 10px;
    cursor: pointer;
    color: #545454;
    &.--checked {
      color: #000;
    }
    &__icon {
      margin-right: 8px;
      .icon-holder {
        width: 32px;
        height: 32px;
      }
    }
    &__name {
      flex-grow: 1;
      margin-right: 16px;
      font-size: 18px;
    }
    &__check {
      margin-left: auto;
      width: 24px;
    }
  }
  &-container.--menu &-item {
    padding: 12px 16px;
  }
  &-container.--menu &-item__name {
    font-size: 14px;
    color: #000;
    margin-right: 0;
    white-space: nowrap;
  }
}
</style>