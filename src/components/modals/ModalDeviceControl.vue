<template>
	<div
		class="modal-device-control"
		@touchmove="(e) => e.preventDefault()"
	>
		<div class="overlay"
			@click="hide"
			v-touch:swipe.bottom="hide"></div>
		<div class="modal-control-contents-centered">
			<div class="modal-head hbox alic just-sb">
				<BtnIcon icon="icon-close" @click.native="hide" />

				<div class="device-name">{{ computedName }}</div>
				<BtnIcon icon="icon-tuning" @click.native="showSettingsPopup" />
			</div>
			<div class="tabs-nav hbox">
				<span
					v-for="tab in tabs"
					:key="tab"
					:class="{ 'active': tab == activeTabName }"
					@click="activeTabName = tab;"
				>{{ tab }}</span>
			</div>
			<div class="tabs-content-wrapper" ref="tabsWrapper">
				<div
					class="tabs-tab-container"
					v-for="tab in tabs"
					:key="tab"
					:class="{ '--active': tab == activeTabName }"
				>
					<slot :name="tab"></slot>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import BtnIcon from "@/components/buttons/BtnIcon.vue";
export default {
	props: {
		deviceName: {
			type: String,
			default: ""
		},
		tabs: {
			type: Array
		},
	},
	data() {
		return {
			activeTabName: this.tabs[0],
		};
	},
	computed: {
		computedName() {
			return this.deviceName.replace(/(\\10|&#10;)/g, ' ')
		}
	},
	methods: {
		showSettingsPopup() {
			this.$store.commit("modules/popups/showPopup", "deviceSettings");
		},
		hide() {
			this.$emit('hide');
		}
	},
	components: {
		BtnIcon
	}
};
</script>

<style lang="less" scoped>
@transitionLength: 0.25s;

.modal-device-control {
	user-select: none;
	position: fixed;
	left: 0;
	right: 0;
	top: 0;
	bottom: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 101;
	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: 0;
		transition: @transitionLength;
	}
	.modal-control-contents,
	.modal-control-contents-centered {
		transition: @transitionLength;
	}
	&.--instant .modal-control-contents,
	&.--instant .modal-control-contents-centered,
	&.--instant .overlay {
		transition: 0s;
	}
	
	&.--slide-bottom .modal-control-contents {
		transform: translate(0, 100%);
	}
	&.--slide-bottom .overlay {
		opacity: 0;
	}
}

.slide-bottom-enter-active,
.slide-bottom-leave-active {	
  transition: @transitionLength;
}
.slide-bottom-enter .modal-control-contents,
.slide-bottom-leave-to .modal-control-contents {
  transform: translate(0, 100%);
}
.slide-bottom-enter .overlay,
.slide-bottom-leave-to .overlay {
  opacity: 0;
}

.fade-in-enter-active,
.fade-in-leave-active {	
  transition: @transitionLength;
}
.fade-in-enter .modal-control-contents-centered,
.fade-in-leave-to .modal-control-contents-centered {
	transform: scale(0.8);
	opacity: 0;
}
.fade-in-enter .overlay,
.fade-in-leave-to .overlay {
  opacity: 0;
}

.tabs-tab-container {
	height: 0;
	overflow: hidden;
	&.--active {
		height: auto;
	}
}

@media (min-width: @phones) {
	.modal-contents {
		left: 50%;
		margin-left: -210px;
		width: 420px;
	}
	.modal-control-contents-centered {height: 520px;}
}
</style>