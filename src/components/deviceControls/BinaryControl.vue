<template>
	<div class="dimer-control controls-body"
		:class="{ 'on': +lamp.isActive }">
		<div class="big-icon-control">
			<icon-comp :iconName="`icon-${icon}`"
				@click.native="handleClick"
				:isOn="+lamp.isActive" />
		</div>
		<div class="controls-footer hbox just-cn">
			<div class="col-switch vbox alic" @click="handleClick" >
				<div class="label">{{ +lamp.isActive ? $t('On_1') : $t('Off_1') }}</div>
				<app-switch :checked="+lamp.isActive" />
			</div>
		</div>
	</div>
</template>

<script>
import {mapGetters} from "vuex";

export default {
	props: {
		active: {
			type: Boolean,
			default: false
    },
    icon: {
      type: String
    }
	},
  mounted() {
    console.log(this.icon)
  },
  computed: {
    ...mapGetters(['lamp']),
  },
	methods: {
		handleClick() {
			this.$emit('change', !+this.lamp.isActive);
		}
	},
}
</script>

<style lang="less" scoped>
.slider {
	width: 230px;
}
</style>