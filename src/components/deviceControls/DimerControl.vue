<template>
	<div class="dimer-control controls-body"
		:class="{ 'on': active }">
		<div class="big-icon-control">
			<icon-comp :iconName="'icon-' + icon"
				@click.native="$emit('toggle', !active)" />
			<div class="slider">
				<Brightness :min="1" :max="255"
					:value="brightness"
					:gray="!active"
					@change="val => $emit('change', val)"/>
			</div>
		</div>
		<div class="controls-footer hbox just-cn">
			<div class="col-switch vbox alic"
				@click="$emit('toggle', !active)">
				<div class="label">{{ active ? $t('On_1') : $t('Off_1') }}</div>
				<app-switch :checked="active" />
			</div>
		</div>
	</div>
</template>

<script>
import Brightness from "@/components/controls/Brightness";

export default {
	props: {
		active: Boolean,
		brightness: Number,
		icon: {
			type: String,
			default: 'dimer-lamp'
		}
	},
	components: {
		Brightness
	}
};
</script>

<style lang="less" scoped>
.slider {
	width: 230px;
}
</style>