<template>
	<div class="intercom-control controls-body on">
		<div class="camera-view" style="background-image:url(https://static01.nyt.com/images/2020/01/19/fashion/18RING-PREVIEW-IMAGE/18RING-PREVIEW-IMAGE-superJumbo-v4.png)"></div>
		<div class="hbox just-cn">
			<Button label="Открыть" />
			<div class="div24"></div>
			<Button icon="icon-mic" label="Передать звук" />
		</div>
	</div>
</template>

<script>
import Button from '@/components/buttons/Button'
export default {
	components: {
		Button,
	}
}
</script>

<style lang="less" scoped>
.camera-view {
	height: 200px;
	background-size: cover;
	margin-left: -16px;
	margin-right: -16px;
	margin-bottom: 24px;
}
.status {
	color: rgba(0,0,0,0.5);
	margin-bottom: 24px;
}
</style>