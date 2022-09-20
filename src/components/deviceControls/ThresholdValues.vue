<template>
	<div class="threshold-values controls-body">
		<div class="hbox alic">
			<div class="col-label">{{ $t('Send notifications when thresholds are reached') }}</div>
		</div>
		<FormRow v-if="enableMinimumThreshold" class="gap8">
			<label class="checklabel hbox alic" slot="label">
				{{ $t('Less than') }}
			</label>
			<div class="hbox alic just-sb">
				<Stepper :min="min" :max="max" :unit="units" :step="step"
					:value="typeof sensorSettings.minThreshold == 'number' ? sensorSettings.minThreshold : min"
					@change="value => $emit('change', { minThreshold: value, watchMin: true })" />
				<app-switch
					:checked="sensorSettings.watchMin"
					@change="e => $emit('change', { watchMin: e })"
				/>
			</div>
		</FormRow>
		<FormRow  class="gap8">
			<label class="checklabel hbox alic" slot="label">
				{{ $t('More than') }}
			</label>
			<div class="hbox alic just-sb">
				<Stepper :min="min" :max="max" :unit="units" :step="step"
					:value="typeof sensorSettings.maxThreshold == 'number' ? sensorSettings.maxThreshold : max"
					@change="value => $emit('change', { maxThreshold: value, watchMax: true })" />
				<app-switch
					:checked="sensorSettings.watchMax"
					@change="e => $emit('change', { watchMax: e })"
				/>
			</div>
		</FormRow>
	</div>
</template>

<script>
import FormRow from "@/components/etc/FormRow";
import Stepper from "@/components/controls/Stepper";

export default {
	props: {
		min: {
			type: Number,
			default: 0
		},
		max: {
			type: Number,
			default: 100
		},
		minThreshold: {
			type: Number,
			default: 0
		},
		maxThreshold: {
			type: Number,
			default: 100
		},
		units: {
			type: String,
			default: ''
		},
		step: {
			type: Number,
			default: 1
		},
		sensorSettings: {
			type: Object
		},

		enableMinimumThreshold: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		handleToggleNotifications(val) {
			let payload = { enableNotifications: val };
			if (!this.enableMinimumThreshold) {
				payload.watchMax = val;
			}
			this.$emit('change', payload);
		},
		handleSwitch(e) {
			console.log(e);
		}
	},
	components: {
		FormRow,
		Stepper
	}
};
</script>

<style lang="less" scoped>
.checklabel input {
	margin-right: 6px;
}
</style>