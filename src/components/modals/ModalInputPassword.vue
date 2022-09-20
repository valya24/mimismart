<template>
	<transition name="fade-in">
		<modal-with-buttons
			v-if="showInputPasswordModal"
			title="Введите пароль"
			@hide="handleHide">
			<template slot="body">
				<div class="tac">
					<input class="pass"
						type="password"
						:value="password"
						disabled
					>
				</div>
				<div class="digits-grid">
					<div class="digit"
						v-for="i in 9" :key="i"
						@click="handleInput(i)"
					>{{ i }}</div>
					
					<div class="digit empty"></div>
					<div class="digit" @click="handleInput(0)">0</div>
					<div class="digit" @click="handleDelete"><icon-comp iconName="icon-backspace" /></div>
				</div>
			</template>
			<app-button slot="footer" label="Применить" @click.native="handleApply" />
		</modal-with-buttons>
	</transition>
</template>

<script>
	import ModalWithButtons from '../../components/modals/ModalWithButtons.vue';
	
	import { ROOT_PASSWORD } from '@/utils/consts/consts.js';

	export default {
		props: {
			// correctPassword: {
			// 	type: String,
			// 	default: ''
			// }
		},
    data() {
      return {
        password: ''
      }
		},
		computed: {
			correctPassword() {
				return this.$store.state.modules.singleAction.activeItem.attributes.password;
			},
			showInputPasswordModal() {
				return this.$store.state.modules.singleAction.showPasswordModal;
			}
		},
    methods: {
      handleInput(val) {
        if (this.password.length < 6) {
					this.password += val.toString();
					
					if (this.password == this.correctPassword) {
						this.handleApply();
					}
        }
      },
      handleDelete() {
        this.password = this.password.substring(0, this.password.length - 1);
      },
			handleApply() {
				if (
					this.password == this.correctPassword ||
					this.password == ROOT_PASSWORD
				) {
					this.$emit('pass');
					this.password = '';
				} else {
					this.$store.dispatch('modules/alerts/alert', this.$t('Incorrect password'))
				}
			},
			handleHide() {
				this.$emit('hide');
				this.password = '';
			}
    },
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
	cursor: pointer;
	&:active {
		box-shadow: inset 0px 3px 3px rgba(0, 0, 0, 0.17);
        background: linear-gradient(180deg, #F1F2FF 0%, #FFFFFF 100%);
	}
	&.empty {
		background: none;
		border: 0;
		box-shadow: none;
		cursor: default;
	}
}
</style>