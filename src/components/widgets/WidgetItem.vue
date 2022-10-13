<template>
    <div class="widget" :class="{
			'type-intercom': name == 'Домофон',
			'on': isActive,
			'--system': system
		}">
		<div class="col-intercam" v-if="name == 'Домофон'">
			<div class="camera-view" style="background-image:url(https://static01.nyt.com/images/2020/01/19/fashion/18RING-PREVIEW-IMAGE/18RING-PREVIEW-IMAGE-superJumbo-v4.png)"></div>
		</div>
		<div class="col-widget-content">
			<div class="head">
				<div class="col-icon" @click="$emit('toggle')" v-if="!hideIcon">
					<div class="icon-tile" :class="{ 'on': isActive && !iconInactive }">
						<div class="device-address">{{ addr }}</div>
						<icon-comp :isOn="isActive" :iconName="'icon-'+icon" :value="value" />
						<span class="value" v-if="iconTitle && iconTitle.length">{{ iconTitle }}</span>
					</div>
				</div>
				<div class="col-name">
					<div class="device-name">{{ computedName }}</div>
					<div class="device-status" v-if="!sensor">
						{{ stateText ? stateText : (isActive && !iconInactive ? activeText : inactiveText) }}
						<!-- {{ isActive && !iconInactive ? activeText : inactiveText }} -->
					</div>
				</div>
				<div class="col-more">
					<!-- TODO: Refactor this $parent.$parent.$emit -->
					<BtnIcon icon="icon-more" @click.native="$parent.$parent.$emit('callControlApp', addr)" />
				</div>
			</div>
			<div class="current-temp-wrap" v-if="currentTemp"
				:class="{ '--disabled': controlsDisabled }">
				<div class="current-temp bg-cold">
					В комнате {{ currentTemp }}&deg;
				</div>
			</div>
			<div class="buttonbar" >
				<div class="col-switch" @click="$emit('toggle')" v-if="!sensor">
					<app-switch class="small" :checked="isActive" />
				</div>
				<slot />
			</div>
		</div>
    </div>
</template>

<script>
// TODO: Maybe refactor - too many props
export default {
	props: {
		icon: {
			type: String,
			default: ''
		},
		isActive: {
			type: Boolean,
			default: false,
		},
		controlsDisabled: {
			type: Boolean,
			default: false
		},
		iconInactive: {
			type: Boolean,
			default: false
		},
		iconTitle: {
			type: String,
			default: ''
		},
		system: {
			type: Boolean,
			default: false
		},
		name: {
			type: String,
			default: '',
		},
		addr: {
			type: String
		},
		stateText: {
			type: String,
			default: null
		},
		currentTemp: {
			type: String,
			default: ''
		},
		// color: {
		// 	type: String,
		// 	default: '#fff'
		// },
		value: {
			type: [String, Number],
			default: 0
		},
		sensor: {
			type: Boolean,
			default: false
		},
		hideIcon: {
			type: Boolean,
			default: false
		},

		activeText: {
			type: String,
			default() {
				return this.$t('On_1')
			}
		},
		inactiveText: {
			type: String,
			default() {
				return this.$t('Off_1');
			}
		},
	},
	computed: {
		computedName() {
			return this.name.replace(/(\\10|&#10;)/g, ' ')
		}
	}
}
</script>

<style lang="less" scoped>

.theme-dark {
	.widget {
		background: lighten(@colorBgDark, 5%);
		box-shadow: 0px 7px 24px rgba(0, 0, 0, 0.4);
	}
	.current-temp {
		&.bg-cold {background-color: #4190af;}
		&.bg-warm {background-color: #ad6d48;}
	}
}

.camera-view {
	width: @widgetHeight;
	height: 100%;
	background-size: cover;
	border-radius: 5px 0 0 5px;
}
.col-widget-content {flex-grow: 1;}
.type-intercom {
	display: flex;
	.col-icon {
		visibility: hidden;
		width: 0;
		flex-basis: 0 !important;
	}
}
.buttonbar {
	display: flex;
	padding-left: 10px;
	align-items: center;
	margin-top: 8px;
	margin-bottom: 8px;
	min-height: @btnHeight;
	.fg1 {margin-right: 12px;}
	& > * {
		margin: 0 4px;
		.presets & {margin: 0;}
	}
	.col-switch {
		flex-basis: 40px;
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 4px !important;
	}
	.right {margin-left: auto;}
	.value {
		display: flex;
		flex-direction: column;
		justify-content: center;
		color: @colorMain;
		font-size: 20px;
		font-weight: 500;
		text-align: center;
	}
}
.presets .buttonbar {
	justify-content: space-between;
}
.current-temp-wrap {
	display: flex;
	justify-content: flex-end;
}
.current-temp {
	color: #fff;
	font-size: 16px;
	padding: 3px 12px;
	border-radius: 20px 0 0 20px;
	transition: background-color @defaultTrsTime;
	&.bg-cold {
		background: @colorPaleBlue;
	}
	&.bg-warm {
		background: @colorOrange;
	}
}
.--disabled {
	.current-temp {background: lighten(@colorGrayedOut, 10%);}
	.buttonbar .value {color: @colorGrayedOut;}
}
.col-name {
	padding-left: 16px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	flex-grow: 1;
}
.col-more {
	padding-top: 6px;
	padding-right: 6px;
}
.device-name {
	font-size: 18px;
}
.device-status {
	font-size: 14px;
	color: @colorGrayedOut;
}
.widget {
	grid-column-start: 1;
	grid-column-end: 5;
	background: #FFFFFF;
	box-shadow: 0px 3px 6px rgba(83, 93, 255, 0.15);
	border-radius: 5px;
	min-height: @widgetHeight;
	&.--no-toggle {
		.col-switch {display: none;}
		.buttonbar {justify-content: space-around;}
	}
}
// TODO: Maybe move this to global styles
.--system .device-address {
	background-color: darken(@colorRedDark, 3%);
}
.head {
	display: flex;
	.col-icon {
		position: relative;
		flex-basis: @tileWidth;
		height: @tileWidth;
		flex-shrink: 0;
		.icon-holder {
			width: @tileIconHeight;
			height: @tileIconHeight;
		}
	}
}
.icon-tile {
	position: absolute;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	border-radius: @tileRadius;
	display: flex;
	align-items: center;
	justify-content: center;
	&::before {
		content: "";
		border-radius: inherit;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		background: @tileActiveBg;
		transition: opacity @defaultTrsTime;
		opacity: 0;
	}
	.value {
		position: absolute;
		left: 0;
		bottom: 4px;
		width: 100%;
		text-align: center;
		font-size: 12px;
		font-weight: 700;
		color: @colorMain;
	}
	&.on {
		&::before {
			opacity: 1;
		}
		.value {
			color: #fff;
		}
	}
	
}
@media (min-width: @phones) {
	.widget {
		grid-column-end: 6;
	}
}

@media (min-width: @tablets-landscape) {
	.widget {
		grid-column: span 3;
	}
}
</style>