<template>
	<div class="settings-global">
		<Header>
			<div class="hbox just-sb alic presetbar">
				<div class="col-preset-name">
					<Dropdown class="flat">
						<option selected="selected" value="1">Дача</option>
						<option value="2">Дом</option>
					</Dropdown>
				</div>
				<div class="col-preset-actions hbox">
					<BtnIcon icon="icon-trash" />
					<BtnIcon icon="icon-edit" />
					<BtnIcon icon="icon-duplicate" />
				</div>
			</div>
			<div class="tabs-nav">
				<span
					v-for="(tab, i) in tabs"
					:key="i"
					:class="{ '--active': activeTabIndex == i }"
					@click="selectTab(i)"
				>{{ tab }}</span>
			</div>
		</Header>
		<div class="tabs-content">
			<template v-if="activeTabIndex == 0">
				<!-- По-русский: Оформление -->
				<FormRow :label="$t('Language')">
					<Dropdown class="big" v-model="settings.other.language" @change="instantHandleSettingChange">
						<option value="ru">Русский</option>
						<option value="en">English</option>
					</Dropdown>
				</FormRow>

				<FormRow :label="$t('Appearance')">
					<Dropdown class="big"
						v-model="settings.interface.appearance"
						@change="instantHandleSettingChange">
						<option value="light" selected="selected">{{ $t('Light') }}</option>
						<option value="dark">{{ $t('Dark') }}</option>
					</Dropdown>
				</FormRow>
				<FormRow :label="$t('Sort room devices')">
					<Dropdown class="big"
						v-model="settings.interface.devicesSort"
						@change="instantHandleSettingChange">
						<option value="none">{{ $t('None') }}</option>
						<option value="byName">{{ $t('Alphabetically') }}</option>
						<option value="byType">{{ $t('By type') }}</option>
					</Dropdown>
				</FormRow>
				<FormRow class="controls-right" :label="$t('Show widgets on top')">
					<app-switch v-model="settings.interface.widgetsOnTop" @change="instantHandleSettingChange" />
				</FormRow>
				<FormRow class="controls-right" :label="$t('Show device addresses')">
					<app-switch v-model="settings.interface.showDeviceAddresses" @change="instantHandleSettingChange" />
				</FormRow>
				<FormRow class="controls-right" :label="$t('Show system devices')">
					<app-switch v-model="settings.interface.showSystem" @change="instantHandleSettingChange" />
				</FormRow>

				<!-- <FormRow class="controls-right" :label="$t('Use test logic.xml file')">
					<app-switch v-model="settings.other.useTestLogic" @change="instantHandleSettingChange" />
				</FormRow> -->

				<FormRow class="controls-right" :label="$t('Additional settings')">
					<app-button :label="$t('Open_1')" @click.native="openOldSettings" />
				</FormRow>
			</template>

			<template v-if="activeTabIndex == 1">
				<FormRow :label="$t('Access key')">
					<Textfield v-model="settings.network.key" type="password" @change="handleKeyChange" />
				</FormRow>
				<FormRow :label="$t('Remote mode')">
					<Dropdown class="big" v-model="settings.network.remoteMode" @change="handleRemoteModeChange">
						<option value="No">{{ $t('At home') }}</option>
						<option value="Yes">{{ $t('Via internet') }}</option>
						<option value="Auto">{{ $t('Auto') }}</option>
					</Dropdown>
				</FormRow>
        <FormRow :label="$t('Remote Ip')">
          <Textfield v-model="settings.network.remoteIp" @change="handleRemoteIpChange" />
        </FormRow>
        <FormRow :label="$t('Remote port')">
          <Textfield v-model="settings.network.remotePort" @change="handleRemotePortChange" />
        </FormRow>
        <FormRow :label="$t('Remote web port')">
          <Textfield v-model="settings.network.webPort" @change="handleWebPortChange" />
        </FormRow>
				<FormRow :label="$t('Local server address')">
          <Textfield v-model="settings.network.localIp" @change="handleLocalIpChange" />
				</FormRow>
        <FormRow :label="$t('Local web port')">
          <Textfield v-model="settings.network.localWebPort" @change="handleLocalWebPortChange" />
				</FormRow>
        <FormRow :label="$t('Local port')">
          <Textfield v-model="settings.network.localPort" @change="handleLocalPortChange" />
        </FormRow>
        <FormRow :label="$t('Password')">
          <Textfield v-model="settings.network.password" type="password" @change="handleSettingsPasswordChange"/>
        </FormRow>
				<FormRow :label="$t('Reset local address')">
					<app-button :label="$t('Reset')" @click.native="handleLocalIpReset" />
				</FormRow>
			</template>

			<template v-if="activeTabIndex == 3">
				<div class="login-form">
					<template v-if="isLoggedIn">
						<!-- <div class="avatar"></div> -->
						<div class="loggedin-wrap">
							<div class="username-wrap">
								<div>{{ $t('Logged in as') }}</div>
								<div class="username">{{ settings.user.name && settings.user.name.length ? settings.user.name : settings.user.key }}</div>
							</div>
							<div class="logout">
								<app-button @click.native="logout" :label="$t('Logout')" />
							</div>
						</div>
					</template>
					<template v-if="!isLoggedIn">
						
							<Textfield :placeholder="$t('Login_2')" v-model="username"
								@input="checkLogPassValidity"
								:invalid="invalidLogPass" />
							<Textfield :placeholder="$t('Password')" v-model="password"
								@input="checkLogPassValidity"
								:invalid="invalidLogPass" />

							<app-button :label="$t('Login_1')" @click.native="login" />
						
					</template>
				</div>
			</template>
		</div>
	</div>
</template>

<script>
import Header from "@/components/Header";
import FormRow from "@/components/etc/FormRow";

import { debounce } from "@/utils/functions.js";
import {mapActions} from "vuex";

export default {
	data() {
		return {
			// isLoggedin: false,
			activeTabIndex: 0,
			// settings: JSON.parse(JSON.stringify(this.$store.state.modules.settings))
			username: '',
			password: '',
			invalidLogPass: false
		};
	},
  destroyed() {
    this.loadLogicXML()
  },
  computed: {
		tabs() {
			return [
				this.$t("General"),
				this.$t("Network"),
				this.$t("Profile"),
			];
		},
		settings() { return this.$store.state.modules.settings },
		showSystem() {
			return this.settings.interface.showSystem;
		},
		users() {
			return this.$store.getters.getUsers;
		},
		isLoggedIn() {
			return !!(this.settings.user.name);
		}
	},
  watch: {
    // settings: {
    //   deep: true,
    //   handler() {
    //     this.$store.dispatch('loadLogicXML')
    //   }
    // }
  },
	methods: {
    ...mapActions(['loadLogicXML']),
		swapLoggedin() {
			this.isLoggedin = !this.isLoggedin;
		},
		selectTab(index) {
			this.activeTabIndex = index;
		},
		handleSettingChange: debounce(function () {
			this.$store.dispatch('modules/settings/setSettings', this.settings);
		}, 300),
		instantHandleSettingChange() {
			this.$store.dispatch('modules/settings/setSettings', this.settings);
		},
		//	TODO: Refactor
		handleRemoteIpChange() {
			this.handleSettingChange();
			// this.$store.dispatch('ws/sendMessage', {
			// 	"request":"executeShiCode",
			// 	"code": `changeSettings('srv-addr-remote', '${this.settings.network.remoteIp}')`
			// });
		},
    handleRemotePortChange() {
			this.handleSettingChange();
			// this.$store.dispatch('ws/sendMessage', {
			// 	"request":"executeShiCode",
			// 	"code": `changeSettings('srv-addr-remote', '${this.settings.network.remotePort}')`
			// });
		},
    handleLocalPortChange() {
			this.handleSettingChange();
			// this.$store.dispatch('ws/sendMessage', {
			// 	"request":"executeShiCode",
			// 	"code": `changeSettings('srv-addr-remote', '${this.settings.network.localPort}')`
			// });
		},
    handleWebPortChange() {
			this.handleSettingChange();
			// this.$store.dispatch('ws/sendMessage', {
			// 	"request":"executeShiCode",
			// 	"code": `changeSettings('srv-addr-remote', '${this.settings.network.webPort}')`
			// });
		},
		handleLocalIpChange() {
			this.handleSettingChange();
			// this.$store.dispatch('ws/sendMessage', {
			// 	"request":"executeShiCode",
			// 	"code": `changeSettings('srv-addr', '${this.settings.network.localIp}')`
			// });
		},
    handleLocalWebPortChange() {
			this.handleSettingChange();
			// this.$store.dispatch('ws/sendMessage', {
			// 	"request":"executeShiCode",
			// 	"code": `changeSettings('srv-addr', '${this.settings.network.localWebPort}')`
			// });
		},
		handleKeyChange() {
			this.handleSettingChange();
			// this.$store.dispatch('ws/sendMessage', {
			// 	"request":"executeShiCode",
			// 	"code": `changeSettings('pass-key', '${this.settings.network.key}')`
			// });
		},
    connectRemotely() {
      this.$set(this.settings.network, 'remoteIp', '77.91.110.138');
      this.$set(this.settings.network, 'remotePort', '55551');
      this.$set(this.settings.network, 'webPort', '12580');
    },
    connectLocally() {
      this.$set(this.settings.network, 'localIp', '192.168.1.125');
      this.$set(this.settings.network, 'localPort', '15580');
      this.$set(this.settings.network, 'localWebPort', '54441');
    },
		handleRemoteModeChange() {
      switch (this.settings.network.remoteMode) {
        case "Yes":
          this.connectRemotely()
          break;
        case "No":
          this.connectLocally()
          break
        case "Auto":
          this.loadLogicXML()
              .then(res => {
                if (!res) {
                  this.connectRemotely()
                }
              })
         break
        default:
          console.log(this.settings.network.remoteMode, 'default')
      }
			this.handleSettingChange();
			// this.$store.dispatch('ws/sendMessage', {
			// 	"request":"executeShiCode",
			// 	"code": `changeSettings('mode-is-remote', '${this.settings.network.remoteMode}')`
			// });
		},
    handleSettingsPasswordChange(){
      this.handleSettingChange();
      // this.$store.dispatch('ws/sendMessage', {
      //   "request":"executeShiCode",
      //   "code": `changeSettings('password', '${this.settings.network.password}')`
      // });
    },

		//	-----

		handleLocalIpReset() {
			this.$set(this.settings.network, 'localIp', '192.168.1.125');
			this.$set(this.settings.network, 'localPort', '54441');
			this.$set(this.settings.network, 'localWebPort', '15580');
			this.$set(this.settings.network, 'remoteIp', '95.84.154.146');
			this.$set(this.settings.network, 'remotePort', '54441');
			this.$set(this.settings.network, 'webPort', '15580');
			this.handleLocalIpChange();
			this.handleRemoteIpChange();
		},
		login() {
			let user = this.users.find( user => user.name == this.username && user.password == this.password );
			if (user) {
				// console.log(user);
				this.invalidLogPass = false;
				this.$store.dispatch('modules/alerts/alert', this.$t('Succesfully logged in'))
				this.settings.user.name = user.name;
				this.settings.user.key = user.key;
				this.instantHandleSettingChange();
			} else {
				this.invalidLogPass = true;
				this.$store.dispatch('modules/alerts/alert', this.$t('Incorrect login and/or password'))
			}
		},
		logout() {
			this.settings.user.name = null;
			this.settings.user.key = null;
			this.instantHandleSettingChange();
		},
		checkLogPassValidity() {
			this.invalidLogPass = false;
		},
		openOldSettings() {
			// this.$store.dispatch('ws/sendMessage', {
			// 	"request":"executeShiCode",
			// 	"code": "openSettings()"
			// });
		}
	},
	components: {
		Header,
		FormRow
	}
};
</script>

<style lang="less" scoped>
.settings-global {
	flex: 1;
	display: flex;
	flex-direction: column;

	width: 100%;
	// max-width: 100%;
	overflow-x: hidden;
}

.port-ip-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.login-form {
	display: flex;
	flex-direction: column;
	justify-content: center;
	padding-left: 16px;
	flex: 1;
	padding-bottom: @tabBarHeight;
	padding-right: 16px;
	& > * {
		margin-top: 16px;
	}
}
.logout {
	margin-top: 24px;
}
.username-wrap {
	text-align: center;
	margin-top: 16px;
	font-size: 12px;
	.username {font-size: 24px;}
}
.avatar {
	width: 128px;
	height: 128px;
	background: #ccc;
	margin-top: 24px;
	border-radius: 50%;
	margin-left: auto;
	margin-right: auto;
}
.presetbar {
	margin-left: -16px;
	margin-right: -16px;
	padding: 8px 16px;
	padding-top: 0;
	border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.header {
	// display: block;
	display: flex;
	flex-direction: column;
	align-items: stretch;
	height: auto;
	padding-top: 8px;
	padding-left: 0;
	padding-right: 0;
}
.tabs-content {
	padding: 104-46px 16px 120px 16px;

	flex: 1;
	display: flex;
	flex-direction: column;
	// padding: 106-64px 16px 16px;
}
.form-row {
	grid-template-columns: 130px 1fr;
}

@media (min-width: @phones) {
	.presetbar {
		margin-left: 0;
		margin-right: 0;
	}
	.tabs-content {
		padding: 104px 16px 16px;
	}
}
</style>