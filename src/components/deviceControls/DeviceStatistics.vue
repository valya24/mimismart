<template>
	<div class="stats controls-body">
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
		FormRow,
	}
}
</script>

<style lang="less" scoped>
.graph {
	margin-top: 24px;
	img {max-width: 100%;}
}
</style>