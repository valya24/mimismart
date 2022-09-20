<template>
	<div class="controls-body">
		<template v-if="state == 'idle'">
			<div class="tac fz14">{{ $t('Ignore') }}:</div>
			<div class="ignore-buttons">
				<app-button :label="$t('5 minutes')" @click.native="$emit('ignore', 300)" />
				<app-button :label="$t('10 minutes')" @click.native="$emit('ignore', 600)" />
				<app-button :label="$t('30 minutes')" @click.native="$emit('ignore', 1800)" />
				<app-button :label="$t('1 hour')" @click.native="$emit('ignore', 3600)" />
				<app-button :label="$t('12 hours')" @click.native="$emit('ignore', 43199)" />
			</div>
		</template>
		<template v-if="state == 'wet'">
			<div class="leak-sign">
				<icon-comp iconName="icon-leak-wet" />
			</div>
			<div class="leak-warning">
				<!-- Попала влага! -->
				{{ $t('Water') }}
			</div>
			<div class="reset-row">
				<app-button :label="$t('Reset')" @click.native="$emit('reset')" />
			</div>
		</template>

		<template v-if="state == 'dryIgnoring' || state == 'wetIgnoring'">
			<div class="leak-sign --ignoring">
				<icon-comp iconName="icon-leak-maintenance" />
			</div>
			<div class="leak-warning --ignoring">
				<!-- Попала влага! -->
				{{ state == 'dryIgnoring' ? $t('Dry_2') : $t('Wet') }}
				<small>{{ $t('Ignored') }}</small>
			</div>
			<div class="reset-row">
				<app-button :label="$t('Reset')" @click.native="$emit('reset')" />
			</div>
		</template>
	</div>
</template>

<script>
	export default {
		props: {
			state: {
				type: String,
				default: 'idle'
			}
		}
	}
</script>

<style lang="less" scoped>
.leak-sign {
	display: flex;
	justify-content: center;
	padding-top: 40px;
	.icon-holder {
		width: 144px;
		height: 144px;
	}
}
.leak-warning {
	color: #F56363;
	font-size: 32px;
	text-align: center;
	padding-bottom: 16px;
	&.--ignoring {
		color: #ED7A5C;
	}
	small {
		font-size: 14px;
		display: block;
		color: #444;
		margin-top: 4px;
	}
}
.reset-row {
	margin-top: 24px;
	.button {
		margin-left: 32px;
		margin-right: 32px;
	}
}
.time-left-title {
	font-size: 12px;
	color: #808080;
}
.time-left {
	font-size: 36px;
	color: @colorMain;
}
.elapsed-cir {
	position: absolute;
	width: 224px;
	height: 224px;
	transition: transform 1s linear;
	.cir {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: #535DFF;
		left: 50%;
		margin-left: -9px;
		position: absolute;
		top: 3px;
	}
}
.timer-wrap {
	position: relative;
	z-index: 1;
	display: flex;
	justify-content: center;
}
.timer-content {
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	&__title {
		font-size: 24px;
		color: @colorMain;
	}
}
.ignore-buttons {
	margin-top: 16px;
	.button {
		margin-top: 16px;
		margin-left: 32px;
		margin-right: 32px;
	}
}
.timer-cir {
	fill: #fff;
	stroke: #E8EAFF;
}
.timer-elapsed {
	stroke: #A6ABFF;
}
</style>