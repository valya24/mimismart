<template>
	<div class="home">
		<Header v-if="false">Мой дом</Header>
		<!-- If less than 6 add class .just-cn -->
		<div class="devices-by-category hbox alic" :class="isIos ? 'ios-paddings' : ''">
			<device-category-item
				v-for="(group, key) in deviceGroups"
				:key="key"
				:icon="group.icon"
				:name="$t(group.name)"

				@click="$router.push(`/home/category/${key}`)"
			/>
		</div>
		
		<div class="sec-floors">
			<floor-item v-for="floor in filteredFloors" :key="floor.__.id"
				:floorData="floor" />

			<floor-item v-for="floor in systemFloors" :key="floor.__.id"
				:floorData="floor" />
		</div>
	</div>
</template>

<script>
import Header from "@/components/Header.vue";
import DeviceCategoryItem from "@/components/DeviceCategoryItem";
import FloorItem from "@/components/FloorItem";
import {isPlatform} from "@ionic/vue";

export default {
	name: "HomeMain",
	data() {
		return {
      isIos: null,
    };
	},
  created() {
    this.isIos = isPlatform('ios')
  },
  computed: {
		showSystem() {
			return this.$store.state.modules.settings.interface.showSystem;
		},
		user() {
      return this.$store.state.modules.settings.user;
    },
		floors() {
			return this.$store.state.floors;
		},
		visibleFloors() {
			return this.floors.filter( floor => {
				if (floor.__.permissions) {
					let viewBool = floor.__.permissions['*'].view;
					if (this.user.key) {
						viewBool = viewBool || floor.__.permissions[this.user.key].view;
					}
					return viewBool;
				} else {
					return true;
				}
			});
		},
		filteredFloors() {
			return this.visibleFloors
				.filter(floor => floor.attributes.system != "yes" && floor.attributes.system != "true" && this.filterRooms(floor).length );
		},
		systemFloors() {
			return this.showSystem ? this.visibleFloors.filter( floor => floor.attributes.system == "yes" || floor.attributes.system == "true" ) : [];
		},
		deviceGroups() {
			return this.$store.state.groups;
		},		
	},
	methods: {
		filterRooms(floor) {
			let roomArr = floor.elements.filter( el => el.name == "area" );

			if (!this.showSystem) {
				return roomArr.filter( room => room.attributes.system != "yes" && room.attributes.system != "true" );
			} else {
				return roomArr;
			}
		}
	},
	components: {
		Header,
		"device-category-item": DeviceCategoryItem,
		"floor-item": FloorItem,
	}
};
</script>

<style lang="less" scoped>
.ios-paddings {
  padding: 40px 4px 16px;
}
.devices-by-category {
	// iOS inertial scroll
	overflow-x: scroll;
	-webkit-overflow-scrolling: touch;
}
.home {
	// padding-bottom: 56+16px;
	padding-bottom: 120px;
	display: flex;
	flex-direction: column;
	// align-items: center;
}
.sec-text-blocks {
	padding-left: 16px;
	padding-right: 16px;
	margin-top: 24px;
}
.sec-cams {
	padding-left: 16px;
	padding-right: 16px;
	margin: 24px 0;
}

.sec-floors {
	//margin-top: 24px;
}

@media (min-width: @phones) {
	.devices-by-category {
		width: auto;
		margin-left: auto;
		margin-right: auto;
		// background-color: #f2f;
	}
}
</style>