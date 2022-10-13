<template>
	<div class="knob" ref="knob" :class="{ '--disabled': disabled }">
		<div
			class="knob-handle"
			@touchmove="handleTouchMove"
			:style="{ 'transform': `rotate(${angle}deg)` }"
		></div>
		<div class="knob-second-handle"
			:style="{ 'transform': `rotate(${secondAngle}deg)` }">
		</div>
		<svg
			width="224"
			height="224"
			viewBox="0 0 224 224"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle cx="112" cy="112" r="100" class="knob-cir" stroke-width="2" />
			<path
				class="range-full"
				d="M26.2635 163.5C17.2083 148.457 12 130.837 12 112C12 56.7715 56.7715 12 112 12C167.228 12 212 56.7715 212 112C212 130.837 206.792 148.457 197.737 163.5"
				stroke-width="5"
				stroke-linecap="round"
			/>
      <path
				class="range-active"
        ref="rangeActive"
				d="M26.2635 163.5C17.2083 148.457 12 130.837 12 112C12 56.7715 56.7715 12 112 12C167.228 12 212 56.7715 212 112C212 130.837 206.792 148.457 197.737 163.5"
				stroke="#535DFF"
				stroke-width="5"
				stroke-linecap="round"
        :stroke-dasharray="pathLength"
        :stroke-dashoffset="pathLength - nValue * pathLength"
			/>

			<path
				d="M26.2635 163.5C17.2083 148.457 12 130.837 12 112C12 56.7715 56.7715 12 112 12C167.228 12 212 56.7715 212 112C212 130.837 206.792 148.457 197.737 163.5"
				stroke="transparent"
				stroke-width="20"
				stroke-linecap="round"
				@touchstart="handleTouchMove"
				@touchmove="handleTouchMove"
			/>
		</svg>

		<slot />
	</div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0
		},
		secondValue: {
			type: Number,
			default: 0
		},
		min: {
			type: Number,
			default: 0
		},
		max: {
			type: Number,
			default: 1
		},
		disabled: {
			type: Boolean,
			default: false
		}
  },
	data() {
		return {
			nValue: 0,
			outValue: this.value,
      pathLength: 0,
			touch: {
				x: 0,
				y: 0
			},
			angle: 360 - 31,
			secondAngle: 360 - 31,
		}
  },
  watch: {
    value(newVal, oldVal) {
			if (newVal == oldVal) return;
			if (newVal < this.min) {
				this.outValue = this.min
			} else if (newVal > this.max) {
				this.outValue = this.max				
			} else {
				this.outValue = newVal;
			}
			this.nValue = this.calculateNValue(this.outValue);
      this.setAngle(this.nValue);
    }
  },
	methods: {
		handleTouchMove(e) {
			if (this.disabled) return;

      let knobRect = this.$refs.knob.getBoundingClientRect();
      
			this.touch.x = e.touches[0].clientX - knobRect.left - knobRect.width / 2;
			this.touch.y =
				1 * (e.touches[0].clientY - knobRect.top - knobRect.height / 2);

			let angle =
				(Math.atan2(this.touch.y, this.touch.x) * 180) / Math.PI + 180;

			// console.log(angle);

			if (angle > 211 && angle < 360 - 31) {
				angle = 211;
				if (angle - this.angle < 0) {
					angle = 360 - 31;
				} else if (angle - this.angle > 0) {
					angle = 211;
				}
			}

			let refAngle = angle < 270 ? angle : angle - 360;
			let nValue = (refAngle + 31) / (211 + 31);

      this.angle = angle;
			this.nValue = nValue;
			this.calculateOutValue();
      
      this.$emit('change', this.outValue);
		},
		calculateAngle(nValue) {
			let angle = nValue * (211 + 31) - 31;
      if (angle < 0) angle += 360;
      
      if (angle > 211 && angle < 360 - 31) {
				angle = 211;
				if (angle - this.angle < 0) {
					angle = 360 - 31;
				} else if (angle - this.angle > 0) {
					angle = 211;
				}
			}
			
			return angle;
		},
    setAngle(nValue) {
			this.angle = this.calculateAngle(nValue)
		},
		calculateNValue(val) {
			return (val - this.min) / (this.max - this.min);
		},
		calculateOutValue() {
			return this.outValue = (this.max - this.min) * this.nValue + this.min;
		}
  },
  mounted() {
		this.pathLength = this.$refs.rangeActive.getTotalLength();
		this.nValue = this.calculateNValue(this.value);
		this.setAngle(this.nValue);

		this.secondAngle = this.calculateAngle(this.calculateNValue(this.secondValue))
  }
};
</script>

<style lang="less" scoped>
.knob-cir {
	fill: #fff;
	stroke: #E8EAFF;
}
.range-full {
	stroke: #A6ABFF;
}
.knob {
	position: relative;
	z-index: 1;
	width: 200px;
	height: 200px;
	margin-left: auto;
	margin-right: auto;
	box-shadow: 0px 7px 28px rgba(168, 173, 255, 0.29);
	border-radius: 50%;
	svg {
		position: absolute;
		left: -12px;
		top: -12px;
	}
	&-handle {
		position: absolute;
		left: -11px;
		top: 50%;
		margin-top: -11px;
		width: calc(50% + 11px);
		height: 22px;
		z-index: 2;
		transform-origin: 100% 50%;
		transform: rotate(-31deg);
		//  MAX:
		// transform: rotate(211deg);
		&::before {
			content: "";
			display: block;
			width: 22px;
			height: 22px;
			border-radius: 50%;
			background-color: @colorMain;
		}
	}
	&-second-handle {
		position: absolute;
		left: -3px;
		top: 50%;
		margin-top: -3px;
		width: calc(50% + 3px);
		height: 5px;
		z-index: 1;
		transform-origin: 100% 50%;
		transform: rotate(-31deg);
		font-size: 0;
		//  MAX:
		// transform: rotate(211deg);
		&::before {
			content: "";
			display: block;
			width: 5px;
			height: 5px;
			margin-left: 1px;
			border-radius: 50%;
			background-color: #fff;
			// border: 2px solid #E8EAFF;
		}
	}

	&.--disabled .range-active {
		stroke: @colorGrayedOut;
	}
	&.--disabled .knob-handle::before {
		background-color: @colorGrayedOut;
	}
	&.--disabled .range-full {
		stroke: @colorGrayedOutLighter;
	}
}
</style>