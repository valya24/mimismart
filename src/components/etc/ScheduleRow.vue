<template>
	<div class="schedule-row">
		<div class="schedule-item">
			<div class="col-timerange">00:00 - 00:30</div>
			<div class="col-weekdays">
				<div class="weekday">ПН</div>
				<div class="weekday active">ВТ</div>
				<div class="weekday active">СР</div>
				<div class="weekday">ЧТ</div>
				<div class="weekday">ПТ</div>
				<div class="weekday">СБ</div>
				<div class="weekday">ВС</div>
			</div>
		</div>
		<BtnIcon icon="icon-trash" />
	</div>
</template>

<style lang="less" scoped>
.schedule-row {
	display: flex;
	font-size: 11px;
	align-items: center;
	margin-top: 8px;
	.schedule-item {
		border: 1px solid @colorGrayedOut;
		border-radius: 4px;
		height: @btnHeight;
		display: flex;
		align-items: center;
		padding: 0 16px;
		justify-content: space-between;
		flex-grow: 1;
		margin-right: 8px;
	}
	&.active {
		.schedule-item {
			background: @colorMain;
			border-color: transparent;
			color: #fff;
		}
		.weekday.active {color: #fff;}
	}
}
.col-weekdays {
	display: flex;
	.weekday {
		margin: 0 2px;
		opacity: 0.3;
		font-weight: bold;
		&.active {
			color: @colorMain;
			opacity: 1;
		}
	}
}
</style>