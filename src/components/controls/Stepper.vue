<template>
	<div class="stepper">
		<BtnIcon icon="icon-minus"
			@click.native="handleValueChange(value - step)" />

		<div class="col-value hbox alic just-cn">
			
			<div class="value">
				<input type="number" class="stepper__input-number" ref="input"
					:min="min" :max="max"
					:value="value" @input="e => handleValueChange(parseFloat(e.target.value))">

				{{ value }}
				{{ unit }}
			</div>
		</div>

		<BtnIcon icon="icon-plus" 
			@click.native="handleValueChange(value + step)"/>
	</div>
</template>

<script>
import BtnIcon from "@/components/buttons/BtnIcon";

export default {
	props: {
		value: {
			type: Number,
			default: 0
		},
		step: {
			type: Number,
			default: 1
		},
		min: {
			type: Number,
			default: 0
		},
		max: {
			type: Number,
			default: 100
		},
		unit: {
			type: String,
			default: ''
		},
	},
	model: {
		prop: 'value',
		event: 'change'
	},
	methods: {
		handleValueChange(val) {
			let outValue = val < this.min ? this.min : (val > this.max ? this.max : val);
			this.$refs.input.value = outValue;
			this.$emit('change', outValue);
		}
	},
	components: {
		BtnIcon
	}
};
</script>

<style lang="less" scoped>
.stepper {
	display: flex;
	justify-content: center;
	flex-shrink: 0;
	flex-basis: 148px;
	// border: 1px solid @colorMain;
	// border-radius: 4px;
	// background: #fff;
	height: @btnHeight;
	.value {
		position: relative;
		font-size: 20px;
		color: @colorMain;
	}
	&__input-number {
		position: absolute;
		font-size: 20px;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		background-color: #f22;
	}
}
.col-value {
	flex-basis: 60px;
	flex-shrink: 0;
}
.btn-icon {
	//height: @btnHeight - 1px;
	border-radius: 0;
	flex-shrink: 0;
	
	&:first-child {
		// border-right: 1px solid @colorMain;
	}
	&:last-child {
		// border-left: 1px solid @colorMain;
	}
}
</style>