<template>
	<div class="binary-sensor-control controls-body">
		<div class="hbox alic">
			<div class="col-label fg1">Присылать оповещения <span class="nowrap">о тревоге</span></div>
			<div class="col-switch">
				<app-switch />
			</div>
		</div>
		<FormRow label="Период">
			<Dropdown class="big">
				<option>Час</option>
				<option>День</option>
				<option>Минута</option>
			</Dropdown>
		</FormRow>
		<div class="graph">
			<img src="@/assets/graph-example.png" alt="">
		</div>
	</div>
</template>

<script>
import FormRow from "@/components/etc/FormRow"
export default {
	components: {
		FormRow
	}
}
</script>

<style lang="less" scoped>
.graph {
	margin-top: 24px;
	img {max-width: 100%;}
}
</style>