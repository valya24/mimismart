<template>
	<div class="text-sensor-control controls-body">
		{{ text.trim() }}
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
    },
    text: {
      type: String,
      default: ''
    }
	},
}
</script>

<style lang="less" scoped>
.text-sensor-control {
  white-space: pre;
}
</style>