<template>
	<modal-with-buttons
		title="Введите пароль">
		<template slot="body">
			<div class="tac"><input type="password" value="1234" class="pass"></div>
			<div class="digits-grid">
				<div class="digit">1</div>
				<div class="digit">2</div>
				<div class="digit">3</div>
				<div class="digit">4</div>
				<div class="digit">5</div>
				<div class="digit">6</div>
				<div class="digit">7</div>
				<div class="digit">8</div>
				<div class="digit">9</div>
				<div class="digit empty"></div>
				<div class="digit">0</div>
				<div class="digit"><icon-comp iconName="icon-backspace" /></div>
			</div>
		</template>
		<app-button slot="footer" label="Применить" />
	</modal-with-buttons>
</template>

<script>
	import ModalWithButtons from '../../components/modals/ModalWithButtons.vue';
	export default {
		components: {
			ModalWithButtons
		}
	}
</script>

<style lang="less" scoped>
.button {
	background: #000;
}
.pass {
	border: 0;
	background: none;
	width: 100%;
	text-align: center;
	font-family: -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
	font-size: 40px;
	padding: 0;
	margin: 0;
	margin-top: 12px;
}
.digits-grid {
	margin-top: 16px;
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	gap: 8px;
}
.digit {
	background: linear-gradient(180deg, #FFFFFF 0%, #F1F2FF 100%), #FFFFFF;
	border: 1px solid #535DFF;
	box-shadow: 0px 3px 6px rgba(83, 93, 255, 0.1);
	border-radius: 5px;
	height: 48px;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 20px;
	&:active {
		box-shadow: inset 0px 3px 3px rgba(0, 0, 0, 0.17);
        background: linear-gradient(180deg, #F1F2FF 0%, #FFFFFF 100%);
	}
	&.empty {
		background: none;
		border: 0;
		box-shadow: none;
	}
}
</style>