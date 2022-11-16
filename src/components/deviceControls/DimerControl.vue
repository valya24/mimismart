<template>
	<div class="dimer-control controls-body"
		:class="{ 'on': +dimmerLamp.active }">
		<div class="big-icon-control">
			<icon-comp :iconName="'icon-' + icon"
				@click.native="handleToggle" />
			<div class="slider">
				<Brightness :min="1" :max="255"
					:value="dimmerLamp.bright"
					:gray="!+dimmerLamp.active"
					@change="val => handleChange(val)"/>
			</div>
		</div>
		<div class="controls-footer hbox just-cn">
			<div class="col-switch vbox alic"
				@click="handleToggle(+dimmerLamp.active)">
				<div class="label">{{ +dimmerLamp.active ? $t('On_1') : $t('Off_1') }}</div>
				<app-switch :checked="+dimmerLamp.active" />
			</div>
		</div>
	</div>
</template>

<script>
import Brightness from "@/components/controls/Brightness";
import {mapActions, mapGetters} from "vuex";
import {hexToDecimal} from "@/utils/transformers";
import {debounce} from "@/utils/functions";

export default {
	props: {
    addr: String,
		active: Boolean,
		brightness: Number,
		icon: {
			type: String,
			default: 'dimer-lamp'
		}
	},
  data: () => ({
    roomId: null
  }),
  mounted() {
    this.roomId = this.$route.params.id
    this.subscribeRequest(this.addr)
  },
  watch: {
    sensorDevice: {
      deep: true,
      handler(val) {
        if (val.addr === this.addr) {
          const dimmerLampData = {
            addr: this.addr,
            active: val.status.slice(1, 2),
            bright: Math.ceil(hexToDecimal(`00${val.status.slice(2, 4)}`, this.icon))
          }
          // this.brightness = Math.ceil(hexToDecimal(`00${val.status.slice(2, 4)}`, this.icon))
          this.$store.commit('setDimmerLampData', dimmerLampData);
        }
      }
    }
  },
  computed: {
    ...mapGetters(['dimmerLamp']),
    ...mapGetters('ws', ['sensorDevice']),
  },
  methods: {
    ...mapActions('modules/settings', ['subscribeRequest']),
    async handleToggle(value) {
      await this.$emit('toggle', value ? '00' : '01')
      const addrs = this.$store.getters.getRoomItems(this.roomId);
      await this.subscribeRequest(addrs.map(addr => addr.attributes.addr))
    },
    handleChange: debounce(function (value) {
      this.brightness = Math.round(value)
      this.$emit('change', this.brightness)
    }, 300),
  },
	components: {
		Brightness
	}
};
</script>

<style lang="less" scoped>
.slider {
	width: 230px;
}
</style>