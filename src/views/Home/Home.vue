<template>
	<div>
		<!-- <transition-group :name="transitionName" tag="div" >
      <router-view name="header" :key="$route.name"></router-view>
      <router-view class="child-view" :key="$route.name == 'Home' ? 'home' : 'room'"></router-view>
		</transition-group>-->
		<transition :name="transitionName" tag="div">
			<router-view name="header" :key="$route.name"></router-view>
		</transition>
		<transition :name="transitionName" tag="div">
			<keep-alive include="HomeMain">
				<router-view class="child-view" :key="$route.name == 'Home' ? 'home' : 'room'"></router-view>
			</keep-alive>
		</transition>
	</div>
</template>

<script>
export default {
	data() {
		return {
			transitionName: "slide-left"
		};
	},
	beforeRouteUpdate(to, from, next) {
		// console.log('to -- ', to);
		// console.log('from -- ', from);
		if (from.name == "Home" || to.name == "ChangeRoomPhoto") {
			this.transitionName = "slide-left";
		} else if (to.name == "Home" || from.name == "ChangeRoomPhoto") {
			this.transitionName = "slide-right";
		} else if (to.name == "HomeRoom" && from.name == "HomeRoom") {
			this.transitionName = "";

			// let fromId = from.params.id;
			// let toId = to.params.id;
			// let toIndex, fromIndex;
			// // console.log(fromId, toId);
			// let currentArea = this.$store.getters.getAreaById(fromId);
			// currentArea.area.forEach( (room, i) => {
			//   if (room.$.id == fromId) fromIndex = i;
			//   if (room.$.id == toId) toIndex = i;
			// });

			// // console.log(fromIndex, toIndex);
			// this.transitionName = toIndex < fromIndex ? 'slide-right' : 'slide-left'
		}
		next();
	}
};
</script>

<style lang="less">
.header {
	transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
}
.child-view {
	// position: absolute;
	// height: 100%;
	min-height: calc(100vh - 46px);
	width: 100%;
	max-width: 100%;
	transition: all 0.3s cubic-bezier(0.55, 0, 0.1, 1);
	// padding-bottom: 56+16px;
	// padding-bottom: 16px;
	&.slide-left-enter,
	&.slide-right-leave-active,
	&.slide-left-leave-active,
	&.slide-right-enter {
		position: absolute;
	}
}
.slide-left-enter,
.slide-right-leave-active {
	// opacity: 0;
	-webkit-transform: translate(100%, 0);
	transform: translate(100%, 0);
}
.slide-left-leave-active,
.slide-right-enter {
	// opacity: 0;
	-webkit-transform: translate(-100%, 0);
	transform: translate(-100%, 0);
}
// .slide-left-enter-to, .slide-right-enter-to,
// .slide-left-leave-to, .slide-right-leave-to,
// .slide-left-leave, .slide-right-leave {
// }
</style>