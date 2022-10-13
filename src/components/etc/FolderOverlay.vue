<template>
	<div class="folder-overlay">
		<div class="head">
			<BtnIcon class="close" icon="icon-close" />
			<div class="folder-title">
				<input disabled="disabled" type="text" value="Папка">
			</div>
			<!-- По нажатию на карандаш:
			1. ставить фокус на инпуте,
			2. выделять содержимое инпута,
			3. менять иконку на icon-check -->
			<BtnIcon class="edit" icon="icon-edit" />
		</div>
		<div class="sec-icons">
			<div class="grid-icons">
				<device-as-icon v-for="i in 20" :key="i" icon="light-scheme" name="Ушел из дома" />
			</div>
		</div>
	</div>
</template>

<style lang="less" scoped>
.folder-overlay {
	position: fixed;
	background: rgba(0,0,0,0.9);
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 50;
	color: #fff;
	display: flex;
	flex-direction: column;
}
.head {
	margin-top: 20%;
	position: relative;
	margin-bottom: 16px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 8px;
	.close {fill: #fff}
	.close, .edit {
		flex-shrink: 0;
		flex-basis: 40px;
	}
}
.folder-title {
	input {
		border: 0;
		background: none;
		font-family: @fontMain;
		color: #fff;
		text-align: center;
		font-size: 24px;
		display: block;
		width: 100%;
	}
}
.sec-icons {
	flex-grow: 1;
	overflow: auto;
	padding-bottom: 72px;
}
</style>