<template>
  <Header>
    <router-link v-for="room in rooms" :key="room.__.id"
      :to="`/home/room/${room.__.id}`">
      {{ room.attributes.name }}
    </router-link>

    <BtnIcon class="room-settings" :class="isIos ? 'ios-style' : ''" icon="icon-tuning"
      @click.native="handleToggleSettings"/>
    
    
    <div class="overlay"></div>

    <DropdownList
			:items="settingsMenuItems"
      :expanded="showSettingsDropdown"
      :alignRight="true"
      :menu="true"
      :emitKey="'path'"
      @selectMode="handleSettingsDropdownSelect"
    />
  </Header>
</template>

<script>
import Header from "@/components/Header.vue";
import BtnIcon from "@/components/buttons/BtnIcon.vue";

import DropdownList from "@/components/etc/DropdownList.vue";
import {isPlatform} from "@ionic/vue";

export default {
  data() {
    return {
      isIos: null,
      showSettingsDropdown: false,
      // settingsMenuItems: [
      //   {
      //     key: 0,
      //     name: this.$t('Change photo'),
      //     path: `${this.$route.params.id}/change-photo`,
      //     // params: 
      //   }
      // ]
    }
  },
  created() {
    this.isIos = isPlatform('ios')
  },
  computed: {
    floorId() {
      return this.$route.params.id.split('-')[0];
    },
    rooms() {
      return this.$store.getters.getFloorRooms(this.floorId);
    },
    currentRoom() {
      return this.rooms.find( room => room.__.id == this.$route.params.id );
    },
    settingsMenuItems() {
      return [
        {
          key: 0,
          name: this.$t('Change photo'),
          path: `${this.$route.params.id}/change-photo`,
          // params: 
        }
      ]
    },

    user() {
      return this.$store.state.modules.settings.user;
    },
  },
  methods: {
    handleToggleSettings() {
      if (this.currentRoom.__.permissions) {
        let viewBool = this.currentRoom.__.permissions['*'].edit;
  
        if (this.user.key) {
          viewBool = viewBool || this.currentRoom.__.permissions[this.user.key].edit;
        }

        if (!viewBool) {
          this.$store.dispatch('modules/alerts/userEditPermissionAlert');
          return;
        }
      }

      this.showSettingsDropdown = !this.showSettingsDropdown;
    },
    handleSettingsDropdownSelect(item) {
      this.$router.push(item);
    }
  },
  components: {
    Header,
    BtnIcon,
    DropdownList
  }  
}
</script>

<style lang="less" scoped>
.theme-dark {
  .overlay {
    background: linear-gradient(270deg, @colorBgDark300 0%, rgba(255, 255, 255, 0) 100%);
  }
  .router-link-active {color: #fff !important;}
}
.header {
  z-index: 102;
}
.router-link-active {
	color: @colorMain !important;
	font-weight: bold;
}
.room-settings {
	position: absolute;
  right: 0;
  z-index: 2;
}
.ios-style {
  margin-top: 32px;
}
.overlay {
	background: red;
	width: 100px;
	position: absolute;
	right: 0;
	height: 100%;
	background: linear-gradient(270deg, #ffffff 0%, rgba(255, 255, 255, 0) 100%);
}
.dropdown-list {
  position: absolute;
  right: 11px;
  top: 46px;
  font-weight: normal;
  text-transform: none;
  color: #000;
  
}
.dropdown-list-item__name {
  font-size: 14px;
  color: #000;
  white-space: nowrap;
  margin-right: 0;
}
</style>