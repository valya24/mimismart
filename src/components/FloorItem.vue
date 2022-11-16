<template>
  <div class="floor">
    <div class="floor-title">{{ floorData.attributes.name }}</div>
    <div class="floor-rooms alic">
      <floor-room-item
        v-for="room in filteredRooms"
        :key="room.__.id"
        :data="{
          name: room.attributes.name,
          amount: filteredRoomItems(room.__.id).length,
          sensorsAddrs: room.__.sensors,
          image: room.attributes.image
        }"
        @click.native="$router.push(`/home/room/${room.__.id}`)"
      />
    </div>
  </div>
</template>

<script>
import FloorRoomItem from "@/components/FloorRoomItem";

export default {
  props: {
    floorData: Object
  },
  data() {
    return {
      
    }
  },
  computed: {
    showSystem() {
			return this.$store.state.modules.settings.interface.showSystem;
    },
    user() {
      return this.$store.state.modules.settings.user;
    },
    
    filteredRooms() {
      let roomArr = this.floorData.elements
        .filter( el => el.name == "area" )
        .filter( room => {
          if (room.__.permissions) {
            let viewBool = room.__.permissions['*'].view;
            if (this.user.key) {
              viewBool = viewBool || room.__.permissions[this.user.key].view;
            }
            return viewBool;
          } else {
            return true;
          }
        })

			if (!this.showSystem) {
				return roomArr.filter( room => room.attributes.system != "yes" && room.attributes.system != "true" );
			} else {
				return roomArr;
			}
		},
    
  },
  methods: {
    getRoomItems(roomId) {
			return this.$store.getters.getRoomItems(roomId);
		},
		filteredRoomItems(roomId) {
			return this.getRoomItems(roomId).filter( item => this.showSystem ? true : item.attributes.system != "yes" );
		},
  },

  components: {
		"floor-room-item": FloorRoomItem,
  }
}
</script>

<style lang="less" scoped>
.floor-title {
	color: @floorTitleTextColor;
	font-size: @floorTitleTextSize;
	text-transform: uppercase;
	padding-left: 16px;
	font-weight: bold;
}
.floor {padding-top: 24px;}
.floor-rooms {
	padding: 16px 4px;
	overflow: auto;
	white-space: nowrap;

	// iOS inertial scroll
	overflow-x: scroll;
	-webkit-overflow-scrolling: touch;
	& > div {
		margin-left: 12px;
		margin-right: 12px;
	}
}
</style>