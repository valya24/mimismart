<template>
	<div class="dimer-control controls-body"
		:class="{ 'on': active }">
		<div class="big-icon-control">
			<icon-comp :iconName="`icon-${icon}`"
				@click.native="handleClick"
				:isOn="active" />
		</div>
		<div class="controls-footer hbox just-cn">
			<div class="col-switch vbox alic" @click="handleClick" >
				<div class="label">{{ active ? $t('On_1') : $t('Off_1') }}</div>
				<app-switch :checked="active" />
			</div>
		</div>
	</div>
</template>

<script>
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
	methods: {
		handleClick() {
			this.$emit('change', !this.active);
		}
	},
}
</script>

<style lang="less" scoped>
.slider {
	width: 230px;
}
</style>