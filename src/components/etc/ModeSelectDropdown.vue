<template>
	<div class="mode-select-dropdown" :class="{ '--to-top': toTop }">
		<div
			class="mode-select-dropdown__active-mode-title"
			v-if="showActiveTitle"
			@click="showModeSelectModal"
		>
			{{ $t(activeMode) }}
			<img class="caret" src="@/assets/caret.svg" alt />
		</div>

		<BtnIcon v-else :icon="'icon-' + activeModeIcon" @click.native="showModeSelectModal" />

		<DropdownList
			:items="modes"
			:expanded="modeSelectModalShown"
			:value="activeMode"
			:valueKey="valueKey"
			:emitKey="emitKey"
			:toTop="toTop"
			:alignRight="alignRight"

			@selectMode="selectMode"
			@hide="hideModeSelectModal"
		/>
	</div>
</template>

<script>
import DropdownList from "@/components/etc/DropdownList";

export default {
	props: {
		modes: {
			type: Array
		},
		valueKey: {
			type: String,
			default: "name"
		},
		emitKey: {
			type: String,
			default: 'name'
		},
		activeMode: {
			type: [String, Number],
			default() {
				return this.modes[0] ? this.modes[0][this.valueKey] : 'defaultMode';
			}
		},
		showActiveTitle: {
			type: Boolean,
			default: false
		},
		alignRight: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			modeSelectModalShown: false,
			toTop: false
		};
	},
	computed: {
		activeModeIcon() {
			let item = this.modes.find( item => item[this.valueKey] == this.activeMode );
			return item ? item.icon : 'close';
		}
	},
	methods: {
		selectMode(mode) {
			this.$emit("selectMode", mode);
			this.hideModeSelectModal();
		},
		showModeSelectModal() {
			this.toTop =
				(this.$el.getBoundingClientRect().top +
					this.$el.getBoundingClientRect().bottom) /
					2 >
				window.innerHeight / 2;

			this.modeSelectModalShown = true;
			document.body.addEventListener(
				"touchstart",
				e => {
					e.stopPropagation();
					if (!this.$el.contains(e.target)) {
						this.hideModeSelectModal();
					}
				},
				{ once: true }
			);
		},
		hideModeSelectModal() {
			this.modeSelectModalShown = false;
		}
	},
	components: {
		DropdownList
	}
};
</script>

<style lang="less">
.mode-select-dropdown {
	position: relative;
	display: flex;
	flex-direction: column;
	text-align: left;
	&.--to-top {
		flex-direction: column-reverse;
	}

	&__active-mode-title {
		display: flex;
		align-items: center;
		line-height: 26px;
		height: 30px;
		padding: 0 10px;
		font-size: 13px;
		border: 1px solid @colorGrayedOut;
		border-radius: 15px;
		background-color: #fff;
		.caret {
			margin-left: auto;
		}
	}
}
</style>