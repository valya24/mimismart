<template>
	<div class="modal-device-settings">
		<div class="overlay" @click="$emit('hide')"></div>
		<div class="modal-contents">
			<div class="automation-item-settings modal-second-page" v-if="false">
				<div class="second-page-head hbox">
					<div class="col-back">
						<BtnIcon icon="icon-back" />
					</div>
					<div class="col-title">
						<strong>Включить</strong> если была открыта одна из
						дверей, уровень освещенности на протяжении
						<span
							class="nowrap"
						>15 с</span> до открытия ниже 21%
					</div>
				</div>
				<div class="second-page-body">
					<div class="hbox just-cn alic">
						<app-switch class="on" />
						<div class="ml8">Активно</div>
					</div>
					<div class="hint error tac">Ошибка! Датчик двери не выбран</div>

					<div class="activation-options">
						<div class="tac fz14">Активация</div>
						<SegmentedControl class="mt8">
							<div class="btn active">Всегда</div>
							<div class="btn">По расписанию</div>
						</SegmentedControl>
					</div>

					<div class="schedule-settings">
						<div class="hours-range hbox just-sb">
							<div class="col-from">
								<div class="hbox alic">
									С
									<Dropdown>
										<option selected="selected">00</option>
										<option>01</option>
									</Dropdown>
									<div class="minutes-div">:</div>
									<Dropdown>
										<option selected="selected">00</option>
										<option>01</option>
									</Dropdown>
								</div>
							</div>
							<div class="col-till">
								<div class="hbox alic">
									ПО
									<Dropdown>
										<option selected>00</option>
										<option>01</option>
									</Dropdown>
									<div class="minutes-div">:</div>
									<Dropdown>
										<option selected="selected">00</option>
										<option>01</option>
									</Dropdown>
								</div>
							</div>
						</div>
						<div class="weekdays-select just-sb hbox alic">
							<div class="weekday">ПН</div>
							<div class="weekday active">ВТ</div>
							<div class="weekday active">СР</div>
							<div class="weekday">ЧТ</div>
							<div class="weekday">ПТ</div>
							<div class="weekday">СБ</div>
							<div class="weekday">ВС</div>
						</div>
						<div class="active-schedules">
							<ScheduleRow />
							<ScheduleRow class="active" />
						</div>
						<div class="hbox just-cn">
							<BtnIcon class="rounded" icon="icon-plus" />
						</div>
					</div>

					<div class="divider"></div>

					<div class="automation-settings-values">
						<FormRow label="Уровень освещенности">
							<Stepper value="25%" />
						</FormRow>
						<FormRow label="Интервал измерения">
							<Stepper value="25%" />
						</FormRow>
						<FormRow label="Привязанные датчики">
							<Button label="Показать все" />
						</FormRow>
						<div class="connected-sensors">
							<div class="hbox alic">
								<div class="col-icon">
									<icon-comp iconName="icon-lamp" />
								</div>
								<div class="col-info">
									<div>Группа 1</div>
									<div>523:44</div>
									<div>Двор</div>
								</div>
							</div>
							<div v-for="i in 6" :key="i" class="hbox alic on">
								<div class="col-icon">
									<icon-comp iconName="icon-lamp" />
								</div>
								<div class="col-info">
									<div>Группа 1</div>
									<div>523:44</div>
									<div>Двор</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="modal-head hbox alic just-sb">
				<BtnIcon icon="icon-close" @click.native="$emit('hide')" />
				<div class="device-name">{{ itemData.attributes.name }}</div>
				<div class="col-filler"></div>
			</div>
			<div class="tabs-nav hbox">
				<span
					v-for="tab in tabs"
					:key="tab"
					:class="{ 'active': tab == activeTabName}"
					@click="activeTabName = tab;"
				>{{ tab }}</span>
			</div>
			<div class="tabs-content">
				<!-- General options -->
				<!-- TODO: Refactor SegmentedControls -->
				<template v-if="activeTabName == $t('Main')">
					<FormRow :label="$t('Add to Favorites')">
						<SegmentedControl>
							<div class="btn" :class="{ 'active' : !isFavorite }"
								@click="handleFavoriteChange(false)">{{ $t('No') }}</div>
							<div class="btn" :class="{ 'active' : isFavorite }"
								@click="handleFavoriteChange(true)">{{ $t('Yes') }}</div>
						</SegmentedControl>
					</FormRow>

					<FormRow :label="$t('Name')">
						<Textfield v-model="itemData.attributes.name" />
					</FormRow>

					<FormRow :label="$t('Hide')">
						<SegmentedControl>
							<div class="btn" :class="{ 'active' : !isHidden }"
								@click="handleHiddenChange(false)">{{ $t('No') }}</div>
							<div class="btn" :class="{ 'active' : isHidden }"
								@click="handleHiddenChange(true)">{{ $t('Yes') }}</div>
						</SegmentedControl>
						<div slot="hint">{{ $t('Hidden elements are visible in engineering mode') }}</div>
					</FormRow>

					<!-- <FormRow label="Помещение">
						<Dropdown class="big">
							<option v-for="(area, i) in filteredAreas" :key="i">{{ area.$.name }}</option>
						</Dropdown>
					</FormRow>-->

					<FormRow :label="$t('Display')" v-if="isWidgetAvailable">
						<SegmentedControl>
							<div class="btn" :class="{ 'active' : !isWidget }"
								@click="handleWidgetChange(false)">{{ $t('Icon') }}</div>
							<div class="btn" :class="{ 'active' : isWidget }"
								@click="handleWidgetChange(true)">{{ $t('Widget') }}</div>
						</SegmentedControl>
					</FormRow>

					<FormRow :label="$t('Icon')">
						<div class="hbox alic just-sb">
							<Button :icon="'icon-' + itemData.__.icon" @click.native="selectIconModalActive = true" />
							<div class="spacer"></div>
							<Button class="change-icon" :label="$t('Reset')" @click.native="setDefaultIcon" />
						</div>
					</FormRow>

					<FormRow :label="$t('Password')">
						<div class="hbox alic just-sb">
							<Textfield v-model="password" />
							<div class="spacer"></div>
							<Button :icon="'icon-check'" @click.native="handlePasswordChange" />
						</div>
					</FormRow>
				</template>
				<!-- Automation -->
				<template v-if="activeTabName == $t('Automation')">
					<FormRow label="Автоинтервал">
						<Stepper :value="1" unit="с" />
					</FormRow>
					<div class="automation-row on">
						<div class="col-indicator">
							<app-switch />
						</div>
						<div class="col-desc">
							<strong>Включить</strong> если была открыта одна из
							дверей, уровень освещенности на протяжении
							<span
								class="nowrap"
							>15 с</span> до открытия ниже 21%
						</div>
						<div class="col-chevron">
							<icon-comp iconName="icon-back" />
						</div>
					</div>
					<div class="automation-row error">
						<div class="col-indicator">
							<app-switch />
						</div>
						<div class="col-desc">
							<strong>Включить</strong> если уровень движения выше 30%,
							уровень освещенности на протяжении
							<span class="nowrap">3 с</span>
							ниже 10%
						</div>
						<div class="col-chevron">
							<icon-comp iconName="icon-back" />
						</div>
						<div class="error">Ошибка! Датчик двери не выбран</div>
					</div>
					<div class="automation-row">
						<div class="col-indicator">
							<BtnIcon icon="icon-alarm" />
						</div>
						<div class="col-desc">
							<strong>Включить</strong> если была открыта одна из
							дверей, уровень освещенности на протяжении
							15 с до открытия ниже 21%
						</div>
						<div class="col-chevron">
							<icon-comp iconName="icon-back" />
						</div>
					</div>
				</template>
				<!-- Buttons -->
				<template v-if="activeTabName == 'Кнопки'">
					<div class="mt-24">
						<connected-switch />
						<connected-switch />
						<div v-if="false" class="press-to-connect">
							Нажмите на выключатель,<br>
							чтобы привязать его
						</div>
						<div v-if="true" class="pressed-switch">
							<div class="title"><strong>Нажато:</strong></div>
							<div class="hbox alic">
								<div class="col-icon">
									<icon-comp iconName="icon-switch" />
								</div>
								<div class="col-name">
									<div class="name">Выключатель 5</div>
									<div class="text-color-device-address">456:23</div>
								</div>
								<div class="col-btn">
									<app-button label="Привязать" />
								</div>
							</div>
						</div>
					</div>
				</template>
			</div>
		</div>

		<ModalWithButtons
			title="Выберите иконку"
			v-if="selectIconModalActive"
			@hide="selectIconModalActive = false"
		>
			<div class="grid-icons-select" slot="body">
				<BtnIcon v-for="icon in iconsList" :key="icon" :icon="icon"
					@click.native="selectIcon(icon)"
					:class="{
						'--selected': itemData.__.icon == icon.substring(5)
					}"
				/>
			</div>
			<app-button slot="footer" label="Cancel" @click.native="selectIconModalActive = false"/>
			<app-button slot="footer" label="Done" @click.native="selectIconModalActive = false" />
		</ModalWithButtons>
	</div>
</template>

<script>
import IconComp from "@/components/icons/iconComp.vue";

import BtnIcon from "@/components/buttons/BtnIcon";
import Button from "@/components/buttons/Button";
import SegmentedControl from "@/components/controls/SegmentedControl";
import Textfield from "@/components/controls/Textfield";
import FormRow from "@/components/etc/FormRow";
import ScheduleRow from "@/components/etc/ScheduleRow";
import ConnectedSwitch from "@/components/etc/ConnectedSwitch";
import Stepper from "@/components/controls/Stepper";

import ModalWithButtons from "@/components/modals/ModalWithButtons"

import WidgetManager from "@/components/widgets/WidgetManager";

import { getDefaultItemIcon } from "@/utils/utils.js"

import { debounce } from "@/utils/functions.js";

import { SYSTEM_ICONS } from "@/utils/consts/consts.js";

export default {
	props: {
		// deviceName: {
		// 	type: String,
		// 	default: ""
		// },
		tabs: {
			type: Array,
			// default() {return['Основные', 'Автоматизация']}
			default() {
				return [
					this.$t('Main'),
					this.$t('Automation'),
					'Кнопки'
				];
			}
		},
		addr: {
			type: String
		}
	},
	data() {
		return {
			activeTabName: this.tabs[0],
			selectIconModalActive: false,
			
			password: ''
		};
	},
	computed: {
		itemData() {
			return this.$store.state.itemMap[this.addr]
		},
		deviceName() {
			return this.itemData.attributes.name;
		},
		isHidden() {
			return this.itemData.attributes.system != undefined && this.itemData.attributes.system == "yes";
		},
		isWidget() {
			return this.itemData.attributes.widget != undefined && this.itemData.attributes.widget == "yes";
		},
		isFavorite() {
			return this.itemData.attributes.favorite != undefined && this.itemData.attributes.favorite == "yes";
		},
		showSystem() {
			return this.$store.state.modules.settings.interface.showSystem;
    },

		allIcons() {
			return this.$options.components.IconComp.components;
		},
		iconsList() {
			let outArr = [];
			Object.keys(this.allIcons).forEach( key => {
				if (
					!outArr.map( item => this.allIcons[item] ).some( item => Object.is(item, this.allIcons[key] )) &&
					(this.showSystem || !SYSTEM_ICONS.includes(key.substring(5)))
				) {
					outArr.push(key)
				}
			});
			return outArr;
		},

		allWidgets() {
			return WidgetManager.components;
		},
		computedType() {
      let type = this.itemData.attributes.type == 'virtual' ? this.itemData.attributes['sub-type'] : this.itemData.attributes.type;
      return `${type}-widget`;
    },
		isWidgetAvailable() {
			return Object.keys(this.allWidgets).includes(this.computedType)
		}
	},
	watch: {
		deviceName: debounce(function(newVal) {
			this.itemData.attributes.name = newVal;
			this.$store.dispatch('changeItemXml', this.itemData);
		}, 300),
	},
	methods: {
		// TODO: make 1 method for changing XML and call it from all handlers
		handleFavoriteChange(value) {
			this.$set(this.itemData.attributes, 'favorite', value ? 'yes' : 'no');
			this.$store.dispatch('changeItemXml', this.itemData);
		},
		handleHiddenChange(value) {
			this.$set(this.itemData.attributes, 'system', value ? 'yes' : 'no');
			this.$store.dispatch('changeItemXml', this.itemData);
		},
		handleWidgetChange(value) {
			this.$set(this.itemData.attributes, 'widget', value ? 'yes' : 'no');
			this.$store.dispatch('changeItemXml', this.itemData);
		},
		handlePasswordChange() {
			this.$set(this.itemData.attributes, 'password', this.password);
			this.$store.dispatch('changeItemXml', this.itemData);
			this.$store.dispatch('modules/alerts/alert', this.$t('Password saved'))
		},

		selectIcon(icon) {
			this.itemData.__.icon = icon.substring(5);
			this.itemData.attributes.icon = icon.substring(5);

			this.$store.dispatch('changeItemXml', this.itemData);

			this.selectIconModalActive = false;
		},
		setDefaultIcon() {
			let icon = getDefaultItemIcon(this.itemData);
			this.selectIcon('icon-' + icon);
		}
	},
	mounted() {
		this.password = this.itemData.attributes.password;
	},
	components: {
		IconComp,

		BtnIcon,
		SegmentedControl,
		Textfield,
		FormRow,
		Button,
		Stepper,
		ScheduleRow,

		ModalWithButtons,
		ConnectedSwitch
	}
};
</script>

<style lang="less" scoped>
.mt-24 {margin-top: -24px;}
.press-to-connect {
	text-align: center;
	margin-top: 16px;
	line-height: 1.4;
}
.pressed-switch {
	font-size: 14px;
	margin-top: 16px;
	.title {margin-bottom: 8px;}
	.col-icon {margin-right: 8px;}
	.col-btn {margin-left: auto;}
}
.col-chevron {
	.icon-holder {
		transform: scaleX(-1);
	}
}
.--selected {
	position: relative;
	&::before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		border: 1px solid #535DFF;
		border-radius: 4px;
		box-sizing: border-box;
	}
}
.active-schedules {
	margin-bottom: 16px;
	padding-top: 8px;
}
.weekdays-select {
	margin-top: 16px;
	.weekday {
		border: 1px solid @colorGrayedOut;
		color: @colorGrayedOut;
		border-radius: 50%;
		width: @btnHeight;
		height: @btnHeight;
		display: flex;
		align-items: center;
		justify-content: center;
		&.active {
			background: @colorMain;
			border-color: transparent;
			color: #fff;
		}
	}
}
.hours-range {
	font-size: 12px;
	.dropdown {
		margin: 0 4px;
	}
}
.schedule-settings {
	margin-top: 24px;
}
.connected-sensors {
	margin-top: 16px;
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	font-size: 10px;
	color: #c4c4c4;
	.col-icon {
		margin-right: 8px;
		position: relative;
		z-index: 1;
	}
	.on {
		color: @colorMain;
		.col-icon:before {
			content: "";
			position: absolute;
			width: 12px;
			height: 12px;
			background: url(../../assets/selected-check.svg);
			z-index: 2;
		}
	}
}
.automation-settings-values {
	.form-row {
		grid-template-columns: 160px 1fr;
	}
}
.divider {
	margin-left: -16px;
	margin-right: -16px;
}
.activation-options {
	margin-top: 24px;
}
.automation-row {
	display: grid;
	grid-template-columns: 48px 1fr 24px;
	padding-top: 12px;
	padding-bottom: 12px;
	align-items: center;
	font-size: 12px;
	margin-left: -16px;
	margin-right: -16px;
	padding-left: 16px;
	padding-right: 16px;
	&:active {
		background: rgba(0,0,0,0.05);
	}
	.error {
		font-size: 10px;
		color: @colorRed;
		padding-top: 4px;
		grid-column-start: 2;
		padding-left: 16px;
	}
	.col-desc {
		padding-left: 16px;
	}
	.col-indicator {
		justify-self: center;
	}
}
.spacer {
	width: 16px;
}
.change-icon {
	flex-grow: 1;
}
.modal-head {
	background: #fff;
}
.tabs-nav {
	background: #fff;
	border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.col-filler {
	width: 40px;
}
.modal-device-settings {
	position: fixed;
	height: 100vh;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	z-index: 102;
}
.modal-contents {
	position: relative;
	height: 100vh;
	width: 100%;
	max-width: 100%;
	z-index: 2;
	top: 0;
	bottom: 0;
	position: absolute;
	z-index: 2;
	border-radius: 0;
	background: @colorBg;
	overflow-y: auto;
	.tabs-content {
		padding-left: 16px;
		padding-right: 16px;
		padding-bottom: 16px;
	}
}

@media (min-width: @phones) {
	.modal-device-settings {
		display: flex;
		align-items: center;
	}
	.modal-contents {
		left: 50%;
		margin-left: -210px;
		bottom: auto;
		top: auto;
		width: 420px;
		height: auto;
		border-radius: 8px;
		overflow: hidden;
	}
}
</style>